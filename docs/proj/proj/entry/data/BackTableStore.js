var Reflux = require('reflux');
var BackTableActions = require('../action/BackTableActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var BackTableStore = Reflux.createStore({
	listenables: [BackTableActions],
	
	projUuid: '',
	recordSet: [],
	member: {},
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
			member: self.member,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('proj-member', operation, errMsg);
	},

	onGetMember: function(staffCode){
		var self = this;
		var filter = {};
		filter.corpUuid = window.loginData.compUser.corpUuid;
		filter.staffCode = staffCode;
		var url = Utils.projUrl+ 'res-member/retrieve';
		Utils.doRetrieveService(url, filter, 1, 1, 1).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.member = result.object.list[0];
				self.fireEvent('retrieveMember', '', self);
			}
			else{
				self.fireEvent('retrieveMember', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieveMember', "调用服务错误", self);
		});
	},

	onRetrieveBackTable: function(projUuid) {
		var self = this;
		var filter = {};
		filter.projUuid = projUuid;
        filter.manStatus = '暂时离组';
		var url = this.getServiceUrl('proj-member/retrieve2');
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
	
	onRetrieveBackTablePage: function(projUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveBackTable( projUuid );
	},
	
	onInitBackTable: function(projUuid) {
		if( this.recordSet.length > 0 ){
			if( this.projUuid === projUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveBackTable(projUuid);
	},
	
	onBackSure: function(back) {
		var self = this;
		var url = this.getServiceUrl('proj-member/create1');
		Utils.doCreateService(url, back).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				var idx = Utils.findRecord( self, back.uuid );
				if(idx < 0){
					self.fireEvent('create', '没有找到记录['+back.uuid+']', self);
					return;
				}
				self.recordSet.splice(idx, 1);
				self.totalRow = self.totalRow - 1;
				self.fireEvent('create', '', self);
			}
			else{
				self.fireEvent('create', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('create', "调用服务错误", self);
		});
	},
    
});

module.exports = BackTableStore;