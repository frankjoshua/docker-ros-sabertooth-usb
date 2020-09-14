#!/bin/bash

docker run --rm -v "$PWD:/app" --env ROS_MASTER_URI=http://192.168.2.105:11311 --env ROS_IP=192.168.2.105 --network=host frankjoshua/ros-sabertooth-usb:arm64
