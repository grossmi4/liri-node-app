const env = require("dotenv").config();
const Spotify = require("node-spotify-api");
const moment = require("moment");
const keys = require("./keys.js");
const spotify = new Spotify(keys.spotify);
const axios = require("axios");
const fs = require("fs");

let cmd = process.argv[2];

const spotifySearch = function (search) {
  spotify
    .search({
      type: 'track',
      query: search,
      limit: 2
    }).then(function (response) {
    let songs = response.tracks.items
    songs.forEach(song => {
      console.log(`Artist(s): ${song.artists}`);
      console.log(`Song Name: ${song.name}`);
      console.log(`Album: ${song.album.name}`)
      console.log(`Preview Link: ${song.external_urls.spotify}`)

    })
  }).catch(function (error) {
    console.log(error)
  })
};

const bandSearch = function(search) {
  axios
    .get(`https://rest.bandsintown.com/artists/${search}/events?app_id=codingbootcamp`)
    .then(response =>{
      //cycles through responses displaying each to the terminal window
      response.data.forEach(event => {
        console.log(`Venue Name: ${event.venue.name}`);
        console.log(`Venue Location: ${event.venue.city}`);
        console.log(`Date: ${moment(event.venue.datetime).format('L')}`);
      })
    }).catch(error=>{
    console.log(error)
  })
};

const movieSearch = function(search) {
  axios
    .get(`http://www.omdbapi.com/?apikey=trilogy&t=${search}&type=movie`)
    .then(response => {
      const movie = response.data;
      console.log(`Title: ${movie.Title}`);
      console.log(`Release Year: ${movie.Year}`);
      console.log(`IMDB Rating: ${movie.imdbRating}`);
      movie.Ratings.forEach(rating => {
        if (rating.Source === 'Rotten Tomatoes') {
          console.log(`Rotten Tomatoes Rating: ${rating.Value}`)
        }
      });
      console.log(`Country of Origin: ${movie.Country}`);
      console.log(`Plot: ${movie.Plot}`);
      console.log(`Actors: ${movie.Actors}`);
    })
}

//Bands in town lookup based on artist - displays venue detail to terminal
if(cmd === "concert-this"){
  bandSearch(encodeURI(process.argv.slice(3)))
}

else if (cmd === "spotify-this-song") {
  spotifySearch(process.argv.slice(3))
}

else if (cmd === "movie-this"){
  movieSearch(encodeURI(process.argv.slice(3)))
}

else if (cmd === "do-what-it-says"){
  fs.readFile("random.txt", "utf8", function(error, data) {
    if(error) {
      return console.log(error);
    }
    
    spotifySearch(data.s);
  })
}

