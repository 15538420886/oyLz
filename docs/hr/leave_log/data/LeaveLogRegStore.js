var Reflux = require('reflux');
var LeaveLogActions = require('../action/LeaveLogActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var LeaveLogRegStore = Reflux.createStore({
	listenables: [LeaveLogActions],

	filter: {},
	leave: {},
    staffCode:'',
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
			filter:self.filter,
            leave : self.leave,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('hr-leaveLog', operation, errMsg);
	},
	onGetCacheData: function() {
		this.fireEvent('cache', '', this);
	},
	onRetrieveHrLeaveLogReg: function(filter) {
		var self = this;
		var url = this.getServiceUrl('hr-leaveLog/retrieve');
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

	onRetrieveHrLeaveLogRegPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHrLeaveLogReg( filter );
	},

	onInitHrLeaveLogReg: function(filter) {
		if( this.recordSet.length > 0 ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		this.onRetrieveHrLeaveLogReg(filter);
	},

	onRefreshPage:function(leave){
		var self = this;
		// 数据没有变更
		if(Utils.compareTo(self.leave, leave)){
			console.log('数据没有变更');
			self.fireEvent('update', '', self);
			return;
		}

		Utils.copyValue(leave, self.leave);
		self.fireEvent('update', '', self);
	},

    onRetrieveLeave: function(staffCode){
        if( this.staffCode !== undefined ){
			if( this.staffCode === staffCode){
				this.fireEvent('retrieveLeave', '', this);
				return;
			}
		}
        var self = this;
        var filter = {};
        filter.staffCode = staffCode;
        filter.corpUuid = window.loginData.compUser.corpUuid;
		var url = this.getServiceUrl('hr-leave/retrieve');
		Utils.doRetrieveService(url, filter, 0, 0, 0).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				if(result.object.list.length === 1){
					self.leave = result.object.list[0];
					self.staffCode = staffCode;
					self.fireEvent('retrieveLeave', '', self);
				}
				else{
					self.fireEvent('retrieveLeave', "没有找到记录["+result.object.list.length+"]", self);
				}
			}
			else{
				self.fireEvent('retrieveLeave', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieveLeave', "调用服务错误", self);
		});
    },

	onCreateHrLeaveLogRegWithLeave: function(obj){
		var self = this;
		var filter = obj;
		var url = this.getServiceUrl('hr-leaveLog/create2');
		Utils.doGetRecordService(url, filter).then(function(result) {
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

	onUpdateHrLeaveLogRegWithLeave: function(obj){
		var self = this;
		var filter = obj;
		var idx = Utils.findRecord( self, obj.log.uuid );

		if(idx < 0){
			self.fireEvent('update', '没有找到记录['+obj.log.uuid+']', self);
			return;
		}

		var url = this.getServiceUrl('hr-leaveLog/update2');
		Utils.doGetRecordService(url, filter).then(function(result) {
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

	onCreateHrLeaveLogReg: function(leaveLog) {
		var url = this.getServiceUrl('hr-leaveLog/create');
		Utils.recordCreate(this, leaveLog, url);
	},

	onUpdateHrLeaveLogReg: function(leaveLog) {
		var url = this.getServiceUrl('hr-leaveLog/update');
		Utils.recordUpdate(this, leaveLog, url);
	},

});

module.exports = LeaveLogRegStore;
