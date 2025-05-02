#!/usr/bin/env python3

"""
This script uploads images to Cloudinary and updates the markdown files with the new URLs.

Requirements:
    - cloudinary
    - frontmatter
    - python-dotenv

Usage:
    ./upload_images.py

Or Using 'UV' and make:
    make image

The script will load environment variables from a .env file in the project root.
Required variables: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
"""

import os
import time
import re
import frontmatter  # type: ignore
import cloudinary
import cloudinary.uploader
import subprocess
import tempfile
import shutil
from pathlib import Path
from typing import List, Dict, Tuple, Optional
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME", "YOUR_CLOUD_NAME"),
    api_key=os.environ.get("CLOUDINARY_API_KEY", "YOUR_API_KEY"),
    api_secret=os.environ.get("CLOUDINARY_API_SECRET", "YOUR_API_SECRET"),
)

# Regular expression to find Markdown image links ![alt](path)
IMAGE_LINK_PATTERN = r"!\[.*?\]\((static[^)]+)\)"


def is_ffmpeg_available() -> bool:
    """Check if ffmpeg command is available in PATH."""
    return shutil.which("ffmpeg") is not None


def convert_video_to_gif(video_path: Path) -> Optional[Path]:
    """
    Convert a video file to a high-quality GIF using ffmpeg's 2-pass method.

    Args:
        video_path: Path to the input video file.

    Returns:
        Path to the generated GIF file, or None if conversion failed.
    """
    if not video_path.exists():
        print(f"Error: Video file not found: {video_path}")
        return None

    try:
        # Create temporary files for palette and output GIF
        with (
            tempfile.NamedTemporaryFile(suffix=".png", delete=False) as palette_file,
            tempfile.NamedTemporaryFile(suffix=".gif", delete=False) as gif_file,
        ):
            palette_path = Path(palette_file.name)
            output_gif_path = Path(gif_file.name)

        print(f"Generating palette for {video_path}...")
        # Step 1: Generate palette
        ffmpeg_cmd1 = [
            "ffmpeg",
            "-i",
            str(video_path),
            "-vf",
            "fps=15,scale=720:-1:flags=lanczos,palettegen",
            "-y",
            str(palette_path),
        ]
        result1 = subprocess.run(
            ffmpeg_cmd1, capture_output=True, text=True, check=False
        )
        if result1.returncode != 0:
            print(f"Error generating palette: {result1.stderr}")
            os.remove(palette_path)
            os.remove(output_gif_path)  # Also remove gif stub
            return None

        print(f"Converting {video_path} to GIF...")
        # Step 2: Create GIF using palette
        ffmpeg_cmd2 = [
            "ffmpeg",
            "-i",
            str(video_path),
            "-i",
            str(palette_path),
            "-filter_complex",
            "fps=15,scale=720:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=sierra2:diff_mode=rectangle",
            "-y",  # Overwrite output file if it exists
            str(output_gif_path),
        ]
        result2 = subprocess.run(
            ffmpeg_cmd2, capture_output=True, text=True, check=False
        )

        os.remove(palette_path)

        if result2.returncode != 0:
            print(f"Error converting video to GIF: {result2.stderr}")
            os.remove(output_gif_path)
            return None

        print(f"Successfully created GIF: {output_gif_path}")
        return output_gif_path

    except Exception as e:
        print(f"An unexpected error occurred during conversion: {e}")
        if "palette_path" in locals() and os.path.exists(palette_path):
            os.remove(palette_path)
        if "output_gif_path" in locals() and os.path.exists(output_gif_path):
            os.remove(output_gif_path)
        return None


def scan_directories(base_path: str) -> List[Path]:
    """
    Scan the blog and projects directories for markdown files.

    Args:
        base_path: Base path of the project

    Returns:
        List of Path objects for each markdown file
    """
    md_files = []

    blog_dir = Path(base_path) / "src" / "content" / "blog"
    for subdir in blog_dir.iterdir():
        if subdir.is_dir():
            for file in subdir.glob("*.md"):
                md_files.append(file)

    projects_dir = Path(base_path) / "src" / "content" / "projects"
    for subdir in projects_dir.iterdir():
        if subdir.is_dir():
            for file in subdir.glob("*.md"):
                md_files.append(file)

    return md_files


def parse_markdown(file_path: Path) -> Tuple[str, List[str], frontmatter.Post, bool]:
    """
    Parse markdown file to extract title, images from frontmatter array or content body.

    Args:
        file_path: Path to the markdown file

    Returns:
        Tuple of (title, images_array, post_content, is_blog_post)
    """
    with open(file_path, "r") as f:
        post = frontmatter.load(f)
        content = f.read()

    title = post.get("title", "untitled")

    # Determine if this is a blog post (in blog directory) or project (in projects directory)
    is_blog_post = "blog" in str(file_path)

    images = []

    if not is_blog_post and "images" in post:
        images = post.get("images", [])

    else:
        content = str(post.content)
        matches = re.findall(IMAGE_LINK_PATTERN, content)
        images.extend(matches)

    return title, images, post, is_blog_post


def filter_images_to_upload(images: List[str]) -> List[Tuple[str, str, str]]:
    """
    Filter items (images or videos) that need to be processed (start with static).

    Args:
        images: List of asset paths from the frontmatter or content

    Returns:
        List of tuples (relative_path, local_file_path, type: 'image' or 'video')
    """
    to_process = []
    for asset_path in images:
        if asset_path.startswith("static"):
            # Convert relative path to absolute path
            local_path = asset_path
            file_ext = Path(local_path).suffix.lower()

            asset_type = "image"  # Default to image
            if file_ext == ".mp4":
                asset_type = "video"

            to_process.append((asset_path, local_path, asset_type))

    return to_process


def upload_to_cloudinary(
    base_path: str, title: str, assets_to_process: List[Tuple[str, str, str]]
) -> Dict[str, str]:
    """
    Upload images (or converted GIFs from videos) to Cloudinary and return mapping of old paths to new URLs.

    Args:
        base_path: Base path of the project
        title: Title of the content for naming
        assets_to_process: List of assets to upload (rel_path, local_path, type)

    Returns:
        Dictionary mapping original paths (including .mp4) to new Cloudinary URLs (including .gif)
    """
    timestamp = int(time.time())
    path_mapping = {}

    for i, (rel_path, local_path, asset_type) in enumerate(assets_to_process):
        clean_title = title.lower().replace(" ", "-")
        full_path = Path(base_path) / local_path
        public_id = f"{clean_title}-{timestamp}-{i + 1}"

        upload_path: Optional[Path] = None
        temp_gif_path: Optional[Path] = None
        resource_type = "image"  # Default to image, as GIFs are images

        if not full_path.exists():
            print(f"Warning: Asset file not found: {full_path}")
            continue

        if asset_type == "video":
            print(f"Processing video file: {full_path}")
            temp_gif_path = convert_video_to_gif(full_path)
            if temp_gif_path and temp_gif_path.exists():
                upload_path = temp_gif_path
                print(f"Prepared GIF for upload: {upload_path}")
            else:
                print(f"Skipping video {rel_path} due to conversion failure.")
                continue
        else:
            upload_path = full_path

        if not upload_path:
            print(f"Error: No valid path determined for upload for {rel_path}.")
            if temp_gif_path and temp_gif_path.exists():
                os.remove(temp_gif_path)
            continue

        try:
            print(
                f"Uploading {upload_path} (from original: {rel_path}) to Cloudinary..."
            )
            result = cloudinary.uploader.upload(
                str(upload_path),
                public_id=public_id,
                resource_type=resource_type,
                overwrite=True,
                folder="portfolio",
            )

            path_mapping[rel_path] = result["secure_url"]
            print(f"Uploaded: {rel_path} ({asset_type}) → {result['secure_url']}")

        except Exception as e:
            print(f"Error uploading {upload_path}: {e}")
        finally:
            if temp_gif_path and temp_gif_path.exists():
                try:
                    os.remove(temp_gif_path)
                    print(f"Cleaned up temporary file: {temp_gif_path}")
                except OSError as e:
                    print(f"Error cleaning up temp file {temp_gif_path}: {e}")

    return path_mapping


def update_markdown(
    file_path: Path,
    post: frontmatter.Post,
    path_mapping: Dict[str, str],
    is_blog_post: bool,
) -> bool:
    """
    Update the markdown file with new Cloudinary URLs.

    Args:
        file_path: Path to the markdown file
        post: The frontmatter Post object
        path_mapping: Mapping of original paths to new URLs
        is_blog_post: Whether this is a blog post or a project

    Returns:
        True if file was updated, False otherwise
    """
    updated = False

    if is_blog_post:
        # For blog posts, we need to replace the image links in the content
        content = str(post.content)

        # Replace each image path in the content
        for old_path, new_url in path_mapping.items():
            # Replace ![alt](old_path) with ![alt](new_url)
            pattern = r"!\[(.*?)\]\(" + re.escape(old_path) + r"\)"
            replacement = r"![\1](" + new_url + r")"
            new_content = re.sub(pattern, replacement, content)

            if new_content != content:
                content = new_content
                updated = True

        if updated:
            post.content = content
    else:
        # For projects, update the images array in frontmatter
        if "images" in post:
            # Get the current images array
            current_images = post["images"]
            # Make sure it's a list
            if not isinstance(current_images, list):
                current_images = [current_images]

            # Create a new images array
            new_images = []
            for img in current_images:
                if img in path_mapping:
                    new_images.append(path_mapping[img])
                    updated = True
                else:
                    new_images.append(img)

            # Update the post with the new images array
            post["images"] = new_images

    if updated:
        with open(file_path, "w") as f:
            f.write(frontmatter.dumps(post))
        print(f"Updated: {file_path}")

    return updated


def main():
    if os.environ.get("CLOUDINARY_CLOUD_NAME") == "YOUR_CLOUD_NAME":
        print("Error: Cloudinary credentials not configured.")
        print(
            "Please set the CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in the .env file"
        )
        return

    if __file__.endswith("upload_images.py"):
        base_path = Path(__file__).parent.parent
    else:
        base_path = Path.cwd()

    md_files = scan_directories(base_path)
    print(f"Found {len(md_files)} markdown files.")
    print("Looking for images or videos with 'static' prefix in your markdown files...")

    total_uploads = 0
    total_updates = 0
    found_video = False

    # Pre-scan for videos to check for ffmpeg early
    for file_path in md_files:
        _, assets, _, _ = parse_markdown(file_path)
        assets_to_process = filter_images_to_upload(assets)
        for _, _, asset_type in assets_to_process:
            if asset_type == "video":
                found_video = True
                break
        if found_video:
            break

    if found_video and not is_ffmpeg_available():
        print("\nError: Found .mp4 files to process, but ffmpeg command is not found.")
        print("Please install ffmpeg and ensure it is in your system's PATH.")
        return

    for file_path in md_files:
        print(f"\nProcessing {file_path}...")
        title, assets, post, is_blog_post = parse_markdown(file_path)

        assets_to_process = filter_images_to_upload(assets)

        if not assets_to_process:
            print("No static assets found in this file.")
            continue

        print(f"Found {len(assets_to_process)} assets to process.")

        path_mapping = upload_to_cloudinary(base_path, title, assets_to_process)
        total_uploads += len(path_mapping)

        if path_mapping:
            updated = update_markdown(file_path, post, path_mapping, is_blog_post)
            if updated:
                total_updates += 1
        else:
            print("No assets were successfully uploaded for this file.")

    print("\nSummary:")
    print(f"- Total files processed: {len(md_files)}")
    print(f"- Total assets uploaded (images/GIFs): {total_uploads}")
    print(f"- Total files updated: {total_updates}")


if __name__ == "__main__":
    main()
