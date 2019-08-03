import threading
import zipfile
from flask import request, jsonify
from flask import Flask, send_from_directory, current_app, send_file,redirect
import os
from os.path import expanduser
from flask.templating import Environment
from tensorboard import program

from trainer_service.dynamic_import import load_all_algo_comp_vision,load_optimizers
from mongoclient import zipdir
algos=[
{'name':'ssd_mobilenet_v1_coco','url':'http://download.tensorflow.org/models/object_detection/ssd_mobilenet_v1_coco_2018_01_28.tar.gz'},
{'name':'ssd_mobilenet_v1_0.75_depth_coco','url':'http://download.tensorflow.org/models/object_detection/ssd_mobilenet_v1_0.75_depth_300x300_coco14_sync_2018_07_03.tar.gz'},
{'name':'ssd_mobilenet_v1_quantized_coco','url':'http://download.tensorflow.org/models/object_detection/ssd_mobilenet_v1_quantized_300x300_coco14_sync_2018_07_18.tar.gz'},
{'name':'ssd_mobilenet_v1_0.75_depth_quantized_coco','url':'http://download.tensorflow.org/models/object_detection/ssd_mobilenet_v1_0.75_depth_quantized_300x300_coco14_sync_2018_07_18.tar.gz'},
{'name':'ssd_mobilenet_v1_ppn_coco','url':'http://download.tensorflow.org/models/object_detection/ssd_mobilenet_v1_ppn_shared_box_predictor_300x300_coco14_sync_2018_07_03.tar.gz'},
{'name':'ssd_mobilenet_v1_fpn_coco','url':'http://download.tensorflow.org/models/object_detection/ssd_mobilenet_v1_fpn_shared_box_predictor_640x640_coco14_sync_2018_07_03.tar.gz'},

{'name':'ssd_resnet_50_fpn_coco','url':'http://download.tensorflow.org/models/object_detection/ssd_resnet50_v1_fpn_shared_box_predictor_640x640_coco14_sync_2018_07_03.tar.gz'},
{'name':'ssd_mobilenet_v2_coco','url':'http://download.tensorflow.org/models/object_detection/ssd_mobilenet_v2_coco_2018_03_29.tar.gz'},
{'name':'ssd_mobilenet_v2_quantized_coco','url':'http://download.tensorflow.org/models/object_detection/ssd_mobilenet_v2_quantized_300x300_coco_2019_01_03.tar.gz'},
{'name':'ssdlite_mobilenet_v2_coco','url':'http://download.tensorflow.org/models/object_detection/ssdlite_mobilenet_v2_coco_2018_05_09.tar.gz'},
{'name':'ssd_inception_v2_coco','url':'http://download.tensorflow.org/models/object_detection/ssd_inception_v2_coco_2018_01_28.tar.gz'},
{'name':'faster_rcnn_inception_v2_coco','url':'http://download.tensorflow.org/models/object_detection/faster_rcnn_inception_v2_coco_2018_01_28.tar.gz'},
{'name':'faster_rcnn_resnet50_coco','url':'http://download.tensorflow.org/models/object_detection/faster_rcnn_resnet50_coco_2018_01_28.tar.gz'},
{'name':'faster_rcnn_resnet50_lowproposals_coco','url':'http://download.tensorflow.org/models/object_detection/faster_rcnn_resnet50_lowproposals_coco_2018_01_28.tar.gz'},
{'name':'rfcn_resnet101_coco','url':'http://download.tensorflow.org/models/object_detection/rfcn_resnet101_coco_2018_01_28.tar.gz'},
{'name':'faster_rcnn_resnet101_coco','url':'http://download.tensorflow.org/models/object_detection/faster_rcnn_resnet101_coco_2018_01_28.tar.gz'},
{'name':'faster_rcnn_resnet101_lowproposals_coco','url':'http://download.tensorflow.org/models/object_detection/faster_rcnn_resnet101_lowproposals_coco_2018_01_28.tar.gz'},
{'name':'faster_rcnn_inception_resnet_v2_atrous_coco','url':'http://download.tensorflow.org/models/object_detection/faster_rcnn_inception_resnet_v2_atrous_coco_2018_01_28.tar.gz'},
{'name':'faster_rcnn_inception_resnet_v2_atrous_lowproposals_coco','url':'http://download.tensorflow.org/models/object_detection/faster_rcnn_inception_resnet_v2_atrous_lowproposals_coco_2018_01_28.tar.gz'},
{'name':'faster_rcnn_nas','url':'http://download.tensorflow.org/models/object_detection/faster_rcnn_nas_coco_2018_01_28.tar.gz'},
{'name':'faster_rcnn_nas_lowproposals_coco','url':'http://download.tensorflow.org/models/object_detection/faster_rcnn_nas_lowproposals_coco_2018_01_28.tar.gz'},
{'name':'mask_rcnn_inception_resnet_v2_atrous_coco','url':'http://download.tensorflow.org/models/object_detection/mask_rcnn_inception_resnet_v2_atrous_coco_2018_01_28.tar.gz'},
{'name':'mask_rcnn_inception_v2_coco','url':'http://download.tensorflow.org/models/object_detection/mask_rcnn_inception_v2_coco_2018_01_28.tar.gz'},
{'name':'mask_rcnn_resnet101_atrous_coco','url':'http://download.tensorflow.org/models/object_detection/mask_rcnn_resnet101_atrous_coco_2018_01_28.tar.gz'},
{'name':'mask_rcnn_resnet50_atrous_coco','url':'http://download.tensorflow.org/models/object_detection/mask_rcnn_resnet50_atrous_coco_2018_01_28.tar.gz'},]
class tf_board(object):
    def __init__(self):
        self.tb = program.TensorBoard()
        self.tb.configure(argv=[None, '--logdir', '/Users/ivanjacobs/models/ivanjacobs/first/Inception V3/'])


        self.server=self.tb._make_server()
    def reset_server(self,args):
        tb = program.TensorBoard()
        tb.configure(argv=args)
        self.server = tb._make_server()


    def start_server(self):
        self.server.serve_forever()
    def stop_server(self):
        self.server.shutdown()
    def get_url(self):
        return self.server.get_url()

import logging

formatter = logging.Formatter(fmt='%(asctime)s - %(levelname)s - %(module)s - %(message)s')
logging.basicConfig(filename=os.path.join(expanduser("~"),'downloadservice.log'),  filemode='a')
handler = logging.StreamHandler()
handler.setFormatter(formatter)
fh=logging.FileHandler(os.path.join(expanduser("~"),'downloadservice.log'))
fh.setFormatter(formatter)
logger = logging.getLogger('root')
logger.setLevel(logging.DEBUG)
logger.addHandler(handler)
logger.addHandler(fh)


ptath=expanduser("~")
from flask_cors import CORS
app = Flask(__name__,static_url_path='',root_path=ptath)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

tf_board=tf_board()
@app.route('/downloads/<path:filename>', methods=['GET', 'POST'])
def download_model(filename):
    try:
        logger.debug('download request {}'.format(filename))

        filename='/' + filename
        logger.debug(app.root_path)
        if os.path.isdir(filename):
            zip_dest=os.path.join(filename,'export.tar.gz')
            zipf = zipfile.ZipFile(zip_dest, 'w', zipfile.ZIP_DEFLATED)
            zipdir(filename, zipf,'export.tar.gz')
            zipf.close()
            filename=zip_dest

        logger.debug('newfilename'.format(filename))
    except Exception as exc:
        logger.error(exc)
        return
    return send_file(filename,as_attachment=True)

@app.route('/getAlgoNames/', methods=['GET'])
def get_algo_names():
    alg=[algo['name'] for algo in algos]
    alg.extend(list(set(load_all_algo_comp_vision())))
    return jsonify(alg)

@app.route('/getOptimisersNames/', methods=['GET'])
def get_optimizer_names():

    return jsonify(list(set(load_optimizers())))

@app.route('/stats/', methods=['GET', 'POST'])
def server_stats():

    try:

        trainingpath=request.args.get('path')
        host=request.args.get('host')
        logger.debug('tensrobard request'.format(trainingpath))
        tf_board.reset_server([None, '--logdir', trainingpath])
        x = threading.Thread(target=tf_board.start_server)
        x.start()
        port=tf_board.get_url().split(':')[-1]
    except Exception as exc:
        logger.error(exc)
        return
    return redirect(host+':'+port, code=302)

if __name__ == '__main__':
    app.run(debug=True, use_debugger=False, use_reloader=False, passthrough_errors=True, host='0.0.0.0')
    logger.debug('download service running')