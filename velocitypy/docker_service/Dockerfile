FROM python:2.7.12
ADD . /docker_service
WORKDIR /docker_service
RUN  python -m pip install virtualenv
RUN  python -m pip install --upgrade pip
RUN  python -m pip install grpcio --ignore-installed
RUN  python -m pip install grpcio-tools
RUN  python -m pip install tensorflow
RUN  python -m pip install pymongo
RUN python -m pip install docker-py
CMD ["python", "greeter_server.py"]
