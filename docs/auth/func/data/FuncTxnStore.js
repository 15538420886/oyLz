'use strict';

var Reflux = require('reflux');
var FuncTxnActions = require('../action/FuncTxnActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var FuncTxnStore = Reflux.createStore({
	listenables: [FuncTxnActions],

	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,

	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.authUrl+action;
	},

	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});
		MsgActions.showError('auth-app-func-txn', operation, errMsg);
	},

	onRetrieveFuncTxnInfo: function(funcUuid) {
		var self = this;
		var filter = {};
		filter.funcUuid = funcUuid;
		var url=this.getServiceUrl('auth-app-func-txn/get-by-funcUuid');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.funcUuid = funcUuid;
				self.fireEvent('retrieve', '', self);

			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	//批量增加
	onSelectFuncinfo: function(functxn) {
		 var self = this;
		 var url = this.getServiceUrl('auth-app-func-txn/batch-create');
		 Utils.doGetRecordService(url, functxn).then(function(result) {
		 	if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = self.recordSet.concat(result.object.list);
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.fireEvent('batchCreate', '', self);
			}
			else{
				self.fireEvent('batchCreate', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('batchCreate', "调用服务错误", self);
		});
	},

	onInitFuncTxnInfo: function(funcUuid) {
		if( this.recordSet.length > 0 ){
			if( this.funcUuid === funcUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		this.onRetrieveFuncTxnInfo(funcUuid);
	},

	onCreateFuncTxnInfo: function(module) {
		var url = this.getServiceUrl('auth-app-func-txn/create');
		Utils.recordCreate(this, module, url);
	},

	onUpdateFuncTxnInfo: function(module) {
		var url = this.getServiceUrl('auth-app-func-txn/update');
		Utils.recordUpdate(this, module, url);
	},

	onDeleteFuncTxnInfo: function(uuid) {
		var url = this.getServiceUrl('auth-app-func-txn/remove');
		Utils.recordDelete(this, uuid, url);
	},
});

module.exports = FuncTxnStore;
