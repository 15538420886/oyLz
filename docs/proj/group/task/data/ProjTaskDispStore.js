var Reflux = require('reflux');
var ProjTaskDispActions = require('../action/ProjTaskDispActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ProjTaskDispStore = Reflux.createStore({
	listenables: [ProjTaskDispActions],
	
	filter: '',
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,
	
	init: function() {
	},

});

module.exports = ProjTaskDispStore;
