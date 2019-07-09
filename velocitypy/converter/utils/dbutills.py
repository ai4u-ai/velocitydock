import glob
import io
import pickle

import contextlib2
from object_detection.dataset_tools import tf_record_creation_util
import tensorflow as tf

from PIL import Image
from object_detection.utils import dataset_util
import dicttoxml
from pymongo import MongoClient
import gridfs
from bson.objectid import ObjectId

from argparse import Namespace
import os

import cv2
client = MongoClient("mongodb://localhost:27017")
db = client.velocity
fs = gridfs.GridFS(db)
fsbucket = gridfs.GridFSBucket(db)

def main():
    # tf.InteractiveSession()
    # tf.initialize_all_variables().run()

    # print()
    # image=cv2.imread('/Users/ivanjacobs/Documents/development/deme/object_detection_project/deme/yolo_darknet_org/images/00738.jpg')
    # cv2.rectangle(image, (272-100, 175), (299-100, 137), (0, 0, 255), 2)
    # cv2.rectangle(image, (272 , 175), (299, 137), (0, 0, 255), 2)
    # # save frame as JPEG file
    # cv2.imshow("", image)
    # key = cv2.waitKey(10000000)
    # time=1475686.808
    # vidcap = cv2.VideoCapture('/Volumes/LaCie/deme/DEME_Object_Recognition_VIDEOS/Object_Recognition/2018-07-04/vids/2018-07-04.mp4', cv2.CAP_ANY)
    # vidcap.set(cv2.CAP_PROP_POS_MSEC, time)
    #
    # # just cue to 20 sec. position
    # success, image = vidcap.read()
    # image = cv2.resize(image, (416, 416))
    # cv2.imshow('', image)
    # key = cv2.waitKey(100)
    # vidcap.release()
    # cv2.destroyAllWindows()

    #annotations= db.annotations.find_one({'_id':ObjectId('5b653ada5b7c4e81330de4cc')})
    # # convert_annotation_yolo(annotations)
    #convert_annotation_obj_det(annotations)
    #


    coursor = db.annotations.find(no_cursor_timeout=True)
    nr_of_ann=0
    for index, anno in enumerate(coursor):
        # anno['annotatedOnMedia']=db.media.find_one({'_id': ObjectId(anno['annotatedOnMedia'])})
        nr_of_ann= len([ann for ann in anno['annotation']])
        with open(os.path.join('../annotations/', str(anno['_id']) + '.p'), 'wb') as outfile:
            pickle.dump(anno, outfile, protocol=pickle.HIGHEST_PROTOCOL)
        print(str(nr_of_ann))

    print('main')

if __name__ == '__main__':
    # tf.app.run()
    main()