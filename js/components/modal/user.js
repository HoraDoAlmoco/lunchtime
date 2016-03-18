angular.module('lunchtime').controller('UserController', ['$scope', '$rootScope', '$state', '$stateParams', '$cookies',
    'Usuario', 'Grupo', 'Listas', 'Locais', 'user', 'grupo',
    function ($scope, $rootScope, $state, $stateParams, $cookies, Usuario, Grupo, Listas, Locais, user, grupo) {

        $rootScope.bodybg = {
            background: '#FFFFFF'
        };

        $scope.apassword = "";
        $scope.npassword = "";
        $scope.rpassword = "";

        $scope.initFormUser = function () {
            Usuario.getById(user).then(function (usuario) {
                $scope.usuario = usuario;
            });
        };

        $scope.salvarUser = function () {
            var valido = false;
            if($scope.npassword) {
                //tentativa de mudanca de senha

            }
            if(valido) {
                $scope.$close(true);
            }
        };

        $scope.cancelarUser = function(){
            $scope.$dismiss();
        };

        $scope.cancelarConta = function () {
            $scope.$dismiss();
        };

    }]);