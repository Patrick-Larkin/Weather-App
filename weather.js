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
		presentForecast(data)
		// futureForecast(data)
	}).error(function () {
		alert('error retrieving forecast');
	});
}

// Single iteration card
let presentForecast = function (data, i = 0) {
	// Did dt ever work whats the value log it
	console.log(data);
	let forecastCard = ''
	forecastCard += `<div class="card bg-secondary text-white p-3">
    					    <div class="col">
							      <h5>Today in ${data.name}</h5>
							      <h3>${data.current.temp}</h3>
										<img src="http://openweathermap.org/img/w/'${data.current.weather[0].icon}.png">
								  	<p>Description: ${data.current.weather[0].description}</p>
										<p>Feels Like: ${data.current.feels_like} &#8457</p>
									</div>
								</div>`;
									// <div class="card d-flex flex-column justify-content-center bg-secondary text-white p-3">
									//   <p>Low: ${data.current.temp} &#8457</p>
									//   <p>High: ${data.main.temp_max}&#8457</p>
									//   <p>Humidity: ${data.main.humidity}%</p>
									//   <p>Pressure: ${data.main.pressure}mb</p>
									// </div>`;
	return forecastCard;
}
$('#current-weather').innerHTML(forecastCard)
