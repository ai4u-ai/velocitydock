/**
 * Created by jacobiv on 06/10/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var  ObjectId = Schema.ObjectId;
var GFS = mongoose.model("GFS", new Schema({}, {strict: false}), "fs.files" );
var Schema = mongoose.Schema;

var MediaSchema= new Schema({
        uploadedBy    : {
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
        },
        name     : String,
        originalname : String,
        body      : String,
        date      : Date,
        readaccess:String,
        writeaccess:String,
        description:String,
        contentType: String,
        media: {type: Schema.Types.Object, ref: 'GFS' },
        frmasecollection    : {
                type:mongoose.Schema.Types.ObjectId,
                ref:'FramesCollection'
        },
});



module.exports =mongoose.model('Media',MediaSchema);