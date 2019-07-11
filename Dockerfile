FROM node:boron
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
RUN cd /usr/src/app


RUN \
  apt-get update && \
  apt-get install -y python python-dev python-pip python-virtualenv && \
  rm -rf /var/lib/apt/lists/*
RUN  python -m pip install virtualenv
RUN  python -m pip install --upgrade pip
RUN  python -m pip install grpcio --ignore-installed
RUN  python -m pip install grpcio-tools
RUN  python -m pip install tensorflow
RUN  python -m pip install pymongo
RUN python -m pip install docker-py
RUN python -m pip install docker
CMD  python velocitypy/dockerservice.py & python velocitypy/trainer_server.py & node vidStreamer.js






