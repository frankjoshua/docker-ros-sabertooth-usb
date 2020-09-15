#!/bin/bash
ARCH=`uname -m`
docker run --rm -v "$PWD:/app" --env ROS_MASTER_URI=http://192.168.2.105:11311 --env ROS_IP=192.168.2.105 --env SERIAL_PORT=/dev/ttyACM0 --env ROS_TOPIC=/pocketbot/cmd_vel --network=host --privileged frankjoshua/ros-sabertooth-usb:$ARCH
