var Reflux = require('reflux');
var SeatActions = require('../action/SeatActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var SeatStore = Reflux.createStore({
	listenables: [SeatActions],

	roomUuid: '',
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
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('hr-seat', operation, errMsg);
	},

	onRetrieveHrSeat: function(roomUuid) {
		var self = this;
		var filter = {};
		filter.roomUuid = roomUuid;
		var url = this.getServiceUrl('hr-seat/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.roomUuid = roomUuid;

				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onInitHrSeat: function(roomUuid) {
		if( this.recordSet.length > 0 ){
			if( this.roomUuid === roomUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveHrSeat(roomUuid);
	},

	onCreateHrSeat: function(seat) {
		var url = this.getServiceUrl('hr-seat/create');
		Utils.recordCreate(this, seat, url);
	},

	onUpdateHrSeat: function(seat) {
		var url = this.getServiceUrl('hr-seat/update');
		Utils.recordUpdate(this, seat, url);
	},

	onDeleteHrSeat: function(uuid) {
		var url = this.getServiceUrl('hr-seat/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = SeatStore;
