var Reflux = require('reflux');
var JsModelInfoActions = require('../action/JsModelInfoActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var JsModelInfoStore = Reflux.createStore({
	listenables: [JsModelInfoActions],

	groupUuid: '',
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,

	init: function() {
	},

	getServiceUrl: function(action)
	{
		return Utils.devUrl+action;
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
			errMsg: errMsg
		});

		MsgActions.showError('js-model-info', operation, errMsg);
	},

	onRetrieveJsModelInfo: function(groupUuid,corpUuid) {
		var self = this;
		var filter = {};  
		filter.groupUuid = groupUuid;
		filter.corpUuid = corpUuid;
		var url = this.getServiceUrl('js-model-info/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.groupUuid = groupUuid;
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

	onInitJsModelInfo: function(groupUuid,corpUuid) {
		if( this.recordSet.length > 0 ){
			if( this.groupUuid === groupUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveJsModelInfo(groupUuid,corpUuid);
	},

	onCreateJsModelInfo: function(info) {
		var url = this.getServiceUrl('js-model-info/create');
		Utils.recordCreate(this, info, url);
		console.log(this)
	},

	onUpdateJsModelInfo: function(info) {
		var url = this.getServiceUrl('js-model-info/update');
		Utils.recordUpdate(this, info, url);
		console.log(this)
	},

	onDeleteJsModelInfo: function(uuid) {
		var url = this.getServiceUrl('js-model-info/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = JsModelInfoStore;
