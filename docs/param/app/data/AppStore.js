var Reflux = require('reflux');
var AppActions = require('../action/AppActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var AppStore = Reflux.createStore({
	listenables: [AppActions],


	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,

	init: function() {
	},

	getServiceUrl: function(action)
	{
		return Utils.paramUrl+action;
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

		MsgActions.showError('app-info', operation, errMsg);
	},

	onRetrieveAppInfo: function() {
		var self = this;
		var filter = {};
		var url = this.getServiceUrl('app-info/get-all');
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

	onRetrieveAppInfoPage: function(startPage, pageRow) {
		var self = this;
		self.startPage = startPage;
		self.pageRow = pageRow;
		var filter = {};
		var url = this.getServiceUrl('app-info/get-all');
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

	onInitAppInfo: function() {
		if( this.recordSet.length > 0 ){

				this.fireEvent('retrieve', '', this);
				return;

		}

		this.onRetrieveAppInfo();
	},

	onCreateAppInfo: function(app) {
		var url = this.getServiceUrl('app-info/create');
		Utils.recordCreate(this, app, url);
	},

	onUpdateAppInfo: function(app) {
		var url = this.getServiceUrl('app-info/update');
		Utils.recordUpdate(this, app, url);
	},

	onDeleteAppInfo: function(uuid) {
		var url = this.getServiceUrl('app-info/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = AppStore;
