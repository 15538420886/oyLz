var Reflux = require('reflux');
var BizTripActions = require('../action/BizTripActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var BizTripStore = Reflux.createStore({
	listenables: [BizTripActions],
	
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

		MsgActions.showError('hr_biz_trip', operation, errMsg);
	},
	
	onRetrieveHrBizTrip: function(corpUuid) {
		var self = this;
		var filter = {};
		filter.corpUuid = corpUuid;
		var url = this.getServiceUrl('hr_biz_trip/get-by-corp_uuid');
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
	
	onRetrieveHrBizTripPage: function(corpUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHrBizTrip( corpUuid );
	},
	
	onInitHrBizTrip: function(corpUuid) {
		if( this.recordSet.length > 0 ){
			if( this.corpUuid === corpUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveHrBizTrip(corpUuid);
	},
	
	onCreateHrBizTrip: function(bizTrip) {
		var url = this.getServiceUrl('hr_biz_trip/create');
		Utils.recordCreate(this, bizTrip, url);
	},
	
	onUpdateHrBizTrip: function(bizTrip) {
		var url = this.getServiceUrl('hr_biz_trip/update');
		Utils.recordUpdate(this, bizTrip, url);
	},
	
	onDeleteHrBizTrip: function(uuid) {
		var url = this.getServiceUrl('hr_biz_trip/remove');
		Utils.recordDelete(this, uuid, url);
	},
	onGetTripName: function(corpUuid, uuid) {
		if( this.recordSet.length > 0 && this.corpUuid === corpUuid ){
			Utils.findRecordName(uuid, this.recordSet, 'tripName', 'hr_trip');
			return;
		}

		this.onRetrieveHrBizTrip(corpUuid);
	}
});

module.exports = BizTripStore;

