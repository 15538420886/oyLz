var Reflux = require('reflux');
var SearchStaffCodeActions = require('../action/SearchStaffCodeActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var SearchStaffCodeStore = Reflux.createStore({
	listenables: [SearchStaffCodeActions],

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

		MsgActions.showError('hr-employee', operation, errMsg);
	},

	onRetrieveStaffCode: function(filter) {
		var self = this;
		var url = this.getServiceUrl('hr-employee/retrieve3');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.filter = filter;

				self.fireEvent('retrieve3', '', self);
			}
			else{
				self.fireEvent('retrieve3', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve3', "调用服务错误", self);
		});
	},

	onRetrieveStaffCodePage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveStaffCode( filter );
	},

	onInitStaffCode: function(filter) {
		if( this.recordSet.length > 0 ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve3', '', this);
				return;
			}
		}

		this.onRetrieveStaffCode(filter);
	},

});

module.exports = SearchStaffCodeStore;
