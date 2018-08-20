var Reflux = require('reflux');
var JsModelActions = require('../action/JsModelActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var JsModelStore = Reflux.createStore({
	listenables: [JsModelActions],

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
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('js-model-path', operation, errMsg);
	},
 
	onRetrievePageJsModel: function() {
		var self = this;
		var filter = {};	
		var url = this.getServiceUrl('js-model-path/retrieve');
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
    
	onInitPageJsModel: function() {
        if (this.recordSet.length > 0) {
            this.fireEvent('retrieve', '', this);
            return;
		}

		this.onRetrievePageJsModel();
	},

	onCreatePageJsModel: function(path) {
		var url = this.getServiceUrl('js-model-path/create');
		Utils.recordCreate(this, path, url);
	},

	onUpdatePageJsModel: function(path) {
		var url = this.getServiceUrl('js-model-path/update');
		Utils.recordUpdate(this, path, url);
	},

	onDeletePageJsModel: function(uuid) {
		var url = this.getServiceUrl('js-model-path/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = JsModelStore;
