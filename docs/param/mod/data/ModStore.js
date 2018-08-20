var Reflux = require('reflux');
var ModActions = require('../action/ModActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var ModStore = Reflux.createStore({
	listenables: [ModActions],

	appUuid: '',
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
			appUuid: self.appUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('app-group', operation, errMsg);
	},

	onRetrieveAppGroup: function(appUuid) {
		var self = this;
		var filter = {
			appUuid: appUuid
		};
		//filter.appUuid = appUuid;
		var url = this.getServiceUrl('app-group/get-by-app_uuid');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.appUuid = appUuid;

				self.fireEvent('retrieve', '', self);
				//console.log(result.object);

			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onRetrieveAppGroupPage: function(appUuid, startPage, pageRow) {
		var self = this;
		self.startPage = startPage;
		self.pageRow = pageRow;
		var filter = {};
		filter.appUuid = appUuid;
		var url = this.getServiceUrl('app-group/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.appUuid = appUuid;

				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onInitAppGroup: function(appUuid) {
		if( this.recordSet.length > 0 ){
			if( this.appUuid === appUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveAppGroup(appUuid);
	},

	onCreateAppGroup: function(mod) {
		var url = this.getServiceUrl('app-group/create');
		Utils.recordCreate(this, mod, url);
	},

	onUpdateAppGroup: function(mod) {
		var url = this.getServiceUrl('app-group/update');
		Utils.recordUpdate(this, mod, url);
	},

	onDeleteAppGroup: function(uuid) {
		var url = this.getServiceUrl('app-group/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = ModStore;
