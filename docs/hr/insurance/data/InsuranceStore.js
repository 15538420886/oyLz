var Reflux = require('reflux');
var InsuranceActions = require('../action/InsuranceActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var InsuranceStore = Reflux.createStore({
	listenables: [InsuranceActions],
	
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
		MsgActions.showError('hr_insurance', operation, errMsg);

		self.trigger({
			corpUuid: self.corpUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});
	},
	
	onRetrieveHrInsurance: function(corpUuid) {
		var self = this;
		var filter = {};
		filter.corpUuid = corpUuid;
		var url = this.getServiceUrl('hr_insurance/get-by-corp_uuid');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.corpUuid = corpUuid;
				
				self.fireEvent('get-by-corp_uuid', '', self);
			}
			else{
				self.fireEvent('get-by-corp_uuid', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('get-by-corp_uuid', "调用服务错误", self);
		});
	},
	
	onRetrieveHrInsurancePage: function(corpUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHrInsurance( corpUuid );
	},
	
	onInitHrInsurance: function(corpUuid) {
		if( this.recordSet.length > 0 ){
			if( this.corpUuid === corpUuid ){
				this.fireEvent('get-by-corp_uuid', '', this);
				return;
			}
		}
		
		this.onRetrieveHrInsurance(corpUuid);
	},
	
	onCreateHrInsurance: function(insurance) {
		var url = this.getServiceUrl('hr_insurance/create');
		Utils.recordCreate(this, insurance, url);
	},
	
	onUpdateHrInsurance: function(insurance) {
		var url = this.getServiceUrl('hr_insurance/update');
		Utils.recordUpdate(this, insurance, url);
	},
	
	onDeleteHrInsurance: function(uuid) {
		var url = this.getServiceUrl('hr_insurance/remove');
		Utils.recordDelete(this, uuid, url);
	},
	onGetInsuName: function(corpUuid, uuid) {
		if( this.recordSet.length > 0 && this.corpUuid === corpUuid ){
			Utils.findRecordName(uuid, this.recordSet, 'insuName', 'hr-insurance');
			return;
		}

		this.onRetrieveHrInsurance(corpUuid);
	}
});

module.exports = InsuranceStore;

