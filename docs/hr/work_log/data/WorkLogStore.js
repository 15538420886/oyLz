var Reflux = require('reflux');
var WorkLogActions = require('../action/WorkLogActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var WorkLogStore = Reflux.createStore({
	listenables: [WorkLogActions],

	filter: {},
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
			filter: self.filter,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('hr_work_log', operation, errMsg);
	},
	onGetCacheData: function() {
		this.fireEvent('cache', '', this);
	},

	onRetrieveHrWorkLog: function(filter) {
		var self = this;
		var url = this.getServiceUrl('hr_work_log/retrieve');
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

	onRetrieveHrWorkLogPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHrWorkLog( filter );
	},

	onInitHrWorkLog: function(filter) {
		if( this.recordSet.length > 0 ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveHrWorkLog(filter);
	},


	onCreateHrWorkLog: function(workLog) {

		var self = this;
		var data = workLog;
		var url = this.getServiceUrl('hr_work_log/create');
		Utils.doCreateService(url, data).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				result.object.perName = data.perName;
				result.object.staffCode = data.staffCode;
				result.object.deptName = data.deptName;
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

	onUpdateHrWorkLog: function(workLog) {
		var url = this.getServiceUrl('hr_work_log/update');
		Utils.recordUpdate(this, workLog, url);
	},

	onDeleteHrWorkLog: function(uuid) {
		var url = this.getServiceUrl('hr_work_log/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = WorkLogStore;
