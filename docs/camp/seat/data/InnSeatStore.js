var Reflux = require('reflux');
var InnSeatActions = require('../action/InnSeatActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var InnSeatStore = Reflux.createStore({
	listenables: [InnSeatActions],

	roomUuid: '',
	recordSet: [],

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
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('inn-seat', operation, errMsg);
	},

    onRetrieveHrSeat: function (roomUuid, operation) {
		var opt = operation || 'retrieve';
		var self = this;
		var filter = {};
		filter.roomUuid = roomUuid;
		var url = this.getServiceUrl('hr-seat/retrieve');
        Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function (result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.roomUuid = roomUuid;

				self.fireEvent(opt, '', self);
			}
			else{
				self.fireEvent(opt, "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent(opt, "调用服务错误", self);
		});
	},

	onInitHrSeat: function(roomUuid, operation) {
		if( this.recordSet.length > 0 ){
			if( this.roomUuid === roomUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveHrSeat(roomUuid, operation);
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

module.exports = InnSeatStore;
