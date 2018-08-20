var Reflux = require('reflux');
var TempCheckActions = require('../action/TempCheckActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var TempCheckStore = Reflux.createStore({
	listenables: [TempCheckActions],
	
    filter: {},
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
			filter: self.filter,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('user-chk-book', operation, errMsg);
	},
	
	onRetrieveUserChkBook: function(filter) {
		var self = this;
        var url = this.getServiceUrl('user-chk-book/retrieve-group-temp');
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
	
    onRetrieveUserChkBookPage: function (filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
        this.onRetrieveUserChkBook(filter );
	},
	
    onInitUserChkBook: function (filter) {
		if( this.recordSet.length > 0 ){
            if (Utils.compareTo(filter, this.filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
        this.onRetrieveUserChkBook(filter);
	},
	
	onCreateUserChkBook: function(tempCheck) {
		var url = this.getServiceUrl('user-chk-book/create-temp-chk');
        Utils.recordCreate(this, tempCheck, url, this.onCreateComplete);
    },
    onCreateComplete: function (store, data) {
        for (var x = store.recordSet.length - 1; x >= 0; x--) {
            if (store.recordSet[x].staffCode === data.staffCode) {
                store.onUpdateComplete(store, store.recordSet[x], data)
                break;
            }
        }
    },
	
    onUpdateUserChkBook: function (data) {
        var idx = -1;
        for (var x = this.recordSet.length - 1; x >= 0; x--) {
            if (this.recordSet[x].checkUuid === data.uuid) {
                idx = x;
                break;
            }
        }

        var self = this;
        if (idx < 0) {
            self.fireEvent('update', '没有找到记录[' + data.uuid + ']', self);
            return;
        }

		var url = this.getServiceUrl('user-chk-book/update-temp-chk');
        Utils.doUpdateService(url, data).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.onUpdateComplete(self, self.recordSet[idx], result.object);
                self.fireEvent('update', '', self);
            }
            else {
                self.fireEvent('update', "处理错误[" + result.errCode + "][" + result.errDesc + "]", self);
            }
        }, function (value) {
            self.fireEvent('update', Utils.getResErrMsg(value), self);
        });
    },
    onUpdateComplete: function (store, old, data) {
        old.checkUuid = data.uuid;
        old.checkIn = data.checkIn;
        old.checkOut = data.checkOut;

        old.leaveType = data.leaveType;
        old.leaveHour = data.leaveHour;
        old.workHour = data.workHour;
        old.overHour = data.overHour;
        old.pmCode = data.pmCode;
        old.pmName = data.pmName;
        old.chkDesc = data.chkDesc;
        old.chkType = data.chkType;
        old.dateType = data.dateType;
    },
	
	onDeleteUserChkBook: function(userChkObj) {
		var url = this.getServiceUrl('user-chk-book/remove-temp-chk');
		this.recordDelete(this, userChkObj, url);
	},

	recordDelete: function(store, data, url) {
		var util = Utils;
		var self = store;
		var idx = util.findRecord( store, data.uuid );
		if(idx < 0){
			self.fireEvent('remove', '没有找到记录['+data.uuid+']', self);
			return;
		}

		util.doRemoveService(url, data).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet.splice(idx, 1);
				self.totalRow = self.totalRow - 1;
				self.fireEvent('remove', '', self);
			}
			else{
				self.fireEvent('remove', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('remove', util.getResErrMsg(value), self);
		});
	},
});

module.exports = TempCheckStore;

