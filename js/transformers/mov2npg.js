/**
 * Created by ivanjacob1 on 07/06/16.
 */
var dbconnet=require('../mongo/dbconnect');
var stream = require('stream')
var spawn = require('child_process').spawn;
var streamBuffers = require('stream-buffers');

var plucker = require('image-plucker');


var mov2png = function(){
 var _mov2png=new stream.Transform( { objectMode: true } );

  _mov2png._transform = function (chunk, encoding, done) {
    var ffmpeg = spawn('avconv', ['-i','pipe:0', '-vcodec', 'png','-s','625x500', '-f', 'image2pipe', '-']);
    var myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer();


    myReadableStreamBuffer.put(chunk);
    myReadableStreamBuffer.pipe(ffmpeg.stdin);
    var img;
    var  counter = 0;
    plucker(ffmpeg.stdout, 'png', function (error, image) {

      counter++;
      console.log(counter);
      var writestream = gfs.createWriteStream({
        filename: 'chunk'+counter+'.png' , mode: 'w',
        contentType: 'image/png'
      });
      writestream.write(image);
      writestream.end();
      //console.log('file' + counter + '.png');
    });


      done()
}
return _mov2png}; module.exports.createMov2png=mov2png;
