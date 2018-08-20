var Reflux = require('reflux');
var StorKeeperActions = require('../action/StorKeeperActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var StorKeeperStore = Reflux.createStore({
	listenables: [StorKeeperActions],
	
	corpUuid: '',
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,
	
	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.assetUrl+action;
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

		MsgActions.showError('stor-keeper', operation, errMsg);
	},
	
	onRetrieveStorKeeper: function(corpUuid) {
		var self = this;
		var filter = {};
		filter.corpUuid = corpUuid;
		var url = this.getServiceUrl('stor-keeper/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.corpUuid = corpUuid;
				
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onRetrieveStorKeeperPage: function(corpUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveStorKeeper( corpUuid );
	},
	
	onInitStorKeeper: function(corpUuid) {
		if( this.recordSet.length > 0 ){
			if( this.corpUuid === corpUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveStorKeeper(corpUuid);
	},
	
	onCreateStorKeeper: function(storKeeper) {
		var url = this.getServiceUrl('stor-keeper/create');
		Utils.recordCreate(this, storKeeper, url);
	},
	
	onUpdateStorKeeper: function(storKeeper) {
		var url = this.getServiceUrl('stor-keeper/update');
		Utils.recordUpdate(this, storKeeper, url);
	},
	
	onDeleteStorKeeper: function(uuid) {
		var url = this.getServiceUrl('stor-keeper/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = StorKeeperStore;

