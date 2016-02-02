lunchtime
    .factory('Locais',function($mongolabResourceHttp){
    return $mongolabResourceHttp('locais');
    })
    .factory('Usuario',function($mongolabResourceHttp){
        return $mongolabResourceHttp('users');
    })
    .factory('Grupo',function($mongolabResourceHttp){
        return $mongolabResourceHttp('groups');
    })
    .factory('Locais',function($mongolabResourceHttp){
        return $mongolabResourceHttp('locations');
    })
    .factory('Listas', [function(){
        return {
            lunchtimeMapType : [
                {
                    featureType: 'poi.business',
                    elementType: 'all',
                    stylers: [
                        {visibility: 'on'}
                    ]
                },
                {
                    featureType: 'poi.attraction',
                    elementType: 'all',
                    stylers: [
                        {visibility: 'off'}
                    ]
                },
                {
                    featureType: 'poi.medical',
                    elementType: 'all',
                    stylers: [
                        {visibility: 'off'}
                    ]
                },
                {
                    featureType: 'poi.park',
                    elementType: 'all',
                    stylers: [
                        {visibility: 'off'}
                    ]
                },
                {
                    featureType: 'poi.place_of_worship',
                    elementType: 'all',
                    stylers: [
                        {visibility: 'off'}
                    ]
                },
                {
                    featureType: 'poi.school',
                    elementType: 'all',
                    stylers: [
                        {visibility: 'off'}
                    ]
                },
                {
                    featureType: 'poi.sports_complex',
                    elementType: 'all',
                    stylers: [
                        {visibility: 'off'}
                    ]
                }
            ]
        };
    }]);