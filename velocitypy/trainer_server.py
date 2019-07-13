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
import datetime
import os
from concurrent import futures
import argparse
import time
import grpc

from  trainer_service import dynamic_import
import mongoclient as mongocl
import retrainForServer as retrain
from nets import inception_resnet_v2
import trainerServer_pb2
from converter.conversion_service.annotations_converter_coco import split_train_test, convert_annotations_coco, convert_annotation_yolo, \
    convert_inception


_ONE_DAY_IN_SECONDS = 60 * 60 * 24


class Trainer(trainerServer_pb2.TrainerServicer):
    def __init__(self):
        print ('init trainer service')
        self.obj_det_models=[
{'name':'ssd_mobilenet_v1_coco','url':'http://download.tensorflow.org/models/object_detection/ssd_mobilenet_v1_coco_2018_01_28.tar.gz'},
{'name':'ssd_mobilenet_v1_0.75_depth_coco','url':'http://download.tensorflow.org/models/object_detection/ssd_mobilenet_v1_0.75_depth_300x300_coco14_sync_2018_07_03.tar.gz'},
{'name':'ssd_mobilenet_v1_quantized_coco','url':'http://download.tensorflow.org/models/object_detection/ssd_mobilenet_v1_quantized_300x300_coco14_sync_2018_07_18.tar.gz'},
{'name':'ssd_mobilenet_v1_0.75_depth_quantized_coco','url':'http://download.tensorflow.org/models/object_detection/ssd_mobilenet_v1_0.75_depth_quantized_300x300_coco14_sync_2018_07_18.tar.gz'},
{'name':'ssd_mobilenet_v1_ppn_coco','url':'http://download.tensorflow.org/models/object_detection/ssd_mobilenet_v1_ppn_shared_box_predictor_300x300_coco14_sync_2018_07_03.tar.gz'},
{'name':'ssd_mobilenet_v1_fpn_coco','url':'http://download.tensorflow.org/models/object_detection/ssd_mobilenet_v1_fpn_shared_box_predictor_640x640_coco14_sync_2018_07_03.tar.gz'},

{'name':'ssd_resnet_50_fpn_coco','url':'http://download.tensorflow.org/models/object_detection/ssd_resnet50_v1_fpn_shared_box_predictor_640x640_coco14_sync_2018_07_03.tar.gz'},
{'name':'ssd_mobilenet_v2_coco','url':'http://download.tensorflow.org/models/object_detection/ssd_mobilenet_v2_coco_2018_03_29.tar.gz'},
{'name':'ssd_mobilenet_v2_quantized_coco','url':'http://download.tensorflow.org/models/object_detection/ssd_mobilenet_v2_quantized_300x300_coco_2019_01_03.tar.gz'},
{'name':'ssdlite_mobilenet_v2_coco','url':'http://download.tensorflow.org/models/object_detection/ssdlite_mobilenet_v2_coco_2018_05_09.tar.gz'},
{'name':'ssd_inception_v2_coco','url':'http://download.tensorflow.org/models/object_detection/ssd_inception_v2_coco_2018_01_28.tar.gz'},
{'name':'faster_rcnn_inception_v2_coco','url':'http://download.tensorflow.org/models/object_detection/faster_rcnn_inception_v2_coco_2018_01_28.tar.gz'},
{'name':'faster_rcnn_resnet50_coco','url':'http://download.tensorflow.org/models/object_detection/faster_rcnn_resnet50_coco_2018_01_28.tar.gz'},
{'name':'faster_rcnn_resnet50_lowproposals_coco','url':'http://download.tensorflow.org/models/object_detection/faster_rcnn_resnet50_lowproposals_coco_2018_01_28.tar.gz'},
{'name':'rfcn_resnet101_coco','url':'http://download.tensorflow.org/models/object_detection/rfcn_resnet101_coco_2018_01_28.tar.gz'},
{'name':'faster_rcnn_resnet101_coco','url':'http://download.tensorflow.org/models/object_detection/faster_rcnn_resnet101_coco_2018_01_28.tar.gz'},
{'name':'faster_rcnn_resnet101_lowproposals_coco','url':'http://download.tensorflow.org/models/object_detection/faster_rcnn_resnet101_lowproposals_coco_2018_01_28.tar.gz'},
{'name':'faster_rcnn_inception_resnet_v2_atrous_coco','url':'http://download.tensorflow.org/models/object_detection/faster_rcnn_inception_resnet_v2_atrous_coco_2018_01_28.tar.gz'},
{'name':'faster_rcnn_inception_resnet_v2_atrous_lowproposals_coco','url':'http://download.tensorflow.org/models/object_detection/faster_rcnn_inception_resnet_v2_atrous_lowproposals_coco_2018_01_28.tar.gz'},
{'name':'faster_rcnn_nas','url':'http://download.tensorflow.org/models/object_detection/faster_rcnn_nas_coco_2018_01_28.tar.gz'},
{'name':'faster_rcnn_nas_lowproposals_coco','url':'http://download.tensorflow.org/models/object_detection/faster_rcnn_nas_lowproposals_coco_2018_01_28.tar.gz'},
{'name':'mask_rcnn_inception_resnet_v2_atrous_coco','url':'http://download.tensorflow.org/models/object_detection/mask_rcnn_inception_resnet_v2_atrous_coco_2018_01_28.tar.gz'},
{'name':'mask_rcnn_inception_v2_coco','url':'http://download.tensorflow.org/models/object_detection/mask_rcnn_inception_v2_coco_2018_01_28.tar.gz'},
{'name':'mask_rcnn_resnet101_atrous_coco','url':'http://download.tensorflow.org/models/object_detection/mask_rcnn_resnet101_atrous_coco_2018_01_28.tar.gz'},
{'name':'mask_rcnn_resnet50_atrous_coco','url':'http://download.tensorflow.org/models/object_detection/mask_rcnn_resnet50_atrous_coco_2018_01_28.tar.gz'},]








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
    def TrainModel_old(self, request, context):
        mongocl.downloadAnnotations(request.annotations,request.imagename)


        self.FLAGS.model_dir, self.FLAGS.model_name= mongocl.downloadModel(request.model,request.imagename,request.retrain)
        self.FLAGS.how_many_training_steps =int(request.steps)
        self.FLAGS.bottleneck_dir=request.imagename+'/'+'bottleneck/'
        self.FLAGS.image_dir=request.imagename+'/annotations';
        self.FLAGS.summaries_dir=request.imagename+'/retrain_logs';
        # self.FLAGS.random_scale=5
        # self.FLAGS.random_crop=5
        # self.FLAGS.flip_left_right=0
        retrain.FLAGS = self.FLAGS
        trainagain = request.retrain

        retrain.train(trainagain)
        mongocl.make_tarfile('exportmodel.tar.gz',retrain.FLAGS.model_dir, retrain.FLAGS.output_graph,retrain.FLAGS.output_labels)
        zipid=mongocl.uploadtarmodel('exportmodel.tar.gz',request.trainingid)
        dockermanager.saveZipToContainer(request.imagename)
        # os.remove('exportmodel.tar.gz')
        return trainerServer_pb2.TrainModelReply(trainingid=request.trainingid,zipmodelid=str(zipid))

    def prep_conversion(self,training):
        exceptions = []
        conversion = {}
        conversion['record_name'] = training['dataSet']['name']
        conversion['img_w'] = training['conversionSettings']['image_width']
        conversion['img_h'] = training['conversionSettings']['image_height']
        conversion['dataset_id'] = training['dataSet']['_id']

        conversion['conversion_type'] = training['algoType']
        conversion['test_train_split'] = training['conversionSettings']['test_train_split']

        # conversion['annotation_ids'] = request.annotations_list
        conversion['status'] = 'STARTED'

        conversion['create_date'] = datetime.datetime.now().isoformat()
        conversion['exceptions'] = []
        conversion_id = mongocl.save_conversion(conversion)
        homeDir = os.path.expanduser('~')
        destPath = os.path.join(homeDir,training['conversionSettings']['dest_path'],training['algoType'],str(training['_id']) )
        if not os.path.isdir(destPath):
            os.makedirs(destPath)
        return conversion,destPath
    def convert(self,training,conversion,destPath):
        train, test,classes = split_train_test(training['dataSet']['annotations'],
                                       float(training['conversionSettings']['test_train_split']))
        type_path = os.path.join(destPath, 'data')
        training['classes']=classes
        mongocl.update_training(training,'classes',classes)
        dest_path = type_path
        mongocl.update_training(training,'data_path',dest_path)
        conversion['data_set_path'] = dest_path
        if not os.path.isdir(dest_path):
            os.mkdir(dest_path)
        train_path=os.path.join(dest_path,'train')
        test_path = os.path.join(dest_path, 'test')
        if not os.path.isdir(test_path):
            os.mkdir(test_path)
        if not os.path.isdir(train_path):
            os.mkdir(train_path)
        if training['algoType'] in [model['name'] for model in self.obj_det_models]:

            print('__--------------------------------------------------------------------------Call')
            print('__--------------------------------------------------------------------------DEV DATASET START')
            returnstate, conversion = convert_annotations_coco(
                dataset_id=training['dataSet']['_id'],
                annotations_list=train,
                destpath=train_path,
                record_name=training['dataSet']['name'] + '_train',
                img_w=int(training['conversionSettings']['image_width']),
                img_h=int(training['conversionSettings']['image_height']),conversion=conversion)

            conversion['status'] = 'converted_train'
            training['train_data_set']=os.path.join(train_path,training['dataSet']['name'] + '_train')
            mongocl.save_conversion(conversion)
            training['conversion'] = conversion
            mongocl.update_training(training,'conversion',conversion["_id"])

            print('__--------------------------------------------------------------------------DEV DATASET END')
            print('__--------------------------------------------------------------------------TEST DATASET START')
            if returnstate=="ERROR":
                training['exceptions_conversion']=conversion['exceptions']
                training['state']='error_conversion'
                mongocl.update_training(training,'status','error_conversion')
                return
            mongocl.update_training(training, 'status', 'CONVERTED_TRAIN')
            returnstate, conversion = convert_annotations_coco(
                dataset_id=training['dataSet']['_id'],
                annotations_list=test,
                destpath=test_path,
                record_name=training['dataSet']['name'] + '_test',
                img_w=int(training['conversionSettings']['image_width']),
                img_h=int(training['conversionSettings']['image_height']),conversion=conversion)
            conversion['status'] = 'converted_test'
            mongocl.save_conversion(conversion)
            mongocl.update_training(training, 'conversion', conversion["_id"])
            training['conversion'] = conversion
            if returnstate=="ERROR":
                training['exceptions_conversion']=conversion['exceptions']
                training['state']='error_conversion'
                mongocl.update_training(training,'status','error_conversion')
                return
            conversion['status'] = 'end'
            mongocl.save_conversion(conversion)
            training['test_data_set'] = os.path.join(train_path, training['dataSet']['name'] + '_test')
            mongocl.update_training(training, 'status', 'CONVERTED_TEST')


            print('__--------------------------------------------------------------------------TEST DATASET END')
            return train_path, test_path
        elif training['algoType'] == 'Yolo':

            convert_annotation_yolo(train, train_path, int(training['conversionSettings']['image_width']),
                                                               int(training['conversionSettings']['imgage_height']))

            conversion['status'] = 'converted_test'
            mongocl.save_conversion(conversion)
            convert_annotation_yolo(train, test_path, int(training['conversionSettings']['image_width']),
                                    int(training['conversionSettings']['image_height']))
            conversion['status'] = 'end'
            mongocl.save_conversion(conversion)
            return train_path, test_path
        else:


            returnstate,conversion=convert_inception(train, train_path, int(training['conversionSettings']['image_width']), int(training['conversionSettings']['image_height']),conversion)
            if returnstate=="ERROR":
                training['exceptions_conversion']=conversion['exceptions']
                training['state']='error_conversion'
                mongocl.update_training(training,'status', 'error_conversion')
                return
            conversion['status'] = 'CONVERTED_TRAIN'
            training['status']='CONVERTED_TRAIN'
            training['conversion']=conversion
            mongocl.update_training(training, 'conversion', conversion["_id"])
            mongocl.save_conversion(conversion)
            mongocl.update_training(training, 'status','CONVERTED_TRAIN')
            returnstate,conversion=convert_inception(test, test_path, int(training['conversionSettings']['image_width']), int(training['conversionSettings']['image_height']),conversion)

            if returnstate=="ERROR":
                training['exceptions_conversion']=conversion['exceptions']
                training['state']='error_conversion'
                mongocl.update_training(training,'status','error_conversion')
                return
            conversion['status'] = 'end'
            training['status'] = 'CONVERTED_TEST'
            mongocl.save_conversion(conversion)
            mongocl.update_training(training, 'conversion', conversion["_id"])
            mongocl.update_training(training, 'status','CONVERTED_TEST')
            return train_path,test_path

    def TrainModel(self, request, context):

        training=mongocl.find_training(request.trainingid)
        conversion,destPath=self.prep_conversion(training)
        train_path,test_path=self.convert(training,conversion,destPath)
        include_top=training['trainingMode']!='Transfer Learning'
        mongocl.update_training(training,'dest_path',destPath)
        try:
            if training['algoType'] in [model['name'] for model in self.obj_det_models]:
                include_top = training['trainingMode'] == 'Transfer Learning'
                dynamic_import.train_object_det_model(training,destPath,training['algoType'],train_path,test_path,training['classes'],int(training['conversionSettings']['image_width']),int(training['conversionSettings']['image_height']),include_top,int(training['epochs']),int(training['steps']),
                                   training['conversionSettings']['classMode'])
            else:
                dynamic_import.train_model(training,destPath,training['algoType'],train_path,test_path,int(training['conversionSettings']['image_width']),int(training['conversionSettings']['image_height']),include_top,int(training['epochs']),int(training['steps']),
                                   training['conversionSettings']['classMode'])
        except Exception as exc:
            training['status']='error'
            mongocl.update_training(training,'status','error')
            print(exc)
       # mongocl.downloadAnnotations(request.annotations,request.imagename)
        #
        #
        # model_dir, model_name= mongocl.downloadModel(request.model,request.imagename,request.retrain)
        # how_many_training_steps =int(request.steps)
        #
        # annotations_dir=request.imagename+'/'+request.trainingid+'/annotations';
        # summaries_dir=request.imagename+'/'+request.trainingid+'/train_logs';
        #
        # trainagain = request.retrain
        #
        # retrain.train(trainagain)
        # mongocl.make_tarfile('exportmodel.tar.gz',model_dir, output_graph,output_labels)
        # zipid=mongocl.uploadtarmodel('exportmodel.tar.gz',request.trainingid)
        # dockermanager.saveZipToContainer(request.imagename)
        # # os.remove('exportmodel.tar.gz')
        return trainerServer_pb2.TrainModelReply(trainingid=request.trainingid,zipmodelid=str(""))



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
