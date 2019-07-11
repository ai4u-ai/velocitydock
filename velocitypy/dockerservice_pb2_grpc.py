import grpc
from grpc.framework.common import cardinality
from grpc.framework.interfaces.face import utilities as face_utilities

import dockerservice_pb2 as dockerservice__pb2
import dockerservice_pb2 as dockerservice__pb2
import dockerservice_pb2 as dockerservice__pb2
import dockerservice_pb2 as dockerservice__pb2
import dockerservice_pb2 as dockerservice__pb2
import dockerservice_pb2 as dockerservice__pb2
import dockerservice_pb2 as dockerservice__pb2
import dockerservice_pb2 as dockerservice__pb2
import dockerservice_pb2 as dockerservice__pb2
import dockerservice_pb2 as dockerservice__pb2


class DockerStub(object):

  def __init__(self, channel):
    """Constructor.

    Args:
      channel: A grpc.Channel.
    """
    self.GetServices = channel.unary_unary(
        '/dockerservice.Docker/GetServices',
        request_serializer=dockerservice__pb2.GetServicesRequest.SerializeToString,
        response_deserializer=dockerservice__pb2.GetServicesReply.FromString,
        )
    self.GetServicePorts = channel.unary_unary(
        '/dockerservice.Docker/GetServicePorts',
        request_serializer=dockerservice__pb2.GetServicePortsRequest.SerializeToString,
        response_deserializer=dockerservice__pb2.GetServicesPortsReply.FromString,
        )
    self.CreateDockerImage = channel.unary_unary(
        '/dockerservice.Docker/CreateDockerImage',
        request_serializer=dockerservice__pb2.CreateDockerImageRequest.SerializeToString,
        response_deserializer=dockerservice__pb2.CreateDockerImageReply.FromString,
        )
    self.GetServiceContainers = channel.unary_unary(
        '/dockerservice.Docker/GetServiceContainers',
        request_serializer=dockerservice__pb2.GetServiceContainersRequest.SerializeToString,
        response_deserializer=dockerservice__pb2.GetServiceContainersReply.FromString,
        )
    self.GetNextAvailiblePort = channel.unary_unary(
        '/dockerservice.Docker/GetNextAvailiblePort',
        request_serializer=dockerservice__pb2.GetNextAvailiblePortRequest.SerializeToString,
        response_deserializer=dockerservice__pb2.GetNextAvailiblePortReply.FromString,
        )


class DockerServicer(object):

  def GetServices(self, request, context):
    """Sends a greeting
    """
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def GetServicePorts(self, request, context):
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def CreateDockerImage(self, request, context):
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def GetServiceContainers(self, request, context):
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def GetNextAvailiblePort(self, request, context):
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')


def add_DockerServicer_to_server(servicer, server):
  rpc_method_handlers = {
      'GetServices': grpc.unary_unary_rpc_method_handler(
          servicer.GetServices,
          request_deserializer=dockerservice__pb2.GetServicesRequest.FromString,
          response_serializer=dockerservice__pb2.GetServicesReply.SerializeToString,
      ),
      'GetServicePorts': grpc.unary_unary_rpc_method_handler(
          servicer.GetServicePorts,
          request_deserializer=dockerservice__pb2.GetServicePortsRequest.FromString,
          response_serializer=dockerservice__pb2.GetServicesPortsReply.SerializeToString,
      ),
      'CreateDockerImage': grpc.unary_unary_rpc_method_handler(
          servicer.CreateDockerImage,
          request_deserializer=dockerservice__pb2.CreateDockerImageRequest.FromString,
          response_serializer=dockerservice__pb2.CreateDockerImageReply.SerializeToString,
      ),
      'GetServiceContainers': grpc.unary_unary_rpc_method_handler(
          servicer.GetServiceContainers,
          request_deserializer=dockerservice__pb2.GetServiceContainersRequest.FromString,
          response_serializer=dockerservice__pb2.GetServiceContainersReply.SerializeToString,
      ),
      'GetNextAvailiblePort': grpc.unary_unary_rpc_method_handler(
          servicer.GetNextAvailiblePort,
          request_deserializer=dockerservice__pb2.GetNextAvailiblePortRequest.FromString,
          response_serializer=dockerservice__pb2.GetNextAvailiblePortReply.SerializeToString,
      ),
  }
  generic_handler = grpc.method_handlers_generic_handler(
      'dockerservice.Docker', rpc_method_handlers)
  server.add_generic_rpc_handlers((generic_handler,))
