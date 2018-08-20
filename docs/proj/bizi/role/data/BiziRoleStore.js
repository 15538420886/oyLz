var Reflux = require('reflux');
var BiziRoleActions = require('../action/BiziRoleActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var BiziRoleStore = Reflux.createStore({
	listenables: [BiziRoleActions],

	projUuid: '',
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,

	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.projUrl+action;
	},

	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			projUuid: self.projUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('bizi-proj-role', operation, errMsg);
	},

	onRetrieveBiziProjRole: function(projUuid) {
		var self = this;
		var filter = {};
		filter.projUuid = projUuid;
		var url = this.getServiceUrl('bizi-proj-role/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.projUuid = projUuid;

				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onInitBiziProjRole: function(projUuid) {
		if( this.recordSet.length > 0 ){
			if( this.projUuid === projUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveBiziProjRole(projUuid);
	},

	onCreateBiziProjRole: function(projRole) {
		var url = this.getServiceUrl('bizi-proj-role/create');
		Utils.recordCreate(this, projRole, url);
	},

	onUpdateBiziProjRole: function(projRole) {
		var url = this.getServiceUrl('bizi-proj-role/update');
		Utils.recordUpdate(this, projRole, url);
	},

	onDeleteBiziProjRole: function(uuid) {
		var url = this.getServiceUrl('bizi-proj-role/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = BiziRoleStore;
