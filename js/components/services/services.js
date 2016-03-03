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
            ],
            tiposLocais : [
                {id : "selfservice", label : "Self-Service"},
                {id : "gourmet", label : "Gourmet"},
                {id : "alacarte", label : "À la carte"},
                {id : "pizzaria", label : "Pizzaria"},
                {id : "steak", label : "Steak House"},
                {id : "vegetarian", label : "Vegetariana"},
                {id : "bbq", label : "BBQ"},
                {id : "asiatica", label : "Asiatica"},
                {id : "cafemanha", label : "Cafe da Manhã"},
                {id : "cervejaria", label : "Cervejaria"},
                {id : "padaria", label : "Padaria"},
                {id : "hamburgueria", label : "Hamburgueria"},
                {id : "cafeteria", label : "Cafeteria"},
                {id : "fastfood", label : "Fast-Food"},
                {id : "frances", label : "Francesa"},
                {id : "frangofrito", label : "Frango Frito"},
                {id : "comida-buteco", label : "Comida de Buteco"},
                {id : "italiana", label : "Italiana"},
                {id : "japonesa", label : "Japonesa"},
                {id : "mexicana", label : "Mexicana"},
                {id : "pub", label : "Pub"},
                {id : "rua", label : "Comida de Rua"},
                {id : "sushi", label : "Sushi"},
                {id : "enoteca", label : "Enoteca"}
            ],
            recuperaLabelCategoria : function(categoria) {
                var label = "";
                for(var i = 0; i < this.tiposLocais.length; i++) {
                    if(this.tiposLocais[i].id === categoria) {
                        label = this.tiposLocais[i].label;
                    }
                }
                return label
            }
        };
    }]);