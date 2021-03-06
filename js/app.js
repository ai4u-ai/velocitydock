/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router", "xeditable",
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize","velocity","rx","ngJsTree","angularFileUpload",'angularTrix','colorpicker.module',
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        cssFilesInsertBefore: 'ng_load_plugins_before' // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
    });
}]);


function SquillFactory($window) {
    if(!$window._){
        // If lodash is not available you can now provide a
        // mock service, try to load it from somewhere else,
        // redirect the user to a dedicated error page, ...
    }
    return $window.Quill;
}

// Define dependencies
SquillFactory.$inject = ['$window'];

// Register factory
MetronicApp.factory('Quill', SquillFactory);

/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/
/**
`$controller` will no longer look for controllers on `window`.
The old behavior of looking on `window` for controllers was originally intended
for use in examples, demos, and toy apps. We found that allowing global controller
functions encouraged poor practices, so we resolved to disable this behavior by
default.

To migrate, register your controllers with modules rather than exposing them
as globals:

Before:

```javascript
function MyController() {
  // ...
}
```

After:

```javascript
angular.module('myApp', []).controller('MyController', [function() {
  // ...
}]);

Although it's not recommended, you can re-enable the old behavior like this:

```javascript
angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
**/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
   $controllerProvider.allowGlobals();
}]);

/*MetronicApp.config(['$analyticsProvider','deepQLearnServiceProvider', function ($analyticsProvider,deepQLearnServiceProvider) {
    $analyticsProvider.registerPageTrack(function (path) {
        console.log(path);
    });
    $analyticsProvider.registerEventTrack(function (action, properties) {
        deepQLearnServiceProvider.$get().forward(1);
        console.log();
    });
}]);*/


/*
//IDLE Provider
MetronicApp.config(function(IdleProvider, KeepaliveProvider) {
    // configure Idle settings
    IdleProvider.idle(5); // in seconds
    IdleProvider.timeout(5); // in seconds
    KeepaliveProvider.interval(2); // in seconds
})
*/


/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
        layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope','$state', 'AuthService', 'AUTH_EVENTS', function($scope, $rootScope,$state,  AuthService, AUTH_EVENTS) {
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
        $scope.count=0;
    });
    $scope.destroySession = function() {
        AuthService.logout();
    };
    $scope.getUser=function(){
      return   AuthService.getCurrUser();
    };

    $scope.getUserAvatar=function(){
        return   AuthService.getUserAvatar();
    };

    $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
        AuthService.logout();
        $state.go('outside/login');

    });
    $scope.logout = function() {
        AuthService.logout();
        $state.go('outside/login');
    };
}]);


MetronicApp.controller('LoginCtrl', function($scope, AuthService,  $state) {
    $scope.user = {
        name: '',
        password: ''
    };

    $scope.login = function() {
        AuthService.login($scope.user).then(function(msg) {
            $state.go('profile.account');
        }, function(errMsg) {
            $scope.errMsg=errMsg;
        });
    };
}).controller('RegisterCtrl', function($scope, AuthService, $state) {
    $scope.user = {

    };

    $scope.signup = function() {
        AuthService.register($scope.user).then(function(msg) {
            $state.go('profile.account');

        }, function(errMsg) {
          console.log(errMsg);
          $scope.errMsg=errMsg;
        });
    };
}).controller('InsideCtrl', function($scope, AuthService, API_ENDPOINT, $http, $state) {
    $scope.destroySession = function() {
        AuthService.logout();
    };

    $scope.getInfo = function() {
        $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
            $scope.memberinfo = result.data.msg;
        });
    };

    $scope.logout = function() {
        AuthService.logout();
        $state.go('outside/login');
    };
})
/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('PageHeadController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {        
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

MetronicApp.filter('reverse', function() {

    return function(items) {
        if(items!=undefined){
            return items.slice().reverse();
        }

    };
});


MetronicApp.filter('secondsToHHmmss', function($filter) {
    return function(seconds) {
        return $filter('date')(new Date(0, 0, 0).setSeconds(seconds), 'HH:mm:ss');
    };
})
MetronicApp.filter('milisecindsToHHmmss', function($filter) {
    return function(miliseconds) {
        return $filter('date')(new Date(0, 0, 0).setMilliseconds(miliseconds), 'HH:mm:ss');
    };
})
MetronicApp.filter('orderBymilisecindsToHHmmss', function($filter) {
    return function(miliseconds) {
        return (new Date(0, 0, 0).setMilliseconds(miliseconds), 'HH:mm:ss');
    };
})

MetronicApp.filter('reverseHash', function() {

    return function(items) {
        if(items!=undefined){
            var newL=[]
            for(i in items){newL.push(i)}
            return newL.reverse();
        }

    };
});
/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider,$routeSegmentProvider) {

    // Redirect any unmatched url
    $urlRouterProvider.otherwise("profile/account");


    $stateProvider
        .state('outside', {
            url: '/outside.html',
            abstract: true,
            templateUrl: 'views/outside.html'
        })
        .state('outside/login', {
            url: '/login.html',
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        })
        .state('outside/register', {
            url: '/register.html',
            templateUrl: 'views/register.html',
            controller: 'RegisterCtrl'
        })
        .state('inside', {
            url: '/inside.html',
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardController'
        })
        // Dashboard
        .state('videoeditor', {
            url: "/videoEditor.html",
            templateUrl: "views/videoEditor.html",
            data: {pageTitle: 'Video Editor', pageSubTitle: 'annotated & train algoritm'},
            controller: "VideoEditorController",
            resolve: {

                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/morris/morris.css',
                            'assets/admin/pages/css/tasks.css',
                            'assets/admin/pages/css/timeline.css',
                            'assets/global/plugins/morris/morris.min.js',
                            'assets/global/plugins/morris/raphael-min.js',
                            'assets/global/plugins/jquery.sparkline.min.js',
                            'assets/global/plugins/select2/select2.css',
                            'assets/admin/pages/css/todo.css',

                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            'assets/global/plugins/select2/select2.min.js',

                            'assets/admin/pages/scripts/todo.js',
                            'assets/admin/pages/scripts/index3.js',
                            'assets/admin/pages/scripts/tasks.js',
                            'js/algorithms/jsfeat-min.js',
                            'js/controllers/DashboardController.js',
                            'assets/admin/pages/scripts/components-form-tools.js',
                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            'assets/global/plugins/jquery-tags-input/jquery.tagsinput.css',
                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            'assets/global/plugins/typeahead/typeahead.css',

                            'assets/global/plugins/fuelux/js/spinner.min.js',
                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            'assets/global/plugins/jquery-tags-input/jquery.tagsinput.min.js',
                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            'assets/global/plugins/typeahead/handlebars.min.js',
                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                            'assets/admin/pages/scripts/components-form-tools.js',

                             'js/controllers/VideoEditorController.js'
                        ] 
                    });
                }]
            }
        })
        .state('videotexteditor', {
            url: "/videoTextEditor.html",
            templateUrl: "views/videoTextEditor.html",
            data: {pageTitle: 'Video Text Editor', pageSubTitle: 'annotate & train algoritm'},
            controller: "VideoTextEditorController",
            resolve: {

                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/morris/morris.css',
                            'assets/admin/pages/css/tasks.css',
                            'assets/admin/pages/css/timeline.css',
                            'assets/global/plugins/morris/morris.min.js',
                            'assets/global/plugins/morris/raphael-min.js',
                            'assets/global/plugins/jquery.sparkline.min.js',
                            'assets/global/plugins/select2/select2.css',
                            'assets/admin/pages/css/todo.css',

                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            'assets/global/plugins/select2/select2.min.js',

                            'assets/admin/pages/scripts/todo.js',
                            'assets/admin/pages/scripts/index3.js',
                            'assets/admin/pages/scripts/tasks.js',
                            'js/algorithms/jsfeat-min.js',
                            'js/controllers/DashboardController.js',
                            'assets/admin/pages/scripts/components-form-tools.js',
                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            'assets/global/plugins/jquery-tags-input/jquery.tagsinput.css',
                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            'assets/global/plugins/typeahead/typeahead.css',

                            'assets/global/plugins/fuelux/js/spinner.min.js',
                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            'assets/global/plugins/jquery-tags-input/jquery.tagsinput.min.js',
                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            'assets/global/plugins/typeahead/handlebars.min.js',
                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                            'assets/admin/pages/scripts/components-form-tools.js',
                            'js/controllers/VideoTextEditorController.js',


                        ]
                    });
                }]
            }
        })
        .state('shop', {
            url: "/shop",
            templateUrl: "views/shop/shop-search-result.html",
            data: {pageTitle: 'Shop', pageSubTitle: 'statistics & reports'},
            controller: "ShopController",
            resolve: {

                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/frontend/layout/css/style.css',
                            'assets/frontend/layout/css/style-responsive.css',
                            'assets/global/css/components.css',
                            'assets/frontend/layout/css/themes/red.css',
                            'assets/frontend/layout/css/custom.css',
                            'assets/global/plugins/jquery.sparkline.min.js',
                            'assets/frontend/pages/css/style-shop.css',
                            'assets/admin/pages/scripts/index3.js',
                            'assets/admin/pages/scripts/tasks.js',   'js/controllers/DashboardController.js'

                        ]
                    });
                }]
            }
        })
        .state('dashboard', {
        url: "/dashboard.html",
        templateUrl: "views/dashboard.html",
        data: {pageTitle: 'Dashboard', pageSubTitle: 'statistics & reports'},
        controller: "DashboardController",
        resolve: {

            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/global/plugins/morris/morris.css',
                        'assets/admin/pages/css/tasks.css',
                        'assets/admin/layout4/css/themes/light.css',
                        'assets/admin/layout4/css/custom.css',
                        'assets/global/plugins/uniform/css/uniform.default.css',
                        'assets/admin/layout4/css/layout.css',
                        'assets/global/plugins/morris/morris.min.js',
                        'assets/global/plugins/morris/raphael-min.js',
                        'assets/global/plugins/jquery.sparkline.min.js',

                        'assets/admin/pages/scripts/index3.js',
                        'assets/admin/pages/scripts/tasks.js',

                        'js/controllers/DashboardController.js'
                    ]
                });
            }]
        }
    })

        // AngularJS plugins
        .state('fileupload', {
            url: "/file_upload.html",
            templateUrl: "views/file_upload.html",
            data: {pageTitle: 'File Upload', pageSubTitle: 'file upload'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'angularFileUpload',
                        files: [
                            'assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                        ] 
                    }, {
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/GeneralPageController.js',
                            'js/controllers/FileUpladController.js'
                        ]
                    }]);
                }]
            }
        })
        .state('media', {
            url: "/media.html",
            templateUrl: "views/media.html",
            data: {pageTitle: 'My Media', pageSubTitle: 'ad'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'angularFileUpload',
                        files: [
                            'assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                        ]
                    }, {
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/GeneralPageController.js',
                            'js/controllers/MediaController.js'
                        ]
                    }]);
                }]
            }
        })
        .state('annotations', {
            url: "/annotations.html",
            templateUrl: "views/annotations.html",
            data: {pageTitle: 'My', pageSubTitle: 'annotations'},
            controller: "AnnotationsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/AnnotationsController.js',
                            'assets/global/plugins/select2/select2.css',
                            'assets/admin/pages/css/todo.css'
                        ]
                    }]);
                }]
            }
        })
        .state('datasets', {
            url: "/datasets.html",
            templateUrl: "views/datasets.html",
            data: {pageTitle: 'My', pageSubTitle: 'datasets'},
            controller: "DataSetsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/DataSetsController.js',
                            'assets/global/plugins/select2/select2.css',
                            'assets/admin/pages/css/todo.css',
                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            'assets/global/plugins/jquery-tags-input/jquery.tagsinput.css',
                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            'assets/global/plugins/typeahead/typeahead.css',
                            'assets/global/plugins/fuelux/js/spinner.min.js',
                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            'assets/global/plugins/jquery-tags-input/jquery.tagsinput.min.js',
                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            'assets/global/plugins/typeahead/handlebars.min.js',
                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                            'assets/admin/pages/scripts/components-form-tools.js',
                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js'

                        ]
                    },{
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/DataSetsController.js',
                            'assets/admin/pages/css/todo.css',
                            'assets/admin/pages/scripts/todo.js'

                        ]
                    }]);
                }]
            }
        })
        .state('monitoring', {
            url: "/monitoring.html",
            templateUrl: "views/monitoring.html",
            data: {pageTitle: 'My', pageSubTitle: 'monitoring'},
            controller: "MonitoringController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/MonitoringController.js',
                            'assets/global/plugins/select2/select2.css',
                            'assets/admin/pages/css/todo.css'
                        ]
                    }]);
                }]
            }
        })
        .state('webcam', {
            url: "/webcam.html",
            templateUrl: "views/webcam.html",
            data: {pageTitle: 'My', pageSubTitle: 'webcam'},
            controller: "WebcamController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/WebcamController.js',
                            'assets/global/plugins/select2/select2.css',
                            'assets/admin/pages/css/todo.css'
                        ]
                    }]);
                }]
            }
        })
        .state('searchmedia', {
            url: "/searchmedia.html",
            templateUrl: "views/searchmedia.html",
            data: {pageTitle: 'Search', pageSubTitle: 'media'},
            controller: "SearchMediaController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/SearchMediaController.js',
                            'assets/global/plugins/select2/select2.css',
                            'assets/admin/pages/css/todo.css'
                        ]
                    }]);
                }]
            }
        })
        // UI Select
        .state('uiselect', {
            url: "/ui_select.html",
            templateUrl: "views/ui_select.html",
            data: {pageTitle: 'AngularJS Ui Select', pageSubTitle: 'select2 written in angularjs'},
            controller: "UISelectController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'ui.select',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js'
                        ]
                    }, {
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/UISelectController.js'
                        ] 
                    }]);
                }]
            }
        })

        // UI Bootstrap
        .state('uibootstrap', {
            url: "/ui_bootstrap.html",
            templateUrl: "views/ui_bootstrap.html",
            data: {pageTitle: 'AngularJS UI Bootstrap', pageSubTitle: 'bootstrap components written in angularjs'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })

        .state('myalgos', {
            url: "/myalgos.html",
            templateUrl: "views/myalgos.html",
            data: {pageTitle: 'My Algorithms', pageSubTitle: 'Create and modify algorithms'},
            controller: "AlgosController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'ui.select',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            'assets/global/plugins/jquery-tags-input/jquery.tagsinput.css',
                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            'assets/global/plugins/typeahead/typeahead.css',
                            'assets/global/plugins/fuelux/js/spinner.min.js',
                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            'assets/global/plugins/jquery-tags-input/jquery.tagsinput.min.js',
                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            'assets/global/plugins/typeahead/handlebars.min.js',
                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                            'assets/admin/pages/scripts/components-form-tools.js',
                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js'
                        ]
                    },{
                        name: 'MetronicApp',
                        files: [

                            'js/controllers/AlgosController.js',
                               'assets/admin/pages/css/todo.css',
                            'assets/admin/pages/scripts/todo.js'


                        ]
                    }]);
                }]
            }
        })
        // Tree View
        .state('tree', {
            url: "/tree",
            templateUrl: "views/tree.html",
            data: {pageTitle: 'jQuery Tree View', pageSubTitle: 'tree view samples'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/jstree/dist/themes/default/style.min.css',

                            'assets/global/plugins/jstree/dist/jstree.min.js',
                            'assets/global/plugins/jstree/ngJsTree.min.js',
                            'assets/admin/pages/scripts/ui-tree.js',
                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })     

        // Form Tools
        .state('formtools', {
            url: "/form-tools",
            templateUrl: "views/form_tools.html",
            data: {pageTitle: 'Form Tools', pageSubTitle: 'form components & widgets sample'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            'assets/global/plugins/jquery-tags-input/jquery.tagsinput.css',
                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            'assets/global/plugins/typeahead/typeahead.css',

                            'assets/global/plugins/fuelux/js/spinner.min.js',
                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            'assets/global/plugins/jquery-tags-input/jquery.tagsinput.min.js',
                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            'assets/global/plugins/typeahead/handlebars.min.js',
                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                            'assets/admin/pages/scripts/components-form-tools.js',

                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })        

        // Date & Time Pickers
        .state('pickers', {
            url: "/pickers",
            templateUrl: "views/pickers.html",
            data: {pageTitle: 'Date & Time Pickers', pageSubTitle: 'date, time, color, daterange pickers'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/clockface/css/clockface.css',
                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            'assets/global/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css',
                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            'assets/global/plugins/clockface/js/clockface.js',
                            'assets/global/plugins/bootstrap-daterangepicker/moment.min.js',
                            'assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js',
                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                            'assets/admin/pages/scripts/components-pickers.js',

                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })

        // Custom Dropdowns
        .state('dropdowns', {
            url: "/dropdowns",
            templateUrl: "views/dropdowns.html",
            data: {pageTitle: 'Custom Dropdowns', pageSubTitle: 'select2 & bootstrap select dropdowns'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/bootstrap-select/bootstrap-select.min.css',
                            'assets/global/plugins/select2/select2.css',
                            'assets/global/plugins/jquery-multi-select/css/multi-select.css',

                            'assets/global/plugins/bootstrap-select/bootstrap-select.min.js',
                            'assets/global/plugins/select2/select2.min.js',
                            'assets/global/plugins/jquery-multi-select/js/jquery.multi-select.js',

                            'assets/admin/pages/scripts/components-dropdowns.js',

                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        }) 

        // Advanced Datatables
        .state('datatablesAdvanced', {
            url: "/datatables/advanced.html",
            templateUrl: "views/datatables/advanced.html",
            data: {pageTitle: 'Advanced Datatables', pageSubTitle: 'advanced datatables samples'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/select2/select2.css',                             
                            'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css', 
                            'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',

                            'assets/global/plugins/select2/select2.min.js',
                            'assets/global/plugins/datatables/all.min.js',
                            'js/scripts/table-advanced.js',

                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // Ajax Datetables
        .state('datatablesAjax', {
            url: "/datatables/ajax.html",
            templateUrl: "views/datatables/ajax.html",
            data: {pageTitle: 'Ajax Datatables', pageSubTitle: 'ajax datatables samples'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/select2/select2.css',                             
                            'assets/global/plugins/bootstrap-datepicker/css/datepicker.css',
                            'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',

                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            'assets/global/plugins/select2/select2.min.js',
                            'assets/global/plugins/datatables/all.min.js',

                            'assets/global/scripts/datatable.js',
                            'js/scripts/table-ajax.js',

                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })


        .state("developer", {
            url: "/developer",
            templateUrl: "views/developer/main.html",
            data: {pageTitle: 'User Profile', pageSubTitle: 'user profile sample'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                           ' assets/admin/layout4/css/themes/light.css',
                            'assets/admin/layout4/css/custom.css',
                            'assets/global/plugins/uniform/css/uniform.default.css',
                            'assets/admin/layout4/css/layout.css',
                            'js/controllers/DashboardController.js'


                        ]
                    });
                }]
            }
        })


        // User Profile
        .state("profile", {
            url: "/profile",
            templateUrl: "views/profile/main.html",
            data: {pageTitle: 'User Profile', pageSubTitle: 'user profile sample'},
            controller: "UserProfileController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            'assets/admin/pages/css/profile.css',
                            'assets/admin/pages/css/tasks.css',
                            
                            'assets/global/plugins/jquery.sparkline.min.js',
                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            'assets/admin/pages/scripts/profile.js',

                            'js/controllers/UserProfileController.js',

                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            'js/controllers/UserProfileController.js',
                            'assets/global/plugins/morris/morris.css',

                            'assets/global/plugins/morris/morris.min.js',
                            'assets/global/plugins/morris/raphael-min.js',
                            'assets/global/plugins/jquery.sparkline.min.js',

                            'assets/admin/pages/scripts/index3.js',
                            'assets/admin/pages/scripts/tasks.js'

                        ]                    
                    });
                }]
            }
        })

        // User Profile Dashboard
        .state("profile.dashboard", {
            url: "/dashboard",
            templateUrl: "views/profile/account.html",
            data: {pageTitle: 'User Profile', pageSubTitle: 'user profile dashboard sample'}
        })

        // User Profile Account
        .state("profile.account", {
            url: "/account",
            templateUrl: "views/profile/account.html",
            data: {pageTitle: 'User Account', pageSubTitle: 'user profile account sample'}
        })

        // User Profile Help
        .state("profile.help", {
            url: "/help",
            templateUrl: "views/profile/help.html",
            data: {pageTitle: 'User Help', pageSubTitle: 'user profile help sample'}      
        })

        // Todo
        .state('todo', {
            url: "/todo",
            templateUrl: "views/todo.html",
            data: {pageTitle: 'Todo', pageSubTitle: 'user todo & tasks sample'},
            controller: "TodoController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/bootstrap-datepicker/css/datepicker3.css',
                            'assets/global/plugins/select2/select2.css',
                            'assets/admin/pages/css/todo.css',

                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            'assets/global/plugins/select2/select2.min.js',

                            'assets/admin/pages/scripts/todo.js',

                            'js/controllers/TodoController.js'  
                        ]                    
                    });
                }]
            }
        })

}]).run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
    $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
        if (!AuthService.isAuthenticated()) {
            console.log(next.name);
            if (next.name !== 'outside/login' && next.name !== 'outside/register') {
                event.preventDefault();
                $state.go('outside/login');
            }
        }
    });
});


/* Init sankey Service */
/*
MetronicApp.factory('deepQLearnService', ['$document', '$window', '$q', '$rootScope',
    function($document, $window, $q, $rootScope) {


        var d = $q.defer();

         var   deepQLearnService = {


             deepqlearn:function() { return d.promise; },
                savenet:function() {
                    var j = brain.value_net.toJSON();
                    var t = JSON.stringify(j);

                },
                loadnet:function() {
                    //brain.value_net.fromJSON(j);

                },



            };

        function onScriptLoad() {
            // Load client in the browser
            $rootScope.$apply(function()
            {
                if(angular.isUndefined(brain)){
                    brain=new $window.deepqlearn.Brain(num_inputs, num_actions, opt);
                    d.resolve(brain);
                    return brain
                }else{
                    d.resolve(brain);
                }

            });
        }

        var scriptTag = $document[0].createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.async = true;
        scriptTag.src = 'assets/global/plugins/covnet/deepqlearn.js';
        scriptTag.onreadystatechange = function () {
            if (this.readyState == 'complete') onScriptLoad();
        }
        scriptTag.onload = onScriptLoad;

        var s = $document[0].getElementsByTagName('body')[0];
        s.appendChild(scriptTag);
        var brain;
        var num_inputs =   $rootScope.numberInputs;       // 9 eyes, each sees 3 numbers (wall, green, red thing proximity)
        var num_actions=$rootScope.numberActions; // 5 possible angles agent can turn
        var temporal_window = 1; // amount of temporal memory. 0 = agent lives in-the-moment :)
        var network_size = num_inputs*temporal_window + num_actions*temporal_window + num_inputs;

        // the value function network computes a value of taking any of the possible actions
        // given an input state. Here we specify one explicitly the hard way
        // but user could also equivalently instead use opt.hidden_layer_sizes = [20,20]
        // to just insert simple relu hidden layers.
        var layer_defs = [];
        layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:network_size});
        layer_defs.push({type:'fc', num_neurons: 50, activation:'relu'});
        layer_defs.push({type:'fc', num_neurons: 50, activation:'relu'});
        layer_defs.push({type:'regression', num_neurons:num_actions});

        // options for the Temporal Difference learner that trains the above net
        // by backpropping the temporal difference learning rule.
        var tdtrainer_options = {learning_rate:0.001, momentum:0.0, batch_size:64, l2_decay:0.01};

        var opt = {};
        opt.temporal_window = temporal_window;
        opt.experience_size = 30000;
        opt.start_learn_threshold = 1000;
        opt.gamma = 0.7;
        opt.learning_steps_total = 200000;
        opt.learning_steps_burnin = 3000;
        opt.epsilon_min = 0.05;
        opt.epsilon_test_time = 0.05;
        opt.layer_defs = layer_defs;
        opt.tdtrainer_options = tdtrainer_options;
        return deepQLearnService;
    }]);
*/
/*MetronicApp.provider('deepQLearnService', ['$document', '$window', '$q', '$rootScope',
    function($document, $window, $q, $rootScope) {
    var   DeepQLearnService=  function() {
         var self = this;
         self.num_inputs =   $rootScope.numberInputs;       // 9 eyes, each sees 3 numbers (wall, green, red thing proximity)
         self.num_actions=$rootScope.numberActions; // 5 possible angles agent can turn
         self.temporal_window = 1; // amount of temporal memory. 0 = agent lives in-the-moment :)
         self.network_size =  self.num_inputs* self.temporal_window +  self.num_actions* self.temporal_window +  self.num_inputs;

         // the value function network computes a value of taking any of the possible actions
         // given an input state. Here we specify one explicitly the hard way
         // but user could also equivalently instead use opt.hidden_layer_sizes = [20,20]
         // to just insert simple relu hidden layers.
         self.layer_defs = [];
         self.layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth: self.network_size});
         self.layer_defs.push({type:'fc', num_neurons: 50, activation:'relu'});
         self.layer_defs.push({type:'fc', num_neurons: 50, activation:'relu'});
         self.layer_defs.push({type:'regression', num_neurons: self.num_actions});

         // options for the Temporal Difference learner that trains the above net
         // by backpropping the temporal difference learning rule.
         self.tdtrainer_options = {learning_rate:0.001, momentum:0.0, batch_size:64, l2_decay:0.01};

         self.opt = {};
         self.opt.temporal_window =  self.temporal_window;
         self.opt.experience_size = 30000;
         self.opt.start_learn_threshold = 1000;
         self.opt.gamma = 0.7;
         self.opt.learning_steps_total = 200000;
         self. opt.learning_steps_burnin = 3000;
         self.opt.epsilon_min = 0.05;
         self.opt.epsilon_test_time = 0.05;
         self.opt.layer_defs =  self.layer_defs;
         self.opt.tdtrainer_options =  self.tdtrainer_options;

         self.brain= new deepqlearn.Brain( self.num_inputs,  self.num_actions,  self.opt);


     };

        return new DeepQLearnService();
    }]);*/
/*
MetronicApp.provider('deepQLearnService',
        function(){
            var num_inputs = 27; // 9 eyes, each sees 3 numbers (wall, green, red thing proximity)
            var num_actions = 5; // 5 possible angles agent can turn
            var temporal_window = 1; // amount of temporal memory. 0 = agent lives in-the-moment :)
            var network_size = num_inputs*temporal_window + num_actions*temporal_window + num_inputs;

        // the value function network computes a value of taking any of the possible actions
        // given an input state. Here we specify one explicitly the hard way
        // but user could also equivalently instead use opt.hidden_layer_sizes = [20,20]
        // to just insert simple relu hidden layers.
            var layer_defs = [];
            layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:network_size});
            layer_defs.push({type:'fc', num_neurons: 50, activation:'relu'});
            layer_defs.push({type:'fc', num_neurons: 50, activation:'relu'});
            layer_defs.push({type:'regression', num_neurons:num_actions});

        // options for the Temporal Difference learner that trains the above net
        // by backpropping the temporal difference learning rule.
            var tdtrainer_options = {learning_rate:0.001, momentum:0.0, batch_size:64, l2_decay:0.01};

            var opt = {};
            opt.temporal_window = temporal_window;
            opt.experience_size = 30000;
            opt.start_learn_threshold = 1000;
            opt.gamma = 0.7;
            opt.learning_steps_total = 200000;
            opt.learning_steps_burnin = 3000;
            opt.epsilon_min = 0.05;
            opt.epsilon_test_time = 0.05;
            opt.layer_defs = layer_defs;
            opt.tdtrainer_options = tdtrainer_options;

            return{
              numberInputs:function(nrInputs){
                  if(angular.isDefined(nrInputs)){
                      num_inputs= nrInputs;
                      return this;
                  }else{
                      return num_inputs;
                  }
              } ,
              numberActions:function(nrActions){
                  if(angular.isDefined(nrActions)){
                      num_actions=nrActions;
                      return this;
                  }else {
                      return num_actions;
                  }
              },
                $get :function() {


                    return new deepqlearn.Brain(num_inputs, num_actions,  opt);
            }
            }



        });
MetronicApp.config(function(deepQLearnServiceProvider){
    deepQLearnServiceProvider.numberInputs(27).numberActions(5);

});
*/

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", "editableOptions",function($rootScope, settings, $state,editableOptions) {
    editableOptions.theme = 'bs3';
    $rootScope.$state = $state; // state to be accessed from view
   // Idle.watch();

}]);