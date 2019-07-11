/**
 * Created by jacobiv on 06/10/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var bcrypt = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');
var  ObjectId = Schema.ObjectId;

var Schema = mongoose.Schema;


var ConversionSchema= new Schema({


        status:String,
       

        create_date:
        {
                type:Date
        },
        exceptions:[String],

        destpath: String,
        record_name: String,
        dataset_id:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'DataSet'
        },
        img_w: String,
        img_h: String,

        conversion_type:String,
        test_train_split:String,





});

//AlgoSchema.plugin(uniqueValidator)

module.exports =mongoose.model('Conversion',ConversionSchema,'conversion');