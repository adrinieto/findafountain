var map;
var drinking_water_icon = L.icon({
    iconUrl: 'static/drinking_water_color.png',
    iconSize: [40, 40],
})

function getLocation() {
    var options = {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 0,
    };

    if (navigator.geolocation) {
        console.log(navigator.geolocation);
        navigator.geolocation.getCurrentPosition(showPosition, function (err) {
            console.warn('ERROR(' + err.code + '): ' + err.message);
            $("#error").text(err.message).show();
        });
    } else {
        $("#error").text("Geolocation is not supported by this browser").show();
    }
}

function showPosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    $("#location").text("(" + lat.toFixed(2) + ", " + lon.toFixed(2) + ")");
    map.setZoom(15).setView([lat, lon]);
    L.marker([lat, lon]).addTo(map);
    L.circle([lat, lon], position.coords.accuracy, {
        color: 'blue',
        fillOpacity: 0.2
    }).addTo(map);
    getFountains();
}

function getFountains() {
    var bounds = map.getBounds();
    var coords = bounds.getSouth() + "," + bounds.getWest() + "," + bounds.getNorth() + "," + bounds.getEast();

    var api = "http://overpass.osm.rambler.ru/cgi/interpreter";
    var query = "?data=[out:json][timeout:25];(node[\"amenity\"=\"drinking_water\"](" + coords + "););out;";

    console.log(api + query);
    $.get(api + query, function (data) {
        $("#loading").hide();
        $("#found_count").text(data["elements"].length);
        $("#status").show();
        for (var i in data["elements"]) {
            var element = data["elements"][i];
            L.marker([element["lat"], element["lon"]], {
                icon: drinking_water_icon
            }).addTo(map);
        }
    });
}

function init_map() {
    // initialize the map
    map = L.map('map').setView([0, 0], 2);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png ', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        subdomains: ['a', 'b', 'c']
    }).addTo(map);
}

jQuery(function () {
    init_map();
    getLocation();
});
