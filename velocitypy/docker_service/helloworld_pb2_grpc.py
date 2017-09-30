import grpc
from grpc.framework.common import cardinality
from grpc.framework.interfaces.face import utilities as face_utilities

import helloworld_pb2 as helloworld__pb2
import helloworld_pb2 as helloworld__pb2
import helloworld_pb2 as helloworld__pb2
import helloworld_pb2 as helloworld__pb2
import helloworld_pb2 as helloworld__pb2
import helloworld_pb2 as helloworld__pb2
import helloworld_pb2 as helloworld__pb2
import helloworld_pb2 as helloworld__pb2


class GreeterStub(object):
  """The greeting service definition.
  """

  def __init__(self, channel):
    """Constructor.

    Args:
      channel: A grpc.Channel.
    """
    self.SayHello = channel.unary_unary(
        '/helloworld.Greeter/SayHello',
        request_serializer=helloworld__pb2.HelloRequest.SerializeToString,
        response_deserializer=helloworld__pb2.HelloReply.FromString,
        )
    self.SayHelloAgain = channel.stream_stream(
        '/helloworld.Greeter/SayHelloAgain',
        request_serializer=helloworld__pb2.HelloRequest.SerializeToString,
        response_deserializer=helloworld__pb2.HelloReply.FromString,
        )
    self.annotate = channel.stream_stream(
        '/helloworld.Greeter/annotate',
        request_serializer=helloworld__pb2.HelloRequest.SerializeToString,
        response_deserializer=helloworld__pb2.HelloReply.FromString,
        )


class GreeterServicer(object):
  """The greeting service definition.
  """

  def SayHello(self, request, context):
    """Sends a greeting
    """
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def SayHelloAgain(self, request_iterator, context):
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def annotate(self, request_iterator, context):
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')


def add_GreeterServicer_to_server(servicer, server):
  rpc_method_handlers = {
      'SayHello': grpc.unary_unary_rpc_method_handler(
          servicer.SayHello,
          request_deserializer=helloworld__pb2.HelloRequest.FromString,
          response_serializer=helloworld__pb2.HelloReply.SerializeToString,
      ),
      'SayHelloAgain': grpc.stream_stream_rpc_method_handler(
          servicer.SayHelloAgain,
          request_deserializer=helloworld__pb2.HelloRequest.FromString,
          response_serializer=helloworld__pb2.HelloReply.SerializeToString,
      ),
      'annotate': grpc.stream_stream_rpc_method_handler(
          servicer.annotate,
          request_deserializer=helloworld__pb2.HelloRequest.FromString,
          response_serializer=helloworld__pb2.HelloReply.SerializeToString,
      ),
  }
  generic_handler = grpc.method_handlers_generic_handler(
      'helloworld.Greeter', rpc_method_handlers)
  server.add_generic_rpc_handlers((generic_handler,))


class TrainerStub(object):

  def __init__(self, channel):
    """Constructor.

    Args:
      channel: A grpc.Channel.
    """
    self.TrainModel = channel.unary_unary(
        '/helloworld.Trainer/TrainModel',
        request_serializer=helloworld__pb2.TrainModelRequest.SerializeToString,
        response_deserializer=helloworld__pb2.TrainModelReply.FromString,
        )


class TrainerServicer(object):

  def TrainModel(self, request, context):
    """Sends a greeting
    """
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')


def add_TrainerServicer_to_server(servicer, server):
  rpc_method_handlers = {
      'TrainModel': grpc.unary_unary_rpc_method_handler(
          servicer.TrainModel,
          request_deserializer=helloworld__pb2.TrainModelRequest.FromString,
          response_serializer=helloworld__pb2.TrainModelReply.SerializeToString,
      ),
  }
  generic_handler = grpc.method_handlers_generic_handler(
      'helloworld.Trainer', rpc_method_handlers)
  server.add_generic_rpc_handlers((generic_handler,))
