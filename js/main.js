const languageFlags=["en","it","es"];
const API_KEY = 'aa4673a37382961cbea0f02136d42791';

 const myBoolflix = new Vue ({
        el:'#root',
        data:{       
           films:[],
           imgConfig:'',
           genres:[],
           searchInput:"",
           isSearchActive: false,
           languageFlags: [...languageFlags],
           nStarVote: 5,
           nActors: 5

        },
        mounted: function(){
            axios.get('https://api.themoviedb.org/3/configuration',{
                params: {
                    'api_key': API_KEY
                }
            }).then(element => this.imgConfig = element.data.images);

            axios.get('https://api.themoviedb.org/3/genre/movie/list',{
                params: {
                    'api_key': API_KEY
                }
            }).then(element => this.genres = element.data.genres);
        },
        methods: {
            filterFilms(){
                let moviePromise = axios
                    .get("https://api.themoviedb.org/3/search/movie", {
                        params: {
                            'api_key': API_KEY,
                            query: this.searchInput,
                        }
                    });
                let tvPromise = axios
                    .get("https://api.themoviedb.org/3/search/tv", {
                        params: {
                            'api_key': API_KEY,
                            query: this.searchInput,
                        }
                    });
                this.films.splice(0, this.films.length);
                Promise.all([moviePromise, tvPromise])
                        .then((result) => { 
                            for(let i=0; i<result.length; i++){
                                
                                let films = result[i].data.results;
                                this.films.push(...films); 
                            }
                            for (let i = 0; i < this.films.length; i++) {
                                axios
                                    .get(`https://api.themoviedb.org/3/movie/${this.films[i].id}/credits`, {
                                        params: {
                                            'api_key': API_KEY,
                                        }
                                    }).then(result => {
                                        this.$set(this.films[i], 'cast', result.data.cast.splice(0, this.nActors))  
                                    }
                                        )
                            }
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
            showGenre: function(arr){
                let isNotInList = 0;
                for(let i=0; i<this.genres.length; i++){
                    if(arr === this.genres[i].id){
                        return this.genres[i].name;
                    } else {
                        isNotInList++;
                    }
                }
                if(isNotInList===this.genres.length){
                    return 'error';
                }
            },
            isFilm: function(film){
                //Controllo se dentro all'oggetto film ci sono le proprietà caratteristiche di un film o di una serie tv
                // con il v-if poi reindirizzo ogni singolo oggetto al suo template
                //In questo modo tengo tutti gli elementi in un unoc array
                //Impostando dei filtri posso così mischiare gli elementi
                return Object.getOwnPropertyNames(film).includes('title');
            },
            nullImg(e){
                e.target.src = 'img/error-square.svg';
            },
            
            
             
        },
 })