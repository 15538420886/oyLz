var Reflux = require('reflux');
var JobActions = require('../action/JobActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var JobStore = Reflux.createStore({
	listenables: [JobActions],
	
	filter: {},
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,
	
	init: function() {
	},

	getServiceUrl: function(action) {
		return Utils.projUrl+action;
	},
	
	fireEvent: function(operation, errMsg, self) {
		self.trigger({
			filter: self.filter,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('out-job', operation, errMsg);
	},
	onGetCacheData: function() {
		this.fireEvent('cache', '', this);
	},
	
	onRetrieveOutJob: function(filter) {
		var self = this;
		var url = this.getServiceUrl('out-job/retrieve');
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
	
	onRetrieveOutJobPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
	
		this.onRetrieveOutJob( filter );
	},
	
	onInitOutJob: function(filter) {
		if( this.recordSet.length > 0 ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveOutJob(filter);
	},

	onCreateOutJob: function(job) {
		var url = this.getServiceUrl('out-job/create');
		
		var self = this;
		Utils.doCreateService(url, job).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet.push(result.object);
				result.object.perName = job.perName;
				result.object.staffCode = job.staffCode;

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

	
	onUpdateOutJob: function(job) {
		var url = this.getServiceUrl('out-job/update');
		Utils.recordUpdate(this, job, url);
	},
	
	onDeleteOutJob: function(uuid) {
		var url = this.getServiceUrl('out-job/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = JobStore;

