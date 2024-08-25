---
title: "Demystifying the power button on your computer."
description: "What exactly happens when you press the power button on your computer?"
date: "Dec 05 2022"
---

Have you wondered what happens when you press the power button on our computer? How does a computer begin in an off state and then be in an active state in 15 seconds? It would be amazing to know every step a computer takes to turn on and be fully functional.

That’s what we are going to be researching today.

> What exactly happens when you press the power button on your PC?

![Computer power button](https://miro.medium.com/v2/resize:fit:720/format:webp/0*CHaF_0FJOVoTMPrn)

- To understand the whole process let’s divide it into subtopics.

---

## 1. Power

Every component of our computer needs electricity to operate. So, for this purpose there is a component called Power Supply that handles this process. It receives power from a DC, AC or if we have a laptop our battery will do the same thing. They distribute the power among the components of the PC. Here the power that is being distributed is going to be checked whether it's the right amount or not. After everything got power, the CPU tries to load a program called BIOS which is found in ROM.

---

## 2. ROM, POST and BIOS

- let’s see each of them separately

### I. ROM

- ROM is an abbreviation of Read Only Memory, when we were learning about it, I didn’t get what its used for until now. When I am learning I like to relate new things with the things I know before. But for this one I couldn’t relate it at all.
- So related to our topic, what ROM is used for is to store this program we called BIOS earlier. Since its read only memory its contents will be there anytime and can't be overwritten.
- Additionally, it is hardwired in the motherboard, and it comes loaded with the BIOS which the manufacturers of the motherboard will be responsible for.

### II. BIOS

- BIOS stands for **Basic Input Output System**. So, this piece of software is stored on a small memory chip (the ROM as I mentioned before).
- We can say BIOS is the first software to run after we press that power button. But what is its use in the process that we are talking now?
- It contains a set of instructions waiting to be executed once we press that power button. The first instruction to be executed is called POST. And it loads configuration settings from a special place called CMOS battery (It is here that your clock is ticking by the way).

### III. POST

- POST stands for **Power On Self Test**. What this thing basically do is check all the components (RAM, Hard drive and other Input Output devices) in the motherboard whether they are working correctly or not. This is because it's at this point we have to know if something is not working among the components. Here if there is a failure, it will tell us using different kinds of beep sounds. And like the morse code these beep sounds have their own meaning, maybe you encounter them before. 
- It achieves this checking stage by sending signals using the System Bus to the components. So, if all the components are functioning normally the next step begins. Here let’s talk about BIOS a little bit.
- The BIOS is currently in control of everything at this point, so after the POST is over it grants the CPU to have access to all the hardware components that are connected to the motherboard. Hence, the CPU tries to access a startup code which is usually (There is a reason I said usually but that is for another article.) found in the **hard drive**. This startup code is called **The Boot Code**.
- Now that all the hardware is operating in our motherboard, the next step will be booting up the software.

---

## 3. The Boot Code

So, before we talk about the **Boot Code** we have to have a base knowledge about the **MBR**. What is MBR?

First **MBR** stands for **Master Boot Record**. It is a small piece of code responsible for loading the OS on your computer. It also contains information about the partitions on your hard drive and how they lay out.  

We said BIOS is found in a ROM chip which is hardwired in the motherboard if you remember, so where is the MBR located?

The MBR is located in the **first sector of your hard drive** which is **Sector 0**. (If you are wondering what sector is, I got you. Sector is the smallest physical storage unit of a hard drive, and it is fixed to store 512 bytes of data.) 

![Inside the Hard Disk](https://miro.medium.com/v2/resize:fit:640/format:webp/1*p8kG5E2HsR8VCQUslHbk2w.png)

Now let’s continue where we left off. We stopped when the CPU tries to access this Boot Code which is found in the hard drive. Actually, this Boot Code is not found alone. That’s why I tried to explain what MBR is. It turns out Boot Code (446 bytes) is one of the three main parts of the MBR. The other two parts are The partition table (64 bytes) and The MBR signature ( 2 bytes).

We now know what a Boot Code and MBR are, so we can proceed to the next step. The next step will be the CPU loading this MBR to the memory (RAM) to run it. Here, after the CPU runs the Boot Code it will try to find where the installed OS is found in the partitions of our hard drive.

Once it finds the OS files it will load them to RAM to run them. And then the OS will take control of the system starting from now. At this point the OS will tell the CPU to run a bunch of background services and device drivers which will run in the background these background services include:

- Windows services (If you are using windows)
- Different processes
- Desktop environments

Finally, you will be asked to enter your password. Voila !! your PC booted up successfully!!

---

### Resources

https://youtu.be/C_xxra5HMz0

https://www.youtube.com/watch?v=B8_oQ3cU5FI&t=728s

https://www.youtube.com/watch?v=HzbpT67S1jo

https://medium.com/@Ayushverma8/what-exactly-happens-when-you-press-the-power-button-on-pc-7c781050b83e

https://www.howtogeek.com/398493/what-exactly-happens-when-you-turn-on-your-computer/

https://www.ami.com/blog/2018/02/05/what-happens-when-you-press-the-power-button/

https://youtu.be/3KcpWxbhzr8

https://www.easeus.com/diskmanager/master-boot-record.html

#OperatingSystems #SystemsProgramming #Curiosity #SoftwareEngineering

