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

function renderDaysRow1(day,conditions,icon) {
	$('.js-forecast-1').append('<div class=\'forecastDay col-4\'><p>' + day + ':</p><p>' + conditions +
		'</p><img src=' + icon + '>');
	}

function renderDaysRow2(day,conditions,icon) {
	$('.js-forecast-2').append('<div class=\'forecastDay col-4\'><p>' + day + ':</p><p>' + conditions +
		'</p><img src=' + icon + '>');
	}

//Event Listeners
$(function() {
	$('.search-bar-form').submit(function(event) {
		//Convert the search term from standard format to what the API expects
		var query = $('.search-bar').val();
		var state = query.slice(-2).toUpperCase();
		var city = query.replace(/\s/g,'_').slice(0,query.length-4);
		var fixedQuery = state + '/' + city;

		getAPIData('forecast10day',fixedQuery,'json');
		//$('.search-bar-form').addClass('hidden');
		$('.js-forecast-1').removeClass('hidden');
		$('.js-forecast-2').removeClass('hidden');
		event.preventDefault();
	});
});




//Test Function Calls
//getAPIData('forecast10day','WA/Seattle','json');


//Seattle, WA

//WA/Seattle

//query.replace(/\s | \,/g,'')