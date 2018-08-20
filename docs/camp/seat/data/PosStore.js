var Reflux = require('reflux');
var PosActions = require('../action/PosActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var PosStore = Reflux.createStore({
	listenables: [PosActions],

	roomUuid: '',
    date: '',
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,

	init: function() {
	},

	getServiceUrl: function(action)
	{
		return Utils.campUrl+action;
	},

	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			roomUuid: self.roomUuid,
    		date: self.date,
			recordSet: self.recordSet,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('day-pos', operation, errMsg);
	},

	onRetrieveRoomSeat: function(roomUuid, date) {
		var self = this;
		var filter = {};
		filter.roomUuid = roomUuid;
		filter.date = date;
		var url = this.getServiceUrl('day-pos/retrieve2');
		Utils.doRetrieveService(url, filter, 0, 0, 0).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object ? result.object : [];
				self.roomUuid = roomUuid;
				self.date = date;

				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onInitRoomSeat: function(roomUuid, date) {
		if( this.recordSet.length > 0 ){
			if( this.roomUuid === roomUuid && this.date === date ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveRoomSeat(roomUuid, date);
	},
});

module.exports = PosStore;
