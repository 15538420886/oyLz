var Reflux = require('reflux');
var AssetQueryActions = require('../action/AssetQueryActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var AssetQueryStore = Reflux.createStore({
	listenables: [AssetQueryActions],
	
	filter:{},
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
			filter: self.filter,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('asset-info', operation, errMsg);
	},
	
	onRetrieveAssetInfo: function(filter) {
		var self = this;
		var url = this.getServiceUrl('asset-info/retrieve');
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
	
	onRetrieveAssetInfoPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveAssetInfo( filter );
	},
	
	onInitAssetInfo: function(filter) {
		if( this.recordSet.length > 0 ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveAssetInfo(filter);
	},
	
	onCreateAssetInfo: function(assetQuery) {
		var url = this.getServiceUrl('asset-info/create');
		Utils.recordCreate(this, assetQuery, url);
	},
	
	onUpdateAssetInfo: function(assetQuery) {
		var url = this.getServiceUrl('asset-info/update');
		Utils.recordUpdate(this, assetQuery, url);
	},
	
	onDeleteAssetInfo: function(uuid) {
		var url = this.getServiceUrl('asset-info/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = AssetQueryStore;

