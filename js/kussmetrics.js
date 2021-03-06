! function(window, angular, undefined) {
    "use strict";
    angular.module("angulartics.kissmetrics", ["angulartics"]).config(["$analyticsProvider", function($analyticsProvider) {
        "undefined" == typeof _kmq ? window._kmq = [] : window._kmq = _kmq, $analyticsProvider.registerPageTrack(function(path) {
            window._kmq.push(["record", "Pageview", {
                Page: path
            }])
        }), $analyticsProvider.registerEventTrack(function(action, properties) {
            window._kmq.push(["record", action, properties])
        }), $analyticsProvider.registerSetUsername(function(uuid) {
            window._kmq.push(["identify", uuid])
        }), $analyticsProvider.registerSetUserProperties(function(properties) {
            window._kmq.push(["set", properties])
        })
    }])
}(window, window.angular);
