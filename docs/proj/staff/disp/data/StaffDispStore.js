var Reflux = require('reflux');
var StaffDispActions = require('../action/StaffDispActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var StaffDispStore = Reflux.createStore({
	listenables: [StaffDispActions],
	corpUuid: '',
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
			corpUuid: self.corpUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('proj-member', operation, errMsg);
	},
	
	onRetrieveProjMember: function(corpUuid,chkDate) {
		var self = this;
		var filter = {};
		filter.corpUuid = corpUuid;
		filter.chkDate =chkDate;
		var url = this.getServiceUrl('proj-member/retrieve3');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.corpUuid = corpUuid;
				self.chkDate = chkDate;
				
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onRetrieveProjMemberPage: function(corpUuid,chkDate, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.chkDate = chkDate;
		this.onRetrieveProjMember( corpUuid,chkDate );
    },

    onRetrieveStaffProj: function (corpUuid, staffCode) {
        var self = this;
        if (staffCode === null || staffCode === '' || staffCode === undefined) {
            self.recordSet = [];
            self.startPage = 0;
            self.pageRow = 0;
            self.totalRow = 0;
            self.corpUuid = corpUuid;
            self.staffCode = '';

            self.fireEvent('retrieve', '', self);
            return;
        }

        var filter = {};
        filter.corpUuid = corpUuid;
        filter.staffCode = staffCode;
        var url = this.getServiceUrl('proj-member/findStaffLog');
        Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.recordSet = result.object.list;
                self.startPage = result.object.startPage;
                self.pageRow = result.object.pageRow;
                self.totalRow = result.object.totalRow;
                self.corpUuid = corpUuid;
                self.staffCode = staffCode;

                self.fireEvent('retrieve', '', self);
            }
            else {
                self.fireEvent('retrieve', "处理错误[" + result.errCode + "][" + result.errDesc + "]", self);
            }
        }, function (value) {
            self.fireEvent('retrieve', "调用服务错误", self);
        });
    },
});

module.exports = StaffDispStore;

