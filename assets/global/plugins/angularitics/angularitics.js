/**
 * @license Angulartics v0.19.2
 * (c) 2013 Luis Farzati http://luisfarzati.github.io/angulartics
 * License: MIT
 */
! function(a, b) {
    "use strict";
    var c = window.angulartics || (window.angulartics = {});
    c.waitForVendorCount = 0, c.waitForVendorApi = function(a, b, d, e, f) {
        f || c.waitForVendorCount++, e || (e = d, d = void 0), !Object.prototype.hasOwnProperty.call(window, a) || void 0 !== d && void 0 === window[a][d] ? setTimeout(function() {
            c.waitForVendorApi(a, b, d, e, !0)
        }, b) : (c.waitForVendorCount--, e(window[a]))
    }, a.module("angulartics", []).provider("$analytics", function() {
        var b = {
                pageTracking: {
                    autoTrackFirstPage: !0,
                    autoTrackVirtualPages: !0,
                    trackRelativePath: !1,
                    autoBasePath: !1,
                    basePath: "",
                    excludedRoutes: []
                },
                eventTracking: {},
                bufferFlushDelay: 1e3,
                developerMode: !1
            },
            d = ["pageTrack", "eventTrack", "setAlias", "setUsername", "setUserProperties", "setUserPropertiesOnce", "setSuperProperties", "setSuperPropertiesOnce"],
            e = {},
            f = {},
            g = function(a) {
                return function() {
                    c.waitForVendorCount && (e[a] || (e[a] = []), e[a].push(arguments))
                }
            },
            h = function(b, c) {
                return f[b] || (f[b] = []), f[b].push(c),
                    function() {
                        var c = arguments;
                        a.forEach(f[b], function(a) {
                            a.apply(this, c)
                        }, this)
                    }
            },
            i = {
                settings: b
            },
            j = function(a, b) {
                b ? setTimeout(a, b) : a()
            },
            k = {
                $get: function() {
                    return i
                },
                api: i,
                settings: b,
                virtualPageviews: function(a) {
                    this.settings.pageTracking.autoTrackVirtualPages = a
                },
                excludeRoutes: function(a) {
                    this.settings.pageTracking.excludedRoutes = a
                },
                firstPageview: function(a) {
                    this.settings.pageTracking.autoTrackFirstPage = a
                },
                withBase: function(b) {
                    this.settings.pageTracking.basePath = b ? a.element(document).find("base").attr("href") : ""
                },
                withAutoBase: function(a) {
                    this.settings.pageTracking.autoBasePath = a
                },
                developerMode: function(a) {
                    this.settings.developerMode = a
                }
            },
            l = function(c, d) {
                i[c] = h(c, d);
                var f = b[c],
                    g = f ? f.bufferFlushDelay : null,
                    k = null !== g ? g : b.bufferFlushDelay;
                a.forEach(e[c], function(a, b) {
                    j(function() {
                        d.apply(this, a)
                    }, b * k)
                })
            },
            m = function(a) {
                return a.replace(/^./, function(a) {
                    return a.toUpperCase()
                })
            },
            n = function(a) {
                var b = "register" + m(a);
                k[b] = function(b) {
                    l(a, b)
                }, i[a] = h(a, g(a))
            };
        return a.forEach(d, n), k
    }).run(["$rootScope", "$window", "$analytics", "$injector", function(b, c, d, e) {
        function f(a) {
            for (var b = 0; b < d.settings.pageTracking.excludedRoutes.length; b++) {
                var c = d.settings.pageTracking.excludedRoutes[b];
                if (c instanceof RegExp && c.test(a) || a.indexOf(c) > -1) return !0
            }
            return !1
        }

        function g(a, b) {
            f(a) || d.pageTrack(a, b)
        }
        d.settings.pageTracking.autoTrackFirstPage && e.invoke(["$location", function(a) {
            var b = !0;
            if (e.has("$route")) {
                var f = e.get("$route");
                for (var h in f.routes) {
                    b = !1;
                    break
                }
            } else if (e.has("$state")) {
                var i = e.get("$state");
                for (var j in i.get()) {
                    b = !1;
                    break
                }
            }
            if (b)
                if (d.settings.pageTracking.autoBasePath && (d.settings.pageTracking.basePath = c.location.pathname), d.settings.pageTracking.trackRelativePath) {
                    var k = d.settings.pageTracking.basePath + a.url();
                    g(k, a)
                } else g(a.absUrl(), a)
        }]), d.settings.pageTracking.autoTrackVirtualPages && e.invoke(["$location", function(a) {
            d.settings.pageTracking.autoBasePath && (d.settings.pageTracking.basePath = c.location.pathname + "#");
            var f = !0;
            if (e.has("$route")) {
                var h = e.get("$route");
                for (var i in h.routes) {
                    f = !1;
                    break
                }
                b.$on("$routeChangeSuccess", function(b, c) {
                    if (!c || !(c.$$route || c).redirectTo) {
                        var e = d.settings.pageTracking.basePath + a.url();
                        g(e, a)
                    }
                })
            }
            e.has("$state") && (f = !1, b.$on("$stateChangeSuccess", function(b, c) {
                var e = d.settings.pageTracking.basePath + a.url();
                g(e, a)
            })), f && b.$on("$locationChangeSuccess", function(b, c) {
                if (!c || !(c.$$route || c).redirectTo)
                    if (d.settings.pageTracking.trackRelativePath) {
                        var e = d.settings.pageTracking.basePath + a.url();
                        g(e, a)
                    } else g(a.absUrl(), a)
            })
        }]), d.settings.developerMode && a.forEach(d, function(a, b) {
            "function" == typeof a && (d[b] = function() {})
        })
    }]).directive("analyticsOn", ["$analytics", function(b) {
        function c(a) {
            return ["a:", "button:", "button:button", "button:submit", "input:button", "input:submit"].indexOf(a.tagName.toLowerCase() + ":" + (a.type || "")) >= 0
        }

        function d(a) {
            return c(a), "click"
        }

        function e(a) {
            return c(a) ? a.innerText || a.value : a.id || a.name || a.tagName
        }

        function f(a) {
            return "analytics" === a.substr(0, 9) && -1 === ["On", "Event", "If", "Properties", "EventType"].indexOf(a.substr(9))
        }

        function g(a) {
            var b = a.slice(9);
            return "undefined" != typeof b && null !== b && b.length > 0 ? b.substring(0, 1).toLowerCase() + b.substring(1) : b
        }
        return {
            restrict: "A",
            link: function(c, h, i) {
                var j = i.analyticsOn || d(h[0]),
                    k = {};
                a.forEach(i.$attr, function(a, b) {
                    f(b) && (k[g(b)] = i[b], i.$observe(b, function(a) {
                        k[g(b)] = a
                    }))
                }), a.element(h[0]).bind(j, function(d) {
                    var f = i.analyticsEvent || e(h[0]);
                    k.eventType = d.type, (!i.analyticsIf || c.$eval(i.analyticsIf)) && (i.analyticsProperties && a.extend(k, c.$eval(i.analyticsProperties)), b.eventTrack(f, k))
                })
            }
        }
    }])
}(angular);/**
 * Created by jacobiv on 28/12/2015.
 */
