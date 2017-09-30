/**
 * Created by jacobiv on 06/10/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');




var AlgoServiceSchema= new Schema({
        createdBy    : {
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
        },
        algo:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Algo'
        },
        serviceInternalPort:String,
        serviceExternalPort:String,
        servicePath:String,
        serviceUrl:String,
        date      : Date,
        readaccess:String,
        writeaccess:String,
        description:String


});



module.exports =mongoose.model('AlgoService',AlgoServiceSchema);