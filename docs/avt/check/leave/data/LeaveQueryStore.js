'use strict';

var Reflux = require('reflux');
var LeaveQueryActions = require('../action/LeaveQueryActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var LeaveQueryStore = Reflux.createStore({
	listenables: [LeaveQueryActions],

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
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});
		MsgActions.showError('hr-leaveLog', operation, errMsg);
	},

	onRetrieveLeaveQueryInfo: function(corpUuid, staffCode, beginDate, endDate) {
		var self = this;
		var filter = {};
		filter.corpUuid = corpUuid;
		filter.staffCode = staffCode;
		filter.date1 = beginDate;
		filter.date2 = endDate; 
		var url=this.getServiceUrl('hr-leaveLog/retrieve_p');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				//if(result.object.list.length>0){
					self.recordSet = result.object.list;
					self.totalRow = result.object.totalRow;
					self.corpUuid = corpUuid;
					self.fireEvent('retrieve', '', self);
				/*}else{
					self.fireEvent('retrieve', "没有找到记录["+result.object.list.length+"]", self);
				}*/	
			}

			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onInitLeaveQueryInfo: function(corpUuid,staffCode, beginDate, endDate) {
		if( this.recordSet.length > 0 ){
			if( this.corpUuid === corpUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		this.onRetrieveLeaveQueryInfo(corpUuid,staffCode, beginDate, endDate);
	},
	onRetrieveLeaveQueryPage: function(corpUuid, staffCode, beginDate, endDate, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveLeaveQueryInfo( corpUuid,staffCode, beginDate, endDate );
	},
	onCreateLeaveQueryInfo: function() {
		var url = this.getServiceUrl('');
		Utils.recordCreate(this, module, url);
	},

	onUpdateLeaveQueryInfo: function() {
		var url = this.getServiceUrl();
		Utils.recordUpdate(this, module, url);
	},

	onDeleteLeaveQueryInfo: function() {
		var url = this.getServiceUrl();
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = LeaveQueryStore;
