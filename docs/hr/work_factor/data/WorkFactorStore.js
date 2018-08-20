﻿var Reflux = require('reflux');
var WorkFactorActions = require('../action/WorkFactorActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var WorkFactorStore = Reflux.createStore({
	listenables: [WorkFactorActions],
	
	workUuid: '',
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
			workUuid: self.workUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('hr-work-factor', operation, errMsg);
	},
	
	onRetrieveHrWorkFactor: function(workUuid) {
		var self = this;
		var filter = {};
		filter.workUuid = workUuid;
		var url = this.getServiceUrl('hr-work-factor/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.workUuid = workUuid;
				
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onRetrieveHrWorkFactorPage: function(workUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHrWorkFactor( workUuid );
	},
	
	onInitHrWorkFactor: function(workUuid) {
		if( this.recordSet.length > 0 ){
			if( this.workUuid === workUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveHrWorkFactor(workUuid);
	},
	
	onCreateHrWorkFactor: function(workFactor) {
		var url = this.getServiceUrl('hr-work-factor/create');
		Utils.recordCreate(this, workFactor, url);
	},
	
	onUpdateHrWorkFactor: function(workFactor) {
		var url = this.getServiceUrl('hr-work-factor/update');
		Utils.recordUpdate(this, workFactor, url);
	},
	
	onDeleteHrWorkFactor: function(uuid) {
		var url = this.getServiceUrl('hr-work-factor/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = WorkFactorStore;

