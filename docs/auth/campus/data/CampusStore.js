var Reflux = require('reflux');
var CampusActions = require('../action/CampusActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var CampusStore = Reflux.createStore({
	listenables: [CampusActions],

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
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('auth-campus', operation, errMsg);
	},

	onRetrieveAuthCampus: function() {
		var self = this;
		var filter = {};
		Utils.doRetrieveService(Utils.authUrl+'auth-campus/retrieve', filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
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

	onInitAuthCampus: function() {
		if( this.recordSet.length > 0 ){
			this.fireEvent('retrieve', '', this);
			return;
		}

		this.onRetrieveAuthCampus();
	},

	onCreateAuthCampus: function(campus) {
		var url = this.getServiceUrl('auth-campus/create');
		Utils.recordCreate(this, campus, url);
	},

	onUpdateAuthCampus: function(campus) {
		var url = this.getServiceUrl('auth-campus/update');
		Utils.recordUpdate(this, campus, url);
	},

	onDeleteAuthCampus: function(uuid) {
		var url = this.getServiceUrl('auth-campus/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = CampusStore;
