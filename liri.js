require("dotenv").config();
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
// var bandsintown = require('bandsintown')(APP_ID);
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var query = process.argv.slice(3).join(" ");
var text = "random.txt";
var log = "log.txt";
var divide = "--------------------------------------------------------------------"


// console.log(query);
function doSome() {

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
                var dateArr = moment(datetime.dateFormat); // split the date and time in the response
                // console.log(dateArr);

                var concertResults =
                    divide +
                    "\nVenue Name: " + response.data[i].venue.name +
                    "\nVenue Location: " + response.data[i].venue.city +
                    "\nDate of the Event: " + dateArr.format("MM-DD-YYYY"); //dateArr[0] should be the date separated from the time
                console.log(concertResults);
                fs.appendFileSync(log, "\nVenue Name: " + response.data[i].venue.name);
                fs.appendFileSync(log, "\nVenue Location: " + response.data[i].venue.city);
                fs.appendFileSync(log, "\nDate of the Event: " + dateArr.format("MM-DD-YYYY") + "\n" + divide);
            }
        })
        .catch(function (err) {
            console.log(err);
        })
}

function getSong(query) {
    if (!query) {
        query = "The Sign by Ace of Base"; // default song
    }
    // console.log(query);
    spotify.search({ type: 'track', query: query })
        .then(function (response) {
            "--------------------------------------------------------------------"
            // console.log(response.tracks.items[0]);
            var items = response.tracks.items[0];
            console.log("Artist name: " + items.album.artists[0].name);
            fs.appendFileSync(log, "Artist name: " + items.album.artists[0].name + "\n");
            console.log("Song name: " + items.name);
            fs.appendFileSync(log, "Song name: " + items.name + "\n");
            console.log("Album: " + items.album.name);
            fs.appendFileSync(log, "Album: " + items.album.name + "\n");
            console.log("Preview link: " + items.preview_url);
            fs.appendFileSync(log, "Preview link: " + items.preview_url + "\n" + divide);
            "--------------------------------------------------------------------"

        })
        .catch(function (err) {
            console.log(err);
        })
}
function getMovie(query) {
    axios({
        method: "get",
        url: "http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy",
    })
        .then(function (response) {
            //console.log(response.data)

            var movieResults =
                divide +
                "\nMovie Title: " + response.data.Title +
                "\nRelease Year: " + response.data.Year +
                "\nIMDB Rating: " + response.data.imdbRating +
                "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value +
                "\nCountry Production: " + response.data.Country +
                "\nLanguage: " + response.data.Language +
                "\nMovie Plot: " + response.data.Plot +
                "\nActors: " + response.data.Actors
            console.log(movieResults);
            fs.appendFileSync(log, "\nMovie Title: " + response.data.Title);
            fs.appendFileSync(log, "\nRelease Year: " + response.data.Year);
            fs.appendFileSync(log, "\nIMDB Rating: " + response.data.imdbRating);
            fs.appendFileSync(log, "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            fs.appendFileSync(log, "\nCountry Production: " + response.data.Country);
            fs.appendFileSync(log, "\nLanguage: " + response.data.Language);
            fs.appendFileSync(log, "\nMovie Plot: " + response.data.Plot);
            fs.appendFileSync(log, "\nActors: " + response.data.Actors + "\n" + divide)

        })
        .catch(function (err) {
            console.log(err);
        })
}
function doSays() {
    fs.readFile(text, "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        } else {
            // console.log(data);
            var randomArr = data.split(",");
            command = randomArr[0];
            query = randomArr[1];
            doSome();
        }
    })
}

doSome();