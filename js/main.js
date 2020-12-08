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
           nActors: 5,
           selectedGenre: "",
           filteredFilms:[],
           jumboFilm:'',
           topRatedFilms:[],
           scrollPosition: 0,
           maxScroll: 0,
           lines: 0,
           scrollWidth: 0,
           clientWidth: 0,
           currentLine: 1,
           selectedGenres:[
               { "id": 28, "name": "Action" },
               { "id": 12, "name": "Adventure" },
               { "id": 16, "name": "Animation" }
           ]
           

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

            axios.get('https://api.themoviedb.org/3/genre/tv/list',{
                params: {
                    'api_key': API_KEY
                }
            }).then(element => {
                let transArray = [...this.genres,...element.data.genres]; 
                //rimuove i doppioni degli oggetti in genres
                this.genres = Array.from(new Set(transArray.map(a => a.id)))
                    .map(id => {
                        return transArray.find(a => a.id === id)
                    }) 
                /* this.selectedGenres = [...this.genres];
                for(let i=0; i< this.genres.length - 1 ; i++){
                    this.selectedGenres.splice(getRandomIntInclusive(0,this.selectedGenres.length),1)
                } */
            });

            axios
                .get("https://api.themoviedb.org/3/trending/movie/day", {
                    params: {
                        'api_key': API_KEY,
                        page: 1
                    }
                }).then(result => {
                    this.jumboFilm = result.data.results[getRandomIntInclusive(0, result.data.results.length)];
                    
                });

            for(let i=1; i<=25; i++){
                axios
                    .get("https://api.themoviedb.org/3/trending/movie/day", {
                        params: {
                            'api_key': API_KEY,
                            page: i
                        }
                    }).then(result => {
                        this.topRatedFilms = [...this.topRatedFilms,...result.data.results];
                    });
            }
            
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
            showLogo: function(str){ 
                return `${this.imgConfig.base_url}${this.imgConfig.logo_sizes[2]}${str} ` ; 
            },
            showJumbo: function(str){ 
                return `${this.imgConfig.base_url}${this.imgConfig.backdrop_sizes[2]}${str} ` ; 
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
            filterFilmsByGenre() {
                for(let i=0; i<this.genres.length; i++){
                    if(this.selectedGenre=== this.genres[i].name){
                        let selectedId = this.genres[i].id;
                        console.log(selectedId);
                        this.filteredFilms = this.films.filter((film) =>
                            film.genre_ids.includes(selectedId))
                    }
                }   
            },
            filteredTopRatedFilms(obj){
                return this.topRatedFilms.filter((film) =>
                film.genre_ids.includes(obj.id))
            },
            rightScroll() {
                //scroll via bottone
                this.scrollPosition = $(".top-rated-container").scrollLeft();
                this.scrollPosition = this.scrollPosition + 1000;
                $(".top-rated-container").animate({scrollLeft: this.scrollPosition});
                
                //hide del bottone rightScroll al suo estremo
                let a = $(".top-rated-container").get(0).scrollWidth;
                let b = $(".top-rated-container").get(0).clientWidth;
                this.scrollWidth = a;
                this.clientWidth = b;
                /* if (this.scrollPosition > (a - b)) {
                    this.maxScroll = (a - b);//modifico elemento che innesca la condizione
                } */

                this.currentLine++;
                
            },      
            leftScroll() {
                //scroll via bottone
                this.scrollPosition = $(".top-rated-container").scrollLeft();
                this.scrollPosition = this.scrollPosition - 1000;
                $(".top-rated-container").animate({ scrollLeft: this.scrollPosition });

                //reset dell hide del bottone rightScroll
                let a = $(".top-rated-container").get(0).scrollWidth;
                let b = $(".top-rated-container").get(0).clientWidth;

                if (this.scrollPosition < (a - b)) {
                    this.maxScroll = 0;//modifico elemento che innesca la condizione
                }

                this.currentLine--;
            },
            calcMap(){
                let map = $('.top-rated .map');
                map.css("opacity", "1");
                let a = $(".top-rated-container").get(0).scrollWidth;
                this.lines = Math.floor(a/1000);
            },
            hideMap(){
                let map = $('.top-rated .map');
                map.css("opacity","0");
            },
            listRightScroll(ev){
                console.log(ev.target);
            }

            
        },
        
 })