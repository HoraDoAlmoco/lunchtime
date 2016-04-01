angular.module('lunchtime').controller('LocalSelectionController', ['$scope', '$rootScope', '$state', '$stateParams', '$cookies',
    'Usuario', 'Grupo', 'Listas', 'Locais', 'grupo',
    function ($scope, $rootScope, $state, $stateParams, $cookies, Usuario, Grupo, Listas, Locais, grupo) {
        $scope.local = {
            "titulo" : resultadoBusca[0] ? resultadoBusca[0].name : "",
            "place_id" : resultadoBusca[0] ? resultadoBusca[0].place_id : "",
            "latitude" : resultadoBusca[0] ? resultadoBusca[0].geometry.location.lat() : "",
            "longitude" : resultadoBusca[0] ? resultadoBusca[0].geometry.location.lng() : "",
            "endereco" : resultadoBusca[0] ? resultadoBusca[0].vicinity : "",
            "grupo" : grupo,
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

            var query = {
                "place_id" : $scope.local.place_id
            };

            //verificar o local ja existe na base em outro grupo.
            var objGrupo = {
                "grupo": grupo,
                "titulo": $scope.local.titulo,
                "categoria": $scope.local.categoria.id,
                "valor": recuperaValor($scope.local.valor),
                "infos": $scope.local.infos,
                "votos": []
            };

            Locais.query(query).then(function(locais){
                if(locais[0]) {
                    //trouxe algum valor
                    locais[0].grupos.push(objGrupo);
                    locais[0].$saveOrUpdate().then(function(){
                        $scope.$close(true);
                    });
                } else {
                    //novo local
                    var novoLocal = new Locais();
                    novoLocal.latitude = $scope.local.latitude;
                    novoLocal.longitude = $scope.local.longitude;
                    novoLocal.place_id = $scope.local.place_id;
                    novoLocal.endereco = $scope.local.endereco;
                    novoLocal.grupos = [objGrupo];
                    novoLocal.$saveOrUpdate().then(function (){
                        $scope.$close(true);
                    });
                }
            });
        };

        function recuperaValor(valor) {
            var split = valor.split("-");
            return split[0].trim();
        }
    }]);