import logging
import pymongo
import datetime

from pymongo import MongoClient


class MongoLoggingHandler(logging.Handler):
    """
    A logging handler that will record messages to a (optionally capped)
    MongoDB collection.

    >>> connection = pymongo.Connection()
    >>> collection = connection.db.log
    >>> logger = logging.getLogger("mongotest")
    >>> logger.addHandler(MongoHandler(drop=True))
    >>> logger.error("Hello, world!")
    >>> collection.find_one()['message']
    u'Hello, world!'
    """

    def __init__(self, level=logging.NOTSET, host="localhost", port=27017,
                 database='velocity', collection='log', capped=True, size=100000,
                 drop=False):
        logging.Handler.__init__(self, level)
        self.client = MongoClient("mongodb://{}:{}".format(host,str(port)))
        self.database = self.client.velocity
        self.training=None
        self.set_name('MongoLoggingHandler')
        self.logs=[]
        self.losses=[]
        self.type_logging="KERAS"

        if collection in self.database.collection_names():
            if drop:
                self.database.drop_collection(collection)
                self.collection = self.database.create_collection(
                    collection, {'capped': capped, 'size': size})
            else:
                self.collection = self.database[collection]
        else:

            self.collection = self.database.create_collection(
                collection, **{'capped': capped, 'size': size})


    def emit(self, record):
        self.logs.append({'when': datetime.datetime.now(),
                              'levelno': record.levelno,
                              'levelname': record.levelname,
                              'message': record.message})
        if self.training is not None:
            if self.type_logging=='TENSORFLOW':
                if 'loss' in record.message and 'step' in record.message:
                    try:
                        l=record.message.split(',')[0].split('=')[-1].strip()
                        self.losses.append(str(l))
                        print([str(loss) for loss in self.losses])

                    except Exception as exc:
                        print('exception :',exc)
                self.database.trainings.find_and_modify(query={"_id": self.training['_id']},
                                                        update={"$set": {'losses': self.losses}}, upsert=False)

                self.database.trainings.find_and_modify(query={"_id": self.training['_id']}, update={"$set": {'status': record.message}}, upsert=False)

            self.database.trainings.find_and_modify(query={"_id": self.training['_id']},
                                                   update={"$set": {'logs': self.logs}}, upsert=False)



        self.collection.save({'when': datetime.datetime.now(),
                              'levelno': record.levelno,
                              'levelname': record.levelname,
                              'message': record.message})
