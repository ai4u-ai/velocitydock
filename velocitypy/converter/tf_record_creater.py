import glob
import os
import pickle
import numpy as np
import tensorflow as tf
import contextlib2
from object_detection.dataset_tools import tf_record_creation_util

flags = tf.app.flags
flags.DEFINE_string('output_path', 'train.tfrecords', 'Path to output TFRecord')
flags.DEFINE_string('eval_output_path', 'eval.tfrecords', 'Path to output TFRecord')
FLAGS = flags.FLAGS
basepath = os.path.dirname(__file__)
filepath = os.path.abspath(os.path.join(basepath, 'conversion/converted'))
def find_tf_exapmles():
    basepath = os.path.dirname(__file__)
    filepath = os.path.abspath(os.path.join(basepath,'conversion/converted'))
    # filepath='annotations'
    for anno in glob.iglob(filepath+"/**/*.p",recursive=True):
        print(anno)
    return [os.path.abspath(anno) for anno in glob.iglob(filepath+"/**/*.p",recursive=True)]

tf_examples=find_tf_exapmles()
writer_ = tf.python_io.TFRecordWriter(filepath+'/'+FLAGS.output_path)
output_filebase = filepath+'/'+'train_dataset.record'
num_shards = 10
with contextlib2.ExitStack() as tf_record_close_stack:
    output_tfrecords = tf_record_creation_util.open_sharded_output_tfrecords(
        tf_record_close_stack, output_filebase, num_shards)
    for index, ano in enumerate(tf_examples):
        # convert_annotation_yolo(ano)
        try:
            with (open(ano,"rb")) as openfile:
                tf_example=pickle.load(openfile)
        except Exception as err:
            print(err)
            continue

        output_shard_index = index % num_shards
        result = tf.train.Example.FromString(tf_example.SerializeToString())
        writer_.write(tf_example.SerializeToString())
        output_tfrecords[output_shard_index].write(tf_example.SerializeToString())

writer_.close()

mask = np.random.choice([False, True], len(tf_examples), p=[0.90, 0.10])

writer_ = tf.python_io.TFRecordWriter(filepath+'/'+FLAGS.eval_output_path)
output_filebase = filepath+'/'+'eval_dataset.record'
num_shards = 10
with contextlib2.ExitStack() as tf_record_close_stack:
    output_tfrecords = tf_record_creation_util.open_sharded_output_tfrecords(
        tf_record_close_stack, output_filebase, num_shards)
    for index, ano in enumerate(np.array(tf_examples)[mask]):
        # convert_annotation_yolo(ano)
        try:
            with (open(ano,"rb")) as openfile:
                tf_example=pickle.load(openfile)
        except Exception as err:
            print(err)
            continue

        output_shard_index = index % num_shards
        result = tf.train.Example.FromString(tf_example.SerializeToString())
        writer_.write(tf_example.SerializeToString())
        output_tfrecords[output_shard_index].write(tf_example.SerializeToString())

writer_.close()

for index,example in enumerate(tf.python_io.tf_record_iterator(path=filepath+"/train.tfrecords")):
    result = tf.train.Example.FromString(example)
    print(index)


for index,example in enumerate(tf.python_io.tf_record_iterator(path=filepath+"/eval.tfrecords")):
    result = tf.train.Example.FromString(example)
    print(index)
