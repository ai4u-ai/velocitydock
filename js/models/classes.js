/**
 * Created by jacobiv on 06/10/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var bcrypt = require('bcrypt');


var Class=new Schema({
        name     : String,
        class:  Number

});

var ClassesSchema= new Schema({
        createdBy    : {
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
        },
        algo   : {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Algo'
        },
        name     : String,
        classes:  [Class]


});
module.exports =mongoose.model('Classes',ClassesSchema);