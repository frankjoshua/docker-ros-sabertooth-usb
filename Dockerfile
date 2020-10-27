FROM ros:noetic-ros-base

RUN apt-get update &&\
  apt-get install -y nodejs npm curl git &&\
  apt-get -y clean &&\
  apt-get -y purge &&\
  rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN npm install -g n
RUN n latest

COPY . /app
WORKDIR /app

RUN rm -Rf ./node_modules 
RUN npm install

ENV ROS_NODE=sabertooth_motor
ENV ROS_TOPIC=cmd_vel

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD /ros_entrypoint.sh rosnode info $ROS_NODE || exit 1

CMD ["npm", "start"]
