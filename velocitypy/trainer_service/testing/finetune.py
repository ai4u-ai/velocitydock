import numpy as np
from tensorflow.python.keras.models import Model
from tensorflow.python.keras.applications import Xception
from tensorflow.python.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.python.keras.optimizers import Adam
from tensorflow.python.keras import callbacks
from tensorflow.python.keras.applications import imagenet_utils
from tensorflow.python.keras.preprocessing.image import ImageDataGenerator
from tensorflow.python.keras.utils import np_utils
from tensorflow.python.keras.callbacks import EarlyStopping
dataset_path = '../../data'
image_with = 200
image_height = 200

checkpoint_path = "training/cp.ckpt"
cp_callback = callbacks.ModelCheckpoint(checkpoint_path,
                                        save_weights_only=True,
                                        verbose=1)
dataset_gen = ImageDataGenerator(
    rescale=1. / 255,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True, validation_split=0.1)

train_generator = dataset_gen.flow_from_directory(
    dataset_path,
    target_size=(image_with, image_height),
    batch_size=32,
    class_mode='categorical',
    subset='training')  # set as training data

validation_generator = dataset_gen.flow_from_directory(
    dataset_path,  # same directory as training data
    target_size=(image_with, image_height),
    batch_size=32,
    class_mode='categorical',
    subset='validation')

nb_class = len(train_generator.class_indices)


xception_model = Xception(weights='imagenet', include_top=False)
x = xception_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(1024, activation='relu')(x)
predictions = Dense(nb_class, activation='softmax')(x)
model = Model(inputs=xception_model.input, outputs=predictions)

for layer in xception_model.layers:
 layer.trainable = False

opt = Adam()
model.compile(optimizer=opt, loss='categorical_crossentropy', metrics=['accuracy'])
model.summary()
my_callbacks = [EarlyStopping(monitor='val_acc', patience=5, verbose=0),cp_callback]

model.fit_generator(train_generator
                     , steps_per_epoch=10,
                     epochs=100,

                     validation_data=validation_generator,
                     validation_steps=10, callbacks=my_callbacks)

for layer in model.layers[:115]:
     layer.trainable = False
for layer in model.layers[115:]:
     layer.trainable = True


opt_finetune = Adam()
model.compile(optimizer=opt_finetune, loss='categorical_crossentropy', metrics=['accuracy'])
model.summary()

model.fit_generator(train_generator
                     , steps_per_epoch=10,
                     epochs=100,

                     validation_data=validation_generator,
                     validation_steps=10, callbacks=my_callbacks)
model.save('inceptionV3.h5')