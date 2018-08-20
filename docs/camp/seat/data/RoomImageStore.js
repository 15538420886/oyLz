var Reflux = require('reflux');
var RoomImageActions = require('../action/RoomImageActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var RoomImageStore = Reflux.createStore({
	listenables: [RoomImageActions],

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
		var url = this.getServiceUrl('hr-seat/retrieve1');
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

	onBatchUpdateHrSeat: function(modifyList) {
		var url = this.getServiceUrl('hr-seat/batchUpdate');
        var self = this;
		Utils.doUpdateService(url, modifyList).then(function(result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                var recordSetMap = {}
                self.recordSet.map(rec => {
                    recordSetMap[rec.seatCode] = rec;
                });
                result.object.map(obj => {
                    recordSetMap[obj.seatCode] = obj;
                });
                var recordSet = [];
                for(var seatCode in recordSetMap){
                    recordSet.push(recordSetMap[seatCode]);
                }
                self.recordSet = recordSet;
				self.fireEvent('batchUpdate', '', self);
			}
			else{
				self.fireEvent('batchUpdate', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
            self.fireEvent('batchUpdate', Utils.getResErrMsg(value), self);
		});
	},

});

module.exports = RoomImageStore;
