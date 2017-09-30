/**
 * Created by jacobiv on 10/10/2016.
*/
MetronicApp.controller('SearchMediaController',function ($scope, API_ENDPOINT,AuthService,$http,$location, rx,$location, $anchorScroll,videoService,$interval) {

    $scope.promise;

    $scope.treshold=0.4;
    $scope.getTreshold=function () {
        return $scope.treshold;
    }
    $scope.showAlert=function(score){
        return score>=$scope.treshold;
    };
    $scope.upTreshold=function () {
        $scope.treshold=$scope.treshold+0.1;
    }
    $scope.downTreshold=function () {
        $scope.treshold=$scope.treshold-0.1;
    }
    $scope.upnrFilterScale=function () {
        $scope.filterScale=$scope.filterScale+1;
    }
    $scope.downnrFilterScale=function () {
        $scope.filterScale=$scope.filterScale-1;
    }
    $scope.upnrsceneFilter=function () {
        $scope.sceneFilter=$scope.sceneFilter+0.001;
    }
    $scope.downnrsceneFilter=function () {
        $scope.sceneFilter=$scope.sceneFilter-0.001;
    }
    $scope.imgScale=10;
    $scope.algoannotations=[];
    $scope.algoannoruns=[];
    $scope.filterScale=2;
    $scope.sceneFilter=0.003;
    $scope.loadAlgoAnnoRuns=function () {
        $http.get('/api/myannotatioruns').success(function (data) {
            console.log(data);
            /* $scope.algos=data.map(function(selected){
             selected.model=($scope.models.filter(function(model){if (model._id=== selected.model) return model}));
             selected.dependencies=$scope.dependencies.filter(function(dependency){if (selected.dependencies.filter(function(d){if(dependency._id===d) return d}).length>0) return dependency});
             //$scope.selectedAlgoModel=$scope.models.filter(function(model){if (model._id=== $scope.selected.model) return model})[0];
             return selected;
             });
             */
            $scope.algoannoruns=data.algoannoruns;

            $scope.algoannoruns=$scope.algoannoruns.map(function(algorun){
                if(algorun.endDate===undefined)
                {
                    algorun.endDate=new Date();
                }
                if(algorun._id===$scope.selectedAlgoRun._id)
                {
                    $scope.selectedAlgoRun=algorun;
                    if($scope.selectedAlgoRun.status==='started')
                    {
                        $scope.getAlgoAnnos()
                    }
                }
                return algorun;
            });


         // if($scope.algoannoruns>0)  $scope.selectAlgoRun(0)

        });
    }
    $scope.selectAlgoRun=function (index,algorun) {

        if(algorun.status!='started'){
            $interval.cancel($scope.promise);
            $scope.promise = undefined;

        }

        $scope.selectedAlgoRun= algorun;
        var indexMedia= $scope.files.map(angular.bind(this,function (media,index) {
            if(media._id==$scope.selectedAlgoRun.annotatedOnMedia._id){ return index}
        })).reduce(function(pre,curr){ console.log(pre); if(pre!=undefined) {return pre};if(curr!=undefined) {return curr}});
        if(indexMedia!=undefined)$scope.select(indexMedia);
        $scope.getAlgoAnnos();


    };
    $scope.selectedAlgoRun={};
    $scope.loadAlgoAnnoRuns();

    $scope.greaterThan = function(prop, val){
        return function(item){
            return item[prop] > (val/100);
        }
    };
    $scope.searchParam={}
    $scope.searchParam.score=0;
  


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

    $scope.checkUpdates=function () {
             $scope.loadAlgoAnnoRuns();
        var anyRunning=false;
        $scope.algoannoruns.map(function (run) {
            if(run.status==='started'){anyRunning=true}
        })
        if(!anyRunning){
            $interval.cancel($scope.promise);
            $scope.promise = undefined;
        }

             //$scope.getAlgoAnnos();
       /*     var _data = {
                access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),
                algoannorun:$scope.selectedAlgoRun._id
            };

            var config = {
                params: _data,
                headers : {'Content-Type': 'application/json', Authorization: AuthService.getAuthToken()}

            };

            $http.get('/api/algoannotations/getfast/',config).success(function (data, status, headers) {

                //console.log(data);
               //$scope.selectedAlgoRun=data.algoannorun;
                $scope.algoannoruns= $scope.algoannoruns.map(function (run) {
                    if(run._id===data.algoannorun._id){run=data.algoannorun;}
                    return run;
                })
                if(data.algoannorun.status==='end')
                {
                    $scope.getAlgoAnnos();
                    $interval.cancel($scope.promise);
                    $scope.promise = undefined;
                }else{

                    if($scope.selectedAlgoRun.endDate===undefined) $scope.selectedAlgoRun.endDate=new Date();
                }





                //$scope.selected= data.algo;
                //      if( !$scope.selected.annotations) $scope.selected.annotations=[];
                /!* $scope.loadDependencies();
                 $scope.selected.model=$scope.models.filter(function(model){if (model._id=== $scope.selected.model) return model});
                 $scope.selected.dependencies=$scope.dependencies.filter(function(dependency){if ($scope.selected.dependencies.filter(function(d){if(dependency._id===d) return d}).length>0) return dependency});
                 $scope.selectedAlgoModel=$scope.models.filter(function(model){if (model._id=== $scope.selected.model) return model})[0];
                 *!/
            }); */

        
    }


    $scope.startInterval=function (interval) {
        $scope.promise = $interval($scope.checkUpdates, 4000);
    };
    $scope.getAlgoAnnos=function () {

        var data = {
            access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),
            algoannorun:$scope.selectedAlgoRun._id
        };

        var config = {
            params: data,
            headers : {'Content-Type': 'application/json', Authorization: AuthService.getAuthToken()}

        };

        $http.get('/api/algoannotations/get/',config).success(function (data, status, headers) {

            console.log(data);
            $scope.algoannotations=data.algoannotations;

            /*.map(function (annotation) {
                annotation.filteredframe.image= 'data:image/jpeg;base64,'+annotation.filteredframe.image;
                return annotation
            });*/
            //$scope.selected= data.algo;
            //      if( !$scope.selected.annotations) $scope.selected.annotations=[];
            /* $scope.loadDependencies();
             $scope.selected.model=$scope.models.filter(function(model){if (model._id=== $scope.selected.model) return model});
             $scope.selected.dependencies=$scope.dependencies.filter(function(dependency){if ($scope.selected.dependencies.filter(function(d){if(dependency._id===d) return d}).length>0) return dependency});
             $scope.selectedAlgoModel=$scope.models.filter(function(model){if (model._id=== $scope.selected.model) return model})[0];
             */
        });


    };



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

    $scope.searchInMedia=function () {


        var data = {
            access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),
            model:$scope.selectedAlgo.model._id,
            media:$scope.selected._id,
            algo:$scope.selectedAlgo._id,
            scale: $scope.filterScale,
            sceneFilter: $scope.sceneFilter,
            port:$scope.selectedAlgo.port
            
            
        };

        var config = {
            params: data,
            headers : {'Content-Type': 'application/json', Authorization: AuthService.getAuthToken()}

        };

        $http.post('/api/searchinmedia/' ,config).success(function (data, status, headers) {

            console.log(data);
            $scope.selectedAlgoRun=data.algoannorun;
            $scope.algoannoruns.unshift( $scope.selectedAlgoRun);
            $interval.cancel($scope.promise);
            $scope.promise = undefined;
            $scope.startInterval();
         //   $scope.getAlgoAnnos();
          //  startInterval();
            //$scope.selected= data.algo;
            //      if( !$scope.selected.annotations) $scope.selected.annotations=[];
            /* $scope.loadDependencies();
             $scope.selected.model=$scope.models.filter(function(model){if (model._id=== $scope.selected.model) return model});
             $scope.selected.dependencies=$scope.dependencies.filter(function(dependency){if ($scope.selected.dependencies.filter(function(d){if(dependency._id===d) return d}).length>0) return dependency});
             $scope.selectedAlgoModel=$scope.models.filter(function(model){if (model._id=== $scope.selected.model) return model})[0];
             */
        });


    }

    $scope.searchInMediaNew=function () {


        var data = {
            access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),
            model:$scope.selectedAlgo.model._id,
            media:$scope.selected._id,
            algo:$scope.selectedAlgo._id,
            scale: $scope.filterScale,
            sceneFilter: $scope.sceneFilter,
            port:$scope.selectedAlgo.port


        };

        var config = {
            params: data,
            headers : {'Content-Type': 'application/json', Authorization: AuthService.getAuthToken()}

        };

        $http.post('/api/searchinmediaNew/' ,config).success(function (data, status, headers) {

            console.log(data);
            $scope.selectedAlgoRun=data.algoannorun;
            $scope.algoannoruns.unshift( $scope.selectedAlgoRun);
            $interval.cancel($scope.promise);
            $scope.promise = undefined;
            $scope.startInterval();
            //   $scope.getAlgoAnnos();
            //  startInterval();
            //$scope.selected= data.algo;
            //      if( !$scope.selected.annotations) $scope.selected.annotations=[];
            /* $scope.loadDependencies();
             $scope.selected.model=$scope.models.filter(function(model){if (model._id=== $scope.selected.model) return model});
             $scope.selected.dependencies=$scope.dependencies.filter(function(dependency){if ($scope.selected.dependencies.filter(function(d){if(dependency._id===d) return d}).length>0) return dependency});
             $scope.selectedAlgoModel=$scope.models.filter(function(model){if (model._id=== $scope.selected.model) return model})[0];
             */
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
                $scope.selectAlgo(0);
                //   if( $scope.selected.annotations===undefined) $scope.selected.annotations=[];
                //   if( $scope.selected.dependencies===undefined) $scope.selected.dependencies=[];
                //$scope.selectedAlgoModel=$scope.models.filter(function(model){if (model._id=== $scope.selected.model) return model})[0];
            }else{
                $scope.selectedAlgo={};
            }



        });
    };
    $scope.loadAlgos();

    $scope.selectAlgo=function(index){
        $scope.selectedAlgo = $scope.algos[index];
        var data = {
            access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),
            servicename:$scope.selectedAlgo.apipath
            


        };

        var config = {
            params: data,
            headers : {'Content-Type': 'application/json', Authorization: AuthService.getAuthToken()}

        };

        $http.get('/api/getnumberofinstances/',config).success(function (data, status, headers) {

            console.log(data);
            $scope.selectedAlgo.instances=data.instances;
            
        })
        //    if( $scope.selected.annotations===undefined) $scope.selected.annotations=[];
        // $scope.selectedAlgoModel=$scope.models.filter(function(model){if (model._id=== $scope.selected.model) return model})[0];
        //  $scope.selected.dependencies=$scope.dependencies.filter(function(dependency){if ($scope.selected.dependencies.filter(function(d){if(dependency._id===d) return d}).length>0) return dependency});


    };
    $scope.drawOnAnalyse=false;




    $scope.videoService=videoService;


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

    $scope.selectedAnnotation={};
    $scope.selectedAnnotaionTime={};
    $scope.api={};
    $scope.scrollTo = function(currentTime,index) {
               $('.scroller').slimScroll({scrollTo : (document.getElementById(currentTime).scrollHeight * index)  });
    };
    $scope.calculateAverageTimeDist=function(){
    //  $scope.averTimeDist=  $scope.selectedAnnotation.annotation.map(function(a,index){ var next=$scope.selectedAnnotation.annotation[index+1]; if(next!=undefined) return next.currentTime -a.currentTime}).filter(function(f){if(f!=undefined) return f}).reduce(function(a,b){return a +b})/$scope.selectedAnnotation.annotation.length ;
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
        $scope.api.seekTime(anno.frame.pkt_dts_time);
       // $scope.scrollTo(anno.currentTime,index);
        $scope.selectedAnnotaionTime  =anno.currentTime;
        if(anno.x1!=undefined||anno.x2!=undefined||anno.y1!=undefined||anno.y2!=undefined){
            var canvas= $scope.api.videogularElement.children()[1].children[1];
            var ctx= $scope.api.videogularElement.children()[1].children[1].getContext('2d');
            var w = $scope.api.videogularElement.width();
            var h = $scope.api.videogularElement.height();
            ctx.width = w;
            ctx.height = h;
            canvas.height=h;
            canvas.width=w;



            ctx.strokeStyle = 'Red';

            //  ctx.translate(c[0][0] ,    c[0][1]);

            ctx.beginPath();
            ctx.setLineDash([5, 3])
            //  ctx.translate(c[0][0] ,    c[0][1]);
            if(anno.orgWidth===undefined||anno.orgHeight===undefined){
                ctx.moveTo(anno.x1, anno.y1);
                ctx.lineTo(anno.x2, anno.y1);
                ctx.lineTo(anno.x2, anno.y2);
                ctx.lineTo(anno.x1, anno.y2);
                ctx.lineTo(anno.x1, anno.y1);
            }else{
                ctx.moveTo(anno.x1*(ctx.width/anno.orgWidth),  anno.y1*(ctx.height/anno.orgHeight));
                ctx.lineTo(anno.x2 *(ctx.width/anno.orgWidth),  anno.y1*(ctx.height/anno.orgHeight));
                ctx.lineTo(anno.x2*(ctx.width/anno.orgWidth),anno.y2*(ctx.height/anno.orgHeight));
                ctx.lineTo(anno.x1*(ctx.width/anno.orgWidth),anno.y2*(ctx.height/anno.orgHeight));
                ctx.lineTo(anno.x1*(ctx.width/anno.orgWidth),  anno.y1*(ctx.height/anno.orgHeight));

            }


            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.save();
        }

    };

    // this.$timeupdateSubs.dispose();
    
    $scope.onPlayerReady=function(api){
       // console.log(api);
        $scope.api=api;

     

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
            socket.send(JSON.stringify({blob:b.split(',')[1],time:$scope.api.currentTime}));

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
                            // $scope.scrollTo(annotation.currentTime,index);
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

    $scope.changeImgSrc=function(selection,index)
    {
        
            if(selection.image===undefined) {
                return 'data:image/jpeg;base64,'+selection.filteredframe.image;
            }else{
                return 'data:image/jpeg;base64,'+selection.image;
            }
       


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