var Reflux = require('reflux');
var StatStatDefineActions = require('../action/StatStatDefineActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var StatStatDefineStore = Reflux.createStore({
	listenables: [StatStatDefineActions],
	
	InStatStatDefine: '',
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,
	
	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.tbugUrl+action;
	},
	
	fireEvent: function(operation, errMsg, self)
	{
		
		self.trigger({
			InStatStatDefine: self.InStatStatDefine,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});
		MsgActions.showError('stat-stat-define', operation, errMsg);
	},
	
	onRetrieveStatStatDefine: function(InStatStatDefine) {
		var self = this;
		var filter = {};
		filter.cmpId = window.loginData.compUser.corpUuid;
		filter.statMid = InStatStatDefine.StatStatDefine.uuid;
		alert(filter.statMid);
		var url = this.getServiceUrl('stat-stat-define/get-by-stat-mid');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.InStatStatDefine = InStatStatDefine;
				
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onRetrieveStatStatDefinePage: function(InStatStatDefine, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveStatStatDefine( InStatStatDefine );
	},
	
	onInitStatStatDefine: function(InStatStatDefine) {
		if( this.recordSet.length > 0 ){
			if( this.InStatStatDefine.uuid === InStatStatDefine.uuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveStatStatDefine(InStatStatDefine);
	},
	
	onCreateStatStatDefine: function(statStatDefine) {
		var url = this.getServiceUrl('stat-stat-define/create');
		Utils.recordCreate(this, statStatDefine, url);
	},
	
	onUpdateStatStatDefine: function(statStatDefine) {
		var url = this.getServiceUrl('stat-stat-define/update');
		Utils.recordUpdate(this, statStatDefine, url);
	},
	
	onDeleteStatStatDefine: function(uuid) {
		var url = this.getServiceUrl('stat-stat-define/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = StatStatDefineStore;

