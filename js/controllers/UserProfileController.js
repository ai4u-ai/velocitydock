'use strict';

MetronicApp.controller('UserProfileController', function($rootScope, $scope, $http, $timeout,rx,$filter,observeOnScope,API_ENDPOINT,FileUploader,AuthService) {
    var uploader = $scope.uploader = new FileUploader({
        url: API_ENDPOINT.url+'/user/upload/avatar',
        /*withCredentials: false,
         autoUpload: false,
         removeAfterUpload: true,*/
        headers: {
            Authorization: AuthService.getAuthToken()
        }  ,scope: $scope

    });
    $scope.user={};
    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.log('uploadCompleted event received');
        $scope.user=response.user;
        console.info('onCompleteItem', fileItem, response, status, headers);
    };


    $scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components
        Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile')); // set profile link active in sidebar menu
         $rootScope.settings.layout.pageSidebarClosed = true;
        $scope.selectedReport=null;
        // $scope.parent.dt1={dt1:$filter('date')(new Date(),"MM/yyyy")};
        $scope.dt1=$filter('date')(new Date(),"MM/yyyy");
        //  $scope.parent.dt2={dt2:$filter('date')(new Date(),"MM/yyyy")};
        $scope.dt2=$filter('date')(new Date(),"MM/yyyy");
        $scope.datePicker={};
        $scope.datePicker.isOpen1=false;
        $scope.datePicker.isOpen2=false;
        $scope.pageSpinnerBar="page-spinner-bar hide";

        observeOnScope($scope, 'dt1').subscribe(function(change) {
            $scope.observedChange = change;
            $scope.newValue = change.newValue;
            $scope.oldValue = change.oldValue;
            console.log("newValue "+ $scope.newValue);
            console.log("oldValue "+ $scope.oldValue);
        });
    });
});
