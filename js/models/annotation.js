/**
 * Created by jacobiv on 06/10/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');




var AnnotationSchema= new Schema({
        uploadedBy    : {
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
        },
        annotatedOnMedia    : {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Media'
        },
        classes    : {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Classes'
        },
        name     : String,
        originalname : String,
        date      : Date,
        readaccess:String,
        writeaccess:String,
        description:String,
        contentType: String,
        annotation:[ {type: Schema.Types.Object, ref: 'GFS' }]
});



module.exports =mongoose.model('Annotation',AnnotationSchema);