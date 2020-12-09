(function () {
	"use strict";
	$().ready(function () {
		let lat = 29.424122
		let lon = -98.493629

		mapboxgl.accessToken = MAPBOX_TOKEN;
		let map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/outdoors-v11',
			center: [lon, lat], // default position [lng, lat]
			zoom: 10
		});
		let nav = new mapboxgl.NavigationControl();
		map.addControl(nav, 'top-left');

		/*=================Weather Functions=================*/
		function currentWeatherLoad() {
			$.get("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely&appid=" + OPEN_WEATHER_MAP_KEY + "&units=imperial"
			).done(function (data) {
						console.log(data);
						$('#weatherType').html(data.current.weather[0].main)
						$('#degrees').html(Math.round(data.current.temp) + '&#176')
						$('#cloudy').html(data.current.clouds + '%')
						$('#humidity').html(data.current.humidity + '%')
						$('#wind').html(data.current.wind_speed + ' km/h')
						$('#sunrise').html(data.current.sunrise + ' am')
						$('#sunset').html(data.current.sunset + ' pm')

						//Turn DT into readable data/time stamp
						//Uses dayInput Switch function
						var unix = data.current.dt * 1000
						var date = new Date(unix)
						$('#date').html(dayInput(date.getDay()) + ' ' + date.getDate() + ', ' + date.getFullYear() + '<br>\n' +
								'Last Updated: ' + date.getHours() + ':' + date.getMinutes())

						//Rain data is not guaranteed
						if (data.daily[0].rain === undefined) {
							$('#rain').html('No Available Data')
						} else {
							$('#rain').html(data.daily[0].rain + ' mm')
						}

						//Weekly injection
						for (let i = 1; i <= data.daily.length - 1; i++) {
							unix = data.daily[i].dt * 1000
							date = new Date(unix)
							if (dayInput(date.getDay()) === 'Sunday') {
								$('#Sunday').html('<p>Sunday</p>' + 'L: ' + Math.round(data.daily[i].temp.min) + ' ' + 'H: ' + Math.round(data.daily[i].temp.max))
							} else if (dayInput(date.getDay()) === 'Monday') {
								$('#Monday').html('<p>Monday</p>' + 'L: ' + Math.round(data.daily[i].temp.min) + ' ' + 'H: ' + Math.round(data.daily[i].temp.max))
							} else if (dayInput(date.getDay()) === 'Tuesday') {
								$('#Tuesday').html('<p>Tuesday</p>' + 'L: ' + Math.round(data.daily[i].temp.min) + ' ' + 'H: ' + Math.round(data.daily[i].temp.max))
							} else if (dayInput(date.getDay()) === 'Wednesday') {
								$('#Wednesday').html('<p>Wednesday</p>' + 'L: ' + Math.round(data.daily[i].temp.min) + ' ' + 'H: ' + Math.round(data.daily[i].temp.max))
							} else if (dayInput(date.getDay()) === 'Thursday') {
								$('#Thursday').html('<p>Thursday</p>' + 'L: ' + Math.round(data.daily[i].temp.min) + ' ' + 'H: ' + Math.round(data.daily[i].temp.max))
							} else if (dayInput(date.getDay()) === 'Friday') {
								$('#Friday').html('<p>Friday</p>' + 'L: ' + Math.round(data.daily[i].temp.min) + ' ' + 'H: ' + Math.round(data.daily[i].temp.max))
							} else if (dayInput(date.getDay()) === 'Saturday') {
								$('#Saturday').html('<p>Saturday</p>' + 'L: ' + Math.round(data.daily[i].temp.min) + ' ' + 'H: ' + Math.round(data.daily[i].temp.max))
							}
						}
					}
			)
		}
		currentWeatherLoad() //Auto loads current weather

		/*Link for each day of the week = updates projected detailed forecast*/
		$('.dayOfTheWeek').click(function () {
			var dayOut = $(this).attr('id')
			detailedForecast(dayOut)
		})

		/*Function for detailed*/
		function detailedForecast(day) {
			/*Defualt get detailed forecast = San Antonio*/
			$.get("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely&appid=" + OPEN_WEATHER_MAP_KEY + "&units=imperial"
			).done(function (data) {
				for (let i = 0; i <= data.daily.length - 1; i++) {
					let unix = data.daily[i].dt * 1000
					let date = new Date(unix)
					if ((dayInput(date.getDay()) === day)) {
						$('#weatherType').html(data.daily[i].weather[0].description)
						$('#degrees').html(Math.round(data.daily[i].temp.max) + '&#176')
						$('#date').html(dayInput(date.getDay()) + ' ' + date.getDate() + ', ' + date.getFullYear() + '<br>\n' +
								'Last Updated: ' + date.getHours() + ':' + date.getMinutes())
						$('#cloudy').html(data.daily[i].clouds + '%')
						$('#humidity').html(data.daily[i].humidity + '%')
						$('#wind').html(data.daily[i].wind_speed + ' km/h')
						$('#sunrise').html(data.daily[i].sunrise + ' pm')
						$('#sunset').html(data.daily[i].sunset + ' pm')
						//Rain is not guaranteed
						if (data.daily[i].rain === undefined) {
							$('#rain').html('No Available Data')
						} else {
							$('#rain').html(data.daily[i].rain + ' mm')
						}
					}
				}
			})
		}

		//Displays current weather for selected place
		$('#update').click(currentWeatherLoad)


		function findForUser() {
			//Todo: Create reverse geocode function that the user is able to choose
			var userInput = document.getElementById('userSearch')
				geocode(userInput.value, MAPBOX_TOKEN)
						.then(function (result) {
							lat = result[1]
							lon = result[0]
							$.get("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely&appid=" + OPEN_WEATHER_MAP_KEY + "&units=imperial"
							).done(function (data) {
								$('#cityName').html(data.name)
								$('#update').html('Show Current Weather for: ' + data.name)
								console.log(data)
							})
							let LLObj = {lng: lon, lat: lat}
							createMarker(LLObj)
							currentWeatherLoad()
							document.getElementById('map').scrollIntoView()
						});
			}

		/*=================Map Functions=================*/
		function createMarker(LLObj) {
			let userMarker = new mapboxgl.Marker()
					.setLngLat(LLObj)
					.addTo(map)
					.setDraggable(true)
			map.setCenter(LLObj);
			map.setZoom(8);
			reverseGeocode(LLObj, MAPBOX_TOKEN).then(function (data) {
				let address = data.features[0].place_name
				userMarker.setPopup(new mapboxgl.Popup()
						.setHTML("<p style='color: black; text-align: center'>" + address + "</p>"))
			})

			function onDragEnd() {
				let lngLat = userMarker.getLngLat()
				lat = lngLat.lat
				lon = lngLat.lng
				map.setCenter(lngLat)
				map.setZoom(10)
				reverseGeocode(lngLat, MAPBOX_TOKEN).then(function (data) {
					let address = data.features[0].place_name
					userMarker.setPopup(new mapboxgl.Popup()
							.setHTML("<p style='color: black; text-align: center'>" + address + "</p>"))
				})
				$.get("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely&appid=" + OPEN_WEATHER_MAP_KEY + "&units=imperial"
				).done(function (data) {
					$('#cityName').html(data.name)
					$('#update').html('Show Current Weather for: ' + data.name)
				})
				currentWeatherLoad()
			}

			userMarker.on('dragend', onDragEnd)
		}

		$('#search').click(findForUser)

			let dayInput = function (input) {
				switch (input) {
					case 0:
						return "Sunday"
						break;
					case 1:
						return "Monday"
						break;
					case 2:
						return "Tuesday"
						break;
					case 3:
						return "Wednesday"
						break;
					case 4:
						return "Thursday"
						break;
					case 5:
						return "Friday"
						break;
					case 6:
						return "Saturday"
						break;
			}
		}
	});
})();



