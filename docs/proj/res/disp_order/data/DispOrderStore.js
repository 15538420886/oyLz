var Reflux = require('reflux');
var DispOrderActions = require('../action/DispOrderActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var DispOrderStore = Reflux.createStore({
	listenables: [DispOrderActions],
	
	filter: {},
	recordSet: [],
	dispMeb:{},
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
			dispMeb: self.dispMeb,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('proj-disp', operation, errMsg);
	},

	onGetCacheData: function (projUuid) {
        if (this.filter.projUuid !== projUuid) {
            this.filter = {};
            this.recordSet = [];
            this.startPage = 0;
            this.pageRow = 0;
            this.totalRow = 0;
        }

		this.fireEvent('cache', '', this);
	},

	onRetrieveResMeb: function(staffCode){
		var self = this;
		var filter = {};
		filter.corpUuid = window.loginData.compUser.corpUuid;
		filter.staffCode = staffCode;
		var url = this.getServiceUrl('res-member/retrieve');
		Utils.doRetrieveService(url, filter, 1, 1, 1).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.dispMeb = result.object.list[0];
				self.fireEvent('retrieveResMeb', '', self);
			}
			else{
				self.fireEvent('retrieveResMeb', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieveResMeb', "调用服务错误", self);
		});
	},
	
	onRetrieveDispOrder: function(filter) {
		var self = this;
		var url = this.getServiceUrl('proj-disp/retrieve');
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
	
	onRetrieveDispOrderPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveDispOrder( filter );
	},
	
	onInitDispOrder: function(filter) {
		if( this.recordSet.length > 0 ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveDispOrder(filter);
	},
	
	onCreateDispOrder: function(disp) {
		var url = this.getServiceUrl('proj-disp/create');
		Utils.recordCreate(this, disp, url);
	},
	
	onUpdateDispOrder: function(disp) {
		var url = this.getServiceUrl('proj-disp/update');
		Utils.recordUpdate(this, disp, url);
	},
	
	onDeleteDispOrder: function(uuid) {
		var url = this.getServiceUrl('proj-disp/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = DispOrderStore;

