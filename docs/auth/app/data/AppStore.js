var Reflux = require('reflux');
var AuthAppActions = require('../action/AppActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var AuthAppStore = Reflux.createStore({
	listenables: [AuthAppActions],

	groupUuid: null,
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

		MsgActions.showError('auth-app-info', operation, errMsg);
	},

	onRetrieveAuthAppInfo: function(groupUuid) {
		if(groupUuid === '' || typeof(groupUuid) === 'undefined'){
			groupUuid = null;
		}

		var self = this;
		var filter = {};
		filter.groupUuid = groupUuid;
		var url = this.getServiceUrl('auth-app-info/get-by-groupUuid');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.groupUuid = groupUuid;
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onRetrieveAuthAppInfoPage: function(groupUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveAuthAppInfo(groupUuid);
	},

	onInitAuthAppInfo: function(groupUuid) {
		if(groupUuid === '' || typeof(groupUuid) === 'undefined'){
			groupUuid = null;
		}

		if( this.recordSet.length > 0 ){
			if( this.groupUuid === groupUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveAuthAppInfo(groupUuid);
	},

	onCreateAuthAppInfo: function(authApp) {
		var url = this.getServiceUrl('auth-app-info/create');
		Utils.recordCreate(this, authApp, url);
	},

	onUpdateAuthAppInfo: function(authApp) {
		var url = this.getServiceUrl('auth-app-info/update');
		Utils.recordUpdate(this, authApp, url);
	},

	onDeleteAuthAppInfo: function(uuid) {
		var url = this.getServiceUrl('auth-app-info/remove');
		Utils.recordDelete(this, uuid, url);
	},

    //添加App到App组
	onBatchUpdate: function(appList) {
		var self = this;
		var url = this.getServiceUrl('auth-app-info/batch-update');
		// console.log(appList)
		Utils.doGetRecordService(url, appList).then(function(result) {
			// console.log(result)
		 	if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				var appMap = {};
				self.recordSet.map((node, i) => {
					appMap[node.uuid] = node;
				});

				appList.listUuid.map((nodeUuid, i) => {
					var app = appMap[nodeUuid];
					if(app !== null && typeof(app) !== 'undefined'){
						app.groupUuid = appList.groupUuid;
					}
				});

		 		self.fireEvent('batchUpdate', '', self);
			}
			else{
				self.fireEvent('batchUpdate', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
		 	}
		}, function(value){

			self.fireEvent('batchUpdate', "调用服务错误", self);
		});
	}
});

module.exports = AuthAppStore;
