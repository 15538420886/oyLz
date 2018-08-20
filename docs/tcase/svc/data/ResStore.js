var Reflux = require('reflux');
var ResActions = require('../action/ResActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var ResStore = Reflux.createStore({
	listenables: [ResActions],

    appUuid: '',
    selectedRes: null,
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
            appUuid: self.appUuid,
            selectedRes: self.selectedRes,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('app-res', operation, errMsg);
	},

	onRetrieveAppRes: function(appUuid) {
		var self = this;
		var filter = {};
		filter.appUuid = appUuid;
		var url = this.getServiceUrl('app-res/get-by-appUuidAndModUuid');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.appUuid = appUuid;

				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onRetrieveAppResPage: function(appUuid, startPage, pageRow) {
		var self = this;
		self.startPage = startPage;
		self.pageRow = pageRow;
		var filter = {};
		filter.appUuid = appUuid;
		var url = this.getServiceUrl('app-res/get-by-appUuidAndModUuid');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.appUuid = appUuid;

				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onInitAppRes: function(appUuid) {
		if( this.recordSet.length > 0 ){
			if( this.appUuid === appUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveAppRes(appUuid);
	},

	onCreateAppRes: function(res) {
		var url = this.getServiceUrl('app-res/create');
		Utils.recordCreate(this, res, url);
	},

	onUpdateAppRes: function(res) {
		var url = this.getServiceUrl('app-res/update');
		Utils.recordUpdate(this, res, url);
	},

	onDeleteAppRes: function(uuid) {
		var url = this.getServiceUrl('app-res/remove');
		Utils.recordDelete(this, uuid, url);
    },
    
    onFindAppRes: function (appUuid, resName) {
        var self = this;

        self.selectedRes = null;
        if (self.appUuid === appUuid) {
            // 先查缓存
            for (var x = self.recordSet.length - 1; x >= 0; x--) {
                if (self.recordSet[x].resName === resName) {
                    self.selectedRes = self.recordSet[x];
                    self.fireEvent('find', '', self);
                    return;
                }
            }

            self.fireEvent('find', "没有找到资源信息", self);
            return;
        }

        var filter = {};
        filter.appUuid = appUuid;
        var url = this.getServiceUrl('app-res/get-by-appUuidAndModUuid');
        Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.recordSet = result.object.list;
                self.startPage = result.object.startPage;
                self.pageRow = result.object.pageRow;
                self.totalRow = result.object.totalRow;
                self.appUuid = appUuid;

                for (var x = self.recordSet.length - 1; x >= 0; x--) {
                    if (self.recordSet[x].resName === resName) {
                        self.selectedRes = self.recordSet[x];
                        break;
                    }
                }

                if (self.selectedRes === null) {
                    self.fireEvent('find', "没有找到资源信息", self);
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

module.exports = ResStore;
