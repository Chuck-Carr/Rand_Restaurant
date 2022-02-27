import { key, url } from "./api.js";

let geocode = {
  reverseGeocode: function (latitude, longitude) {
    let api_key = key;
    let api_url = url;

    let request_url =
      api_url +
      "?" +
      "key=" +
      api_key +
      "&q=" +
      encodeURIComponent(latitude + "," + longitude) +
      "&pretty=1" +
      "&no_annotations=1";

    // see full list of required and optional parameters:
    // https://opencagedata.com/api#forward

    let request = new XMLHttpRequest();
    request.open("GET", request_url, true);

    request.onload = function () {
      // see full list of possible response codes:
      // https://opencagedata.com/api#codes

      if (request.status === 200) {
        // Success!
        let data = JSON.parse(request.responseText);
        console.log(data.results[0]);
        console.log(data.results[0].geometry.lat);
        console.log(data.results[0].geometry.lng); // print the location
        document.getElementById("lat").value = data.results[0].geometry.lat;
        document.getElementById("long").value = data.results[0].geometry.lng;
      } else if (request.status <= 500) {
        // We reached our target server, but it returned an error

        console.log("unable to geocode! Response code: " + request.status);
        let data = JSON.parse(request.responseText);
        console.log("error msg: " + data.status.message);
      } else {
        console.log("server error");
      }
    };

    request.onerror = function () {
      // There was a connection error of some sort
      console.log("unable to connect to server");
    };

    request.send(); // make the request
  },
  getLocation: function () {
    function success(data) {
      geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
    }
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(success, console.error);
  },
};
geocode.getLocation();
