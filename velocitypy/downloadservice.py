import threading
import zipfile
from flask import request
from flask import Flask, send_from_directory, current_app, send_file,redirect
import os
from os.path import expanduser
from flask.templating import Environment
from tensorboard import program
from mongoclient import zipdir
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

app = Flask(__name__,static_url_path='',root_path=ptath)


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