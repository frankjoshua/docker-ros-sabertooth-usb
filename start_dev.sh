#!/bin/bash
docker run -it --rm -v "$PWD/server.js:/app/server.js" --env ROS_MASTER_URI=http://192.168.2.82:11311 --env ROS_IP=192.168.2.66 --env MOCK_SERIAL=true --env ROS_TOPIC=/pocketbot/cmd_vel frankjoshua/ros-sabertooth-usb
