import os
import base64

import cv2
import grpc
from concurrent import futures
import annotations_converter_pb2
import time

import annotations_converter_pb2_grpc

_ONE_DAY_IN_SECONDS = 60 * 60 * 24
_ONE_YEAR_IN_SECONDS=_ONE_DAY_IN_SECONDS*365
import annotations_converter_coco as annotations_converter_yolo
class Converter(annotations_converter_pb2_grpc.AnnotationsConverterServicer):
    def __init__(self):
        print('init annotations converter')




    def ConvertAnnotations(self,request,context):
        returnstate=None
        conversion_id=None
        returnstate=annotations_converter_yolo.covnert_data_sets(request)
        return annotations_converter_pb2.ConversionsReply(status=returnstate, conversion_id=conversion_id)
def serve():
  server = grpc.server(futures.ThreadPoolExecutor(max_workers=100))
  annotations_converter_pb2_grpc.add_AnnotationsConverterServicer_to_server(Converter(), server)
  server.add_insecure_port('[::]:50052')
  server.start()

  try:
    while True:
      time.sleep(_ONE_YEAR_IN_SECONDS)
  except KeyboardInterrupt:
    server.stop(0)

if __name__ == '__main__':

  serve()