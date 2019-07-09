# What model to download.
import json
import os
import tarfile
import wget
import configparser
import tensorflow as tf
from google.protobuf import text_format
from object_detection.protos import pipeline_pb2
from object_detection.protos import string_int_label_map_pb2

models=[
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
{'name':'mask_rcnn_resnet50_atrous_coco','url':'http://download.tensorflow.org/models/object_detection/mask_rcnn_resnet50_atrous_coco_2018_01_28.tar.gz'},
]

def save_label_map(label_map_path, data):
    with open(label_map_path, 'w+') as f:
        for i in range(len(data)):
            line = "item {\nid: " + str(i + 1) + "\nname: '" + data[i] + "'\n}\n"
            f.write(line)
def download_model(MODEL_NAME,url,destpath):

    MODEL_FILE = MODEL_NAME + '.tar.gz'


    # Path to frozen detection graph. This is the actual model that is used for the object detection.
    PATH_TO_FROZEN_GRAPH = MODEL_NAME + '/frozen_inference_graph.pb'

    # List of the strings that is used to add correct label for each box.
    PATH_TO_LABELS = os.path.join('data', 'mscoco_label_map.pbtxt')

    wget.download(url, os.path.join(destpath,MODEL_FILE))
    tar_file = tarfile.open(os.path.join(destpath,MODEL_FILE))
    top_level=[name for name in tar_file.getnames()][0]
    for file in tar_file.getmembers():
        tar_file.extract(file, destpath)

    os.remove(os.path.join(destpath,MODEL_FILE))
    pretrained_path=os.path.join(destpath,top_level)
    return pretrained_path



def change_config(config_path,dest_path,num_classes,num_steps,fine_tune_checkpoint,from_detection_checkpoint,train_tf_record_path,eval_tf_record_path,label_map_path,training,eval_num_examples=10,max_evals=10,eval_shuffle=True):
            pipeline_config = pipeline_pb2.TrainEvalPipelineConfig()

            with tf.io.gfile.GFile(config_path, "r") as f:
                    proto_str = f.read()
                    text_format.Merge(proto_str, pipeline_config)
            #
            for file in os.listdir(train_tf_record_path):

                        train_tf_record_path=os.path.join(train_tf_record_path,file)

            for file in os.listdir(eval_tf_record_path):


                    eval_tf_record_path = os.path.join(eval_tf_record_path, file)


            pipeline_config.model.ssd.num_classes=num_classes
            pipeline_config.train_config.num_steps=num_steps
            pipeline_config.train_config.fine_tune_checkpoint =fine_tune_checkpoint
            pipeline_config.train_config.from_detection_checkpoint=from_detection_checkpoint
            pipeline_config.train_input_reader.tf_record_input_reader.input_path[0]=train_tf_record_path
            pipeline_config.train_input_reader.label_map_path =label_map_path
            pipeline_config.eval_config.num_examples=eval_num_examples
            pipeline_config.eval_config.max_evals=max_evals
            #
            pipeline_config.eval_input_reader[0].label_map_path=label_map_path
            pipeline_config.eval_input_reader[0].shuffle=eval_shuffle
            pipeline_config.eval_input_reader[0].tf_record_input_reader.input_path[0]=eval_tf_record_path


            config_text = text_format.MessageToString(pipeline_config)
            with tf.gfile.Open(os.path.join(dest_path,'pipeline.config'), "wb") as f:
                         f.write(config_text)
            return os.path.join(dest_path,'pipeline.config')


def config_object_det_algo(model_name,destpath,classes,num_steps,from_detection_checkpoint,train_tf_record_path,eval_tf_record_path,eval_num_examples=10,max_evals=10,eval_shuffle=True):

    url=[ model['url'] for model in models if model['name']==model_name][0]

    pretrained_model_path=download_model(model_name,url,destpath)
    save_label_map(os.path.join(destpath,'label_map.pbtxt'), classes)
    label_map_path=os.path.join(destpath,'label_map.pbtxt')
    config_path=os.path.join(pretrained_model_path,'pipeline.config')
    fine_tune_checkpoint=os.path.join(pretrained_model_path,'model.ckpt')

    pipeline_config_path=change_config(config_path,destpath,len(classes),num_steps,fine_tune_checkpoint,from_detection_checkpoint,train_tf_record_path,eval_tf_record_path,label_map_path,eval_num_examples,max_evals,eval_shuffle)
    return pipeline_config_path



from object_detection import model_main