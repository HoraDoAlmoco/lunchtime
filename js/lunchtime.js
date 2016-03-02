var service;
var resultadoBusca={};
var lunchtime = angular.module('lunchtime', [
    'ui.router','ngResource', 'mongolabResourceHttp',
    'ngCookies', 'ngAnimate', 'ui.bootstrap'
    ])
    .run(function ($rootScope, $state, $cookies) {

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

            var requireLogin = toState.data.requiredlogin;
            //ver se esta no cookie
            var angularCookieUsrObj = $cookies.getObject('ltCookieKeyUsrObj');
            if(angularCookieUsrObj) {
                $rootScope.currentUser = angularCookieUsrObj;
            }
            if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
                event.preventDefault();
                $state.go('home');
            }
        });
    })
    .constant('MONGOLAB_CONFIG',{API_KEY:'YXgR-q92vuVCKlSm-ji3nplDTE7rHIQh', DB_NAME:'ltdb'})
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "views/home.html",
                controller: 'HomeController',
                data : {
                    requiredlogin : false
                }
            })
            .state('mapa', {
                url: "/mapa/:grupo",
                templateUrl: "views/mapa/mapa.html",
                controller: 'MapaController',
                data : {
                    requiredlogin : true
                }
            })
            .state('addlocal', {
                url: "/addlocal/:grupo",
                data : {
                    requiredlogin : true
                },
                onEnter: ['$stateParams', '$state', '$modal',
                    function($stateParams, $state, $modal) {
                        $modal
                            // handle modal open
                            .open({
                                templateUrl: "views/modal/local.html",
                                controller: "LocalController"
                            })
                            // change route after modal result
                            .result.then(function() {
                                // change route after clicking OK button
                                $state.transitionTo('mapa', {grupo:$stateParams.grupo});
                            }, function() {
                                // change route after clicking Cancel button or clicking background
                                $state.transitionTo('mapa', {grupo:$stateParams.grupo});
                            });
                    }
                ]
            });
    });

function fixInfoWindow(){
    var set = google.maps.InfoWindow.prototype.set;
    google.maps.InfoWindow.prototype.set = function (key, val) {
        var self = this;
        if(key === "map") {
            if (!this.anchor) {
                var lat = self.getPosition().lat();
                var lng = self.getPosition().lng();

                var divlist = angular.element(this.content).find("div");
                var title = "";
                for(var j = 0; j < divlist.length; j++) {
                    if(angular.element(divlist[j]).hasClass("title")) {
                        title = angular.element(divlist[j]).html();
                        break;
                    }
                }
                var gmrev;
                for(var i = 0; i < divlist.length; i++) {
                    if(angular.element(divlist[i]).hasClass("view-link")) {
                        gmrev = divlist[i];
                        break;
                    }
                }

                var request = {
                    "location" : new google.maps.LatLng(lat,lng),
                    "radius" : '50',
                    "name" : title
                };

                service.nearbySearch(request, function(results, status){
                    resultadoBusca = results;
                    var link = angular.element("<button class='btn btn-danger map-add-group' set-on-click onclick='outaddtogroup(\"" + title + "\")'>Adicionar ao grupo</button>");
                    angular.element(gmrev).html("");
                    angular.element(gmrev).removeAttr("jsaction");
                    angular.element(gmrev).append(angular.element("<div></div>").append(link));
                });

            }
        }
        set.apply(this, arguments);
    }
}

function outaddtogroup(nome){
    angular.element(document.getElementById('lunchTimeApp')).scope().addtogroup(nome);
}