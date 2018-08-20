var Reflux = require('reflux');
var LeaveActions = require('../action/LeaveActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var LeaveStore = Reflux.createStore({
	listenables: [LeaveActions],
	
    filter: {},
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
			filter: self.filter,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('hr-leave', operation, errMsg);
	},
	onGetCacheData: function() {
		this.fireEvent('cache', '', this);
	},
	
	onRetrieveHrLeave: function(filter) {
		var self = this;
		var url = this.getServiceUrl('hr-leave/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.filter = filter;
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onRetrieveHrLeavePage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHrLeave( filter );
	},
	
	onInitHrLeave: function(filter) {
		
		if( this.recordSet.length > 0 ){
			if( JSON.stringify(this.filter)===JSON.stringify(filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveHrLeave(filter);
	},

	onRefreshPage:function(leave){
		var self = this;
		var idx = Utils.findRecord( self, leave.uuid );
		if(idx < 0){
			self.fireEvent('update', '没有找到记录['+leave.uuid+']', self);
			return;
		}
		// 数据没有变更
		if(Utils.compareTo(self.recordSet[idx], leave)){
			console.log('数据没有变更');
			self.fireEvent('update', '', self);
			return;
		}

		Utils.copyValue(leave, self.recordSet[idx]);
		self.fireEvent('update', '', self);

	},
	
	onCreateHrLeave: function(leave) {
		var self = this;
		var url = this.getServiceUrl('hr-leave/create');
		Utils.doGetRecordService(url, leave).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				result.object.staffCode = leave.staffCode;
				result.object.perName = leave.perName;
				result.object.deptName = leave.deptName;
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
	
	onUpdateHrLeave: function(leave) {
		var url = this.getServiceUrl('hr-leave/update');
		Utils.recordUpdate(this, leave, url);
	},
	
	onDeleteHrLeave: function(uuid) {
		var url = this.getServiceUrl('hr-leave/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = LeaveStore;