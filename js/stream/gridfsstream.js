/**
 * Created by jacobiv on 10/10/2016.
 */
var express = require('express');
var app = express();
var Grid = require('gridfs-locking-stream');
var mongo = require('mongodb');
var spawn = require('child_process').spawn;
var fs = require("fs"),
    path = require("path");
/*var MongoClient = require('mongodb').MongoClient;
var GridStore = mongo.GridStore;
var ObjectIDObjectID = require('mongodb').ObjectID;
var GridFS = require('gridfs-stream');*/

module.exports.gridfsStreamer=function StreamGridFile(req, res, GridFile,db) {
var  self=this;
if(req.headers['range']) {
    // Range request, partialle stream the file
    console.log('Range Reuqest');
    var parts = req.headers['range'].replace(/bytes=/, "").split("-");
    var partialstart = parts[0];
    var partialend = parts[1];


    var start = parseInt(partialstart, 10);

    var end = partialend ? parseInt(partialend, 10) : GridFile.length -1;
    var chunksize = (end-start)+1;

    res.writeHead(206, {
        'Content-disposition': 'filename=xyz',
        'Accept-Ranges': 'bytes',
        'Content-Type': GridFile.contentType,
        'Content-Range': 'bytes ' + start + '-' + end + '/' + GridFile.length,
        'Content-Length': chunksize
    });

    /*// Set filepointer
     GridFile.seek(start, function() {
     // get GridFile stream
     var stream = GridFile.stream(true);

     // write to response
     stream.on('data', function(buff) {
     // count data to abort streaming if range-end is reached
     // perhaps theres a better way?
     if(start >= end) {
     // enough data send, abort
     GridFile.close();
     res.end();
     } else {
     res.write(buff);
     }
     });
     });*/

   /* var frames = spawn('ffmpeg', ['-i','pipe:0','-vf','showinfo,select=gt(scene\\,0.0005),scale=iw/4:-1,mpdecimate,setpts=N/FRAME_RATE/TB','-f','yuv4mpegpipe','-']).on('error', function( err ){console.log(err) })
        ;
    frames.on('error', function (err) {
        console.log('An error occurred!', err);
        throw err;
    });

    frames.stdout.on('data', function (data) {
        console.log('data');

    });*/
   if(req.params.filePath !=undefined){
       var directory = req.params.filePath
       // var file = path.resolve(__dirname,"movie.mp4");
       var file = path.resolve(req.params.filePath);
       var stat = fs.statSync(req.params.filePath)
       var fileSize = stat.size
       var parts = req.headers['range'].replace(/bytes=/, "").split("-");
       var partialstart = parts[0];
       var partialend = parts[1];


       var start = parseInt(partialstart, 10);

       var end = partialend ? parseInt(partialend, 10) :fileSize -1;
       var chunksize = (end-start)+1;

       res.writeHead(206, {
           'Content-disposition': 'filename=xyz',
           'Accept-Ranges': 'bytes',
           'Content-Type': req.params.contentType,
           'Content-Range': 'bytes ' + start + '-' + end + '/' + fileSize,
           'Content-Length': chunksize
       });
       var stream = fs.createReadStream(file, { start: start, end: end })
           .on("open", function() {
               stream.pipe(res);
           }).on("error", function(err) {
               res.end(err);
           });

   }
    var gfs = Grid(db, mongo);



    var readstream = gfs.createReadStream({
        _id: req.params.id,
        range: {
            startPos: start,
            endPos: end
        }
    },function (err, readstream) {
        // Handle errors, etc.
        readstream.pipe(res).on('error', function (err) {
            console.log('An error occurred!', err);
            throw err;
        });
       /* readstream.pipe(frames.stdin)
            .on('error', function (err) {
                console.log('An error occurred!', err);
                //throw err;
            });*/
    });
    //readstream.pipe(res);
    // return readstream.pipe(res);

    /* var gridfs= new GridFS(self.db, mongo);
     var stream = gridfs.createReadStream({
     _id: req.params.file,
     range: {
     startPos: start,
     endPos: end-1
     }
     });
     return stream.pipe(res);*/

} else {

    // stream back whole file
    console.log('No Range Request');
    res.header('Content-Type', GridFile.contentType);
    res.header('Content-Length', GridFile.length);
    var stream = GridFile.stream(true);
    stream.pipe(res);
}
}

module.exports.streamFromFile=function StreamGridFile(req, res,filePath) {
    var  self=this;
    var directory = filePath
    // var file = path.resolve(__dirname,"movie.mp4");
    var file = path.resolve(filePath);
    var stat = fs.statSync(filePath)
    var fileSize = stat.size
    if(req.headers['range']) {


            var parts = req.headers['range'].replace(/bytes=/, "").split("-");
            var partialstart = parts[0];
            var partialend = parts[1];


            var start = parseInt(partialstart, 10);

            var end = partialend ? parseInt(partialend, 10) :fileSize -1;
            var chunksize = (end-start)+1;

            res.writeHead(206, {
                'Content-disposition': 'filename=xyz',
                'Accept-Ranges': 'bytes',
                'Content-Type': req.query.type,
                'Content-Range': 'bytes ' + start + '-' + end + '/' + fileSize,
                'Content-Length': chunksize
            });
            var stream = fs.createReadStream(file, { start: start, end: end })
                .on("open", function() {
                    stream.pipe(res);
                }).on("error", function(err) {
                    res.end(err);
                });



    } else {

        // stream back whole file
        console.log('No Range Request');
        res.header('Content-Type', req.query.type);
        res.header('Content-Length', fileSize);
        fs.createReadStream(file).pipe(res)
    }
}