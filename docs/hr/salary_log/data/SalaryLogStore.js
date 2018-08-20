var Reflux = require('reflux');
var SalaryLogAction = require('../action/SalaryLogAction');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var SalaryLogStore = Reflux.createStore({
	listenables: [SalaryLogAction],

	filter: '',
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

		MsgActions.showError('hr-salary-log', operation, errMsg);
	},

	onRetrieveHrSalaryLog: function(filter) {
		var self = this;
		var url = this.getServiceUrl('hr-salary-log/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;

				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onBatchSalaryLog: function(filter) {
		var self = this;
		var url = this.getServiceUrl('/hr-salary-log/batch-create');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;

				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onRetrieveHrSalaryLogPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHrSalaryLog( filter );
	},

	onInitHrSalaryLog: function(filter) {
		if( this.recordSet.length > 0 ){
			if( this.filter === filter ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveHrSalaryLog(filter);
	},

    onCreateHrSalaryLog: function (salaryLog) {
		var url = this.getServiceUrl('hr-salary-log/create');
		Utils.recordCreate(this, salaryLog, url);
	},

	onUpdateHrSalaryLog: function(salaryLog) {
		var url = this.getServiceUrl('hr-salary-log/update');
		Utils.recordUpdate(this, salaryLog, url);
	},

	onDeleteHrSalaryLog: function(uuid) {
		var url = this.getServiceUrl('hr-salary-log/remove');
		Utils.recordDelete(this, uuid, url);
	},

	onUploadFile: function(data, file){
		var url = this.getServiceUrl('hr-salary-log/batch-create');

		var self = this;
		var fileList = [file];
		Utils.doUploadService(url, data, fileList).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.fireEvent('upload', '', self);
			}
			else{
				self.fireEvent('upload', "导入数据错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('upload', "上传文件错误", self);
		});
	},
});

module.exports = SalaryLogStore;
