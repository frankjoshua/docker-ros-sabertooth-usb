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

CMD ["npm", "start"]
