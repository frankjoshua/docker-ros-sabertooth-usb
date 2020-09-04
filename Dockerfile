FROM ros:noetic-ros-base

RUN apt-get update &&\
  apt-get install -y nodejs npm curl &&\
  apt-get -y clean &&\
  apt-get -y purge &&\
  rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN npm install -g n
RUN n latest

COPY . /app
WORKDIR /app

CMD ["npm", "start"]