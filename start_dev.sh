#!/bin/bash

docker run --rm -v "$PWD:/app" --env ROS_MASTER_URI=http://192.168.2.104:11311 --env ROS_IP=192.168.2.66 --network=host frankjoshua/ros-sabertooth-2x32-usb