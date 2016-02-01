lunchtime.controller('HomeController', ['$scope', '$rootScope', '$state', '$cookies',
    'Usuario', 'Grupo',
    function($scope, $rootScope, $state, $cookies, Usuario, Grupo){
        $rootScope.bodybg = {
            background: '#db4437 url(img/core/cover2.png) no-repeat fixed center'
        };

        var angularCookieUsrObj = $cookies.getObject('ltCookieKeyUsrObj');
        if(angularCookieUsrObj) {
            $rootScope.currentUser = angularCookieUsrObj;
        }

        if($rootScope.currentUser && $rootScope.currentUser.remember) {
            $scope._email = $rootScope.currentUser.email;
            $scope._remem = $rootScope.currentUser.remember;
        }

        function assignCurrentUser (user) {
            $rootScope.currentUser = user;
            $cookies.put("ltgrupoPrincipalKey", user.grupoPrincipal);
            return user;
        }

        $scope.submit = function(email, password, rememberMe) {
            var query = {
                "email" : email,
                "password" : password,
                "lunchtime" : true
            };
            Usuario.query(query).then(function(user){
                $scope.notFound = false;
                if(user[0]){
                    var curUser = user[0];

                    curUser.remember = rememberMe;
                    assignCurrentUser(curUser);
                    if(rememberMe) {
                        $cookies.putObject('ltCookieKeyUsrObj', curUser);
                    }
                    var appQuery = {
                        "_id": {
                            "$oid" : curUser.grupoPrincipal
                        }
                    };
                    Grupo.query(appQuery).then(function(grupos){
                        if(grupos[0]){
                            $cookies.putObject("ltgrupoPrincipal", grupos[0]);
                            $state.go('mapa', {"grupo" : grupos[0]._id.$oid});
                        }
                    });
                } else {
                    $scope.notFound = true;
                }
            });
        };
    }]);