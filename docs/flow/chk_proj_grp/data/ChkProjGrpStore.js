var Reflux = require('reflux');
var ChkProjGrpActions = require('../action/ChkProjGrpActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var ChkProjGrpStore = Reflux.createStore({
    listenables: [ChkProjGrpActions],

    filter: {},
    recordSet: [],
    startPage : 0,
    pageRow : 0,
    totalRow : 0,

    init: function() {
    },
    getServiceUrl: function(action)
    {
        return Utils.flowUrl+action;
    },

    fireEvent: function(operation, errMsg, self)
    {
        self.trigger({
            filter: self.filter,
            recordSet: self.recordSet,
            operation: operation,
            errMsg: errMsg,
            object: self.object,
            uuid: self.uuid
        });

        MsgActions.showError('chk-proj-grp', operation, errMsg);
    },
    onGetCacheData: function() {
            this.fireEvent('cache', '', this);
    },

    onRetrieveChkProjGrp: function(filter) {

        var self = this;
        var url = this.getServiceUrl('chk-proj-grp/retrieve');
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

    onRetrieveChkProjGrpPage: function(filter, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveChkProjGrp( filter );
    },

    onInitChkProjGrp: function(filter) {
        if( this.recordSet.length > 0 ){
            if( this.filter === filter  ){
                this.fireEvent('retrieve', '', this);
                return;
            }
        }
        this.onRetrieveChkProjGrp(filter);
    },

    onCreateChkProjGrp: function(filter) {
        var self = this;
	    var url = this.getServiceUrl('chk-proj-grp/create');
		Utils.doUpdateService(url, filter).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.object = result.object;

				self.fireEvent('create', '', self);
			}
			else{
				self.fireEvent('create', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('create', "调用服务错误", self);
		});
    },

    onUpdateChkProjGrp: function(filter) {
        var self = this;
	    var url = this.getServiceUrl('chk-proj-grp/update');
		Utils.doUpdateService(url, filter).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.object = result.object;

				self.fireEvent('update', '', self);
			}
			else{
				self.fireEvent('update', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('update', "调用服务错误", self);
		});
    },

    onDeleteChkProjGrp: function(uuid) {
        var url = this.getServiceUrl('chk-proj-grp/remove');
        Utils.recordDelete(this, uuid, url);
    },

    onGetProjByUuid: function (uuid) {
        var self = this;
        self.uuid = uuid;
        var url = this.getServiceUrl('chk-proj-grp/get-by-uuid');
        Utils.doGetRecordService(url, uuid).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {

                self.object = result.object;
                self.fireEvent('find', '', self);
            }
            else {
                self.fireEvent('find', "处理错误[" + result.errCode + "][" + result.errDesc + "]", self);
            }
        }, function (value) {
            self.fireEvent('find', "调用服务错误", self);
        });
    },
});

module.exports = ChkProjGrpStore;
