/**
 * Created by jacobiv on 06/10/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var imgageFS = mongoose.model("imgageFS", new Schema({}, {strict: false}), "fs.files" );




var FramesSchema= new Schema({

        best_effort_timestamp     : String,
        best_effort_timestamp_time : String,
        coded_picture_number      : String,
        display_picture_number:String,
        height:String,
        description:String,
        interlaced_frame: String,
        key_frame: String,
        media_type:String,
        pict_type: String,
        picture_fmt: String,
        pkt_dts_time: String,
        pkt_dts_duration: String,
        pkt_pos: String,
        pkt_pts: String,
        pkt_pts_time: String,
        repeat_pict:String,
        sample_aspect_ration:String,
        stream_index:String,
        top_filed_first:String,
        width:String,
        media    : {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Media'
        },
        image: {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Image'

        }
});



module.exports =mongoose.model('Frame',FramesSchema);