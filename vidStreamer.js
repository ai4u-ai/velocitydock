/**
 * Created by jacobiv on 14/07/2016.
 */
/*var http = require("http");
var vidStreamer = require("vid-streamer");

var app = http.createServer(vidStreamer);
app.listen(3000);
console.log("VidStreamer.js up and running on port 3000");*/
var ObjectId = require('mongodb').ObjectID;
var path = require('path');
var schedule = require('node-schedule');
var async = require("async");
var FilteredFramesCollection = require('./js/models/filteredframesCollection');
var jsonfile = require('jsonfile')
var fs = require('fs');
var Grid = require('gridfs-stream');
var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
var StreamFunctions = require('./js/stream/gridfsstream');
var dir = require('node-dir');
var ffmpegFrames = require('./js/stream/ffmpegFrames');
var express = require("express");
var connectDomain = require('connect-domain');
var app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// app.use(connectDomain());
var vidStreamer = require("vid-streamer");
const videoStreamer = require('video-streamer');
var User = require('./js/models/user'); // get the mongoose model
var Training = require('./js/models/training');
var FramesCollection = require('./js/models/framesCollection');
var Dependency = require('./js/models/dependency');
var Media = require('./js/models/media');
var Classes = require('./js/models/classes');
var Mediafolderpath = require('./js/models/mediafolderpath');
var Annotation = require('./js/models/annotation');
var DataSet = require('./js/models/datasets');
var Conversion = require('./js/models/conversion');
var AlgoModel = require('./js/models/algomodel');
var Algo = require('./js/models/algo');
var AlgoAnnoRun = require('./js/models/algoannorun');
var AlgoService = require('./js/models/algoservice');
var Algoannotation = require('./js/models/algoannotation');
var port = process.env.PORT || 3000;
var jwt = require('jwt-simple');
var spawn = require('child_process').spawn;
// connect to database
var docker = require('./js/docker/docker');
var config = require('./js/config/database');
var mongoose = require('mongoose');
if (mongoose.connection === undefined) mongoose.connect(config.database);
Grid.mongo = mongoose.mongo;
var GridStore = mongoose.mongo.GridStore;
var GridFSBucket = mongoose.mongo.GridFSBucket;
var ObjectID = require('mongodb').ObjectID;
var conn = mongoose.connection;
// console.log('vidstreamer connection' + conn);

const MongoClient = require('mongodb').MongoClient;
var db;
var storage;
var gfs;
MongoClient.connect(config.database, function (err, database) {
    if (err) {
        console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
        process.exit(1);
    }
    db = database;
    gfs = Grid(db);
    storage = GridFsStorage({
        gfs: gfs
    });

});

var GridFsStream = StreamFunctions.gridfsStreamer;
var StreamFromFile = StreamFunctions.streamFromFile;
var cluster = require('cluster');

var upload = multer({storage: storage});
//authentication
var bodyParser = require('body-parser');
var morgan = require('morgan');

// pass passport for configuration


var passport = require('./js/config/passport');


//io +gRPC
//Call gRPC


var PROTO_PATH = __dirname + '/js/protos/trainerServer.proto';

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var hello_proto = grpc.load(PROTO_PATH).helloworld;


var dataset_conversion_PROTO_PATH = __dirname + '/js/protos/annotations_converter.proto';

var packageDefinition = protoLoader.loadSync(
    dataset_conversion_PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
var dataset_conversion = grpc.loadPackageDefinition(packageDefinition);
//var dataset_conversion = grpc.load(dataset_conversion_PROTO_PATH);

var dataset_conversion_client = new dataset_conversion.AnnotationsConverter('localhost:' + '50052',
    grpc.credentials.createInsecure());
// var engine = require('engine.io');
// var server = engine.listen(8090);



// var engine = require('engine.io');
// var server = engine.listen(8090);



// var io = require('socket.io')(8080);
var server = require('http').createServer(app);


process.on('uncaughtException', function (err) {
    console.log(" UNCAUGHT EXCEPTION ");
    console.log("[Inside 'uncaughtException' event] " + err.stack || err.message);
});

app.use(function (err, req, res, next) {
    res.end(err.message); // this catches the error!!
    console.log(err.message)
});





var previous;
//
// io.on('connection', function (socket) {
//
//     Algo.find({}, function (err, algos) {
//         if (err) console.log(err)
//         algos.map(function (algo) {
//             // console.log(algo.name)
//             docker.getAssignedPort(algo.name, function (port) {
//
//                 socket.on(algo.name, function (data) {
//                     // console.log(algo.name)
//
//                     var req = JSON.parse(data);
//
//                     // console.log('sending message' + req.time + ' ' + req.index);
//
//                     var client = new hello_proto.Greeter('localhost:' + port,
//                         grpc.credentials.createInsecure());
//                     var call = client.sayHelloAgain();
//                     call.write({
//                         name: new Buffer(req.blob, 'base64').toString('base64'),
//                         frameid: req.time.toString(),
//                         filteredframeid: req.index.toString()
//                     });
//                     call.on('error', function (error) {
//                         //console.log(error)
//                         return;
//                     })
//                     call.on('exit', function (error) {
//                         console.log('exit')
//                         return;
//                     })
//                     call.on('close', function (error) {
//                         console.log('close')
//                         return;
//                     })
//                     call.on('cancel', function (error) {
//                         console.log('close')
//                         return;
//                     })
//
//
//                     call.on('data', function (data) {
//                         socket.send(JSON.stringify({
//                             label: data.label,
//                             score: data.score,
//                             time: data.frameid,
//                             index: data.filteredframeid
//                         }));
//                         //  var diff=  new Date(new Date().getTime()-start.getTime())
//                         // console.log(diff.getMinutes()+':'+diff.getSeconds()+':'+diff.getMilliseconds())
//                         call.cancel();
//                     });
//                 })
//             })
//         })
//     })
//     socket.emit('a message', {
//         that: 'only'
//         , '/chat': 'will get'
//     });
//     // chat.emit('my other event', {
//     //     everyone: 'in'
//     //     , '/chat': 'will get'
//     // });
//     socket.on('disconnect', function () {
//         console.log('forceDisconnect')
//         socket.disconnect();
//     });
//     var count = 0;
//
//
// })


var reinintCallVars = function (port, _availiblenr, servicename) {
//    // var server = engine.listen(port);
//     availiblenr=_availiblenr;
//     var  chunks=[];
//     // for (var i=0;i<chunks.length;i++)
//     // {
//     //     {
//     //         if (chunks[i] != undefined) chunks[i].cancel();
//     //     }
//     // }
//     if(call!=undefined)
//     {
//         console.log('call.cancel()');call.cancel();
//     }
//
//     if(previous!=undefined) {
//         // for (var i = 0; i < sockets[previous].calls.length; i++){
//         //     sockets[previous].calls[i].cancel();
//         // }
//         //
//         // sockets[previous].sockets={}
//     }
//
//     var   availiblenr=0
//
// //     io.on('connection', function(_socket){
// //
// //         socket=_socket;
// //
// //
// // // Call an async function, often a save() to DB
// //
// //         var count=0;
// //         console.log('open socket')
// //         socket.on('disconnect',function(){
// //             console.log('discinnected')
// //         })
// //         server.of('/hello').on('message', function(data){
// //
// //
// //             var req=JSON.parse(data);
// //
// //             console.log('sending message'+req.time+' '+req.index);
// //             if(count===availiblenr||count>availiblenr) count=0;
// //             chunks[count].write({name: new Buffer(req.blob,'base64').toString('base64'),frameid:req.time.toString(),filteredframeid:req.index.toString()  });
// //
// //
// //             /*
//
// fs.appendFile('image'+count+'.jpeg', new Buffer(req.blob,'base64'),  'base64',function (err) {
// //              if (err) {
// //              console.log(err);
// //              } else {
// //
// //              }
// //              });*/
// //             count++;
// //             if(count===availiblenr) count=0;
// //
// //         });
// //
// //
// //
// //
// //     });
//
//
//     var count=0;
//
//     if( sockets[servicename]===undefined){
//         previous=servicename;
//         sockets[servicename]={};
//         availiblenr=_availiblenr;
//         sockets[servicename].calls=[];
//
//          // for (var i=0;i<availiblenr;i++){
//          //     var client = new hello_proto.Greeter('localhost:'+port,
//          //         grpc.credentials.createInsecure());
//          //    var call = client.sayHelloAgain();
//          //     sockets[servicename].calls.push(call);
//          // }
//
//
//
//
//         sockets[servicename].sockets=
//             io.on('connection', function (socket) {
//
//                     console.log(servicename+' connection')
//                     socket.emit('a message', {
//                         that: 'only'
//                         , '/chat': 'will get'
//                     });
//                     // chat.emit('my other event', {
//                     //     everyone: 'in'
//                     //     , '/chat': 'will get'
//                     // });
//                     socket.on('disconnect', function(){
//                         console.log('forceDisconnect')
//                         socket.disconnect();
//                     });
//                     var count=0;
//                     socket.on(servicename, function(data){
//
//
//                         var req=JSON.parse(data);
//
//                         console.log('sending message'+req.time+' '+req.index);
//                         if(count===availiblenr||count>availiblenr) count=0;
//                         var client = new hello_proto.Greeter('localhost:'+port,
//                                     grpc.credentials.createInsecure());
//                                 var call = client.sayHelloAgain();
//                         call.write({name: new Buffer(req.blob,'base64').toString('base64'),frameid:req.time.toString(),filteredframeid:req.index.toString()  });
//                         call.on('error', function (error) {
//                                     console.log(error)
//                                     return;
//                                 })
//                                 call.on('exit', function (error) {
//                                     console.log('exit')
//                                     return;
//                                 })
//                                 call.on('close', function (error) {
//                                     console.log('close')
//                                     return;
//                                 })
//                                 call.on('cancel', function (error) {
//                                     console.log('close')
//                                     return;
//                                 })
//
//
//                         call.on('data', function(data) {
//                             console.log('Got message ' + data.frameid +' '+ data.filteredframeid +' '+data.label +' '+data.score);
//                             socket.send(JSON.stringify({ label:data.label ,score:data.score,time:data.frameid,index:data.filteredframeid}));
//                             //  var diff=  new Date(new Date().getTime()-start.getTime())
//                             // console.log(diff.getMinutes()+':'+diff.getSeconds()+':'+diff.getMilliseconds())
//                             call.cancel();
//                         });
//
//                         /*fs.appendFile('image'+count+'.jpeg', new Buffer(req.blob,'base64'),  'base64',function (err) {
//                          if (err) {
//                          console.log(err);
//                          } else {
//
//                          }
//                          });*/
//                         count++;
//                         if(count===availiblenr) count=0;
//
//                     });
//
//                     // sockets[servicename].calls[0].on('data', function(data) {
//                     //     console.log('Got message ' + data.frameid +' '+ data.filteredframeid +' '+data.label +' '+data.score);
//                     //     socket.send(JSON.stringify({ label:data.label ,score:data.score,time:data.frameid,index:data.filteredframeid}));
//                     //     //  var diff=  new Date(new Date().getTime()-start.getTime())
//                     //     // console.log(diff.getMinutes()+':'+diff.getSeconds()+':'+diff.getMilliseconds())
//                     //
//                     // });
//                     // sockets[servicename].calls.map(function(call){
//                     //     call.on('data', function(data) {
//                     //         console.log('Got message ' + data.frameid +' '+ data.filteredframeid +' '+data.label +' '+data.score);
//                     //         socket.send(JSON.stringify({ label:data.label ,score:data.score,time:data.frameid,index:data.filteredframeid}));
//                     //         //  var diff=  new Date(new Date().getTime()-start.getTime())
//                     //         // console.log(diff.getMinutes()+':'+diff.getSeconds()+':'+diff.getMilliseconds())
//                     //     });
//                     //
//                     //         call.on('error', function (error) {
//                     //         console.log(error)
//                     //         return;
//                     //     })
//                     //     call.on('exit', function (error) {
//                     //         console.log('exit')
//                     //         return;
//                     //     })
//                     //     call.on('close', function (error) {
//                     //         console.log('close')
//                     //         return;
//                     //     })
//                     //     call.on('cancel', function (error) {
//                     //         console.log('close')
//                     //         return;
//                     //     })
//                     // })
//
//
//
//
//
//                 });
//
//     }


}


//STREAMER
var newSettings = {
    "mode": "development",
    "forceDownload": false,
    "random": false,
    "rootFolder": "../js/data/",
    "rootPath": "",
    "server": "VidStreamer.js/0.1.4"
};
vidStreamer.settings(newSettings);

// bundle our routes
var apiRoutes = express.Router();


// create a new user account (POST http://localhost:8080/api/signup)
//CORS middleware
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'example.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}


app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use('/', express.static(__dirname + '/'));
app.use(allowCrossDomain);
// log to console
app.use(morgan('dev'));

// Use the passport package in our application
app.use(passport.initialize());


// demo Route (GET http://localhost:8080)
app.get('/', function (req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

apiRoutes.post('/signup', function (req, res) {
    if (!req.body.userName || !req.body.password) {
        res.json({success: false, msg: 'Please pass name and password.'});
    } else {
        var newUser = new User(req.body);
        // save the user
        newUser.save(function (err) {
            if (err) {
                return res.json({success: false, msg: err.message});
            }
            res.json({success: true, msg: 'Successful created new user.'});
        });
    }
});

apiRoutes.post('/updateUser', function (req, res) {
    if (!req.body.userName || !req.body.password) {
        res.json({success: false, msg: 'Please pass name and password.'});
    } else {
        User.findByIdAndUpdate(req.body._id, {$set: req.body}, {new: true}, function (err, user) {
            if (err) {

                return res.json({success: false,  msg: err});
            }
            var token = jwt.encode(user, config.secret);
            res.json({success: true, token: 'JWT ' + token, user: user});


    })
}});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function (req, res) {
    User.findOne({
        userName: req.body.userName
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            res.send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.encode(user, config.secret);
                    // return the information including token as JSON
                    res.json({success: true, token: 'JWT ' + token, user: user});
                } else {
                    res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});
// route to a restricted info (GET http://localhost:8080/api/memberinfo)
apiRoutes.get('/memberinfo', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
});
apiRoutes.delete('/delete/:id', function (req, res) {
    console.log('delete')
});
apiRoutes.get('/load/allmedia', passport.authenticate('jwt', {session: false}), upload.single('file'), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {


                Mediafolderpath.find({createdBy: user._id}, function (err, folders) {

                    extensions = [".mp4", ".flv", ".avi", ".mov", ".mpg"];
                    folders.forEach(function (folder) {
                        fs.readdir(folder.path, function (err, items) {
                            //console.log(items);

                            if (items != undefined){
                                items.filter(function (file) {

                                        if (extensions.indexOf(path.extname(file)) > -1) {
                                            return true;
                                        }
                                    }
                                ).forEach(function (file) {

                                    Media.find({uploadedBy: user._id, name: file}).exec(function (err, docs) {

                                        foundfiles = docs;

                                        if (foundfiles === undefined || foundfiles.length == 0) {
                                            console.log(file, folder.path)
                                            var media = new Media();
                                            media.media = {id: file};
                                            media.contentType = "video/mp4";
                                            media.name = file;
                                            media.originalname = file;
                                            media.readaccess = 'public';
                                            media.writeaccess = 'public';
                                            media.filePath = folder.path + "/" + file;
                                            media.uploadedBy = user._id;

                                            media.save(function (err, media) {
                                                if (err) {
                                                    return res.json({success: false, msg: 'Username already exists.'});
                                                }
                                                var startTime = new Date(Date.now() + 500);
                                                // var j = schedule.scheduleJob(startTime, function(media,db){
                                                //     ffmpegFrames.saveMetaFrames(media);
                                                //     var scale=30;
                                                //     var sceneFilter=0.005;
                                                //    var filteredFrCollection =new FilteredFramesCollection();
                                                //     filteredFrCollection.status='started';
                                                //     ffmpegFrames.savefilteredFrames(media,scale,sceneFilter,false,filteredFrCollection,null,null);
                                                // }.bind(null,media,db));

                                            });
                                        }
                                    });


                                });
                            }

                        });


                    });
                });

                //res.setHeader('Content-Type', 'application/json');
                // res.send();


                Media.find({uploadedBy: user._id}).exec(function (err, docs) {
                    if (err) return handleError(err);
                    //console.log('The stories are an array: ', docs);
                    res.files = docs;
                    res.send(docs);
                })

            }
        });
    }
});

apiRoutes.get('/anotations/loadAll', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                Annotation.find({uploadedBy: user._id}).populate('annotatedOnMedia').exec(function (err, docs) {
                    if (err) return handleError(err);
                    //console.log('The stories are an array: ', docs);

                    docs = docs.filter(function (doc) {
                        return doc.annotatedOnMedia != undefined
                    });
                    res.files = docs;

                    res.send(docs);
                })

            }
        });
    }
});
apiRoutes.get('/load/algos', passport.authenticate('jwt', {session: false}), upload.single('file'), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                Algo.find({createdBy: user._id}).populate('model').populate('dependencies').populate('media').populate('annotations').exec(function (err, docs) {
                    if (err) return handleError(err);
                    //  console.log('The stories are an array: ', docs);
                    //res.files=docs;
                    res.send(docs);
                })

            }
        });
    }
});
apiRoutes.get('/load/algomodels', passport.authenticate('jwt', {session: false}), upload.single('file'), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                AlgoModel.find({uploadedBy: user._id}).exec(function (err, docs) {
                    if (err) return handleError(err);
                    //  console.log('The stories are an array: ', docs);
                    res.files = docs;
                    res.send(docs);
                })

            }
        });
    }
});


apiRoutes.all('/user/upload/avatar', passport.authenticate('jwt', {session: false}), upload.single('file'), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findByIdAndUpdate(decoded._id, {$set: {avatar: req.file}}, {new: true}, function (err, user) {
            if (err) {
                return res.json({success: false, msg: err});
            }
            res.json({success: true, msg: 'Successful added avatar.', user: user});
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
});
apiRoutes.all('/user/get/avatar', passport.authenticate('jwt', {session: false}), upload.single('file'), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({_id: decoded._id}, function (err, user) {
            if (err) {
                return res.json({success: false, msg: err});
            }
            res.set("Content-Type", user.avatar.mimetype);
            res.send(user.avatar);
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
});

apiRoutes.all('/upload', passport.authenticate('jwt', {session: false}), upload.single('file'), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {

                if (req.body.type === 'multimedia') {
                    var media = new Media();
                    media.media = req.file;
                    media.contentType = req.file.mimetype;
                    media.name = req.file.originalname;
                    media.originalname = req.file.originalname;
                    media.readaccess = req.body.readaccess;
                    media.writeaccess = req.body.writeaccess;
                    media.uploadedBy = user._id;

                    media.save(function (err, media) {
                        if (err) {
                            return res.json({success: false, msg: 'Username already exists.'});
                        }
                        var startTime = new Date(Date.now() + 500);
                        // var j = schedule.scheduleJob(startTime, function(media,db){
                        //     ffmpegFrames.saveMetaFrames(media);
                        //     var scale=30;
                        //     var sceneFilter=0.005;
                        //    var filteredFrCollection =new FilteredFramesCollection();
                        //     filteredFrCollection.status='started';
                        //     ffmpegFrames.savefilteredFrames(media,scale,sceneFilter,false,filteredFrCollection,null,null);
                        // }.bind(null,media,db));
                        res.json({
                            success: true, msg: 'Successful added media.'
                                + media._id
                        });
                    });
                }
                if (req.body.type === 'dependency') {
                    var dependency = new Dependency();
                    dependency.dependency = req.file;
                    dependency.contentType = req.file.mimetype;
                    dependency.name = req.file.originalname;
                    dependency.originalname = req.file.originalname;
                    dependency.readaccess = req.body.readaccess;
                    dependency.writeaccess = req.body.writeaccess;
                    dependency.uploadedBy = user._id;
                    dependency.save(function (err) {
                        if (err) {
                            return res.json({success: false, msg: 'Username already exists.'});
                        }
                        res.json({success: true, msg: 'Successful added media.'});
                    });
                }
                if (req.body.type === 'algomodel') {
                    var algoModel = new AlgoModel();
                    algoModel.model = req.file;
                    algoModel.name = req.file.originalname;
                    algoModel.originalname = req.file.originalname;
                    algoModel.readaccess = req.body.readaccess;
                    algoModel.writeaccess = req.body.writeaccess;
                    algoModel.uploadedBy = user._id;
                    algoModel.save(function (err) {
                        if (err) {
                            return res.json({
                                success: false,
                                msg: 'Username already exists.',
                                modelid: algoModel._id
                            });
                        }
                        res.json({success: true, msg: 'Successful added media.'});
                    });
                }

                /*  req.pipe(gfs.createWriteStream({
                      filename: 'test'
                  }));*/
                // res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
});

apiRoutes.delete('/dataset/delete', passport.authenticate('jwt', {session: false}), function (req, res) {

    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {


                DataSet.remove({_id: req.query._id}, function (err) {
                    if (err) return handleError(err);
                    // removed!

                    res.json({success: true, msg: 'removed !'});
                });

            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }


});

apiRoutes.get('/dataset/convert', passport.authenticate('jwt', {session: false}),
    function (req, res) {
        var token = getToken(req.headers);


        DataSet.findOne({_id: ObjectId(req.query._id)}).exec(
            function (err, dataset)
            {




                dataset_conversion_client.convertAnnotations(
                    {
                        destpath: req.query.destpath,
                        record_name: dataset.name,
                        dataset_id:req.query._id,
                        img_w: req.query.image_width,
                        img_h: req.query.image_height,
                        annotations_list: dataset.annotations,
                        conversion_type:req.query.selected_type,
                        test_train_split:req.query.test_train_split

                    }, function (err, response) {
                        console.log(err)
                    });


            }
        )}
    );

apiRoutes.get('/conversion/findByDataSet', passport.authenticate('jwt', {session: false}), upload.single('file'), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {

                Conversion.find({dataset_id:ObjectID(req.query._id)}).exec(function (err, conversions) {
                    if (err) return handleError(err);
                    //  console.log('The stories are an array: ', docs);
                    res.conversions = conversions;
                    res.send(conversions);
                })


            }
        });
    }
});
apiRoutes.get('/dataset/loadAll', passport.authenticate('jwt', {session: false}), upload.single('file'), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                DataSet.find({uploadedBy: user._id}).exec(function (err, datasets) {
                    if (err) return handleError(err);
                    //  console.log('The stories are an array: ', docs);
                    res.datasets = datasets;
                    res.send(datasets);
                })

            }
        });
    }
});



apiRoutes.all('/dataset/save', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {


                /*  media.media=req.file;
                  media.contentType=req.file.mimetype;
                  media.name=req.file.originalname;
                  media.originalname=req.file.originalname;
                  media.readaccess=req.body.readaccess;
                  media.writeaccess=req.body.writeaccess;*/

                if (req.body._id != undefined) {
                    DataSet.findByIdAndUpdate(req.body._id, {$set: req.body}, {new: true}, function (err, dataset) {
                        if (err) {
                            return res.json({success: false, msg: err});
                        }
                        res.json({
                            success: true,
                            msg: 'Successful added annotation.',
                            _id: dataset._id,
                            dataset: dataset
                        });
                    });

                } else {

                    var dataset = new DataSet(req.body);

                    dataset.uploadedBy = user._id;
                    dataset.save(function (err) {
                        if (err) {
                            return res.json({success: false, msg: 'Username already exists.'});
                        }
                        res.json({
                            success: true,
                            msg: 'Successful added dataset.',
                            _id: dataset._id,
                            dataset: dataset
                        });
                    });
                }


                /*  req.pipe(gfs.createWriteStream({
                 filename: 'test'
                 }));*/
                // res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
});

apiRoutes.get('/annotations/getById/', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {


                /*  media.media=req.file;
                  media.contentType=req.file.mimetype;
                  media.name=req.file.originalname;
                  media.originalname=req.file.originalname;
                  media.readaccess=req.body.readaccess;
                  media.writeaccess=req.body.writeaccess;*/

                if (req.query._id != undefined) {
                    Annotation.findById(req.query._id, function (err, annotation) {
                        if (err) {
                            return res.json({success: false, msg: err});
                        }
                        res.json({
                            success: true,
                            msg: 'Successful found annotation.',

                            annotation: annotation
                        });
                    });

                } else {
                    res.json({
                        success: false,
                        msg: 'Could not find annotation.',

                    });
                }


                /*  req.pipe(gfs.createWriteStream({
                 filename: 'test'
                 }));*/
                // res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
});
apiRoutes.all('/annotations/save', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {


                /*  media.media=req.file;
                  media.contentType=req.file.mimetype;
                  media.name=req.file.originalname;
                  media.originalname=req.file.originalname;
                  media.readaccess=req.body.readaccess;
                  media.writeaccess=req.body.writeaccess;*/

                if (req.body._id != undefined) {
                    Annotation.findByIdAndUpdate(req.body._id, {$set: req.body}, {new: true}, function (err, annotation) {
                        if (err) {
                            return res.json({success: false, msg: err});
                        }
                        res.json({
                            success: true,
                            msg: 'Successful added annotation.',
                            _id: annotation._id,
                            annotation: annotation.annotation
                        });
                    });

                } else {
                    var annotation = new Annotation(req.body);
                    annotation.uploadedBy = user._id;
                    annotation.save(function (err) {
                        if (err) {
                            return res.json({success: false, msg: 'Username already exists.'});
                        }
                        res.json({
                            success: true,
                            msg: 'Successful added annotation.',
                            _id: annotation._id,
                            annotation: annotation.annotation
                        });
                    });
                }


                /*  req.pipe(gfs.createWriteStream({
                 filename: 'test'
                 }));*/
                // res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
});
getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

apiRoutes.get('/stream/video/frompath/', passport.authenticate('query', {session: false}), function (req, res) {
    var token = req.query.access_token;
    var path = req.query.filePath;

    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne(
            {
                _id: decoded._id
            },
            function (err, user) {
                if (err) throw err;

                if (!user) {
                    return res.status(403).send({
                        success: false,
                        msg: 'Authentication failed. User not found.'
                    });
                } else {
                    try
                    {
                        StreamFromFile(req, res, path);
                    } catch (e) {
                        console.log("media from file not found",e);

                    }
                }});

    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }


});

apiRoutes.get('/stream/video/:id', /*passport.authenticate('bearer', { session: false }), */passport.authenticate('query', {session: false}), function (req, res) {
    var token = req.query.access_token;

    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {

                new GridStore(db, new ObjectID(req.params.id), null, 'r').open(function (err, GridFile) {
                    if (!GridFile) {
                        res.send(404, 'Not Found');
                        return;
                    }

                    GridFsStream(req, res, GridFile, db);
                });
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }

});

app.delete('/api/mediafolder/delete', passport.authenticate('jwt', {session: false}), function (req, res) {

    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {


                Mediafolderpath.remove({_id: req.query.id}, function (err) {
                    if (err) return handleError(err);
                    // removed!

                    res.json({success: true, msg: 'removed !'});
                });

            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }


});

apiRoutes.get('/mediafolders/get/', /*passport.authenticate('bearer', { session: false }), */passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = req.query.access_token;

    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                Mediafolderpath.find({createdBy: user._id}, function (err, folders) {
                    console.dir(folders)
                    res.json(folders);
                    //res.setHeader('Content-Type', 'application/json');
                    // res.send();
                });

            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }

});

apiRoutes.get('/classes/get/', /*passport.authenticate('bearer', { session: false }), */passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = req.query.access_token;

    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                Classes.find({createdBy: user._id}, function (err, classes) {
                    console.dir(classes)
                    res.json(classes);
                    //res.setHeader('Content-Type', 'application/json');
                    // res.send();
                });

            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }

});
apiRoutes.get('/dependencies/get/', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = getToken(req.headers);

    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                Dependency.find({uploadedBy: user._id}, function (err, dependencies) {

                    res.json(dependencies);
                    //res.setHeader('Content-Type', 'application/json');
                    // res.send();
                });

            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }

});


//STREAMING
app.get('/video/:videoName', videoStreamer({videoPath: 'js/data/'}));
/*var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;
mongoose.model('Algo',
    new Schema({  author    : ObjectId,
        title     : String,
        body      : String,
        date      : Date,
        json      :Object}),
    'algo');
var Algo =mongoose.model('Algo');*/
/*var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
    algo =new Schema({
        author    : ObjectId,
        title     : String,
        body      : String,
        date      : Date,
        json      :Object,
        collection : 'algos'
    });*/


apiRoutes.get('/myannotatioruns/', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = getToken(req.headers);

    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {

                AlgoAnnoRun.find({runnedBy: user._id}
                ).populate('annotatedOnMedia').exec(
                    function (err, algoannoruns) {
                        if (err) console.log('err in algoanntations get' + err)
                        res.json({success: true, algoannoruns: algoannoruns});
                        //res.setHeader('Content-Type', 'application/json');
                        // res.send();
                    }
                );

            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }

});


apiRoutes.get('/algoannotations/getfast/', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = getToken(req.headers);

    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {


                AlgoAnnoRun.findOne({_id: req.query.algoannorun}).populate('filteredframecollection').exec(
                    function (err, algoannorun) {
                        if (err) console.log('err in algoanntations get' + err)


                        res.json({success: true, algoannorun: algoannorun});
                        //res.setHeader('Content-Type', 'application/json');
                        // res.send();
                    });

            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }

});


apiRoutes.get('/refreshtraining/', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = getToken(req.headers);

    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {


                Training.findOne({_id: req.query.training},
                    function (err, training) {
                        if (err) console.log('err in algoanntations get' + err)



                        res.json({success: true, training: training});
                        //res.setHeader('Content-Type', 'application/json');
                        // res.send();
                    });

            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }

});
apiRoutes.get('/algoannotations/get/', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = getToken(req.headers);

    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {


                Algoannotation.find({algoannorun: req.query.algoannorun}).populate('frame').populate(
                    'filteredframe'
                ).exec(
                    function (err, algoannotations) {
                        if (err) console.log('err in algoanntations get' + err)
                        res.json({success: true, algoannotations: algoannotations});
                        //res.setHeader('Content-Type', 'application/json');
                        // res.send();
                    });

            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }

});


app.get('/api/getnumberofinstances/', passport.authenticate('jwt', {session: false}), function (req, res) {

    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;


            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                docker.getNumberOfContainers(req.query.servicename, function (number) {

                    res.json({success: true, msg: 'success change port', instances: number})
                });


            }
        })
    }
})


app.post('/api/scaleservice/', passport.authenticate('jwt', {session: false}), function (req, res) {

    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;


            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                docker.scaleService(req.body.params.servicename, req.body.params.instances, function (number) {
                    res.json({success: true, msg: 'success change port', instances: req.body.params.instances})
                });


            }
        })
    }
});
app.post('/api/changeserviceport/', passport.authenticate('jwt', {session: false}), function (req, res) {

    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;


            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                docker.getNumberOfContainers(req.body.params.servicename, function (number) {
                    docker.getAssignedPort(req.body.params.servicename, function (port) {
                        reinintCallVars(port, number, req.body.params.servicename);
                        res.json({success: true, msg: 'success change port', instances: number})
                    })

                });


            }
        })
    }
})

app.post('/api/searchinmedia/', passport.authenticate('jwt', {session: false}), function (req, res) {

    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;


            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                var algoAnnoRun = new AlgoAnnoRun();

                Media.findOne({_id: req.body.params.media}, function (err, media) {
                    AlgoModel.findOne({_id: req.body.params.model}, function (err, algomodel) {
                        var scale = req.body.params.scale;
                        var sceneFilter = req.body.params.sceneFilter;
                        FilteredFramesCollection.findOne({
                            scene: sceneFilter,
                            scale: scale,
                            media: media._id
                        }, function (err, filteredFrCollection) {


                            var filterFrames = true;

                            if (err) {
                                console.log('Err did not find' + err);


                            }

                            if (filteredFrCollection === null) {
                                filteredFrCollection = new FilteredFramesCollection();
                            } else {
                                filterFrames = false;
                            }


                            filteredFrCollection.scene = sceneFilter;
                            filteredFrCollection.scale = scale;
                            filteredFrCollection.status = 'started';
                            algoAnnoRun.algo = req.body.params.algo;
                            algoAnnoRun.annotatedOnMedia = media._id;
                            algoAnnoRun.runnedBy = user._id;
                            algoAnnoRun.filteredframecollection = filteredFrCollection._id;
                            algoAnnoRun.status = 'started';
                            algoAnnoRun.startDate = +new Date();
                            algoAnnoRun.save(function (err, algorun) {
                                    if (err) {
                                        console.log('error saving algo run' + err)
                                        res.json({
                                            success: false,
                                            msg: ' err saving algo run',
                                            _id: algoAnnoRun._id,
                                            err: err
                                        })

                                    }



                                }
                            )
                            var startTime = new Date(Date.now() + 500);
                            var j = schedule.scheduleJob(startTime, function (media, db) {
                                var fc = FramesCollection.findOne({"framesOfMedia": media._id}, function (err, collection) {
                                    if (collection) {
                                        return;
                                    } else {
                                        ffmpegFrames.saveMetaFrames(media, null);
                                    }
                                })


                                if (filterFrames) {
                                    ffmpegFrames.savefilteredFrames(media, scale, sceneFilter, false, filteredFrCollection, null, algoAnnoRun);
                                    ffmpegFrames.analyze(media, filteredFrCollection, 'localhost:' + req.body.params.port, algoAnnoRun);
                                }
                                if (!filterFrames) {
                                    ffmpegFrames.analyze(media, filteredFrCollection, 'localhost:' + req.body.params.port, algoAnnoRun);
                                }
                            }.bind(null, media, db));

                        });


                    })
                })

                res.json({success: true, msg: 'success saving algo run', algoannorun: algoAnnoRun, err: err})

            }
        })
    }
})
var callback = function (cc) {
    console.log(cc)
};
app.post('/api/searchinmediaNew/', passport.authenticate('jwt', {session: false}), function (req, res) {

    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;


            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                var algoAnnoRun = new AlgoAnnoRun();

                Media.findOne({_id: req.body.params.media}, function (err, media) {
                    AlgoModel.findOne({_id: req.body.params.model}, function (err, algomodel) {
                        var scale = req.body.params.scale;
                        var sceneFilter = req.body.params.sceneFilter;
                        var algoAnnoRun = new AlgoAnnoRun();
                        algoAnnoRun.algo = req.body.params.algo;
                        algoAnnoRun.annotatedOnMedia = media._id;
                        algoAnnoRun.runnedBy = user._id;
                        algoAnnoRun.save(function (err, algoAnnoRun) {
                            if (err) {
                                console.log('error saving algo run' + err)
                                res.json({
                                    success: false,
                                    msg: ' err saving algo run',
                                    _id: algoAnnoRun._id,
                                    err: err
                                })

                            }


                            var startTime = new Date(Date.now() + 500);
                            var j = schedule.scheduleJob(startTime, function (media, db) {
                                async.waterfall([
                                    function (callback) {

                                        FramesCollection.findOne({"framesOfMedia": media._id}, function (err, collection) {
                                            if (collection) {
                                                callback(null, collection)
                                            } else {
                                                ffmpegFrames.saveMetaFrames(media, callback);
                                            }
                                        })

                                    }, function (arg, callback) {
                                        FilteredFramesCollection.findOne({
                                            scene: sceneFilter,
                                            scale: scale,
                                            media: media._id
                                        }, function (err, filteredFrCollection) {
                                            if (filteredFrCollection) {
                                                callback(null, filteredFrCollection)
                                            } else {
                                                console.log('starting filtering splitting')
                                                filteredFrCollection = new FilteredFramesCollection();
                                                filteredFrCollection.scene = sceneFilter;
                                                filteredFrCollection.scale = scale;
                                                filteredFrCollection.status = 'started';

                                                ffmpegFrames.savefilteredFrames(media, scale, sceneFilter, false, filteredFrCollection, null, algoAnnoRun, callback)
                                            }

                                        })

                                    },
                                    function (filteredFrCollection, callback) {

                                        algoAnnoRun.filteredframecollection = filteredFrCollection._id;
                                        algoAnnoRun.status = 'started';
                                        algoAnnoRun.startDate = +new Date();
                                        AlgoAnnoRun.update({_id: algoAnnoRun._id}, algoAnnoRun, {upsert: true}, function (err, algorun) {
                                            if (err) {
                                                console.log('error saving algo run' + err)
                                                res.json({
                                                    success: false,
                                                    msg: ' err saving algo run',
                                                    _id: algoAnnoRun._id,
                                                    err: err
                                                })

                                            }


                                            ffmpegFrames.movingObjects(media, filteredFrCollection._id, callback, algoAnnoRun)

                                        });


                                    }, function (arg, callback) {
                                        ffmpegFrames.analyzeChained(arg, callback, 'localhost:' + req.body.params.port)
                                    }

                                ], function (err, result) {
                                    console.log('done')
                                });

                            }.bind(null, media, db));


                        })
                    })
                })


                res.json({success: true, msg: 'success saving algo run', algoannorun: algoAnnoRun, err: err})

            }
        })
    }
})

app.get('/api/get/trainings/', passport.authenticate('jwt', {session: false}), function (req, res) {

    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;
            Training.find({
                trainedBy: user._id,
                algo: req.query.algo

            }).populate('algo').populate('endModel').exec(function (err, trainings) {
                if (err) console.log(err)
                if (trainings.length > 0) {
                    res.json({success: true, msg: 'trainigs', trainings: trainings, err: err});
                }
            })


        })
    }
});

app.post('/api/deploymodel/', passport.authenticate('jwt', {session: false}), function (req, res) {

    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            AlgoModel.findOne({_id: req.body.params.endModel}, function (erer, algo) {
                if (err) console.log(err)
                var servicename = req.body.params.name;
                var apipath = req.body.params.apipath;

                docker.createDockerImage(algo.modelZipped, apipath, function () {


                    var dockerSpown = spawn('docker', ['service', 'rm', servicename]);
                    dockerSpown.on('data', function (data) {

                    })
                    dockerSpown.on('error', function (err) {
                        console.log('err creating service' + err)
                    })
                    dockerSpown.on('exit', function (err) {
                        console.log('service started')
                    })
                    dockerSpown.on('close', function (err) {
                        console.log('service started')
                        docker.getNextAvailiblePort(servicename, function (port) {
                            port = port + ':443';
                            var dockerSpownCreateS = spawn('docker', ['service', 'create', '--name', servicename, '--publish', port, apipath]);
                            dockerSpownCreateS.on('data', function (data) {

                            })
                            dockerSpownCreateS.on('error', function (err) {
                                console.log('err creating service' + err)
                            })
                            dockerSpownCreateS.on('exit', function (err) {
                                console.log('service created  exit started')
                            })
                            dockerSpownCreateS.on('close', function (err) {
                                console.log('service created close started')

                                docker.getAssignedPort(algo.name, function (port) {
                                    algo.port = port;

                                    Algo.findOneAndUpdate({_id: req.body.params.algo}, {$set: {"port": port}}, function (err, model) {
                                        if (err) console.log(err);
                                        //console.log(model)
                                    })

                                })

                            })

                        })

                    })


                });

                res.json({success: true, msg: 'success saving algo run'})


            })

        })
    }
})


app.post('/api/trainmodel/', passport.authenticate('jwt', {session: false}), function (req, res) {

    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;
            var grpc = require('grpc');
            var protoLoader = require('@grpc/proto-loader');
            var packageDefinition = protoLoader.loadSync(
                PROTO_PATH,
                {keepCase: true,
                    longs: String,
                    enums: String,
                    defaults: true,
                    oneofs: true
                });
            var routeguide = grpc.loadPackageDefinition(packageDefinition).helloworld;
            var client = new routeguide.Trainer('localhost:50051',
                grpc.credentials.createInsecure());


            if (req.body.params.model===0){
                var training = new Training();
                var startModel = new AlgoModel();
                var endModel = new AlgoModel();
                if(req.body.params.startFromPrevTraining!=undefined){
                    training.startFromPrevTraining=req.body.params.startFromPrevTraining
                }
                training.epochs=req.body.params.epochs;
                training.algoType=req.body.params.algo.algoType;
                training.conversionSettings=req.body.params.conversionSettings;
                training.dataSet=req.body.params.dataset;
                training.trainingMode=req.body.params.trainingMode;
                training.startDate = +new Date();
                training.status = 'init';
                training.startModel = startModel._id;
                training.endModel = endModel._id;
                training.trainedBy = user._id;
                training.algo = req.body.params.algo._id;
                training.steps=req.body.params.steps.toString(),
                training.save(function (err, training) {
                    if (err) console.log(err)

                });
                startModel.name = req.body.params.algo.name;
                startModel.state="init";
                startModel.version = req.body.params.version;
                startModel.algo=req.body.params.algo._id;
                startModel.algoType=req.body.params.algo.algoType;
                startModel.save(function (err, model) {
                    if (err) console.log(err)

                });
                endModel.name = req.body.params.algo.name;
                endModel.version = req.body.params.version;
                endModel.algo=req.body.params.algo._id;
                endModel.algoType=req.body.params.algo.algoType;
                endModel.save(function (err, model) {
                    if (err) console.log(err)

                });
                client.trainModel({
                    annotations: [],
                    model: '',
                    steps: req.body.params.steps.toString(),
                    retrain: true,
                    trainingid: training._id.toString(),



                }, function (err, response) {

                    if (response != undefined) {
                        AlgoModel.findOneAndUpdate({_id: training.endModel}, {$set: {"modelZipped": response.zipmodelid}}, function (err, model) {
                            if (err) console.log(err);
                            //console.log(model)
                        });
                        res.json({success: true, msg: 'training succsess', training: training, err: err})




                    } else {

                        res.json({success: false, msg: 'training error', training: training, err: err})

                    }



                });
                res.json({success: true, msg: 'success saving algo run', training: training, err: err})
            }
            else{
                AlgoModel.findOne({_id: req.body.params.model}, function (err, model) {
                    if (err) console.log(err)
                    var training = new Training();
                    var newModel = new AlgoModel();
                    if(req.body.params.startFromPrevTraining!=undefined){
                        training.startFromPrevTraining=req.body.params.startFromPrevTraining
                    }
                    training.epochs=req.body.params.epochs;
                    training.algoType=req.body.params.algo.algoType;
                    training.conversionSettings=req.body.params.conversionSettings;
                    training.trainingMode=req.body.params.trainingMode;
                    training.dataSet=req.body.params.dataset;
                    training.startDate = +new Date();
                    training.status = 'init';
                    training.startModel = model._id;
                    training.endModel = newModel._id;
                    training.trainedBy = user._id;
                    training.algo = req.body.params.algo;

                    training.steps=req.body.params.steps.toString(),
                    training.save(function (err, training) {
                        if (err) console.log(err)

                    });

                    newModel.name = model.name;
                    newModel.version = req.body.params.version;
                    newModel.algo=req.body.params.algo._id;
                    newModel.state='init';
                    newModel.algoType=req.body.params.algo.algoType;
                    newModel.save(function (err, model) {
                        if (err) console.log(err)

                    });




                    client.trainModel({
                        annotations: [],
                        model: '',
                        steps: req.body.params.steps.toString(),
                        retrain: true,
                        trainingid: training._id.toString(),

                    }, function (err, response) {

                        if (response != undefined) {
                           /* AlgoModel.findOneAndUpdate({_id: training.endModel}, {$set: {"modelZipped": response.zipmodelid}}, function (err, model) {
                                if (err) console.log(err);
                                //console.log(model)
                            });
                            training.endDate = +new Date();
                            training.status = 'end';
                            Training.update({_id: training._id}, training, {upsert: true}, function (err, collection) {
                                if (err) console.log(err);
                                //console.log(collection)
                            });
*/
                            console.log(response);

                        } else {

                            res.json({success: false, msg: 'training error', training: training, err: err})

                        }



                    });
                    res.json({success: true, msg: 'success saving algo run', training: training, err: err})

                })
            }



            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {

            }
        })
    }
})


app.post('/api/algo/save', passport.authenticate('jwt', {session: false}), function (req, res) {

    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {

                if (req.body.params.algo._id != undefined) {
                    /*  Algo.findByIdAndUpdate(req.body.params.algo._id,{$set:req.body.params.algo} ,{new: true},function(err,algo){
                          if(err){ return res.json({success: false, msg: err});}
                          res.json({success: true, msg: 'Successful added annotation.',_id:algo._id,algo:algo});
                      });*/
                    Algo.findByIdAndUpdate(req.body.params.algo._id, {$set: req.body.params.algo}, {new: true}).exec(
                        function (err, algo) {
                            if (err) {
                                return res.json({success: false, msg: err});
                            }
                            res.json({
                                success: true,
                                msg: 'Successful added annotation.',
                                _id: algo._id,
                                algo: algo
                            })
                        }
                    );

                } else {
                    var algoInstance = new Algo(req.body.params.algo);

                    algoInstance.createdBy = user._id;
                    algoInstance.save(function (err) {
                        'use strict';
                        if (err) {
                            if (err) {
                                //throw err;
                                return res.status(500).send({succes: false, message: 'Algo already exist!'});
                                console.log(err);
                            }
                        } else {
                            res.json({
                                success: true,
                                algo: algoInstance,
                                msg: 'Algoritm is Saved to your member area ' + user.userName + '!'
                            });

                        }


                    });

                }

                //respond.end("yes");

            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }





    // your JSON
    //response.send(request.body);    // echo the result back
    /*request.on('data', function(data) {
        var file = './tmp/data.json';

        /!*jsonfile.writeFile(file, data, function (err) {
            console.error(err)
        });*!/
    });*/

    /* request.on('end', function (){

             respond.end();

     });*/
});


app.post('/api/mediafolders/save', passport.authenticate('jwt', {session: false}), function (req, res) {

    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                returnmediaFolders = []
                req.body.mediafolders.forEach(function (mediafolder) {
                    if (mediafolder != undefined) {
                        /*  Algo.findByIdAndUpdate(req.body.params.algo._id,{$set:req.body.params.algo} ,{new: true},function(err,algo){
                         if(err){ return res.json({success: false, msg: err});}
                         res.json({success: true, msg: 'Successful added annotation.',_id:algo._id,algo:algo});
                         });*/

                        if (mediafolder._id != undefined) {
                            Mediafolderpath.findByIdAndUpdate(mediafolder._id, {$set: mediafolder}, {new: true}).populate('dependencies').populate('model').populate('media').exec(
                                function (err, mediafolder) {
                                    if (err) {

                                    }
                                    returnmediaFolders.push(mediafolder)
                                }
                            );
                        } else {
                            var mediafolders = new Mediafolderpath({
                                path: mediafolder.path,
                                name: mediafolder.name,
                                createdBy: user._id
                            });


                            mediafolders.save(function (err) {
                                'use strict';
                                if (err) {
                                    if (err.name === 'MongoError' && err.code === 11000) {
                                        //throw err;
                                        return res.status(500).send({
                                            succes: false,
                                            message: 'Algo already exist!'
                                        });
                                        console.log(err);
                                    }
                                } else {

                                    returnmediaFolders.push(mediafolders)
                                }


                            });
                        }
                    }
                })
                res.json({
                    success: true,
                    msg: 'Successful added folders.',

                    mediafolders: returnmediaFolders
                })
                //respond.end("yes");

            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }

    var body = '';



    // your JSON
    //response.send(request.body);    // echo the result back
    /*request.on('data', function(data) {
     var file = './tmp/data.json';

     /!*jsonfile.writeFile(file, data, function (err) {
     console.error(err)
     });*!/
     });*/

    /* request.on('end', function (){

     respond.end();

     });*/
});
app.post('/api/classes/save', passport.authenticate('jwt', {session: false}), function (req, res) {

    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {

                if (req.body.classes._id != undefined) {
                    /*  Algo.findByIdAndUpdate(req.body.params.algo._id,{$set:req.body.params.algo} ,{new: true},function(err,algo){
                     if(err){ return res.json({success: false, msg: err});}
                     res.json({success: true, msg: 'Successful added annotation.',_id:algo._id,algo:algo});
                     });*/
                    Classes.findByIdAndUpdate(req.body.classes._id, {$set: req.body.classes}, {new: true}).populate('dependencies').populate('model').populate('media').exec(
                        function (err, classes) {
                            if (err) {
                                return res.json({success: false, msg: err});
                            }
                            res.json({
                                success: true,
                                msg: 'Successful added annotation.',
                                _id: classes._id,
                                classes: classes
                            })
                        }
                    );

                } else {
                    var clasess = new Classes({
                        classes: req.body.classes.classes,
                        name: req.body.classes.name,
                        createdBy: user._id
                    });


                    clasess.save(function (err) {
                        'use strict';
                        if (err) {
                            if (err.name === 'MongoError' && err.code === 11000) {
                                //throw err;
                                return res.status(500).send({succes: false, message: 'Algo already exist!'});
                                console.log(err);
                            }
                        } else {
                            res.json({
                                success: true,
                                clasess: clasess,
                                msg: 'Classes is Saved to your member area ' + user.userName + '!'
                            });

                        }


                    });
                }
                //respond.end("yes");

            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }

    var body = '';



    // your JSON
    //response.send(request.body);    // echo the result back
    /*request.on('data', function(data) {
     var file = './tmp/data.json';

     /!*jsonfile.writeFile(file, data, function (err) {
     console.error(err)
     });*!/
     });*/

    /* request.on('end', function (){

     respond.end();

     });*/
});
app.get('/api/algo', passport.authenticate('jwt', {session: false}), function (req, res) {

    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {


                Algo.findOne({createdBy: user._id}, function (err, doc) {
                        console.dir(doc)
                        res.json(doc);
                        //res.setHeader('Content-Type', 'application/json');
                        // res.send();
                    }
                );

            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }


    /*jsonfile.readFile(file, function(err, obj) {



    })*/

});

app.get('/api/myAlgos', passport.authenticate('jwt', {session: false}), function (req, res) {

    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {


                Algo.find({createdBy: user._id}).populate('postedBy').exec(function (err, algos) {

                        res.json(algos);
                        //res.setHeader('Content-Type', 'application/json');
                        //res.send();
                    }
                );

            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }


    /*jsonfile.readFile(file, function(err, obj) {



     })*/

});

app.delete('/api/algo/delete', passport.authenticate('jwt', {session: false}), function (req, res) {

    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {

                Algo.findOne({_id: req.query.id}, function (err, algo) {
                    if (algo) {
                        var dockerSpown = spawn('docker', ['service', 'rm', algo.name]);
                        dockerSpown.on('data', function (data) {

                        })
                        dockerSpown.on('error', function (err) {
                            console.log('err creating service' + err)
                        })
                        dockerSpown.on('exit', function (err) {
                            console.log('service started')
                        })
                        dockerSpown.on('close', function (err) {

                        })
                    }

                })

                Algo.remove({_id: req.query.id}, function (err) {
                    if (err) return handleError(err);
                    // removed!

                    res.json({success: true, msg: 'removed !'});
                });

            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }


    /*jsonfile.readFile(file, function(err, obj) {



     })*/

});
app.delete('/api/annotation/delete', passport.authenticate('jwt', {session: false}), function (req, res) {

    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {


                Annotation.remove({_id: req.query.id}, function (err) {
                    if (err) return handleError(err);
                    // removed!

                    res.json({success: true, msg: 'removed !'});
                });

            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }


});
app.delete('/api/annotation/deleteAll', passport.authenticate('jwt', {session: false}), function (req, res) {

    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {


                Annotation.remove({uploadedBy: user._id}, function (err) {
                    if (err) return handleError(err);
                    // removed!

                    res.json({success: true, msg: 'removed !'});
                });

            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }


});

app.delete('/api/media/delete', passport.authenticate('jwt', {session: false}), function (req, res) {

    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {


                Media.remove({_id: req.query.id}, function (err) {
                    if (err) return handleError(err);
                    // removed!

                    res.json({success: true, msg: 'removed !'});
                });

            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }


});
app.delete('/api/media/deleteAll', passport.authenticate('jwt', {session: false}), function (req, res) {

    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            _id: decoded._id
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {


                Media.remove({uploadedBy: user._id}, function (err) {
                    if (err) return handleError(err);
                    // removed!

                    res.json({success: true, msg: 'removed !'});
                });

            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }


});
// connect the api routes under /api/*
app.use('/api', apiRoutes);

// app.listen(port);
server.listen(port);
/*var file = './tmp/data.json';
jsonfile.readFileSync(file, function(err, obj) {
    console.dir(obj)
});*/

var obj = {name: 'JP'};
console.log('There will be dragons: http://localhost:' + port);
/*

jsonfile.writeFile(file, obj, function (err) {
    console.error(err)
});
jsonfile.readFile(file, function(err, obj) {
    console.dir(obj)
});
*/
