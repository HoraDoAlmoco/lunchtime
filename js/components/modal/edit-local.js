angular.module('lunchtime').controller('EditLocalController', ['$scope', '$filter', 'Listas', 'Locais', 'grupo', 'marker',
    function ($scope, $filter, Listas, Locais, grupo, marker) {

        $scope.locaisBusca = [];
        $scope.local = {
            "categoria": "",
            "valor": "",
            "infos": []
        };
        $scope.localselecionado = {};

        $scope.initLista = function () {
            for (var i = 0; i < resultadoBusca.length; i++) {
                var found = $filter('filter')(markers, {place_id: resultadoBusca[i].place_id}, true);
                //evitar mostrar o que ja foi cadastrado.
                if(!found[0]) {
                    var local = {
                        "titulo": resultadoBusca[i] ? resultadoBusca[i].name : "",
                        "place_id": resultadoBusca[i] ? resultadoBusca[i].place_id : "",
                        "latitude": resultadoBusca[i] ? resultadoBusca[i].geometry.location.lat() : "",
                        "longitude": resultadoBusca[i] ? resultadoBusca[i].geometry.location.lng() : "",
                        "endereco": resultadoBusca[i] ? resultadoBusca[i].vicinity : "",
                        "grupo": grupo,
                        "categoria": "",
                        "valor": "",
                        "infos": []
                    };
                    $scope.locaisBusca.push(local);
                }
            }
        };

        $scope.extra = "";
        $scope.tipos = Listas.tiposLocais;

        $scope.addExtra = function () {
            if ($scope.extra) {
                $scope.local.infos.push($scope.extra);
                $scope.extra = "";
            }
        };

        $scope.removeExtra = function (index) {
            if ($scope.local.infos) {
                $scope.local.infos.splice(index, 1);
            }
        };

        // handle after clicking Cancel button
        $scope.cancelarAdd = function () {
            $scope.$dismiss();
        };
        // close modal after clicking OK button
        $scope.salvarLocal = function () {

            $scope.localselecionado.categoria = $scope.local.categoria;
            $scope.localselecionado.valor = $scope.local.valor;
            $scope.localselecionado.infos = $scope.local.infos;

            var query = {
                "place_id": $scope.localselecionado.place_id
            };

            //verificar o local ja existe na base em outro grupo.

            var objGrupo = {
                "grupo": grupo,
                "titulo": $scope.localselecionado.titulo,
                "categoria": $scope.localselecionado.categoria.id,
                "valor": recuperaValor($scope.localselecionado.valor),
                "infos": $scope.localselecionado.infos,
                "votos": []
            };

            Locais.query(query).then(function (locais) {
                if (locais[0]) {
                    //trouxe algum valor
                    locais[0].grupos.push(objGrupo);
                    locais[0].$saveOrUpdate().then(function () {
                        $scope.$close(true);
                    });
                } else {
                    //novo local
                    var novoLocal = new Locais();
                    novoLocal.latitude = $scope.localselecionado.latitude;
                    novoLocal.longitude = $scope.localselecionado.longitude;
                    novoLocal.place_id = $scope.localselecionado.place_id;
                    novoLocal.endereco = $scope.localselecionado.endereco;
                    novoLocal.grupos = [objGrupo];
                    novoLocal.$saveOrUpdate().then(function () {
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