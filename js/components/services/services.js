lunchtime
    .factory('Locais',function($mongolabResourceHttp){
    return $mongolabResourceHttp('locais');
    })
    .factory('Usuario',function($mongolabResourceHttp){
        return $mongolabResourceHttp('users');
    })
    .factory('Grupo',function($mongolabResourceHttp){
        return $mongolabResourceHttp('groups');
    });