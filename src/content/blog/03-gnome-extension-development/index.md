---
title: "Setting up your Gnome Extension Development Environment"
description: "An easy and replicatable way to setup your gnome extension development env."
date: "Jul 19 2024"
---

![Gnome Website](https://media.dev.to/cdn-cgi/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fhs0oykjy54lq8lj71n6d.png)

When I first thought of developing a gnome extension I thought it would be as simple as all the other web projects I did before. Start the project with vite then develop using visual studio code and see changes in real time when you change your code. But it was more complicated than that.

I faced two difficult problems (as a beginner for this kind of development) during this journey.

- Finding a good starter template with typescript
- Hot reloading the extension when I change the source code in my IDE

After some digging I got an active forum in [matrix](https://matrix.org/) called [extensions-gnome](https://app.element.io/#/room/#extensions:gnome.org). I relentlessly asked so many questions to the members until I get what I need and finally I was able to have a good dev environment.

Today I want to take you on that journey where I went to have a good development environment when developing extensions for gnome. However, bear in mind that I am just a beginner in this topic and there may be better ways to do what I wanted to do. I wrote this for beginners like me who want to go from 0 to gnome-extension hero 🙂🙂 with simple reproducible steps.

So, for the first problem, I got a simple solution when I was bombarding the matrix room with questions. It was a CLI tool that you can use without installing anything. Here it is:

1. **Scaffolding the Extension**

```sh
npm create gnome-extension@latest
```

![Terminal](https://i.postimg.cc/XYWxsrH6/Pasted-image-20240719220752.png)

It will ask you some questions and finally create the extension for you. This is the GitHub repository for the project, if you want to check it out for yourself. [create-gnome-extension](https://github.com/Leleat/create-gnome-extension). This tool gives you a basic extension that you can build and install in your system. But hang in there don't build it yet, there is more configuration.

2. **Hot Reloading**

This one was a lot more challenging and took me a couple of days to figure out. The main reason that makes it difficult was that when you change something in you extension and try to apply the latest changes to the running extension for testing, you are actually changing the gnome-shell. Changing the gnome-shell means it has to be restarted so that the changes can take effect and this is only possible by logging out and logging in again to the system. Imagine doing this every time you change something in your code. That would be a total waste of time and disruption of your workflow. The Solution involves virtual machines for testing the running extensions and debugging.

Let's split it the solution into two sub sections.

2.1 **Setting Up a Virtual Machine**

This one is pretty straight forward. Download an OS of your choice and set it up as a Virtual Machine. For instance I used Gnome Boxes to setup a **Fedora 40 Guest OS**

The Guest OS should be configured the following way.

- Make the default display server x11/Xorg. In the login screen head to the right bottom corner and click the settings button. This is because gnome-shell restart without logging out and logging in is not possible in wayland.

![Display Server](https://i.postimg.cc/DzjgfB27/Pasted-image-20240719225415.png)

- Install [Unsafe Mode Menu](https://github.com/linushdot/unsafe-mode-menu)

This is because the gnome-shell restart needs gnome unsafe mode to be enabled to work correctly.

- Install [Extension Manager](https://flathub.org/apps/com.mattjakeman.ExtensionManager) or using the terminal

This is to check your extensions, debug them and more.

```sh
Ubuntu
sudo apt install gnome-shell-extension-manager

Fedora
sudo dnf instlal gnome-shell-extension-manager
```

- Finally, install node because you gonna need it for the extension development. (yeah I know, but you need node in the Guest OS too !!)

```sh
Ubuntu
sudo apt install nodejs

Fedora
sudo dnf install nodejs
```

2.2 **Sharing the extension dev folder between the Host and Guest OS**

Now that you have your VM setup, you need to be able to install the extension in this Guest OS for debugging purposes. And also change something in your code in the host machine and see the changes in the extension installed on the guest os right away. For this to work we need these packages

- [sshfs](https://github.com/libfuse/sshfs) - allows us mount a remote filesystem using SFTP
- ssh - allows us to have remote access to a computer
  Install these packages for your distro both in the host machine and the guest os. And also check whether ssh service is running in both the host machine and the guest os.

So, what we are going to do is, mount a folder from the host machine to the guest os using sshfs. But before this check whether you can ssh into the guest os from the host machine and vice versa. You can use the following command

```sh
ssh username@ipaddress

# For example I use

ssh lix@192.168.124.167 -> from host to guest-os
ssh jd@192.168.124.1 -> from guest-os to host
```

After you make sure the above commands work correctly you can continue to mount you extension directory to the guest os using the following command which uses sshfs. (You run this command in the Guest OS Terminal)

```sh
sshfs username@host_ipaddress:/path/to/the/extension/dev/folder /mount/directory/in/the/guestos

# For example I use

sshfs jd@192.168.124.1:/home/jd/JDrive/Projects/TYPESCRIPT/gnome-extensions /mnt/host
```

This command will mount your extension development folder into the directory you choose in the guest os. After that you can execute commands like rebuild and reload gnome-shell while you are editing the source code in the host machine.

That's it. You are done 🙂🙂. Now all you need is one magical command to run everytime you change something in the source code.

```sh
npm run build:dev
```

You need to run this command in the guest os inside the shared folder (which we mount earlier) and it will rebuild the extension, install it in the guest os and also reload the gnome-shell within 2–3 seconds. What a relief !!

This is my dev environment (in the host machine) and the Guest OS. . .

![Dev Environment](https://i.postimg.cc/sXMJM7X7/Pasted-image-20240719233454.png)

![VM](https://miro.medium.com/v2/resize:fit:720/format:webp/1*Vw2LGjHLvEB2axkm8Zw33A.png)

As you can see I am in the host machine (My main machine) and in the second terminal I ssh into the guest os. So, while I am inside visual studio code I can rebuild the extension installed in the guest os and also reload the gnome-shell of the guest os.

If you happen to know anyway to persist mount during reboots, I will be happy to listen and learn.

Finally, If this helps you setup your environment don’t forget to clap and also if you have any feedback don’t hesitate to put it in the comment section.

#gnome #extensions #virtualmachine #ssh
