lunchtime.controller('LocalController', ['$scope', '$rootScope', '$state', '$stateParams', '$cookies',
    'Usuario', 'Grupo', 'Listas', 'Locais',
    function ($scope, $rootScope, $state, $stateParams, $cookies, Usuario, Grupo, Listas, Locais) {
        $scope.local = {
            "titulo" : resultadoBusca[0] ? resultadoBusca[0].name : "",
            "place_id" : resultadoBusca[0] ? resultadoBusca[0].place_id : "",
            "latitude" : resultadoBusca[0] ? resultadoBusca[0].geometry.location.lat() : "",
            "longitude" : resultadoBusca[0] ? resultadoBusca[0].geometry.location.lng() : "",
            "endereco" : resultadoBusca[0] ? resultadoBusca[0].vicinity : "",
            "grupo" : $stateParams.grupo,
            "categoria" : "",
            "valor" : "",
            "infos" : []
        };
        $scope.extra = "";
        $scope.tipos = Listas.tiposLocais;

        $scope.addExtra = function(){
            if($scope.extra) {
                $scope.local.infos.push($scope.extra);
                $scope.extra = "";
            }
        };

        $scope.removeExtra = function(index){
            if($scope.local.infos) {
                $scope.local.infos.splice(index, 1);
            }
        };

        // handle after clicking Cancel button
        $scope.cancelarAdd = function() {
            $scope.$dismiss();
        };
        // close modal after clicking OK button
        $scope.salvarLocal = function() {
            $scope.$close(true);
        };
    }]);