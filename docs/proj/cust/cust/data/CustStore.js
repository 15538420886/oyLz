var Reflux = require('reflux');
var CustActions = require('../action/CustActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var CustStore = Reflux.createStore({
	listenables: [CustActions],
	filter: {},
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,
	
	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.projUrl+action;
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

		MsgActions.showError('proj_cust', operation, errMsg);
	},

	onGetCacheData: function() {
		this.fireEvent('cache', '', this);
	},
	
	onRetrieveProjCust: function(filter) {
		var self = this;
		var url = this.getServiceUrl('proj_cust/retrieve');
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
	
	onRetrieveProjCustPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveProjCust(filter);
	},
	
	onInitProjCust: function(filter) {
		if( this.recordSet.length > 0 ){
			if( this.filter === filter ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveProjCust(filter);
	},
	
	onCreateProjCust: function(cust) {
		var url = this.getServiceUrl('proj_cust/create');
		Utils.recordCreate(this, cust, url);
	},
	
	onUpdateProjCust: function(cust) {
		var url = this.getServiceUrl('proj_cust/update');
		Utils.recordUpdate(this, cust, url);
	},
	
	onDeleteProjCust: function(uuid) {
		var url = this.getServiceUrl('proj_cust/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = CustStore;

