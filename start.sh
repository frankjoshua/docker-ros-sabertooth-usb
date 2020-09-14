#!/bin/bash
ARCH=`uname -m`
docker run --rm --env ROS_MASTER_URI=http://192.168.2.104:11311 --env ROS_IP=192.168.2.66 --network=host frankjoshua/ros-sabertooth-usb:$ARCH