/**
 * Created by jacobiv on 06/10/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var bcrypt = require('bcrypt');




var DataSet= new Schema({
        uploadedBy    :
            {
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'User'
            },
        name:String,
        annotations:[{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Annotation'
        }]


});



module.exports =mongoose.model('DataSet',DataSet);