/**
 * Created by ivanjacob1 on 14/05/16.
 */

var http = require("http");
var request = require('request');
var Rx = require('rx');
var RxNode = require('rx-node');
var ffmpeg1 = require('fluent-ffmpeg');
/*var Grid = require('gridfs');
var Grid = require('gridfs-locking-stream');*/
var mongo = require('mongodb');
var ps = require('pause-stream')();
var GridStore = mongo.GridStore;
var ObjectID = require('mongodb').ObjectID;
var GridFS = require('gridfs-stream');
var blobs=[];
var fs=require('fs');
var stream = require('stream');
// var avconv = require('avconv');
var spawn = require('child_process').spawn;
var pngPlucker = require('png-plucker');
JSONStream = require('JSONStream')
    , es = require('event-stream');

var async = require("async");
var readline      = require('readline');
var Algo=require('../../js/models/algo');
var AlgoAnnoRun=require('../../js/models/algoannorun');
var FilteredFramesCollection=require('../../js/models/filteredframesCollection');
var Algoannotation=require('../../js/models/algoannotation')
var Filter=require('../../js/models/filter');
var Frame=require('../../js/models/frame');
var FramesCollection=require('../../js/models/framesCollection');
var Media=require('../../js/models/media');
var FilteredFrame=require('../../js/models/filteredframes');
var docker=require('../../js/docker/docker');
var youtubedl = require('youtube-dl');
/*var db=new mongo.Db('velocitydb', new mongo.Server("127.0.0.1", 27017));*/
//var db;
// connect to database

var config = require('../config/database');
var mongoose = require('mongoose');
console.log(mongoose.connection.name)
if(mongoose.connection.name===undefined)
{

    mongoose.connect(config.database);
    console.log(mongoose.connection.name)
}
var conn = mongoose.connection;
var db=conn.name;


var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var  gfs=Grid(conn.name);

//Call gPRC

var PROTO_PATH =__dirname +  '/helloworld.proto';
var PROTO_MOV_PATH=__dirname +  '/movingobj.proto';
var grpc = require('grpc');
var hello_proto = grpc.load(PROTO_PATH).helloworld;
var movingobj_proto = grpc.load(PROTO_MOV_PATH).helloworld;
    var PNG_HEADER_BUF = new Buffer([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
  PNG_HEADER_STRING = PNG_HEADER_BUF.toString('utf8'),
  JPEG_HEADER_BUF = new Buffer([0xff, 0xd8]),
  JPEG_HEADER_STRING = JPEG_HEADER_BUF.toString('utf8');

 var plucker = require('image-plucker');



var extractFramesAndSave=function(media,db){
    
    

//var db = new mongo.Db('velocity', new mongo.Server("localhost", 27017));



    var gfs=GridFS(db,mongo);

    var readstream = gfs.createReadStream({_id : media.media.id
    });

    var readstream2 = gfs.createReadStream({_id : media.media.id
    });


    readstream.on('error', function (err) {
    console.log('An error occurred!', err);
    throw err;
});

    var framesCollection=new FramesCollection();
    framesCollection.framesOfMedia=media._id;

  /*  media.save(function(err) {
        if (err) {
            console.log({success: false, msg: 'error saving frame.'});
        }
        console.log({success: true, msg: 'Successful saved reference in media for frames collection'});

    });*/
    var  counter = 0;



    commandGetFrames=['ffprobe','-show_frames','-of','compact=p=0','-print_format','json','-loglevel', 'quiet','-'];
    var frames = spawn('ffprobe', ['-show_frames','-of','compact=p=0','-print_format','json','-loglevel', 'quiet','-']);
    readstream.pipe(frames.stdin);




    var jsonstream=JSONStream.parse('frames.*');
  var fram=[] ;
      frames.stdout
    .pipe(jsonstream)

    var subscription = RxNode.fromTransformStream(jsonstream)
        .subscribe(function (data) {
            fram.push(data);


        });

    var ffmpeg = spawn('avconv', ['-i','pipe:0','-vcodec','mjpeg','-f', 'image2pipe', '-']);

   readstream2.pipe(ffmpeg.stdin);

    plucker(ffmpeg.stdout, 'jpeg', function (error, image) {
     //   console.log(counter);
     /* var  _frame=fram.filter(function(frame)
        {
            if(frame.coded_picture_number===counter) return frame;

        });*/
      var  _frame= fram[counter];
        //if(_frame.coded_picture_number===counter){
            var newFrame = new Frame(_frame);
            // save the user
        newFrame.media=media._id;
       var writestream= gfs.createWriteStream({mode: 'w', contentType: 'image/jpeg', ref: 'imgageFS' });
        writestream.write(image);
        writestream.end();
        writestream.on('close', function (image) {
            newFrame.image=image;
            framesCollection.frames.push(newFrame._id);


            newFrame.save(function(err) {
                if (err) {
                    console.log({success: false, msg: 'error saving frame.'});
                }
               // console.log(counter);
                //  console.log({success: true, msg: 'Successful saved frame.'});
            });

         //   console.log("saved"+image._id);
        });


       // }


        counter++;
        // done()
    });

    ffmpeg.on('exit',function () {
        console.log("exit")
        console.log("counter"+counter)
        console.log("framesStream length"+fram.length)
        framesCollection.save(function(err) {
            if (err) {
                console.log({success: false, msg: 'error saving frame.'});
            }
            console.log({success: true, msg: 'Successful saved frames collection'});
            // media.frmasecollection=framesCollection._id;
        });
    })



}
var saveMetaFrames=function(media,callback){

    var framExtMeta={} ;
    FramesCollection.findOne({"framesOfMedia" :media._id},function(err,media){
        if(media){
            return;
        }
    })
    var framesCollection=new FramesCollection();
    framesCollection.framesOfMedia=media._id;
    console.log(media.media.id)
    var readstream = gfs.createReadStream({
        _id: media.media.id
    });

    var framesExtMetaSpawn = spawn('ffprobe', ['-show_frames','-of','compact=p=0','-print_format','json','-loglevel', 'quiet','-']);
    readstream.pipe(framesExtMetaSpawn.stdin);




    var jsonstream=JSONStream.parse('frames.*');

    framesExtMetaSpawn.stdout
        .pipe(jsonstream);
    framesExtMetaSpawn.on('exit',function () {
        framesCollection.save(function(err,framescoll) {
            if (err) {
                console.log({success: false, msg: 'error saving frame.'});
            }
            if(callback!=null)callback(null,framescoll);
            console.log({success: true, msg: 'Successful saved frames collection'});
            // media.frmasecollection=framesCollection._id;
        });
    })
    var subscription = RxNode.fromTransformStream(jsonstream)
        .subscribe(function (data) {
            // console.log(data)
            framExtMeta[data.pkt_pos]=data;
            var newFrame = new Frame(data);
            newFrame.media=media._id;
            newFrame.image=undefined;
            newFrame.markModified('object')
            framesCollection.frames.push(newFrame._id);
            newFrame.save(function(err) {
                if (err) {
                    console.log({success: false, msg: 'error saving frame.'});
                }
                //  console.log('save');
                //  console.log({success: true, msg: 'Successful saved frame.'});
            });

        });


    return framExtMeta;

};
var savefilteredFrames =function (media,scale,sceneFilter,chainAnalyze,filteredFramesCollection,model,algoAnnoRun,callback) {
    var logs=[];
    var start =new Date();
    var  framesMeta={};

    var items=[];

    filteredFramesCollection.scene=sceneFilter;
    filteredFramesCollection.scale=scale;


    filteredFramesCollection.media=media._id;
    var  undefinedImages={};
    var readstream = gfs.createReadStream({
        _id: media.media.id
    });
    var frames = spawn('ffmpeg', ['-i', 'pipe:0','-vf','select=gt(scene\\,'+sceneFilter+'),scale=iw/'+scale+':-1,mpdecimate,setpts=N/FRAME_RATE/TB,showinfo','-f','image2pipe','-']);
    readstream.pipe(frames.stdin).on('error',function (err) {
        console.log(err)
    });


    plucker(frames.stdout, 'jpeg', function (error, image) {
        // console.log('img'+imagesNr++)
        items.push(image);
        /*fs.appendFile('image'+items.length, new Buffer(image), function (err) {
         if (err) {
         console.log(err);
         } else {
         return(image.length);
         }
         });*/

        var imag = new Buffer(image).toString('base64');

        if(framesMeta[items.length-1]===undefined){
            undefinedImages[items.length-1]={name: image.toString('base64')};
            console.log('adding to undefined');
        }else{
            var filteredFrame=new FilteredFrame(framesMeta[items.length-1]);
            filteredFrame.ffcollection=filteredFramesCollection._id;
            // var img=new Image();
            // img.contentType='image/jpeg';

            /*var writestream= gfs.createWriteStream({mode: 'w', contentType: 'image/jpeg', ref: 'GFS' });
             writestream.write(image);
             writestream.end();
             writestream.on('close', function (image) {
             img.img=image._id;
             img.save(function (err) {
             if (err) {
             console.log({success: false, msg: 'error saving image.'});
             }

             });
             })*/




            // var writestream= gfs.createWriteStream({mode: 'w', contentType: 'image/jpeg', ref: 'GFS' });
            // writestream.write(image);
            // writestream.end();
          //  writestream.on('close', function (image) {

                filteredFrame.image=image;
                Frame.findOne({pkt_pos:filteredFrame.pos},function(err,frame){
                    if (err) {
                        console.log({success: false, msg: 'error finding frame.'});
                    }
                    filteredFrame.frame=frame._id;
                    filteredFrame.media=media._id;
                    //   console.log( filteredFrame.fromMedia)
                    //    console.log( filteredFrame.frame)
                    filteredFrame.save(function (err,frame) {
                        if (err) {
                            console.log({success: false, msg: 'error saving frame.'});
                        }
                        filteredFramesCollection.frames.push(frame._id);
                        FilteredFramesCollection.update({_id: filteredFramesCollection._id}, filteredFramesCollection, {upsert: true},function(err,collection){
                            if(err)console.log(err)
                            //console.log(collection)
                        });
                        //console.log( frame.fromMedia)
                    })
                });
            // }
           // )





            //if(framExtMeta[framesMeta[items.length-1].pos]===undefined) console.log('not found position dammit')
            //  call.write({name: image.toString('base64')});
            // console.log('sending')
        }


    });


    readline.createInterface({
        input     : frames.stderr,
        terminal  : false
    }).on('line', function(data) {
        // console.log(data);
        logs.push(data.toString());
        if(data.toString().includes('Parsed_')&&(data.toString().includes('pos:')||data.toString().includes('n:')||data.toString().includes('fr:'))){
            var str = data.toString(),
                str=str.replace(/.*?]/, '');
            str=str.replace(/\b]/, ' ');
            str = str.replace(/(?:\b\r\n|\r|\n)/g, '');
            //str=str.replace(/ /g,'');
            var splitted=str.match(/\S*:\s*\w*\/*\w*\[*\w*\]*/g);
            var clean=[]
            splitted.forEach(function (element) {
                clean.push(element.replace(/ /g,''));
            });
            splitted=clean;
            var jsonstring='';
            splitted.forEach(function (element,index) {

                var elements= element.split(":")
                if(index>0) jsonstring=jsonstring+',';
                jsonstring=  jsonstring+'"'+elements[0]+'"'+':'+'"'+elements[1]+'"';

            }) ;
            jsonstring=jsonstring.replace('""','"');
            jsonstring='{'+jsonstring+'}';
            var meta = JSON.parse(jsonstring);
            framesMeta[meta.n]=meta;
            //     console.log(json)

        }


    });
    frames.stderr.on('data', function (data) {
        //console.log(data.toString())
        ////(\S*:s*)\w+


    });

    readstream.on('error', function (err) {
        console.log('An error occurred!', err);
        throw err;
    });
    frames.stdout.on('close',function () {
        console.log('endski'+'frames.nr='+Object.keys(framesMeta).length+' images.nr='+items.length)
        //resendUdefined();
        FilteredFramesCollection.update({_id: filteredFramesCollection._id}, filteredFramesCollection, {upsert: true},function(err,collection){
            if(err)console.log(err)
            //console.log(collection)
            callback(null,filteredFramesCollection)
        });
        if(chainAnalyze){
            analyze(media,filteredFramesCollection,'localhost:443',algoAnnoRun);
        }

    });
    return framesMeta;
};

var analyze=function(media,ffcollection,algoservice,algoAnnoRun){

    var start=new Date();

    // call.on('end', callback);




// Array to hold async tasks


    FilteredFrame.find({ "media": media._id,"ffcollection":ffcollection._id},function(err,filteredframes){
        if(err) console.log(err)
        var asyncTasks = [];
        // Loop through some items
        var chunks=[];
        Algo.findOne({_id:algoAnnoRun.algo},function (err,algo) {
            if(err) console.log(err)
           docker.getNumberOfContainers( algo.apipath,function(number){

               docker.getAssignedPort(algo.name,function (port) {


               if(number=1){
                   var i,j,temparray,chunk = 4;
                   for (i=0,j=filteredframes.length; i<j; i+=chunk) {
                       temparray = filteredframes.slice(i,i+chunk);
                       // do whatever
                       chunks.push(temparray)
                   }
               }else{
                   var i,j,temparray,chunk = number;
                   for (i=0,j=filteredframes.length; i<j; i+=chunk) {
                       temparray = filteredframes.slice(i,i+chunk);
                       // do whatever
                       chunks.push(temparray)
                   }
               }


               chunks.map(function (chunk) {

                   asyncTasks.push(function(callback){
                       var client = new hello_proto.Greeter('localhost:'+port,
                           grpc.credentials.createInsecure());
                       // Call an async function, often a save() to DB
                       var call = client.sayHelloAgain();
                       call.on('error',function (error) {
                           console.log(error)
                           return;
                       });
                       call.on('end',function () {
                           console.log('end')
                           callback();

                       });
                       call.on('exit',function () {
                           console.log('exit')
                           return;
                       });


                       call.on('data', function(data) {
                           console.log('Got message ' + data.frameid +' '+ data.filteredframeid +' '+data.label +' '+data.score);
                           var algoanno=new Algoannotation(data);
                           algoanno.frame=data.frameid;
                           algoanno.annotatedOnMedia=media._id;
                           algoanno.filteredframe=data.filteredframeid;
                           algoanno.algoannorun=algoAnnoRun._id;
                           algoanno.save(function(err,algoanno){
                               if(err)console.log(err)
                               // console.log(algoanno)
                               algoAnnoRun.endDate=+ new Date();
                               algoAnnoRun.algoanotations.push(algoanno._id);
                               AlgoAnnoRun.update({_id: algoAnnoRun._id}, algoAnnoRun, {upsert: true},function(err,collection){
                                   if(err)console.log(err);
                                   //console.log(collection)
                               });
                           });
                           var diff=  new Date(new Date().getTime()-start.getTime())
                           // console.log(diff.getMinutes()+':'+diff.getSeconds()+':'+diff.getMilliseconds())

                       });
                       chunk.map(function (frame,index) {
                           call.write({name: frame.image.toString('base64'),frameid:frame.frame.toString(),filteredframeid:frame._id.toString()});

                       })
                       call.end();

                   });
               })
               async.parallel(asyncTasks, function(){
                   // All tasks are done now
                   console.log('done analysing')
                   algoAnnoRun.status='end';
                   algoAnnoRun.endDate=+new Date();
                   AlgoAnnoRun.update({_id: algoAnnoRun._id}, algoAnnoRun, {upsert: true},function(err,collection){
                       if(err)console.log(err);
                       //console.log(collection)
                   });
               });
           })
           })
        })



        // Now we have an array of functions doing async tasks
        // Execute all async tasks in the asyncTasks array

    });


}

var movingObjects=function (media,ffcollection,callback,algoAnnoRun) {


    FilteredFrame.find({"media": media._id, "ffcollection": ffcollection}, function (err, filteredframes) {
        if (err) console.log(err)
        var algoanno = [];

        //sort by number
        filteredframes = filteredframes.map(function (frame) {
            frame.n = parseInt(frame.n);
            return frame
        }).sort(function (a, b) {

            return a.n - b.n;
        });
        var count = 0;
        var asyncTasks = [];
        // Loop through some items
        var chunks = [];
        var i, j, temparray, chunk = 6;
        for (i = 0, j = filteredframes.length; i < j; i += chunk) {
            temparray = filteredframes.slice(i, i + chunk);
            // do whatever
            chunks.push(temparray)
        }

        chunks.map(function (chunk) {

            asyncTasks.push(function (callback) {


                var clientMovObj = new movingobj_proto.Greeter('localhost:55015',
                    grpc.credentials.createInsecure());
                // Call an async function, often a save() to DB
                var callMovObj = clientMovObj.sayHello();
                // chunk.map(function (frame) {
                //     var splitted = frame.s.split('x');
                //     var width = parseInt(splitted[0]);
                //
                //     var height = parseInt(splitted[1]);
                //     console.log('frameid '+frame.image.toString('base64'))
                //     console.log('filteredframeid '+frame._id.toString())
                //     callMovObj.write({first: frame.image.toString('base64'),second: frame.image.toString('base64'),frameid:frame.frame.toString(),filteredframeid:frame._id.toString(),width:"10",height:"10"});
                //
                // })

                callMovObj.on('end', function () {
                    console.log('end')
                    callback(null)

                });
                callMovObj.on('exit', function () {
                    console.log('exit')


                    return;
                });

                callMovObj.on('error', function (error) {
                    console.log(error)
                    return;
                })
                callMovObj.on('data', function (data) {
                    // console.log(data);
                    var algoanno = new Algoannotation(data);
                    algoanno.frame = data.frameid;
                    algoanno.annotatedOnMedia = media._id;
                    algoanno.image = data.image;
                    algoanno.x1 = data.x1;
                    algoanno.x2 = data.x2;
                    algoanno.y1 = data.y1;
                    algoanno.y2 = data.y2;
                    algoanno.filteredframe = data.filteredframeid;
                    FilteredFrame.findOne({_id: data.filteredframeid}, function (err, frame) {
                        if (err) console.log(err)
                        var splitted = frame.s.split('x');
                        algoanno.orgWidth = parseInt(splitted[0]);
                        algoanno.orgHeight = parseInt(splitted[1]);
                        algoanno.algoannorun = algoAnnoRun._id;
                        algoanno.save(function (err, algoanno) {
                            if (err)console.log(err)
                            // console.log(algoanno)
                            algoAnnoRun.endDate = +new Date();
                            algoAnnoRun.algoanotations.push(algoanno._id);
                            AlgoAnnoRun.update({_id: algoAnnoRun._id}, algoAnnoRun, {upsert: true}, function (err, collection) {
                                if (err)console.log(err);
                                //console.log(collection)
                            });
                            //algoanno.push(algoanno);
                            // call.write({name: data.image,frameid:algoanno._id.toString(),filteredframeid:data.filteredframeid});
                        })

                    });


                });

                var filteredframes$$ = Rx.Observable.from(chunk).map(function (frame) {


                    return frame;
                }).bufferWithCount(2).map(function (frames) {


                    if (frames[1] != undefined) {
                        var splitted = frames[0].s.split('x');
                        var widthF = parseInt(splitted[0]);
                        var heightF = parseInt(splitted[1]);
                        var splitted = frames[1].s.split('x');
                        var widthS = splitted[0];
                        var heightS = splitted[1];
                        console.log(count)
                        ++count;
                        callMovObj.write({
                            first: frames[0].image.toString('base64'),
                            second: frames[1].image.toString('base64'),
                            frameid: frames[1].frame.toString(),
                            filteredframeid: frames[1]._id.toString(),
                            width: widthF.toString(),
                            height: heightF.toString()
                        });

                    }

                }).subscribe(function (frames) {

                });
                callMovObj.end();

            });
        })


        // Now we have an array of functions doing async tasks
        // Execute all async tasks in the asyncTasks array
        async.parallel(asyncTasks, function () {
            // All tasks are done now
            console.log('done analysing')
            AlgoAnnoRun.findOne({_id: algoAnnoRun._id}).populate('algoanotations').exec(function (err, algoannorun) {

                callback(null,algoannorun);
                console.log('done analysing moving objects')
            });

        });
    });
}
var analyzeChained= function(algoAnnoRun, callback,algoservice)
{


    var asyncTasks = [];
    // Loop through some items
    var chunks = [];
    var i, j, temparray, chunk = 6;
    for (i = 0, j = algoAnnoRun.algoanotations.length; i < j; i += chunk) {
        temparray = algoAnnoRun.algoanotations.slice(i, i + chunk);
        // do whatever
        chunks.push(temparray)
    }
    chunks.map(function (chunk) {

        asyncTasks.push(function (callback) {
            var client = new hello_proto.Greeter(algoservice,
                grpc.credentials.createInsecure());
            // Call an async function, often a save() to DB
            var call = client.sayHelloAgain();
            call.on('error',function (error) {
                console.log(error)
                return;
            })
            call.on('error',function (error) {
                console.log(error)
                return;
            });
            call.on('end',function () {
                console.log('end')
                callback(null)

            });
            call.on('exit',function () {
                console.log('exit')
                callback(null)
                return;
            });

            call.on('data', function(data) {
                // console.log('Got message ' + data.frameid +' '+ data.filteredframeid +' '+data.label +' '+data.score);
                //var algoanno=new Algoannotation(data);
                // algoanno.frame=data.frameid;
                // algoanno.annotatedOnMedia=media._id;
                // algoanno.filteredframe=data.filteredframeid;
                // algoanno.save(function(err,algoanno){
                //     if(err)console.log(err)
                //     // console.log(algoanno)
                // })

                Algoannotation.findByIdAndUpdate(data.frameid,{$set:{label:data.label,score:data.score}} ,{new: true},function(err,algoanno){
                    if(err){ console.log(err);}
                    // console.log(algoanno)
                });

                // console.log(diff.getMinutes()+':'+diff.getSeconds()+':'+diff.getMilliseconds())

            });

            chunk.map(function (annotation,index) {

                call.write({name: annotation.image.toString('base64'),frameid:annotation._id.toString(),filteredframeid:annotation._id.toString()});

            })
            call.end();
        })
    })

    async.parallel(asyncTasks, function () {
        // All tasks are done now
        console.log('done analysing poi')
        algoAnnoRun.status='end';
        algoAnnoRun.endDate=+new Date();
        AlgoAnnoRun.update({_id: algoAnnoRun._id}, algoAnnoRun, {upsert: true},function(err,collection){
            if(err)console.log(err);
            //console.log(collection)
            callback(null);
        });
      
    });

};
module.exports = {
    extractFramesAndSave: extractFramesAndSave,
    saveMetaFrames: saveMetaFrames,
    savefilteredFrames: savefilteredFrames,
    analyze:analyze,
    analyzeChained:analyzeChained,
    movingObjects:movingObjects

}
//filters
// speed up
// ffmpeg -i IMG_2803.MOV.mp4 -filter:v "setpts=0.03125*PTS" output.mp4
// scale
// -vf scale=iw/2:-1
//ffmpeg -i IMG_2803.MOV.mp4 -vf scale=iw/4:-1,setpts=0.03125*PTS  output.mp4
//ffmpeg -i IMG_2828.MOV.mp4 -vf "select=gt(scene\,0.01),mpdecimate,showinfo"  output.mp4

// -vsync 0 ==> remove douplicate frames
// -vf mpdecimate ==> remove douplicate frames
//ffmpeg -vf "-vf select='gt(scene\,0.9)'" -i somevideo.mp4 -vsync 0 -f image2 /tmp/thumbnails-%02d.jpg
//ffmpeg -i IMG_2828.MOV.mp4 -vf "select=gt(scene\,0.01),mpdecimate,setpts=N/FRAME_RATE/TB"  output.mp4
//ffmpeg -i IMG_2828.MOV.mp4 -vf "select=gt(scene\,0.009),mpdecimate,setpts=N/FRAME_RATE/TB,showinfo"  output.mp4
















/*var Image = Canvas.Image;
 var canvas = new Canvas(625,500);
 var overlay = new Canvas(625,500);
 var ctx = canvas.getContext('2d');
 var overlayCtx = overlay.getContext('2d');
 var ctrack = new clm.tracker({stopOnConvergence : true,useWebGL : true});
 ctrack.init(pModel);


/*
 Working pipe in out avocnv

 */
/*

 Split per second


 var ffmpeg = spawn('avconv', ['-i','pipe:0', '-vcodec', 'png','-s','625x500', '-f', 'image2pipe', '-']);
 */

/* frames.stdout.on('data', function(chunk) {


 var textChunk = chunk.toString('utf8')

 console.log(textChunk);


 });*/

/*
 var clm = require('../common/algorithms/clmtracker/js/clm.js');
 var Canvas = require('../common/algorithms/clmtracker/node_modules/canvas');
 var emotionClassifier = require('../common/algorithms/clmtracker/node-examples/js/emotion_classifier.js');
 var emotionModel = require('../common/algorithms/clmtracker/node-examples/js/emotion_model.js');
 var pModel = require('../common/algorithms/clmtracker/models/model_pca_20_svm.json');
 */

/*var ytdl = require('ytdl-core');*/
/*
 console.log(data);

 var liner = new stream.Transform( { objectMode: true } )
 liner._transform = function (data, encoding, done) {
 console.log(data);
 console.log('encoding '+encoding);
 console.log('done '+done);

 tb1 = parseFloat(data.pkt_dts_time);
 tbh1 = parseInt(tb1 / 3600);
 tbm1 = (tb1 % 3600) / 60;
 tbs1 = (tb1 % 3600) % 60 % 60;
 tstart =tbh1 + ':' + tbm1 + ':' + tbs1
 tb2 = data.pkt_dts_time+data.pkt_duration_time;
 tbh2 =tb2 / 3600;
 tbm2 = (tb2 % 3600) / 60;
 tbs2 = ((tb2 % 3600) % 60) % 60;
 tsend = tbh2 + ':' + tbm2 + ':' + tbs2
 command1 = [
 '-ss', tstart,
 '-i', '-',
 '-to'
 ,tsend,
 '-c','copy','-copyts',
 '-qscale:v', '1',
 '-f', 'image2pipe',
 '-vcodec', 'mjpeg',
 '-'];
 var frameImage = spawn('avconv',['-i','-','-ss',tstart,'-frames:v','1','-vcodec','mjpeg','-f','image2pipe','-']);
 frameImage.setMaxListeners(1500)
 readstream2.pipe(frameImage.stdin);
 var dd = "";
 frameImage.stdin.on('error',function (error) {
 console.log(error)
 })
 counter=0;
 frameImage.stdout.on('data',function (data) {
 //console.log(data)
 })
 plucker(frameImage.stdout, 'jpeg', function (error, image) {
 console.log(counter)
 // var out = fs.createWriteStream('testSplit/test'+counter+'.jpeg');
 //out.write(image);
 counter++;
 // done()
 });


 };

 tb1 = parseFloat(data.pkt_dts_time);
 tbh1 = parseInt(tb1 / 3600);
 tbm1 = (tb1 % 3600) / 60;
 tbs1 = (tb1 % 3600) % 60 % 60;
 tstart =tbh1 + ':' + tbm1 + ':' + tbs1
 tb2 = data.pkt_dts_time+data.pkt_duration_time;
 tbh2 =tb2 / 3600;
 tbm2 = (tb2 % 3600) / 60;
 tbs2 = ((tb2 % 3600) % 60) % 60;
 tsend = tbh2 + ':' + tbm2 + ':' + tbs2
 command1 = [
 '-ss', tstart,
 '-i', '-',
 '-to'
 ,tsend,
 '-c','copy','-copyts',
 '-qscale:v', '1',
 '-f', 'image2pipe',
 '-vcodec', 'mjpeg',
 '-'];
 var frameImage = spawn('avconv',['-ss',tstart,'-i','-','-frames:v','1','-vcodec','mjpeg','-f','image2pipe','-']);
 frameImage.setMaxListeners(1500)
 readstream2.pipe(frameImage.stdin);
 var dd = "";
 frameImage.stdin.on('error',function (error) {
 console.log(error)
 });
 counter=0;
 var subscription = RxNode.fromWritableStream(frameImage.stdout)
 .subscribe(function (x) {
 console.log(counter);
 counter++});

 /!*plucker(frameImage.stdout, 'jpeg', function (error, image) {
 console.log(counter)
 // var out = fs.createWriteStream('testSplit/test'+counter+'.jpeg');
 //out.write(image);
 counter++;
 // done()
 });*!/*/
// Working stream to udp
//var livestreamer= spawn('livestreamer', [  '--player','ffmpeg -i','--player-args','{filename} -vcodec libx264 -tune zerolatency -b 900k -f mpegts udp://localhost:1234', 'https://www.youtube.com/watch?v=Ga3maNZ0x0w',' best']);

// var livestreamer= spawn('livestreamer', [  '-O',' https://www.youtube.com/watch?v=Ga3maNZ0x0w','best','|','avconv','-i ','pipe:0',' -vsync',' 1','-r','1','-f','image2pipe','-']);

//livestreamer -O https://www.youtube.com/watch?v=Ga3maNZ0x0w best |  avconv -i pipe:0 -vsync 1 -r 1 -f image2 'img-%03d.jpeg'

// var livestreamer= spawn('livestreamer', [ '-O','https://www.youtube.com/watch?v=Ga3maNZ0x0w',' best','|','ffmpeg','-i','-','-r','1','-f','image2pipe','-vcodec','pgm','pipe:1']);


//  livestreamer -O https://www.youtube.com/watch?v=Ga3maNZ0x0w best | avconv -i  pipe:0 -vcodec  png  -f image2pipe -| ffmpeg -i -  -vcodec libx264 -crf 25  -pix_fmt yuv420p test.mp4



/* var livestreamer= spawn('livestreamer', ['-O','https://www.youtube.com/watch?v=Ga3maNZ0x0w','best']);

 var img2vid= spawn('ffmpeg', ['-i','-','-vcodec','libx264','-crf','25','-pix_fmt','yuv420p','test.mp4']);

 var img2Commpress= spawn('ffmpeg', ['-i','-','-c',':v','libx264','-preset','ultrafast','-f','rawvideo','-']);
 var commpress2Stream= spawn('ffmpeg', ['-f','rawvideo','-c:v','h264','-i','-','-vcodec','libx264','-tune','zerolatency','-b','900k','-f','mpegts','udp://localhost:1234']);
 */
//writestream=fs.createWriteStream("you.mp4")
/* var imageString=image.toString('base64');
 var path='/serve?img='+imageString;
 var postData = {
 name: 'img',
 value: imageString
 }
 var options = {
 host: 'localhost',
 port: 8880,
 path: '/serve',
 body: postData

 };

 http.get(options,function(resp){
 resp.on('data', function(chunk){
 //do something with chunk
 });
 }).on("error", function(e){
 console.log("Got error: " + e.message);
 });*/



// var out = fs.createWriteStream('testSplit/test'+counter+'.jpeg');
//out.write(image);
//gs.open(function(err,gs){
/*
 //ffmpeg.stdout.pipe(img2vid.stdin);
 //ffmpeg.stdout.pipe(img2Commpress.stdin);
 // img2Commpress.stdout.pipe(commpress2Stream.stdin);

 ffmpeg.stdout.on('data', function(chunk) {
 console.log(chunk)
 });
 counter=0;


var stream = require('stream');
 /!* var readstream = gfs.createReadStream({
 _id: '575294db682714720653f383'
 });
 readstream.pipe(wstream);*!/
 var liner = new stream.Transform( { objectMode: true } )
 liner._transform = function (chunk, encoding, done) {
 console.log(chunk);
 console.log('encoding '+encoding);
 console.log('done '+done);



 var writestream = gfs.createWriteStream({filename:'thumb%04d.jpg',mode: 'w',
 contentType: 'image/jpeg'});
 writestream.write(chunk);
 writestream.end();

 done()
 };
 */
/*   var params = [
 '-i', 'pipe:0',
 /// Tell avconv to expect an input stream (via its stdin)

 '-r',' 1',
 '-f','image2pipe',
 '-vcodec','ppm',
 'pipe:1'
 // Tell avconv to stream the converted data (via its stdout)
 ];













Working stream in from db


    var readstream = gfs.createReadStream({
      _id: '5753d412b4d248d80ba36d22'
    });

     readstream.pipe(ffmpeg.stdin);
     */

   /* var video = youtubedl('https://www.youtube.com/watch?v=Ga3maNZ0x0w',
      // Optional arguments passed to youtube-dl.
       ['--prefer-ffmpeg','--format=95','--hls-use-mpegts'],
      // Additional options can be given for calling `child_process.execFile()`.
      { cwd: __dirname });

// Will be called when the download starts.
    video.on('info', function(info) {
      console.log('Download started');
      console.log('filename: ' + info._filename);
      console.log('size: ' + info.size);
    });

    video.pipe(ffmpeg.stdin);
*/

  /*  youtubedl.exec('https://www.youtube.com/watch?v=Ga3maNZ0x0w', ['--prefer-ffmpeg', '-o','-'], {}, function(err, output) {
      if (err) throw err;
      console.log(output.join('\n'));
    });
*/
    /* ytdl('https://www.youtube.com/watch?v=uJAjR__EGZ0', { filter: function(format) { return format.container === 'mp4'; } })
      .pipe(ffmpeg.stdin);*/
   /*  ytdl('https://www.youtube.com/watch?v=RCWVhIlYLvc', { filter: function(format) { return format.container === 'mp4'; } })
      .pipe(fs.createWriteStream("../angularjs/js/data/you.mp4"));*/
 //  fs.createReadStream("chunktempski.webm").pipe(ffmpeg.stdin);


//var ipcam=spawn('ffmpeg', ['-i','http://192.168.178.31:8080/video', '-acodec','copy', '-vcodec', 'copy' , '-']);
   /*
    var ffmpeg = spawn('ffmpeg', ['-i','http://192.168.178.31:8080/video', '-acodec','copy', '-vcodec', 'png','-s','625x500', '-f', 'image2pipe', '-']);
*/
  //  ipcam.stdout.pipe(ffmpeg.stdin);
    /*var readstream = gfs.createReadStream({
      _id: '5753d412b4d248d80ba36d22'
    });

    readstream.pipe(ffmpeg.stdin);
*/
    /*ctrack.emitter.on('clmtrackrConverged', function(){
      overlayCtx.clearRect(0, 0,625, 500);
      overlayCtx.drawImage(img, 0, 0);
      ctrack.draw(overlay);
      var out = fs.createWriteStream('test'+counter+'.png');
      var stream = overlay.createPNGStream();
      stream.on('data', function(chunk){
        console.log('writing file');
        out.write(chunk);
      });

      stream.on('end', function(){
        console.log('image saved!');
      });
      console.log('clmtrackrConverged');
    });*/
    //fs.createReadStream('http://localhost:5555/a9991b0c-2df4-4883-a016-692f9205bf15').pipe(ffmpeg.stdin);
// You can replace 'png' with 'jpeg' for jpeg images.

    //var out = fs.createWriteStream('test'+counter+'.png');

   /* var img;
    plucker(ffmpeg.stdout, 'png', function (error, image) {
      try{
      counter++
      console.log(counter);
   /!*   var writestream = gfs.createWriteStream({filename:'thumb'+counter+'.png',mode: 'w',
        contentType: 'image/png'});
      writestream.write(image);
      writestream.end();*!/
      var out = fs.createWriteStream('testSplit/test'+counter+'.png');
    //  var out = fs.createWriteStream('testSplit/test'+counter+'.png');
     // out.write(image);
      //console.log('file' + counter + '.png');
      img = new Image();

    // var imgFile = fs.readFileSync(__dirname + '/franck_01829.jpg');
      img.src = image;

      ctx.drawImage(img, 0,0);
      /!*var stream = canvas.createPNGStream();
      var out = fs.createWriteStream('test'+counter+'.png');
      stream.on('data', function(chunk){
        console.log('writing file');
        out.write(chunk);
      });*!/

        ctrack.track(canvas);

        overlayCtx.clearRect(0, 0,625, 500);
        overlayCtx.drawImage(img, 0, 0);
        ctrack.draw(overlay);
        console.log(ctrack.nose_position);

        var stream = overlay.createPNGStream();
        stream.on('data', function(chunk){

          out.write(chunk);
        });

        stream.on('end', function(){
//        console.log('image saved!');
        });

      }catch(e){
        console.log(e);
      }





return img;

    });*/

   /* var params = [
      '-i', 'pipe:0',
      /// Tell avconv to expect an input stream (via its stdin)
      '-vsync',' 1', // We only want audio back
      '-r',' 25',
      '-an','-y','-qscale',' 1',
      '-vcodec', 'png',
      '-f','image2pipe',
      'pipe:1'
        // Tell avconv to stream the converted data (via its stdout)
    ];
   /!* var params = [
      '-i', 'out.webm', // Tell avconv to expect an input stream (via its stdin)
      '-t', '00:00:02',  // We only want audio back
      '-c:v',
      'copy','outsm.webm'
          // Tell avconv to stream the converted data (via its stdout)
    ];*!/

    // Get the duplex stream
    var stream = avconv(params);

Call gPRC

    var PROTO_PATH =__dirname +  '/helloworld.proto';

    var grpc = require('grpc');
    var hello_proto = grpc.load(PROTO_PATH).helloworld;
    var client = new hello_proto.Greeter('localhost:50051',
    grpc.credentials.createInsecure());
    client.sayHello({name: image.toString('base64')}, function(err, response) {
    console.log('Greeting:', response);
    });


*/


