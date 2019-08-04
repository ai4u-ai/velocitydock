
import sys
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import tensorflow as tf
try:
        # noinspection PyPackageRequirements
        import os
        from tensorflow import logging

        tf.compat.v1.logging.set_verbosity(tf.compat.v1.logging.ERROR)
        os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

        # Monkey patching deprecation utils to shut it up! Maybe good idea to disable this once after upgrade
        # noinspection PyUnusedLocal
        def deprecated(date, instructions, warn_once=True):
            def deprecated_wrapper(func):
                return func
            return deprecated_wrapper

        from tensorflow.python.util import deprecation
        deprecation.deprecated = deprecated

except ImportError:
        pass
def main():
    if tf.test.is_gpu_available():
        print('yes')
        sys.exit(1)
    if not tf.test.is_gpu_available():
        print('no')
        sys.exit(0)

if __name__ == "__main__":
    main()