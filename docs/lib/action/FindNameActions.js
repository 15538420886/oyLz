var Reflux = require('reflux');

var FindNameActions = Reflux.createActions([
	{
	    findName: {
	        sync: true
	    }
	}
]);

module.exports = FindNameActions;
