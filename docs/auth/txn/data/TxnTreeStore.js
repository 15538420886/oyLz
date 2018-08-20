var Reflux = require('reflux');
var TxnActions = require('../action/TxnActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var TxnTreeStore = Reflux.createStore({
		listenables: [TxnActions],
		appUuid:'',
		groupUuid: '',
		modUuid:'',
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
			groupUuid: self.groupUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg,
		});

		MsgActions.showError('auth-app-module', operation, errMsg);
	},

	//===
	onRetrieveTreeInfo: function(modUuid) {
		var self = this;
		if(modUuid === null || modUuid === ''){
			self.recordSet = [];
			self.totalRow = 0;
			self.fireEvent('retrieve', '', self);
			return;
		}

		var filter = {};
		filter.modUuid = modUuid;
		var url = this.getServiceUrl('auth-app-txn/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) { 
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.groupUuid = modUuid;
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onRetrieveTreeInfoPage: function(groupUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveTreeInfo(groupUuid);
	},

	onInitTreeInfo: function(groupUuid) {
		if( this.recordSet.length > 0 ){
			if( this.groupUuid === groupUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		this.onRetrieveTreeInfo(groupUuid);
	},

	onCreateTreeInfo: function(authApp) {
		var url = this.getServiceUrl('auth-app-info/create');
		Utils.recordCreate(this, authApp, url);
	},

	onUpdateTreeInfo: function(authApp) {
		var url = this.getServiceUrl('auth-app-info/update');
		Utils.recordUpdate(this, authApp, url);
	},

	onDeleteTreeInfo: function(uuid) {
		var url = this.getServiceUrl('auth-app-info/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = TxnTreeStore;
