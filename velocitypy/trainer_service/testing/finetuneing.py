import os

from tensorflow.python.keras.applications.inception_v3 import InceptionV3
from tensorflow.python.keras.preprocessing import image
from tensorflow.python.keras.models import Model
from tensorflow.python.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.python.keras import backend as K
from tensorflow.python.keras.preprocessing.image import ImageDataGenerator
from tensorflow.python.keras import callbacks

checkpoint_path = "training/cp.ckpt"
checkpoint_dir = os.path.dirname(checkpoint_path)

# Create checkpoint callback
cp_callback = callbacks.ModelCheckpoint(checkpoint_path,
                                        save_weights_only=True,
                                        verbose=1)
dataset_path = '../../data'
image_with = 200
image_height = 200
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

# create the base pre-trained model
base_model = InceptionV3(weights='imagenet', include_top=False)

# add a global spatial average pooling layer
x = base_model.output
x = GlobalAveragePooling2D()(x)
# let's add a fully-connected layer
x = Dense(1024, activation='relu')(x)
# and a logistic layer -- let's say we have 200 classes
predictions = Dense(nb_class, activation='softmax')(x)

# this is the model we will train
model = Model(inputs=base_model.input, outputs=predictions)

# first: train only the top layers (which were randomly initialized)
# i.e. freeze all convolutional InceptionV3 layers
for layer in base_model.layers:
    layer.trainable = False

# compile the model (should be done *after* setting layers to non-trainable)
model.compile(optimizer='rmsprop', loss='categorical_crossentropy',metrics=['accuracy'])

# train the model on the new data for a few epochs
model.load_weights('training/cp.ckpt')

model.fit_generator(train_generator
                    , steps_per_epoch=10,
                    epochs=50,
                    validation_data=validation_generator,
                    validation_steps=10,callbacks = [cp_callback])


# at this point, the top layers are well trained and we can start fine-tuning
# convolutional layers from inception V3. We will freeze the bottom N layers
# and train the remaining top layers.

# let's visualize layer names and layer indices to see how many layers
# we should freeze:
for i, layer in enumerate(base_model.layers):
    print(i, layer.name)

# we chose to train the top 2 inception blocks, i.e. we will freeze
# the first 249 layers and unfreeze the rest:
for layer in model.layers[:249]:
    layer.trainable = False
for layer in model.layers[249:]:
    layer.trainable = True

# we need to recompile the model for these modifications to take effect
# we use SGD with a low learning rate
from tensorflow.python.keras.optimizers import SGD

model.compile(optimizer=SGD(lr=0.0001, momentum=0.9), loss='categorical_crossentropy' ,metrics=['accuracy'])

# we train our model again (this time fine-tuning the top 2 inception blocks
# alongside the top Dense layers
model.fit_generator(train_generator
                    , steps_per_epoch=100,
                    epochs=50,
                    validation_data=validation_generator,
                    validation_steps=100, callbacks = [cp_callback])
model.save('inceptionV3.h5')