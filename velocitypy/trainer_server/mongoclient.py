import glob
import tarfile

from pymongo import MongoClient
import gridfs
from bson.objectid import ObjectId
from bson.binary import Binary
import base64


import os
import zipfile


client= MongoClient("mongodb://localhost:27015")
db = client.velocity
fs = gridfs.GridFS(db)
fsBuck=gridfs.GridFSBucket(db)

def readimage(imageid):
    outputdata=fs.get(ObjectId(imageid)).read();
    # outfilename = "test.jpeg"
    # output = open(outfilename, "w")
    # output.write(outputdata)
    # output.close()
    return outputdata

def downloadAnnotations(annotations,imagename):

    for _annoatation in annotations:
        annotation=db.annotations.find_one({'_id': ObjectId(_annoatation)})
        path='annotations'
        if not os.path.exists(os.path.join(imagename,path)):
           os.makedirs(os.path.join(imagename,path))
        for anno in annotation["annotation"]:
           print(anno["objectSelector"]["dataUrl"])
           filename=str(int(anno["currentTime"]))+".jpeg"
           classname=str(anno["objectSelector"]["class"]["name"])
           if not os.path.isdir(imagename+'/'+path+'/'+classname):
            os.makedirs(imagename+'/'+path+'/'+classname)
           with open(os.path.join(os.path.join(os.path.join(imagename,path),classname), filename), "wb") as fh:
            fh.write(base64.decodestring(anno["objectSelector"]["dataUrl"].split(',', 1)[-1]))

def downloadModel(_model,imagename,retrain):
    model = db.algomodels.find_one({'_id': ObjectId(_model)})
    path = 'imagenet'
    modelname=''
    if not os.path.exists(os.path.join(imagename, path)):
        os.makedirs(os.path.join(imagename, path))
    if retrain:
        with open(os.path.join(imagename,'exportmodel.tar.gz'), "wb") as fh:
            fh.write(fs.get(ObjectId(model["modelZipped"])).read())
            tar= tarfile.open(os.path.join(imagename,'exportmodel.tar.gz'), 'r:gz');
            try:
                tar.extractall(imagename);
                tar.close();
            except Exception as e:
                print str(e)





    with open(os.path.join(os.path.join(imagename,path),model['name']), "wb") as fh:
            print ObjectId(model["model"]["id"])
            fh.write(fs.get(ObjectId(model["model"]["id"])).read())
            modelname=model['name']

    return os.path.join(imagename,path),modelname

def downloadModelZipped(zipid):
    with open('exportmodel.tar.gz', "wb") as fh:
        fh.write(fs.get(ObjectId(zipid)).read())


def getMedia(_id):
    media = db.media.find_one({'_id': ObjectId(_id)})
    vid_file = fs.get(ObjectId(media["media"]["id"]))

    file = open(media["media"]["originalname"], 'wb+')
    fsBuck.download_to_stream(ObjectId(media["media"]["id"]), file)

    return media["media"]["originalname"]
def zipdir(path, ziph):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        for file in files:
            ziph.write(os.path.join(root, file))
def make_tarfile(output_filename,model_dir,output_graph,output_labels):
    with tarfile.open(output_filename, mode='w:gz') as tar:
    #     tar.addfile(tarfile.TarInfo('imagenet/'+output_labels), file(model_dir+'/'+output_labels))
    #     tar.addfile(tarfile.TarInfo('imagenet/' + output_graph), file(model_dir+'/'+output_graph))
        tar.add(model_dir+'/'+output_labels, arcname='imagenet/' +output_labels,
                recursive=False)
        tar.add(model_dir+'/'+output_graph, arcname='imagenet/' + output_graph,
                recursive=False)
        tar.close
        #tar.add(os.path.join(model_dir,output_labels))
        #tar.add(os.path.join(model_dir, output_graph))
    print output_filename

def uploadtarmodel(output_filename,model):
    _id=fs.put(open(output_filename),modelowner=model)
    print _id
    return _id


def insertTraining():
    zipf = zipfile.ZipFile('exportmodel.tar.gz', 'w', zipfile.ZIP_DEFLATED)
    zipdir('exportmodel/', zipf)
    zipf.close()
    file=fs.put(open( 'exportmodel.tar.gz', 'rb'),filename='exportmodel.tar.gz',
         content_type='zip')
    print file
    result= db.trainings.insert(
        {
            "name":
                'training one',
            "endModel":
                {
                    "modelZipped":  file

                }

        }
    )
    print(result)

if __name__ == '__main__':
    with tarfile.open('exportmodel.tar.gz', mode='w:gz') as tar:
        tar.add('imagenet/ivanjacobs/testing'+ '/' + 'output_labels.txt',arcname='imagenet/' + 'output_labels.txt',recursive=False)
        tar.close