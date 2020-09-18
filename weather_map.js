$(document).ready(function () {
	/*---------------- Current Weather Function ---------------*/
	var currentWeather = function () {
		const api_endpoint = 'http://api.openweathermap.org/data/2.5/weather?'
		var q = 'San Antonio';
		$.get(`${api_endpoint}q=${q}&units=imperial&appid=${OPEN_WEATHER_MAP_KEY}`).done(function (data) {
			console.log(data);
			var innerHTML = '';
			innerHTML += '<div class="card bg-secondary text-white p-3">'
			innerHTML += '<div class="col">'
			innerHTML += '<h5>' + "Today in " + data.name + '</h5>'
			innerHTML += '<h3>' + data.main.temp + ' &#8457' + '</h3>'
			innerHTML += '<img src="http://openweathermap.org/img/w/' + data.weather[0].icon + '.png">'
			innerHTML += '<p>' + 'Description: ' + data.weather[0].description + '</p>'
			innerHTML += '<p>' + "Feels Like: " + data.main.feels_like + ' &#8457' + '</p>'
			innerHTML += '</div>'
			innerHTML += '</div>'
			innerHTML += '<div class="card d-flex flex-column justify-content-center bg-secondary text-white p-3">'
			innerHTML += '<p>' + "Low: " + data.main.temp_min + ' &#8457' + '</p>'
			innerHTML += '<p>' + "High: " + data.main.temp_max + ' &#8457' + '</p>'
			innerHTML += '<p>' + "Humidity: " + data.main.humidity + '%' + '</p>'
			innerHTML += '<p>' + "Pressure: " + data.main.pressure + 'mb' + '</p>'
			innerHTML += '</div>'

			$('#current-weather').html(innerHTML);
		});
	}
	currentWeather();

	/*------------------ 5-Day Forecast Function --------------------*/
	var fiveDayForecast = function (lon, lat) {
		const api_endpoint = 'http://api.openweathermap.org/data/2.5/forecast?'
		$.get(`${api_endpoint}lat=${lat}&lon=${lon}&units=imperial&appid=${OPEN_WEATHER_MAP_KEY}`).done(function (data) {
			console.log(data);

			var innerHTML = '';

			for (var i = 0; i < data.list.length; i++) {
				if (data.list[i].dt_txt.includes('12:00:00')) {
					innerHTML += '<div class="card text-white text-center bg-secondary rounded-3 mb-3">'
					innerHTML += '<div class="card-header text-center mb-2">' + daysOfWeek(data.list[i]) + '</div>'
					innerHTML += '<p>' + data.list[i].main.temp_max + ' &#8457' + '</p>'
					innerHTML += '<div class="col">'
					innerHTML += '<img src="http://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png">'
					innerHTML += '<p>' + data.list[i].weather[0].description + '</p>'
					innerHTML += '<p>' + 'Humidity: ' + data.list[i].main.humidity + '%' + '</p>'
					innerHTML += '<p>' + 'Wind Speed: ' + data.list[i].wind.speed + '</p>'
					innerHTML += '<p>' + 'Pressure: ' + data.list[i].main.pressure + 'mb' + '</p>'
					innerHTML += '</div>'
					innerHTML += '</div>'
				}
				$('#fiveDayForecast').html(innerHTML);
			}
			function daysOfWeek(input) {
				var allDays= ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
				var d = new Date(input.dt * 1000); // to get the DateTime.
				var dayName = allDays[d.getDay()]; // It will give day index, and based on index we can get day name from the array.
				return dayName;
			}
		});
	}
	fiveDayForecast();


	/*------------- MapBox API ------------------*/
	mapboxgl.accessToken = MAPBOX_TOKEN
	var coordinates = document.getElementById('coordinates');
	var map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/streets-v11',
		center: [-98.49028690861695, 29.4159976554852],
		zoom: 10
	});

	var marker = new mapboxgl.Marker({
		draggable: true
	})
			.setLngLat([-98.49028690861695, 29.4159976554852])
			.addTo(map);

	function onDragEnd() {
		var lngLat = marker.getLngLat();
		fiveDayForecast(lngLat.lng, lngLat.lat);
		console.log(lngLat);
		return lngLat;
	}

	//console.log(marker.getLngLat());
	marker.on('dragend', onDragEnd);


	var geocoder = new MapboxGeocoder({
		accessToken: MAPBOX_TOKEN,
		mapboxgl: mapboxgl,
		marker: {
			draggable: true
		}
	});

	var searchLong = 0;
	var searchLat = 0;

	geocoder.on('results', function (results) {
		//console.log(results);
		searchLong = results.features[0].center[0]
		searchLat = results.features[0].center[1]
		console.log(searchLong, searchLat);
	});
	fiveDayForecast(searchLong, searchLat);

	$('#geocoder').select(function () {
		$('div .mapboxgl-marker').first().removeClass('mapboxgl-marker') //Why are you not working?!
		fiveDayForecast(searchLong, searchLat); // fiveDayforecast
	});
	document.getElementById('geocoder').appendChild(geocoder.onAdd(map));



	$('#map').mouseup(function () {
		map.flyTo({
			center: [
				onDragEnd().lng, onDragEnd().lat
			],
			zoom: 12,
			essential: true // this animation is considered essential with respect to prefers-reduced-motion
		});
	});

});

$('body').mousemove(function (e) {
	var moveX = (e.pageX * -1 / 15);
	var moveY = (e.pageY * -1 / 15);
	$(this).css('background-position', moveX + 'px ' + moveY + 'px ')
});

// Start Javascript
// 	$(document).ready(function () {
// 		Map
// mapboxgl.accessToken = MAPBOX_TOKEN;
// let map = new mapboxgl.Map({
// 	container: 'map',
// 	style: 'mapbox://styles/mapbox/streets-v9',
// 	center: [-98.4935, 29.4264],
// 	zoom: 10
// });
// map.addControl(
// 		new MapboxGeocoder({
// 			accessToken: mapboxgl.accessToken,
// 			mapboxgl: mapboxgl
// 		})
// );
//
// map.on('click', function (e) {
// 	let location = new mapboxgl.Marker().setLngLat(e.lngLat).addTo(map);
// 	getCoordinates(e.lngLat);
// });
// })
//
// let getCoordinates = function (location) {
// 	let longitude = location.lng;
// 	let latitude = location.lat;
// 	getForecast(latitude, longitude);
// }
//
//
// Searchbox attempt fail
// 	const input = document.getElementById("mapboxgl-ctrl-geocoder--input");
//
//
// 	Geocode
// geocode(input, MAPBOX_TOKEN).then(function (results) {
// 	console.log(results)
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
// let getForecast = function (latitude, longitude) {
// 	$.get("https://api.openweathermap.org/data/2.5/onecall", {
// 		APPID: OPEN_WEATHER_MAP_KEY,
// 		lat: latitude,
// 		lon: longitude,
// 		exclude: "hourly, minutely",
// 		units: "imperial"
// 	}).done(function (data) {
// 		console.log(data)
// 		presentForecast(data)
// 		futureForecast(data)
// 	}).error(function () {
// 		alert('error retrieving forecast');
// 	})
// }
// Single iteration card
// let presentForecast = function (data, i = 0) {
// 	Did dt ever work whats the value log it
// let dt = '<h1>' + data.daily[i].dt + '</h1>';
// $('#card').append(dt);
//
// let tempHTML = '<h3>' + data.daily[i].temp.min + '°f | ' + data.daily[i].temp.max + '°f' + '</h3>';
// $('#temperature').html(tempHTML);
//
// let descriptionHTML = '<h4>' + 'Description: ' + data.daily[i].weather[0].description + '</h4>';
// $('#description').html(descriptionHTML);
//
// let windHTML = '<h4>' + data.daily[i].wind_speed + 'mp/h' + '</h4>';
// $('#wind').html(windHTML);
//
// let popHTML = '<h4>' + data.daily[i].pop + '%' + '</h4>';
// $('#rain').html(popHTML);
// }
//
// let futureForecast = function (data) {
// 	var card = $('cardContainer')
// 	data.daily.forEach(function (i) {
// 		card.append('<h3>' + 'AAAAAAAAA' + '</h3>')
// 	})
// }


// Future iteration card attempt #5
// let futureForecast = function (data) {
// 	// Did dt ever work whats the value log it
// 	// let dt = '<h1>' + data.daily[i].dt + '</h1>';
// 	// $('#card').append(dt);
//     for (let i = 0; i < data.daily.length; i++) {
//     	const createCard = document.createElement('div')
//
// 	$("#cardContainer").append('<h3>' + data.daily[i].temp.min + '°f | ' + data.daily[i].temp.max + '°f' + '</h3>');
// 	$("#cardContainer").append('<h4>' + 'Description: ' + data.daily[i].weather[0].description + '</h4>');
// 	$("#cardContainer").append('<h4>' + data.daily[i].wind_speed + 'mp/h' + '</h4>');
// 	$("#cardContainer").append('<h4>' + data.daily[i].pop + '%' + '</h4>');
// }
// }

// })
// }


// Experimental #2
// data.daily.forEach(function (i) {
// let cardContent ='<div class="card">' + '<div id="description"></div>' + '<div id="humidity"></div>' + '<div id="wind"></div>' + '<div id="pressure"></div>' + '</div>';
// $('#cardContainer').append(cardContent);
// })
// End Loop