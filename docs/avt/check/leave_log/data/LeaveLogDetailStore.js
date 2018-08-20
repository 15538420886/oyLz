'use strict';

var Reflux = require('reflux');
var LeaveLogDetailActions = require('../action/LeaveLogDetailActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var LeaveLogDetailStore = Reflux.createStore({
	listenables: [LeaveLogDetailActions],
	leavelog:{},
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
		MsgActions.showError('hr-leave', operation, errMsg);
	},

	onRetrieveLeaveLogDetailInfo: function(corpUuid,staffCode, beginDate, endDate) {
		var self = this;
		var filter = {};
		filter.corpUuid = corpUuid;
		filter.staffCode = staffCode;
		filter.date1 = beginDate;
		filter.date2 = endDate;
		var url=this.getServiceUrl('hr-leave/retrieve_p');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.detailList;
				self.totalRow = result.object.totalRow;
				self.corpUuid = corpUuid;
				self.fireEvent('retrieve', '', self);		
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onInitLeaveLogDetailInfo: function(corpUuid,staffCode, beginDate, endDate) {
		if( this.recordSet.length > 0 ){
			if( this.corpUuid === corpUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		this.onRetrieveLeaveLogDetailInfo(corpUuid,staffCode, beginDate, endDate);
	},
	onRetrieveLeaveLogDetailPage: function(corpUuid,staffCode, beginDate, endDate, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveLeaveLogDetailInfo( corpUuid,staffCode, beginDate, endDate );
	},
	onCreateLeaveLogDetailInfo: function() {
		var url = this.getServiceUrl('');
		Utils.recordCreate(this, module, url);
	},

	onUpdateLeaveLogDetailInfo: function() {
		var url = this.getServiceUrl();
		Utils.recordUpdate(this, module, url);
	},

	onDeleteLeaveLogDetailInfo: function() {
		var url = this.getServiceUrl();
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = LeaveLogDetailStore;
