var Reflux = require('reflux');
var MsgActions = require('../action/MsgActions');

var MsgStore = Reflux.createStore({
	listenables: [MsgActions],

	init: function() {
	},

	onShowError: function(resName, operation, errMsg) {
		this.trigger({
			resName: resName,
			operation: operation,
			errMsg: errMsg
		});
	}
});

module.exports = MsgStore;
