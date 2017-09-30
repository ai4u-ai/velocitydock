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
import time
import base64
import grpc
import numpy as np
import tensorflow as tf
import mongoclient as mongocl

imagePath = 'attended.jpg'
modelFullPath = 'imagenet/output_graph.pb'
labelsFullPath = 'imagenet/output_labels.txt'

import helloworld_pb2

_ONE_DAY_IN_SECONDS = 60 * 60 * 24


class Greeter(helloworld_pb2.GreeterServicer):


    def __init__(self):
        with tf.gfile.FastGFile(modelFullPath, 'rb') as f:
            graph_def = tf.GraphDef()
            graph_def.ParseFromString(f.read())
            _ = tf.import_graph_def(graph_def, name='')
            self.sess= tf.Session()

    def SayHello(self, request, context):
          # f = open('attendedRec.jpg', 'w+')
          # f.write(base64.b64decode(request.name))
          # f.close()
        # f = open('attendedRec.jpg', 'r')
          image_data =base64.b64decode(request.name)

        # Creates graph from saved GraphDef.




          # new_saver = tf.train.import_meta_graph('my-model.meta')
          # new_saver.restore(sess, 'my-model')

          softmax_tensor =  self.sess.graph.get_tensor_by_name('final_result:0')
          predictions =  self.sess.run(softmax_tensor,
                                 {'DecodeJpeg/contents:0': image_data})
          predictions = np.squeeze(predictions)

          top_k = predictions.argsort()[-5:][::-1]  # Getting top 5 predictions
          f = open(labelsFullPath, 'rb')
          lines = f.readlines()
          labels = [str(w).replace("\n", "") for w in lines]
          for node_id in top_k:
            human_string = labels[node_id]
            score = predictions[node_id]
            print('%s (score = %.5f)' % (human_string, score))

          answer = [{'label': labels[top_k[0]], 'score': predictions[top_k[0]]},
                    {'label': labels[top_k[1]], 'score': predictions[top_k[1]]}]

          return helloworld_pb2.HelloReply(label=labels[top_k[0]], score= str(predictions[top_k[0]]),frameid=request.frameid,filteredframeid=request.filteredframeid)


    def SayHelloAgain(self, request_iterator, context):
        # f = open('attendedRec.jpg', 'w+')
        # f.write(base64.b64decode(request.name))
        # f.close()
        # f = open('attendedRec.jpg', 'r')
        for request in request_iterator:
          image_data =base64.b64decode(request.name)

        # Creates graph from saved GraphDef.




          # new_saver = tf.train.import_meta_graph('my-model.meta')
          # new_saver.restore(sess, 'my-model')

          softmax_tensor =  self.sess.graph.get_tensor_by_name('final_result:0')
          predictions =  self.sess.run(softmax_tensor,
                                 {'DecodeJpeg/contents:0': image_data})
          predictions = np.squeeze(predictions)

          top_k = predictions.argsort()[-5:][::-1]  # Getting top 5 predictions
          f = open(labelsFullPath, 'rb')
          lines = f.readlines()
          labels = [str(w).replace("\n", "") for w in lines]
          for node_id in top_k:
            human_string = labels[node_id]
            score = predictions[node_id]
            print('%s (score = %.5f)' % (human_string, score))

          answer = [{'label': labels[top_k[0]], 'score': predictions[top_k[0]]},
                    {'label': labels[top_k[1]], 'score': predictions[top_k[1]]}]

          yield helloworld_pb2.HelloReply(label=labels[top_k[0]], score= str(predictions[top_k[0]]),frameid=request.frameid,filteredframeid=request.filteredframeid)


    def annotate(self, request_iterator, context):
        # f = open('attendedRec.jpg', 'w+')
        # f.write(base64.b64decode(request.name))
        # f.close()
        # f = open('attendedRec.jpg', 'r')
        for request in request_iterator:
          image_data = mongocl.readimage(request.name)

        # Creates graph from saved GraphDef.




          # new_saver = tf.train.import_meta_graph('my-model.meta')
          # new_saver.restore(sess, 'my-model')

          softmax_tensor =  self.sess.graph.get_tensor_by_name('final_result:0')
          predictions =  self.sess.run(softmax_tensor,
                                 {'DecodeJpeg/contents:0': image_data})
          predictions = np.squeeze(predictions)

          top_k = predictions.argsort()[-5:][::-1]  # Getting top 5 predictions
          f = open(labelsFullPath, 'rb')
          lines = f.readlines()
          labels = [str(w).replace("\n", "") for w in lines]
          for node_id in top_k:
            human_string = labels[node_id]
            score = predictions[node_id]
            print('%s (score = %.5f)' % (human_string, score))

          answer = [{'label': labels[top_k[0]], 'score': predictions[top_k[0]]},
                    {'label': labels[top_k[1]], 'score': predictions[top_k[1]]}]

          yield helloworld_pb2.HelloReply(label=labels[top_k[0]], score= str(predictions[top_k[0]]),frameid=request.frameid,filteredframeid=request.filteredframeid)


def create_graph():

    """Creates a graph from saved GraphDef file and returns a saver."""
            # Creates graph from saved graph_def.pb.
    print 'creating graph'
    with tf.gfile.FastGFile(modelFullPath, 'rb') as f:
     graph_def = tf.GraphDef()
     graph_def.ParseFromString(f.read())
     _ = tf.import_graph_def(graph_def, name='')

     return graph_def


def serve():
  server = grpc.server(futures.ThreadPoolExecutor(max_workers=100))
  helloworld_pb2.add_GreeterServicer_to_server(Greeter(), server)
  server.add_insecure_port('[::]:443')
  server.start()
  create_graph()
  try:
    while True:
      time.sleep(_ONE_DAY_IN_SECONDS)
  except KeyboardInterrupt:
    server.stop(0)

if __name__ == '__main__':

  serve()
