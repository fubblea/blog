---
tags: [computer-vision, electronics, machine-learning]
tech: [python, raspberrypi]
date-written: 04-07-2019
---

# Belt for the Visually Impaired

<Frontmatter />

As part of my high school curriculum, I opted to participate in the Extended Project Qualification which entailed design, developing, and creating a working artefact.

This project was inspired the lack of hands-free navigational devices and sought to create a device ([@fig:device-worn]) that aims to utilize the huge leaps we have made in machine learning as well as increasingly smaller and more powerful processing units.

<Figure
    src="/attachments/blind-belt/DSC_0012_JPG.jpg"
    caption="The Device being Worn"
    label="device-worn"
/>

## Design Choice

The aim of the project was to create a device that will allow the visually impaired to navigate their surroundings. The device aimed to be an accurate, hands-free replacement for a walking stick allowing the user to detect objects in their surroundings through the use of vibration feedback.

To this end, the object and environmental detection were achieved through the use of ultrasonic sensors as well as a camera. Once the machine learning algorithms detected an object, vibrations feedback was provided to the user indicating the direction and distance to the object. This was done through multiple variable-intensity vibration motors show in [@fig:vibration-motors].

<Figure
    src="/attachments/blind-belt/DSC_0025_JPG.jpg"
    caption="Vibration Motors on Belt"
    label="vibration-motors"
/>

## Raspberry Pi

The processing unit for this project was the Raspberry Pi 3B+ (RPi). The RPi is a small formfactor computer that contains all the essential components that make up a computer while being small, and therefore, portable. The RPi runs on a Linux-based operating system called Raspbian and can be programmed using Python. Therefore, it has access to powerful libraries such as OpenCV.

<Figure
    src="/attachments/blind-belt/DSC_0001_JPG.jpg"
    caption="Device Components"
    label="device-components"
/>

## Machine Learning and User Feedback

OpenCV was used to host a pre-trained MobileNet Single-Shot Multibox Detector [@ref:Liu_2016] based on the Caffe framework [@ref:jia2014caffe] (<GitHub url="https://github.com/BVLC/caffe" />). This model, alongside the two ultrasonic sensors, allowed for quick and accurate detection of objects in the surroundings. This information was then sent to three vibration motors through the use of pulse-width modulation.

<Figure
    src="/attachments/blind-belt/Schematics Combined.jpg"
    caption="Electrical Schematics"
/>

## End Results

The project lasted for eight months and was completed alongside my high-school academics. The completed project achieved an accuracy of 84.4% and succeeded in creating a handsfree device that aids the visually impaired with navigating their surrounds.

<Figure
    src="/attachments/blind-belt/DSC_0027_JPG.jpg"
    caption="Device Side View"
/>
