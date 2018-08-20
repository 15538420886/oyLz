'use strict';

var Reflux = require('reflux');
var LeaveLogPerActions = require('../action/LeaveLogPerActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var LeaveLogPerStore = Reflux.createStore({
	listenables: [LeaveLogPerActions],
	leavelogper:{},
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
			leavelogper: self.leavelogper,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});
		MsgActions.showError('hr-leave', operation, errMsg);
	},

	onRetrieveLeaveLogPerInfo: function(corpUuid,staffCode) {
		var self = this;
		var filter = {};
		filter.corpUuid = corpUuid;
		filter.staffCode = staffCode;
		var url=this.getServiceUrl('hr-leave/retrieve_p');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				if(result.object.detailList.length>0||result.object.leaveList.length>0){
					self.leavelogper = result.object.leaveList[0];
					self.corpUuid = corpUuid;
					self.staffCode = staffCode;
					self.fireEvent('retrieve', '', self);	
				}else{
					self.fireEvent('retrieve', "没有找到记录["+result.object.detailList.length+"]", self);
				}	
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onInitLeaveLogPerInfo: function(corpUuid,staffCode) {
		if( this.recordSet.length > 0 ){
			if( this.corpUuid === corpUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		this.onRetrieveLeaveLogPerInfo(corpUuid,staffCode);
	},
});

module.exports = LeaveLogPerStore;
