import base64
import copy
import datetime
import glob
import io
from os.path import expanduser

import contextlib2
import numpy as np
from object_detection.dataset_tools import tf_record_creation_util

from PIL import Image
from object_detection.utils import dataset_util
import dicttoxml
from pymongo import MongoClient
import gridfs
from bson.objectid import ObjectId
import tensorflow as tf
from argparse import Namespace
import os
import cv2

client = MongoClient("mongodb://localhost:27017")
db = client.velocity
fs = gridfs.GridFS(db)
fsbucket = gridfs.GridFSBucket(db)
flags = tf.app.flags
flags.DEFINE_string('output_path', 'train.tfrecords', 'Path to output TFRecord')
FLAGS = flags.FLAGS
import logging

formatter = logging.Formatter(fmt='%(asctime)s - %(levelname)s - %(module)s - %(message)s')
logging.basicConfig(filename=os.path.join(expanduser("~"),'annotationsconverter.log'),  filemode='a')
handler = logging.StreamHandler()
handler.setFormatter(formatter)
fh=logging.FileHandler(os.path.join(expanduser("~"),'annotationsconverter.log'))
fh.setFormatter(formatter)
logger = logging.getLogger('root')
logger.setLevel(logging.DEBUG)
logger.addHandler(handler)
logger.addHandler(fh)

def find_last_file_name(dirName):
    # files = [f for f in listdir(dirName) if isfile(join(dirName, f))]
    files=[os.path.basename(f) for f in  glob.glob(os.path.join(dirName, '*'))]

    if len(files)==0:
        return 1
    else:
        number = files[len(files) - 1].lstrip("0").split(".")[0]
        return int(number) + 1


def check_for_previous(dirName):
    if os.path.exists(dirName) and os.path.isdir(dirName):
        if not os.listdir(dirName):
            logger.debug("Directory is empty")
            return 1
        else:
            return find_last_file_name(dirName)
    else:
        return 1


def save_xml(folder, index, xml):
    if not os.path.exists(folder):
        os.makedirs(folder)
    with open(os.path.join(folder, str(index).zfill(5) + ".xml"), 'w')as file:
        file.write(xml.decode("utf-8"))
        file.close()


def save_image(folder, index, class_label, image):
    if not os.path.exists(folder):
        os.makedirs(folder)
    return cv2.imwrite(os.path.join(folder, str(index).zfill(5) + ".jpg"), image)


def recalc_coordinates(oldX, oldY, newX, newY, x, y):
    Rx = newX / oldX
    Ry = newY / oldY
    return (int(Rx * x), int(Ry * y))


def find_all_classes(annotations):
    classess = {}
    for index, annotation in enumerate(annotations['annotation']):
        classess[annotation['objectSelector']['class']['name']] = annotation['objectSelector']['class']['name']
    return list(classess.keys())


def download(folder, name, id):
    if not os.path.exists(folder):
        os.makedirs(folder)
    if os.path.isfile(os.path.join(folder, name)):
        return
    with open(os.path.join(folder, name), "wb") as file:
        fsbucket.download_to_stream(id, file)


# wrapper=fs.get(media['media']['id'])
# # fsbucket.download_to_stream(media['media']['id'],file)
# gout = fsbucket.open_download_stream(media['media']['id'])
# for chunk in gout:
#     file.write(chunk)
#

def create_tf_example(annotation, image, class_number):
    # TODO(user): Populate the following variables from your example.
    newX = float(image.shape[1])
    newY = float(image.shape[0])
    oldX = float(annotation['origSize']['width'])
    oldY = float(annotation['origSize']['height'])
    selector = Namespace(**annotation['objectSelector'])
    x1 = int(selector.x1)
    x2 = int(selector.x2)
    y1 = int(selector.y1)
    y2 = int(selector.y2)
    class_label = annotation['objectSelector']['class']['name']
    x1, y1 = recalc_coordinates(newX=newX, newY=newY, oldX=oldX, oldY=oldY, x=x1, y=y1)
    x2, y2 = recalc_coordinates(newX=newX, newY=newY, oldX=oldX, oldY=oldY, x=x2, y=y2)
    cv2.imwrite('Image.jpg', image)
    # with Image.fromarray(image) as img:
    with tf.gfile.GFile('Image.jpg', 'rb') as fid:
        encoded_jpg = fid.read()
    encoded_jpg_io = io.BytesIO(encoded_jpg)
    _image = Image.open(encoded_jpg_io)
    (width, height) = _image.size

    if x2>=width or y2>=height or image.shape[0]!=height or  image.shape[1]!=width :
            raise Exception("object width or height Error")
    # Image.fromarray(_image).tobytes()
    # height = int(annotation['origSize']['width'])  # Image height
    # width = int(annotation['origSize']['height'])  # Image width
    filename = b''  # Filename of the image. Empty if image is not from file
    # image=cv2.imencode(".jpg", image)[1].tostring()

    # with Image.fromarray(image) as img:
    #     imgBytes=io.BytesIO()
    #     img.save(imgBytes,format='JPEG')
    #     encoded_image_data=imgBytes.getvalue()

    # encoded_image_data = tf.image.encode_jpeg(image, format='rgb', quality=100)  # Encoded image bytes
    #
    #
    #    _image = tf.image.decode_jpeg(encoded_image_data, channels=3)
    # logger.debug(_image.eval().shape)
    # cv2.imshow('',np.asarray(_image.eval()))
    #cv2.imwrite('image.jpeg', np.asarray(_image.eval()))
    # cv2.imshow('',_image.eval())
    image_format = b'jpeg'  # b'jpeg' or b'png'

    xmins = [float(x1)/width]  # List of normalized left x coordinates in bounding box (1 per box)
    xmaxs = [float(x2)/width]  # List of normalized right x coordinates in bounding box
    # (1 per box)
    ymins = [float(y1)/height]  # List of normalized top y coordinates in bounding box (1 per box)
    ymaxs = [float(y2)/height]  # List of normalized bottom y coordinates in bounding box
    # (1 per box)
    classes_text = [class_label.encode('utf8')]  # List of string class name of bounding box (1 per box)
    classes = [class_number + 1]  # List of integer class id of bounding box (1 per box)

    tf_example = tf.train.Example(features=tf.train.Features(feature={
        'image/height': dataset_util.int64_feature(height),
        'image/width': dataset_util.int64_feature(width),
        'image/filename': dataset_util.bytes_feature(filename),
        'image/source_id': dataset_util.bytes_feature(filename),
        'image/encoded': dataset_util.bytes_feature(encoded_jpg),
        'image/format': dataset_util.bytes_feature(image_format),
        'image/object/bbox/xmin': dataset_util.float_list_feature(xmins),
        'image/object/bbox/xmax': dataset_util.float_list_feature(xmaxs),
        'image/object/bbox/ymin': dataset_util.float_list_feature(ymins),
        'image/object/bbox/ymax': dataset_util.float_list_feature(ymaxs),
        'image/object/class/text': dataset_util.bytes_list_feature(classes_text),
        'image/object/class/label': dataset_util.int64_list_feature(classes),
    }))
    return tf_example


def convert_inception(annotations,destpath_name, img_w,img_h,conversion):
    try:
        exceptions = []
        for annotation in annotations:

            try:
                for anno in annotation["annotation"]:
                    #logger.debug(anno["objectSelector"]["dataUrl"])
                    filename = str(int(anno["currentTime"])) + ".jpeg"
                    classname = str(anno["objectSelector"]["class"]["name"])
                    if not os.path.isdir(destpath_name + '/' + classname):
                        os.makedirs(destpath_name + '/' + classname)
                    with open(os.path.join(os.path.join(destpath_name, classname), filename), "wb") as fh:
                        fh.write(base64.b64decode(anno["objectSelector"]["dataUrl"].split(',', 1)[-1]))
                    img=cv2.imread(os.path.join(os.path.join(destpath_name, classname), filename))
                    img=cv2.resize(img,(img_h,img_w))
                    cv2.imwrite(os.path.join(os.path.join(destpath_name, classname), filename),img)
            except Exception as exc:
                    logger.error(str(exc))
                    exceptions.extend(exc)

        return 'success',conversion
    except Exception as e:
                conversion['status'] = 'ERROR'
                conversion['ERROR_MESSAGE'] = e
                conversion['modif_date'] = datetime.datetime.now().isoformat()
                conversion['exceptions'] = exceptions
                db.conversion.update_one({'_id': conversion['_id']}, {"$set": conversion}, upsert=False)
                return 'ERROR', conversion


def convert_annotation_obj_det(annotations,writer,img_w,img_h):
    # writer_ = tf.python_io.TFRecordWriter(FLAGS.output_path)
    exceptions=[]
    media_id = annotations['annotatedOnMedia']
    media = db.media.find_one({'_id': ObjectId(media_id)})
    logger.debug(media['name'])
    if not 'filePath' in media.keys():
        download('tmp', media['name'], media['media']['id'])
        try:
            vidcap = cv2.VideoCapture(os.path.join('tmp', media['name']))
        except Exception as exc:
            exceptions.append(exc)
            return exceptions
    else:
        try:
            vidcap = cv2.VideoCapture(media['filePath'])
        except Exception as exc:
            exceptions.append(exc)
            return exceptions
    if (vidcap.isOpened() == False):
        logger.debug("Error opening video stream or file")
        exceptions.append("Error opening video stream or file")
        return exceptions

    classes = find_all_classes(annotations)
    for index, annotation in enumerate(annotations['annotation']):
        vidcap.set(cv2.CAP_PROP_POS_MSEC, annotation['currentTime'])
        # just cue to 20 sec. position
        success, image = vidcap.read()


        if success:
            try:
                image = cv2.resize(image, (img_w,img_h))
                logger.debug(image.shape[:2])
                tf_example = create_tf_example(annotation, image,
                                               classes.index(annotation['objectSelector']['class']['name']))
                writer.write(tf_example.SerializeToString())

            except Exception as ex:

                exceptions.append(str(ex))
                logger.error(str(ex))
                continue

        # if index==5:
        #     writer.close()
        #     writer_.close()
        #     break
    # writer_.close()
    #writer.close()
    cv2.destroyAllWindows()
    vidcap.release()
    return exceptions


def convert_annotation_yolo(annotations,destpath,img_width,img_heitght):
    for anno in annotations:
        media_id = anno['annotatedOnMedia']
        media = db.media.find_one({'_id': ObjectId(media_id)})
        logger.debug(media['name'])
        if not 'filePath' in media.keys():
            download('tmp', media['name'], media['media']['id'])
            vidcap = cv2.VideoCapture(os.path.join('tmp', media['name']))
        else:
            vidcap = cv2.VideoCapture(media['filePath'])

        addintion = check_for_previous(os.path.join(destpath,"images"))
        for index, annotation in enumerate(anno['annotation']):
            index = index + addintion
            vidcap.set(cv2.CAP_PROP_POS_MSEC, annotation['currentTime'])
            # just cue to 20 sec. position
            success, image = vidcap.read()
            try:
                image = cv2.resize(image, (img_width, img_heitght))
            except Exception as ex:
                logger.error(str(ex))
                continue


            logger.debug(image.shape[:2])
            if success:

                oldX = int(annotation['origSize']['width'])
                oldY = int(annotation['origSize']['height'])
                selector = Namespace(**annotation['objectSelector'])
                x1 = int(selector.x1)
                x2 = int(selector.x2)
                y1 = int(selector.y1)
                y2 = int(selector.y2)
                class_label = annotation['objectSelector']['class']['name']
                if save_image(os.path.join(destpath,"images"), index, class_label, image):
                    anno = {}

                    anno['folder'] = os.path.join(destpath,"images")
                    anno['filename'] = str(index).zfill(5) + ".jpg"
                    anno['size'] = {}
                    anno['size']['width'] = str(image.shape[1])
                    anno['size']['height'] = str(image.shape[0])
                    newX = int(image.shape[1])
                    newY = int(image.shape[0])

                    x1, y1 = recalc_coordinates(newX=newX, newY=newY, oldX=oldX, oldY=oldY, x=x1, y=y1)
                    x2, y2 = recalc_coordinates(newX=newX, newY=newY, oldX=oldX, oldY=oldY, x=x2, y=y2)
                    anno['object'] = {}
                    anno['object']['name'] = class_label
                    anno['object']['bndbox'] = {}
                    anno['object']['bndbox']['xmin'] = x1
                    anno['object']['bndbox']['ymin'] = y1
                    anno['object']['bndbox']['xmax'] = x2
                    anno['object']['bndbox']['ymax'] = y2
                    xml = dicttoxml.dicttoxml(anno, attr_type=False, custom_root='annoation')
                    save_xml(os.path.join(destpath,"annotations"), index, xml)

                # cv2.rectangle(image, (x1, y1), (x2, y2), (0, 0, 255), 2)
                # save frame as JPEG file
                # cv2.imshow(class_label, image)
                # key = cv2.waitKey(100)
    cv2.destroyAllWindows()

def split_train_test(annotations_list,train_percentage):
    annotations_list = [ObjectId(id) for id in annotations_list]
    coursor = db.annotations.find({"_id": {"$in": annotations_list}}, no_cursor_timeout=True)
    total=0
    anos_singles=[]
    classes=[]
    for index, ano in enumerate(coursor):
        total +=len(ano['annotation'])

        for a in ano['annotation']:
            copy = ano.copy()
            copy['annotation'] = []
            copy['annotation'].append(a)
            anos_singles.append(copy)
            classes.append(a['objectSelector']['class']['name'])

    _total = 0
    train=np.random.choice(anos_singles,int(total*train_percentage))
    test = np.random.choice(anos_singles,int(total*(1-train_percentage)))
    # reached=False
    # coursor = db.annotations.find({"_id": {"$in": annotations_list}}, no_cursor_timeout=True)
    #
    # for index, ano in enumerate(coursor):
    #     _total += len(ano['annotation'])
    #     if not reached:
    #         if _total < total*train_percentage:
    #             test.append(ano)
    #         elif _total > total*train_percentage:
    #             reached=True
    #             new_anno=copy.deepcopy(ano)
    #             new_anno['annotation']=[]
    #             index=_total-total*train_percentage
    #             new_anno['annotation']=ano['annotation'][:int(index)]
    #             test.append(new_anno)
    #             _new_anno = copy.deepcopy(ano)
    #             _new_anno['annotation'] = []
    #             index = _total - total * train_percentage
    #             _new_anno['annotation'] = ano['annotation'][int(index):]
    #             train.append(_new_anno)
    #         elif _total == total*train_percentage:
    #             reached = True
    #             test.append(ano)
    #     else:
    #         train.append(ano)

    return  train,test,list(set(classes))


def covnert_data_sets(request):

    try:
        exceptions = []
        conversion = {}

        conversion['record_name']=request.record_name
        conversion['img_w'] = request.img_w
        conversion['img_h'] = request.img_h
        conversion['dataset_id']=ObjectId(request.dataset_id)

        conversion['conversion_type'] = request.conversion_type
        conversion['test_train_split'] = request.test_train_split
        #conversion['annotation_ids'] = request.annotations_list
        conversion['status'] = 'STARTED'

        conversion['create_date'] = datetime.datetime.now().isoformat()
        conversion['exceptions'] = []
        conversion_id = str(db.conversion.save(conversion))
        homeDir = os.path.expanduser('~')
        destPath = os.path.join(homeDir, request.destpath,str(conversion_id))
        if not os.path.isdir(destPath):
            os.makedirs(destPath)

        train, test,classes = split_train_test(request.annotations_list,float(request.test_train_split))
        if request.conversion_type == 'Classification Convnet':
            type_path = os.path.join(destPath, 'classification_convnet')
            if not os.path.isdir(type_path):
                os.mkdir(type_path)
            conversion['data_set_path'] = type_path
            path = os.path.join(type_path,  'train')
            convert_inception(train, path, int(request.img_w), int(request.img_h),conversion)
            conversion['status'] = 'converted_train'
            db.conversion.save(conversion)
            path = os.path.join(type_path, 'test')
            convert_inception(test, path, int(request.img_w), int(request.img_h),conversion)
            conversion['status'] = 'end'
            db.conversion.save(conversion)
        elif request.conversion_type == 'Object Detection Tensorflow':
            type_path = os.path.join(destPath, 'object_detection')

            if not os.path.isdir(type_path):
                os.mkdir(type_path)
            dest_path = type_path
            conversion['data_set_path'] = dest_path
            db.conversion.save(conversion)
            if not os.path.isdir(dest_path):
                os.mkdir(dest_path)
            logger.debug('__--------------------------------------------------------------------------Call')
            logger.debug('__--------------------------------------------------------------------------DEV DATASET START')
            returnstate, conversion_id = convert_annotations_coco(
                dataset_id=request.dataset_id,
                annotations_list=train,
                destpath=dest_path,
                record_name=request.record_name + '_train',
                img_w=int(request.img_w),
                img_h=int(request.img_h),conversion=conversion)
            logger.debug('__--------------------------------------------------------------------------DEV DATASET END')
            conversion['status'] = 'converted_train'
            db.conversion.save(conversion)
            logger.debug('__--------------------------------------------------------------------------TEST DATASET START')
            returnstate, conversion_id = convert_annotations_coco(
                dataset_id=request.dataset_id,
                annotations_list=test,
                destpath=dest_path,
                record_name=request.record_name + '_test',
                img_w=int(request.img_w),
                img_h=int(request.img_h),conversion=conversion)
            conversion['status']='end'
            logger.debug('__--------------------------------------------------------------------------TEST DATASET END')
            db.conversion.save(conversion)
        elif request.conversion_type == 'Yolo':
            type_path = os.path.join(destPath, 'yolo')
            if not os.path.isdir(type_path):
                os.mkdir(type_path)


            dest_path = type_path
            conversion['data_set_path'] = dest_path
            db.conversion.save(conversion)
            train_path=os.path.join(dest_path,'train')
            if not os.path.isdir(train_path):
                os.mkdir(train_path)
            convert_annotation_yolo(train, train_path, int(request.img_w),
                                                               int(request.img_h))
            conversion['status'] = 'converted_train'
            db.conversion.save(conversion)
            train_path = os.path.join(dest_path, 'test')
            if not os.path.isdir(train_path):
                os.mkdir(train_path)
            convert_annotation_yolo(train, train_path, int(request.img_w),
                                    int(request.img_h))
            conversion['status'] = 'end'
            db.conversion.save(conversion)

    except Exception as exc:
        returnstate = 'Error'
        logger.debug(exc)
    conversion['status'] = 'ENDED'
    conversion['modif_date'] = datetime.datetime.now().isoformat()
    conversion['exceptions'].append(exceptions)
    db.conversion.update_one({'_id': conversion_id}, {"$set": conversion}, upsert=False)

def convert_annotations_coco(dataset_id,annotations_list,destpath,record_name,img_w,img_h,conversion):
    if not os.path.isdir(destpath):
        os.mkdir(destpath)

    #annotations_list=[ObjectId(id) for id in annotations_list]
    output_filebase=os.path.join(destpath,record_name+'.record')

    num_shards=len([annotations_list])
   # coursor=db.annotations.find({"_id" : {"$in" : annotations_list}},no_cursor_timeout=True)

    try:
        with contextlib2.ExitStack() as tf_record_close_stack:
            output_tfrecords = tf_record_creation_util.open_sharded_output_tfrecords(
                tf_record_close_stack, output_filebase, num_shards)
            exceptions=[]
            for index, ano in enumerate(annotations_list):
                output_shard_index = index % num_shards
                exception=convert_annotation_obj_det(ano, output_tfrecords[output_shard_index],img_w,img_h)
                exceptions.extend(exception)

            #coursor.close()
            #output_tfrecords.close()
            conversion['exceptions'] = exceptions
            return 'success', conversion
    except Exception as e:
        conversion['status'] = 'ERROR'
        conversion['ERROR_MESSAGE'] = e
        conversion['modif_date'] = datetime.datetime.now().isoformat()
        conversion['exceptions']=exceptions
        db.conversion.update_one({'_id': conversion['_id']}, {"$set": conversion}, upsert=False)
        return 'ERROR', conversion


def main(argv=None):
    logger.debug('in main')
    # tf.InteractiveSession()
    # tf.initialize_all_variables().run()
    # logger.debug()
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



    # destpath='export'
    # record_name='tf_train'
    # img_w=600
    # img_h=600
    # annotations_list=['5c0dcd62da4618597d2f5798','']
    # # annotations = db.annotations.find()
    # # for anno in annotations:
    # #     annotations_list.append(str(anno['_id']))
    #
    # logger.debug(convert_annotations_coco(annotations_list,destpath,record_name,img_w,img_h))

if __name__ == '__main__':
    main()
