var Reflux = require('reflux');
var LeaveDetailActions = require('../action/LeaveDetailActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var LeaveDetailRegStore = Reflux.createStore({
	listenables: [LeaveDetailActions],

	filter: {},
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,

	// 假日数量
	staffCode:'',
	leave: {},

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
			staffCode: self.staffCode,
			leave: self.leave,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('hr-leave-detail', operation, errMsg);
	},
	onGetCacheData: function() {
		this.fireEvent('cache', '', this);
	},

	onRetrieveHrLeaveDetailReg: function(filter) {
		var self = this;
		var url = this.getServiceUrl('hr-leave-detail/retrieve');
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
	// 批量导入
	onBatchCreateLeaveDetailReg: function(arr) {
		var self = this;
		var url = this.getServiceUrl('hr-leave-detail/batch-create');
		Utils.doGetRecordService(url, arr).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				
				self.arr = arr;

				self.fireEvent('batch-create', '', self);
			}
			else{
				self.fireEvent('batch-create', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('batch-create', "调用服务错误", self);
		});
	},

	onRetrieveHrLeaveDetailRegPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHrLeaveDetailReg( filter );
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
				}
				else{
					result.object.list.map(data =>{
						if(data.staffCode === staffCode){
							self.leave = data;
						};
					})
				}
				self.staffCode = staffCode;
				self.fireEvent('retrieveLeave', '', self);
			}
			else{
				self.fireEvent('retrieveLeave', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieveLeave', "调用服务错误", self);
		});
    },

    onRefreshRegPage: function (leave) {
		var self = this;

		// 修改数量
		if(!Utils.compareTo(self.leave, leave)){
			Utils.copyValue(leave, self.leave);
		}

		self.fireEvent('update', '', self);
	},

	onDeleteHrLeaveDetailReg: function(uuid) {
		var url = this.getServiceUrl('hr-leave-detail/remove');
		Utils.recordDelete(this, uuid, url);
	},

	onCreateHrLeaveDetailRegWithLeave: function(obj){
		var self = this;
		var url = this.getServiceUrl('hr-leave-detail/create2');
		Utils.doGetRecordService(url, obj).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				// 员工信息
				var dt = obj.detail;
				result.object.staffCode = dt.staffCode;
				result.object.perName = dt.perName;
				result.object.deptUuid = dt.deptUuid;
				result.object.deptName = dt.deptName;

				Utils.copyValue(obj.leave, self.leave);	// 更新休假数量
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

	onUpdateHrLeaveDetailRegWithLeave: function(obj){
		var self = this;
		var idx = Utils.findRecord( self, obj.detail.uuid );
		if(idx < 0){
			self.fireEvent('update', '没有找到记录['+obj.detail.uuid+']', self);
			return;
		}

		var url = this.getServiceUrl('hr-leave-detail/update2');
		Utils.doGetRecordService(url, obj).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				Utils.copyValue(obj.leave, self.leave);	// 更新休假数量
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

});

module.exports = LeaveDetailRegStore;
