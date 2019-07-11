/**
 * Created by ivanjacob1 on 12/05/16.
 */

var dbconnect=require('../common/mongo/dbconnect');

var base64 = require('node-base64-image');
var ffmpeg = require('fluent-ffmpeg');
var Grid = require('gridfs-locking-stream');
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var GridStore = mongo.GridStore;
var ObjectID = require('mongodb').ObjectID;
var GridFS = require('gridfs-stream');
var streamify = require('stream-array')
var fs = require("fs");
var blobs=[];
var accum = require('accum');
var Grid = require('gridfs');
var streamBuffers = require('stream-buffers');
var mov2png=require('../common/transformers/mov2npg');
var Kontainer=require('kontainer-js');
var engine = require('engine.io');
var http = require('http').createServer().listen(3000);
var server = engine.attach(http);
var pipe2gridfs=require('../common/transformers/pipe2gridfs');
/*var db;*/
/*MongoClient.connect("mongodb://localhost/velocitydb", function(err, database) {
  if(err) throw err;
  db = database;
});*/

dbconnect.init(function (error) {
  console.log(error);
});
server.on('connection', function (socket) {

 // var gfs=GridFS(db,mongo);
  var wstream=fs.createWriteStream("chunk.webm", {encoding:'base64'});
  var readstream = dbconnect.getGfs().createReadStream({
   _id: '575b7f694e6e67033da72bf6'
   });
   readstream.pipe(wstream);


  socket.on('message', function(data){

    var imageData = {filename:'chunk'+blobs.length+'.webm',media:new Buffer(data, 'base64')};
  /*  accum(function (alldata) {*/

    blobs.push(imageData);
   // var wstream=fs.createWriteStream('chunk'+blobs.length+'.webm', {encoding:'base64'});


    //var writestream = dbconnect.getGfs().createWriteStream({filename:'chunk'+blobs.length+'.webm'});
    /*ffmpeg(imageData,{options:['-vf fps=1','-hide_banner','thumb%04d.jpg']}).format('webm') .on('end', function() {
        console.log('file has been converted succesfully');
      })
      .on('error', function(err) {
        console.log('an error happened: ' + err.message);
      }).save(writestream, {end:true});*/

    streamify(blobs).pipe(pipe2gridfs.createPipeToGridFs()).pipe(fs.createWriteStream('chunk'+blobs.length+'.webm', {encoding:'base64'}));
  /*var gs= new GridStore(db, 'chunk'+blobs.length+'.webm', 'w', {
    "chunk_size": 1024*4,
    metadata: {
      hashpath:'chunk'+blobs.length+'.webm',
      name: 'chunk'+blobs.length+'.webm',
      hash:data
    }});*/


    /*
    var myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer();
    var myWritableStreamBuffer =new streamBuffers.WritableStreamBuffer();

    myReadableStreamBuffer.put(imageData, 'base64');
 writestream.write(imageData);
    writestream.end();*/



   /* var gridfsReadStream=gfs.createReadStream({filename:'chunk'+blobs.length+'.webm'});*/
  /*  ffmpeg().input(gridfsReadStream)
      .concat("merged.wemb")
      .pipe(writestream);*/
    /* myReadableStreamBuffer.on('data', function(data) {
      // streams1.x style data

      myReadableStreamBuffer.pipe(writestream);
    });*/
   /* var wstream=fs.createWriteStream("chunk.webm", {encoding:'base64'});

    wstream.write(imageData);
    wstream.end();
    fs.createReadStream("chunk.webm").pipe(writestream);*/
    /*ffmpeg().input(fs.createReadStream("chunk.webm"))
      .concat('merged.webm')
      .pipe(writestream);
*/
    //myReadableStreamBuffer.pipe(writestream);
    // data.pipe(writestream);
  /*  var readstream = gfs.createReadStream({
      filename: 'chunk8.webm'
    });
    readstream.pipe(writestream);*/
   /* gs=new GridStore(db, 'chunk'+blobs.length+'.webm','r');

    gs.open(function(err,gs){
      ffmpeg().input(gs.stream(true))
        .concat('merged.webm');
    });
*/

    //ffmpeg().input(imageData);



    /*var options = {filename: 'chunk'+blobs.length};
    blobs.push(options);*/
    /*base64.base64decoder(imageData, options, function (err, saved) {
      if (err) { console.log(err); }
      console.log(saved);
      ffmpeg().mergeAdd(options.filename);
    });*/
    console.log(data) });
  socket.on('close', function(){
    //var blob=new Blob(this.blobs,{type: "video/webm"});
    /*var imageData = new Buffer(Buffer.concat(blobs), 'base64');*/
    var options = {filename: 'test'};

   /* blobs.map(function(data){
      ffmpeg().input(data.filename+'.jpg');

    });*/
    //ffmpeg().concat('merged.mp4');
    /*base64.base64decoder(imageData, options, function (err, saved) {
      if (err) { console.log(err); }
      console.log(saved);
    });*/
  });
});


