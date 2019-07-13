# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: annotations_converter.proto

import sys
_b=sys.version_info[0]<3 and (lambda x:x) or (lambda x:x.encode('latin1'))
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
from google.protobuf import descriptor_pb2
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor.FileDescriptor(
  name='annotations_converter.proto',
  package='',
  syntax='proto3',
  serialized_pb=_b('\n\x1b\x61nnotations_converter.proto\"r\n\x11\x43onversionRequest\x12\x10\n\x08\x64\x65stpath\x18\x01 \x01(\t\x12\x13\n\x0brecord_name\x18\x02 \x01(\t\x12\r\n\x05img_w\x18\x03 \x01(\t\x12\r\n\x05img_h\x18\x04 \x01(\t\x12\x18\n\x10\x61nnotations_list\x18\x05 \x03(\t\"9\n\x10\x43onversionsReply\x12\x0e\n\x06status\x18\x01 \x01(\t\x12\x15\n\rconversion_id\x18\x02 \x01(\t2U\n\x14\x41nnotationsConverter\x12=\n\x12\x43onvertAnnotations\x12\x12.ConversionRequest\x1a\x11.ConversionsReply\"\x00\x62\x06proto3')
)
_sym_db.RegisterFileDescriptor(DESCRIPTOR)




_CONVERSIONREQUEST = _descriptor.Descriptor(
  name='ConversionRequest',
  full_name='ConversionRequest',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='destpath', full_name='ConversionRequest.destpath', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='record_name', full_name='ConversionRequest.record_name', index=1,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='img_w', full_name='ConversionRequest.img_w', index=2,
      number=3, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='img_h', full_name='ConversionRequest.img_h', index=3,
      number=4, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='annotations_list', full_name='ConversionRequest.annotations_list', index=4,
      number=5, type=9, cpp_type=9, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=31,
  serialized_end=145,
)


_CONVERSIONSREPLY = _descriptor.Descriptor(
  name='ConversionsReply',
  full_name='ConversionsReply',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='status', full_name='ConversionsReply.status', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='conversion_id', full_name='ConversionsReply.conversion_id', index=1,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=147,
  serialized_end=204,
)

DESCRIPTOR.message_types_by_name['ConversionRequest'] = _CONVERSIONREQUEST
DESCRIPTOR.message_types_by_name['ConversionsReply'] = _CONVERSIONSREPLY

ConversionRequest = _reflection.GeneratedProtocolMessageType('ConversionRequest', (_message.Message,), dict(
  DESCRIPTOR = _CONVERSIONREQUEST,
  __module__ = 'annotations_converter_pb2'
  # @@protoc_insertion_point(class_scope:ConversionRequest)
  ))
_sym_db.RegisterMessage(ConversionRequest)

ConversionsReply = _reflection.GeneratedProtocolMessageType('ConversionsReply', (_message.Message,), dict(
  DESCRIPTOR = _CONVERSIONSREPLY,
  __module__ = 'annotations_converter_pb2'
  # @@protoc_insertion_point(class_scope:ConversionsReply)
  ))
_sym_db.RegisterMessage(ConversionsReply)


try:
  # THESE ELEMENTS WILL BE DEPRECATED.
  # Please use the generated *_pb2_grpc.py files instead.
  import grpc
  from grpc.framework.common import cardinality
  from grpc.framework.interfaces.face import utilities as face_utilities
  from grpc.beta import implementations as beta_implementations
  from grpc.beta import interfaces as beta_interfaces


  class AnnotationsConverterStub(object):

    def __init__(self, channel):
      """Constructor.

      Args:
        channel: A grpc.Channel.
      """
      self.ConvertAnnotations = channel.unary_unary(
          '/AnnotationsConverter/ConvertAnnotations',
          request_serializer=ConversionRequest.SerializeToString,
          response_deserializer=ConversionsReply.FromString,
          )


  class AnnotationsConverterServicer(object):

    def ConvertAnnotations(self, request, context):
      context.set_code(grpc.StatusCode.UNIMPLEMENTED)
      context.set_details('Method not implemented!')
      raise NotImplementedError('Method not implemented!')


  def add_AnnotationsConverterServicer_to_server(servicer, server):
    rpc_method_handlers = {
        'ConvertAnnotations': grpc.unary_unary_rpc_method_handler(
            servicer.ConvertAnnotations,
            request_deserializer=ConversionRequest.FromString,
            response_serializer=ConversionsReply.SerializeToString,
        ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
        'AnnotationsConverter', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


  class BetaAnnotationsConverterServicer(object):
    """The Beta API is deprecated for 0.15.0 and later.

    It is recommended to use the GA API (classes and functions in this
    file not marked beta) for all further purposes. This class was generated
    only to ease transition from grpcio<0.15.0 to grpcio>=0.15.0."""
    def ConvertAnnotations(self, request, context):
      context.code(beta_interfaces.StatusCode.UNIMPLEMENTED)


  class BetaAnnotationsConverterStub(object):
    """The Beta API is deprecated for 0.15.0 and later.

    It is recommended to use the GA API (classes and functions in this
    file not marked beta) for all further purposes. This class was generated
    only to ease transition from grpcio<0.15.0 to grpcio>=0.15.0."""
    def ConvertAnnotations(self, request, timeout, metadata=None, with_call=False, protocol_options=None):
      raise NotImplementedError()
    ConvertAnnotations.future = None


  def beta_create_AnnotationsConverter_server(servicer, pool=None, pool_size=None, default_timeout=None, maximum_timeout=None):
    """The Beta API is deprecated for 0.15.0 and later.

    It is recommended to use the GA API (classes and functions in this
    file not marked beta) for all further purposes. This function was
    generated only to ease transition from grpcio<0.15.0 to grpcio>=0.15.0"""
    request_deserializers = {
      ('AnnotationsConverter', 'ConvertAnnotations'): ConversionRequest.FromString,
    }
    response_serializers = {
      ('AnnotationsConverter', 'ConvertAnnotations'): ConversionsReply.SerializeToString,
    }
    method_implementations = {
      ('AnnotationsConverter', 'ConvertAnnotations'): face_utilities.unary_unary_inline(servicer.ConvertAnnotations),
    }
    server_options = beta_implementations.server_options(request_deserializers=request_deserializers, response_serializers=response_serializers, thread_pool=pool, thread_pool_size=pool_size, default_timeout=default_timeout, maximum_timeout=maximum_timeout)
    return beta_implementations.server(method_implementations, options=server_options)


  def beta_create_AnnotationsConverter_stub(channel, host=None, metadata_transformer=None, pool=None, pool_size=None):
    """The Beta API is deprecated for 0.15.0 and later.

    It is recommended to use the GA API (classes and functions in this
    file not marked beta) for all further purposes. This function was
    generated only to ease transition from grpcio<0.15.0 to grpcio>=0.15.0"""
    request_serializers = {
      ('AnnotationsConverter', 'ConvertAnnotations'): ConversionRequest.SerializeToString,
    }
    response_deserializers = {
      ('AnnotationsConverter', 'ConvertAnnotations'): ConversionsReply.FromString,
    }
    cardinalities = {
      'ConvertAnnotations': cardinality.Cardinality.UNARY_UNARY,
    }
    stub_options = beta_implementations.stub_options(host=host, metadata_transformer=metadata_transformer, request_serializers=request_serializers, response_deserializers=response_deserializers, thread_pool=pool, thread_pool_size=pool_size)
    return beta_implementations.dynamic_stub(channel, 'AnnotationsConverter', cardinalities, options=stub_options)
except ImportError:
  pass
# @@protoc_insertion_point(module_scope)