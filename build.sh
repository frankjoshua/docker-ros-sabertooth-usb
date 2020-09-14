#!/bin/bash
ARCH=`uname -m`
docker build . -t frankjoshua/ros-sabertooth-usb:$ARCH
