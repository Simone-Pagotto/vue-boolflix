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
const languageFlags=["en","it","es"];
const API_KEY = 'aa4673a37382961cbea0f02136d42791';

 const myBoolflix = new Vue ({
     el:'#root',
     data:{       
        films:[],
        imgConfig:'',
        searchInput:"",
        isSearchActive: false,
        languageFlags: [...languageFlags],
        nStarVote: 5
        
     },
     mounted: function(){
         axios.get('https://api.themoviedb.org/3/configuration',{
             params: {
                 'api_key': API_KEY
             }
         }).then(element => this.imgConfig = element.data.images)
     },
        
        
        methods: {
            filterFilms(){
                
                axios
                    .get("https://api.themoviedb.org/3/search/movie", {
                        params: {
                            'api_key': API_KEY,
                            query: this.searchInput,
                        }
                    })
                    .then((result) =>{
                        console.log(result);
                        //azzero l'array dei film: così sostituisco anzichè aggiungere 
                        //TROVARE UNA POSIZIONE MIGLIORE PER QUEST'OPERAZIONE(MOUNTED??)
                        this.films.splice(0,this.films.length);
                        let films = result.data.results;
                        this.films.push(...films);  
                        
                    })
                axios
                    .get("https://api.themoviedb.org/3/search/tv", {
                        params: {
                            'api_key': API_KEY,
                            query: this.searchInput,
                        }
                    })
                    .then((result) =>{
                        console.log(result);
                        //azzero l'array dei film: così sostituisco anzichè aggiungere 
                        
                        let films = result.data.results;
                        this.films.push(...films);  
                        
                    })

            },
            voteToStars: function(film){
                let vote = Math.ceil(film.vote_average / 2);
                return vote;
            },
            showFlag: function(str){ 
                return `img/flags/${str}.svg ` ;
            },
            showPoster: function(str){ 
                return `${this.imgConfig.base_url}${this.imgConfig.poster_sizes[3]}${str} ` ; 
            },
            isFilm: function(film){
                //Controllo se dentro all'oggetto film ci sono le proprietà caratteristiche di un film o di una serie tv
                // con il v-if poi reindirizzo ogni singolo oggetto al suo template
                //In questo modo tengo tutti gli elementi in un unoc array
                //Impostando dei filtri posso così mischiare gli elementi
                return Object.getOwnPropertyNames(film).includes('title');
            }
             
        },
        computed:{
            
        }
 })