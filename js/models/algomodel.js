/**
 * Created by jacobiv on 06/10/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var bcrypt = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');
var  ObjectId = Schema.ObjectId;

var Schema = mongoose.Schema;

var AlgoModelSchema= new Schema({
        uploadedBy    :
        {
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
        },
        algo    :
        {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Algo'
        },
        name:{
                type:String,
                required: true


        },


        modelZipped:{type: Schema.Types.Object, ref: 'GFS' },
        modelPath:String,
        version:String,
        state:String,
        algoType:String





});

//AlgoSchema.plugin(uniqueValidator)
//AlgoModelSchema.index({createdBy: 1,name:1,version:1}, { unique: true });
module.exports =mongoose.model('AlgoModel',AlgoModelSchema);