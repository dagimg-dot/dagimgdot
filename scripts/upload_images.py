#!/usr/bin/env python3

"""
This script uploads images to Cloudinary and updates the markdown files with the new URLs.

Requirements:
    - cloudinary
    - frontmatter
    - python-dotenv

Usage:
    ./upload_images.py

The script will load environment variables from a .env file in the project root.
Required variables: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
"""

import os
import time
import re
import frontmatter  # type: ignore
import cloudinary
import cloudinary.uploader
from pathlib import Path
from typing import List, Dict, Tuple
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME", "YOUR_CLOUD_NAME"),
    api_key=os.environ.get("CLOUDINARY_API_KEY", "YOUR_API_KEY"),
    api_secret=os.environ.get("CLOUDINARY_API_SECRET", "YOUR_API_SECRET"),
)

# Regular expression to find Markdown image links ![alt](path)
IMAGE_LINK_PATTERN = r"!\[.*?\]\((../../../../[^)]+)\)"


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


def filter_images_to_upload(images: List[str]) -> List[Tuple[str, str]]:
    """
    Filter images that need to be uploaded (start with ../../../../).

    Args:
        images: List of image paths from the frontmatter or content

    Returns:
        List of tuples (image_path, local_file_path)
    """
    to_upload = []
    for image in images:
        if image.startswith("../../../../"):
            # Convert relative path to absolute path
            local_path = image.replace("../../../../", "")
            to_upload.append((image, local_path))

    return to_upload


def upload_to_cloudinary(
    base_path: str, title: str, images_to_upload: List[Tuple[str, str]]
) -> Dict[str, str]:
    """
    Upload images to Cloudinary and return mapping of old paths to new URLs.

    Args:
        base_path: Base path of the project
        title: Title of the content for naming
        images_to_upload: List of images to upload

    Returns:
        Dictionary mapping original paths to new Cloudinary URLs
    """
    timestamp = int(time.time())
    path_mapping = {}

    for i, (rel_path, local_path) in enumerate(images_to_upload):
        clean_title = title.lower().replace(" ", "-")

        full_path = Path(base_path) / local_path

        if not full_path.exists():
            print(f"Warning: Image file not found: {full_path}")
            continue

        public_id = f"{clean_title}-{timestamp}-{i + 1}"

        try:
            # Upload to Cloudinary
            result = cloudinary.uploader.upload(
                str(full_path), public_id=public_id, overwrite=True
            )

            # Store the mapping between original path and new URL
            path_mapping[rel_path] = result["secure_url"]
            print(f"Uploaded: {full_path} → {result['secure_url']}")

        except Exception as e:
            print(f"Error uploading {full_path}: {e}")

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
            "Please set the CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables."
        )
        print("For example: export CLOUDINARY_CLOUD_NAME=your-cloud-name")
        return

    if __file__.endswith("upload_images.py"):
        base_path = Path(__file__).parent.parent
    else:
        base_path = Path.cwd()

    md_files = scan_directories(base_path)
    print(f"Found {len(md_files)} markdown files.")

    total_uploads = 0
    total_updates = 0

    for file_path in md_files:
        print(f"\nProcessing {file_path}...")
        title, images, post, is_blog_post = parse_markdown(file_path)

        images_to_upload = filter_images_to_upload(images)

        if not images_to_upload:
            continue

        print(f"Found {len(images_to_upload)} images to upload.")

        path_mapping = upload_to_cloudinary(base_path, title, images_to_upload)
        total_uploads += len(path_mapping)

        if path_mapping:
            updated = update_markdown(file_path, post, path_mapping, is_blog_post)
            if updated:
                total_updates += 1

    print("\nSummary:")
    print(f"- Total files processed: {len(md_files)}")
    print(f"- Total images uploaded: {total_uploads}")
    print(f"- Total files updated: {total_updates}")


if __name__ == "__main__":
    main()
