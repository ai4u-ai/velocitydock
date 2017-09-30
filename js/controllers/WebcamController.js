/**
 * Created by jacobiv on 10/10/2016.
*/
MetronicApp.controller('WebcamController',function ($scope, API_ENDPOINT,AuthService,$http,$location, rx,$location, $anchorScroll,videoService) {


    $scope.canvasClusters={};
    $scope.dataArray =[];
    $scope.updateDataArray=function () {
        $scope.dataArray = Object.keys($scope.canvasClusters)
            .map(function(key) {
                return $scope.canvasClusters[key];
            });
    }

    $scope.algos=[];
    $scope.selectedAlgo={};
    $scope.selectedAlgoModel={};
    $scope.loadAlgos = function () {
        $http.get('/api/load/algos').success(function (data) {
            console.log(data);
            /* $scope.algos=data.map(function(selected){
             selected.model=($scope.models.filter(function(model){if (model._id=== selected.model) return model}));
             selected.dependencies=$scope.dependencies.filter(function(dependency){if (selected.dependencies.filter(function(d){if(dependency._id===d) return d}).length>0) return dependency});
             //$scope.selectedAlgoModel=$scope.models.filter(function(model){if (model._id=== $scope.selected.model) return model})[0];
             return selected;
             });
             */
            $scope.algos=data;
            if( $scope.algos.length>0){
                $scope.selectedAlgo= $scope.algos[0];
                $scope.changeServicePort();

                //   if( $scope.selected.annotations===undefined) $scope.selected.annotations=[];
                //   if( $scope.selected.dependencies===undefined) $scope.selected.dependencies=[];
                //$scope.selectedAlgoModel=$scope.models.filter(function(model){if (model._id=== $scope.selected.model) return model})[0];
            }else{
                $scope.selectedAlgo={};
            }



        });
    };
    // $scope.$on('$viewContentLoaded', function(){
    //     //Here your view content is fully loaded !!
    //     $scope.loadAlgos();
    // });


    $scope.downInstance=function(){

        var newNrInstances=parseInt($scope.selectedAlgo.instances)-1>0?parseInt($scope.selectedAlgo.instances)-1:0;
        var data = {
            access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),
            servicename:$scope.selectedAlgo.name,
            instances:newNrInstances


        };

        var config = {
            params: data,
            headers : {'Content-Type': 'application/json', Authorization: AuthService.getAuthToken()}

        };

        $http.post('/api/scaleservice/' ,config).success(function (data, status, headers) {
            $scope.selectedAlgo.instances=data.instances;

        })
    }
    $scope.upInstance=function(){
        var newNrInstances=parseInt($scope.selectedAlgo.instances)+1;
        var data = {
            access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),
            servicename:$scope.selectedAlgo.name,
            instances:newNrInstances


        };

        var config = {
            params: data,
            headers : {'Content-Type': 'application/json', Authorization: AuthService.getAuthToken()}

        };

        $http.post('/api/scaleservice/' ,config).success(function (data, status, headers) {
            $scope.selectedAlgo.instances=data.instances;

        })

    }


    $scope.selectAlgo=function(index){
        $scope.selectedAlgo= $scope.algos[index];
        $scope.changeServicePort();




            //    if( $scope.selected.annotations===undefined) $scope.selected.annotations=[];
        // $scope.selectedAlgoModel=$scope.models.filter(function(model){if (model._id=== $scope.selected.model) return model})[0];
        //  $scope.selected.dependencies=$scope.dependencies.filter(function(dependency){if ($scope.selected.dependencies.filter(function(d){if(dependency._id===d) return d}).length>0) return dependency});


    };
    $scope.socket = io.connect('http://localhost:3000/',{reconnect:false, forceNew: true})

    $scope.socket.binaryType = 'arraybuffer';
    $scope.socket.on('open', function(){
        //socket.send(new Int8Array(5));


        $scope.socket.on('close', function(){
            console.log('closed socket')
        });
    });
    $scope.connections={};
    $scope.changeServicePort=function(){
        if($scope.socket!=undefined)$scope.socket.emit('disconnect');

        var data = {
            access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),
            port:$scope.selectedAlgo.port,
            servicename:$scope.selectedAlgo.apipath

        };

        var config = {
            params: data,
            headers : {'Content-Type': 'application/json', Authorization: AuthService.getAuthToken()}

        };

        $http.post('/api/changeserviceport/' ,config).success(function (data, status, headers) {
            console.log(data)
            $scope.selectedAlgo.instances=data.instances;




        });
    }
    $scope.drawOnAnalyse=false;
    $scope.faceTracker = new tracking.ObjectTracker('face');
    $scope.faceTracker.setInitialScale(4);
    $scope.faceTracker.setStepSize(2);
    $scope.faceTracker.setEdgesDensity(0.1);
    $scope.trackFacesBool=false;
    $scope.trackMobj=false;
    $scope.trackFullScreen=false;
    $scope.$$objSubscription;
    $scope.$$fullScreenSubscription;
    $scope.$$faceSubscription;

    $scope.greaterThan = function(prop, val){
        return function(item){
            //console.log(item)
            return item[prop] > (val/100);
        }
    };
    $scope.searchParam={}
    $scope.searchParam.score=0;
    $scope.searchParam.drowMovement=false;
    $scope.toggleMovement=function(){
       if( $scope.searchParam.drowMovement)  $scope.searchParam.drowMovement=false;
       if(! $scope.searchParam.drowMovement) $scope.searchParam.drowMovement=true;
    }
    $scope.showMovement=function () {
        return  $scope.searchParam.drowMovement;
    }

    $scope.getDuration = function(start, end) {
        try {
            var  duration='';
            if(!(start===undefined ||end===undefined)){
                duration=new Date(new Date(end)-new Date(start));

            }

            return duration;
        } catch (e) {
            return "Cant evaluate"
        }
    };





    $scope.lena=2;
    $scope.neighRedius=45;
    $scope.nrPoints=45;
    $scope.getLena=function () {
        return $scope.lena;
    }
    $scope.upnrPoints=function () {
        $scope.nrPoints=$scope.nrPoints+5;
    }
    $scope.downnrPoints=function () {
        $scope.nrPoints=$scope.nrPoints-5;
    }
    $scope.upLena=function () {
        $scope.lena=$scope.lena+1;
    }
    $scope.downLena=function () {
        $scope.lena=$scope.lena-1;
    }
    $scope.upneighRedius=function () {
        $scope.neighRedius=$scope.neighRedius+5;
    }
    $scope.downneighRedius=function () {
        $scope.neighRedius=$scope.neighRedius-5;
    }
    $scope.drawAlert=function(score,respTime,currentTime){
        if(respTime!=undefined || currentTime!=undefined)
        {
            return score>=$scope.treshold
        }else{
            if($scope.getDuration(parseInt(respTime),currentTime)!=''){
              return  score>=$scope.treshold&&$scope.getDuration(parseInt(respTime),currentTime).getMilliseconds()<=500;
            }
        }


    };

    $scope.showAlert=function(score){

                return  score>=$scope.treshold;


    };
    $scope.treshold=0.8;
    $scope.startMobvingOb=function(){
        $scope.trackMobj=true;
        $scope.$$objSubscription=  $scope.$timeupdate2.subscribe();
        if($scope.$$faceSubscription!=undefined)   $scope.$$faceSubscription.dispose();$scope.faceTrackingTask.stop();
        if($scope.$$fullScreenSubscription!=undefined) $scope.$$fullScreenSubscription.dispose();
        $scope.canvasClusters={};
    };
    $scope.startFullsCreen=function(){
        $scope.trackFullScreen=true;
        $scope.$$fullScreenSubscription=  $scope.$timeupdateVid.subscribe();
        if($scope.$$faceSubscription!=undefined)   $scope.$$faceSubscription.dispose();$scope.faceTrackingTask.stop();
        if($scope.$$objSubscription!=undefined) $scope.$$objSubscription.dispose();
        $scope.canvasClusters={};
    };
    $scope.startFaces=function(){
        $scope.trackFacesBool=true;
        $scope.$$faceSubscription= $scope.$timeupdate1.subscribe();
       if($scope.$$objSubscription!=undefined) $scope.$$objSubscription.dispose();
        $scope.faceTrackingTask.run();
        $scope.canvasClusters={};
    };
    $scope.getTreshold=function () {
        return $scope.treshold;
    }
    $scope.upTreshold=function () {
        $scope.treshold=$scope.treshold+0.1;
    }
    $scope.downTreshold=function () {
        $scope.treshold=$scope.treshold-0.1;
    }
    // $scope.socket = new eio.Socket('ws://localhost:8080');
    // $scope.socket.binaryType = 'arraybuffer';
    // $scope.socket.on('open', function(){
    //     //socket.send(new Int8Array(5));
    //
    //
    //     $scope.socket.on('close', function(){});
    // });



    $scope.trackFaces=function(event){
    if($scope.api.currentState==='play'){
        var w =  $scope.api.videogularElement.width();
        var h =  $scope.api.videogularElement.height();
        var canvas= document.getElementById('canvas');
        canvas.width=w;
        canvas.height=h;

        var context= canvas.getContext('2d');
        context.width=w;
        context.height=h;

        context.clearRect(0, 0, canvas.width, canvas.height);
        var  data=    event.data.map(function(rect,index) {
            //context.drawImage($scope.api.mediaElement[0], rect.x, rect.y, rect.width, rect.height);
            var data = canvas.toDataURL('image/jpeg', 1.0);
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.strokeStyle = '#a64ceb';
            context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            context.font = '11px Helvetica';
            context.fillStyle = "#fff";
            context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
            context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);

            //context = canvas.getContext("2d");
            // context.drawImage($scope.api.mediaElement[0], rect.x, rect.y, rect.width, rect.height);
            var caTemp=document.createElement('canvas')
            caTemp.width=w;
            caTemp.height=h;
            var  caTempctx=caTemp.getContext('2d');
            caTempctx.width=w;
            caTempctx.height=h;
            caTempctx.drawImage($scope.api.mediaElement[0],0,0, w,h );


            var currentTime=$scope.api.currentTime;

            // document.getElementById('new');
            var newC=document.createElement('canvas');
            newC.width=rect.width;
            newC.height=rect.height;
            newC.getContext('2d').width=rect.width;
            newC.getContext('2d').height=rect.height;
            newC.getContext('2d').drawImage(caTemp,rect.x,rect.y, rect.width,rect.height,0,0,rect.width,rect.height);
            var data = newC.toDataURL('image/jpeg', 0.5);
            // socket.send(JSON.stringify({blob:data.split(',')[1],time:currentTime,index:index}));
            rect.currentTime=currentTime;

            rect.dataUrl=data;
            rect.index=index;
            rect.x1=rect.x;
            rect.x2=rect.width+rect.x;
            rect.y1=rect.y;
            rect.y2=rect.height+rect.y;
            $scope.canvasClusters[[currentTime,index]]=rect;
           $scope.updateDataArray();
            return rect;
        });
        return data;

    }


    }
    $scope.sendFaces=function(event){
        if(event!=undefined){
            event.map(function(rect,index) {

                $scope.socket.emit($scope.selectedAlgo.name,JSON.stringify({blob:rect.dataUrl.split(',')[1],time:rect.currentTime,index:rect.index}));


                //$scope.canvasClusters[[currentTime,index]]=rect;
                //  return rect;
            });
        }


    }
    $scope.analyseOfline=function () {
        
    };
    $scope.videoService=videoService;
    $scope.drawArrow=function(ctx, p1, p2, size) {
    ctx.save();

    // Rotate the context to point along the path
    var dx = p2.x - p1.x, dy = p2.y - p1.y, len = Math.sqrt(dx * dx + dy * dy);
    ctx.translate(p2.x, p2.y);
    ctx.rotate(Math.atan2(dy, dx));
    ctx.fillStyle = 'rgb(0,' + Math.floor(255-42.5*(-len)) + ',' +
        Math.floor(255-42.5*(-len)) + ')';
    ctx.lineWidth = 1;
    // line
    ctx.strokeStyle = 'rgb(0,' + Math.floor(255-42.5*(-len)) + ',' +
        Math.floor(255-42.5*(-len)) + ')';
    ctx.beginPath();
    ctx.moveTo(0, 0);

    ctx.lineTo(-len, 0);
    ctx.closePath();
    ctx.stroke();

    // arrowhead
    ctx.fillStyle = 'rgb(0,' + Math.floor(255-42.5*(-len)) + ',' +
        Math.floor(255-42.5*(-len)) + ')';
    ctx.strokeStyle = 'rgb(0,' + Math.floor(255-42.5*(-len)) + ',' +
        Math.floor(255-42.5*(-len)) + ')';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-size, -size);
    ctx.lineTo(-size, size);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
};
    $scope.getectMoventInArea=function (event) {
        if($scope.videoService.selector.x1!=undefined){
            var calculator =  new oflow.FlowCalculator(2);
            var oldSceneCanvas=event[0].scene;
            var newSceneCanvas=event[1].scene;
            var colsObject = (Math.round($scope.videoService.selector.x2-$scope.videoService.selector.x1).toFixed(0))/1;
            var rowsObject = (Math.round($scope.videoService.selector.y2-$scope.videoService.selector.y1).toFixed(0))/1;
            var w =  $scope.api.videogularElement.width();
            var h =  $scope.api.videogularElement.height();

            var newC= document.createElement('canvas');
            newC.width=w;
            newC.height=h;
            newC.getContext('2d').width=w;
            newC.getContext('2d').height=h;
            newC.getContext('2d').drawImage(newSceneCanvas,$scope.videoService.selector.x1,$scope.videoService.selector.y1, w,h,0,0,w,h);






            var old= document.createElement('canvas');
            old.width=colsObject;
            old.height=rowsObject;
            old.getContext('2d').width=w;
            old.getContext('2d').height=h;
            old.getContext('2d').drawImage(oldSceneCanvas,$scope.videoService.selector.x1,$scope.videoService.selector.y1, w,h,0,0,w,h);


           // oldSceneCanvas.getContext('2d').drawImage(oldSceneCanvas,$scope.videoService.selector.x1,$scope.videoService.selector.y1, colsObject,rowsObject,0,0,colsObject,rowsObject);
            var zones =  calculator.calculate(old.getContext('2d').getImageData(0, 0, w,h).data, newC.getContext('2d').getImageData(0, 0,  w,h).data,w, h);


            zones.zones.map(angular.bind(this,function(zone){

                zone.x=zone.x+$scope.videoService.selector.x1;
                zone.y=zone.y+$scope.videoService.selector.y1;

            }));
            var x1=$scope.videoService.selector.x1;
            var x2=$scope.videoService.selector.x2;
            var y1=$scope.videoService.selector.y1;
            var y2=$scope.videoService.selector.y2;
            if(zones.u!=0||zones.v!=0){
                var externalZones=[];
                var internalZones=[];
                for (var i = 0; i < zones.zones.length; ++i) {
                    var zone = zones.zones[i];
                    if($scope.videoService.selector.x1<=(zone.x)&&$scope.videoService.selector.x2>=(zone.x)&&videoService.selector.y1<=(zone.y )&&$scope.videoService.selector.y2>=(zone.y)) {

                        if($scope.videoService.selector.x1>=(zone.x + zone.u * 4)||$scope.videoService.selector.x2<=(zone.x + zone.u * 4)||$scope.videoService.selector.y1>=(zone.y + zone.v * 4 )||$scope.videoService.selector.y2<=(zone.y + zone.v * 4)) {
                            externalZones.push(zone);
                          var canvas=   document.getElementById('canvas')
                          var ctx=  canvas.getContext('2d');
                            ctx.width =w;
                            ctx.height =h;
                            event[1].event.srcElement.parentNode.parentElement.children[0].width=w;
                            event[1].event.srcElement.parentNode.parentElement.children[0].height=h;

                            $scope.drawArrow(ctx, zone, {
                                x: zone.x + zone.u * 4,
                                y: zone.y + zone.v * 4
                            }, 2);



                        }else{
                            var ctx= event[1].event.srcElement.parentNode.parentElement.children[0].getContext('2d')
                            ctx.width =w;
                            ctx.height =h;
                            event[1].event.srcElement.parentNode.parentElement.children[0].width=w;
                            event[1].event.srcElement.parentNode.parentElement.children[0].height=h;

                            internalZones.push(zone);
                            $scope.drawArrow(ctx, zone, {
                             x: zone.x + zone.u * 4,
                             y: zone.y + zone.v * 4
                             }, 2);
                        }
                    }

                }




                //max X and y
                if(externalZones.length>0){






                    externalZones.map(function(zone)
                    {
                        if(x1>=(zone.x + zone.u * 4))
                        {
                            x1=(zone.x + zone.u * 4)
                        }




                        if(y1>=(zone.y + zone.v * 4)){
                            y1=(zone.y + zone.v * 4 )
                        }


                        if(x2<=(zone.x + zone.u * 4)){
                            x2=(zone.x + zone.u * 4 )
                        }



                        if(y2<=(zone.y + zone.v * 4)){
                            y2=(zone.y + zone.v * 4 )
                        }


                    });

                }
            }
        }


    };


    $scope.canvasFromEven=function(event){
        var sceneInterm= document.createElement('canvas');
        var sceneIntermContext=sceneInterm.getContext('2d');

        var w =  $scope.api.videogularElement.width();
        var h =  $scope.api.videogularElement.height();
        sceneInterm.width=w;
        sceneInterm.height=h;
        sceneIntermContext.width=w;
        sceneIntermContext.height=h;
        sceneIntermContext.drawImage(event.target,0,0,  w,h);


        return {scene:sceneInterm,event:event};
    };
 $scope.canvasClusters={}
    $scope.detectMovingObjects=function(canvasses){
        


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
               $scope.socket.emit($scope.selectedAlgo.name,JSON.stringify({blob:b.split(',')[1],time:currentTime,index:index}));
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
                if($scope.drawAlert(res.score,res.time,$scope.api.currentTime)){
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




    $scope.selectedAnnotation={};
    $scope.selectedAnnotaionTime={};
    $scope.api={};
    $scope.scrollTo = function(currentTime,index) {
               $('.scroller').slimScroll({scrollTo : (document.getElementById(currentTime).scrollHeight * index)  });
    };
    $scope.calculateAverageTimeDist=function(){
    //  $scope.averTimeDist=  $scope.selectedAnnotation.annotation.map(function(a,index){ var next=$scope.selectedAnnotation.annotation[index+1]; if(next!=undefined) return next.currentTime -a.currentTime}).filter(function(f){if(f!=undefined) return f}).reduce(function(a,b){return a +b})/$scope.selectedAnnotation.annotation.length ;
    };

    $scope.select=function(index){
        if($scope.files.length>0){
            $scope.selectedAnnotation= $scope.files[index];
            $scope.calculateAverageTimeDist();

            /*    $scope.annotationsMap={};
                $scope.selectedAnnotation.annotation.map(function(annotation){
                $scope.annotationsMap[ parseInt(annotation.currentTime, 10)]=annotation;
            });*/
            $scope.api.mediaElement[0].src= $scope.selectedAnnotation.mediaFile.src;
        }

    };
    $scope.load = function () {
        $http.get('/api/load/allmedia').success(function (data) {
//            console.log(data);
            $scope.files=data;
            var media= $scope.files[0];
            var mediaFile={src:API_ENDPOINT.url+'/stream/video/'+media.media.id+'?'+'access_token='+AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),type: "video/mp4" ,title:media.name}

            if($scope.api.mediaElement!=undefined)$scope.api.mediaElement[0].src=mediaFile.src;


        });
    };
    $scope.load();


    $scope.config = {
        autoHide: false,
        autoHideTime: 3000,
        autoPlay: true,
        sources: [],
        theme: {
            url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
        },
        plugins: {
            poster: "http://www.videogular.com/assets/images/videogular.png"
        }


    };



    $scope.goToSelectedAnnoTime=function(anno, index){
        $scope.selectedAnnotaionTime=anno;
        $scope.api.seekTime(anno.currentTime/1000);
        //$scope.scrollTo(anno.currentTime,index);
        $scope.selectedAnnotaionTime  =anno.currentTime;



        var canvas= $scope.api.videogularElement.children()[1].children[1];
        var ctx= $scope.api.videogularElement.children()[1].children[1].getContext('2d');
        var w = $scope.api.videogularElement.width();
        var h = $scope.api.videogularElement.height();
        ctx.width = w;
        ctx.height = h;
        canvas.height=h;
        canvas.width=w;



        ctx.strokeStyle = 'Red';
        ctx.beginPath();
        //  ctx.translate(c[0][0] ,    c[0][1]);
        ctx.setLineDash([5, 3])
        ctx.moveTo(anno.x1, anno.y1);
        ctx.lineTo(anno.x2, anno.y1);
        ctx.lineTo(anno.x2, anno.y2);
        ctx.lineTo(anno.x1, anno.y2);
        ctx.lineTo(anno.x1, anno.y1);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.save();
    };

    // this.$timeupdateSubs.dispose();


    $scope.changeImgSrc=function(selection,index)
    {

            return selection.dataUrl;
        


    }
    $scope.inviewIndex=1;

    $scope.lineInView = function(index, inview, inviewInfo) {
        var inViewReport = inview ? '<strong>enters</strong>' : '<strong>exit</strong>';
        $scope.inviewIndex=index;
        // var inviewpart = [];
        // for (var p in inviewInfo.parts) {
        //     if (inviewInfo.parts[p]) {
        //         inviewpart.push(p);
        //     }
        // }
        // inviewpart = inviewpart.length % 4 === 0 ? 'all' : inviewpart.join(', ');
        // if (typeof(inviewpart) != 'undefined') {
        //     inViewReport = '<strong>' + inviewpart + '</strong> parts ' + inViewReport;
        // }
        // $scope.inviewLogs.unshift({ id: logId++, message: $sce.trustAsHtml('Line <em>#' + index + '</em>: ' + inViewReport) });
        // return false;
    }



    /*var annotationsList=document.getElementById('annotationslist');
    $scope.$timeupdate2= rx.Observable.fromEvent(annotationsList, 'click').map(function(event){console.log(event)}).subscribe();
    */

    $scope.onPlayerReady=function(api){

       // console.log(api);

        $scope.api=api;
       $scope.$observClickOnTime= $scope.$createObservableFunction('goToSelectedAnnoTimeObs')
            .map(function (anno, index) {
                var anno=anno[0];
                $scope.selectedAnnotaionTime=anno;
                $scope.api.seekTime(anno.currentTime/1000);
                //$scope.scrollTo(anno.currentTime,index);
                $scope.selectedAnnotaionTime  =anno.currentTime;

                var canvasToCle= $scope.api.videogularElement.children()[0];
                var ctxToCl= $scope.api.videogularElement.children()[0].getContext('2d');
                var w = $scope.api.videogularElement.width();
                var h = $scope.api.videogularElement.height();
                canvasToCle.width = w;
                canvasToCle.height = h;
                ctxToCl.height=h;
                ctxToCl.width=w;
                ctxToCl.clearRect(0,0,w,h);


                var canvas= $scope.api.videogularElement.children()[1].children[1];
                var ctx= $scope.api.videogularElement.children()[1].children[1].getContext('2d');
                var w = $scope.api.videogularElement.width();
                var h = $scope.api.videogularElement.height();
                ctx.width = w;
                ctx.height = h;
                canvas.height=h;
                canvas.width=w;


                ctx.setLineDash([5, 3])
                ctx.strokeStyle = '#990000';
                ctx.beginPath();
                //  ctx.translate(c[0][0] ,    c[0][1]);
                ctx.moveTo(anno.x1, anno.y1);
                ctx.lineTo(anno.x2, anno.y1);
                ctx.lineTo(anno.x2, anno.y2);
                ctx.lineTo(anno.x1, anno.y2);
                ctx.lineTo(anno.x1, anno.y1);
                ctx.lineWidth = 2.5;
                ctx.stroke();
                ctx.save();
                return new Date();}
            )
           /* .subscribe(function(result) {
               // console.log(result)
            })*/;

        $scope.skip=false;
        $scope.skipCount=0;
        $scope.$timeupdate= rx.Observable.fromEvent(this.api.mediaElement, 'timeupdate').zip($scope.$observClickOnTime).map(angular.bind(this,function (x,y) {
            $scope.skip=true;
            $scope.skipCount=2;
        })).subscribe(function (res) {
            console.log(res)
        });




        $scope.$timeupdate1= rx.Observable.fromEvent($scope.faceTracker, 'track').throttle(100 /* ms */).map($scope.trackFaces).throttle(1000).map($scope.sendFaces);


        $scope.$timeupdate2= rx.Observable.fromEvent(this.api.mediaElement, 'timeupdate').filter(function(x){

            if(!$scope.skip)
           {
               return x;
           }
           else{
               {
                   $scope.skipCount=$scope.skipCount-1
                   if($scope.skipCount===0)$scope.skip=false
               }
           }
        }).map($scope.canvasFromEven).bufferWithCount(2).map($scope.detectMovingObjects);

        if($scope.trackFacesBool){
         $scope.$$faceSubscription=   $scope.$timeupdate1.subscribe();

            tracking.track($scope.api.mediaElement[0],   $scope.faceTracker, {  });
        }
       $scope.faceTrackingTask= tracking.track($scope.api.mediaElement[0],   $scope.faceTracker, {  });
        $scope.faceTrackingTask.stop();

        if($scope.trackMobj)$scope.$$objSubscription= $scope.$timeupdate2.subscribe();
        if($scope.trackFullScreen)$scope.$$fullScreenSubscription= $scope.$timeupdateVid.subscribe();
     //   $scope.$timeupdate3= rx.Observable.fromEvent(this.api.mediaElement, 'timeupdate').map($scope.canvasFromEven).bufferWithCount(2);

      //  $scope.$timeupdate3.subscribe($scope.getectMoventInArea);





        $scope.$timeupdateVid=  rx.Observable.fromEvent( $scope.api.mediaElement, 'timeupdate').map(angular.bind(this,(function(event){
            var sceneInterm= document.createElement('canvas');
            var sceneIntermContext=sceneInterm.getContext('2d');
            var w =  $scope.api.videogularElement.width();
            var h =  $scope.api.videogularElement.height();
            sceneInterm.width=w;
            sceneInterm.height=h;
            sceneIntermContext.width=w;
            sceneIntermContext.height=h;
            sceneIntermContext.drawImage(event.target,0,0,  w,h);
            var b =sceneInterm.toDataURL("image/jpeg",1);
            var binary = atob(b.split(',')[1]),
                data = [];

            for (var i = 0; i < binary.length; i++)
                data.push(binary.charCodeAt(i));

            var blob=   new Blob([new Uint8Array(data)],  {
                type: 'image/jpeg'
            });
            //var blob=new Blob( b,{'type':'video/webm'});
       //     console.log(blob.size);
          //  var string = new TextDecoder('utf-8').decode(new Uint8Array(data));
            $scope.socket.emit($scope.selectedAlgo.name,JSON.stringify({blob:b.split(',')[1],time:$scope.api.currentTime}));

        })));
       // $scope.$timeupdateVid.subscribe();
        $scope.$timeupdateCanvas=  rx.Observable.fromEvent( $scope.api.mediaElement, 'timeupdate').map(angular.bind(this,(function(event){
            var ctx= event.srcElement.parentNode.parentElement.children[0].getContext('2d');
            ctx.clearRect(0,0,event.srcElement.parentNode.parentElement.children[0].width,event.srcElement.parentNode.parentElement.children[0].height);
        //http://math.stackexchange.com/questions/109122/how-do-i-calculate-the-new-x-y-coordinates-and-width-height-of-a-re-sized-group
            $scope.calculateAverageTimeDist();

            $scope.selectedAnnotation.annotation.map(function(annotation,index){

                        if(annotation.currentTime>=$scope.api.currentTime&&annotation.currentTime<=$scope.api.currentTime+ $scope.averTimeDist){
                          //  console.log(annotation);
                             $scope.scrollTo(annotation.currentTime,index);
                            $scope.selectedAnnotaionTime  =annotation;
                            ctx.width =event.srcElement.parentNode.parentElement.children[0].width;
                            ctx.height =event.srcElement.parentNode.parentElement.children[0].height;
                            ctx.save();
                            ctx.strokeStyle = "red";
                            ctx.beginPath();

                            ctx.moveTo(annotation.objectSelector.x1*(ctx.width/annotation.origSize.width),  annotation.objectSelector.y1*(ctx.height/annotation.origSize.height));
                            ctx.lineTo(annotation.objectSelector.x2 *(ctx.width/annotation.origSize.width),  annotation.objectSelector.y1*(ctx.height/annotation.origSize.height));
                            ctx.lineTo(annotation.objectSelector.x2*(ctx.width/annotation.origSize.width),annotation.objectSelector.y2*(ctx.height/annotation.origSize.height));
                            ctx.lineTo(annotation.objectSelector.x1*(ctx.width/annotation.origSize.width),annotation.objectSelector.y2*(ctx.height/annotation.origSize.height));
                            ctx.lineTo(annotation.objectSelector.x1*(ctx.width/annotation.origSize.width),  annotation.objectSelector.y1*(ctx.height/annotation.origSize.height));
                            ctx.lineWidth = 1;
                            ctx.stroke();




                        }else{

                        }
            });




            return event;

        })));
        //$scope.$timeupdateCanvas.subscribe();
    };



    $scope.removeAnnotation=function(index,id){
        var data = {
            access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),
            id:id
        };

        var config = {
            params: data,
            headers : {'Content-Type': 'application/json'}

        };

        $http.delete('/api/annotation/delete/' ,config).success(function (data, status, headers) {
            $scope.files.splice(index, 1);
            $scope.load();
            $scope.selectedAnnotation= $scope.files[index];
        });


    };
    $scope.removeAllAnnotations=function(){
        var data = {
            access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length)

        };

        var config = {
            params: data,
            headers : {'Content-Type': 'application/json'}

        };

        $http.delete('/api/annotation/deleteAll' ,config).success(function (data, status, headers) {
            $scope.files=[];
            $scope.load();
            $scope.selectedAnnotation={};
        });


    };
    $scope.select=function(index){
        $scope.selected= $scope.files[index];
        var media=$scope.files[index];
        var mediaFile={src:API_ENDPOINT.url+'/stream/video/'+media.media.id+'?'+'access_token='+AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),type: "video/mp4" ,title:media.name}

        $scope.api.mediaElement[0].src=mediaFile.src;
    };
    /*$scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageAutoScrollOnLoad = 1500;
    $rootScope.settings.layout.pageSidebarClosed = true;
*/
});