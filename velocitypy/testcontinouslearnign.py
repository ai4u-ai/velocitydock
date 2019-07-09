import threading

import numpy as np
from tensorflow.python.keras.layers import Dense
from tensorflow.python.keras.models import load_model, Model


import tensorflow as tf
import tensorboard as tb
import tensorboard.program
import tensorboard.default

from tensorboard import program
import time

class tf_board(object):
    def __init__(self):
        tb = program.TensorBoard()
        tb.configure(argv=[None, '--logdir', '/Users/ivanjacobs/models/ivanjacobs/first/Inception V3/'])


        self.server=tb._make_server()
    def reset_server(self,args):
        tb = program.TensorBoard()
        tb.configure(argv=args)
        self.server = tb._make_server()


    def start_server(self):
        self.server.serve_forever()
    def stop_server(self):
        self.server.shutdown()



tf_board=tf_board()

x = threading.Thread(target=tf_board.start_server)
x.start()
print('started')
time.sleep(20)

print('reset')
tf_board.stop_server()
tf_board.reset_server([None, '--logdir', '/Users/ivanjacobs/models/ivanjacobs/first/Inception V3/'])
x = threading.Thread(target=tf_board.start_server)
x.start()




#
# model = load_model('first_inception_v3.h5')
# fully_conn=last_layer=model.layers[-2]
# last_layer=model.layers[-1]
# weights_bak = model.layers[-1].get_weights()
# old_nb_classes = model.layers[-1].output_shape[-1]
# nr_neurons=model.layers[-1].input_shape[-1]
# model.layers.pop()
#
# print(model.layers)
#
# new_layer = Dense(old_nb_classes+10,input_shape=(nr_neurons,(old_nb_classes+10)), activation='softmax',name='final_layer')
# out = new_layer(model.layers[-1].output)
# inp = model.input
# model = Model(inp, out)
# weights_new = model.layers[-1].get_weights()
#
# # copy the original weights back
# weights_new[0][:, :-abs(old_nb_classes-10)] = weights_bak[0]
# weights_new[1][:-1] = weights_bak[1]
#
# # use the average weight to init the new class.
# weights_new[0][:, -1] = np.mean(weights_bak[0], axis=1)
# weights_new[1][-1] = np.mean(weights_bak[1])
#
# model.layers[-1].set_weights(weights_new)


