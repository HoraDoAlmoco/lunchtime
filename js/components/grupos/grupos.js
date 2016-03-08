angular.module('lunchtime').controller('GroupController', ['$scope', '$rootScope', '$state', '$stateParams', '$cookies',
    'Usuario', 'Grupo', 'Listas', 'Locais',
    function ($scope, $rootScope, $state, $stateParams, $cookies, Usuario, Grupo, Listas, Locais) {
        $rootScope.bodybg = {
            background: '#FFFFFF'
        };

        $scope.maps = [];

        $scope.iduser = $stateParams.user;
        $scope.idgrupo = $stateParams.grupo;

        $scope.selectedgroup = "";
        $scope.selectedrow = null;
        $scope.detailgroup = "detail-group-hidden";

        $scope.setselectedrow = function (index, grupo) {
            $scope.selectedrow = index;
            createMap(index, grupo);
        };

        function createMap(index, grupo) {

            var mapOptions = {
                center: new google.maps.LatLng(grupo.latitude, grupo.longitude),
                zoom: 17,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                streetViewControl: false,
                disableDefaultUI: true
            };
            $scope.maps[index] = new google.maps.Map(document.getElementById('map-canvas-' + index), mapOptions);

            var primarker = new MarkerWithLabel({
                map: $scope.maps[index],
                position: new google.maps.LatLng(grupo.latitude, grupo.longitude),
                labelContent: grupo.nome,
                labelClass: "marker-labels",
                animation: google.maps.Animation.DROP,
                labelAnchor: new google.maps.Point((grupo.nome.length * 3), 0)
            });

            var input = document.getElementById('endereco' + index);
            var searchBox = new google.maps.places.SearchBox(input);

            google.maps.event.addListener(searchBox, 'places_changed', function () {
                var places = searchBox.getPlaces();
                var bounds = new google.maps.LatLngBounds();
                var place = places[0];
                primarker.setMap(null);
                primarker.position = place.geometry.location;
                primarker.setMap($scope.maps[index]);
                $scope.maps[index].setCenter(primarker.getPosition());

                $scope.grupos[index].latitude = place.geometry.location.lat();
                $scope.grupos[index].longitude = place.geometry.location.lng();

            });

        }

        $scope.convidar = function(grupo){
            //vai chamar um popup que cria um link para a pessoa se cadastrar já sendo adicionada
            //caso o email ja exista nos users ela somente é adicionada ao grupo.
            //pensar na logica de expirar o pedido e criar um hash
        };

        $scope.salvar = function(grupo) {
            //salvar aterações feitas no grupo.
        };

        $scope.excluir = function(grupo) {
            //excluir o grupo, existe uma serie de verificações e pensamentos aqui.
        };

        $scope.tornarprincipal = function(grupo) {
            //tornar esse grupo o principal para este usuario.
        };

        $scope.initGrupos = function () {
            waitingDialog.show();
            Usuario.getById($stateParams.user).then(function (usuario) {

                var qin = [];
                angular.forEach(usuario.grupos, function (id) {
                    qin.push({$oid: id});
                });

                var query = {"_id": {$in: qin}};

                Grupo.query(query).then(function (grupos) {
                    $scope.grupos = grupos;
                    $scope.grupoPrincipal = usuario.grupoPrincipal;
                    /*
                     angular.forEach($scope.grupos, function(grupo){

                     });
                     */
                    waitingDialog.hide();
                })
            });

        };

    }]);