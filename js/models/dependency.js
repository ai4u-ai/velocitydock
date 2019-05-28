/**
 * Created by jacobiv on 06/10/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var bcrypt = require('bcrypt');
var  ObjectId = Schema.ObjectId;
/*var GFS = mongoose.model("GFS", new Schema({}, {strict: false}), "fs.files" );*/
var Schema = mongoose.Schema;

var Dependency= new Schema({
        uploadedBy    : {
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
        },
        uploadedFor  : {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Algo'
        },
        name: String,
        originalname : String,
        date : Date,
        readaccess:String,
        writeaccess:String,
        description:String,
        contentType: String,
        language:String,
        dependency: {type: Schema.Types.Object, ref: 'GFS' }
});



module.exports =mongoose.model('Dependency',Dependency);