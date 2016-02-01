
lunchtime.controller('MapaController', ['$scope', '$rootScope', '$state', '$stateParams', '$cookies',
    'Usuario', 'Grupo',
    function($scope, $rootScope, $state, $stateParams, $cookies, Usuario, Grupo){
        $rootScope.bodybg = {
            background: '#db4437'
        };

        //pequeno teste para verificar se é o mesmo que esta no cookie.
        //enconomizo tempo e busca
        var grupoPrincipal = $cookies.getObject("ltgrupoPrincipal");
        if(!$stateParams.grupo === grupoPrincipal._id.$oid) {
            //não é o mesmo que estava no cookie, deve ser tentativa de buscar por get,
            // se passou no teste do 'on' é por que o usuario esta procurando algum grupo.
        }

        var mapOptions = {
            center: new google.maps.LatLng(grupoPrincipal.latitude, grupoPrincipal.longitude),
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            streetViewControl: true,
            disableDefaultUI: true
        };

        $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        var primarker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(grupoPrincipal.latitude, grupoPrincipal.longitude),
            title: grupoPrincipal.nome,
            icon : "img/core/localprincipal.png"
        });

        google.maps.event.addListener(primarker, 'click', function(){
            $scope.infowindow.setContent("<span>Grupo: " + grupoPrincipal.nome + "</span>");
            $scope.infowindow.open($scope.map, primarker);
        });

        $scope.markers = [];
        $scope.infowindow = new google.maps.InfoWindow();

        $scope.openInfoWindow = function(e, selectedMarker){
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, 'click');
        };


    }]);