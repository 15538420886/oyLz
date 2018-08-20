var Reflux = require('reflux');
var ModelInfoActions = require('../action/ModelInfoActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var ModelInfoStore = Reflux.createStore({
	listenables: [ModelInfoActions],
	groupUuid: '',
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
			groupUuid: self.groupUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('model-info', operation, errMsg);
	},

	onRetrieveModelInfo: function(groupUuid,corpUuid) {
		var self = this;
		var filter = {}; 
		filter.groupUuid = groupUuid;
		filter.corpUuid = corpUuid;
		var url = this.getServiceUrl('model-info/retrieve');
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

	onInitModelInfo: function(groupUuid,corpUuid) {
		if( this.recordSet.length > 0 ){
			if( this.groupUuid === groupUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		this.onRetrieveModelInfo(groupUuid,corpUuid);
	},

	onCreateModelInfo: function(info) {
		var url = this.getServiceUrl('model-info/create');
		Utils.recordCreate(this, info, url);
	},

	onUpdateModelInfo: function(info) {
		var url = this.getServiceUrl('model-info/update');
		Utils.recordUpdate(this, info, url);
	},

	onDeleteModelInfo: function(uuid) {
		var url = this.getServiceUrl('model-info/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = ModelInfoStore;
