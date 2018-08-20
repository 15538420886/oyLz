var Reflux = require('reflux');
var LeaveApplyActions = require('../action/LeaveApplyActions');
var Utils = require('../../../../public/script/utils');
var Common = require('../../../../public/script/common');
var MsgActions = require('../../../../lib/action/MsgActions');

var LeaveApplyStore = Reflux.createStore({
	listenables: [LeaveApplyActions],
	
	filter: {},
	recordSet: [],
	allowLog:{},
	startPage : 0,
	pageRow : 0,
	totalRow : 0,
	
	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.costUrl+action;
	},
	
	fireEvent: function(operation, errMsg, self)
    {
        // 倒序
        Common.sortTable(self.recordSet, 'beginDate', true);

		self.trigger({
			filter: self.filter,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

        if (errMsg.indexOf('没有找到记录') >= 0) {
            errMsg = '';
        }

		MsgActions.showError('leave_apply', operation, errMsg);
	},
	
	onRetrieveLeaveApply: function(filter) {
		var self = this;
		var url = this.getServiceUrl('leave_apply/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet= result.object.list;
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
	
	onRetrieveLeaveApplyPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveLeaveApply( filter );
	},
	
	onInitLeaveApply: function(filter) {
		if( Utils.compareTo(this.filter, filter) ){
			this.fireEvent('retrieve', '', this);
			return;
		}
		
		this.onRetrieveLeaveApply(filter);
	},

	onCreateLeaveApply: function(leaveApply) {
		var url = this.getServiceUrl('leave_apply/create');
		Utils.recordCreate(this, leaveApply, url);
	},

    onUpdateLeaveApply: function (leaveApply) {
		var url = this.getServiceUrl('leave_apply/update');
		Utils.recordUpdate(this, leaveApply, url);
	},

	onCancelLeaveApply: function(leaveApply) {
		var url = this.getServiceUrl('leave_apply/cancel');
		Utils.recordUpdate(this, leaveApply, url);
	},

	onRevokeLeaveApply: function(leaveApply){
		var url = this.getServiceUrl('leave_apply/revoke');
		Utils.recordUpdate(this, leaveApply, url);
	}

});

module.exports = LeaveApplyStore;

