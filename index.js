//API Functions
function getForecastData(features,query,format) {
	
	var forecastEndpoint = 'https://api.wunderground.com/api/cd7f6d9ca8ab5594/' + features +
	'/q/' + query + '.' + format;

	var settings = {
		success:renderForecast
	}
	$.ajax(forecastEndpoint,settings);
};

//Render Functions
function renderForecast(data) {
	$('.error-div').addClass('hidden');
	if(data.forecast) {
		var response = data.forecast.simpleforecast.forecastday;
		var fullLocation = data.current_observation.display_location.full;
		var creditImage = data.current_observation.image.url
		var creditLink = data.current_observation.forecast_url;
		var currentCondition = data.current_observation.weather;
		var currentConditionIcon = data.current_observation.icon_url;
		var currentTemp = data.current_observation.temperature_string;
		var currentHigh = response[0].high.fahrenheit;
		var currentLow = response[0].low.fahrenheit;
		
		renderResultsHeader(fullLocation);

		for (var i = 0; i < response.length / 2; i ++) {
			var date = response[i].date.monthname + ' ' + response[i].date.day;
			var icon = response[i].icon_url;
			var highTemp = response[i].high.fahrenheit;
			var lowTemp = response[i].low.fahrenheit;
			
			renderDays(date,response[i].conditions,icon,highTemp,lowTemp);
			}
		for (var i = 5; i < response.length; i ++) {
			var date = response[i].date.monthname + ' ' + response[i].date.day;
			var icon = response[i].icon_url;
			var highTemp = response[i].high.fahrenheit;
			var lowTemp = response[i].low.fahrenheit;
			
			renderDays(date,response[i].conditions,icon,highTemp,lowTemp);
			}

		renderCurrentConditions(currentCondition,currentConditionIcon,currentTemp,currentHigh,currentLow);

		renderCreditHeader(creditImage,creditLink);
	} else {
		$('.error-div').removeClass('hidden');
	}

	};

function renderResultsHeader(location) {
	$('.forecast').append('<div><p class="results-header">10 Day Forecast for ' + location + '</p></div>');
	}

function renderCreditHeader(logo,link) {
	$('.credit-header').append('<a href=\"' + link + '\"><img class="credit-logo" src=\"' + logo + '\"></a>');
}

function renderDays(day,conditions,icon,highTemp,lowTemp) {
	$('.forecast').append('<div class=\'forecastDay col-4 ' + normalizeConditionsText(conditions) + '\'><p>' + day + 
		':</p><p class=\"conditions\">' + conditions +
		'</p><img src=' + icon + '><p>H: ' + highTemp + '&degF&nbsp&nbsp&nbspL: ' + lowTemp + '&degF');
	}

function renderCurrentConditions(conditions,iconURL,temp,highTemp,lowTemp) {
	$('.current-conditions').append('<div class=\"results-header\"><p>Current Conditions</p></div><div class=\"col-20 current ' + 
		normalizeConditionsText(conditions) + '\"><p>' + conditions + '</p><img src=\"' + iconURL + '\"><p>Current Temperature: ' + temp +
		'</p><p>Today\'s High: ' + highTemp + '</p><p>Today\'s Low ' + lowTemp + '</p></div>');
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
	}

function normalizeConditionsText(string) {
	return string.replace(/\s/g,'_');
	}

function grabUserQuery() {
	var query = $('.search-bar').val().trim();
	getAutoCompleteData(query);
}

//Event Listeners
$(function() {
	$('.search-bar-form').submit(function(event) {
		event.preventDefault();
		$('.forecast').empty();
		$('.current-conditions').empty();
		$('.credit-header').empty();
		grabUserQuery();
		$('.shifted').removeClass('shifted');
		$('.forecast').removeClass('hidden');
		$('.credit-header').removeClass('hidden');
		$('.current-conditions').removeClass('hidden');
	});
});

//Test Section
function parseAutoCompleteResults(data) {
	var response = JSON.parse(data);
	
	var city = response.predictions[0].terms[0].value;
	var state = response.predictions[0].terms[1].value;
	if(response.predictions[0].terms[2]) {
	var country = response.predictions[0].terms[2].value;
		if(country == 'Canada') {
			state = 'Canada';
		} else if(country == 'Australia') {
			state = 'Australia';
		} else if(country == 'United Kingdom') {
			state = 'United Kingdom';
		} else{};
	}

	var fixedQuery = state + '/' + city;
	
	getForecastData('forecast10day/conditions',fixedQuery,'json');

	var placeID = response.predictions[0].place_id;
	getPlaceDetailsData(placeID);
}

function getAutoCompleteData(query) {
	
	var placesEndpoint = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + query + '&key=AIzaSyAku9hD3BMnnJ0rbB56gqYFJ0CXLd58aKI';

	var settings = {
		crossOrigin:true,
		success:parseAutoCompleteResults
	}
	$.ajax(placesEndpoint,settings);
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function parsePlaceDetailsData(data) {
	var response = JSON.parse(data);

	//var random = getRandomInt(0,9);

	var photoReference = response.result.photos[0].photo_reference;
	var maxwidth = 900;
	var maxheight = 556;

	usePhotoData(photoReference,maxwidth,maxheight);
}

function getPlaceDetailsData(placeID) {

	var detailsEndpoint = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + placeID +'&key=AIzaSyAku9hD3BMnnJ0rbB56gqYFJ0CXLd58aKI';

	var settings = {
		crossOrigin:true,
		success:parsePlaceDetailsData
	};

	$.ajax(detailsEndpoint,settings);
}

function usePhotoData(photoReference,maxWidth,maxheight) {
	
	var photoEndpoint = 'https://maps.googleapis.com/maps/api/place/photo?photoreference=' + photoReference + '&maxwidth=' + maxWidth + '&maxheight=' + maxheight + '&key=AIzaSyAku9hD3BMnnJ0rbB56gqYFJ0CXLd58aKI';
	
	$('.img-holder').html('');
	$('.img-holder').html('<img class="city-image" src=\"' + photoEndpoint + '\">');
};



