/**
 * Created by jacobiv on 06/10/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');




var AlgoAnnoRunSchema= new Schema({
        runnedBy    : {
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
        },
        annotatedOnMedia    : {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Media'
        },
        annotatedWith    : {
                type:mongoose.Schema.Types.ObjectId,
                ref:'AlgoService'
        },
        algoanotations:[
                {
                        type:mongoose.Schema.Types.ObjectId,
                        ref:'Algoannotation'
                }
        ],
        filteredframecollection:
        {
                type:mongoose.Schema.Types.ObjectId,
                ref:'FilteredFramesCollection'
        },
        date      : Date,
        readaccess:String,
        writeaccess:String,
        description:String,
        startDate:Date,
        endDate:Date,
        status:String,
        algo:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Algo'
        }


});



module.exports =mongoose.model('AlgoAnnoRun',AlgoAnnoRunSchema);