#!/bin/bash
docker run --rm --env ROS_MASTER_URI=http://192.168.2.82:11311 --env ROS_IP=192.168.2.66 frankjoshua/ros-sabertooth-usb
