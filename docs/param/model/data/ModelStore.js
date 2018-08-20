var Reflux = require('reflux');
var ModelActions = require('../action/ModelActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var ModelStore = Reflux.createStore({
	listenables: [ModelActions],

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

		MsgActions.showError('model-path', operation, errMsg);
	},
 
	onRetrievePageModel: function() {
		var self = this;
		var filter = {};	
		var url = this.getServiceUrl('model-path/get-all');
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

	onInitPageModel: function() {
		if( this.recordSet.length > 0 ){
			if( this.appUuid === appUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		this.onRetrievePageModel();
	},

	onCreatePageModel: function(path) {
		var url = this.getServiceUrl('model-path/create');
		Utils.recordCreate(this, path, url);
	},

	onUpdatePageModel: function(path) {
		var url = this.getServiceUrl('model-path/update');
		Utils.recordUpdate(this, path, url);
	},

	onDeletePageModel: function(uuid) {
		var url = this.getServiceUrl('model-path/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = ModelStore;
