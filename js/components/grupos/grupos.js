angular.module('lunchtime').controller('GroupController', ['$scope', '$rootScope', '$state', '$stateParams', '$cookies',
    'Usuario', 'Grupo', 'Listas', 'Locais',
    function ($scope, $rootScope, $state, $stateParams, $cookies, Usuario, Grupo, Listas, Locais) {
        $rootScope.bodybg = {
            background: '#FFFFFF'
        };

        $scope.iduser = $stateParams.user;

        $scope.initGrupos = function(){
            waitingDialog.show();
            Usuario.getById($stateParams.user).then(function(usuario){

                var qin = [];
                angular.forEach(usuario.grupos, function (id) {
                    qin.push({$oid: id});
                });

                var query = {"_id" : {$in: qin}};

                Grupo.query(query).then(function(grupos){
                    $scope.grupos = grupos;
                    /*
                    angular.forEach($scope.grupos, function(grupo){

                    });
                    */
                    waitingDialog.hide();
                })
            });

        };

    }]);