var Reflux = require('reflux');
var BuildActions = require('../action/BuildActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var BuildStore = Reflux.createStore({
	listenables: [BuildActions],

	campUuid: '',
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,

	init: function() {
	},

	getServiceUrl: function(action)
	{
		return Utils.campUrl+action;
	},

	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			campUuid: self.campUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('hr-build', operation, errMsg);
	},

	onRetrieveHrBuild: function(campUuid) {
		var self = this;
		var filter = {};
		filter.campUuid = campUuid;
		var url = this.getServiceUrl('hr-build/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.campUuid = campUuid;

				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onInitHrBuild: function(campUuid) {
		if( this.recordSet.length > 0 ){
			if( this.campUuid === campUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveHrBuild(campUuid);
	},

	onCreateHrBuild: function(build) {
		var url = this.getServiceUrl('hr-build/create');
		Utils.recordCreate(this, build, url);
	},

	onUpdateHrBuild: function(build) {
		var url = this.getServiceUrl('hr-build/update');
		Utils.recordUpdate(this, build, url);
	},

	onDeleteHrBuild: function(uuid) {
		var url = this.getServiceUrl('hr-build/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = BuildStore;
