const TLEJS = require('tle.js');
const tlejs = new TLEJS();

mapboxgl.accessToken = 'pk.eyJ1IjoidGhlc25la3lzbmVrIiwiYSI6ImNqZHc2ZzExcDBpMDQycXM0Nm5nZGNlanMifQ.K9Mxb2Dkl_6cyspBwga1XA';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/thesnekysnek/cjy1l50bh0xg71coetzys6s16'
});

var socket = io();

        var stations = []
        var tle = []
        var observations = []

        var getJSON = function (url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'json';
            xhr.onload = function () {
                var status = xhr.status;
                if (status === 200) {
                    callback(null, xhr.response);
                } else {
                    callback(status, xhr.response);
                }
            };
            xhr.send();
        };
        map.on('load', function () {

            // When a click event occurs on a feature in the places layer, open a popup at the
            // location of the feature, with description HTML from its properties.
            map.on('click', 'points', function (e) {
                var coordinates = e.features[0].geometry.coordinates.slice();
                var description = e.features[0].properties.description;

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(description)
                    .addTo(map);
            });

            // Change the cursor to a pointer when the mouse is over the places layer.
            map.on('mouseenter', 'points', function () {
                map.getCanvas().style.cursor = 'pointer';
            });

            // Change it back to a pointer when it leaves.
            map.on('mouseleave', 'points', function () {
                map.getCanvas().style.cursor = '';
            });



            //Stations
            getJSON('stations.json', function (err, data) {
                stations = data
                var mapS = []
                for (let i = 0; i < stations.length; i++) {
                    const s = stations[i];
                    mapS.push({
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [s.lng, s.lat]
                        },
                        "properties": {
                            "color": "255,0,0",
                            "description": "<strong>" + s.name + "</strong>"
                        }
                    })
                }

                map.addLayer({
                    "id": "points",
                    "type": "symbol",
                    "type": "circle",
                    "paint": {
                        "circle-radius": 4,
                        "circle-color": "#007cbf"
                    },
                    "source": {
                        "type": "geojson",
                        "data": {
                            "type": "FeatureCollection",
                            "features": mapS
                        }
                    }
                });
            });

            //TLE
            getJSON('tle.json', function (err, data) {
                tle = data
            });

            //Observations
            getJSON('observations.json', function (err, data) {
                var sats = []
                observations = data
                for (let i = 0; i < data.length; i++) {
                    const o = data[i];
                    if(sats.includes(o.norad_cat_id)){
                        sats.push(o.norad_cat_id)

                    }
                }
            });
        })

        function showSats() {
            var data = []
            for (let i = 0; i < sats.length; i++) {
                const s = sats[i];
                var loc = tlejs.getLatLon(tle[sats[i]])
                data.push({"type": "Point",
                "coordinates": [
                    loc.lng,
                    loc.lat
                ]})
            }
        }