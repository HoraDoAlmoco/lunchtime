
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