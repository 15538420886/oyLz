var Reflux = require('reflux');
var DeptActions = require('../action/DeptActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var DeptStore = Reflux.createStore({
	listenables: [DeptActions],

	corpUuid: '',
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
			corpUuid: self.corpUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('auth-dept', operation, errMsg);
	},

	onRetrieveAuthDept: function(corpUuid) {
		var self = this;
		//self.corpUuid = corpUuid;

		var filter = {};
		filter.corpUuid = corpUuid;
		Utils.doRetrieveService(Utils.authUrl+'auth-dept/get-by-corpUuid', filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
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

	onInitAuthDept: function(corpUuid) {
		if( this.recordSet.length > 0 ){
			if( this.corpUuid === corpUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveAuthDept(corpUuid);
	},

	onCreateAuthDept: function(dept) {
		var url = this.getServiceUrl('auth-dept/create');
		Utils.recordCreate(this, dept, url);
	},

	onUpdateAuthDept: function(dept) {
		var url = this.getServiceUrl('auth-dept/update');
		Utils.recordUpdate(this, dept, url);
	},

	onDeleteAuthDept: function(uuid) {
		var url = this.getServiceUrl('auth-dept/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = DeptStore;
