import collections
import io
import multiprocessing
from threading import Thread
from shutil import copyfile
import cv2
import os
import glob
import pickle
from os import path

import numpy as np
import tensorflow as tf
from PIL import Image
import queue

from tensorflow.python.lib.io import file_io

import utils
from argparse import Namespace
from object_detection.dataset_tools import tf_record_creation_util

from PIL import Image
from object_detection.utils import dataset_util


def create_tf_example(image, imagepath, object_name, coordinates, annotation, class_number, index, anno_main):
    # TODO(user): Populate the following variables from your example.
    # newX = float(image.shape[1])
    # newY = float(image.shape[0])
    # oldX = float(annotation['origSize']['width'])
    # oldY = float(annotation['origSize']['height'])
    # selector = Namespace(**annotation['objectSelector'])
    # x1 = int(selector.x1)
    # x2 = int(selector.x2)
    # y1 = int(selector.y1)
    # y2 = int(selector.y2)
    class_label = annotation['objectSelector']['class']['name']
    # x1, y1 = utils.recalc_coordinates(newX=newX, newY=newY, oldX=oldX, oldY=oldY, x=x1, y=y1)
    # x2, y2 = utils.recalc_coordinates(newX=newX, newY=newY, oldX=oldX, oldY=oldY, x=x2, y=y2)
    (x1, y1, x2, y2) = coordinates
    # with Image.fromarray(image) as img:
    with tf.gfile.GFile(imagepath, 'rb') as fid:
        encoded_jpg = fid.read()
    encoded_jpg_io = io.BytesIO(encoded_jpg)
    _image = Image.open(encoded_jpg_io)
    (width, height) = _image.size

    if x2 >= width or y2 >= height or image.shape[0] != height or image.shape[1] != width:
        raise Exception("object width or height Error")
    filename = object_name + '.jpg'
    filename = filename.encode('utf8')
    image_format = b'jpeg'  # b'jpeg' or b'png'

    xmins = [float(x1) / width]  # List of normalized left x coordinates in bounding box (1 per box)
    xmaxs = [float(x2) / width]  # List of normalized right x coordinates in bounding box
    # (1 per box)
    ymins = [float(y1) / height]  # List of normalized top y coordinates in bounding box (1 per box)
    ymaxs = [float(y2) / height]  # List of normalized bottom y coordinates in bounding box
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
    yield tf_example, index, annotation, anno_main, object_name


class ReadAnnoError(Exception):
    def __init__(self, message, errors, path):
        # Call the base class constructor with the parameters it needs
        super().__init__(message)

        # Now for your custom code...
        self.errors = errors
        self.annopath = path


class ReadMediaError(Exception):
    def __init__(self, message, errors, path):
        # Call the base class constructor with the parameters it needs
        super().__init__(message)

        # Now for your custom code...
        self.errors = errors
        self.mediapath = path


def list_annotations():
    basepath = path.dirname(__file__)
    filepath = path.abspath(path.join(basepath, 'conversion/annotations'))
    # os.chdir(filepath)
    return [path.abspath(os.path.join(filepath, anno)) for anno in glob.glob(path.join(filepath, "*.p"))]


def save_tf_example(tf_example, index, annotations, anno_main, object_name):
    basepath = path.dirname(__file__)
    filepath = path.abspath(path.join(basepath, 'conversion/converted'))

    annotation_path = os.path.join(filepath, str(anno_main['_id']))
    tf_examples_path = os.path.join(annotation_path, 'tf_examples')
    if not os.path.isdir(tf_examples_path):
        os.makedirs(tf_examples_path, exist_ok=True)
    print('writing tf example to: ', os.path.join(tf_examples_path, object_name + ".p"))
    with open(os.path.join(tf_examples_path, object_name + '.p'), 'wb') as outfile:
        pickle.dump(tf_example, outfile, protocol=pickle.HIGHEST_PROTOCOL)


def read_annotations():
    annotations = []
    for annotation in list_annotations():
        try:
            with (open(annotation, "rb")) as openfile:
                yield pickle.load(openfile)
        except Exception as err:
            raise ReadAnnoError(err, err, annotation)


def initiate_media(annotations):
    basepath = path.dirname(__file__)
    filepath = path.abspath(path.join(basepath, 'conversion/media'))
    # os.chdir(filepath)

    errors = []
    for index, anno in enumerate(annotations):
        # print(os.path.isfile(anno['annotatedOnMedia']['name']))

        if not os.path.isfile(path.join(filepath, anno['annotatedOnMedia']['name'])):
            print("Media name " + anno['annotatedOnMedia']['name'])
            errors.append(ReadMediaError('no file', 'no file found',
                                         path.abspath(path.join(filepath, anno['annotatedOnMedia']['name']))))
            continue
        yield (path.abspath(os.path.join(filepath, anno['annotatedOnMedia']['name'])), anno, index)
    # print(errors)
    if len(errors):
        raise Exception(errors)


def save_annotation_images(video_path, annotations, classes, detect_objects=False):
    vidcap = cv2.VideoCapture(video_path)
    fps = vidcap.get(cv2.CAP_PROP_FPS)
    annotation = annotations['annotation'][0]
    print('annotation first time', annotation['currentTime'])
    vidcap.set(cv2.CAP_PROP_POS_MSEC, annotation['currentTime'])
    basepath = path.dirname(__file__)
    filepath = path.abspath(path.join(basepath, 'conversion/converted'))
    print(os.path.expanduser(filepath))
    # os.chdir(filepath)

    if not os.path.isdir(os.path.join(filepath, str(annotations['_id']))):
        os.makedirs(os.path.join(filepath, str(annotations['_id'])), exist_ok=True)

    annotation_path = os.path.join(filepath, str(annotations['_id']))

    classes_paths = []
    not_classes_paths = []
    for _class in classes:
        classes_paths.append(os.path.join(annotation_path, _class))
        not_classes_paths.append(os.path.join(os.path.join(annotation_path, _class), 'not_' + _class))
        if not os.path.isdir(os.path.join(annotation_path, _class)):
            os.makedirs(os.path.join(annotation_path, _class), exist_ok=True)
            os.makedirs(os.path.join(os.path.join(annotation_path, _class), 'not_' + _class), exist_ok=True)

    # os.chdir(path.abspath(path.join(filepath, str(annotations['_id'])))  )

    # current_millis = vidcap.get(cv2.CAP_PROP_POS_MSEC)
    current_frame = vidcap.get(cv2.CAP_PROP_POS_FRAMES)

    while True:
        success, image = vidcap.read()
        print('reading', success)
        if not success:
            break
        matching_annotations = [new_anntation for new_anntation in annotations['annotation'] if
                                utils.miliseconds_to_framenumber(new_anntation['currentTime'],
                                                                 fps) == current_frame]
        if len(matching_annotations) == 0:
            future_annotations = [new_anntation for new_anntation in annotations['annotation'] if
                                  utils.miliseconds_to_framenumber(new_anntation['currentTime'],
                                                                   fps) > current_frame]
            print('no matches')

            if len(future_annotations) == 0:
                break
            else:
                print('nr matches in the future found ', len(future_annotations))
                vidcap.set(cv2.CAP_PROP_POS_MSEC, future_annotations[0]['currentTime'])
                print('time set to ', future_annotations[0]['currentTime'])
                success, image = vidcap.read()
                print('read image in future match ', success)

        for match_index, annotation in enumerate(matching_annotations):
            print('booia')
            objects_to_return = []
            (x1, y1, x2, y2) = utils.convert_coordiates(image, annotation)
            cv2.imwrite(os.path.join(annotation_path, str(annotation['currentTime']) + '.jpg'), image)
            cv2.imwrite(os.path.join(classes_paths[classes.index(annotation['objectSelector']['class']['name'])],
                                     str(annotation['currentTime']) + '_' + str(match_index) + '.jpg'),
                        image[y1:y2, x1:x2])
            objects_to_return.append(
                (image, os.path.join(annotation_path, str(annotation['currentTime']) + '.jpg'),
                 str(annotation['currentTime']), (x1, y1, x2, y2), annotation,
                 classes.index(annotation['objectSelector']['class']['name']), annotations)
            )

            class_time_path = os.path.join(classes_paths[classes.index(annotation['objectSelector']['class']['name'])],
                                           str(annotation['currentTime']))
            class_time_path_not = os.path.join(
                not_classes_paths[classes.index(annotation['objectSelector']['class']['name'])],
                str(annotation['currentTime']))

            # print('writing image',os.path.join(classes_paths[classes.index(annotation['objectSelector']['class']['name'])], str(annotation['currentTime']) + '.jpg'))
            if detect_objects:
                boxes_in, boxes_out = utils.get_bounding_boxes_rel_area(image, (x1, y1, x2, y2))
                print('boxes in ', str(len(boxes_in)), 'boxes out ', str(len(boxes_out)))
                for index, box in enumerate(boxes_in):
                    (x, y, w, h) = box
                    cv2.imwrite(class_time_path + '_' + str(match_index) + '_' + str(index) + '.jpg',
                                image[y:y + h, x:x + w])
                    objects_to_return.append(
                        (
                            image, os.path.join(annotation_path, str(annotation['currentTime']) + '.jpg'),
                            str(annotation['currentTime']) + '_' + str(match_index) + '_' + str(index),
                            (x, y, x + w, y + h),
                            annotation,
                            classes.index(annotation['objectSelector']['class']['name']), annotations)
                    )
                    # print('writing box',
                    #       class_time_path + '_' + str(match_index) + '_' + str(index) + '.jpg')
                for index, box in enumerate(boxes_out):
                    (x, y, w, h) = box
                    cv2.imwrite(class_time_path_not + '_' + str(match_index) + '_' + str(index) + '.jpg',
                                image[y:y + h, x:x + w])
                    # print('writing box',
                    #       class_time_path_not + '_' + str(match_index) + '_' + str(index) + '.jpg')

            for object_to_return in objects_to_return:
                yield object_to_return

        # current_millis = vidcap.get(cv2.CAP_PROP_POS_MSEC)
        current_frame = vidcap.get(cv2.CAP_PROP_POS_FRAMES)
    # for index, annotation in enumerate(annotations['annotation']):
    #     print('iterating  '+str(annotations['_id'])+' '+str(index))
    #     vidcap.set(cv2.CAP_PROP_POS_MSEC, annotation['currentTime'])
    #     # just cue to 20 sec. position
    #     success, image = vidcap.read()
    #     print(success)
    #     cv2.imwrite(os.path.join(annotation_path,str(annotation['currentTime'])+'.jpg'), image)
    #     yield (image,os.path.join(annotation_path,str(annotation['currentTime'])+'.jpg'),annotation,classes.index(annotation['objectSelector']['class']['name']),annotations)


def convert_to_tf_records(video_path, anno, index, classes):
    for image, image_path, object_name, coordinates, annotation, annoclass, anno_main in save_annotation_images(
            video_path, anno, classes, detect_objects=True):

        print('secodn')
        for tf_example, index, annotation, anno_main, object_name, in create_tf_example(image, image_path, object_name,
                                                                                        coordinates, annotation,
                                                                                        annoclass,
                                                                                        index, anno_main):
            save_tf_example(tf_example, index, annotation, anno_main, object_name)


def convert_annotations(threding=False):
    q = queue.Queue()
    jobs = []

    classes = utils.find_all_classes()
    try:
        for video_path, anno, index in initiate_media(read_annotations()):
            print(video_path)
            # q.put(Thread(target=convert_to_tf_records, args=(video_path,anno,index)))
            if threding:
                process = multiprocessing.Process(target=convert_to_tf_records,
                                                  args=(video_path, anno, index, classes))
                jobs.append(process)
            else:
                convert_to_tf_records(video_path, anno, index, classes)
            # save_annotation_images(video, anno)
            # for image,image_path,annotation,annoclass,anno_main in save_annotation_images(video,anno):
            #
            #     print('secodn')
            #     for tf_example, index, annotation,anno_main in create_tf_example(image,image_path,annotation,annoclass,index,anno_main):
            #
            #         save_tf_example(tf_example, index, annotation,anno_main)

        if threding:
            for j in jobs:
                j.start()

                # Ensure all of the processes have finished
            for j in jobs:
                j.join()

        # while not q.empty():
        #     # print(q.get(), end=' ')
        #     print('starting a new thread')
        #
        #     _t=q.get()
        #     _t.start()
        #     # _t.join()
        #     print("thread finished...exiting")
        #
    except Exception as ex:
        print(ex)


def check_full_converison():
    classes = utils.find_all_classes()
    print(classes)
    i = 0
    for annotation in read_annotations():
        # print(annotation['_id'])
        for cl in classes:
            for anno in glob.glob('conversion/converted/' + str(annotation['_id']) + '/' + cl + '/' + '*.*',
                                  recursive=True):
                print(anno)
                i += 1
    ii = 0
    for annotation in read_annotations():
        for anno in annotation['annotation']:
            ii += 1
    print(i)
    print(ii)
    return ii - i


def inception_restruct():
    classes = utils.find_all_classes()
    print(check_full_converison())
    i = 0
    if not os.path.isdir("conversion/converted/inception"):
        os.makedirs("conversion/converted/inception", exist_ok=True)
    if not os.path.isdir("conversion/converted/inception/images"):
        os.makedirs("conversion/converted/inception/images", exist_ok=True)
    for cl in classes:
        if not os.path.isdir("conversion/converted/inception/images/" + cl):
            os.makedirs("conversion/converted/inception/images/" + cl, exist_ok=True)
        if not os.path.isdir("conversion/converted/inception/images/" + cl + '/' + 'not_' + cl):
            os.makedirs("conversion/converted/inception/images/" + cl + '/' + 'not_' + cl, exist_ok=True)
        for anno in glob.glob('conversion/converted/**/' + cl + '/*.jpg'):
            print(os.path.basename(anno))
            if not os.path.isfile(os.path.join('conversion/converted/inception/images/' + cl, os.path.basename(anno))):
                copyfile(anno, os.path.join('conversion/converted/inception/images/' + cl, os.path.basename(anno)))
            else:
                print('file exists')
            i += 1
        for anno in glob.glob('conversion/converted/**/' + cl + '/' + 'not_' + cl + '/*.jpg'):
            print(os.path.basename(anno))
            if not os.path.isfile(os.path.join('conversion/converted/inception/images/' + cl + '/' + 'not_' + cl,
                                               os.path.basename(anno))):
                copyfile(anno, os.path.join('conversion/converted/inception/images/' + cl + '/' + 'not_' + cl,
                                            os.path.basename(anno)))
            else:
                print('file exists')
            i += 1
    print('converted files', str(i))

def get_objects_structured():
    classes = utils.find_all_classes()
    basepath = '/Users/ivanjacobs/Documents/development/deme/'

    files = {}
    objects = set()
    for cl in classes:

        for anno in glob.glob(basepath + 'conversion/converted/**/' + cl + '/*.jpg'):
            curr_class = cl
            frame = os.path.basename(anno).split('_', 1)[0]
            print(os.path.basename(anno).count('_'))
            if os.path.basename(anno).count('_') == 2:
                iteration_match = os.path.basename(anno).split('_', 1)[1].split('_')[0]
            else:
                iteration_match = os.path.basename(anno).split('_', 2)[1].split('.')[0]
                continue
            print(frame)
            if curr_class in files.keys():

                if frame in files[curr_class].keys():
                    if iteration_match in files[curr_class][frame]['in'].keys():
                        idx = os.path.basename(anno).split('_' + iteration_match, 1)[1].split('_')[1].split('.')[0]
                        objects.add(int(idx))
                        files[curr_class][frame]['in'][iteration_match][idx] = anno

                    else:
                        files[curr_class][frame]['in'] = {}
                        files[curr_class][frame]['in'][iteration_match] = collections.OrderedDict()
                        idx = os.path.basename(anno).split('_' + iteration_match, 1)[1].split('_')[1].split('.')[0]
                        objects.add(int(idx))
                        files[curr_class][frame]['in'][iteration_match][idx] = anno

                else:
                    files[curr_class][frame] = {}
                    files[curr_class][frame]['in'] = {}
                    files[curr_class][frame]['in'][iteration_match] = {}
                    idx = os.path.basename(anno).split('_' + iteration_match, 1)[1].split('_')[1].split('.')[0]
                    objects.add(int(idx))
                    files[curr_class][frame]['in'][iteration_match][idx] = anno

            else:
                files[curr_class] = {}
                files[curr_class][frame] = {}
                files[curr_class][frame]['in'] = {}
                files[curr_class][frame]['in'][iteration_match] = {}
                idx = os.path.basename(anno).split('_' + iteration_match, 1)[1].split('_')[1].split('.')[0]
                objects.add(int(idx))
                files[curr_class][frame]['in'][iteration_match][idx] = anno

        for anno in glob.glob(basepath + 'conversion/converted/**/' + cl + '/' + 'not_' + cl + '/*.jpg'):
            curr_class = cl
            frame = os.path.basename(anno).split('_', 1)[0]
            print(os.path.basename(anno).count('_'))
            if os.path.basename(anno).count('_') == 2:
                iteration_match = os.path.basename(anno).split('_', 1)[1].split('_')[0]
            else:
                iteration_match = os.path.basename(anno).split('_', 2)[1].split('.')[0]
                continue
            print(frame)
            if curr_class in files.keys():

                if frame in files[curr_class].keys():
                    if 'out' not in files[curr_class][frame]:
                        files[curr_class][frame]['out'] = {}
                    if iteration_match in files[curr_class][frame]['out'].keys():
                        idx = os.path.basename(anno).split('_' + iteration_match, 1)[1].split('_')[1].split('.')[0]
                        objects.add(int(idx))
                        files[curr_class][frame]['out'][iteration_match][idx] =anno

                    else:
                        files[curr_class][frame]['out'] = {}
                        files[curr_class][frame]['out'][iteration_match] = {}
                        idx = os.path.basename(anno).split('_' + iteration_match, 1)[1].split('_')[1].split('.')[0]
                        objects.add(int(idx))
                        files[curr_class][frame]['out'][iteration_match][idx] = anno

                else:
                    files[curr_class][frame] = {}
                    files[curr_class][frame]['out'] = {}
                    files[curr_class][frame]['out'][iteration_match] = {}
                    idx = os.path.basename(anno).split('_' + iteration_match, 1)[1].split('_')[1].split('.')[0]
                    objects.add(int(idx))
                    files[curr_class][frame]['out'][iteration_match][idx] = anno

            else:
                files[curr_class] = {}
                files[curr_class][frame] = {}
                files[curr_class][frame]['out'] = {}
                files[curr_class][frame]['out'][iteration_match] = {}
                idx = os.path.basename(anno).split('_' + iteration_match, 1)[1].split('_')[1].split('.')[0]
                objects.add(int(idx))
                files[curr_class][frame]['out'][iteration_match][idx] = anno

    objects = list(sorted(objects))
    return objects,files
def prepare_for_training(objects,files):
    results = list()
    labels = list()
    for key, class_ in files.items():
        for frame_key, frame in class_.items():
            for cocation_key, location in frame.items():
                for annotation_key, annotation in location.items():
                    for object_key, object in annotation.items():
                        results.append(object)
                        labels.append(objects.index(int(object_key)))
    return np.array(labels),np.array(results)
def main():
    # convert_annotations()






    labels,results=prepare_for_training(get_objects_structured())
    batch_size=300
    idx = np.arange(batch_size)
    np.random.shuffle(idx)
    filepaths =results[idx]
    labels = labels[idx]
    print(filepaths)
    print(labels)
    # for dir_name, sub_dirs, leaf_files in file_io.walk('/Users/ivanjacobs/Documents/development/deme/conversion/converted/inception/images'):
    #     # for sub_dir in sub_dirs:
    #     # print(dir_name,leaf_files)
    #     # print(leaf_files)
    #     for leaf_file in leaf_files:
    #         print(leaf_file)
    #         leaf_file_path = os.path.join(dir_name, leaf_file)
    #         curr_class = os.path.basename(dir_name)
    #         class_index = classes.index(curr_class)
    #         if curr_class in files.keys():
    #             files[curr_class].append(leaf_file_path)
    #         else:
    #             files[curr_class] = list()
    #             files[curr_class].append(leaf_file_path)
    # convert_annotations()

    # q = queue.Queue()
    # jobs = []
    #
    # # for video_path, anno, index in initiate_media(read_annotations()):
    # #     convert_to_tf_records(video_path,anno,index)
    #
    # try:
    #     for video_path,anno,index in initiate_media(read_annotations()):
    #         print(video_path)
    #         # q.put(Thread(target=convert_to_tf_records, args=(video_path,anno,index)))
    #         process = multiprocessing.Process(target=convert_to_tf_records,
    #                                           args=(video_path,anno,index))
    #         jobs.append(process)
    #
    #         # save_annotation_images(video, anno)
    #         # for image,image_path,annotation,annoclass,anno_main in save_annotation_images(video,anno):
    #         #
    #         #     print('secodn')
    #         #     for tf_example, index, annotation,anno_main in create_tf_example(image,image_path,annotation,annoclass,index,anno_main):
    #         #
    #           #         save_tf_example(tf_example, index, annotation,anno_main)
    #
    #     for j in jobs:
    #         j.start()
    #
    #         # Ensure all of the processes have finished
    #     for j in jobs:
    #         j.join()
    #
    #     # while not q.empty():
    #     #     # print(q.get(), end=' ')
    #     #     print('starting a new thread')
    #     #
    #     #     _t=q.get()
    #     #     _t.start()
    #     #     # _t.join()
    #     #     print("thread finished...exiting")
    #     #
    # except Exception as ex:
    #     print(ex)


if __name__ == '__main__':
    main()
