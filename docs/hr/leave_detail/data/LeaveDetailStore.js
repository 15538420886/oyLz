var Reflux = require('reflux');
var LeaveDetailActions = require('../action/LeaveDetailActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var LeaveDetailStore = Reflux.createStore({
	listenables: [LeaveDetailActions],

	userUuid: '',
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,

	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.hrUrl+action;
	},

	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			userUuid: self.userUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('hr-leave-detail', operation, errMsg);
	},

	onRetrieveHrLeaveDetail: function(userUuid) {
		var self = this;
		var filter = {};
		filter.userUuid = userUuid;
		var url = this.getServiceUrl('hr-leave-detail/get-by-userUuid');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.userUuid = userUuid;

				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onRetrieveHrLeaveDetailPage: function(userUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHrLeaveDetail( userUuid );
	},

	onInitHrLeaveDetail: function(userUuid) {
		if( this.recordSet.length > 0 ){
			if( this.userUuid === userUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveHrLeaveDetail(userUuid);
	},

	onCreateHrLeaveDetailWithLeave: function(obj){
		var self = this;
		var url = this.getServiceUrl('hr-leave-detail/create2');
		Utils.doGetRecordService(url, obj).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet.push(result.object);

				self.totalRow = self.totalRow + 1;
				self.fireEvent('create', '', self);
			}
			else{
				self.fireEvent('create', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('create', "调用服务错误", self);
		});
	},

	onUpdateHrLeaveDetailWithLeave: function(obj){
		var self = this;
		var idx = Utils.findRecord( self, obj.detail.uuid );
		if(idx < 0){
			self.fireEvent('update', '没有找到记录['+obj.detail.uuid+']', self);
			return;
		}

		var url = this.getServiceUrl('hr-leave-detail/update2');
		Utils.doGetRecordService(url, obj).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				Utils.copyValue(result.object, self.recordSet[idx]);

				self.fireEvent('update', '', self);
			}
			else{
				self.fireEvent('update', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('update', "调用服务错误", self);
		});
	},

    onRefreshPage: function (detail) {
        var self = this;
        detail.map((record, i) => {
            var idx = Utils.findRecord(self, record.uuid);
            if (idx >= 0) {
                Utils.copyValue(record, self.recordSet[idx]);
            }
        });

		self.fireEvent('update', '', self);
	},

	onDeleteHrLeaveDetail: function(uuid) {
		var url = this.getServiceUrl('hr-leave-detail/remove');
		Utils.recordDelete(this, uuid, url);
	},
});

module.exports = LeaveDetailStore;
