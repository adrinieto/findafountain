var map;

function getLocation(){
    if (navigator.geolocation) {
   		navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        $("#x").text("Geolocation is not supported by this browser.");
    }
}

function showPosition(position){
	[lat, lon] = [position.coords.latitude, position.coords.longitude];
	$("#status").html("Latitude: " + lat +", longitude: " + lon);
	map.setZoom(15).setView([lat, lon]);
	L.marker([lat, lon]).addTo(map);
	L.circle([lat, lon], position.coords.accuracy, {
			color: 'blue',
			fillOpacity: 0.5
		}
	).addTo(map);
}


function init_map(){	
	// initialize the map
	map = L.map('map').setView([0,0], 2);
	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png ', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		maxZoom: 18,
		subdomains: ['a','b','c']
	}).addTo(map);
}

jQuery(function(){
	init_map();
	getLocation();
});