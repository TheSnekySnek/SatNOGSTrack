(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{"tle.js":20}],2:[function(require,module,exports){
/*!
 * satellite-js v3.0.1
 * (c) 2013 Shashwat Kandadai and UCSC
 * https://github.com/shashwatak/satellite-js
 * License: MIT
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.x2o3 = exports.j3oj2 = exports.j4 = exports.j3 = exports.j2 = exports.tumin = exports.vkmpersec = exports.xke = exports.earthRadius = exports.mu = exports.minutesPerDay = exports.rad2deg = exports.deg2rad = exports.twoPi = exports.pi = void 0;
var pi = Math.PI;
exports.pi = pi;
var twoPi = pi * 2;
exports.twoPi = twoPi;
var deg2rad = pi / 180.0;
exports.deg2rad = deg2rad;
var rad2deg = 180 / pi;
exports.rad2deg = rad2deg;
var minutesPerDay = 1440.0;
exports.minutesPerDay = minutesPerDay;
var mu = 398600.5; // in km3 / s2

exports.mu = mu;
var earthRadius = 6378.137; // in km

exports.earthRadius = earthRadius;
var xke = 60.0 / Math.sqrt(earthRadius * earthRadius * earthRadius / mu);
exports.xke = xke;
var vkmpersec = earthRadius * xke / 60.0;
exports.vkmpersec = vkmpersec;
var tumin = 1.0 / xke;
exports.tumin = tumin;
var j2 = 0.00108262998905;
exports.j2 = j2;
var j3 = -0.00000253215306;
exports.j3 = j3;
var j4 = -0.00000161098761;
exports.j4 = j4;
var j3oj2 = j3 / j2;
exports.j3oj2 = j3oj2;
var x2o3 = 2.0 / 3.0;
exports.x2o3 = x2o3;
},{}],3:[function(require,module,exports){
/*!
 * satellite-js v3.0.1
 * (c) 2013 Shashwat Kandadai and UCSC
 * https://github.com/shashwatak/satellite-js
 * License: MIT
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dopplerFactor;

function dopplerFactor(location, position, velocity) {
  var currentRange = Math.sqrt(Math.pow(position.x - location.x, 2) + Math.pow(position.y - location.y, 2) + Math.pow(position.z - location.z, 2));
  var nextPos = {
    x: position.x + velocity.x,
    y: position.y + velocity.y,
    z: position.z + velocity.z
  };
  var nextRange = Math.sqrt(Math.pow(nextPos.x - location.x, 2) + Math.pow(nextPos.y - location.y, 2) + Math.pow(nextPos.z - location.z, 2));
  var rangeRate = nextRange - currentRange;

  function sign(value) {
    return value >= 0 ? 1 : -1;
  }

  rangeRate *= sign(rangeRate);
  var c = 299792.458; // Speed of light in km/s

  return 1 + rangeRate / c;
}
},{}],4:[function(require,module,exports){
/*!
 * satellite-js v3.0.1
 * (c) 2013 Shashwat Kandadai and UCSC
 * https://github.com/shashwatak/satellite-js
 * License: MIT
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.days2mdhms = days2mdhms;
exports.jday = jday;
exports.invjday = invjday;

/* -----------------------------------------------------------------------------
 *
 *                           procedure days2mdhms
 *
 *  this procedure converts the day of the year, days, to the equivalent month
 *    day, hour, minute and second.
 *
 *  algorithm     : set up array for the number of days per month
 *                  find leap year - use 1900 because 2000 is a leap year
 *                  loop through a temp value while the value is < the days
 *                  perform int conversions to the correct day and month
 *                  convert remainder into h m s using type conversions
 *
 *  author        : david vallado                  719-573-2600    1 mar 2001
 *
 *  inputs          description                    range / units
 *    year        - year                           1900 .. 2100
 *    days        - julian day of the year         0.0  .. 366.0
 *
 *  outputs       :
 *    mon         - month                          1 .. 12
 *    day         - day                            1 .. 28,29,30,31
 *    hr          - hour                           0 .. 23
 *    min         - minute                         0 .. 59
 *    sec         - second                         0.0 .. 59.999
 *
 *  locals        :
 *    dayofyr     - day of year
 *    temp        - temporary extended values
 *    inttemp     - temporary int value
 *    i           - index
 *    lmonth[12]  - int array containing the number of days per month
 *
 *  coupling      :
 *    none.
 * --------------------------------------------------------------------------- */
function days2mdhms(year, days) {
  var lmonth = [31, year % 4 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var dayofyr = Math.floor(days); //  ----------------- find month and day of month ----------------

  var i = 1;
  var inttemp = 0;

  while (dayofyr > inttemp + lmonth[i - 1] && i < 12) {
    inttemp += lmonth[i - 1];
    i += 1;
  }

  var mon = i;
  var day = dayofyr - inttemp; //  ----------------- find hours minutes and seconds -------------

  var temp = (days - dayofyr) * 24.0;
  var hr = Math.floor(temp);
  temp = (temp - hr) * 60.0;
  var minute = Math.floor(temp);
  var sec = (temp - minute) * 60.0;
  return {
    mon: mon,
    day: day,
    hr: hr,
    minute: minute,
    sec: sec
  };
}
/* -----------------------------------------------------------------------------
 *
 *                           procedure jday
 *
 *  this procedure finds the julian date given the year, month, day, and time.
 *    the julian date is defined by each elapsed day since noon, jan 1, 4713 bc.
 *
 *  algorithm     : calculate the answer in one step for efficiency
 *
 *  author        : david vallado                  719-573-2600    1 mar 2001
 *
 *  inputs          description                    range / units
 *    year        - year                           1900 .. 2100
 *    mon         - month                          1 .. 12
 *    day         - day                            1 .. 28,29,30,31
 *    hr          - universal time hour            0 .. 23
 *    min         - universal time min             0 .. 59
 *    sec         - universal time sec             0.0 .. 59.999
 *
 *  outputs       :
 *    jd          - julian date                    days from 4713 bc
 *
 *  locals        :
 *    none.
 *
 *  coupling      :
 *    none.
 *
 *  references    :
 *    vallado       2007, 189, alg 14, ex 3-14
 *
 * --------------------------------------------------------------------------- */


function jdayInternal(year, mon, day, hr, minute, sec) {
  var msec = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
  return 367.0 * year - Math.floor(7 * (year + Math.floor((mon + 9) / 12.0)) * 0.25) + Math.floor(275 * mon / 9.0) + day + 1721013.5 + ((msec / 60000 + sec / 60.0 + minute) / 60.0 + hr) / 24.0 // ut in days
  // # - 0.5*sgn(100.0*year + mon - 190002.5) + 0.5;
  ;
}

function jday(year, mon, day, hr, minute, sec, msec) {
  if (year instanceof Date) {
    var date = year;
    return jdayInternal(date.getUTCFullYear(), date.getUTCMonth() + 1, // Note, this function requires months in range 1-12.
    date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
  }

  return jdayInternal(year, mon, day, hr, minute, sec, msec);
}
/* -----------------------------------------------------------------------------
 *
 *                           procedure invjday
 *
 *  this procedure finds the year, month, day, hour, minute and second
 *  given the julian date. tu can be ut1, tdt, tdb, etc.
 *
 *  algorithm     : set up starting values
 *                  find leap year - use 1900 because 2000 is a leap year
 *                  find the elapsed days through the year in a loop
 *                  call routine to find each individual value
 *
 *  author        : david vallado                  719-573-2600    1 mar 2001
 *
 *  inputs          description                    range / units
 *    jd          - julian date                    days from 4713 bc
 *
 *  outputs       :
 *    year        - year                           1900 .. 2100
 *    mon         - month                          1 .. 12
 *    day         - day                            1 .. 28,29,30,31
 *    hr          - hour                           0 .. 23
 *    min         - minute                         0 .. 59
 *    sec         - second                         0.0 .. 59.999
 *
 *  locals        :
 *    days        - day of year plus fractional
 *                  portion of a day               days
 *    tu          - julian centuries from 0 h
 *                  jan 0, 1900
 *    temp        - temporary double values
 *    leapyrs     - number of leap years from 1900
 *
 *  coupling      :
 *    days2mdhms  - finds month, day, hour, minute and second given days and year
 *
 *  references    :
 *    vallado       2007, 208, alg 22, ex 3-13
 * --------------------------------------------------------------------------- */


function invjday(jd, asArray) {
  // --------------- find year and days of the year -
  var temp = jd - 2415019.5;
  var tu = temp / 365.25;
  var year = 1900 + Math.floor(tu);
  var leapyrs = Math.floor((year - 1901) * 0.25); // optional nudge by 8.64x10-7 sec to get even outputs

  var days = temp - ((year - 1900) * 365.0 + leapyrs) + 0.00000000001; // ------------ check for case of beginning of a year -----------

  if (days < 1.0) {
    year -= 1;
    leapyrs = Math.floor((year - 1901) * 0.25);
    days = temp - ((year - 1900) * 365.0 + leapyrs);
  } // ----------------- find remaing data  -------------------------


  var mdhms = days2mdhms(year, days);
  var mon = mdhms.mon,
      day = mdhms.day,
      hr = mdhms.hr,
      minute = mdhms.minute;
  var sec = mdhms.sec - 0.00000086400;

  if (asArray) {
    return [year, mon, day, hr, minute, Math.floor(sec)];
  }

  return new Date(Date.UTC(year, mon - 1, day, hr, minute, Math.floor(sec)));
}
},{}],5:[function(require,module,exports){
/*!
 * satellite-js v3.0.1
 * (c) 2013 Shashwat Kandadai and UCSC
 * https://github.com/shashwatak/satellite-js
 * License: MIT
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "jday", {
  enumerable: true,
  get: function get() {
    return _ext.jday;
  }
});
Object.defineProperty(exports, "invjday", {
  enumerable: true,
  get: function get() {
    return _ext.invjday;
  }
});
Object.defineProperty(exports, "twoline2satrec", {
  enumerable: true,
  get: function get() {
    return _io.default;
  }
});
Object.defineProperty(exports, "propagate", {
  enumerable: true,
  get: function get() {
    return _propagation.propagate;
  }
});
Object.defineProperty(exports, "sgp4", {
  enumerable: true,
  get: function get() {
    return _propagation.sgp4;
  }
});
Object.defineProperty(exports, "gstime", {
  enumerable: true,
  get: function get() {
    return _propagation.gstime;
  }
});
Object.defineProperty(exports, "dopplerFactor", {
  enumerable: true,
  get: function get() {
    return _dopplerFactor.default;
  }
});
Object.defineProperty(exports, "radiansToDegrees", {
  enumerable: true,
  get: function get() {
    return _transforms.radiansToDegrees;
  }
});
Object.defineProperty(exports, "degreesToRadians", {
  enumerable: true,
  get: function get() {
    return _transforms.degreesToRadians;
  }
});
Object.defineProperty(exports, "degreesLat", {
  enumerable: true,
  get: function get() {
    return _transforms.degreesLat;
  }
});
Object.defineProperty(exports, "degreesLong", {
  enumerable: true,
  get: function get() {
    return _transforms.degreesLong;
  }
});
Object.defineProperty(exports, "radiansLat", {
  enumerable: true,
  get: function get() {
    return _transforms.radiansLat;
  }
});
Object.defineProperty(exports, "radiansLong", {
  enumerable: true,
  get: function get() {
    return _transforms.radiansLong;
  }
});
Object.defineProperty(exports, "geodeticToEcf", {
  enumerable: true,
  get: function get() {
    return _transforms.geodeticToEcf;
  }
});
Object.defineProperty(exports, "eciToGeodetic", {
  enumerable: true,
  get: function get() {
    return _transforms.eciToGeodetic;
  }
});
Object.defineProperty(exports, "eciToEcf", {
  enumerable: true,
  get: function get() {
    return _transforms.eciToEcf;
  }
});
Object.defineProperty(exports, "ecfToEci", {
  enumerable: true,
  get: function get() {
    return _transforms.ecfToEci;
  }
});
Object.defineProperty(exports, "ecfToLookAngles", {
  enumerable: true,
  get: function get() {
    return _transforms.ecfToLookAngles;
  }
});
exports.constants = void 0;

var constants = _interopRequireWildcard(require("./constants"));

exports.constants = constants;

var _ext = require("./ext");

var _io = _interopRequireDefault(require("./io"));

var _propagation = require("./propagation");

var _dopplerFactor = _interopRequireDefault(require("./dopplerFactor"));

var _transforms = require("./transforms");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }
},{"./constants":2,"./dopplerFactor":3,"./ext":4,"./io":6,"./propagation":7,"./transforms":17}],6:[function(require,module,exports){
/*!
 * satellite-js v3.0.1
 * (c) 2013 Shashwat Kandadai and UCSC
 * https://github.com/shashwatak/satellite-js
 * License: MIT
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = twoline2satrec;

var _constants = require("./constants");

var _ext = require("./ext");

var _sgp4init = _interopRequireDefault(require("./propagation/sgp4init"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* -----------------------------------------------------------------------------
 *
 *                           function twoline2rv
 *
 *  this function converts the two line element set character string data to
 *    variables and initializes the sgp4 variables. several intermediate varaibles
 *    and quantities are determined. note that the result is a structure so multiple
 *    satellites can be processed simultaneously without having to reinitialize. the
 *    verification mode is an important option that permits quick checks of any
 *    changes to the underlying technical theory. this option works using a
 *    modified tle file in which the start, stop, and delta time values are
 *    included at the end of the second line of data. this only works with the
 *    verification mode. the catalog mode simply propagates from -1440 to 1440 min
 *    from epoch and is useful when performing entire catalog runs.
 *
 *  author        : david vallado                  719-573-2600    1 mar 2001
 *
 *  inputs        :
 *    longstr1    - first line of the tle
 *    longstr2    - second line of the tle
 *    typerun     - type of run                    verification 'v', catalog 'c',
 *                                                 manual 'm'
 *    typeinput   - type of manual input           mfe 'm', epoch 'e', dayofyr 'd'
 *    opsmode     - mode of operation afspc or improved 'a', 'i'
 *    whichconst  - which set of constants to use  72, 84
 *
 *  outputs       :
 *    satrec      - structure containing all the sgp4 satellite information
 *
 *  coupling      :
 *    getgravconst-
 *    days2mdhms  - conversion of days to month, day, hour, minute, second
 *    jday        - convert day month year hour minute second into julian date
 *    sgp4init    - initialize the sgp4 variables
 *
 *  references    :
 *    norad spacetrack report #3
 *    vallado, crawford, hujsak, kelso  2006
 --------------------------------------------------------------------------- */

/**
 * Return a Satellite imported from two lines of TLE data.
 *
 * Provide the two TLE lines as strings `longstr1` and `longstr2`,
 * and select which standard set of gravitational constants you want
 * by providing `gravity_constants`:
 *
 * `sgp4.propagation.wgs72` - Standard WGS 72 model
 * `sgp4.propagation.wgs84` - More recent WGS 84 model
 * `sgp4.propagation.wgs72old` - Legacy support for old SGP4 behavior
 *
 * Normally, computations are made using letious recent improvements
 * to the algorithm.  If you want to turn some of these off and go
 * back into "afspc" mode, then set `afspc_mode` to `True`.
 */
function twoline2satrec(longstr1, longstr2) {
  var opsmode = 'i';
  var xpdotp = 1440.0 / (2.0 * _constants.pi); // 229.1831180523293;

  var year = 0;
  var satrec = {};
  satrec.error = 0;
  satrec.satnum = longstr1.substring(2, 7);
  satrec.epochyr = parseInt(longstr1.substring(18, 20), 10);
  satrec.epochdays = parseFloat(longstr1.substring(20, 32));
  satrec.ndot = parseFloat(longstr1.substring(33, 43));
  satrec.nddot = parseFloat(".".concat(parseInt(longstr1.substring(44, 50), 10), "E").concat(longstr1.substring(50, 52)));
  satrec.bstar = parseFloat("".concat(longstr1.substring(53, 54), ".").concat(parseInt(longstr1.substring(54, 59), 10), "E").concat(longstr1.substring(59, 61))); // satrec.satnum = longstr2.substring(2, 7);

  satrec.inclo = parseFloat(longstr2.substring(8, 16));
  satrec.nodeo = parseFloat(longstr2.substring(17, 25));
  satrec.ecco = parseFloat(".".concat(longstr2.substring(26, 33)));
  satrec.argpo = parseFloat(longstr2.substring(34, 42));
  satrec.mo = parseFloat(longstr2.substring(43, 51));
  satrec.no = parseFloat(longstr2.substring(52, 63)); // ---- find no, ndot, nddot ----

  satrec.no /= xpdotp; //   rad/min
  // satrec.nddot= satrec.nddot * Math.pow(10.0, nexp);
  // satrec.bstar= satrec.bstar * Math.pow(10.0, ibexp);
  // ---- convert to sgp4 units ----

  satrec.a = Math.pow(satrec.no * _constants.tumin, -2.0 / 3.0);
  satrec.ndot /= xpdotp * 1440.0; // ? * minperday

  satrec.nddot /= xpdotp * 1440.0 * 1440; // ---- find standard orbital elements ----

  satrec.inclo *= _constants.deg2rad;
  satrec.nodeo *= _constants.deg2rad;
  satrec.argpo *= _constants.deg2rad;
  satrec.mo *= _constants.deg2rad;
  satrec.alta = satrec.a * (1.0 + satrec.ecco) - 1.0;
  satrec.altp = satrec.a * (1.0 - satrec.ecco) - 1.0; // ----------------------------------------------------------------
  // find sgp4epoch time of element set
  // remember that sgp4 uses units of days from 0 jan 1950 (sgp4epoch)
  // and minutes from the epoch (time)
  // ----------------------------------------------------------------
  // ---------------- temp fix for years from 1957-2056 -------------------
  // --------- correct fix will occur when year is 4-digit in tle ---------

  if (satrec.epochyr < 57) {
    year = satrec.epochyr + 2000;
  } else {
    year = satrec.epochyr + 1900;
  }

  var mdhmsResult = (0, _ext.days2mdhms)(year, satrec.epochdays);
  var mon = mdhmsResult.mon,
      day = mdhmsResult.day,
      hr = mdhmsResult.hr,
      minute = mdhmsResult.minute,
      sec = mdhmsResult.sec;
  satrec.jdsatepoch = (0, _ext.jday)(year, mon, day, hr, minute, sec); //  ---------------- initialize the orbit at sgp4epoch -------------------

  (0, _sgp4init.default)(satrec, {
    opsmode: opsmode,
    satn: satrec.satnum,
    epoch: satrec.jdsatepoch - 2433281.5,
    xbstar: satrec.bstar,
    xecco: satrec.ecco,
    xargpo: satrec.argpo,
    xinclo: satrec.inclo,
    xmo: satrec.mo,
    xno: satrec.no,
    xnodeo: satrec.nodeo
  });
  return satrec;
}
},{"./constants":2,"./ext":4,"./propagation/sgp4init":16}],7:[function(require,module,exports){
/*!
 * satellite-js v3.0.1
 * (c) 2013 Shashwat Kandadai and UCSC
 * https://github.com/shashwatak/satellite-js
 * License: MIT
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "propagate", {
  enumerable: true,
  get: function get() {
    return _propagate.default;
  }
});
Object.defineProperty(exports, "sgp4", {
  enumerable: true,
  get: function get() {
    return _sgp.default;
  }
});
Object.defineProperty(exports, "gstime", {
  enumerable: true,
  get: function get() {
    return _gstime.default;
  }
});

var _propagate = _interopRequireDefault(require("./propagation/propagate"));

var _sgp = _interopRequireDefault(require("./propagation/sgp4"));

var _gstime = _interopRequireDefault(require("./propagation/gstime"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./propagation/gstime":12,"./propagation/propagate":14,"./propagation/sgp4":15}],8:[function(require,module,exports){
/*!
 * satellite-js v3.0.1
 * (c) 2013 Shashwat Kandadai and UCSC
 * https://github.com/shashwatak/satellite-js
 * License: MIT
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dpper;

var _constants = require("../constants");

/* -----------------------------------------------------------------------------
 *
 *                           procedure dpper
 *
 *  this procedure provides deep space long period periodic contributions
 *    to the mean elements.  by design, these periodics are zero at epoch.
 *    this used to be dscom which included initialization, but it's really a
 *    recurring function.
 *
 *  author        : david vallado                  719-573-2600   28 jun 2005
 *
 *  inputs        :
 *    e3          -
 *    ee2         -
 *    peo         -
 *    pgho        -
 *    pho         -
 *    pinco       -
 *    plo         -
 *    se2 , se3 , sgh2, sgh3, sgh4, sh2, sh3, si2, si3, sl2, sl3, sl4 -
 *    t           -
 *    xh2, xh3, xi2, xi3, xl2, xl3, xl4 -
 *    zmol        -
 *    zmos        -
 *    ep          - eccentricity                           0.0 - 1.0
 *    inclo       - inclination - needed for lyddane modification
 *    nodep       - right ascension of ascending node
 *    argpp       - argument of perigee
 *    mp          - mean anomaly
 *
 *  outputs       :
 *    ep          - eccentricity                           0.0 - 1.0
 *    inclp       - inclination
 *    nodep        - right ascension of ascending node
 *    argpp       - argument of perigee
 *    mp          - mean anomaly
 *
 *  locals        :
 *    alfdp       -
 *    betdp       -
 *    cosip  , sinip  , cosop  , sinop  ,
 *    dalf        -
 *    dbet        -
 *    dls         -
 *    f2, f3      -
 *    pe          -
 *    pgh         -
 *    ph          -
 *    pinc        -
 *    pl          -
 *    sel   , ses   , sghl  , sghs  , shl   , shs   , sil   , sinzf , sis   ,
 *    sll   , sls
 *    xls         -
 *    xnoh        -
 *    zf          -
 *    zm          -
 *
 *  coupling      :
 *    none.
 *
 *  references    :
 *    hoots, roehrich, norad spacetrack report #3 1980
 *    hoots, norad spacetrack report #6 1986
 *    hoots, schumacher and glover 2004
 *    vallado, crawford, hujsak, kelso  2006
 ----------------------------------------------------------------------------*/
function dpper(satrec, options) {
  var e3 = satrec.e3,
      ee2 = satrec.ee2,
      peo = satrec.peo,
      pgho = satrec.pgho,
      pho = satrec.pho,
      pinco = satrec.pinco,
      plo = satrec.plo,
      se2 = satrec.se2,
      se3 = satrec.se3,
      sgh2 = satrec.sgh2,
      sgh3 = satrec.sgh3,
      sgh4 = satrec.sgh4,
      sh2 = satrec.sh2,
      sh3 = satrec.sh3,
      si2 = satrec.si2,
      si3 = satrec.si3,
      sl2 = satrec.sl2,
      sl3 = satrec.sl3,
      sl4 = satrec.sl4,
      t = satrec.t,
      xgh2 = satrec.xgh2,
      xgh3 = satrec.xgh3,
      xgh4 = satrec.xgh4,
      xh2 = satrec.xh2,
      xh3 = satrec.xh3,
      xi2 = satrec.xi2,
      xi3 = satrec.xi3,
      xl2 = satrec.xl2,
      xl3 = satrec.xl3,
      xl4 = satrec.xl4,
      zmol = satrec.zmol,
      zmos = satrec.zmos;
  var init = options.init,
      opsmode = options.opsmode;
  var ep = options.ep,
      inclp = options.inclp,
      nodep = options.nodep,
      argpp = options.argpp,
      mp = options.mp; // Copy satellite attributes into local variables for convenience
  // and symmetry in writing formulae.

  var alfdp;
  var betdp;
  var cosip;
  var sinip;
  var cosop;
  var sinop;
  var dalf;
  var dbet;
  var dls;
  var f2;
  var f3;
  var pe;
  var pgh;
  var ph;
  var pinc;
  var pl;
  var sinzf;
  var xls;
  var xnoh;
  var zf;
  var zm; //  ---------------------- constants -----------------------------

  var zns = 1.19459e-5;
  var zes = 0.01675;
  var znl = 1.5835218e-4;
  var zel = 0.05490; //  --------------- calculate time varying periodics -----------

  zm = zmos + zns * t; // be sure that the initial call has time set to zero

  if (init === 'y') {
    zm = zmos;
  }

  zf = zm + 2.0 * zes * Math.sin(zm);
  sinzf = Math.sin(zf);
  f2 = 0.5 * sinzf * sinzf - 0.25;
  f3 = -0.5 * sinzf * Math.cos(zf);
  var ses = se2 * f2 + se3 * f3;
  var sis = si2 * f2 + si3 * f3;
  var sls = sl2 * f2 + sl3 * f3 + sl4 * sinzf;
  var sghs = sgh2 * f2 + sgh3 * f3 + sgh4 * sinzf;
  var shs = sh2 * f2 + sh3 * f3;
  zm = zmol + znl * t;

  if (init === 'y') {
    zm = zmol;
  }

  zf = zm + 2.0 * zel * Math.sin(zm);
  sinzf = Math.sin(zf);
  f2 = 0.5 * sinzf * sinzf - 0.25;
  f3 = -0.5 * sinzf * Math.cos(zf);
  var sel = ee2 * f2 + e3 * f3;
  var sil = xi2 * f2 + xi3 * f3;
  var sll = xl2 * f2 + xl3 * f3 + xl4 * sinzf;
  var sghl = xgh2 * f2 + xgh3 * f3 + xgh4 * sinzf;
  var shll = xh2 * f2 + xh3 * f3;
  pe = ses + sel;
  pinc = sis + sil;
  pl = sls + sll;
  pgh = sghs + sghl;
  ph = shs + shll;

  if (init === 'n') {
    pe -= peo;
    pinc -= pinco;
    pl -= plo;
    pgh -= pgho;
    ph -= pho;
    inclp += pinc;
    ep += pe;
    sinip = Math.sin(inclp);
    cosip = Math.cos(inclp);
    /* ----------------- apply periodics directly ------------ */
    // sgp4fix for lyddane choice
    // strn3 used original inclination - this is technically feasible
    // gsfc used perturbed inclination - also technically feasible
    // probably best to readjust the 0.2 limit value and limit discontinuity
    // 0.2 rad = 11.45916 deg
    // use next line for original strn3 approach and original inclination
    // if (inclo >= 0.2)
    // use next line for gsfc version and perturbed inclination

    if (inclp >= 0.2) {
      ph /= sinip;
      pgh -= cosip * ph;
      argpp += pgh;
      nodep += ph;
      mp += pl;
    } else {
      //  ---- apply periodics with lyddane modification ----
      sinop = Math.sin(nodep);
      cosop = Math.cos(nodep);
      alfdp = sinip * sinop;
      betdp = sinip * cosop;
      dalf = ph * cosop + pinc * cosip * sinop;
      dbet = -ph * sinop + pinc * cosip * cosop;
      alfdp += dalf;
      betdp += dbet;
      nodep %= _constants.twoPi; //  sgp4fix for afspc written intrinsic functions
      //  nodep used without a trigonometric function ahead

      if (nodep < 0.0 && opsmode === 'a') {
        nodep += _constants.twoPi;
      }

      xls = mp + argpp + cosip * nodep;
      dls = pl + pgh - pinc * nodep * sinip;
      xls += dls;
      xnoh = nodep;
      nodep = Math.atan2(alfdp, betdp); //  sgp4fix for afspc written intrinsic functions
      //  nodep used without a trigonometric function ahead

      if (nodep < 0.0 && opsmode === 'a') {
        nodep += _constants.twoPi;
      }

      if (Math.abs(xnoh - nodep) > _constants.pi) {
        if (nodep < xnoh) {
          nodep += _constants.twoPi;
        } else {
          nodep -= _constants.twoPi;
        }
      }

      mp += pl;
      argpp = xls - mp - cosip * nodep;
    }
  }

  return {
    ep: ep,
    inclp: inclp,
    nodep: nodep,
    argpp: argpp,
    mp: mp
  };
}
},{"../constants":2}],9:[function(require,module,exports){
/*!
 * satellite-js v3.0.1
 * (c) 2013 Shashwat Kandadai and UCSC
 * https://github.com/shashwatak/satellite-js
 * License: MIT
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dscom;

var _constants = require("../constants");

/*-----------------------------------------------------------------------------
 *
 *                           procedure dscom
 *
 *  this procedure provides deep space common items used by both the secular
 *    and periodics subroutines.  input is provided as shown. this routine
 *    used to be called dpper, but the functions inside weren't well organized.
 *
 *  author        : david vallado                  719-573-2600   28 jun 2005
 *
 *  inputs        :
 *    epoch       -
 *    ep          - eccentricity
 *    argpp       - argument of perigee
 *    tc          -
 *    inclp       - inclination
 *    nodep       - right ascension of ascending node
 *    np          - mean motion
 *
 *  outputs       :
 *    sinim  , cosim  , sinomm , cosomm , snodm  , cnodm
 *    day         -
 *    e3          -
 *    ee2         -
 *    em          - eccentricity
 *    emsq        - eccentricity squared
 *    gam         -
 *    peo         -
 *    pgho        -
 *    pho         -
 *    pinco       -
 *    plo         -
 *    rtemsq      -
 *    se2, se3         -
 *    sgh2, sgh3, sgh4        -
 *    sh2, sh3, si2, si3, sl2, sl3, sl4         -
 *    s1, s2, s3, s4, s5, s6, s7          -
 *    ss1, ss2, ss3, ss4, ss5, ss6, ss7, sz1, sz2, sz3         -
 *    sz11, sz12, sz13, sz21, sz22, sz23, sz31, sz32, sz33        -
 *    xgh2, xgh3, xgh4, xh2, xh3, xi2, xi3, xl2, xl3, xl4         -
 *    nm          - mean motion
 *    z1, z2, z3, z11, z12, z13, z21, z22, z23, z31, z32, z33         -
 *    zmol        -
 *    zmos        -
 *
 *  locals        :
 *    a1, a2, a3, a4, a5, a6, a7, a8, a9, a10         -
 *    betasq      -
 *    cc          -
 *    ctem, stem        -
 *    x1, x2, x3, x4, x5, x6, x7, x8          -
 *    xnodce      -
 *    xnoi        -
 *    zcosg  , zsing  , zcosgl , zsingl , zcosh  , zsinh  , zcoshl , zsinhl ,
 *    zcosi  , zsini  , zcosil , zsinil ,
 *    zx          -
 *    zy          -
 *
 *  coupling      :
 *    none.
 *
 *  references    :
 *    hoots, roehrich, norad spacetrack report #3 1980
 *    hoots, norad spacetrack report #6 1986
 *    hoots, schumacher and glover 2004
 *    vallado, crawford, hujsak, kelso  2006
 ----------------------------------------------------------------------------*/
function dscom(options) {
  var epoch = options.epoch,
      ep = options.ep,
      argpp = options.argpp,
      tc = options.tc,
      inclp = options.inclp,
      nodep = options.nodep,
      np = options.np;
  var a1;
  var a2;
  var a3;
  var a4;
  var a5;
  var a6;
  var a7;
  var a8;
  var a9;
  var a10;
  var cc;
  var x1;
  var x2;
  var x3;
  var x4;
  var x5;
  var x6;
  var x7;
  var x8;
  var zcosg;
  var zsing;
  var zcosh;
  var zsinh;
  var zcosi;
  var zsini;
  var ss1;
  var ss2;
  var ss3;
  var ss4;
  var ss5;
  var ss6;
  var ss7;
  var sz1;
  var sz2;
  var sz3;
  var sz11;
  var sz12;
  var sz13;
  var sz21;
  var sz22;
  var sz23;
  var sz31;
  var sz32;
  var sz33;
  var s1;
  var s2;
  var s3;
  var s4;
  var s5;
  var s6;
  var s7;
  var z1;
  var z2;
  var z3;
  var z11;
  var z12;
  var z13;
  var z21;
  var z22;
  var z23;
  var z31;
  var z32;
  var z33; // -------------------------- constants -------------------------

  var zes = 0.01675;
  var zel = 0.05490;
  var c1ss = 2.9864797e-6;
  var c1l = 4.7968065e-7;
  var zsinis = 0.39785416;
  var zcosis = 0.91744867;
  var zcosgs = 0.1945905;
  var zsings = -0.98088458; //  --------------------- local variables ------------------------

  var nm = np;
  var em = ep;
  var snodm = Math.sin(nodep);
  var cnodm = Math.cos(nodep);
  var sinomm = Math.sin(argpp);
  var cosomm = Math.cos(argpp);
  var sinim = Math.sin(inclp);
  var cosim = Math.cos(inclp);
  var emsq = em * em;
  var betasq = 1.0 - emsq;
  var rtemsq = Math.sqrt(betasq); //  ----------------- initialize lunar solar terms ---------------

  var peo = 0.0;
  var pinco = 0.0;
  var plo = 0.0;
  var pgho = 0.0;
  var pho = 0.0;
  var day = epoch + 18261.5 + tc / 1440.0;
  var xnodce = (4.5236020 - 9.2422029e-4 * day) % _constants.twoPi;
  var stem = Math.sin(xnodce);
  var ctem = Math.cos(xnodce);
  var zcosil = 0.91375164 - 0.03568096 * ctem;
  var zsinil = Math.sqrt(1.0 - zcosil * zcosil);
  var zsinhl = 0.089683511 * stem / zsinil;
  var zcoshl = Math.sqrt(1.0 - zsinhl * zsinhl);
  var gam = 5.8351514 + 0.0019443680 * day;
  var zx = 0.39785416 * stem / zsinil;
  var zy = zcoshl * ctem + 0.91744867 * zsinhl * stem;
  zx = Math.atan2(zx, zy);
  zx += gam - xnodce;
  var zcosgl = Math.cos(zx);
  var zsingl = Math.sin(zx); //  ------------------------- do solar terms ---------------------

  zcosg = zcosgs;
  zsing = zsings;
  zcosi = zcosis;
  zsini = zsinis;
  zcosh = cnodm;
  zsinh = snodm;
  cc = c1ss;
  var xnoi = 1.0 / nm;
  var lsflg = 0;

  while (lsflg < 2) {
    lsflg += 1;
    a1 = zcosg * zcosh + zsing * zcosi * zsinh;
    a3 = -zsing * zcosh + zcosg * zcosi * zsinh;
    a7 = -zcosg * zsinh + zsing * zcosi * zcosh;
    a8 = zsing * zsini;
    a9 = zsing * zsinh + zcosg * zcosi * zcosh;
    a10 = zcosg * zsini;
    a2 = cosim * a7 + sinim * a8;
    a4 = cosim * a9 + sinim * a10;
    a5 = -sinim * a7 + cosim * a8;
    a6 = -sinim * a9 + cosim * a10;
    x1 = a1 * cosomm + a2 * sinomm;
    x2 = a3 * cosomm + a4 * sinomm;
    x3 = -a1 * sinomm + a2 * cosomm;
    x4 = -a3 * sinomm + a4 * cosomm;
    x5 = a5 * sinomm;
    x6 = a6 * sinomm;
    x7 = a5 * cosomm;
    x8 = a6 * cosomm;
    z31 = 12.0 * x1 * x1 - 3.0 * x3 * x3;
    z32 = 24.0 * x1 * x2 - 6.0 * x3 * x4;
    z33 = 12.0 * x2 * x2 - 3.0 * x4 * x4;
    z1 = 3.0 * (a1 * a1 + a2 * a2) + z31 * emsq;
    z2 = 6.0 * (a1 * a3 + a2 * a4) + z32 * emsq;
    z3 = 3.0 * (a3 * a3 + a4 * a4) + z33 * emsq;
    z11 = -6.0 * a1 * a5 + emsq * (-24.0 * x1 * x7 - 6.0 * x3 * x5);
    z12 = -6.0 * (a1 * a6 + a3 * a5) + emsq * (-24.0 * (x2 * x7 + x1 * x8) + -6.0 * (x3 * x6 + x4 * x5));
    z13 = -6.0 * a3 * a6 + emsq * (-24.0 * x2 * x8 - 6.0 * x4 * x6);
    z21 = 6.0 * a2 * a5 + emsq * (24.0 * x1 * x5 - 6.0 * x3 * x7);
    z22 = 6.0 * (a4 * a5 + a2 * a6) + emsq * (24.0 * (x2 * x5 + x1 * x6) - 6.0 * (x4 * x7 + x3 * x8));
    z23 = 6.0 * a4 * a6 + emsq * (24.0 * x2 * x6 - 6.0 * x4 * x8);
    z1 = z1 + z1 + betasq * z31;
    z2 = z2 + z2 + betasq * z32;
    z3 = z3 + z3 + betasq * z33;
    s3 = cc * xnoi;
    s2 = -0.5 * s3 / rtemsq;
    s4 = s3 * rtemsq;
    s1 = -15.0 * em * s4;
    s5 = x1 * x3 + x2 * x4;
    s6 = x2 * x3 + x1 * x4;
    s7 = x2 * x4 - x1 * x3; //  ----------------------- do lunar terms -------------------

    if (lsflg === 1) {
      ss1 = s1;
      ss2 = s2;
      ss3 = s3;
      ss4 = s4;
      ss5 = s5;
      ss6 = s6;
      ss7 = s7;
      sz1 = z1;
      sz2 = z2;
      sz3 = z3;
      sz11 = z11;
      sz12 = z12;
      sz13 = z13;
      sz21 = z21;
      sz22 = z22;
      sz23 = z23;
      sz31 = z31;
      sz32 = z32;
      sz33 = z33;
      zcosg = zcosgl;
      zsing = zsingl;
      zcosi = zcosil;
      zsini = zsinil;
      zcosh = zcoshl * cnodm + zsinhl * snodm;
      zsinh = snodm * zcoshl - cnodm * zsinhl;
      cc = c1l;
    }
  }

  var zmol = (4.7199672 + (0.22997150 * day - gam)) % _constants.twoPi;
  var zmos = (6.2565837 + 0.017201977 * day) % _constants.twoPi; //  ------------------------ do solar terms ----------------------

  var se2 = 2.0 * ss1 * ss6;
  var se3 = 2.0 * ss1 * ss7;
  var si2 = 2.0 * ss2 * sz12;
  var si3 = 2.0 * ss2 * (sz13 - sz11);
  var sl2 = -2.0 * ss3 * sz2;
  var sl3 = -2.0 * ss3 * (sz3 - sz1);
  var sl4 = -2.0 * ss3 * (-21.0 - 9.0 * emsq) * zes;
  var sgh2 = 2.0 * ss4 * sz32;
  var sgh3 = 2.0 * ss4 * (sz33 - sz31);
  var sgh4 = -18.0 * ss4 * zes;
  var sh2 = -2.0 * ss2 * sz22;
  var sh3 = -2.0 * ss2 * (sz23 - sz21); //  ------------------------ do lunar terms ----------------------

  var ee2 = 2.0 * s1 * s6;
  var e3 = 2.0 * s1 * s7;
  var xi2 = 2.0 * s2 * z12;
  var xi3 = 2.0 * s2 * (z13 - z11);
  var xl2 = -2.0 * s3 * z2;
  var xl3 = -2.0 * s3 * (z3 - z1);
  var xl4 = -2.0 * s3 * (-21.0 - 9.0 * emsq) * zel;
  var xgh2 = 2.0 * s4 * z32;
  var xgh3 = 2.0 * s4 * (z33 - z31);
  var xgh4 = -18.0 * s4 * zel;
  var xh2 = -2.0 * s2 * z22;
  var xh3 = -2.0 * s2 * (z23 - z21);
  return {
    snodm: snodm,
    cnodm: cnodm,
    sinim: sinim,
    cosim: cosim,
    sinomm: sinomm,
    cosomm: cosomm,
    day: day,
    e3: e3,
    ee2: ee2,
    em: em,
    emsq: emsq,
    gam: gam,
    peo: peo,
    pgho: pgho,
    pho: pho,
    pinco: pinco,
    plo: plo,
    rtemsq: rtemsq,
    se2: se2,
    se3: se3,
    sgh2: sgh2,
    sgh3: sgh3,
    sgh4: sgh4,
    sh2: sh2,
    sh3: sh3,
    si2: si2,
    si3: si3,
    sl2: sl2,
    sl3: sl3,
    sl4: sl4,
    s1: s1,
    s2: s2,
    s3: s3,
    s4: s4,
    s5: s5,
    s6: s6,
    s7: s7,
    ss1: ss1,
    ss2: ss2,
    ss3: ss3,
    ss4: ss4,
    ss5: ss5,
    ss6: ss6,
    ss7: ss7,
    sz1: sz1,
    sz2: sz2,
    sz3: sz3,
    sz11: sz11,
    sz12: sz12,
    sz13: sz13,
    sz21: sz21,
    sz22: sz22,
    sz23: sz23,
    sz31: sz31,
    sz32: sz32,
    sz33: sz33,
    xgh2: xgh2,
    xgh3: xgh3,
    xgh4: xgh4,
    xh2: xh2,
    xh3: xh3,
    xi2: xi2,
    xi3: xi3,
    xl2: xl2,
    xl3: xl3,
    xl4: xl4,
    nm: nm,
    z1: z1,
    z2: z2,
    z3: z3,
    z11: z11,
    z12: z12,
    z13: z13,
    z21: z21,
    z22: z22,
    z23: z23,
    z31: z31,
    z32: z32,
    z33: z33,
    zmol: zmol,
    zmos: zmos
  };
}
},{"../constants":2}],10:[function(require,module,exports){
/*!
 * satellite-js v3.0.1
 * (c) 2013 Shashwat Kandadai and UCSC
 * https://github.com/shashwatak/satellite-js
 * License: MIT
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dsinit;

var _constants = require("../constants");

/*-----------------------------------------------------------------------------
 *
 *                           procedure dsinit
 *
 *  this procedure provides deep space contributions to mean motion dot due
 *    to geopotential resonance with half day and one day orbits.
 *
 *  author        : david vallado                  719-573-2600   28 jun 2005
 *
 *  inputs        :
 *    cosim, sinim-
 *    emsq        - eccentricity squared
 *    argpo       - argument of perigee
 *    s1, s2, s3, s4, s5      -
 *    ss1, ss2, ss3, ss4, ss5 -
 *    sz1, sz3, sz11, sz13, sz21, sz23, sz31, sz33 -
 *    t           - time
 *    tc          -
 *    gsto        - greenwich sidereal time                   rad
 *    mo          - mean anomaly
 *    mdot        - mean anomaly dot (rate)
 *    no          - mean motion
 *    nodeo       - right ascension of ascending node
 *    nodedot     - right ascension of ascending node dot (rate)
 *    xpidot      -
 *    z1, z3, z11, z13, z21, z23, z31, z33 -
 *    eccm        - eccentricity
 *    argpm       - argument of perigee
 *    inclm       - inclination
 *    mm          - mean anomaly
 *    xn          - mean motion
 *    nodem       - right ascension of ascending node
 *
 *  outputs       :
 *    em          - eccentricity
 *    argpm       - argument of perigee
 *    inclm       - inclination
 *    mm          - mean anomaly
 *    nm          - mean motion
 *    nodem       - right ascension of ascending node
 *    irez        - flag for resonance           0-none, 1-one day, 2-half day
 *    atime       -
 *    d2201, d2211, d3210, d3222, d4410, d4422, d5220, d5232, d5421, d5433    -
 *    dedt        -
 *    didt        -
 *    dmdt        -
 *    dndt        -
 *    dnodt       -
 *    domdt       -
 *    del1, del2, del3        -
 *    ses  , sghl , sghs , sgs  , shl  , shs  , sis  , sls
 *    theta       -
 *    xfact       -
 *    xlamo       -
 *    xli         -
 *    xni
 *
 *  locals        :
 *    ainv2       -
 *    aonv        -
 *    cosisq      -
 *    eoc         -
 *    f220, f221, f311, f321, f322, f330, f441, f442, f522, f523, f542, f543  -
 *    g200, g201, g211, g300, g310, g322, g410, g422, g520, g521, g532, g533  -
 *    sini2       -
 *    temp        -
 *    temp1       -
 *    theta       -
 *    xno2        -
 *
 *  coupling      :
 *    getgravconst
 *
 *  references    :
 *    hoots, roehrich, norad spacetrack report #3 1980
 *    hoots, norad spacetrack report #6 1986
 *    hoots, schumacher and glover 2004
 *    vallado, crawford, hujsak, kelso  2006
 ----------------------------------------------------------------------------*/
function dsinit(options) {
  var cosim = options.cosim,
      argpo = options.argpo,
      s1 = options.s1,
      s2 = options.s2,
      s3 = options.s3,
      s4 = options.s4,
      s5 = options.s5,
      sinim = options.sinim,
      ss1 = options.ss1,
      ss2 = options.ss2,
      ss3 = options.ss3,
      ss4 = options.ss4,
      ss5 = options.ss5,
      sz1 = options.sz1,
      sz3 = options.sz3,
      sz11 = options.sz11,
      sz13 = options.sz13,
      sz21 = options.sz21,
      sz23 = options.sz23,
      sz31 = options.sz31,
      sz33 = options.sz33,
      t = options.t,
      tc = options.tc,
      gsto = options.gsto,
      mo = options.mo,
      mdot = options.mdot,
      no = options.no,
      nodeo = options.nodeo,
      nodedot = options.nodedot,
      xpidot = options.xpidot,
      z1 = options.z1,
      z3 = options.z3,
      z11 = options.z11,
      z13 = options.z13,
      z21 = options.z21,
      z23 = options.z23,
      z31 = options.z31,
      z33 = options.z33,
      ecco = options.ecco,
      eccsq = options.eccsq;
  var emsq = options.emsq,
      em = options.em,
      argpm = options.argpm,
      inclm = options.inclm,
      mm = options.mm,
      nm = options.nm,
      nodem = options.nodem,
      irez = options.irez,
      atime = options.atime,
      d2201 = options.d2201,
      d2211 = options.d2211,
      d3210 = options.d3210,
      d3222 = options.d3222,
      d4410 = options.d4410,
      d4422 = options.d4422,
      d5220 = options.d5220,
      d5232 = options.d5232,
      d5421 = options.d5421,
      d5433 = options.d5433,
      dedt = options.dedt,
      didt = options.didt,
      dmdt = options.dmdt,
      dnodt = options.dnodt,
      domdt = options.domdt,
      del1 = options.del1,
      del2 = options.del2,
      del3 = options.del3,
      xfact = options.xfact,
      xlamo = options.xlamo,
      xli = options.xli,
      xni = options.xni;
  var f220;
  var f221;
  var f311;
  var f321;
  var f322;
  var f330;
  var f441;
  var f442;
  var f522;
  var f523;
  var f542;
  var f543;
  var g200;
  var g201;
  var g211;
  var g300;
  var g310;
  var g322;
  var g410;
  var g422;
  var g520;
  var g521;
  var g532;
  var g533;
  var sini2;
  var temp;
  var temp1;
  var xno2;
  var ainv2;
  var aonv;
  var cosisq;
  var eoc;
  var q22 = 1.7891679e-6;
  var q31 = 2.1460748e-6;
  var q33 = 2.2123015e-7;
  var root22 = 1.7891679e-6;
  var root44 = 7.3636953e-9;
  var root54 = 2.1765803e-9;
  var rptim = 4.37526908801129966e-3; // equates to 7.29211514668855e-5 rad/sec

  var root32 = 3.7393792e-7;
  var root52 = 1.1428639e-7;
  var znl = 1.5835218e-4;
  var zns = 1.19459e-5; // -------------------- deep space initialization ------------

  irez = 0;

  if (nm < 0.0052359877 && nm > 0.0034906585) {
    irez = 1;
  }

  if (nm >= 8.26e-3 && nm <= 9.24e-3 && em >= 0.5) {
    irez = 2;
  } // ------------------------ do solar terms -------------------


  var ses = ss1 * zns * ss5;
  var sis = ss2 * zns * (sz11 + sz13);
  var sls = -zns * ss3 * (sz1 + sz3 - 14.0 - 6.0 * emsq);
  var sghs = ss4 * zns * (sz31 + sz33 - 6.0);
  var shs = -zns * ss2 * (sz21 + sz23); // sgp4fix for 180 deg incl

  if (inclm < 5.2359877e-2 || inclm > _constants.pi - 5.2359877e-2) {
    shs = 0.0;
  }

  if (sinim !== 0.0) {
    shs /= sinim;
  }

  var sgs = sghs - cosim * shs; // ------------------------- do lunar terms ------------------

  dedt = ses + s1 * znl * s5;
  didt = sis + s2 * znl * (z11 + z13);
  dmdt = sls - znl * s3 * (z1 + z3 - 14.0 - 6.0 * emsq);
  var sghl = s4 * znl * (z31 + z33 - 6.0);
  var shll = -znl * s2 * (z21 + z23); // sgp4fix for 180 deg incl

  if (inclm < 5.2359877e-2 || inclm > _constants.pi - 5.2359877e-2) {
    shll = 0.0;
  }

  domdt = sgs + sghl;
  dnodt = shs;

  if (sinim !== 0.0) {
    domdt -= cosim / sinim * shll;
    dnodt += shll / sinim;
  } // ----------- calculate deep space resonance effects --------


  var dndt = 0.0;
  var theta = (gsto + tc * rptim) % _constants.twoPi;
  em += dedt * t;
  inclm += didt * t;
  argpm += domdt * t;
  nodem += dnodt * t;
  mm += dmdt * t; // sgp4fix for negative inclinations
  // the following if statement should be commented out
  // if (inclm < 0.0)
  // {
  //   inclm  = -inclm;
  //   argpm  = argpm - pi;
  //   nodem = nodem + pi;
  // }
  // -------------- initialize the resonance terms -------------

  if (irez !== 0) {
    aonv = Math.pow(nm / _constants.xke, _constants.x2o3); // ---------- geopotential resonance for 12 hour orbits ------

    if (irez === 2) {
      cosisq = cosim * cosim;
      var emo = em;
      em = ecco;
      var emsqo = emsq;
      emsq = eccsq;
      eoc = em * emsq;
      g201 = -0.306 - (em - 0.64) * 0.440;

      if (em <= 0.65) {
        g211 = 3.616 - 13.2470 * em + 16.2900 * emsq;
        g310 = -19.302 + 117.3900 * em - 228.4190 * emsq + 156.5910 * eoc;
        g322 = -18.9068 + 109.7927 * em - 214.6334 * emsq + 146.5816 * eoc;
        g410 = -41.122 + 242.6940 * em - 471.0940 * emsq + 313.9530 * eoc;
        g422 = -146.407 + 841.8800 * em - 1629.014 * emsq + 1083.4350 * eoc;
        g520 = -532.114 + 3017.977 * em - 5740.032 * emsq + 3708.2760 * eoc;
      } else {
        g211 = -72.099 + 331.819 * em - 508.738 * emsq + 266.724 * eoc;
        g310 = -346.844 + 1582.851 * em - 2415.925 * emsq + 1246.113 * eoc;
        g322 = -342.585 + 1554.908 * em - 2366.899 * emsq + 1215.972 * eoc;
        g410 = -1052.797 + 4758.686 * em - 7193.992 * emsq + 3651.957 * eoc;
        g422 = -3581.690 + 16178.110 * em - 24462.770 * emsq + 12422.520 * eoc;

        if (em > 0.715) {
          g520 = -5149.66 + 29936.92 * em - 54087.36 * emsq + 31324.56 * eoc;
        } else {
          g520 = 1464.74 - 4664.75 * em + 3763.64 * emsq;
        }
      }

      if (em < 0.7) {
        g533 = -919.22770 + 4988.6100 * em - 9064.7700 * emsq + 5542.21 * eoc;
        g521 = -822.71072 + 4568.6173 * em - 8491.4146 * emsq + 5337.524 * eoc;
        g532 = -853.66600 + 4690.2500 * em - 8624.7700 * emsq + 5341.4 * eoc;
      } else {
        g533 = -37995.780 + 161616.52 * em - 229838.20 * emsq + 109377.94 * eoc;
        g521 = -51752.104 + 218913.95 * em - 309468.16 * emsq + 146349.42 * eoc;
        g532 = -40023.880 + 170470.89 * em - 242699.48 * emsq + 115605.82 * eoc;
      }

      sini2 = sinim * sinim;
      f220 = 0.75 * (1.0 + 2.0 * cosim + cosisq);
      f221 = 1.5 * sini2;
      f321 = 1.875 * sinim * (1.0 - 2.0 * cosim - 3.0 * cosisq);
      f322 = -1.875 * sinim * (1.0 + 2.0 * cosim - 3.0 * cosisq);
      f441 = 35.0 * sini2 * f220;
      f442 = 39.3750 * sini2 * sini2;
      f522 = 9.84375 * sinim * (sini2 * (1.0 - 2.0 * cosim - 5.0 * cosisq) + 0.33333333 * (-2.0 + 4.0 * cosim + 6.0 * cosisq));
      f523 = sinim * (4.92187512 * sini2 * (-2.0 - 4.0 * cosim + 10.0 * cosisq) + 6.56250012 * (1.0 + 2.0 * cosim - 3.0 * cosisq));
      f542 = 29.53125 * sinim * (2.0 - 8.0 * cosim + cosisq * (-12.0 + 8.0 * cosim + 10.0 * cosisq));
      f543 = 29.53125 * sinim * (-2.0 - 8.0 * cosim + cosisq * (12.0 + 8.0 * cosim - 10.0 * cosisq));
      xno2 = nm * nm;
      ainv2 = aonv * aonv;
      temp1 = 3.0 * xno2 * ainv2;
      temp = temp1 * root22;
      d2201 = temp * f220 * g201;
      d2211 = temp * f221 * g211;
      temp1 *= aonv;
      temp = temp1 * root32;
      d3210 = temp * f321 * g310;
      d3222 = temp * f322 * g322;
      temp1 *= aonv;
      temp = 2.0 * temp1 * root44;
      d4410 = temp * f441 * g410;
      d4422 = temp * f442 * g422;
      temp1 *= aonv;
      temp = temp1 * root52;
      d5220 = temp * f522 * g520;
      d5232 = temp * f523 * g532;
      temp = 2.0 * temp1 * root54;
      d5421 = temp * f542 * g521;
      d5433 = temp * f543 * g533;
      xlamo = (mo + nodeo + nodeo - (theta + theta)) % _constants.twoPi;
      xfact = mdot + dmdt + 2.0 * (nodedot + dnodt - rptim) - no;
      em = emo;
      emsq = emsqo;
    } //  ---------------- synchronous resonance terms --------------


    if (irez === 1) {
      g200 = 1.0 + emsq * (-2.5 + 0.8125 * emsq);
      g310 = 1.0 + 2.0 * emsq;
      g300 = 1.0 + emsq * (-6.0 + 6.60937 * emsq);
      f220 = 0.75 * (1.0 + cosim) * (1.0 + cosim);
      f311 = 0.9375 * sinim * sinim * (1.0 + 3.0 * cosim) - 0.75 * (1.0 + cosim);
      f330 = 1.0 + cosim;
      f330 *= 1.875 * f330 * f330;
      del1 = 3.0 * nm * nm * aonv * aonv;
      del2 = 2.0 * del1 * f220 * g200 * q22;
      del3 = 3.0 * del1 * f330 * g300 * q33 * aonv;
      del1 = del1 * f311 * g310 * q31 * aonv;
      xlamo = (mo + nodeo + argpo - theta) % _constants.twoPi;
      xfact = mdot + xpidot + dmdt + domdt + dnodt - (no + rptim);
    } //  ------------ for sgp4, initialize the integrator ----------


    xli = xlamo;
    xni = no;
    atime = 0.0;
    nm = no + dndt;
  }

  return {
    em: em,
    argpm: argpm,
    inclm: inclm,
    mm: mm,
    nm: nm,
    nodem: nodem,
    irez: irez,
    atime: atime,
    d2201: d2201,
    d2211: d2211,
    d3210: d3210,
    d3222: d3222,
    d4410: d4410,
    d4422: d4422,
    d5220: d5220,
    d5232: d5232,
    d5421: d5421,
    d5433: d5433,
    dedt: dedt,
    didt: didt,
    dmdt: dmdt,
    dndt: dndt,
    dnodt: dnodt,
    domdt: domdt,
    del1: del1,
    del2: del2,
    del3: del3,
    xfact: xfact,
    xlamo: xlamo,
    xli: xli,
    xni: xni
  };
}
},{"../constants":2}],11:[function(require,module,exports){
/*!
 * satellite-js v3.0.1
 * (c) 2013 Shashwat Kandadai and UCSC
 * https://github.com/shashwatak/satellite-js
 * License: MIT
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dspace;

var _constants = require("../constants");

/*-----------------------------------------------------------------------------
 *
 *                           procedure dspace
 *
 *  this procedure provides deep space contributions to mean elements for
 *    perturbing third body.  these effects have been averaged over one
 *    revolution of the sun and moon.  for earth resonance effects, the
 *    effects have been averaged over no revolutions of the satellite.
 *    (mean motion)
 *
 *  author        : david vallado                  719-573-2600   28 jun 2005
 *
 *  inputs        :
 *    d2201, d2211, d3210, d3222, d4410, d4422, d5220, d5232, d5421, d5433 -
 *    dedt        -
 *    del1, del2, del3  -
 *    didt        -
 *    dmdt        -
 *    dnodt       -
 *    domdt       -
 *    irez        - flag for resonance           0-none, 1-one day, 2-half day
 *    argpo       - argument of perigee
 *    argpdot     - argument of perigee dot (rate)
 *    t           - time
 *    tc          -
 *    gsto        - gst
 *    xfact       -
 *    xlamo       -
 *    no          - mean motion
 *    atime       -
 *    em          - eccentricity
 *    ft          -
 *    argpm       - argument of perigee
 *    inclm       - inclination
 *    xli         -
 *    mm          - mean anomaly
 *    xni         - mean motion
 *    nodem       - right ascension of ascending node
 *
 *  outputs       :
 *    atime       -
 *    em          - eccentricity
 *    argpm       - argument of perigee
 *    inclm       - inclination
 *    xli         -
 *    mm          - mean anomaly
 *    xni         -
 *    nodem       - right ascension of ascending node
 *    dndt        -
 *    nm          - mean motion
 *
 *  locals        :
 *    delt        -
 *    ft          -
 *    theta       -
 *    x2li        -
 *    x2omi       -
 *    xl          -
 *    xldot       -
 *    xnddt       -
 *    xndt        -
 *    xomi        -
 *
 *  coupling      :
 *    none        -
 *
 *  references    :
 *    hoots, roehrich, norad spacetrack report #3 1980
 *    hoots, norad spacetrack report #6 1986
 *    hoots, schumacher and glover 2004
 *    vallado, crawford, hujsak, kelso  2006
 ----------------------------------------------------------------------------*/
function dspace(options) {
  var irez = options.irez,
      d2201 = options.d2201,
      d2211 = options.d2211,
      d3210 = options.d3210,
      d3222 = options.d3222,
      d4410 = options.d4410,
      d4422 = options.d4422,
      d5220 = options.d5220,
      d5232 = options.d5232,
      d5421 = options.d5421,
      d5433 = options.d5433,
      dedt = options.dedt,
      del1 = options.del1,
      del2 = options.del2,
      del3 = options.del3,
      didt = options.didt,
      dmdt = options.dmdt,
      dnodt = options.dnodt,
      domdt = options.domdt,
      argpo = options.argpo,
      argpdot = options.argpdot,
      t = options.t,
      tc = options.tc,
      gsto = options.gsto,
      xfact = options.xfact,
      xlamo = options.xlamo,
      no = options.no;
  var atime = options.atime,
      em = options.em,
      argpm = options.argpm,
      inclm = options.inclm,
      xli = options.xli,
      mm = options.mm,
      xni = options.xni,
      nodem = options.nodem,
      nm = options.nm;
  var fasx2 = 0.13130908;
  var fasx4 = 2.8843198;
  var fasx6 = 0.37448087;
  var g22 = 5.7686396;
  var g32 = 0.95240898;
  var g44 = 1.8014998;
  var g52 = 1.0508330;
  var g54 = 4.4108898;
  var rptim = 4.37526908801129966e-3; // equates to 7.29211514668855e-5 rad/sec

  var stepp = 720.0;
  var stepn = -720.0;
  var step2 = 259200.0;
  var delt;
  var x2li;
  var x2omi;
  var xl;
  var xldot;
  var xnddt;
  var xndt;
  var xomi;
  var dndt = 0.0;
  var ft = 0.0; //  ----------- calculate deep space resonance effects -----------

  var theta = (gsto + tc * rptim) % _constants.twoPi;
  em += dedt * t;
  inclm += didt * t;
  argpm += domdt * t;
  nodem += dnodt * t;
  mm += dmdt * t; // sgp4fix for negative inclinations
  // the following if statement should be commented out
  // if (inclm < 0.0)
  // {
  //   inclm = -inclm;
  //   argpm = argpm - pi;
  //   nodem = nodem + pi;
  // }

  /* - update resonances : numerical (euler-maclaurin) integration - */

  /* ------------------------- epoch restart ----------------------  */
  //   sgp4fix for propagator problems
  //   the following integration works for negative time steps and periods
  //   the specific changes are unknown because the original code was so convoluted
  // sgp4fix take out atime = 0.0 and fix for faster operation

  if (irez !== 0) {
    //  sgp4fix streamline check
    if (atime === 0.0 || t * atime <= 0.0 || Math.abs(t) < Math.abs(atime)) {
      atime = 0.0;
      xni = no;
      xli = xlamo;
    } // sgp4fix move check outside loop


    if (t > 0.0) {
      delt = stepp;
    } else {
      delt = stepn;
    }

    var iretn = 381; // added for do loop

    while (iretn === 381) {
      //  ------------------- dot terms calculated -------------
      //  ----------- near - synchronous resonance terms -------
      if (irez !== 2) {
        xndt = del1 * Math.sin(xli - fasx2) + del2 * Math.sin(2.0 * (xli - fasx4)) + del3 * Math.sin(3.0 * (xli - fasx6));
        xldot = xni + xfact;
        xnddt = del1 * Math.cos(xli - fasx2) + 2.0 * del2 * Math.cos(2.0 * (xli - fasx4)) + 3.0 * del3 * Math.cos(3.0 * (xli - fasx6));
        xnddt *= xldot;
      } else {
        // --------- near - half-day resonance terms --------
        xomi = argpo + argpdot * atime;
        x2omi = xomi + xomi;
        x2li = xli + xli;
        xndt = d2201 * Math.sin(x2omi + xli - g22) + d2211 * Math.sin(xli - g22) + d3210 * Math.sin(xomi + xli - g32) + d3222 * Math.sin(-xomi + xli - g32) + d4410 * Math.sin(x2omi + x2li - g44) + d4422 * Math.sin(x2li - g44) + d5220 * Math.sin(xomi + xli - g52) + d5232 * Math.sin(-xomi + xli - g52) + d5421 * Math.sin(xomi + x2li - g54) + d5433 * Math.sin(-xomi + x2li - g54);
        xldot = xni + xfact;
        xnddt = d2201 * Math.cos(x2omi + xli - g22) + d2211 * Math.cos(xli - g22) + d3210 * Math.cos(xomi + xli - g32) + d3222 * Math.cos(-xomi + xli - g32) + d5220 * Math.cos(xomi + xli - g52) + d5232 * Math.cos(-xomi + xli - g52) + 2.0 * d4410 * Math.cos(x2omi + x2li - g44) + d4422 * Math.cos(x2li - g44) + d5421 * Math.cos(xomi + x2li - g54) + d5433 * Math.cos(-xomi + x2li - g54);
        xnddt *= xldot;
      } //  ----------------------- integrator -------------------
      //  sgp4fix move end checks to end of routine


      if (Math.abs(t - atime) >= stepp) {
        iretn = 381;
      } else {
        ft = t - atime;
        iretn = 0;
      }

      if (iretn === 381) {
        xli += xldot * delt + xndt * step2;
        xni += xndt * delt + xnddt * step2;
        atime += delt;
      }
    }

    nm = xni + xndt * ft + xnddt * ft * ft * 0.5;
    xl = xli + xldot * ft + xndt * ft * ft * 0.5;

    if (irez !== 1) {
      mm = xl - 2.0 * nodem + 2.0 * theta;
      dndt = nm - no;
    } else {
      mm = xl - nodem - argpm + theta;
      dndt = nm - no;
    }

    nm = no + dndt;
  }

  return {
    atime: atime,
    em: em,
    argpm: argpm,
    inclm: inclm,
    xli: xli,
    mm: mm,
    xni: xni,
    nodem: nodem,
    dndt: dndt,
    nm: nm
  };
}
},{"../constants":2}],12:[function(require,module,exports){
/*!
 * satellite-js v3.0.1
 * (c) 2013 Shashwat Kandadai and UCSC
 * https://github.com/shashwatak/satellite-js
 * License: MIT
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = gstime;

var _constants = require("../constants");

var _ext = require("../ext");

/* -----------------------------------------------------------------------------
 *
 *                           function gstime
 *
 *  this function finds the greenwich sidereal time.
 *
 *  author        : david vallado                  719-573-2600    1 mar 2001
 *
 *  inputs          description                    range / units
 *    jdut1       - julian date in ut1             days from 4713 bc
 *
 *  outputs       :
 *    gstime      - greenwich sidereal time        0 to 2pi rad
 *
 *  locals        :
 *    temp        - temporary variable for doubles   rad
 *    tut1        - julian centuries from the
 *                  jan 1, 2000 12 h epoch (ut1)
 *
 *  coupling      :
 *    none
 *
 *  references    :
 *    vallado       2004, 191, eq 3-45
 * --------------------------------------------------------------------------- */
function gstimeInternal(jdut1) {
  var tut1 = (jdut1 - 2451545.0) / 36525.0;
  var temp = -6.2e-6 * tut1 * tut1 * tut1 + 0.093104 * tut1 * tut1 + (876600.0 * 3600 + 8640184.812866) * tut1 + 67310.54841; // # sec

  temp = temp * _constants.deg2rad / 240.0 % _constants.twoPi; // 360/86400 = 1/240, to deg, to rad
  //  ------------------------ check quadrants ---------------------

  if (temp < 0.0) {
    temp += _constants.twoPi;
  }

  return temp;
}

function gstime() {
  if ((arguments.length <= 0 ? undefined : arguments[0]) instanceof Date || arguments.length > 1) {
    return gstimeInternal(_ext.jday.apply(void 0, arguments));
  }

  return gstimeInternal.apply(void 0, arguments);
}
},{"../constants":2,"../ext":4}],13:[function(require,module,exports){
/*!
 * satellite-js v3.0.1
 * (c) 2013 Shashwat Kandadai and UCSC
 * https://github.com/shashwatak/satellite-js
 * License: MIT
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = initl;

var _constants = require("../constants");

var _gstime = _interopRequireDefault(require("./gstime"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*-----------------------------------------------------------------------------
 *
 *                           procedure initl
 *
 *  this procedure initializes the sgp4 propagator. all the initialization is
 *    consolidated here instead of having multiple loops inside other routines.
 *
 *  author        : david vallado                  719-573-2600   28 jun 2005
 *
 *  inputs        :
 *    ecco        - eccentricity                           0.0 - 1.0
 *    epoch       - epoch time in days from jan 0, 1950. 0 hr
 *    inclo       - inclination of satellite
 *    no          - mean motion of satellite
 *    satn        - satellite number
 *
 *  outputs       :
 *    ainv        - 1.0 / a
 *    ao          - semi major axis
 *    con41       -
 *    con42       - 1.0 - 5.0 cos(i)
 *    cosio       - cosine of inclination
 *    cosio2      - cosio squared
 *    eccsq       - eccentricity squared
 *    method      - flag for deep space                    'd', 'n'
 *    omeosq      - 1.0 - ecco * ecco
 *    posq        - semi-parameter squared
 *    rp          - radius of perigee
 *    rteosq      - square root of (1.0 - ecco*ecco)
 *    sinio       - sine of inclination
 *    gsto        - gst at time of observation               rad
 *    no          - mean motion of satellite
 *
 *  locals        :
 *    ak          -
 *    d1          -
 *    del         -
 *    adel        -
 *    po          -
 *
 *  coupling      :
 *    getgravconst
 *    gstime      - find greenwich sidereal time from the julian date
 *
 *  references    :
 *    hoots, roehrich, norad spacetrack report #3 1980
 *    hoots, norad spacetrack report #6 1986
 *    hoots, schumacher and glover 2004
 *    vallado, crawford, hujsak, kelso  2006
 ----------------------------------------------------------------------------*/
function initl(options) {
  var ecco = options.ecco,
      epoch = options.epoch,
      inclo = options.inclo,
      opsmode = options.opsmode;
  var no = options.no; // sgp4fix use old way of finding gst
  // ----------------------- earth constants ---------------------
  // sgp4fix identify constants and allow alternate values
  // ------------- calculate auxillary epoch quantities ----------

  var eccsq = ecco * ecco;
  var omeosq = 1.0 - eccsq;
  var rteosq = Math.sqrt(omeosq);
  var cosio = Math.cos(inclo);
  var cosio2 = cosio * cosio; // ------------------ un-kozai the mean motion -----------------

  var ak = Math.pow(_constants.xke / no, _constants.x2o3);
  var d1 = 0.75 * _constants.j2 * (3.0 * cosio2 - 1.0) / (rteosq * omeosq);
  var delPrime = d1 / (ak * ak);
  var adel = ak * (1.0 - delPrime * delPrime - delPrime * (1.0 / 3.0 + 134.0 * delPrime * delPrime / 81.0));
  delPrime = d1 / (adel * adel);
  no /= 1.0 + delPrime;
  var ao = Math.pow(_constants.xke / no, _constants.x2o3);
  var sinio = Math.sin(inclo);
  var po = ao * omeosq;
  var con42 = 1.0 - 5.0 * cosio2;
  var con41 = -con42 - cosio2 - cosio2;
  var ainv = 1.0 / ao;
  var posq = po * po;
  var rp = ao * (1.0 - ecco);
  var method = 'n'; //  sgp4fix modern approach to finding sidereal time

  var gsto;

  if (opsmode === 'a') {
    //  sgp4fix use old way of finding gst
    //  count integer number of days from 0 jan 1970
    var ts70 = epoch - 7305.0;
    var ds70 = Math.floor(ts70 + 1.0e-8);
    var tfrac = ts70 - ds70; //  find greenwich location at epoch

    var c1 = 1.72027916940703639e-2;
    var thgr70 = 1.7321343856509374;
    var fk5r = 5.07551419432269442e-15;
    var c1p2p = c1 + _constants.twoPi;
    gsto = (thgr70 + c1 * ds70 + c1p2p * tfrac + ts70 * ts70 * fk5r) % _constants.twoPi;

    if (gsto < 0.0) {
      gsto += _constants.twoPi;
    }
  } else {
    gsto = (0, _gstime.default)(epoch + 2433281.5);
  }

  return {
    no: no,
    method: method,
    ainv: ainv,
    ao: ao,
    con41: con41,
    con42: con42,
    cosio: cosio,
    cosio2: cosio2,
    eccsq: eccsq,
    omeosq: omeosq,
    posq: posq,
    rp: rp,
    rteosq: rteosq,
    sinio: sinio,
    gsto: gsto
  };
}
},{"../constants":2,"./gstime":12}],14:[function(require,module,exports){
/*!
 * satellite-js v3.0.1
 * (c) 2013 Shashwat Kandadai and UCSC
 * https://github.com/shashwatak/satellite-js
 * License: MIT
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = propagate;

var _constants = require("../constants");

var _ext = require("../ext");

var _sgp = _interopRequireDefault(require("./sgp4"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function propagate() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  // Return a position and velocity vector for a given date and time.
  var satrec = args[0];
  var date = Array.prototype.slice.call(args, 1);

  var j = _ext.jday.apply(void 0, _toConsumableArray(date));

  var m = (j - satrec.jdsatepoch) * _constants.minutesPerDay;
  return (0, _sgp.default)(satrec, m);
}
},{"../constants":2,"../ext":4,"./sgp4":15}],15:[function(require,module,exports){
/*!
 * satellite-js v3.0.1
 * (c) 2013 Shashwat Kandadai and UCSC
 * https://github.com/shashwatak/satellite-js
 * License: MIT
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sgp4;

var _constants = require("../constants");

var _dpper = _interopRequireDefault(require("./dpper"));

var _dspace = _interopRequireDefault(require("./dspace"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*----------------------------------------------------------------------------
 *
 *                             procedure sgp4
 *
 *  this procedure is the sgp4 prediction model from space command. this is an
 *    updated and combined version of sgp4 and sdp4, which were originally
 *    published separately in spacetrack report //3. this version follows the
 *    methodology from the aiaa paper (2006) describing the history and
 *    development of the code.
 *
 *  author        : david vallado                  719-573-2600   28 jun 2005
 *
 *  inputs        :
 *    satrec  - initialised structure from sgp4init() call.
 *    tsince  - time since epoch (minutes)
 *
 *  outputs       :
 *    r           - position vector                     km
 *    v           - velocity                            km/sec
 *  return code - non-zero on error.
 *                   1 - mean elements, ecc >= 1.0 or ecc < -0.001 or a < 0.95 er
 *                   2 - mean motion less than 0.0
 *                   3 - pert elements, ecc < 0.0  or  ecc > 1.0
 *                   4 - semi-latus rectum < 0.0
 *                   5 - epoch elements are sub-orbital
 *                   6 - satellite has decayed
 *
 *  locals        :
 *    am          -
 *    axnl, aynl        -
 *    betal       -
 *    cosim   , sinim   , cosomm  , sinomm  , cnod    , snod    , cos2u   ,
 *    sin2u   , coseo1  , sineo1  , cosi    , sini    , cosip   , sinip   ,
 *    cosisq  , cossu   , sinsu   , cosu    , sinu
 *    delm        -
 *    delomg      -
 *    dndt        -
 *    eccm        -
 *    emsq        -
 *    ecose       -
 *    el2         -
 *    eo1         -
 *    eccp        -
 *    esine       -
 *    argpm       -
 *    argpp       -
 *    omgadf      -
 *    pl          -
 *    r           -
 *    rtemsq      -
 *    rdotl       -
 *    rl          -
 *    rvdot       -
 *    rvdotl      -
 *    su          -
 *    t2  , t3   , t4    , tc
 *    tem5, temp , temp1 , temp2  , tempa  , tempe  , templ
 *    u   , ux   , uy    , uz     , vx     , vy     , vz
 *    inclm       - inclination
 *    mm          - mean anomaly
 *    nm          - mean motion
 *    nodem       - right asc of ascending node
 *    xinc        -
 *    xincp       -
 *    xl          -
 *    xlm         -
 *    mp          -
 *    xmdf        -
 *    xmx         -
 *    xmy         -
 *    nodedf      -
 *    xnode       -
 *    nodep       -
 *    np          -
 *
 *  coupling      :
 *    getgravconst-
 *    dpper
 *    dspace
 *
 *  references    :
 *    hoots, roehrich, norad spacetrack report //3 1980
 *    hoots, norad spacetrack report //6 1986
 *    hoots, schumacher and glover 2004
 *    vallado, crawford, hujsak, kelso  2006
 ----------------------------------------------------------------------------*/
function sgp4(satrec, tsince) {
  /* eslint-disable no-param-reassign */
  var coseo1;
  var sineo1;
  var cosip;
  var sinip;
  var cosisq;
  var delm;
  var delomg;
  var eo1;
  var argpm;
  var argpp;
  var su;
  var t3;
  var t4;
  var tc;
  var tem5;
  var temp;
  var tempa;
  var tempe;
  var templ;
  var inclm;
  var mm;
  var nm;
  var nodem;
  var xincp;
  var xlm;
  var mp;
  var nodep;
  /* ------------------ set mathematical constants --------------- */
  // sgp4fix divisor for divide by zero check on inclination
  // the old check used 1.0 + cos(pi-1.0e-9), but then compared it to
  // 1.5 e-12, so the threshold was changed to 1.5e-12 for consistency

  var temp4 = 1.5e-12; // --------------------- clear sgp4 error flag -----------------

  satrec.t = tsince;
  satrec.error = 0; //  ------- update for secular gravity and atmospheric drag -----

  var xmdf = satrec.mo + satrec.mdot * satrec.t;
  var argpdf = satrec.argpo + satrec.argpdot * satrec.t;
  var nodedf = satrec.nodeo + satrec.nodedot * satrec.t;
  argpm = argpdf;
  mm = xmdf;
  var t2 = satrec.t * satrec.t;
  nodem = nodedf + satrec.nodecf * t2;
  tempa = 1.0 - satrec.cc1 * satrec.t;
  tempe = satrec.bstar * satrec.cc4 * satrec.t;
  templ = satrec.t2cof * t2;

  if (satrec.isimp !== 1) {
    delomg = satrec.omgcof * satrec.t; //  sgp4fix use mutliply for speed instead of pow

    var delmtemp = 1.0 + satrec.eta * Math.cos(xmdf);
    delm = satrec.xmcof * (delmtemp * delmtemp * delmtemp - satrec.delmo);
    temp = delomg + delm;
    mm = xmdf + temp;
    argpm = argpdf - temp;
    t3 = t2 * satrec.t;
    t4 = t3 * satrec.t;
    tempa = tempa - satrec.d2 * t2 - satrec.d3 * t3 - satrec.d4 * t4;
    tempe += satrec.bstar * satrec.cc5 * (Math.sin(mm) - satrec.sinmao);
    templ = templ + satrec.t3cof * t3 + t4 * (satrec.t4cof + satrec.t * satrec.t5cof);
  }

  nm = satrec.no;
  var em = satrec.ecco;
  inclm = satrec.inclo;

  if (satrec.method === 'd') {
    tc = satrec.t;
    var dspaceOptions = {
      irez: satrec.irez,
      d2201: satrec.d2201,
      d2211: satrec.d2211,
      d3210: satrec.d3210,
      d3222: satrec.d3222,
      d4410: satrec.d4410,
      d4422: satrec.d4422,
      d5220: satrec.d5220,
      d5232: satrec.d5232,
      d5421: satrec.d5421,
      d5433: satrec.d5433,
      dedt: satrec.dedt,
      del1: satrec.del1,
      del2: satrec.del2,
      del3: satrec.del3,
      didt: satrec.didt,
      dmdt: satrec.dmdt,
      dnodt: satrec.dnodt,
      domdt: satrec.domdt,
      argpo: satrec.argpo,
      argpdot: satrec.argpdot,
      t: satrec.t,
      tc: tc,
      gsto: satrec.gsto,
      xfact: satrec.xfact,
      xlamo: satrec.xlamo,
      no: satrec.no,
      atime: satrec.atime,
      em: em,
      argpm: argpm,
      inclm: inclm,
      xli: satrec.xli,
      mm: mm,
      xni: satrec.xni,
      nodem: nodem,
      nm: nm
    };
    var dspaceResult = (0, _dspace.default)(dspaceOptions);
    em = dspaceResult.em;
    argpm = dspaceResult.argpm;
    inclm = dspaceResult.inclm;
    mm = dspaceResult.mm;
    nodem = dspaceResult.nodem;
    nm = dspaceResult.nm;
  }

  if (nm <= 0.0) {
    // printf("// error nm %f\n", nm);
    satrec.error = 2; // sgp4fix add return

    return [false, false];
  }

  var am = Math.pow(_constants.xke / nm, _constants.x2o3) * tempa * tempa;
  nm = _constants.xke / Math.pow(am, 1.5);
  em -= tempe; // fix tolerance for error recognition
  // sgp4fix am is fixed from the previous nm check

  if (em >= 1.0 || em < -0.001) {
    // || (am < 0.95)
    // printf("// error em %f\n", em);
    satrec.error = 1; // sgp4fix to return if there is an error in eccentricity

    return [false, false];
  } //  sgp4fix fix tolerance to avoid a divide by zero


  if (em < 1.0e-6) {
    em = 1.0e-6;
  }

  mm += satrec.no * templ;
  xlm = mm + argpm + nodem;
  nodem %= _constants.twoPi;
  argpm %= _constants.twoPi;
  xlm %= _constants.twoPi;
  mm = (xlm - argpm - nodem) % _constants.twoPi; // ----------------- compute extra mean quantities -------------

  var sinim = Math.sin(inclm);
  var cosim = Math.cos(inclm); // -------------------- add lunar-solar periodics --------------

  var ep = em;
  xincp = inclm;
  argpp = argpm;
  nodep = nodem;
  mp = mm;
  sinip = sinim;
  cosip = cosim;

  if (satrec.method === 'd') {
    var dpperParameters = {
      inclo: satrec.inclo,
      init: 'n',
      ep: ep,
      inclp: xincp,
      nodep: nodep,
      argpp: argpp,
      mp: mp,
      opsmode: satrec.operationmode
    };
    var dpperResult = (0, _dpper.default)(satrec, dpperParameters);
    ep = dpperResult.ep;
    nodep = dpperResult.nodep;
    argpp = dpperResult.argpp;
    mp = dpperResult.mp;
    xincp = dpperResult.inclp;

    if (xincp < 0.0) {
      xincp = -xincp;
      nodep += _constants.pi;
      argpp -= _constants.pi;
    }

    if (ep < 0.0 || ep > 1.0) {
      //  printf("// error ep %f\n", ep);
      satrec.error = 3; //  sgp4fix add return

      return [false, false];
    }
  } //  -------------------- long period periodics ------------------


  if (satrec.method === 'd') {
    sinip = Math.sin(xincp);
    cosip = Math.cos(xincp);
    satrec.aycof = -0.5 * _constants.j3oj2 * sinip; //  sgp4fix for divide by zero for xincp = 180 deg

    if (Math.abs(cosip + 1.0) > 1.5e-12) {
      satrec.xlcof = -0.25 * _constants.j3oj2 * sinip * (3.0 + 5.0 * cosip) / (1.0 + cosip);
    } else {
      satrec.xlcof = -0.25 * _constants.j3oj2 * sinip * (3.0 + 5.0 * cosip) / temp4;
    }
  }

  var axnl = ep * Math.cos(argpp);
  temp = 1.0 / (am * (1.0 - ep * ep));
  var aynl = ep * Math.sin(argpp) + temp * satrec.aycof;
  var xl = mp + argpp + nodep + temp * satrec.xlcof * axnl; // --------------------- solve kepler's equation ---------------

  var u = (xl - nodep) % _constants.twoPi;
  eo1 = u;
  tem5 = 9999.9;
  var ktr = 1; //    sgp4fix for kepler iteration
  //    the following iteration needs better limits on corrections

  while (Math.abs(tem5) >= 1.0e-12 && ktr <= 10) {
    sineo1 = Math.sin(eo1);
    coseo1 = Math.cos(eo1);
    tem5 = 1.0 - coseo1 * axnl - sineo1 * aynl;
    tem5 = (u - aynl * coseo1 + axnl * sineo1 - eo1) / tem5;

    if (Math.abs(tem5) >= 0.95) {
      if (tem5 > 0.0) {
        tem5 = 0.95;
      } else {
        tem5 = -0.95;
      }
    }

    eo1 += tem5;
    ktr += 1;
  } //  ------------- short period preliminary quantities -----------


  var ecose = axnl * coseo1 + aynl * sineo1;
  var esine = axnl * sineo1 - aynl * coseo1;
  var el2 = axnl * axnl + aynl * aynl;
  var pl = am * (1.0 - el2);

  if (pl < 0.0) {
    //  printf("// error pl %f\n", pl);
    satrec.error = 4; //  sgp4fix add return

    return [false, false];
  }

  var rl = am * (1.0 - ecose);
  var rdotl = Math.sqrt(am) * esine / rl;
  var rvdotl = Math.sqrt(pl) / rl;
  var betal = Math.sqrt(1.0 - el2);
  temp = esine / (1.0 + betal);
  var sinu = am / rl * (sineo1 - aynl - axnl * temp);
  var cosu = am / rl * (coseo1 - axnl + aynl * temp);
  su = Math.atan2(sinu, cosu);
  var sin2u = (cosu + cosu) * sinu;
  var cos2u = 1.0 - 2.0 * sinu * sinu;
  temp = 1.0 / pl;
  var temp1 = 0.5 * _constants.j2 * temp;
  var temp2 = temp1 * temp; // -------------- update for short period periodics ------------

  if (satrec.method === 'd') {
    cosisq = cosip * cosip;
    satrec.con41 = 3.0 * cosisq - 1.0;
    satrec.x1mth2 = 1.0 - cosisq;
    satrec.x7thm1 = 7.0 * cosisq - 1.0;
  }

  var mrt = rl * (1.0 - 1.5 * temp2 * betal * satrec.con41) + 0.5 * temp1 * satrec.x1mth2 * cos2u; // sgp4fix for decaying satellites

  if (mrt < 1.0) {
    // printf("// decay condition %11.6f \n",mrt);
    satrec.error = 6;
    return {
      position: false,
      velocity: false
    };
  }

  su -= 0.25 * temp2 * satrec.x7thm1 * sin2u;
  var xnode = nodep + 1.5 * temp2 * cosip * sin2u;
  var xinc = xincp + 1.5 * temp2 * cosip * sinip * cos2u;
  var mvt = rdotl - nm * temp1 * satrec.x1mth2 * sin2u / _constants.xke;
  var rvdot = rvdotl + nm * temp1 * (satrec.x1mth2 * cos2u + 1.5 * satrec.con41) / _constants.xke; // --------------------- orientation vectors -------------------

  var sinsu = Math.sin(su);
  var cossu = Math.cos(su);
  var snod = Math.sin(xnode);
  var cnod = Math.cos(xnode);
  var sini = Math.sin(xinc);
  var cosi = Math.cos(xinc);
  var xmx = -snod * cosi;
  var xmy = cnod * cosi;
  var ux = xmx * sinsu + cnod * cossu;
  var uy = xmy * sinsu + snod * cossu;
  var uz = sini * sinsu;
  var vx = xmx * cossu - cnod * sinsu;
  var vy = xmy * cossu - snod * sinsu;
  var vz = sini * cossu; // --------- position and velocity (in km and km/sec) ----------

  var r = {
    x: mrt * ux * _constants.earthRadius,
    y: mrt * uy * _constants.earthRadius,
    z: mrt * uz * _constants.earthRadius
  };
  var v = {
    x: (mvt * ux + rvdot * vx) * _constants.vkmpersec,
    y: (mvt * uy + rvdot * vy) * _constants.vkmpersec,
    z: (mvt * uz + rvdot * vz) * _constants.vkmpersec
  };
  return {
    position: r,
    velocity: v
  };
  /* eslint-enable no-param-reassign */
}
},{"../constants":2,"./dpper":8,"./dspace":11}],16:[function(require,module,exports){
/*!
 * satellite-js v3.0.1
 * (c) 2013 Shashwat Kandadai and UCSC
 * https://github.com/shashwatak/satellite-js
 * License: MIT
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sgp4init;

var _constants = require("../constants");

var _dpper = _interopRequireDefault(require("./dpper"));

var _dscom = _interopRequireDefault(require("./dscom"));

var _dsinit = _interopRequireDefault(require("./dsinit"));

var _initl = _interopRequireDefault(require("./initl"));

var _sgp = _interopRequireDefault(require("./sgp4"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*-----------------------------------------------------------------------------
 *
 *                             procedure sgp4init
 *
 *  this procedure initializes variables for sgp4.
 *
 *  author        : david vallado                  719-573-2600   28 jun 2005
 *  author        : david vallado                  719-573-2600   28 jun 2005
 *
 *  inputs        :
 *    opsmode     - mode of operation afspc or improved 'a', 'i'
 *    satn        - satellite number
 *    bstar       - sgp4 type drag coefficient              kg/m2er
 *    ecco        - eccentricity
 *    epoch       - epoch time in days from jan 0, 1950. 0 hr
 *    argpo       - argument of perigee (output if ds)
 *    inclo       - inclination
 *    mo          - mean anomaly (output if ds)
 *    no          - mean motion
 *    nodeo       - right ascension of ascending node
 *
 *  outputs       :
 *    rec      - common values for subsequent calls
 *    return code - non-zero on error.
 *                   1 - mean elements, ecc >= 1.0 or ecc < -0.001 or a < 0.95 er
 *                   2 - mean motion less than 0.0
 *                   3 - pert elements, ecc < 0.0  or  ecc > 1.0
 *                   4 - semi-latus rectum < 0.0
 *                   5 - epoch elements are sub-orbital
 *                   6 - satellite has decayed
 *
 *  locals        :
 *    cnodm  , snodm  , cosim  , sinim  , cosomm , sinomm
 *    cc1sq  , cc2    , cc3
 *    coef   , coef1
 *    cosio4      -
 *    day         -
 *    dndt        -
 *    em          - eccentricity
 *    emsq        - eccentricity squared
 *    eeta        -
 *    etasq       -
 *    gam         -
 *    argpm       - argument of perigee
 *    nodem       -
 *    inclm       - inclination
 *    mm          - mean anomaly
 *    nm          - mean motion
 *    perige      - perigee
 *    pinvsq      -
 *    psisq       -
 *    qzms24      -
 *    rtemsq      -
 *    s1, s2, s3, s4, s5, s6, s7          -
 *    sfour       -
 *    ss1, ss2, ss3, ss4, ss5, ss6, ss7         -
 *    sz1, sz2, sz3
 *    sz11, sz12, sz13, sz21, sz22, sz23, sz31, sz32, sz33        -
 *    tc          -
 *    temp        -
 *    temp1, temp2, temp3       -
 *    tsi         -
 *    xpidot      -
 *    xhdot1      -
 *    z1, z2, z3          -
 *    z11, z12, z13, z21, z22, z23, z31, z32, z33         -
 *
 *  coupling      :
 *    getgravconst-
 *    initl       -
 *    dscom       -
 *    dpper       -
 *    dsinit      -
 *    sgp4        -
 *
 *  references    :
 *    hoots, roehrich, norad spacetrack report #3 1980
 *    hoots, norad spacetrack report #6 1986
 *    hoots, schumacher and glover 2004
 *    vallado, crawford, hujsak, kelso  2006
 ----------------------------------------------------------------------------*/
function sgp4init(satrec, options) {
  /* eslint-disable no-param-reassign */
  var opsmode = options.opsmode,
      satn = options.satn,
      epoch = options.epoch,
      xbstar = options.xbstar,
      xecco = options.xecco,
      xargpo = options.xargpo,
      xinclo = options.xinclo,
      xmo = options.xmo,
      xno = options.xno,
      xnodeo = options.xnodeo;
  var cosim;
  var sinim;
  var cc1sq;
  var cc2;
  var cc3;
  var coef;
  var coef1;
  var cosio4;
  var em;
  var emsq;
  var eeta;
  var etasq;
  var argpm;
  var nodem;
  var inclm;
  var mm;
  var nm;
  var perige;
  var pinvsq;
  var psisq;
  var qzms24;
  var s1;
  var s2;
  var s3;
  var s4;
  var s5;
  var sfour;
  var ss1;
  var ss2;
  var ss3;
  var ss4;
  var ss5;
  var sz1;
  var sz3;
  var sz11;
  var sz13;
  var sz21;
  var sz23;
  var sz31;
  var sz33;
  var tc;
  var temp;
  var temp1;
  var temp2;
  var temp3;
  var tsi;
  var xpidot;
  var xhdot1;
  var z1;
  var z3;
  var z11;
  var z13;
  var z21;
  var z23;
  var z31;
  var z33;
  /* ------------------------ initialization --------------------- */
  // sgp4fix divisor for divide by zero check on inclination
  // the old check used 1.0 + Math.cos(pi-1.0e-9), but then compared it to
  // 1.5 e-12, so the threshold was changed to 1.5e-12 for consistency

  var temp4 = 1.5e-12; // ----------- set all near earth variables to zero ------------

  satrec.isimp = 0;
  satrec.method = 'n';
  satrec.aycof = 0.0;
  satrec.con41 = 0.0;
  satrec.cc1 = 0.0;
  satrec.cc4 = 0.0;
  satrec.cc5 = 0.0;
  satrec.d2 = 0.0;
  satrec.d3 = 0.0;
  satrec.d4 = 0.0;
  satrec.delmo = 0.0;
  satrec.eta = 0.0;
  satrec.argpdot = 0.0;
  satrec.omgcof = 0.0;
  satrec.sinmao = 0.0;
  satrec.t = 0.0;
  satrec.t2cof = 0.0;
  satrec.t3cof = 0.0;
  satrec.t4cof = 0.0;
  satrec.t5cof = 0.0;
  satrec.x1mth2 = 0.0;
  satrec.x7thm1 = 0.0;
  satrec.mdot = 0.0;
  satrec.nodedot = 0.0;
  satrec.xlcof = 0.0;
  satrec.xmcof = 0.0;
  satrec.nodecf = 0.0; // ----------- set all deep space variables to zero ------------

  satrec.irez = 0;
  satrec.d2201 = 0.0;
  satrec.d2211 = 0.0;
  satrec.d3210 = 0.0;
  satrec.d3222 = 0.0;
  satrec.d4410 = 0.0;
  satrec.d4422 = 0.0;
  satrec.d5220 = 0.0;
  satrec.d5232 = 0.0;
  satrec.d5421 = 0.0;
  satrec.d5433 = 0.0;
  satrec.dedt = 0.0;
  satrec.del1 = 0.0;
  satrec.del2 = 0.0;
  satrec.del3 = 0.0;
  satrec.didt = 0.0;
  satrec.dmdt = 0.0;
  satrec.dnodt = 0.0;
  satrec.domdt = 0.0;
  satrec.e3 = 0.0;
  satrec.ee2 = 0.0;
  satrec.peo = 0.0;
  satrec.pgho = 0.0;
  satrec.pho = 0.0;
  satrec.pinco = 0.0;
  satrec.plo = 0.0;
  satrec.se2 = 0.0;
  satrec.se3 = 0.0;
  satrec.sgh2 = 0.0;
  satrec.sgh3 = 0.0;
  satrec.sgh4 = 0.0;
  satrec.sh2 = 0.0;
  satrec.sh3 = 0.0;
  satrec.si2 = 0.0;
  satrec.si3 = 0.0;
  satrec.sl2 = 0.0;
  satrec.sl3 = 0.0;
  satrec.sl4 = 0.0;
  satrec.gsto = 0.0;
  satrec.xfact = 0.0;
  satrec.xgh2 = 0.0;
  satrec.xgh3 = 0.0;
  satrec.xgh4 = 0.0;
  satrec.xh2 = 0.0;
  satrec.xh3 = 0.0;
  satrec.xi2 = 0.0;
  satrec.xi3 = 0.0;
  satrec.xl2 = 0.0;
  satrec.xl3 = 0.0;
  satrec.xl4 = 0.0;
  satrec.xlamo = 0.0;
  satrec.zmol = 0.0;
  satrec.zmos = 0.0;
  satrec.atime = 0.0;
  satrec.xli = 0.0;
  satrec.xni = 0.0; // sgp4fix - note the following variables are also passed directly via satrec.
  // it is possible to streamline the sgp4init call by deleting the "x"
  // variables, but the user would need to set the satrec.* values first. we
  // include the additional assignments in case twoline2rv is not used.

  satrec.bstar = xbstar;
  satrec.ecco = xecco;
  satrec.argpo = xargpo;
  satrec.inclo = xinclo;
  satrec.mo = xmo;
  satrec.no = xno;
  satrec.nodeo = xnodeo; //  sgp4fix add opsmode

  satrec.operationmode = opsmode; // ------------------------ earth constants -----------------------
  // sgp4fix identify constants and allow alternate values

  var ss = 78.0 / _constants.earthRadius + 1.0; // sgp4fix use multiply for speed instead of pow

  var qzms2ttemp = (120.0 - 78.0) / _constants.earthRadius;
  var qzms2t = qzms2ttemp * qzms2ttemp * qzms2ttemp * qzms2ttemp;
  satrec.init = 'y';
  satrec.t = 0.0;
  var initlOptions = {
    satn: satn,
    ecco: satrec.ecco,
    epoch: epoch,
    inclo: satrec.inclo,
    no: satrec.no,
    method: satrec.method,
    opsmode: satrec.operationmode
  };
  var initlResult = (0, _initl.default)(initlOptions);
  var ao = initlResult.ao,
      con42 = initlResult.con42,
      cosio = initlResult.cosio,
      cosio2 = initlResult.cosio2,
      eccsq = initlResult.eccsq,
      omeosq = initlResult.omeosq,
      posq = initlResult.posq,
      rp = initlResult.rp,
      rteosq = initlResult.rteosq,
      sinio = initlResult.sinio;
  satrec.no = initlResult.no;
  satrec.con41 = initlResult.con41;
  satrec.gsto = initlResult.gsto;
  satrec.error = 0; // sgp4fix remove this check as it is unnecessary
  // the mrt check in sgp4 handles decaying satellite cases even if the starting
  // condition is below the surface of te earth
  // if (rp < 1.0)
  // {
  //   printf("// *** satn%d epoch elts sub-orbital ***\n", satn);
  //   satrec.error = 5;
  // }

  if (omeosq >= 0.0 || satrec.no >= 0.0) {
    satrec.isimp = 0;

    if (rp < 220.0 / _constants.earthRadius + 1.0) {
      satrec.isimp = 1;
    }

    sfour = ss;
    qzms24 = qzms2t;
    perige = (rp - 1.0) * _constants.earthRadius; // - for perigees below 156 km, s and qoms2t are altered -

    if (perige < 156.0) {
      sfour = perige - 78.0;

      if (perige < 98.0) {
        sfour = 20.0;
      } // sgp4fix use multiply for speed instead of pow


      var qzms24temp = (120.0 - sfour) / _constants.earthRadius;
      qzms24 = qzms24temp * qzms24temp * qzms24temp * qzms24temp;
      sfour = sfour / _constants.earthRadius + 1.0;
    }

    pinvsq = 1.0 / posq;
    tsi = 1.0 / (ao - sfour);
    satrec.eta = ao * satrec.ecco * tsi;
    etasq = satrec.eta * satrec.eta;
    eeta = satrec.ecco * satrec.eta;
    psisq = Math.abs(1.0 - etasq);
    coef = qzms24 * Math.pow(tsi, 4.0);
    coef1 = coef / Math.pow(psisq, 3.5);
    cc2 = coef1 * satrec.no * (ao * (1.0 + 1.5 * etasq + eeta * (4.0 + etasq)) + 0.375 * _constants.j2 * tsi / psisq * satrec.con41 * (8.0 + 3.0 * etasq * (8.0 + etasq)));
    satrec.cc1 = satrec.bstar * cc2;
    cc3 = 0.0;

    if (satrec.ecco > 1.0e-4) {
      cc3 = -2.0 * coef * tsi * _constants.j3oj2 * satrec.no * sinio / satrec.ecco;
    }

    satrec.x1mth2 = 1.0 - cosio2;
    satrec.cc4 = 2.0 * satrec.no * coef1 * ao * omeosq * (satrec.eta * (2.0 + 0.5 * etasq) + satrec.ecco * (0.5 + 2.0 * etasq) - _constants.j2 * tsi / (ao * psisq) * (-3.0 * satrec.con41 * (1.0 - 2.0 * eeta + etasq * (1.5 - 0.5 * eeta)) + 0.75 * satrec.x1mth2 * (2.0 * etasq - eeta * (1.0 + etasq)) * Math.cos(2.0 * satrec.argpo)));
    satrec.cc5 = 2.0 * coef1 * ao * omeosq * (1.0 + 2.75 * (etasq + eeta) + eeta * etasq);
    cosio4 = cosio2 * cosio2;
    temp1 = 1.5 * _constants.j2 * pinvsq * satrec.no;
    temp2 = 0.5 * temp1 * _constants.j2 * pinvsq;
    temp3 = -0.46875 * _constants.j4 * pinvsq * pinvsq * satrec.no;
    satrec.mdot = satrec.no + 0.5 * temp1 * rteosq * satrec.con41 + 0.0625 * temp2 * rteosq * (13.0 - 78.0 * cosio2 + 137.0 * cosio4);
    satrec.argpdot = -0.5 * temp1 * con42 + 0.0625 * temp2 * (7.0 - 114.0 * cosio2 + 395.0 * cosio4) + temp3 * (3.0 - 36.0 * cosio2 + 49.0 * cosio4);
    xhdot1 = -temp1 * cosio;
    satrec.nodedot = xhdot1 + (0.5 * temp2 * (4.0 - 19.0 * cosio2) + 2.0 * temp3 * (3.0 - 7.0 * cosio2)) * cosio;
    xpidot = satrec.argpdot + satrec.nodedot;
    satrec.omgcof = satrec.bstar * cc3 * Math.cos(satrec.argpo);
    satrec.xmcof = 0.0;

    if (satrec.ecco > 1.0e-4) {
      satrec.xmcof = -_constants.x2o3 * coef * satrec.bstar / eeta;
    }

    satrec.nodecf = 3.5 * omeosq * xhdot1 * satrec.cc1;
    satrec.t2cof = 1.5 * satrec.cc1; // sgp4fix for divide by zero with xinco = 180 deg

    if (Math.abs(cosio + 1.0) > 1.5e-12) {
      satrec.xlcof = -0.25 * _constants.j3oj2 * sinio * (3.0 + 5.0 * cosio) / (1.0 + cosio);
    } else {
      satrec.xlcof = -0.25 * _constants.j3oj2 * sinio * (3.0 + 5.0 * cosio) / temp4;
    }

    satrec.aycof = -0.5 * _constants.j3oj2 * sinio; // sgp4fix use multiply for speed instead of pow

    var delmotemp = 1.0 + satrec.eta * Math.cos(satrec.mo);
    satrec.delmo = delmotemp * delmotemp * delmotemp;
    satrec.sinmao = Math.sin(satrec.mo);
    satrec.x7thm1 = 7.0 * cosio2 - 1.0; // --------------- deep space initialization -------------

    if (2 * _constants.pi / satrec.no >= 225.0) {
      satrec.method = 'd';
      satrec.isimp = 1;
      tc = 0.0;
      inclm = satrec.inclo;
      var dscomOptions = {
        epoch: epoch,
        ep: satrec.ecco,
        argpp: satrec.argpo,
        tc: tc,
        inclp: satrec.inclo,
        nodep: satrec.nodeo,
        np: satrec.no,
        e3: satrec.e3,
        ee2: satrec.ee2,
        peo: satrec.peo,
        pgho: satrec.pgho,
        pho: satrec.pho,
        pinco: satrec.pinco,
        plo: satrec.plo,
        se2: satrec.se2,
        se3: satrec.se3,
        sgh2: satrec.sgh2,
        sgh3: satrec.sgh3,
        sgh4: satrec.sgh4,
        sh2: satrec.sh2,
        sh3: satrec.sh3,
        si2: satrec.si2,
        si3: satrec.si3,
        sl2: satrec.sl2,
        sl3: satrec.sl3,
        sl4: satrec.sl4,
        xgh2: satrec.xgh2,
        xgh3: satrec.xgh3,
        xgh4: satrec.xgh4,
        xh2: satrec.xh2,
        xh3: satrec.xh3,
        xi2: satrec.xi2,
        xi3: satrec.xi3,
        xl2: satrec.xl2,
        xl3: satrec.xl3,
        xl4: satrec.xl4,
        zmol: satrec.zmol,
        zmos: satrec.zmos
      };
      var dscomResult = (0, _dscom.default)(dscomOptions);
      satrec.e3 = dscomResult.e3;
      satrec.ee2 = dscomResult.ee2;
      satrec.peo = dscomResult.peo;
      satrec.pgho = dscomResult.pgho;
      satrec.pho = dscomResult.pho;
      satrec.pinco = dscomResult.pinco;
      satrec.plo = dscomResult.plo;
      satrec.se2 = dscomResult.se2;
      satrec.se3 = dscomResult.se3;
      satrec.sgh2 = dscomResult.sgh2;
      satrec.sgh3 = dscomResult.sgh3;
      satrec.sgh4 = dscomResult.sgh4;
      satrec.sh2 = dscomResult.sh2;
      satrec.sh3 = dscomResult.sh3;
      satrec.si2 = dscomResult.si2;
      satrec.si3 = dscomResult.si3;
      satrec.sl2 = dscomResult.sl2;
      satrec.sl3 = dscomResult.sl3;
      satrec.sl4 = dscomResult.sl4;
      sinim = dscomResult.sinim;
      cosim = dscomResult.cosim;
      em = dscomResult.em;
      emsq = dscomResult.emsq;
      s1 = dscomResult.s1;
      s2 = dscomResult.s2;
      s3 = dscomResult.s3;
      s4 = dscomResult.s4;
      s5 = dscomResult.s5;
      ss1 = dscomResult.ss1;
      ss2 = dscomResult.ss2;
      ss3 = dscomResult.ss3;
      ss4 = dscomResult.ss4;
      ss5 = dscomResult.ss5;
      sz1 = dscomResult.sz1;
      sz3 = dscomResult.sz3;
      sz11 = dscomResult.sz11;
      sz13 = dscomResult.sz13;
      sz21 = dscomResult.sz21;
      sz23 = dscomResult.sz23;
      sz31 = dscomResult.sz31;
      sz33 = dscomResult.sz33;
      satrec.xgh2 = dscomResult.xgh2;
      satrec.xgh3 = dscomResult.xgh3;
      satrec.xgh4 = dscomResult.xgh4;
      satrec.xh2 = dscomResult.xh2;
      satrec.xh3 = dscomResult.xh3;
      satrec.xi2 = dscomResult.xi2;
      satrec.xi3 = dscomResult.xi3;
      satrec.xl2 = dscomResult.xl2;
      satrec.xl3 = dscomResult.xl3;
      satrec.xl4 = dscomResult.xl4;
      satrec.zmol = dscomResult.zmol;
      satrec.zmos = dscomResult.zmos;
      nm = dscomResult.nm;
      z1 = dscomResult.z1;
      z3 = dscomResult.z3;
      z11 = dscomResult.z11;
      z13 = dscomResult.z13;
      z21 = dscomResult.z21;
      z23 = dscomResult.z23;
      z31 = dscomResult.z31;
      z33 = dscomResult.z33;
      var dpperOptions = {
        inclo: inclm,
        init: satrec.init,
        ep: satrec.ecco,
        inclp: satrec.inclo,
        nodep: satrec.nodeo,
        argpp: satrec.argpo,
        mp: satrec.mo,
        opsmode: satrec.operationmode
      };
      var dpperResult = (0, _dpper.default)(satrec, dpperOptions);
      satrec.ecco = dpperResult.ep;
      satrec.inclo = dpperResult.inclp;
      satrec.nodeo = dpperResult.nodep;
      satrec.argpo = dpperResult.argpp;
      satrec.mo = dpperResult.mp;
      argpm = 0.0;
      nodem = 0.0;
      mm = 0.0;
      var dsinitOptions = {
        cosim: cosim,
        emsq: emsq,
        argpo: satrec.argpo,
        s1: s1,
        s2: s2,
        s3: s3,
        s4: s4,
        s5: s5,
        sinim: sinim,
        ss1: ss1,
        ss2: ss2,
        ss3: ss3,
        ss4: ss4,
        ss5: ss5,
        sz1: sz1,
        sz3: sz3,
        sz11: sz11,
        sz13: sz13,
        sz21: sz21,
        sz23: sz23,
        sz31: sz31,
        sz33: sz33,
        t: satrec.t,
        tc: tc,
        gsto: satrec.gsto,
        mo: satrec.mo,
        mdot: satrec.mdot,
        no: satrec.no,
        nodeo: satrec.nodeo,
        nodedot: satrec.nodedot,
        xpidot: xpidot,
        z1: z1,
        z3: z3,
        z11: z11,
        z13: z13,
        z21: z21,
        z23: z23,
        z31: z31,
        z33: z33,
        ecco: satrec.ecco,
        eccsq: eccsq,
        em: em,
        argpm: argpm,
        inclm: inclm,
        mm: mm,
        nm: nm,
        nodem: nodem,
        irez: satrec.irez,
        atime: satrec.atime,
        d2201: satrec.d2201,
        d2211: satrec.d2211,
        d3210: satrec.d3210,
        d3222: satrec.d3222,
        d4410: satrec.d4410,
        d4422: satrec.d4422,
        d5220: satrec.d5220,
        d5232: satrec.d5232,
        d5421: satrec.d5421,
        d5433: satrec.d5433,
        dedt: satrec.dedt,
        didt: satrec.didt,
        dmdt: satrec.dmdt,
        dnodt: satrec.dnodt,
        domdt: satrec.domdt,
        del1: satrec.del1,
        del2: satrec.del2,
        del3: satrec.del3,
        xfact: satrec.xfact,
        xlamo: satrec.xlamo,
        xli: satrec.xli,
        xni: satrec.xni
      };
      var dsinitResult = (0, _dsinit.default)(dsinitOptions);
      satrec.irez = dsinitResult.irez;
      satrec.atime = dsinitResult.atime;
      satrec.d2201 = dsinitResult.d2201;
      satrec.d2211 = dsinitResult.d2211;
      satrec.d3210 = dsinitResult.d3210;
      satrec.d3222 = dsinitResult.d3222;
      satrec.d4410 = dsinitResult.d4410;
      satrec.d4422 = dsinitResult.d4422;
      satrec.d5220 = dsinitResult.d5220;
      satrec.d5232 = dsinitResult.d5232;
      satrec.d5421 = dsinitResult.d5421;
      satrec.d5433 = dsinitResult.d5433;
      satrec.dedt = dsinitResult.dedt;
      satrec.didt = dsinitResult.didt;
      satrec.dmdt = dsinitResult.dmdt;
      satrec.dnodt = dsinitResult.dnodt;
      satrec.domdt = dsinitResult.domdt;
      satrec.del1 = dsinitResult.del1;
      satrec.del2 = dsinitResult.del2;
      satrec.del3 = dsinitResult.del3;
      satrec.xfact = dsinitResult.xfact;
      satrec.xlamo = dsinitResult.xlamo;
      satrec.xli = dsinitResult.xli;
      satrec.xni = dsinitResult.xni;
    } // ----------- set variables if not deep space -----------


    if (satrec.isimp !== 1) {
      cc1sq = satrec.cc1 * satrec.cc1;
      satrec.d2 = 4.0 * ao * tsi * cc1sq;
      temp = satrec.d2 * tsi * satrec.cc1 / 3.0;
      satrec.d3 = (17.0 * ao + sfour) * temp;
      satrec.d4 = 0.5 * temp * ao * tsi * (221.0 * ao + 31.0 * sfour) * satrec.cc1;
      satrec.t3cof = satrec.d2 + 2.0 * cc1sq;
      satrec.t4cof = 0.25 * (3.0 * satrec.d3 + satrec.cc1 * (12.0 * satrec.d2 + 10.0 * cc1sq));
      satrec.t5cof = 0.2 * (3.0 * satrec.d4 + 12.0 * satrec.cc1 * satrec.d3 + 6.0 * satrec.d2 * satrec.d2 + 15.0 * cc1sq * (2.0 * satrec.d2 + cc1sq));
    }
    /* finally propogate to zero epoch to initialize all others. */
    // sgp4fix take out check to let satellites process until they are actually below earth surface
    // if(satrec.error == 0)

  }

  (0, _sgp.default)(satrec, 0, 0);
  satrec.init = 'n';
  /* eslint-enable no-param-reassign */
}
},{"../constants":2,"./dpper":8,"./dscom":9,"./dsinit":10,"./initl":13,"./sgp4":15}],17:[function(require,module,exports){
/*!
 * satellite-js v3.0.1
 * (c) 2013 Shashwat Kandadai and UCSC
 * https://github.com/shashwatak/satellite-js
 * License: MIT
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.radiansToDegrees = radiansToDegrees;
exports.degreesToRadians = degreesToRadians;
exports.degreesLat = degreesLat;
exports.degreesLong = degreesLong;
exports.radiansLat = radiansLat;
exports.radiansLong = radiansLong;
exports.geodeticToEcf = geodeticToEcf;
exports.eciToGeodetic = eciToGeodetic;
exports.ecfToEci = ecfToEci;
exports.eciToEcf = eciToEcf;
exports.ecfToLookAngles = ecfToLookAngles;

var _constants = require("./constants");

function radiansToDegrees(radians) {
  return radians * _constants.rad2deg;
}

function degreesToRadians(degrees) {
  return degrees * _constants.deg2rad;
}

function degreesLat(radians) {
  if (radians < -_constants.pi / 2 || radians > _constants.pi / 2) {
    throw new RangeError('Latitude radians must be in range [-pi/2; pi/2].');
  }

  return radiansToDegrees(radians);
}

function degreesLong(radians) {
  if (radians < -_constants.pi || radians > _constants.pi) {
    throw new RangeError('Longitude radians must be in range [-pi; pi].');
  }

  return radiansToDegrees(radians);
}

function radiansLat(degrees) {
  if (degrees < -90 || degrees > 90) {
    throw new RangeError('Latitude degrees must be in range [-90; 90].');
  }

  return degreesToRadians(degrees);
}

function radiansLong(degrees) {
  if (degrees < -180 || degrees > 180) {
    throw new RangeError('Longitude degrees must be in range [-180; 180].');
  }

  return degreesToRadians(degrees);
}

function geodeticToEcf(geodetic) {
  var longitude = geodetic.longitude,
      latitude = geodetic.latitude,
      height = geodetic.height;
  var a = 6378.137;
  var b = 6356.7523142;
  var f = (a - b) / a;
  var e2 = 2 * f - f * f;
  var normal = a / Math.sqrt(1 - e2 * (Math.sin(latitude) * Math.sin(latitude)));
  var x = (normal + height) * Math.cos(latitude) * Math.cos(longitude);
  var y = (normal + height) * Math.cos(latitude) * Math.sin(longitude);
  var z = (normal * (1 - e2) + height) * Math.sin(latitude);
  return {
    x: x,
    y: y,
    z: z
  };
}

function eciToGeodetic(eci, gmst) {
  // http://www.celestrak.com/columns/v02n03/
  var a = 6378.137;
  var b = 6356.7523142;
  var R = Math.sqrt(eci.x * eci.x + eci.y * eci.y);
  var f = (a - b) / a;
  var e2 = 2 * f - f * f;
  var longitude = Math.atan2(eci.y, eci.x) - gmst;

  while (longitude < -_constants.pi) {
    longitude += _constants.twoPi;
  }

  while (longitude > _constants.pi) {
    longitude -= _constants.twoPi;
  }

  var kmax = 20;
  var k = 0;
  var latitude = Math.atan2(eci.z, Math.sqrt(eci.x * eci.x + eci.y * eci.y));
  var C;

  while (k < kmax) {
    C = 1 / Math.sqrt(1 - e2 * (Math.sin(latitude) * Math.sin(latitude)));
    latitude = Math.atan2(eci.z + a * C * e2 * Math.sin(latitude), R);
    k += 1;
  }

  var height = R / Math.cos(latitude) - a * C;
  return {
    longitude: longitude,
    latitude: latitude,
    height: height
  };
}

function ecfToEci(ecf, gmst) {
  // ccar.colorado.edu/ASEN5070/handouts/coordsys.doc
  //
  // [X]     [C -S  0][X]
  // [Y]  =  [S  C  0][Y]
  // [Z]eci  [0  0  1][Z]ecf
  //
  var X = ecf.x * Math.cos(gmst) - ecf.y * Math.sin(gmst);
  var Y = ecf.x * Math.sin(gmst) + ecf.y * Math.cos(gmst);
  var Z = ecf.z;
  return {
    x: X,
    y: Y,
    z: Z
  };
}

function eciToEcf(eci, gmst) {
  // ccar.colorado.edu/ASEN5070/handouts/coordsys.doc
  //
  // [X]     [C -S  0][X]
  // [Y]  =  [S  C  0][Y]
  // [Z]eci  [0  0  1][Z]ecf
  //
  //
  // Inverse:
  // [X]     [C  S  0][X]
  // [Y]  =  [-S C  0][Y]
  // [Z]ecf  [0  0  1][Z]eci
  var x = eci.x * Math.cos(gmst) + eci.y * Math.sin(gmst);
  var y = eci.x * -Math.sin(gmst) + eci.y * Math.cos(gmst);
  var z = eci.z;
  return {
    x: x,
    y: y,
    z: z
  };
}

function topocentric(observerGeodetic, satelliteEcf) {
  // http://www.celestrak.com/columns/v02n02/
  // TS Kelso's method, except I'm using ECF frame
  // and he uses ECI.
  var longitude = observerGeodetic.longitude,
      latitude = observerGeodetic.latitude;
  var observerEcf = geodeticToEcf(observerGeodetic);
  var rx = satelliteEcf.x - observerEcf.x;
  var ry = satelliteEcf.y - observerEcf.y;
  var rz = satelliteEcf.z - observerEcf.z;
  var topS = Math.sin(latitude) * Math.cos(longitude) * rx + Math.sin(latitude) * Math.sin(longitude) * ry - Math.cos(latitude) * rz;
  var topE = -Math.sin(longitude) * rx + Math.cos(longitude) * ry;
  var topZ = Math.cos(latitude) * Math.cos(longitude) * rx + Math.cos(latitude) * Math.sin(longitude) * ry + Math.sin(latitude) * rz;
  return {
    topS: topS,
    topE: topE,
    topZ: topZ
  };
}
/**
 * @param {Object} tc
 * @param {Number} tc.topS Positive horizontal vector S due south.
 * @param {Number} tc.topE Positive horizontal vector E due east.
 * @param {Number} tc.topZ Vector Z normal to the surface of the earth (up).
 * @returns {Object}
 */


function topocentricToLookAngles(tc) {
  var topS = tc.topS,
      topE = tc.topE,
      topZ = tc.topZ;
  var rangeSat = Math.sqrt(topS * topS + topE * topE + topZ * topZ);
  var El = Math.asin(topZ / rangeSat);

  var Az = Math.atan2(-topE, topS) + _constants.pi;

  return {
    azimuth: Az,
    elevation: El,
    rangeSat: rangeSat // Range in km

  };
}

function ecfToLookAngles(observerGeodetic, satelliteEcf) {
  var topocentricCoords = topocentric(observerGeodetic, satelliteEcf);
  return topocentricToLookAngles(topocentricCoords);
}
},{"./constants":2}],18:[function(require,module,exports){
const _MS_IN_A_DAY = 1000 * 60 * 60 * 24;

// Data formats for TLE orbital elements.
const _DATA_TYPES = {
  _INT: Symbol(),
  _FLOAT: Symbol(),
  _CHAR: Symbol(),
  _DECIMAL_ASSUMED: Symbol(),    // 12345   -> 0.12345
  _DECIMAL_ASSUMED_E: Symbol()   // 12345-2 -> 0.0012345
};

const _ACCEPTABLE_TLE_INPUT_TYPES = {
  _STRING: 'string',
  _ARRAY: 'array',
  _OBJECT: 'object'
};

const _LEADING_ZERO_ASSUMED_PREFIX = '0.';

module.exports = {
  _MS_IN_A_DAY,
  _DATA_TYPES,
  _ACCEPTABLE_TLE_INPUT_TYPES,
  _LEADING_ZERO_ASSUMED_PREFIX
};

},{}],19:[function(require,module,exports){
const { _DATA_TYPES } = require('./constants');

const line1 = {
  /* TLE line number. Will always return 1 for valid TLEs. */
  lineNumber1: {
    start: 0,
    length: 1,
    type: _DATA_TYPES._INT
  },

  /**
   * NORAD satellite catalog number (Sputnik's rocket was 00001).
   *
   * Range: 0 to 99999
   * Example: 25544
   */
  satelliteNumber: {
    start: 2,
    length: 5,
    type: _DATA_TYPES._INT
  },

  /**
   * Satellite classification.
   * 'U' = unclassified
   * 'C' = classified
   * 'S' = secret)
   *
   * Example: 'U'
   */
  classification: {
    start: 7,
    length: 1,
    type: _DATA_TYPES._CHAR
  },

  /**
   * International Designator: Last 2 digits of launch year. 57 to 99 = 1900s, 00-56 = 2000s.
   * See https://en.wikipedia.org/wiki/International_Designator
   *
   * Range: 00 to 99
   * Example: 98
   */
  intDesignatorYear: {
    start: 9,
    length: 2,
    type: _DATA_TYPES._INT
  },

  /**
   * International Designator: Launch number of the year.
   * See https://en.wikipedia.org/wiki/International_Designator
   *
   * Range: 1 to 999
   * Example: 67
   */
  intDesignatorLaunchNumber: {
    start: 11,
    length: 3,
    type: _DATA_TYPES._INT
  },

  /**
   * International Designator: Piece of the launch.
   * See https://en.wikipedia.org/wiki/International_Designator
   *
   * Range: A to ZZZ
   * Example: 'A'
   */
  intDesignatorPieceOfLaunch: {
    start: 14,
    length: 3,
    type: _DATA_TYPES._CHAR
  },

  /**
   * Year when the TLE was generated (TLE epoch), last two digits.
   *
   * Range: 00 to 99
   * Example: 17
   */
  epochYear: {
    start: 18,
    length: 2,
    type: _DATA_TYPES._INT
  },

  /**
   * Fractional day of the year when the TLE was generated (TLE epoch).
   *
   * Range: 1 to 365.99999999
   * Example: 206.18396726
   */
  epochDay: {
    start: 20,
    length: 12,
    type: _DATA_TYPES._FLOAT
  },

  /**
   * First Time Derivative of the Mean Motion divided by two.  Defines how mean motion changes
   * from day to day, so TLE propagators can still be used to make reasonable guesses when
   * times are distant from the original TLE epoch.
   *
   * Units: Orbits / day ^ 2
   * Example: 0.00001961
   */
  firstTimeDerivative: {
    start: 33,
    length: 11,
    type: _DATA_TYPES._FLOAT
  },

  /**
   * Second Time Derivative of Mean Motion divided by six (decimal point assumed). Measures rate
   * of change in the Mean Motion Dot so software can make reasonable guesses when times are
   * distant from the original TLE epoch.
   *
   * Usually zero, unless the satellite is manuevering or in a decaying orbit.
   *
   * Units: Orbits / day ^ 3.
   * Example: 0 ('00000-0' in the original TLE [= 0.00000 * 10 ^ 0])
   */
  secondTimeDerivative: {
    start: 44,
    length: 8,
    type: _DATA_TYPES._DECIMAL_ASSUMED_E
  },

  /**
   * BSTAR drag term (decimal point assumed).  Estimates the effects of
   * atmospheric drag on the satellite's motion.
   *
   * Units: EarthRadii ^ -1
   * Example: 0.000036771 ('36771-4' in the original TLE [= 0.36771 * 10 ^ -4])
   */
  bstarDrag: {
    start: 53,
    length: 8,
    type: _DATA_TYPES._DECIMAL_ASSUMED_E
  },

  /**
   * Private value - used by Air Force Space Command to reference the orbit model used to
   * generate the TLE.  Will always be seen as zero externally (e.g. by "us", unless you are
   * "them" - in which case, hello!).
   *
   * Example: 0
   */
  orbitModel: {
    start: 62,
    length: 1,
    type: _DATA_TYPES._INT
  },

  /**
   * TLE element set number, incremented for each new TLE generated. 999 seems to mean the TLE
   * has maxed out.
   *
   * Range: Technically 1 to 9999, though in practice the maximum number seems to be 999.
   * Example: 999
   */
  tleSetNumber: {
    start: 64,
    length: 4,
    type: _DATA_TYPES._INT
  },

  /*
   * TLE line 1 checksum (modulo 10), for verifying the integrity of this line of the TLE.
   *
   * Range: 0 to 9
   * Example: 3
   */
  checksum1: {
    start: 68,
    length: 1,
    type: _DATA_TYPES._INT
  }
};

const line2 = {
  /* TLE line number. Will always return 2 for valid TLEs. */
  lineNumber2: {
    start: 0,
    length: 1,
    type: _DATA_TYPES._INT
  },

  /**
   * NORAD satellite catalog number (Sputnik's rocket was 00001).  Should match the satellite
   * number on line 1.
   *
   * Range: 0 to 99999
   * Example: 25544
   */
  satelliteNumber2: {
    start: 2,
    length: 5,
    type: _DATA_TYPES._INT
  },

  /**
   * Inclination relative to the Earth's equatorial plane in degrees. 0 to 90 degrees is a
   * prograde orbit and 90 to 180 degrees is a retrograde orbit.
   *
   * Units: degrees
   * Range: 0 to 180
   * Example: 51.6400
   */
  inclination: {
    start: 8,
    length: 8,
    type: _DATA_TYPES._FLOAT
  },

  /**
   * Right ascension of the ascending node in degrees. Essentially, this is the angle of the
   * satellite as it crosses northward (ascending) across the Earth's equator (equatorial
   * plane).
   *
   * Units: degrees
   * Range: 0 to 359.9999
   * Example: 208.9163
   */
  rightAscension: {
    start: 17,
    length: 8,
    type: _DATA_TYPES._FLOAT
  },

  /**
   * Orbital eccentricity, decimal point assumed. All artifical Earth satellites have an
   * eccentricity between 0 (perfect circle) and 1 (parabolic orbit).
   *
   * Range: 0 to 1
   * Example: 0.0006317 (`0006317` in the original TLE)
   */
  eccentricity: {
    start: 26,
    length: 7,
    type: _DATA_TYPES._DECIMAL_ASSUMED
  },

  /**
   * Argument of perigee. See https://en.wikipedia.org/wiki/Argument_of_perigee
   * Units: degrees
   * Range: 0 to 359.9999
   * Example: 69.9862
   */
  perigee: {
    start: 34,
    length: 8,
    type: _DATA_TYPES._FLOAT
  },

  /**
   * Mean anomaly. Indicates where the satellite was located within its orbit at the time of the
   * TLE epoch.
   * See https://en.wikipedia.org/wiki/Mean_Anomaly
   *
   * Units: degrees
   * Range: 0 to 359.9999
   * Example: 25.2906
   */
  meanAnomaly: {
    start: 43,
    length: 8,
    type: _DATA_TYPES._FLOAT
  },

  /**
   * Revolutions around the Earth per day (mean motion).
   * See https://en.wikipedia.org/wiki/Mean_Motion
   *
   * Range: 0 to 17 (theoretically)
   * Example: 15.54225995
   */
  meanMotion: {
    start: 52,
    length: 11,
    type: _DATA_TYPES._FLOAT
  },

  /**
   * Total satellite revolutions when this TLE was generated. This number seems to roll over
   * (e.g. 99999 -> 0).
   *
   * Range: 0 to 99999
   * Example: 6766
   */
  revNumberAtEpoch: {
    start: 63,
    length: 5,
    type: _DATA_TYPES._INT
  },

  /*
   * TLE line 1 checksum (modulo 10), for verifying the integrity of this line of the TLE.
   *
   * Range: 0 to 9
   * Example: 0
   */
  checksum2: {
    start: 68,
    length: 1,
    type: _DATA_TYPES._INT
  }
};

/**
 * Fixed locations of orbital element value strings as they have appeared going back to the
 * punchcard days.
 * See https://en.wikipedia.org/wiki/Two-line_element_set.
 */
module.exports = {
  line1,
  line2
};

},{"./constants":18}],20:[function(require,module,exports){
const SatelliteJS = require('satellite.js');
const {
  _crossesAntemeridian,
  _dayOfYearToTimeStamp,
  _decimalAssumedEToFloat,
  _degreesToRadians,
  _radiansToDegrees,
  _toCamelCase
} = require('./utils');
const tleLines = require('./line-defs');
const {
  _ACCEPTABLE_TLE_INPUT_TYPES,
  _DATA_TYPES,
  _LEADING_ZERO_ASSUMED_PREFIX,
  _MS_IN_A_DAY
} = require('./constants');

// TODO: fix this ugliness
const satellitejs = (SatelliteJS.twoline2satrec) ? SatelliteJS : SatelliteJS.satellite;

class TLEJS {
  constructor() {
    this.createAllTLEGetters(tleLines);

    // TODO: use Set to store cache vals.
    this.cache = {
      antemeridianCrossings: {}
    };
  }

  /**
   * Parses a TLE from a string or array input.  Both two and three-line variants are acceptable.
   */
  parseTLE(inputTLE) {
    const fnName = 'parseTLE';

    // Check if already an instance of a TLE object.
    if (typeof inputTLE === _ACCEPTABLE_TLE_INPUT_TYPES._OBJECT && inputTLE.arr) return inputTLE;
    const tleStrLong = (Array.isArray(inputTLE)) ? inputTLE.join('') : inputTLE;
    const tleStr = tleStrLong.substr && tleStrLong.substr(0, 30);
    const cacheKey = `${fnName}-${tleStr}`;
    if (this.cache[cacheKey]) return this.cache[cacheKey];

    const outputObj = {};
    const tleType = (Array.isArray(inputTLE))
      ? _ACCEPTABLE_TLE_INPUT_TYPES._ARRAY
      : typeof inputTLE;
    let tleArr = [];

    switch (tleType) {
    case _ACCEPTABLE_TLE_INPUT_TYPES._ARRAY:
      // Make a copy.
      tleArr = inputTLE.concat();
      break;

    case _ACCEPTABLE_TLE_INPUT_TYPES._STRING:
      // Convert string to array.
      tleArr = inputTLE.split('\n');
      break;

    default:
      throw new Error('TLE input is invalid');
    }

    // Handle 2 and 3 line variants.
    if (tleArr.length > 2) {
      // 3-line TLE with satellite name as the first line.

      // Keep track of satellite name.
      outputObj.name = tleArr[0];

      // Remove name from array.
      tleArr.splice(0, 1);
    } else {
      // 2-line TLE with no satellite name.
      outputObj.name = 'Unknown';
    }

    // Trim spaces
    tleArr = tleArr.map(line => line.trim());

    outputObj.arr = tleArr;

    this.cache[cacheKey] = outputObj;

    return outputObj;
  }

  /**
   * Determines if a TLE is valid, checking for the presence of line numbers and making sure
   * the calculated checksum matches the expected checksum.
   */
  isValidTLE(tle) {
    const fnName = 'isValidTLE';

    const parsedTLE = this.parseTLE(tle);
    const tleStr = parsedTLE.arr.join('').substr(0, 30);
    const cacheKey = `${fnName}-${tleStr}`;
    if (this.cache[cacheKey]) return this.cache[cacheKey];

    let isValid = true;

    if (parsedTLE.arr.length !== 2) return false;

    // Check line numbers and checksums at the same time.
    parsedTLE.arr.forEach((line, index) => {
      // Noop if already invalid.
      if (!isValid) return;

      const lineNumber = index + 1;

      // Check line number.
      const parsedLineNumber = this[`getLineNumber${lineNumber}`](parsedTLE);
      const lineNumberIsValid = parsedLineNumber === lineNumber;

      // Checksum.
      const calculatedLineChecksum = this.tleLineChecksum(parsedTLE.arr[index]);
      const parsedChecksum = this[`getChecksum${lineNumber}`](parsedTLE);
      const checksumIsValid = parsedChecksum === calculatedLineChecksum;

      if (!lineNumberIsValid || !checksumIsValid) {
        isValid = false;
      }
    });

    this.cache[cacheKey] = isValid;

    return isValid;
  }

  /**
   * Determines the checksum for a single line of a TLE.
   *
   * Checksum = modulo 10 of sum of all numbers (including line number) + 1 for each negative
   * sign (-).  Everything else is ignored.
   */
  tleLineChecksum(tleLineStr) {
    const charArr = tleLineStr.split('');

    // Remove trailing checksum.
    charArr.splice(charArr.length - 1, 1);

    if (charArr.length === 0) {
      throw new Error('Character array empty!', tleLineStr);
    }

    const checksum = charArr.reduce((sum, val) => {
      const parsedVal = parseInt(val, 10);
      const parsedSum = parseInt(sum, 10);

      if (Number.isInteger(parsedVal)) {
        return parsedSum + parsedVal;
      } else if (val === '-') {
        return parsedSum + 1;
      }

      return parsedSum;
    });

    return checksum % 10;
  }

  /**
   * Creates simple getters for each line of a TLE.
   */
  createAllTLEGetters(lines) {
    const boundCreateTLELineGetters = this.createTLELineGetters.bind(this, lines);
    Object.keys(lines).forEach(boundCreateTLELineGetters);
  }

  /**
   * Creates simple getters for all values on a single line of a TLE.
   */
  createTLELineGetters(lines, line) {
    const boundCreateTLEValGetter = this.createTLEValGetter.bind(this, line);
    Object.keys(lines[line]).forEach(boundCreateTLEValGetter);
  }

  /**
   * Creates a simple getter for a single TLE value.
   *
   * TODO: proper ES6 getters?
   */
  createTLEValGetter(tleLine, prop) {
    this[_toCamelCase(`get-${prop}`)] = (tle) => {
      const parsedTLE = this.parseTLE(tle);

      const tleArr = parsedTLE.arr;
      const line = (tleLine === 'line1') ? tleArr[0] : tleArr[1];
      const start = tleLines[tleLine][prop].start;
      const length = tleLines[tleLine][prop].length;

      const substr = line.substr(start, length);

      let output;
      switch (tleLines[tleLine][prop].type) {
      case _DATA_TYPES._INT:
        output = parseInt(substr, 10);
        break;

      case _DATA_TYPES._FLOAT:
        output = parseFloat(substr);
        break;

      case _DATA_TYPES._DECIMAL_ASSUMED:
        output = parseFloat(`${_LEADING_ZERO_ASSUMED_PREFIX}${substr}`);
        break;

      case _DATA_TYPES._DECIMAL_ASSUMED_E:
        output = _decimalAssumedEToFloat(substr);
        break;

      case _DATA_TYPES._CHAR:
      default:
        output = substr.trim();
        break;
      }

      return output;
    };
  }

  /**
   * Determines the Unix timestamp (in ms) of a TLE epoch (the time a TLE was generated).
   *
   * Example:
   * getEpochTimestamp(tleStr);
   * -> 1500956694771
   */
  getEpochTimestamp(tle) {
    const epochDay = this.getEpochDay(tle);
    const epochYear = this.getEpochYear(tle);
    return _dayOfYearToTimeStamp(epochDay, epochYear);
  }

  /**
   * Determines the name of a satellite, if present in the first line of a 3-line TLE.  If not
   * present, 'Unknown' is returned.
   *
   * Example:
   * getSatelliteName(tleStr);
   * -> 'ISS (ZARYA)'
   */
  getSatelliteName(tle) {
    const parsedTLE = this.parseTLE(tle);
    return parsedTLE.name;
  }

  /**
   * Determines satellite position and look angles from an earth observer.
   *
   * Example:
   * const timestampMS = 1501039265000;
   * const observer = {
   *   lat: 34.243889,
   *   lng: -116.911389,
   *   height: 0
   * };
   * const satInfo = tle.getSatelliteInfo(
   *   tleStr,          // Satellite TLE string or array.
   *   timestampMS,     // Timestamp (ms)
   *   observer.lat,    // Observer latitude (degrees)
   *   observer.lng,    // Observer longitude (degrees)
   *   observer.height  // Observer elevation (km)
   * );
   *
   * ->
   * {
   *   // satellite compass heading from observer in degrees (0 = north, 180 = south)
   *   azimuth: 294.5780478624994,
   *
   *   // satellite elevation from observer in degrees (90 is directly overhead)
   *   elevation: 81.63903620330046,
   *
   *   // km distance from observer to spacecraft
   *   range: 406.60211015810074,
   *
   *   // spacecraft altitude in km
   *   height: 402.9082788620108,

   *   // spacecraft latitude in degrees
   *   lat: 34.45112876592785,

   *   // spacecraft longitude in degrees
   *   lng: -117.46176597710809,
   *
   *   // spacecraft velocity in km/s
   *   velocity: 7.675627442183371
   * }
   */
  getSatelliteInfo(tle, timestamp, observerLat, observerLng, observerHeight) {
    const fnName = 'getSatelliteInfo';

    const timestampCopy = timestamp || Date.now();

    const tleArr = (this.parseTLE(tle)).arr;
    const tleStrShort = tleArr.join('').substr(0, 30);

    const defaultObserverPosition = {
      lat: 36.9613422,
      lng: -122.0308,
      height: 0.370
    };

    const obsLat = observerLat || defaultObserverPosition.lat;
    const obsLng = observerLng || defaultObserverPosition.lng;
    const obsHeight = observerHeight || defaultObserverPosition.height;

    // Memoization
    const cacheKey = `${fnName}-${tleStrShort}-${timestampCopy}-${observerLat}-${observerLng}
-${observerHeight}`;
    if (this.cache[cacheKey]) return this.cache[cacheKey];

    // Sanity check
    if (!satellitejs) {
      throw new Error('satellite.js not found');
    }

    // Initialize a satellite record
    const satrec = satellitejs.twoline2satrec(tleArr[0], tleArr[1]);

    const time = new Date(timestampCopy);

    // Propagate SGP4.
    const positionAndVelocity = satellitejs.propagate(satrec, time);

    if (satellitejs.error) {
      throw new Error('Error: problematic TLE with unexpected eccentricity');
    }

    // The position_velocity result is a key-value pair of ECI coordinates.
    // These are the base results from which all other coordinates are derived.
    const positionEci = positionAndVelocity.position;
    const velocityEci = positionAndVelocity.velocity;

    // Set the observer position (in radians).
    const observerGd = {
      latitude: _degreesToRadians(obsLat),
      longitude: _degreesToRadians(obsLng),
      height: obsHeight
    };

    // Get GMST for some coordinate transforms.
    // http://en.wikipedia.org/wiki/Sidereal_time#Definition
    const gmst = satellitejs.gstime(time);

    // Get ECF, Geodetic, Look Angles, and Doppler Factor.
    const positionEcf = satellitejs.eciToEcf(positionEci, gmst);
    const positionGd = satellitejs.eciToGeodetic(positionEci, gmst);
    const lookAngles = satellitejs.ecfToLookAngles(observerGd, positionEcf);

    const velocityKmS =
      Math.sqrt(Math.pow(velocityEci.x, 2) +
      Math.pow(velocityEci.y, 2) +
      Math.pow(velocityEci.z, 2));

    // Azimuth: is simply the compass heading from the observer's position.
    const azimuth = lookAngles.azimuth;

    // Geodetic coords are accessed via `longitude`, `latitude`, `height`.
    const longitude = positionGd.longitude;
    const latitude = positionGd.latitude;
    const height = positionGd.height;

    const output = {
      lng: satellitejs.degreesLong(longitude),
      lat: satellitejs.degreesLat(latitude),
      elevation: _radiansToDegrees(lookAngles.elevation),
      azimuth: _radiansToDegrees(azimuth),
      range: lookAngles.rangeSat,
      height,
      velocity: velocityKmS
    };

    this.cache[cacheKey] = output;

    return output;
  }

  /**
   * Determines current satellite position, or position at optional timestamp if passed in.
   */
  getLatLon(tle, optionalTimestamp = Date.now()) {
    const tleObj = this.parseTLE(tle);

    // Validation.
    if (!this.isValidTLE(tleObj)) {
      throw new Error('TLE could not be parsed:', tle);
    }

    const satInfo = this.getSatelliteInfo(tleObj.arr, optionalTimestamp);
    return {
      lat: satInfo.lat,
      lng: satInfo.lng
    };
  }

  /**
   * Determines current satellite position, or position at optional timestamp if passed in.
   */
  getLatLonArr(tle, optionalTimestamp = Date.now()) {
    const ll = this.getLatLon(tle, optionalTimestamp);
    return [ll.lat, ll.lng];
  }

  /**
   * Determines the position of the satellite at the time the TLE was generated.
   */
  getLatLonAtEpoch(tle) {
    return this.getLatLon(tle, this.getEpochTimestamp(tle));
  }

  /**
   * Determines the average orbit length of the satellite in minutes.
   */
  getAverageOrbitLengthMins(tle) {
    const fnName = 'getAverageOrbitLengthMins';

    const tleStr = tle.join('').substr(0, 30);
    const cacheKey = `${fnName}-${tleStr}`;
    if (this.cache[cacheKey]) return this.cache[cacheKey];

    const meanMotionSeconds = (24 * 60) / this.getMeanMotion(tle);

    this.cache[cacheKey] = meanMotionSeconds;

    return meanMotionSeconds;
  }

  /**
   * Determines the Unix timestamp (in ms) of the the TLE epoch (when the TLE was generated).
   */
  getTLEEpochTimestamp(tle) {
    const epochYear = this.getEpochYear(tle);
    const epochDayOfYear = this.getEpochDay(tle);
    const timestamp = _dayOfYearToTimeStamp(epochDayOfYear, epochYear);

    return timestamp;
  }

  /**
   * Determines if the last antemeridian crossing has been cached.  If it has, the time (in ms)
   * is returned, otherwise it returns false.
   */
  getCachedLastAntemeridianCrossingTimeMS(tle, timeMS) {
    const orbitLengthMS = this.getAverageOrbitLengthMins(tle.arr) * 60 * 1000;

    const tleStr = tle.arr.join('').substr(0, 30);

    const cachedCrossingTimes = this.cache.antemeridianCrossings[tleStr];
    if (!cachedCrossingTimes) return false;

    if (cachedCrossingTimes === -1) return cachedCrossingTimes;

    const cachedTime = cachedCrossingTimes.filter(val => {
      if (typeof val === 'object' && val.tle === tle) return -1;

      const diff = timeMS - val;
      const isDiffPositive = diff > 0;
      const isWithinOrbit = isDiffPositive && diff < orbitLengthMS;
      return isWithinOrbit;
    });

    return cachedTime[0] || false;
  }

  /**
   * Determines the last time the satellite crossed the antemeridian.  For mapping convenience
   * and to avoid headaches, we want to avoid plotting ground tracks that cross the antemeridian.
   */
  getLastAntemeridianCrossingTimeMS(tle, timeMS) {
    const parsedTLE = this.parseTLE(tle);

    const cachedVal = this.getCachedLastAntemeridianCrossingTimeMS(parsedTLE, timeMS);
    if (cachedVal) return cachedVal;

    const time = timeMS || Date.now();

    let step = 1000 * 60 * 10;
    let curLatLon = [];
    let lastLatLon = [];
    let curTimeMS = time;
    let didCrossAntemeridian = false;
    let tries = 0;
    let isDone = false;
    const maxTries = 1000;
    while (!isDone) {
      curLatLon = this.getLatLonArr(parsedTLE.arr, curTimeMS);

      didCrossAntemeridian = _crossesAntemeridian(lastLatLon[1], curLatLon[1]);
      if (didCrossAntemeridian) {
        // back up
        curTimeMS += step;
        step = (step > 20000) ? 20000 : step / 2;
      } else {
        curTimeMS -= step;
        lastLatLon = curLatLon;
      }

      isDone = step < 500 || tries >= maxTries;

      tries++;
    }

    const couldNotFindCrossing = tries - 1 === maxTries;
    const crossingTime = (couldNotFindCrossing) ? -1 : parseInt(curTimeMS, 10);

    const tleStr = parsedTLE.arr.join('').substr(0, 30);
    if (!this.cache.antemeridianCrossings[tleStr]) this.cache.antemeridianCrossings[tleStr] = [];

    if (couldNotFindCrossing) {
      this.cache.antemeridianCrossings[tleStr] = -1;
    } else {
      this.cache.antemeridianCrossings[tleStr].push(crossingTime);
    }

    return crossingTime;
  }

  /**
   * Determines the average amount of milliseconds in one orbit.
   */
  getOrbitTimeMS(tle) {
    return parseInt(_MS_IN_A_DAY / this.getMeanMotion(tle), 10);
  }

  /**
   * Calculates three orbit arrays of latitude/longitude pairs.
   *
   * Example:
   * const threeOrbitsArr = tle.getGroundTrackLatLng(tleStr);
   * ->
   * [
   *   // previous orbit
   *   [
   *     [ 45.85524291891481, -179.93297540317567 ],
   *     ...
   *   ],
   *
   *   // current orbit
   *   [
   *     [ 51.26165992503701, -179.9398612198045 ],
   *     ...
   *   ],
   *
   *   // next orbit
   *   [
   *     [ 51.0273714070371, -179.9190165549038 ],
   *     ...
   *   ]
   * ]
   */
  getGroundTrackLatLng(tle, stepMS, optionalTimeMS) {
    const fnName = 'getGroundTrackLatLng';

    const timeMS = optionalTimeMS || Date.now();
    const timeS = (timeMS / 1000).toFixed();

    const parsedTLE = this.parseTLE(tle);
    const tleStrTrimmed = parsedTLE.arr[1].substr(0, 30);

    const orbitTimeMS = this.getOrbitTimeMS(tle);
    const curOrbitStartMS = this.getLastAntemeridianCrossingTimeMS(parsedTLE, timeMS);

    const foundCrossing = curOrbitStartMS !== -1;

    let cacheKey;
    if (foundCrossing) {
      const curOrbitStartS = (curOrbitStartMS / 1000).toFixed();

      // Check for memoized values.
      cacheKey = `${fnName}-${tleStrTrimmed}-${stepMS}-${curOrbitStartS}`;
      if (this.cache[cacheKey]) return this.cache[cacheKey];
    } else {
      // Geosync or unusual orbit.

      cacheKey = `${fnName}-${tleStrTrimmed}-${stepMS}-${timeS}`;
      if (this.cache[cacheKey]) return this.cache[cacheKey];

      this.cache[cacheKey] = [
        this.getOrbitTrack(parsedTLE.arr, timeMS, 600000, 86400000)
      ];

      return this.cache[cacheKey];
    }

    const lastOrbitStartMS = this.getLastAntemeridianCrossingTimeMS(tle, curOrbitStartMS - 10000);
    const nextOrbitStartMS = this.getLastAntemeridianCrossingTimeMS(
        tle, curOrbitStartMS + orbitTimeMS + (1000 * 60 * 30));

    const orbitStartTimes = [
      lastOrbitStartMS,
      curOrbitStartMS,
      nextOrbitStartMS
    ];

    const orbitLatLons = orbitStartTimes.map(
      orbitStartMS => this.getOrbitTrack(parsedTLE.arr, orbitStartMS, stepMS, false)
    );

    this.cache[cacheKey] = orbitLatLons;

    return orbitLatLons;
  }

  /**
   * Generates an array of lat/lng pairs representing a ground track (orbit track), starting
   * from startTimeMS and continuing until crossing the antemeridian, which is considered the end
   * of the orbit for convenience.
   */
  getOrbitTrack(TLEArr, startTimeMS, stepMS, maxTimeMS = 6000000) {
    const fnName = 'getOrbitTrack';

    if (!startTimeMS) return [];

    // Memoization.
    const tleStr = TLEArr.join('');
    const tleStrTrimmed = tleStr.substr(0, 30);
    const startTime = (startTimeMS / 10000).toFixed();
    const cacheKey = `${fnName}-${tleStrTrimmed}-${startTime}-${stepMS}`;
    if (this.cache[cacheKey]) return this.cache[cacheKey];

    // default to 1 minute intervals
    const defaultStepMS = 1000 * 60 * 1;
    let stepMSCopy = stepMS || defaultStepMS;

    const latLons = [];
    let curTimeMS = startTimeMS;
    let lastLatLon = [];
    let curLatLon = [];
    let isDone = false;
    let doesCrossAntemeridian = false;
    while (!isDone) {
      curLatLon = this.getLatLonArr(TLEArr, curTimeMS);

      doesCrossAntemeridian = _crossesAntemeridian(lastLatLon[1], curLatLon[1]);
      if (doesCrossAntemeridian) {
        if (stepMSCopy === 500) isDone = true;

        // Go back a bit.
        curTimeMS -= stepMSCopy;
        stepMSCopy = 500;
      } else {
        latLons.push(curLatLon);
        curTimeMS += stepMSCopy;
        lastLatLon = curLatLon;
      }

      if (maxTimeMS && (curTimeMS - startTimeMS > maxTimeMS)) isDone = true;
    }

    this.cache[cacheKey] = latLons;

    return latLons;
  }

  /**
   * Determes the compass bearing from the perspective of the satellite.  Useful for 3D / pitched
   * map perspectives.
   *
   * TODO: a bit buggy at extreme parts of orbits, where latitude hardly changes.
   */
  getSatBearing(tle, customTimeMS) {
    const parsedTLE = this.parseTLE(tle);

    const timeMS = customTimeMS || Date.now();

    const latLon1 = this.getLatLonArr(parsedTLE.arr, timeMS);
    const latLon2 = this.getLatLonArr(parsedTLE.arr, timeMS + 10000);

    const doesCrossAntemeridian = _crossesAntemeridian(latLon1[1], latLon2[1]);

    if (doesCrossAntemeridian) {
      // TODO: fix
      return {};
      // return this.getSatBearing(tle, customTimeMS + 10000);
    }

    const lat1 = _degreesToRadians(latLon1[0]);
    const lat2 = _degreesToRadians(latLon2[0]);
    const lon1 = _degreesToRadians(latLon1[1]);
    const lon2 = _degreesToRadians(latLon2[1]);

    const NS = (lat1 >= lat2) ? 'S' : 'N';
    const EW = (lon1 >= lon2) ? 'W' : 'E';

    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x = (Math.cos(lat1) * Math.sin(lat2)) -
              (Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1));
    const degrees = _radiansToDegrees(Math.atan2(y, x));

    return {
      degrees,
      compass: `${NS}${EW}`
    };
  }

  /**
   * Determines a set of three orbit ground tracks.  Similar to getGroundTrackLatLng, except
   * points are returned in reversed order ([longitude, latitude]), which is handy for GeoJSON.
   */
  getGroundTrackLngLat(tle, stepMS, optionalTimeMS) {
    const latLngArr = this.getGroundTrackLatLng(tle, stepMS, optionalTimeMS);
    const lngLatArr = latLngArr.map(line => line.map(latLng => [latLng[1], latLng[0]]));

    return lngLatArr;
  }
}

module.exports = TLEJS;

},{"./constants":18,"./line-defs":19,"./utils":21,"satellite.js":5}],21:[function(require,module,exports){
const { _MS_IN_A_DAY, _LEADING_ZERO_ASSUMED_PREFIX } = require('./constants');

/**
 * Determines if a number is positive.
 */
const _isPositive = num => num >= 0;

/**
 * Determines the amount of digits in a number.  Used for converting a TLE's "leading decimal
 * assumed" notation.
 *
 * Example:
 * getDigitCount(12345);
 * -> 5
 */
const _getDigitCount = (num) => {
  const absVal = Math.abs(num);
  return absVal.toString().length;
};

/**
 * Converts a TLE's "leading decimal assumed" notation to a float representation.
 *
 * Example:
 * toLeadingDecimal(12345);
 * -> 0.12345
 */
const _toLeadingDecimal = (num) => {
  const numDigits = _getDigitCount(num);
  const zeroes = '0'.repeat(numDigits - 1);
  return parseFloat(num * `${_LEADING_ZERO_ASSUMED_PREFIX}${zeroes}1`);
};

/**
 * Converts a TLE's "leading decimal assumed" notation with leading zeroes to a float
 * representation.
 *
 * Example:
 * decimalAssumedEToFloat('12345-4');
 * -> 0.000012345
 */
const _decimalAssumedEToFloat = (str) => {
  const numWithAssumedLeadingDecimal = str.substr(0, str.length - 2);
  const num = _toLeadingDecimal(numWithAssumedLeadingDecimal);
  const leadingDecimalPoints = parseInt(str.substr(str.length - 2, 2), 10);
  const float = num * Math.pow(10, leadingDecimalPoints);
  return float.toPrecision(5);
};

/**
 * Converts a fractional day of the year to a timestamp.  Used for parsing the TLE epoch.
 */
const _dayOfYearToTimeStamp = (dayOfYear, year = (new Date()).getFullYear()) => {
  const yearStart = new Date(`1/1/${year} 0:0:0 Z`);

  const yearStartMS = yearStart.getTime();

  return Math.floor(yearStartMS + ((dayOfYear - 1) * _MS_IN_A_DAY));
};

/**
 * Converts a string divided by spacer characters to camelCase representation.
 *
 * Examples:
 * toCamelCase('foo-bar');
 * -> 'fooBar'
 * toCamelCase('foo bar', ' ');
 * -> 'fooBar'
 */
const _toCamelCase = (str, divider = '-') => {
  const bits = str.split(divider);

  const output = [];

  output.push(bits[0]);

  for (let i = 1, len = bits.length; i < len; i++) {
    output.push(bits[i].substr(0, 1).toUpperCase() + bits[i].substr(1, bits[i].length - 1));
  }

  return output.join('');
};

/**
 * Converts radians (0 to 2π) to degrees (0 to 360).
 */
const _radiansToDegrees = radians => radians * (180 / Math.PI);

/**
 * Converts degrees (0 to 360) to radians (0 to 2π).
 */
const _degreesToRadians = degrees => degrees * (Math.PI / 180);

/**
 * Determines if a pair of longitude points crosses over the antemeridian, which is a
 * pain point for mapping software.
 */
const _crossesAntemeridian = (longitude1, longitude2) => {
  if (!longitude1 || !longitude2) return false;

  const isLong1Positive = _isPositive(longitude1);
  const isLong2Positive = _isPositive(longitude2);
  const haveSameSigns = isLong1Positive === isLong2Positive;

  if (haveSameSigns) return false;

  // Signs don't match, so check if we're reasonably near the antemeridian (just to be sure it's
  // not the prime meridian).
  const isNearAntemeridian = Math.abs(longitude1) > 100;

  return isNearAntemeridian;
};

module.exports = {
  _isPositive,
  _getDigitCount,
  _toLeadingDecimal,
  _decimalAssumedEToFloat,
  _dayOfYearToTimeStamp,
  _toCamelCase,
  _radiansToDegrees,
  _degreesToRadians,
  _crossesAntemeridian
};

},{"./constants":18}]},{},[1]);
