var Reflux = require('reflux');
var MenuActions = require('../action/MenuActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var MenuStore = Reflux.createStore({
	listenables: [MenuActions],
	
	appUuid: '',
	puuid: '',
	uuid: '',
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,
	menuInfo: {},
	
	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.authUrl+action;
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

		MsgActions.showError('auth-app-menu', operation, errMsg);
	},
	
	onRetrieveAuthAppMenu: function(appUuid) {
		var self = this;
		var filter = {};
		filter.appUuid = appUuid;
		var url = this.getServiceUrl('auth-app-menu/get-by-appUuid');
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
	
	onRetrieveAuthAppMenuPage: function(appUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveAuthAppMenu( appUuid );
	},
	
	onInitAuthAppMenu: function(appUuid) {
		if( this.recordSet.length > 0 ){
			if( this.appUuid === appUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveAuthAppMenu(appUuid);
	},
	
	onCreateAuthAppMenu: function(menu) {
		var url = this.getServiceUrl('auth-app-menu/create');
		Utils.recordCreate(this, menu, url);
	},
	
	onUpdateAuthAppMenu: function(menu) {
		var url = this.getServiceUrl('auth-app-menu/update');
		Utils.recordUpdate(this, menu, url);
	},
	
	onDeleteAuthAppMenu: function(uuid) {
		var url = this.getServiceUrl('auth-app-menu/remove');
		Utils.recordDelete(this, uuid, url);
	},

});

module.exports = MenuStore;

