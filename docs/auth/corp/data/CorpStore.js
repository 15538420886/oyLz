var Reflux = require('reflux');
var CorpActions = require('../action/CorpActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var CorpStore = Reflux.createStore({
	listenables: [CorpActions],

	campusCode: '',
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
			campusCode: self.campusCode,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('auth-corp', operation, errMsg);
	},

	onRetrieveAuthCorp: function(campusCode) {
		var self = this;
		self.campusCode = campusCode;

		var filter = {};
		filter.campusCode = campusCode;
		var url=this.getServiceUrl('auth-corp/get-by-authCorp');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.campusCode = campusCode;

				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onInitAuthCorp: function(campusCode) {
		if( this.recordSet.length > 0 ){
			if( this.campusCode === campusCode ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveAuthCorp(campusCode);
	},

	onCreateAuthCorp: function(corp) {
		var url = this.getServiceUrl('auth-corp/create');
		Utils.recordCreate(this, corp, url);
	},

	onUpdateAuthCorp: function(corp) {
		var url = this.getServiceUrl('auth-corp/update');
		Utils.recordUpdate(this, corp, url);
	},

	onDeleteAuthCorp: function(uuid) {
		var url = this.getServiceUrl('auth-corp/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = CorpStore;
