var Reflux = require('reflux');
var StorLocActions = require('../action/StorLocActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var StorLocStore = Reflux.createStore({
	listenables: [StorLocActions],
	
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

		MsgActions.showError('stor-loc', operation, errMsg);
	},
	
	onRetrieveStorLoc: function(corpUuid) {
		var self = this;
		var filter = {};
		filter.corpUuid = corpUuid;
		var url = this.getServiceUrl('stor-loc/retrieve');
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
	
	onRetrieveStorLocPage: function(corpUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveStorLoc( corpUuid );
	},
	
	onInitStorLoc: function(corpUuid) {
		if( this.recordSet.length > 0 ){
			if( this.corpUuid === corpUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveStorLoc(corpUuid);
	},
	
	onCreateStorLoc: function(storLoc) {
		var url = this.getServiceUrl('stor-loc/create');
		Utils.recordCreate(this, storLoc, url);
	},
	
	onUpdateStorLoc: function(storLoc) {
		var url = this.getServiceUrl('stor-loc/update');
		Utils.recordUpdate(this, storLoc, url);
	},
	
	onDeleteStorLoc: function(uuid) {
		var url = this.getServiceUrl('stor-loc/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = StorLocStore;

