# ROS Sabertooth 2x32 usb motor driver in Docker [![](https://img.shields.io/docker/pulls/frankjoshua/ros-sabertooth-usb)](https://hub.docker.com/r/frankjoshua/ros-sabertooth-usb) [![Build Status](https://travis-ci.org/frankjoshua/docker-ros-sabertooth-usb.svg?branch=master)](https://travis-ci.org/frankjoshua/docker-ros-sabertooth-usb)

## Building

```
docker build . -t frankjoshua/ros-sabertooth-usb
```

## Running

```
docker run -p 80:3000 frankjoshua/ros-sabertooth-usb
```

## Developing code

Code is written in nodejs. Change IPs in start_dev.sh to point to your ROS master and local system. This will start a Docker container with nodejs and nodemon. If you make changes to server.js the server will restart automatically.

```
./start_dev.sh
```

## License

Apache 2.0

## Author Information

Joshua Frank [@frankjoshua77](https://www.twitter.com/@frankjoshua77)
<br>
[http://roboticsascode.com](http://roboticsascode.com)
