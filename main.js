const web = require("./web")
const request = require('request');
var srequest = require('sync-request');
const fs = require('fs');

const maxTime = 24;

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

Date.prototype.getSatTime = function () {

    return "" + this.getUTCFullYear() + "-" + ("0" + (this.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + this.getUTCDate()).slice(-2) + "T" + ("0" + this.getUTCHours()).slice(-2) + ":" + ("0" + this.getUTCMinutes()).slice(-2) + ":" + ("0" + this.getUTCSeconds()).slice(-2) + "Z";
}

function updateTLE() {
    console.log("Updating TLEs")
    request('https://www.celestrak.com/NORAD/elements/active.txt', function (error, response, body) {
        if (error)
            console.log(error)
        var TLES = parseTLE(body)
        fs.writeFileSync("./www/tle.json", JSON.stringify(TLES))
    });
}

function updateStations() {
    console.log("Updating Stations")
    var stations = []
    var done = false;
    var page = 1;
    do {
        var reqStr = "https://network.satnogs.org/api/stations/?page=" + page
        page++
        try {
            var body = srequest("GET", reqStr).getBody()
            var data = JSON.parse(body)
            data.forEach(el => {
                stations.push(el)
            });
        } catch (error) {
            done = true;
        }
    } while (!done);
    fs.writeFileSync("./www/stations.json", JSON.stringify(stations))
}

function updateObservations() {
    console.log("Updating Observations")
    var time = new Date().addHours(-1)
    var nt = new Date().addHours(maxTime)
    var observations = []
    var done = false;
    var page = 1;
    do {
        var reqStr = "https://network.satnogs.org/api/observations?start=" + time.getSatTime() + "&end=" + nt.getSatTime() + "&page=" + page
        page++
        try {
            var body = srequest("GET", reqStr).getBody()
            var data = JSON.parse(body)
            data.forEach(el => {
                observations.push(el)
            });
        } catch (error) {
            done = true;
        }
    } while (!done);
    observations.sort(function(a, b){
        var keyA = Date.parse(a.start),
            keyB = Date.parse(b.start);
        // Compare the 2 dates
        if(keyA < keyB) return -1;
        if(keyA > keyB) return 1;
        return 0;
    });
    fs.writeFileSync("./www/observations.json", JSON.stringify(observations))
}

function parseTLE(data) {
    var lines = data.split("\n")
    var tle = {}
    for (let i = 0; i < lines.length - 1; i += 3) {
        var id = lines[i + 2].split(' ')[1].trim()
        tle[id] = lines[i] + "\n" + lines[i + 1] + "\n" + lines[i + 2]
    }
    return tle
}

updateTLE()
updateStations()
updateObservations()