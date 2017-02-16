//Globals

//Render Functions
function getAPIData(features,query,format) {
	
	var endpoint = 'https://api.wunderground.com/api/cd7f6d9ca8ab5594/' + features +
	'/q/' + query + '.' + format;

	var settings = {
		success:jsonpFunction
	}
	$.ajax(endpoint,settings);
};

function jsonpFunction(data) {
	console.log(data);
	var response = data.forecast.simpleforecast.forecastday;
	for (var i = 0; i < response.length / 2; i ++) {
		var date = response[i].date.monthname + ' ' + response[i].date.day;
		var icon = response[i].icon_url;
		renderDaysRow1(date,response[i].conditions,icon);
		}
	for (var i = 5; i < response.length; i ++) {
		var date = response[i].date.monthname + ' ' + response[i].date.day;
		var icon = response[i].icon_url;
		renderDaysRow2(date,response[i].conditions,icon);
		}
	};

function renderResultsHeader(location) {
	$('.js-forecast-1').append('<div><p class="results-header">10 Day Forecast for ' + location + '</p></div>');
	}

function renderDaysRow1(day,conditions,icon) {
	$('.js-forecast-1').append('<div class=\'forecastDay col-4 ' + normalizeConditionsText(conditions) + '\'><p>' + day + ':</p><p>' + conditions +
		'</p><img src=' + icon + '>');
	}

function renderDaysRow2(day,conditions,icon) {
	$('.js-forecast-1').append('<div class=\'forecastDay col-4 ' + normalizeConditionsText(conditions) + '\'><p>' + day + ':</p><p>' + conditions +
		'</p><img src=' + icon + '>');
	}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
	}

function normalizeConditionsText(string) {
	return string.replace(/\s/g,'_');
	}

function grabUserQuery() {
	var query = $('.search-bar').val();
	//These lines tokenize and format the user query for use in the API call
		var state = query.slice(-2).toUpperCase();
		var city = query.replace(/\s/g,'_').slice(0,query.length-4);
		var fixedQuery = state + '/' + capitalizeFirstLetter(city);
	getAPIData('forecast10day',fixedQuery,'json');
	renderResultsHeader(capitalizeFirstLetter(city) + ',' + state);
}

//Event Listeners
$(function() {
	$('.search-bar-form').submit(function(event) {
		$('.js-forecast-1').empty();
		$('.js-forecast-2').empty();
		grabUserQuery();
		$('.js-forecast-1').removeClass('hidden');
		$('.js-forecast-2').removeClass('hidden');
		event.preventDefault();
	});
});

//Test Section
