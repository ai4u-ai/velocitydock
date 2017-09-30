/**
 * Created by jacobiv on 06/10/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');




var Algoannotation= new Schema({
        annotatedOnMedia: {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Media'
        },
        filteredframe    : {
                type:mongoose.Schema.Types.ObjectId,
                ref:'FilteredFrame'
        },
        frame    : {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Frame'
        },
        algoannorun    : {
            type:mongoose.Schema.Types.ObjectId,
            ref:'AlgoAnnoRun'
        },
        score:String,
        label:String,
        name     : String,
        date      : Date,
        readaccess:String,
        writeaccess:String,
        description:String,
        x1:String,
        x2:String,
        y1:String,
        y2:String,
        orgWidth:String,
        orgHeight:String,
        image: {type: Schema.Types.Object, ref: 'GFS' }


});



module.exports =mongoose.model('Algoannotation',Algoannotation);