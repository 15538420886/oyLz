var Reflux = require('reflux');
var JobFactorActions = require('../action/JobFactorActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var JobFactorStore = Reflux.createStore({
	listenables: [JobFactorActions],
	
	corpUuid: '',
	workUuid: '',
	jobUuid: '',
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
			workUuid: self.workUuid,
			jobUuid: self.jobUuid,			
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('hr-job-factor-value', operation, errMsg);
	},
	
	onRetrieveHrJobFactorValue: function(workUuid, jobUuid) {
		var self = this;
		var filter = {};
		filter.workUuid = workUuid;
		filter.jobUuid = jobUuid;
		var url = this.getServiceUrl('hr-job-factor-value/retrieve1');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.workUuid = result.object.workUuid;
				self.jobUuid = result.object.jobUuid;
				
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onRetrieveHrJobFactorValuePage: function(workUuid, jobUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHrJobFactorValue( workUuid, jobUuid );
	},
	
	onInitHrJobFactorValue: function(workUuid, jobUuid) {
		if( this.recordSet.length > 0 ){
			if( this.workUuid === workUuid && this.jobUuid === jobUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveHrJobFactorValue(workUuid, jobUuid);
	},
	
	onCreateHrJobFactorValue: function(factorList) {
		var self = this;
		var url = this.getServiceUrl('hr-job-factor-value/batch-cu');
		Utils.doGetRecordService(url, factorList).then(function(result){
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.fireEvent('create', '', self);
			}
			else{

				self.fireEvent('create', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		},function(result){
			self.fireEvent('create', "调用服务错误", self);
		});
	},

});

module.exports = JobFactorStore;