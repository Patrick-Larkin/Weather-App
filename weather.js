$(document).ready(function () {
	//Map
	mapboxgl.accessToken = MAPBOX_TOKEN;
	let map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/streets-v9',
		center: [-98.4935, 29.4264],
		zoom: 10,
		draggable: true
	});
	map.addControl(
			new MapboxGeocoder({
				accessToken: mapboxgl.accessToken,
				mapboxgl: mapboxgl
			})
	);

	map.on('click', function (e) {
		let location = new mapboxgl.Marker().setLngLat(e.lngLat).addTo(map);
		getCoordinates(e.lngLat);
	});
})

let getCoordinates = function (location) {
	let longitude = location.lng;
	let latitude = location.lat;
	getForecast(latitude, longitude);
}


//Searchbox attempt fail
// 	const input = document.getElementById("mapboxgl-ctrl-geocoder--input");
//
//
// 	// Geocode
// 	geocode(input, MAPBOX_TOKEN).then(function (results) {
// 		console.log(results)
// 	})
//
// // Basic Function Geocode.
// function geocode(input, MAPBOX_TOKEN) {
// 	var baseUrl = 'https://api.mapbox.com';
// 	var endPoint = '/geocoding/v5/mapbox.places/';
// 	return fetch(baseUrl + endPoint + encodeURIComponent(input) + '.json' + "?" + 'access_token=' + MAPBOX_TOKEN)
// 			.then(function (res) {
// 				return res.json();
// 				// to get all the data from the request, comment out the following three lines...
// 			}).then(function (data) {
// 				return data.features[0].center;
// 			});
// }


// if box selected = true = imperial, else = imperial
let getForecast = function (latitude, longitude) {
	$.get("https://api.openweathermap.org/data/2.5/onecall", {
		APPID: OPEN_WEATHER_MAP_KEY,
		lat: latitude,
		lon: longitude,
		exclude: "hourly, minutely",
		units: "imperial"
	}).done(function (data) {
		console.log(data)
		presentForecast(data)
		futureForecast(data)
	}).error(function () {
		alert('error retrieving forecast');
	})
}

// Single iteration card
let presentForecast = function (data, i = 0) {
	// Did dt ever work whats the value log it
	let dt = '<h1>' + data.daily[i].dt + '</h1>';
	$('#card').append(dt);

	let tempHTML = '<h3>' + data.daily[i].temp.min + '°f | ' + data.daily[i].temp.max + '°f' + '</h3>';
	$('#temperature').html(tempHTML);

	let descriptionHTML = '<h4>' + 'Description: ' + data.daily[i].weather[0].description + '</h4>';
	$('#description').html(descriptionHTML);

	let windHTML = '<h4>' + data.daily[i].wind_speed + 'mp/h' + '</h4>';
	$('#wind').html(windHTML);

	let popHTML = '<h4>' + data.daily[i].pop + '%' + '</h4>';
	$('#rain').html(popHTML);
}

// let futureForecast = function (data) {
// 	var card = $('cardContainer')
// 	data.daily.forEach(function (i) {
// 		card.append('<h3>' + 'AAAAAAAAA' + '</h3>')
// 	})
// }


// Future iteration card attempt #5
let futureForecast = function (data) {
	// 	// Did dt ever work whats the value log it
	// 	// let dt = '<h1>' + data.daily[i].dt + '</h1>';
	// 	// $('#card').append(dt);
	for (let i = 0; i < data.daily.length; i++) {
		const createCard = document.createElement('div')

		$("#cardContainer").append('<h3>' + data.daily[i].temp.min + '°f | ' + data.daily[i].temp.max + '°f' + '</h3>');
		$("#cardContainer").append('<h4>' + 'Description: ' + data.daily[i].weather[0].description + '</h4>');
		$("#cardContainer").append('<h4>' + data.daily[i].wind_speed + 'mp/h' + '</h4>');
		$("#cardContainer").append('<h4>' + data.daily[i].pop + '%' + '</h4>');
	}
}

// })
// }


// Experimental #2
// data.daily.forEach(function (i) {
// let cardContent ='<div class="card">' + '<div id="description"></div>' + '<div id="humidity"></div>' + '<div id="wind"></div>' + '<div id="pressure"></div>' + '</div>';
// $('#cardContainer').append(cardContent);
// })
// End Loop