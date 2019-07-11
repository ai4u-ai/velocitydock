/**
 * Created by ivanjacob1 on 07/06/16.
 */
var dbconnet=require('../mongo/dbconnect');
var stream = require('stream');
var pipe2gridfs = function(){
 var _pipe2gridfs=new stream.Transform( { objectMode: true } );

  _pipe2gridfs._transform = function (chunk, encoding, done) {
  console.log(chunk);
  console.log('encoding '+encoding);
  console.log('done '+done);



  var writestream = dbconnet.getGfs().createWriteStream({filename:chunk.filename,mode: 'w', contentType: 'image/jpeg'});
  writestream.write(chunk.media);
  writestream.end();
    this.push.bind(this)
  done()
}
return _pipe2gridfs}; module.exports.createPipeToGridFs=pipe2gridfs;
