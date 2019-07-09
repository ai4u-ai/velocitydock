from object_detection import model_hparams
import tensorflow as tf
from object_detection import model_lib
import os
print(os.environ['PYTHONPATH'])


config = tf.estimator.RunConfig(model_dir="")


train_and_eval_dict = model_lib.create_estimator_and_inputs(
        run_config=config,
        hparams=model_hparams.create_hparams(True),
        pipeline_config_path='',
        train_steps=None,
        sample_1_of_n_eval_examples=1,
        sample_1_of_n_eval_on_train_examples=(
           5))