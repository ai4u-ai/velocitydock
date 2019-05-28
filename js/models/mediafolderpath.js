/**
 * Created by jacobiv on 06/10/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var bcrypt = require('bcrypt');


var MediaFolderPath=new Schema({
        path     : String,
        number:  Number


});

var MediaFolderPathSchema= new Schema({
        createdBy    : {
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
        },

        name     : String,
        path:  String


});
module.exports =mongoose.model('MediaFolderPath',MediaFolderPathSchema);