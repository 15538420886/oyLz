var Reflux = require('reflux');
var AllowanceActions = require('../action/AllowanceActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var AllowanceStore = Reflux.createStore({
	listenables: [AllowanceActions],
	
	corpUuid: '',
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,
	
	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.hrUrl+action;
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

		MsgActions.showError('hr_allowance', operation, errMsg);
	},
	
	onRetrieveHrAllowance: function(corpUuid) {
		var self = this;
		var filter = {};
		filter.corpUuid = corpUuid;
		var url = this.getServiceUrl('hr_allowance/get-by-corp_uuid');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
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
	
	onRetrieveHrAllowancePage: function(corpUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHrAllowance( corpUuid );
	},
	
	onInitHrAllowance: function(corpUuid) {
		if( this.recordSet.length > 0 ){
			if( this.corpUuid === corpUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveHrAllowance(corpUuid);
	},
	
	onCreateHrAllowance: function(allowance) {
		var url = this.getServiceUrl('hr_allowance/create');
		Utils.recordCreate(this, allowance, url);
	},
	
	onUpdateHrAllowance: function(allowance) {
		var url = this.getServiceUrl('hr_allowance/update');
		Utils.recordUpdate(this, allowance, url);
	},
	
	onDeleteHrAllowance: function(uuid) {
		var url = this.getServiceUrl('hr_allowance/remove');
		Utils.recordDelete(this, uuid, url);
	},
	onGetAllowName: function(corpUuid, uuid) {
		if( this.recordSet.length > 0 && this.corpUuid === corpUuid ){
			Utils.findRecordName(uuid, this.recordSet, 'allowName', 'hr-allowance');
			return;
		}

		this.onRetrieveHrAllowance(corpUuid);
	}
});

module.exports = AllowanceStore;

