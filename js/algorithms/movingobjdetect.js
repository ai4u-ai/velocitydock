/**
 * Created by ivanjacob1 on 12/01/17.
 */

var jsfeat = require("jsfeat");
var detectMovingObjects=function(canvasses){



    var oldSceneCanvas=canvasses[0].scene;
    var newSceneCanvas=canvasses[1].scene;
    var w =  $scope.api.videogularElement.width();
    var h =  $scope.api.videogularElement.height();

    var ctx= canvasses[1].event.srcElement.parentNode.parentElement.children[0].getContext('2d');
    ctx.clearRect(0,0,canvasses[1].event.srcElement.parentNode.parentElement.children[0].width,canvasses[1].event.srcElement.parentNode.parentElement.children[0].height);
    ctx.width =w;
    ctx.height =h;
    canvasses[1].event.srcElement.parentNode.parentElement.children[0].width=w;
    canvasses[1].event.srcElement.parentNode.parentElement.children[0].height=h;
    /*  var old=document.getElementById('old');
     old.width=oldSceneCanvas.width;
     old.height=oldSceneCanvas.height;
     old.getContext('2d').width=oldSceneCanvas.width;
     old.getContext('2d').height=oldSceneCanvas.height;
     old.getContext('2d').drawImage(oldSceneCanvas,0,0, oldSceneCanvas.width,oldSceneCanvas.height);


     var newC=document.getElementById('new');
     newC.width=newSceneCanvas.width;
     newC.height=newSceneCanvas.height;
     newC.getContext('2d').width=newSceneCanvas.width;
     newC.getContext('2d').height=newSceneCanvas.height;
     newC.getContext('2d').drawImage(newSceneCanvas,0,0, newSceneCanvas.width,newSceneCanvas.height);
     */
    var calculator =  new oflow.FlowCalculator(2);
    var zonesFull= calculator.calculate(oldSceneCanvas.getContext('2d').getImageData(0, 0,  oldSceneCanvas.width, oldSceneCanvas.height).data, newSceneCanvas.getContext('2d').getImageData(0, 0,  newSceneCanvas.width, newSceneCanvas.height).data,newSceneCanvas.width,newSceneCanvas.height);
    var tempZones= zonesFull.zones;

    tempZones.sort(function (a, b) {
        var adx =  (a.x + a.u * 4) - a.x , ady =  (a.y + a.v * 4) - a.y, lena =Math.sqrt(adx * adx + ady * ady);
        var adx =  (b.x + b.u * 4) - b.x , ady =  (b.y +b.v * 4) -b.y, blena =Math.sqrt(adx * adx + ady * ady);
        if(lena<blena){
            return 1;
        }
        if(lena>blena){
            return -1;
        }
        return 0;
    });


    var tempZones= tempZones.slice(0,500);
    var dbscan = new  DBSCAN();
// parameters: 5 - neighborhood radius, 2 - number of points in neighborhood to form a cluster
    var dests=tempZones.filter(
        function(zone){
            var adx =  zone.x + zone.u * 4-zone.x , ady =  zone.y + zone.v * 4-zone.y, lena =Math.sqrt(adx * adx + ady * ady);
            if(lena>$scope.lena){

                /*   console.log((zone.x + zone.u * 4)-zone.x);
                 console.log((zone.y + zone.v * 4)-zone.y);*/
                return zone
            }
        }).map(function(a){
        return [a.x + a.u * 4,a.y + a.v * 4, /*,findMatchPoints(a,5,'red')*/]});
    var clusters = dbscan.run(dests, $scope.neighRedius,$scope.nrPoints);
    //console.log(clusters.length);


    var clustersXY =    clusters.map(function(cluster){return cluster.map(function(c){return dests[c]})});
    var img_u8, corners;
    var maxClusters= clustersXY.map(angular.bind(this,function (c){

            var maxX= c.map(function(v){return v}).reduce(function(a,b,c){ if(a!=undefined){if(b[0]>a[0]){return b}else{return a}}});
            var minX= c.map(function(v){return v}).reduce(function(a,b,c){ if(a!=undefined){if(b[0]>a[0]){return a}else{return b}}});
            var maxY= c.map(function(v){return v}).reduce(function(a,b,c){  if(a!=undefined){if(b[1]>a[1]){return b}else{return a}}});
            var minY= c.map(function(v){return v}).reduce(function(a,b,c){if(a!=undefined) { if(b[1]>a[1]){return a}else{return b}}});
            //  detectDiff(minX[0], maxX[0], maxY[0],minY[0], minX[0], maxX[0], maxY[0],minY[0], 'DeepPink');


            var tempCanv=document.createElement('canvas');
            var tempContext= tempCanv.getContext("2d");
            tempCanv.width = Math.abs(maxX[0])-Math.abs(minX[0]);
            tempCanv.height = Math.abs(maxY[1])- Math.abs(minY[1]);
            tempContext.width =  Math.abs(maxX[0])-Math.abs(minX[0]);
            tempContext.height =  Math.abs(maxY[1])- Math.abs(minY[1]);
            tempContext.drawImage(newSceneCanvas,Math.abs(minX[0]),  Math.abs(minY[1]),tempCanv.width, tempCanv.height,0,0,tempCanv.width, tempCanv.height);



            // find corners
            img_u8 = new jsfeat.matrix_t(tempCanv.width, tempCanv.height, jsfeat.U8_t | jsfeat.C1_t);

            var   corners = [];
            var i = tempCanv.width*tempCanv.height;
            while(--i >= 0) {
                corners[i] = new jsfeat.keypoint_t(0,0,0,0);
            }
            var imageData = tempContext.getImageData(0, 0, tempCanv.width, tempCanv.height);
            jsfeat.imgproc.grayscale(imageData.data, tempCanv.width, tempCanv.height, img_u8);
            jsfeat.imgproc.box_blur_gray(img_u8, img_u8, 2, 0);
            jsfeat.yape06.laplacian_threshold =30;
            jsfeat.yape06.min_eigen_value_threshold =25;
            var count = jsfeat.yape06.detect(img_u8, corners);
            var data_u32 = new Uint32Array(imageData.data.buffer);
            function render_corners(corners, count, img, step) {
                var pix = (0xff << 24) | (0x00 << 16) | (0xff << 8) | 0x00;
                var img2={};
                for(var i=0; i < count; ++i)
                {
                    var x = corners[i].x;
                    var y = corners[i].y;
                    var off = (x + y * step);
                    img2[off] = img[off];
                    img2[off-1] = img[off-1];
                    img2[off+1] = img[off+1];
                    img2[off-step] =  img[off-step];
                    img2[off+step] = img[off+step];
                }
                img.map(function(p,i){if (img2[i]!=undefined){
                    img[i]=img2[i];
                }else{
                    img[i]=0;
                }})
            }

            //   render_corners(corners, count, data_u32, tempCanv.width);


            //end find corners





            return {x1:Math.abs(minX[0]),x2:Math.abs(maxX[0]),y1:Math.abs(minY[1]),y2:Math.abs(maxY[1]),clusters:c,volCluster:imageData};

        })

    );

//drow cluisters and faces in clusters
    /*    var ctx=  event.srcElement.parentNode.parentElement.children[0].children[1].getContext('2d');
     this.faceTracker.on('track',angular.bind(this, function(event) {
     if(event.data.length>0) console.log(event.data);
     event.data.forEach(function(rect) {
     console.log(rect.x, rect.y, rect.width, rect.height);

     ctx.save();
     ctx.strokeStyle = 'green';
     ctx.fillRect(rect.x ,rect.y, 3, 3);
     ctx.fillRect(rect.x + rect.width,   rect.y+rect.height, 3, 3);


     });
     }));*/
    maxClusters.map(angular.bind(this,function(cluster,index){

        if(   $scope.searchParam.drowMovement){


            var ctx=  canvasses[1].event.srcElement.parentNode.parentElement.children[0].getContext('2d');
            var w =  $scope.api.videogularElement.width();
            var h =  $scope.api.videogularElement.height();
            ctx.width =w;
            ctx.height =h;


            ctx.save();
            ctx.strokeStyle = 'YellowGreen';
            ctx.beginPath();
            ctx.setLineDash([5, 3])
            //  ctx.translate(c[0][0] ,    c[0][1]);
            ctx.moveTo(cluster.x1,  cluster.y1);
            ctx.lineTo(cluster.x2 ,  cluster.y1);
            ctx.lineTo(cluster.x2,cluster.y2);
            ctx.lineTo(cluster.x1,cluster.y2);
            ctx.lineTo(cluster.x1,  cluster.y1);
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        var canvasBl=  document.createElement('canvas');
        var wCr =  cluster.x2-cluster.x1;
        var hCr =  cluster.y2-cluster.y1;
        canvasBl.width=wCr;
        canvasBl.height=hCr;
        var ctx2=canvasBl.getContext('2d');
        ctx2.width =wCr;
        ctx2.height =hCr;

        ctx2.drawImage(canvasses[1].scene,0,0,canvasses[1].scene.width,canvasses[1].scene.height);
        // document.getElementById('new');
        var newC=document.createElement('canvas');
        newC.width=wCr;
        newC.height=hCr;
        newC.getContext('2d').width=wCr;
        newC.getContext('2d').height=hCr;
        newC.getContext('2d').drawImage(canvasses[1].scene,cluster.x1,cluster.y1, wCr,hCr,0,0,wCr,hCr);




        var b =newC.toDataURL("image/jpeg",0.5);
        var currentTime=$scope.api.currentTime;
        if($scope.api.currentState == 'play'){
            $scope.socket.send(JSON.stringify({blob:b.split(',')[1],time:currentTime,index:index}));
            cluster.currentTime=currentTime;
            cluster.canvas=canvasses[1].scene;
            cluster.dataUrl=newC.toDataURL("image/jpeg",0.5);
            $scope.canvasClusters[[currentTime,index]]=cluster;
            $scope.updateDataArray();
        }


        // return {cluster:cluster,time:$scope.api.currentTime};
        // console.log('index'+index);


    }));
    $scope.socket.on('message', angular.bind(this,function(blob) {
        var res = JSON.parse(blob)
        //    console.log(res.label)
        //  console.log(res.score)

        //console.log('index'+res.index);
        var cluster = $scope.canvasClusters[[res.time,res.index]];
        if($scope.showAlert(res.score,res.time,$scope.api.currentTime)){
            if($scope.api.currentState == 'play'){


                var canvas= $scope.api.videogularElement.children()[1].children[1];
                var ctx= $scope.api.videogularElement.children()[1].children[1].getContext('2d');
                var w = $scope.api.videogularElement.width();
                var h = $scope.api.videogularElement.height();
                ctx.width = w;
                ctx.height = h;
                canvas.height=h;
                canvas.width=w;


                ctx.save();
                ctx.strokeStyle = 'Red';
                ctx.beginPath();
                ctx.setLineDash([5, 3])
                //  ctx.translate(c[0][0] ,    c[0][1]);
                ctx.moveTo(cluster.x1, cluster.y1);
                ctx.lineTo(cluster.x2, cluster.y1);
                ctx.lineTo(cluster.x2, cluster.y2);
                ctx.lineTo(cluster.x1, cluster.y2);
                ctx.lineTo(cluster.x1, cluster.y1);
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.save();
            }
            //ctx.font = "16px Georgia"
            /*ctx.font = '16px Helvetica';
             ctx.fillStyle = " #ff0000";
             ctx.fillText(res.label + " " + res.score,cluster.x1+(cluster.x2-cluster.x1)+5,cluster.y1+(cluster.y2-cluster.y1)+11);
             */

        }else{
            if($scope.api.currentState == 'play') {
                var canvas = $scope.api.videogularElement.children()[1].children[1];
                var ctx = $scope.api.videogularElement.children()[1].children[1].getContext('2d');
                var w = $scope.api.videogularElement.width();
                var h = $scope.api.videogularElement.height();
                ctx.width = w;
                ctx.height = h;
                canvas.height = h;
                canvas.width = w;
                ctx.clearRect(0, 0, w, h);
            }

        }
        cluster.label=res.label;
        cluster.score=res.score;
        $scope.canvasClusters[[res.time,res.index]]=cluster;
        $scope.updateDataArray();

    }));








    //return canvasClusters;
    //console.log(zonesFull)
};
module.exports = {
    detectMovingObjects: detectMovingObjects

}