/**
 * Created by jacobiv on 10/10/2016.
 */
MetronicApp.controller('MediaController',function ($scope, FileUploader,API_ENDPOINT,AuthService,$http,$location) {
    $scope.api={};
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
    
    $scope.onPlayerReady=function(api){
        console.log(api);
        $scope.api=api;
    };
    $scope.selected={};
    $scope.sources=[];
    $scope.load = function () {
        $http.get('/api/load/allmedia').success(function (data) {
            console.log(data);
            $scope.files=data;
            var media= $scope.files[0];
            var method=media.filePath ==undefined ? '/stream/video/' : '/stream/video/frompath'
            var id=media.filePath == undefined ? media.media.id : '';
            var mediaFile={src:API_ENDPOINT.url+method+id+'?'+'access_token='+AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length)+'&'+'filePath='+media.filePath+'&'+'type='+"video/mp4",type: "video/mp4" ,title:media.name};

            $scope.api.mediaElement[0].src=mediaFile.src;


        });
    };

    $scope.load();


    $scope.removeOne=function(index,id){
        var data = {
            access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),
            id:id
        };

        var config = {
            params: data,
            headers : {'Content-Type': 'application/json'}

        };

        $http.delete('/api/media/delete/' ,config).success(function (data, status, headers) {
            $scope.files.splice(index, 1);
            $scope.load();
            $scope.selected= $scope.files[index];
            var media=$scope.files[index];
            var method=media.filePath ==undefined ? '/stream/video/' : '/stream/video/frompath'
            var id=media.filePath == undefined ? media.media.id : '';
            var mediaFile={src:API_ENDPOINT.url+method+id+'?'+'access_token='+AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length)+'&'+'filePath='+media.filePath+'&'+'type='+"video/mp4",type: "video/mp4" ,title:media.name};

            $scope.api.mediaElement[0].src=mediaFile.src;
        });


    };

    $scope.select=function(index){
        $scope.selected= $scope.files[index];
        var media=$scope.files[index];

        var method=media.filePath ==undefined ? '/stream/video/' : '/stream/video/frompath'
        var id=media.filePath == undefined ? media.media.id : '';
        var mediaFile={src:API_ENDPOINT.url+method+id+'?'+'access_token='+AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length)+'&'+'filePath='+media.filePath+'&'+'type='+"video/mp4",type: "video/mp4" ,title:media.name};

        $scope.api.mediaElement[0].src=mediaFile.src;
    };
    $scope.removeAll=function(){
        var data = {
            access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length)

        };

        var config = {
            params: data,
            headers : {'Content-Type': 'application/json'}

        };

        $http.delete('/api/media/deleteAll' ,config).success(function (data, status, headers) {
            $scope.files=[];
            $scope.load();
            $scope.selectedAnnotation={};
        });


    };



});