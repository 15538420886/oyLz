var Reflux = require('reflux');
var ServiceActions = require('../action/ServiceActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var ServiceStore = Reflux.createStore({
	listenables: [ServiceActions],

    resUuid: '',
    selectedTxn: null,
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,

	init: function() {
	},

	getServiceUrl: function(action)
	{
		return Utils.devUrl+action;
	},

	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			resUuid: self.resUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('app-txn', operation, errMsg);
	},

	onRetrieveAppTxn: function(resUuid) {
		var self = this;
		var filter = {};
		filter.resUuid = resUuid;
		var url = this.getServiceUrl('app-txn/get-by-resUuid');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.resUuid = resUuid;

				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onRetrieveAppTxnPage: function(resUuid, startPage, pageRow) {
		var self = this;
		self.startPage = startPage;
		self.pageRow = pageRow;
		var filter = {};
		filter.resUuid = resUuid;
		var url = this.getServiceUrl('app-txn/get-by-resUuid');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.resUuid = resUuid;

				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onInitAppTxn: function(resUuid) {
		if( this.recordSet.length > 0 ){
			if( this.resUuid === resUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveAppTxn(resUuid);
	},

	onCreateAppTxn: function(service) {
		var url = this.getServiceUrl('app-txn/create');
		Utils.recordCreate(this, service, url);
	},

	onUpdateAppTxn: function(service) {
		var url = this.getServiceUrl('app-txn/update');
		Utils.recordUpdate(this, service, url);
	},

	onDeleteAppTxn: function(uuid) {
		var url = this.getServiceUrl('app-txn/remove');
		Utils.recordDelete(this, uuid, url);
    },

    onFindAppTxn: function (resUuid, txnName) {
        var self = this;

        self.selectedTxn = null;
        if (self.resUuid === resUuid) {
            // 先查缓存
            for (var x = self.recordSet.length - 1; x >= 0; x--) {
                if (self.recordSet[x].txnName === txnName) {
                    self.selectedTxn = self.recordSet[x];
                    self.fireEvent('find', '', self);
                    return;
                }
            }

            self.fireEvent('find', "没有找到接口信息", self);
            return;
        }
        
        var filter = {};
        filter.resUuid = resUuid;
        var url = this.getServiceUrl('app-txn/get-by-resUuid');
        Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.recordSet = result.object.list;
                self.startPage = result.object.startPage;
                self.pageRow = result.object.pageRow;
                self.totalRow = result.object.totalRow;
                self.resUuid = resUuid;

                for (var x = self.recordSet.length - 1; x >= 0; x--) {
                    if (self.recordSet[x].txnName === txnName) {
                        self.selectedTxn = self.recordSet[x];
                        break;
                    }
                }

                if (self.selectedRes === null) {
                    self.fireEvent('find', "没有找到接口信息", self);
                }
                else {
                    self.fireEvent('find', '', self);
                }
            }
            else {
                self.fireEvent('find', "处理错误[" + result.errCode + "][" + result.errDesc + "]", self);
            }
        }, function (value) {
            self.fireEvent('find', "调用服务错误", self);
        });
    },

});

module.exports = ServiceStore;
