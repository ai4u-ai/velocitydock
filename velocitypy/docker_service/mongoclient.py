import tarfile

from pymongo import MongoClient
import gridfs
from bson.objectid import ObjectId
from bson.binary import Binary
import base64


import os
import zipfile


client= MongoClient("mongodb://0.0.0.0:27017")
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

def downloadAnnotations(annotations):

    for _annoatation in annotations:
        annotation=db.annotations.find_one({'_id': ObjectId(_annoatation)})
        path='annotations'
        if not os.path.exists(path):
           os.makedirs(path)
        for anno in annotation["annotation"]:
           print(anno["objectSelector"]["dataUrl"])
           filename=str(int(anno["currentTime"]))+".jpeg"
           classname=str(anno["objectSelector"]["class"]["name"])
           if not os.path.isdir(path+'/'+classname):
            os.makedirs(path+'/'+classname)
           with open(os.path.join(os.path.join(path,classname), filename), "wb") as fh:
            fh.write(base64.decodestring(anno["objectSelector"]["dataUrl"].split(',', 1)[-1]))

def downloadModel(_model):
    model = db.algomodels.find_one({'_id': ObjectId(_model)})
    path = 'imagenet'
    if not os.path.exists(path):
        os.makedirs(path)
    with open(os.path.join('imagenet',model['originalname']), "wb") as fh:
        fh.write(fs.get(ObjectId(model["model"]["id"])).read())
        print model['originalname']
    return path,model['originalname']

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
          tar.add(os.path.join(model_dir,output_labels))
          tar.add(os.path.join(model_dir, output_graph))
    print output_filename

def uploadtarmodel(output_filename,model):
    _id=fs.put(open(output_filename),modelowner=model)
    print _id
    return _id


def insertTraining():
    zipf = zipfile.ZipFile('exportmodel.zip', 'w', zipfile.ZIP_DEFLATED)
    zipdir('exportmodel/', zipf)
    zipf.close()
    file=fs.put(open( 'exportmodel.zip', 'rb'),filename='exportmodel.zip',
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
       readimage("58661def66161a2278b6dd0e")