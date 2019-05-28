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
import grpc
import mongoclient as mongocl
import retrainForServer as retrain
import dockerManager as dockermanager
import trainerServer_pb2
import converter

_ONE_DAY_IN_SECONDS = 60 * 60 * 24


class Trainer(trainerServer_pb2.TrainerServicer):
    def __init__(self):
        print 'init trainer service'

    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--image_dir',
        type=str,
        default='annotations',
        help='Path to folders of labeled images.'
    )
    parser.add_argument(
        '--output_graph',
        type=str,
        default='output_graph.pb',
        help='Where to save the trained graph.'
    )
    parser.add_argument(
        '--output_labels',
        type=str,
        default='output_labels.txt',
        help='Where to save the trained graph\'s labels.'
    )
    parser.add_argument(
        '--summaries_dir',
        type=str,
        default='retrain_logs',
        help='Where to save summary logs for TensorBoard.'
    )
    parser.add_argument(
        '--how_many_training_steps',
        type=int,
        default=8000,
        help='How many training steps to run before ending.'
    )
    parser.add_argument(
        '--learning_rate',
        type=float,
        default=0.001,
        help='How large a learning rate to use when training.'
    )
    parser.add_argument(
        '--testing_percentage',
        type=int,
        default=10,
        help='What percentage of images to use as a test set.'
    )
    parser.add_argument(
        '--validation_percentage',
        type=int,
        default=10,
        help='What percentage of images to use as a validation set.'
    )
    parser.add_argument(
        '--eval_step_interval',
        type=int,
        default=10,
        help='How often to evaluate the training results.'
    )
    parser.add_argument(
        '--train_batch_size',
        type=int,
        default=100,
        help='How many images to train on at a time.'
    )
    parser.add_argument(
        '--test_batch_size',
        type=int,
        default=500,
        help="""\
                      How many images to test on at a time. This test set is only used
                      infrequently to verify the overall accuracy of the model.\
                      """
    )
    parser.add_argument(
        '--validation_batch_size',
        type=int,
        default=100,
        help="""\
                      How many images to use in an evaluation batch. This validation set is
                      used much more often than the test set, and is an early indicator of how
                      accurate the model is during training.\
                      """
    )
    parser.add_argument(
        '--model_dir',
        type=str,
        default='imagenet',
        help="""\
                      Path to classify_image_graph_def.pb,
                      imagenet_synset_to_human_label_map.txt, and
                      imagenet_2012_challenge_label_map_proto.pbtxt.\
                      """
    )
    parser.add_argument(
        '--model_name',
        type=str,
        default='classify_image_graph_def.pb',
        help="""\
                          Path to classify_image_graph_def.pb,
                          imagenet_synset_to_human_label_map.txt, and
                          imagenet_2012_challenge_label_map_proto.pbtxt.\
                          """
    )
    parser.add_argument(
        '--bottleneck_dir',
        type=str,
        default='bottleneck',
        help='Path to cache bottleneck layer values as files.'
    )
    parser.add_argument(
        '--final_tensor_name',
        type=str,
        default='final_result',
        help="""\
                      The name of the output classification layer in the retrained graph.\
                      """
    )
    parser.add_argument(
        '--export_version',
        type=str,
        default='1.0.0',
        help="""\
                        Version.\
                      """
    )
    parser.add_argument(
        '--flip_left_right',
        default=False,
        help="""\
                      Whether to randomly flip half of the training images horizontally.\
                      """,
        action='store_true'
    )
    parser.add_argument(
        '--random_crop',
        type=int,
        default=0,
        help="""\
                      A percentage determining how much of a margin to randomly crop off the
                      training images.\
                      """
    )
    parser.add_argument(
        '--random_scale',
        type=int,
        default=0,
        help="""\
                      A percentage determining how much to randomly scale up the size of the
                      training images by.\
                      """
    )
    parser.add_argument(
        '--random_brightness',
        type=int,
        default=0,
        help="""\
                      A percentage determining how much to randomly multiply the training image
                      input pixels up or down by.\
                      """
    )

    FLAGS, unparsed = parser.parse_known_args()
    def prep_inception(self, request):
        mongocl.downloadAnnotations(request.annotations, request.imagename)
        self.FLAGS.model_dir, self.FLAGS.model_name = mongocl.downloadModel(request.model, request.imagename,
                                                                            request.retrain)
        self.FLAGS.how_many_training_steps = int(request.steps)
        self.FLAGS.bottleneck_dir = request.imagename + '/' + 'bottleneck/'
        self.FLAGS.image_dir = request.imagename + '/annotations';
        self.FLAGS.summaries_dir = request.imagename + '/retrain_logs';
        # self.FLAGS.random_scale=5
        # self.FLAGS.random_crop=5
        # self.FLAGS.flip_left_right=0
        retrain.FLAGS = self.FLAGS
        trainagain = request.retrain

        retrain.train(trainagain)
        mongocl.make_tarfile('exportmodel.tar.gz', retrain.FLAGS.model_dir, retrain.FLAGS.output_graph,
                             retrain.FLAGS.output_labels)
        zipid = mongocl.uploadtarmodel('exportmodel.tar.gz', request.trainingid)
        dockermanager.saveZipToContainer(request.imagename)
        # os.remove('exportmodel.tar.gz')
        return trainerServer_pb2.TrainModelReply(trainingid=request.trainingid, zipmodelid=str(zipid))

    def prep_object_detection(self, request):
        converter.convert_annotations_coco()
    def TrainModel(self, request, context):
        algo_type = 'INCEPTION'

        if algo_type=='INCEPTION':
            return self.prep_inception(request)
        if algo_type=='OBJECT_DETECTION':
            return self.prep_object_detection(request)



    def createDockerImage(self,request,context):
        mongocl.downloadModelZipped(request.zipmodelid)
        dockermanager.saveZipToContainer(request.imagename)


def serve():
  server = grpc.server(futures.ThreadPoolExecutor(max_workers=100))
  trainerServer_pb2.add_TrainerServicer_to_server(Trainer(), server)
  server.add_insecure_port('[::]:50051')
  server.start()

  try:
    while True:
      time.sleep(_ONE_DAY_IN_SECONDS)
  except KeyboardInterrupt:
    server.stop(0)

if __name__ == '__main__':

  serve()
