angular.module('lunchtime').config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "views/home.html",
            controller: 'HomeController',
            data: {
                requiredlogin: false
            }
        })
        .state('mapa', {
            url: "/mapa/:grupo",
            templateUrl: "views/mapa/mapa.html",
            controller: 'MapaController',
            data: {
                requiredlogin: true
            }
        })
        .state('addlocal', {
            url: "/addlocal/:grupo",
            data: {
                requiredlogin: true
            },
            onEnter: ['$stateParams', '$state', '$modal',
                function ($stateParams, $state, $modal) {
                    $modal
                        // handle modal open
                        .open({
                            templateUrl: "views/modal/local.html",
                            controller: "LocalController"
                        })
                        // change route after modal result
                        .result.then(function () {
                            // change route after clicking OK button
                            $state.transitionTo('mapa', {grupo: $stateParams.grupo});
                        }, function () {
                            // change route after clicking Cancel button or clicking background
                            $state.transitionTo('mapa', {grupo: $stateParams.grupo});
                        });
                }
            ]
        })
        .state('user', {
            url: "/user/:user/:grupo",
            data: {
                requiredlogin: true
            },
            onEnter: ['$stateParams', '$state', '$modal',
                function ($stateParams, $state, $modal) {
                    $modal
                        // handle modal open
                        .open({
                            templateUrl: "views/modal/user.html",
                            controller: "UserController"
                        })
                        // change route after modal result
                        .result.then(function () {
                            // change route after clicking OK button
                            $state.transitionTo('mapa', {grupo: $stateParams.grupo});
                        }, function () {
                            // change route after clicking Cancel button or clicking background
                            $state.transitionTo('mapa', {grupo: $stateParams.grupo});
                        });
                }
            ]
        })
        .state('group', {
            url: "/grupos/:user",
            data: {
                requiredlogin: true
            },
            templateUrl: "views/grupos/grupos.html",
            controller: "GroupController"
        });
});