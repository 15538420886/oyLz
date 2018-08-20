var Reflux = require('reflux');
var StaffActions = require('../action/StaffActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var StaffStore = Reflux.createStore({
	listenables: [StaffActions],
	
	filter: {},
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,
	
	init: function() {
	},

	getServiceUrl: function(action) {
		return Utils.projUrl+action;
	},
	
	fireEvent: function(operation, errMsg, self) {
		self.trigger({
			filter: self.filter,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('out-staff', operation, errMsg);
	},
	
	onGetCacheData: function (outUuid) {
        if (this.filter.outUuid !== outUuid) {
            this.filter = {};
            this.recordSet = [];
            this.startPage = 0;
            this.pageRow = 0;
            this.totalRow = 0;
        }

		this.fireEvent('cache', '', this);
	},

	onRetrieveOutStaff: function(filter) {
		var self = this;
		var url = this.getServiceUrl('out-staff/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {

			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.filter = filter;
				
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onRetrieveOutStaffPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveOutStaff( filter );
	},
	
	onInitOutStaff: function(filter) {
		if( this.recordSet.length > 0 ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveOutStaff(filter);
	},
	
	onCreateOutStaff: function(data) {
		var url = this.getServiceUrl('out-staff/createWithJob');
		
		var self = this;
		Utils.doCreateService(url, data).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet.push(result.object.os);
				self.totalRow = self.totalRow + 1;
				self.fireEvent('create', '', self);
			}
			else{
				self.fireEvent('create', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('create', "调用服务错误", self);
		});
	},
	
	onUpdateOutStaff: function(staff) {
		var url = this.getServiceUrl('out-staff/update');
		Utils.recordUpdate(this, staff, url);
	},
	
	onDeleteOutStaff: function(uuid) {
		var url = this.getServiceUrl('out-staff/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = StaffStore;

