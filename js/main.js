/* Milestone 1: Creare un layout base con una searchbar(una input e un button) 
in cui possiamo scrivere completamente o parzialmente il nome di un film.
Possiamo, cliccando il bottone, cercare sull’API tutti i film che contengono
 ciò che ha scritto l’utente.Vogliamo dopo la risposta dell’API visualizzare 
 a schermo i seguenti valori per ogni film trovato: 
 Titolo 
 Titolo Originale 
 Lingua 
 Voto 
 */

 const myBoolflix = new Vue ({
     el:'#root',
     data:{
        films:[],
        searchInput:""
     },
     mounted(){
         /* const API_KEY = 'aa4673a37382961cbea0f02136d42791';
         axios
            .get("https://api.themoviedb.org/3/search/movie",{
                params: {
                    
                    'api_key': API_KEY,
                    query: 'searchInput'
                }
            })
            .then(r => console.log(r)) */
        },
        methods: {
            filterFilms(){
                const API_KEY = 'aa4673a37382961cbea0f02136d42791';
                axios
                    .get("https://api.themoviedb.org/3/search/movie", {
                        params: {

                            'api_key': API_KEY,
                            query: 'fight'
                        }
                    })
                    .then(r => console.log(r))
            }
        }
 })