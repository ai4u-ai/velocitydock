/**
 * Created by jacobiv on 10/10/2016.
*/
MetronicApp.controller('AnnotationsController',function ($scope, API_ENDPOINT,AuthService,$http,$location, rx,$location, $anchorScroll,videoService,$window) {

    $scope.idImage="canvas"
    $scope.videoService=videoService;
    $scope.selectedAnnotation={};
    $scope.selectedAnnotaionTime={};
    $scope.api={};
    $scope.scrollTo = function(currentTime,index) {
               $('.scroller').slimScroll({scrollTo : (document.getElementById(currentTime).scrollHeight * index)  });
    };
    $scope.calculateAverageTimeDist=function(){
      $scope.averTimeDist=  $scope.selectedAnnotation.annotation.map(function(a,index){ var next=$scope.selectedAnnotation.annotation[index+1]; if(next!=undefined) return next.currentTime -a.currentTime}).filter(function(f){if(f!=undefined) return f}).reduce(function(a,b){return a +b})/$scope.selectedAnnotation.annotation.length ;
    };
    $scope.select=function(file){
        var ctx=$window.document.getElementById($scope.idImage).getContext('2d');
        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

        if($scope.files.length>0){
            $scope.selectedAnnotation= file;
            // $scope.calculateAverageTimeDist();

            /*    $scope.annotationsMap={};
                $scope.selectedAnnotation.annotation.map(function(annotation){
                $scope.annotationsMap[ parseInt(annotation.currentTime, 10)]=annotation;
            });*/
            if( $scope.api.mediaElement==undefined) $scope.api.mediaElement=[]
            $scope.api.mediaElement[0].src= $scope.selectedAnnotation.mediaFile.src;
        }

    };
    $scope.selectMedia = function (media) {
        $scope.selectedMedia=media;

    }
    $scope.load = function () {
        $scope.mediafiles=[];
        $http.get('/api/anotations/loadAll').success(function (data) {
           // console.log(data);


            $scope.files= data.map(function(obj){
                var method=obj.annotatedOnMedia.filePath ==undefined ? '/stream/video/' : '/stream/video/frompath';
                var id=obj.annotatedOnMedia.filePath == undefined ? obj.annotatedOnMedia.media.id : '';
                // var mediaFile={src:API_ENDPOINT.url+method+id+'?'+'access_token='+AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length)+'&'+'filePath='+media.filePath+'&'+'type='+"video/mp4",type: "video/mp4" ,title:media.name};

                $scope.mediafiles.push(obj.annotatedOnMedia.name)
                return {_id:obj._id,media_name:obj.annotatedOnMedia.name,uploadedBy:obj.uploadedBy,annotation:obj.annotation,mediaFile:{_id:obj.annotatedOnMedia.media._id,src:API_ENDPOINT.url+method+id+'?'+'access_token='+AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length)+'&'+'filePath='+obj.annotatedOnMedia.filePath+'&'+'type='+"video/mp4",type: "video/mp4"}}

            });
            $scope.select($scope.files[0]);
            $scope.mediafiles=Array.from(new Set($scope.mediafiles))
            $scope.mediafiles.unshift('all')
            $scope.selectedMedia= $scope.mediafiles[0]

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

    $scope.goToSelectedAnnoTime=function(annotation, index,event){
        $scope.selectedAnnotaionTime=annotation;
        $scope.api.seekTime(annotation.currentTime/1000);

        var ctx=$window.document.getElementById($scope.idImage).getContext('2d');

        // var ctx= event.srcElement.parentNode.parentElement.children[0].getContext('2d');

        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
        $scope.selectedAnnotaionTime  =annotation;
        ctx.width =ctx.canvas.width;
        ctx.height =ctx.canvas.height;
        ctx.save();
        ctx.strokeStyle = "YellowGreen";

        ctx.strokeStyle = 'Red';
        ctx.beginPath();

        ctx.moveTo(annotation.objectSelector.x1*(ctx.width/annotation.origSize.width),  annotation.objectSelector.y1*(ctx.canvas.height/annotation.origSize.height));
        ctx.lineTo(annotation.objectSelector.x2 *(ctx.width/annotation.origSize.width),  annotation.objectSelector.y1*(ctx.canvas.height/annotation.origSize.height));
        ctx.lineTo(annotation.objectSelector.x2*(ctx.width/annotation.origSize.width),annotation.objectSelector.y2*(ctx.canvas.height/annotation.origSize.height));
        ctx.lineTo(annotation.objectSelector.x1*(ctx.width/annotation.origSize.width),annotation.objectSelector.y2*(ctx.canvas.height/annotation.origSize.height));
        ctx.lineTo(annotation.objectSelector.x1*(ctx.width/annotation.origSize.width),  annotation.objectSelector.y1*(ctx.canvas.height/annotation.origSize.height));
        ctx.lineWidth = 1;
        //ctx.setLineDash([2, 2])
        ctx.stroke();
        ctx.save()

        // $scope.scrollTo(anno.currentTime,index);
    };

    $scope.onPlayerReady=function(api){
       // console.log(api);
        $scope.api=api;

        // $scope.$timeupdateCanvas=  rx.Observable.fromEvent( $scope.api.mediaElement, 'timeupdate').map(angular.bind(this,(function(event){
        //     var ctx= event.srcElement.parentNode.parentElement.children[0].getContext('2d');
        //     ctx.clearRect(0,0,event.srcElement.parentNode.parentElement.children[0].width,event.srcElement.parentNode.parentElement.children[0].height);
        //http://math.stackexchange.com/questions/109122/how-do-i-calculate-the-new-x-y-coordinates-and-width-height-of-a-re-sized-group
        //     $scope.calculateAverageTimeDist();

            // $scope.selectedAnnotation.annotation.map(function(annotation,index){
            //
            //             if(annotation.currentTime>=$scope.api.currentTime&&annotation.currentTime<=$scope.api.currentTime){
            //               //  console.log(annotation);
            //               //    $scope.scrollTo(annotation.currentTime,index);
            //                 $scope.selectedAnnotaionTime  =annotation;
            //                 ctx.width =event.srcElement.parentNode.parentElement.children[0].width;
            //                 ctx.height =event.srcElement.parentNode.parentElement.children[0].height;
            //                 ctx.save();
            //                 ctx.strokeStyle = "red";
            //                 ctx.beginPath();
            //
            //                 ctx.moveTo(annotation.objectSelector.x1*(ctx.width/annotation.origSize.width),  annotation.objectSelector.y1*(ctx.height/annotation.origSize.height));
            //                 ctx.lineTo(annotation.objectSelector.x2 *(ctx.width/annotation.origSize.width),  annotation.objectSelector.y1*(ctx.height/annotation.origSize.height));
            //                 ctx.lineTo(annotation.objectSelector.x2*(ctx.width/annotation.origSize.width),annotation.objectSelector.y2*(ctx.height/annotation.origSize.height));
            //                 ctx.lineTo(annotation.objectSelector.x1*(ctx.width/annotation.origSize.width),annotation.objectSelector.y2*(ctx.height/annotation.origSize.height));
            //                 ctx.lineTo(annotation.objectSelector.x1*(ctx.width/annotation.origSize.width),  annotation.objectSelector.y1*(ctx.height/annotation.origSize.height));
            //                 ctx.lineWidth = 1;
            //                 ctx.stroke();
            //
            //
            //
            //
            //             }else{
            //
            //             }
            // });
            //



        //     return event;
        //
        // })));
        // $scope.$timeupdateCanvas.subscribe();
    };



    $scope.removeAnnotation=function(index,id){

        var indexAnno=$scope.files.indexOf($scope.selectedAnnotation);
        var data = {
            access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),
            id:$scope.files[$scope.files.indexOf($scope.selectedAnnotation)].annotation[index]._id

        };

        var config = {
            params: data,
            headers : {'Content-Type': 'application/json'}

        };
        $scope.files[$scope.files.indexOf($scope.selectedAnnotation)].annotation.splice(index, 1);
       /* $http.delete('/api/annotation/delete/' ,config).success(function (data, status, headers) {
            $scope.files[$scope.files.indexOf($scope.selectedAnnotation)].annotation.splice(index, 1);
           // $scope.load();
            $scope.selectedAnnotation= $scope.files[index];
        });*/
        $scope.saveAnnotations();
       // $scope.selectedAnnotation= $scope.files[indexAnno];

    };
    $scope.saveAnnotations=function(){
        // this.currentVideo.selections
        // var netJson=   angular.toJson(this.currentVideo.selections);

        $http({
            url:API_ENDPOINT.url+ '/annotations/save',
            method: "POST",
            data:{annotation:$scope.selectedAnnotation.annotation,_id:$scope.selectedAnnotation._id,annotatedOnMedia:$scope.selectedAnnotation.mediaFile._id},
            headers: {'Content-Type': 'application/json'}}).then(
            angular.bind(this,function(mess) {
               // $scope.load();
               // $scope.selectedAnnotation= mess;
            }))  // success
            .catch(function() {console.log('error')}); //
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

    /*$scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageAutoScrollOnLoad = 1500;
    $rootScope.settings.layout.pageSidebarClosed = true;
*/
});