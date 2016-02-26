
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
            });
    });

function fixInfoWindow(){
    var set = google.maps.InfoWindow.prototype.set;
    google.maps.InfoWindow.prototype.set = function (key, val) {
        var self = this;
        if(key === "map") {
            if (!this.anchor) {
                console.log(this.getPosition());
                console.log(this.getContent());
                console.log(this.content);
                var link = angular.element("<button class='btn btn-danger map-add-group' set-on-click onclick='outaddtogroup()'>Adicionar ao grupo</button>");
                var divlist = angular.element(this.content).find("div");
                var gmrev;
                for(var i = 0; i < divlist.length; i++) {
                    if(angular.element(divlist[i]).hasClass("view-link")) {
                        gmrev = divlist[i];
                        break;
                    }
                }
                angular.element(gmrev).html("");
                angular.element(gmrev).removeAttr("jsaction");
                angular.element(gmrev).append(angular.element("<div></div>").append(link));
            }
        }
        set.apply(this, arguments);
    }
}

function outaddtogroup(){
    angular.element(document.getElementById('lunchTimeApp')).scope().addtogroup();
}