require("dotenv").config();
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
// var bandsintown = require('bandsintown')(APP_ID);
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var query = process.argv.slice(3).join("");
var text = "random.txt";


// console.log(query);

switch (command) {
    case "concert-this":
        getBands(query);
        break;
    case "spotify-this-song":
        getSong(query);
        break;
    case "movie-this":
        getMovie(query);
        break;
    case "do-what-it-says":
        doSays();
        break;
    default:
        console.log("Invalid Option. Please type any of the following options: \nconcert-this \nspotify-this-song \nmovie-this \ndo-what-it-says")
        break;
}
function getBands(query) {

    axios({
        method: "get",
        url: "https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp",
    })
        .then(function (response) {
            // console.log(response.data);
            for (var i = 0; i < response.data.length; i++) {
                var datetime = response.data[i].datetime; //Saves datetime response into a variable
                dateFormat = ("");
                var dateArr = moment(datetime.dateFormat); //Attempting to split the date and time in the response
                // console.log(dateArr);

                var concertResults =
                    "--------------------------------------------------------------------" +
                    "\nVenue Name: " + response.data[i].venue.name +
                    "\nVenue Location: " + response.data[i].venue.city +
                    "\nDate of the Event: " + dateArr.format("MM-DD-YYYY"); //dateArr[0] should be the date separated from the time
                console.log(concertResults);
            }
        })
        .catch(function (err) {
            console.log(err);
        })
}

// function getSong(query) {
//     if (query === undefined) {
//         query = "The Sign"; // default song
//     }

// }
function getMovie(query) {
    axios({
        method: "get",
        url: "http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy",
    })
        .then(function (response) {
            // console.log(response)
            for (var i = 0; i < response.data.length; i++) {

                var movieResults =
                    "--------------------------------------------------------------------" +
                    "\nMovie Title: " + response.data[i].title +
                    "\nRelease Year: " + response.data[i].year +
                    "\nIMDB Rating: " + response.data[i].imdbRating +
                    "\nRotten Tomatoes Rating: " + response.data[i].imdbRating +
                    "\nCountry Production: " + response.data[i].country +
                    "\nLanguage: " + response.data[i].language +
                    "\nMovie Plot: " + response.data[i].plot +
                    "\nActors: " + response.data[i].actors
                console.log(movieResults);
            }
        })
        .catch(function (err) {
            console.log(err);
        })
}
// function doSays(query) {
//     fs.readFile(text, "utf8", function (err, data) {
//         if (err) {
//             return console.log(err);
//         }

//     })
// }