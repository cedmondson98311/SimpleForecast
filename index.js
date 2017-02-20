//API Functions
function getAPIData(features,query,format) {
	
	var forecastEndpoint = 'https://api.wunderground.com/api/cd7f6d9ca8ab5594/' + features +
	'/q/' + query + '.' + format;

	var settings = {
		success:jsonpFunction
	}
	$.ajax(forecastEndpoint,settings);
};

//Render Functions
function jsonpFunction(data) {
	console.log(data);
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
	//These lines tokenize and format the user query for use in the API call
		var state = query.slice(-2).toUpperCase();
		console.log(state);
		var city = query.replace(/\s/g,'_').slice(0,query.indexOf(','));
		console.log(city);
		var fixedQuery = state + '/' + capitalizeFirstLetter(city);
		console.log(fixedQuery);
	getAPIData('forecast10day/conditions',fixedQuery,'json');
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
