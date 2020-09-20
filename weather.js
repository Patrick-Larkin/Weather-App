$(document).ready(function () {
	//Map
	mapboxgl.accessToken = MAPBOX_TOKEN;
	let coordinates = document.getElementById('coordinates');
	let map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/streets-v11',
		center: [-98.48956909159963, 29.42664874304137],
		zoom: 10
	});
	//Start Controls
	//Start Marker
	//
	// 	let addMarker = function () {
	// 		map.on('click', function (e) {
	// 			// if ()
	// 			marker = new mapboxgl.Marker().setLngLat(e.lngLat).addTo(map).draggable;
	// 			getCoordinates(e.lngLat);
	// 		})
	// 	};

			let getCoordinates = function (location) {
				let longitude = location.lng;
				let latitude = location.lat;
				getForecast(latitude, longitude);
			}

		let marker = addMarker();


	function onDragEnd() {
		let lngLat = marker.getLngLat();
		getForecast(lngLat.lat, lngLat.lng);
		coordinates.style.display = 'block';
		coordinates.innerHTML =
				'Longitude: ' + lngLat.lng + '<br />Latitude: ' + lngLat.lat;
	}

	//End Marker

	//Start Geocode
	let geocoder = new MapboxGeocoder({
		accessToken: mapboxgl.accessToken,
		marker: {
			color: 'orange'
		},
		mapboxgl: mapboxgl
	});

	document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
	//End Geocode
	//End Controls


	// //Start Geocode
	// //Retrieve user input
	// const input = document.getElementById("mapboxgl-ctrl-geocoder--input");
	// geocode(input, MAPBOX_TOKEN).then(function (results) {
	// 	console.log(results);
	// })
	//
	// //Geocode.
	// function geocode(input, MAPBOX_TOKEN) {
	// 	let baseUrl = 'https://api.mapbox.com';
	// 	let endPoint = '/geocoding/v5/mapbox.places/';
	// 	return fetch(baseUrl + endPoint + encodeURIComponent(input) + '.json' + "?" + 'access_token=' + MAPBOX_TOKEN)
	// 			.then(function (res) {
	// 				return res.json();
	// 				// to get all the data from the request, comment out the following three lines...
	// 			}).then(function (data) {
	// 				return data.features[0].center;
	// 			});
	// }


// if box selected = true = imperial, else = imperial
	const getForecast = function (latitude, longitude) {
		jQuery.get("https://api.openweathermap.org/data/2.5/onecall", {
			APPID: OPEN_WEATHER_MAP_KEY,
			lat: latitude,
			lon: longitude,
			exclude: "hourly, minutely",
			units: "imperial"
		}).done(function (data) {
			getPresentForecast(data)
			getFutureForecast(data)
		}).fail(function () {
			alert('error retrieving forecast');
		});
	}

// Single iteration card
	let getPresentForecast = function (data, i = 0) {
		// Did dt ever work whats the value log it
		let currentForecastCard = '';
		currentForecastCard += `<div class="card bg-secondary text-white p-3">
    							    <div class="col">
									      <h5>Today in ${data.name}</h5>
									      <h3>${data.current.temp}</h3>
									 			<img src="http://openweathermap.org/img/w/'${data.current.weather[0].icon}.png" alt="weather-icon">
									 	  	<p>Description: ${data.current.weather[0].description}</p>
									 			<p>Feels Like: ${data.current.feels_like} &#8457</p>
									 		</div>
									 	</div>`;
		// <div class="card d-flex flex-column justify-content-center bg-secondary text-white p-3">
		//   <p>Low: ${data.current.temp} &#8457</p>
		//   <p>High: ${data.current.temp_max}&#8457</p>
		//   <p>Humidity: ${data.main.humidity}%</p>
		//   <p>Pressure: ${data.main.pressure}mb</p>
		// </div>
		document.getElementById("current-weather").innerHTML = currentForecastCard;
	}

// Single iteration card
	let getFutureForecast = function (data, i = 0) {
		// Did dt ever work whats the value log it
		let currentForecastCard = '';
		currentForecastCard += `<div class="card bg-secondary text-white p-3">
    							    <div class="col">
									      <h5>Today in ${data.name}</h5>
									      <h3>${data.current.temp}</h3>
									 			<img src="http://openweathermap.org/img/w/'${data.current.weather[0].icon}.png" alt="weather-icon">
									 	  	<p>Description: ${data.current.weather[0].description}</p>
									 			<p>Feels Like: ${data.current.feels_like} &#8457</p>
									 		</div>
									 	</div>`;
		document.getElementById("fiveDayForecast").innerHTML = currentForecastCard;
	}
});


// if (${data.current.weather[0].description} == raining)