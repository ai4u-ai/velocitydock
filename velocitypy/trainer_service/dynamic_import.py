import inspect
import json
import math
import os
import pkgutil
import sys
from os.path import expanduser

from object_detection import model_hparams

from object_detection import model_lib
import numpy as np
from keras import applications
import keras


import importlib
import mongoclient as mongocl
from keras.models import Model
from keras.applications import Xception
from keras.layers import Dense, GlobalAveragePooling2D
from keras.optimizers import Adam
from keras import callbacks
from keras.applications import imagenet_utils
from keras.preprocessing.image import ImageDataGenerator
from keras.utils import np_utils
from keras.callbacks import EarlyStopping
from tensorflow.python import keras as tf_keras
from tensorflow.python.platform import tf_logging
import tensorflow as tf
import logging

from MongoLoggingHandler import MongoLoggingHandler

logger = logging.getLogger('root')
logger.debug('dynamic import')

tf.logging.set_verbosity(tf.compat.v1.logging.INFO)

log=tf_logging.get_logger()
#log = logging.getLogger('tensorflow')
log.setLevel(logging.DEBUG)

# create formatter and add it to the handlers
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
mongohandler=MongoLoggingHandler(logging.INFO)
mongohandler.setLevel(logging.INFO)

# create file handler which logs even debug messages
fh = logging.FileHandler(os.path.join(expanduser("~"),'trainer_server.log'))
fh.setLevel(logging.INFO)
fh.setFormatter(formatter)
log.addHandler(fh)
log.addHandler(mongohandler)

# from modulefinder import ModuleFinder
#
# name='xception'
# spec = importlib.util.find_spec(name)
# if spec is None:
#     print("can't find the xception module")
# else:
#     # If you chose to perform the actual import ...
#     module = importlib.util.module_from_spec(spec)
#     spec.loader.exec_module(module)
#     # Adding the module to sys.modules is optional.
#     sys.modules[name] = module
#
#
#
#
#
#
# for importer, modname, ispkg in pkgutil.iter_modules(package.__path__, prefix):
#     print ("Found submodule %s (is a package: %s)" % (modname, ispkg))
#     module = __import__(modname)
#     print("Imported", module)
from config_object_detection import config_object_det_algo


def load_model(name,weights='imagenet',include_top=False):
    # for mosulz in pkgutil.walk_packages(keras.__path__,keras.__name__+'.'):
    #
    #     if mosulz.name.split('.')[-1]==name.replace(' ','_').lower():
    #
    #         module=importlib.import_module(mosulz.name)
    #         class_=getattr(module,name.replace(' ',''))
    #         return class_(weights=weights, include_top=include_top)
    for mosulz in pkgutil.walk_packages(applications.__path__, applications.__name__ + '.'):


            module = importlib.import_module(mosulz.name)
            if hasattr(module, name.replace(' ', '')):
                class_ = getattr(module, name.replace(' ', ''))
                return class_(weights=weights, include_top=include_top)
            if hasattr(module, name.replace(' ','_').lower()):
                class_ = getattr(module, name.replace(' ','_').lower())
                return class_(weights=weights, include_top=include_top)


class LossAccuracyHistory(tf_keras.callbacks.Callback):
    def __init__(self,training, mongoclient):
        self.mongoclient = mongoclient
        self.training = training

        self.logger = logging.getLogger('root')

    def on_train_begin(self,logs={},):
        self.losses = []
        self.accuracies = []
        self.logger.debug('starting training')
        return
    def on_train_batch_end(self, batch, logs={}):
        self.losses.append(logs.get('loss'))
        self.accuracies.append(logs.get('acc'))
        self.mongoclient.update_training(self.training, 'losses', [str(loss) for loss in self.losses])
        self.mongoclient.update_training(self.training, 'accuracies', [str(i) for i in self.accuracies])
        self.logger.debug('train batch {} end  acc: {}'.format(batch,logs))
        self.mongoclient.update_training(self.training, 'status',
                                'train batch {} end  acc: {}'.format(batch,logs))
        return
    def on_test_batch_begin(self, batch, logs=None):
        self.losses.append(logs.get('loss'))
        self.accuracies.append(logs.get('acc'))
        self.mongoclient.update_training(self.training, 'losses', [str(loss) for loss in self.losses])
        self.mongoclient.update_training(self.training, 'accuracies', [str(i) for i in self.accuracies])
        self.logger.debug('test batch {} begin  acc: {}'.format(batch, logs))
        self.mongoclient.update_training(self.training, 'status',
                                     'test batch {} end  acc: {}'.format(batch, logs))
        return
    def on_test_batch_end(self, batch, logs=None):
        self.losses.append(logs.get('loss'))
        self.accuracies.append(logs.get('acc'))
        self.mongoclient.update_training(self.training, 'losses', [str(loss) for loss in self.losses])
        self.mongoclient.update_training(self.training, 'accuracies', [str(i) for i in self.accuracies])
        self.logger.debug('test batch {} end  acc: {}'.format(batch, logs))
        self.mongoclient.update_training(self.training, 'status',
                                     'test batch {} end  acc: {}'.format(batch, logs))
        return
    def on_epoch_end(self, epoch, logs={}):
        self.mongoclient.update_training(self.training, 'status',
                                     'epoch   {} end  acc: {}'.format(epoch, logs))
        self.losses.append(logs.get('loss'))
        self.logger.debug('epoch {} end  acc: {}'.format(epoch, logs))
        self.mongoclient.update_training(self.training, 'losses',  [str(loss) for loss in self.losses])
        self.accuracies.append(logs.get('acc'))
        self.logger.debug('epoch enn acc: {}'.format(str(logs.get('acc'))))
        self.mongoclient.update_training(self.training, 'accuracies', [str(i) for i in self.accuracies])
        return
def create_model_name(training):
        return training['endModel']['name']+'_'+training['algoType'].replace(' ','_').lower()


def train_object_det_model(training,base_path,modelname,dataset_train_path,dataset_test_path,classes,image_with= 200,image_height = 200,include_top=False,epochs=10,steps=10,class_mode='categorical',hparams_overrides=None):
    for handler in log.handlers:
        if handler.name == 'MongoLoggingHandler':
            handler.training = training
            handler.type_logging = 'TENSORFLOW'
    training_path = os.path.join(base_path, 'training')
    logger.debug('base_path : {}'.format(base_path))
    mongocl.update_training(training, 'status','base_path : {}'.format(base_path))
    mongocl.update_training(training, 'training_path', training_path)
    mongocl.update_training(training, 'status', 'training_path : {}'.format(training_path))
    logger.debug('training_path : {}'.format(training_path))
    model_path = os.path.join(training_path, 'model')
    logger.debug('model_path : {}'.format(model_path))
    mongocl.update_training(training, 'status', 'model_path : {}'.format(training_path))
    logdir = model_path
    logger.debug('logdir_path : {}'.format(logdir))
    mongocl.update_training(training, 'status', 'logdir_path : {}'.format(logdir))
    mongocl.update_training(training, 'logdir_path', logdir)
    logger.debug('training_path : {}'.format(training_path))
    mongocl.update_training(training, 'status', 'training_path : {}'.format(training_path))
    labels_path = os.path.join(training_path,'label_map.pbtxt')
    logger.debug('model_path : {}'.format(model_path))
    mongocl.update_training(training, 'status', 'model_path : {}'.format(model_path))
    mongocl.update_training(training, 'model_dir_path', model_path)
    logger.debug('labels_path : {}'.format(labels_path))
    mongocl.update_training(training, 'labels_path', labels_path)


    checkpoint_path = os.path.join(model_path, create_model_name(training) + '_weights.h5')

    mongocl.update_training(training, 'checkpoint_path', model_path)

    if not os.path.isdir(training_path):
        os.makedirs(training_path)
    if not os.path.isdir(model_path):
        os.makedirs(model_path)
    if not os.path.isdir(logdir):
        os.makedirs(logdir)
    mongocl.update_training(training, 'status', 'configuring pipeline ')
    pipeline_config_path = config_object_det_algo(model_name=modelname, destpath=training_path,
                                                  classes=classes,num_steps=epochs,from_detection_checkpoint=include_top,train_tf_record_path=dataset_train_path,eval_tf_record_path=dataset_test_path)

    config = tf.estimator.RunConfig(model_dir=model_path,log_step_count_steps=1)


    train_and_eval_dict = model_lib.create_estimator_and_inputs(
        run_config=config,
        hparams=model_hparams.create_hparams(hparams_overrides),
        pipeline_config_path=pipeline_config_path,
        train_steps=None,
        sample_1_of_n_eval_examples=1,
        sample_1_of_n_eval_on_train_examples=(
           5))
    estimator = train_and_eval_dict['estimator']
    train_input_fn = train_and_eval_dict['train_input_fn']
    eval_input_fns = train_and_eval_dict['eval_input_fns']
    eval_on_train_input_fn = train_and_eval_dict['eval_on_train_input_fn']
    predict_input_fn = train_and_eval_dict['predict_input_fn']
    train_steps = train_and_eval_dict['train_steps']
    mongocl.update_training(training, 'status', 'starting training')
    train_spec, eval_specs = model_lib.create_train_and_eval_specs(
        train_input_fn,
        eval_input_fns,
        eval_on_train_input_fn,
        predict_input_fn,
        train_steps,
        eval_on_train_data=False)

    # Currently only a single Eval Spec is allowed.

    tf.estimator.train_and_evaluate(estimator, train_spec, eval_specs[0])
    mongocl.update_training(training, 'status', 'end')




def train_model(training,base_path,modelname,dataset_train_path,dataset_test_path,image_with= 200,image_height = 200,include_top=False,epochs=10,steps=10,class_mode='categorical'):
   # dataset_path = '../../data'
    #image_with = 200
    #image_height = 200
   #
    # for handler in logger.handlers:
    #    if handler.name == 'MongoLoggingHandler':
    #        handler.training = training
    mongocl.update_training(training, 'status', 'configuring paths')
    training_path=os.path.join(base_path,'training')

    logdir=os.path.join(training_path,'logs')


    logger.debug('training path {}'.format(training_path))



    mongocl.update_training(training, 'logdir_path', logdir)


    logger.debug('logdir_path {}'.format(logdir))
    mongocl.update_training(training, 'training_path', training_path)
    model_path=os.path.join(training_path,'model')


    logger.debug('model_path {}'.format(model_path))
    labels_path=os.path.join(model_path,'labels.json')


    logger.debug('labels_path {}'.format(labels_path))
    mongocl.update_training(training, 'model_dir_path', model_path)




    mongocl.update_training(training, 'labels_path', labels_path)

    loggCallback=LossAccuracyHistory(training,mongocl)
    checkpoint_path = os.path.join(model_path,create_model_name(training)+'_weights.h5')


    logger.debug('checkpoint_path {}'.format( checkpoint_path))
    mongocl.update_training(training, 'checkpoint_path', checkpoint_path)

    if not os.path.isdir(training_path):
        os.makedirs(training_path)
    if not os.path.isdir(model_path):
        os.makedirs(model_path)
    if not os.path.isdir(logdir):
        os.makedirs(logdir)

       #callback functions
    cp_callback = callbacks.ModelCheckpoint(checkpoint_path,monitor = 'acc', verbose = 1, save_best_only = True, mode = 'max')


    mongocl.update_training(training, 'status', 'configuring callbacks')


    tensorboard_callback = keras.callbacks.TensorBoard(log_dir=logdir)

    es_callback = EarlyStopping(monitor='acc', mode='max', verbose=1, patience=50)

    dataset_gen = ImageDataGenerator(
        rescale=1. / 255,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True, validation_split=0.1)

    train_generator = dataset_gen.flow_from_directory(
        dataset_train_path,
        target_size=(image_with, image_height),
        batch_size=32,
        class_mode=class_mode,
        subset='training')  # set as training data

    validation_generator = dataset_gen.flow_from_directory(
        dataset_test_path,  # same directory as training data
        target_size=(image_with, image_height),
        batch_size=32,
        class_mode=class_mode,
        subset='validation')

    nb_class = len(train_generator.class_indices)
    labels=train_generator.class_indices
    with open(labels_path,'w') as file:
        json.dump(labels,file)


    mongocl.update_training(training, 'status', 'configuring images ')


    base_model = load_model(modelname, include_top=include_top, weights='imagenet')


    mongocl.update_training(training, 'status', 'loaded model: {}'.format(modelname))
    logger.debug('loaded model: {} '.format(modelname))


    try:
        if include_top is False:
            # add a global spatial average pooling layer
            x = base_model.output

            x = GlobalAveragePooling2D()(x)

            # let's add a fully-connected layer
            x = Dense(1024, activation='relu')(x)
            # and a logistic layer -- let's say we have 200 classes
            activation = 'softmax'
            if class_mode == 'binary':
                activation = 'sigmoid'
            predictions = Dense(nb_class, activation=activation)(x)

            # this is the model we will train
            model = Model(inputs=base_model.input, outputs=predictions)

            # first: train only the top layers (which were randomly initialized)
            # i.e. freeze all convolutional InceptionV3 layers
            for layer in base_model.layers:
                layer.trainable = False
        else:
            model = base_model

    except Exception as exc:
        logger.error(exc)
        logger.info('Loading full model failed to init transfer learning')
        model =  load_model(modelname, include_top=True, weights='imagenet')

    # compile the model (should be done *after* setting layers to non-trainable)
    # model.compile(optimizer='rmsprop', loss='categorical_crossentropy', metrics=['accuracy'])

    # train the model on the new data for a few epochs

    if os.path.isfile(os.path.join(training_path, create_model_name(training) + '_weights.h5')):
        model.load_weights(os.path.join(training_path, create_model_name(training) + '_weights.h5'))
        mongocl.update_training(training, 'status', 'loaded weights from {}'.format(os.path.join(training_path, create_model_name(training) + '_weights.h5')))
        logger.debug('loaded weights from {}'.format(os.path.join(training_path, create_model_name(training) + '_weights.h5')))
    if 'startFromPrevTraining' in training.keys():
        logger.debug('startFromPrevTraining')
        mongocl.update_training(training, 'status', 'startFromPrevTraining')
        prev_base_path=base_path.replace(str(training['_id']),training['startFromPrevTraining'])

        prev_training_path = os.path.join(prev_base_path, 'training')
        prev_model_path = os.path.join(prev_training_path, 'model')
        prev_labels_path = os.path.join(prev_model_path, 'labels.json')
        prev_training=mongocl.find_training(training['startFromPrevTraining'])
        with open(prev_labels_path) as file:
            prev_labels=json.load(file)
            logger.debug('loaded labels from {}'.format(prev_labels_path))
            mongocl.update_training(training, 'status', 'loaded labels from {}'.format(prev_labels_path))

        prev_checkpoint_path = os.path.join(prev_model_path, create_model_name(training)+'_weights.h5')

        if (prev_labels==labels):
            model=keras.models.load_model(prev_training['model_path'])
            logger.debug('loaded model from {} '.format(prev_training['model_path']) )
            mongocl.update_training(training, 'status', 'loaded model from {} '.format(prev_training['model_path']) )
        # else:
        #     restore weights with different model
        #     https: // github.com / keras - team / keras / issues / 7924
        #     # save the original weights
        #     model=load_model(prev_training['model_path'])
        #     weights_bak = model.layers[-1].get_weights()
        #     old_nb_classes = model.layers[-1].output_shape[-1]
        #
        #     model.layers.pop()
        #     activation = 'softmax'
        #     if class_mode == 'binary':
        #         activation = 'sigmoid'
        #
        #     new_layer = Dense(nb_class, activation=activation)
        #     out = new_layer(model.layers[-1].output)
        #     inp = model.input
        #     model = Model(inp, out)
        #     weights_new = model.layers[-1].get_weights()
        #
        #     # copy the original weights back
        #     weights_new[0][:, :-1] = weights_bak[0]
        #     weights_new[1][:-1] = weights_bak[1]
        #
        #     # use the average weight to init the new class.
        #     weights_new[0][:, -1] = np.mean(weights_bak[0], axis=1)
        #     weights_new[1][-1] = np.mean(weights_bak[1])
        #
        #     model.layers[-1].set_weights(weights_new)

        # create the base pre-trained model


    # model.fit_generator(train_generator
    #                     , steps_per_epoch=10,
    #                     epochs=50,
    #                     validation_data=validation_generator,
    #                     validation_steps=10, callbacks=[cp_callback])

    # at this point, the top layers are well trained and we can start fine-tuning
    # convolutional layers from inception V3. We will freeze the bottom N layers
    # and train the remaining top layers.

    # let's visualize layer names and layer indices to see how many layers
    # we should freeze:
    # for i, layer in enumerate(base_model.layers):
    #     print(i, layer.name)

    # we chose to train the top 2 inception blocks, i.e. we will freeze
    # the first 249 layers and unfreeze the rest:
    # for layer in model.layers[:249]:
    #     layer.trainable = False
    # for layer in model.layers[249:]:
    #     layer.trainable = True

    # we need to recompile the model for these modifications to take effect
    # we use SGD with a low learning rate
    #from tensorflow.python.keras.optimizers import SGD




    loss = 'categorical_crossentropy'
    if class_mode == 'binary':
        loss = 'binary_crossentropy'
    model.compile(optimizer=Adam(), loss=loss, metrics=['accuracy'])
    logger.debug('compiled model with loss: {}'.format(loss))


    mongocl.update_training(training, 'status', 'compiled model with loss: {}'.format(loss))
    # we train our model again (this time fine-tuning the top 2 inception blocks
    # alongside the top Dense layers
    mongocl.update_training(training,'status','training')


    logger.debug('starting training')


    mongocl.update_training(training, 'status', 'starting training')


    logger.debug('eval files found {}'.format(str(len(validation_generator.filepaths))))


    mongocl.update_training(training, 'status', 'eval files found {}'.format(str(len(validation_generator.filepaths))))

    logger.debug('train files found {}'.format(str(len(train_generator.filepaths))))


    mongocl.update_training(training, 'status', 'train files found {}'.format(str(len(train_generator.filepaths))))

    if len(validation_generator.filepaths)==0:
        logger.debug('setting eval_steps to None ')
        mongocl.update_training(training, 'status', 'setting eval_steps to None')
        eval_steps=None
        validation_generator=None
    else:
        eval_steps=math.ceil(len(train_generator.filepaths)/32)
        mongocl.update_training(training, 'status', 'setting eval_steps to {}'.format(str(eval_steps)))

        logger.debug('setting eval_steps to {}'.format(str(eval_steps)))

    model.fit_generator(train_generator
                        , steps_per_epoch=steps,
                        epochs=epochs,
                        validation_data=validation_generator,
                        validation_steps=eval_steps, callbacks=[cp_callback,loggCallback,tensorboard_callback])
    mongocl.update_training(training,'status','training_finished')


    logger.debug('training finished')

    mongocl.update_training(training, 'status', 'saving_model to {} '.format(os.path.join(model_path,create_model_name(training)+'.h5')))


    logger.debug('saving_model ')

    model.save(os.path.join(model_path,create_model_name(training)+'.h5'))


    mongocl.update_training(training, 'model_path', os.path.join(model_path,create_model_name(training)+'.h5'))


    logger.debug('model saved to  {}'.format(os.path.join(model_path,create_model_name(training)+'.h5')))


    mongocl.update_training(training, 'status',
                        'saved_model to {} '.format(os.path.join(model_path, create_model_name(training) + '.h5')))


    mongocl.update_training(training, 'status', 'end')
