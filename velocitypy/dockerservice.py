# Copyright 2015, Google Inc.
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are
# met:
#
#     * Redistributions of source code must retain the above copyright
# notice, this list of conditions and the following disclaimer.
#     * Redistributions in binary form must reproduce the above
# copyright notice, this list of conditions and the following disclaimer
# in the documentation and/or other materials provided with the
# distribution.
#     * Neither the name of Google Inc. nor the names of its
# contributors may be used to endorse or promote products derived from
# this software without specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
# "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
# LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
# A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
# OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
# SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
# LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
# DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
# THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
# (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
# OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

"""The Python implementation of the GRPC helloworld.Greeter server."""

from concurrent import futures
import argparse
import time
import base64
import grpc
import numpy as np
import mongoclient as mongocl
import dockerManager as dockermanager
import os

import docker
import mongoclient as mongoclient
import tarfile
import io,os
import dockerservice_pb2
_ONE_DAY_IN_SECONDS = 60 * 60 * 24


class DockerService(dockerservice_pb2.DockerServicer):
    def __init__(self):
        self.client = docker.from_env()
        print 'init docker service'

    def GetServiceContainers(self, request, context):
        cl = docker.APIClient(base_url='unix://var/run/docker.sock')
        return dockerservice_pb2.GetServiceContainersReply(containers=[i['Id'] for i in cl.containers() if i['Image'] == request.servicename])




    def GetServicePorts(self, request, context):
               for service in self.client.services.list():
                    if (service.name == request.servicename):
                        for port in service.attrs['Endpoint']['Ports']:
                            return dockerservice_pb2.GetServicesPortsReply(port=str(port['PublishedPort']))




    def CreateDockerImage(self,request,context):
        mongocl.downloadModelZipped(request.zipmodelid)
        dockermanager.saveZipToContainer(request.imagename)
        return dockerservice_pb2.CreateDockerImageReply(zipmodelid=str("a'"),trainingid=str("b"))

    def GetNextAvailiblePort(self,request,cotnext):
        services = []
        client = docker.from_env()
        cl = docker.APIClient(base_url='unix://var/run/docker.sock')
        for i in client.services.list():
            for x in i.attrs['Endpoint']['Ports']:
                services.append(int(x['PublishedPort']))
        resp=sorted(services)[-1] + 1
        return dockerservice_pb2.GetNextAvailiblePortReply(port=str(resp))


def serve():
  server = grpc.server(futures.ThreadPoolExecutor(max_workers=100))
  dockerservice_pb2.add_DockerServicer_to_server(DockerService(), server)
  server.add_insecure_port('[::]:50052')
  server.start()

  try:
    while True:
      time.sleep(_ONE_DAY_IN_SECONDS)
  except KeyboardInterrupt:
    server.stop(0)

if __name__ == '__main__':

  serve()
