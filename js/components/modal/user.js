angular.module('lunchtime').controller('UserController', ['$scope', '$rootScope', '$state', '$stateParams', '$cookies',
    'Usuario', 'Grupo', 'Listas', 'Locais', 'user', 'grupo',
    function ($scope, $rootScope, $state, $stateParams, $cookies, Usuario, Grupo, Listas, Locais, user, grupo) {

        $rootScope.bodybg = {
            background: '#FFFFFF'
        };

        $scope.apassword = "";
        $scope.npassword = "";
        $scope.rpassword = "";
        $scope.valido = false;
        $scope.errorString = "";

        $scope.initFormUser = function () {
            Usuario.getById(user).then(function (usuario) {
                $scope.usuario = usuario;
            });
        };

        $scope.salvarUser = function () {
            $scope.valido = false;
            if($scope.npassword) {
                //tentativa de mudanca de senha
                if ($scope.npassword.length > 4) {

                } else {
                    $scope.errorString = "A nova senha deve ter mais de 4 digitos."
                }
            }
            //verificar se houve mudanca no nome do usuario e nao troca de senha.
            if($scope.apassword) {

            }
            if($scope.valido) {
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