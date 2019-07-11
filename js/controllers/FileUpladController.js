/**
 * Created by jacobiv on 10/10/2016.
 */
MetronicApp.controller('FileUploadCtrl',function ($scope, FileUploader,API_ENDPOINT,AuthService,$http,$location) {

    $scope.mediaFolders=[];
    $scope.tempMediaFolderCollection={};
    $scope.addTempMediaFolder=function(){
        $scope.tempMediaFolderCollection.folders.push({number: $scope.tempMediaFolderCollection.folders.length+1,path:'Fill in'});
    };
    var data = {
        access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length)

    };
    var config = {
        params: data,
        headers : {'Content-Type': 'application/json'}

    };


    $scope.loadMediaFoldersInit= function(){  $http.get(
        API_ENDPOINT.url+'/mediafolders/get',config

    ).then(angular.bind(this,function(response) {
        console.log('in controller'+response.data);
        /* var json = JSON.parse(response.data.json);
         net = new convnetjs.Net();*/
        if(response.data!=null){
            $scope.mediaFolders=   response.data;
            if($scope.mediaFolders.length>0){

                $scope.tempMediaFolderCollection.folders= $scope.mediaFolders;
                $scope.tempMediaFolderCollection.name="Fill in Name";

            }else{

                $scope.tempMediaFolderCollection.folders=[];
                $scope.tempMediaFolderCollection.name="Fill in Name";
            }


        }

        //return response.data;
    }));
    };
    $scope.loadMediaFoldersInit();
        $scope.selectedMediaFolders=function(index){

        $scope.mediaFolders=$scope.selectedMediaFolders[index];

    };
    $scope.getSelectedMediaFolders=function(){

        return   $scope.selectedMediaFolders;
    };

    $scope.addMediaFolders=function(){

        $scope.selectedMediaFolders.folders.push({number:  $scope.selectedMediaFolders.folders.length,path:'Fill in'});


    };

    $scope.deleteMediaFolders=function(index){

        $scope.mediaFolders.splice(index,1);
        $scope.mediaFolders.join();

    },
        $scope.setSelectedMediaFolder=function(index){

            $scope.selectedMediaFolder=$scope.selectedMediaFolders.classes[index];

        };
    $scope.getMediaFolders=function(){

        return $scope.mediaFolders;
    };
    $scope.getSelectedMediaFolder=function(){

        return $scope.selectedMediaFolder;
    },

        $scope.deleteSelectedMediaFolder =function(index){


        if ($scope.tempMediaFolderCollection.folders[index]._id!=undefined){

            var data = {
                access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),
                id:$scope.tempMediaFolderCollection.folders[index]._id
            };

            var config = {
                params: data,
                headers : {'Content-Type': 'application/json'}

            };

            $http.delete('/api/mediafolder/delete' ,config).success(function (data, status, headers) {

                $scope.tempMediaFolderCollection.folders.splice(index, 1);
                $scope.loadMediaFoldersInit();
            })

        }else{
            $scope.tempMediaFolderCollection.folders.splice(index, 1);
            $scope.loadMediaFoldersInit();
        }

        };
        $scope.saveMediaFolders=function(mediaFolders){
            var data ={
                mediafolders:mediaFolders,
                _id:mediaFolders._id

            };
            $http({
                url:API_ENDPOINT.url+ '/mediafolders/save',
                method: "POST",
                data: data,
                headers: {'Content-Type': 'application/json'}}).then(function(response)
            {
                console.log('success')
                /*    $scope.setSelectedClasses(  $scope.classes.length-1);
                    $scope.classes.push(classCollection);*/
                $scope.loadMediaFoldersInit();

            })   // success
                .catch(function() {console.log('error')});

        };

















    var uploader = $scope.uploader = new FileUploader({
        url: API_ENDPOINT.url+'/upload',
        /*withCredentials: false,
        autoUpload: false,
        removeAfterUpload: true,*/
        headers: {
            Authorization: AuthService.getAuthToken()
        }  ,scope: $scope

    });

    $scope.dependencies=[];

    $scope.load = function () {
        $http.get('/api/load/allmedia').success(function (data) {
            console.log(data);
            $scope.files=data;


        });
    };
    $scope.loadDependencies = function () {
        $http.get('/api/dependencies/get').success(function (data) {
            console.log(data);
            $scope.dependencies=data;


        });
    };
    $scope.loadModels = function () {
        $http.get('/api/load/algomodels').success(function (data) {
            console.log(data);
            $scope.models=data;


        });
    };
    $scope.loadModels();
    $scope.load();
    $scope.loadDependencies();
    $scope.loadOne = function (id) {
        $http.get('/api/containers/container1/download/'+ encodeURIComponent(id), {
            headers: {'Range': 'bytes=0-550'}}).success(function (data) {
            $location.url(data);
            console.log(data);
            $scope.files = data;
        });
    };

    $scope.delete = function (index, id) {
        $http.delete('/api/delete/' + encodeURIComponent(id)).success(function (data, status, headers) {
            $scope.files.splice(index, 1);
        });
    };

    // FILTERS
    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/ , options) {
            return this.queue.length < 10;
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        item.formData.push({type:item.file.type});
        item.formData.push({writeaccess:item.file.writeaccess});
        item.formData.push({readaccess:item.file.readaccess});
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.log('uploadCompleted event received');
        $scope.loadDependencies();
        $scope.load();
        $scope.loadModels();
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.log('uploadCompleted event received');
        $scope.loadDependencies();
        $scope.load();
        $scope.loadModels();
        console.info('onCompleteAll');
    };
    $scope.$on('uploadCompleted', function(event) {
        console.log('uploadCompleted event received');
        $scope.loadDependencies();
        $scope.load();
        $scope.loadModels();
    });
    console.info('uploader', uploader);


    $scope.removeMediaOne=function(index,id){
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
            $scope.selectedAnnotation= $scope.files[index];
        });


    };
    $scope.removeMediaAll=function(){
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