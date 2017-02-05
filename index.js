//Globals

//Render Functions
function getAPIData(searchTerm,cbfunction) {
	console.log('getAPIData called');
	
	var settings = {
	dataType:'jsonp',
	q:searchTerm,
	type:'shows',
	k:'258899-Thinkful-7PYLQECB',
	success:cbfunction
	};

	$.ajax('https://www.tastekid.com/api/similar',settings);
};

function useAPIData(data) {
	console.log('useAPIData called');
	console.log(data)
}

function completeFunction() {
	console.log('ajax call complete');
}

function successFunction(data,textStatus,jqXHR) {
	console.log('successful call');
}

//AJAX Calls
$(function() {
	//$.ajax('https://www.tastekid.com/api/similar',settings);
	//$.getJSON('https://www.tastekid.com/api/similar',settings,useAPIData);
	getAPIData('game of thrones',useAPIData)
});


//Event Listeners


