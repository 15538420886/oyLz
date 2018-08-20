var Reflux = require('reflux');
var FindNameActions = require('../action/FindNameActions');

var FindNameStore = Reflux.createStore({
	listenables: [FindNameActions],

	init: function() {
	},

	onFindName: function(resName, uuid, name) {
		this.trigger({
			resName: resName,
			uuid: uuid,
			name: name
		});
	}
});

module.exports = FindNameStore;
