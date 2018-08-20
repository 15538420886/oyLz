var Reflux = require('reflux');

var HolidayActions = Reflux.createActions([
	'createHoliday',
	'retrieveHoliday',
	'retrieveHolidayPage',
	'initHoliday',
	{
	    getDateType: {
	        sync: true
	    }
	}
]);

module.exports = HolidayActions;
