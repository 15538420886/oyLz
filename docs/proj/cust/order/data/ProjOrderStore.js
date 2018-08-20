var Reflux = require('reflux');
var ProjOrderActions = require('../action/ProjOrderActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ProjOrderStore = Reflux.createStore({
	listenables: [ProjOrderActions],
	
	filter: {},
	recordSet: [],
	list:[],
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
			filter: self.filter,
			recordSet: self.recordSet,
			list: self.list,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('proj-order', operation, errMsg);
	},
	
	onGetCacheData: function() {
		this.fireEvent('cache', '', this);
	},

	onRetrieveProjOrder: function(filter) {
		var self = this;
		var url = this.getServiceUrl('proj-order/retrieve');
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

	onRetrieveProjContract: function(filter) {
		var self = this;
		var url = this.getServiceUrl('proj_contract/get-by-CorpUuidandCustUuid');
		Utils.doRetrieveService(url, filter).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.list = result.object.list[0];
				
				self.filter = filter;
				self.fireEvent('retrieve1', '', self);
			}
			else{
				self.fireEvent('retrieve1', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve1', "调用服务错误", self);
		});
	},
	
	
	onRetrieveProjOrderPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveProjOrder( filter );
	},
	
	onInitProjOrder: function(filter) {
		if( this.recordSet.length > 0 ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveProjOrder(filter);
	},
	
	onCreateProjOrder: function(order) {
		var url = this.getServiceUrl('proj-order/create');
		Utils.recordCreate(this, order, url);
	},
	
	onUpdateProjOrder: function(order) {
		var url = this.getServiceUrl('proj-order/update');
		Utils.recordUpdate(this, order, url);
	},
	
	onDeleteProjOrder: function(uuid) {
		var url = this.getServiceUrl('proj-order/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = ProjOrderStore;
