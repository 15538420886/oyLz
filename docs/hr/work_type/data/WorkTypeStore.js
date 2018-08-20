﻿var Reflux = require('reflux');
var WorkTypeActions = require('../action/WorkTypeActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var WorkTypeStore = Reflux.createStore({
	listenables: [WorkTypeActions],
	
	corpUuid: '',
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
			corpUuid: self.corpUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('hr-work-type', operation, errMsg);
	},
	
	onRetrieveHrWorkType: function(corpUuid) {
		var self = this;
		var filter = {};
		filter.corpUuid = corpUuid;
		var url = this.getServiceUrl('hr-work-type/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
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
	
	onRetrieveHrWorkTypePage: function(corpUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHrWorkType( corpUuid );
	},
	
	onInitHrWorkType: function(corpUuid) {
		if( this.recordSet.length > 0 ){
			if( this.corpUuid === corpUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		this.onRetrieveHrWorkType(corpUuid);
	},
	
	onCreateHrWorkType: function(workType) {
		var url = this.getServiceUrl('hr-work-type/create');
		Utils.recordCreate(this, workType, url);
	},
	
	onUpdateHrWorkType: function(workType) {
		var url = this.getServiceUrl('hr-work-type/update');
		Utils.recordUpdate(this, workType, url);
	},
	
	onDeleteHrWorkType: function(uuid) {
		var url = this.getServiceUrl('hr-work-type/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = WorkTypeStore;

