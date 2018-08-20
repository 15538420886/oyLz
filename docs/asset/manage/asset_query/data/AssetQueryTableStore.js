var Reflux = require('reflux');
var AssetQueryActions = require('../action/AssetQueryActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var AssetQueryTableStore = Reflux.createStore({
	listenables: [AssetQueryActions],
	
	uuid:'',
	recordSet: [],
	recordSet1: [],
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
			uuid: self.uuid,
			recordSet: self.recordSet,
			recordSet1: self.recordSet1,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('asset-info', operation, errMsg);
	},
	
	onRetrieveAssetInfoArticle: function(uuid) {
		var self = this;
		var filter = {};
		filter.uuid = uuid;
		var url = this.getServiceUrl('asset-info/find-by-uuid');
		Utils.doCreateService(url, uuid, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.articles;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.uuid = uuid;
				
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onRetrieveAssetInfoParam: function(uuid) {
		var self = this;
		var filter = {};
		filter.uuid = uuid;
		var url = this.getServiceUrl('asset-info/find-by-uuid');
		Utils.doCreateService(url, uuid, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet1 = result.object.params;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.uuid = uuid;
				
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
});

module.exports = AssetQueryTableStore;

