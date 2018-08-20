var Reflux = require('reflux');
var JobActions = require('../action/JobActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var JobStore = Reflux.createStore({
	listenables: [JobActions],
	
	workUuid: '',
	corpUuid:'',
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
			corpUuid:self.corpUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('hr-job', operation, errMsg);
	},
	
	onRetrieveHrJob: function(corpUuid, workUuid) {
		var self = this;
		var filter = {};
		filter.workUuid = workUuid;
		filter.corpUuid = corpUuid;
		var url = this.getServiceUrl('hr-job/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.workUuid = workUuid;
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
	
	onRetrieveHrJobPage: function(corpUuid, workUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHrJob(corpUuid, workUuid );
	},
	
	onInitHrJob: function(corpUuid, workUuid) {
		if( this.recordSet.length > 0 ){
			if( this.corpUuid === corpUuid && this.workUuid === workUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveHrJob(corpUuid, workUuid);
	},
	
	onCreateHrJob: function(job) {
		var url = this.getServiceUrl('hr-job/create');
		Utils.recordCreate(this, job, url);
	},
	
	onUpdateHrJob: function(job) {
		var url = this.getServiceUrl('hr-job/update');
		Utils.recordUpdate(this, job, url);
	},
	
	onDeleteHrJob: function(uuid) {
		var url = this.getServiceUrl('hr-job/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = JobStore;