
var lunchtime = angular.module('lunchtime', [
    'ui.router','ngResource', 'mongolabResourceHttp',
    'ngCookies', 'ngAnimate'
    ])
    .constant('MONGOLAB_CONFIG',{API_KEY:'YXgR-q92vuVCKlSm-ji3nplDTE7rHIQh', DB_NAME:'ltdb'})
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "views/home.html",
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