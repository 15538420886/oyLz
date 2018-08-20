var Reflux = require('reflux');
var AppGroupActions = require('../action/AppGroupActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');


var AppGroupStore = Reflux.createStore({
    listenables: [AppGroupActions],

    uuid: '',
    recordSet: [],
    startPage : 0,
    pageRow : 0,
    totalRow : 0,

    init: function() {
    },

    getServiceUrl: function(action)
    {
        return Utils.authUrl+action;
    },

    fireEvent: function(operation, errMsg, self)
    {
        self.trigger({
            uuid: self.uuid,
            recordSet: self.recordSet,
            startPage: self.startPage,
            pageRow: self.pageRow,
            totalRow: self.totalRow,
            operation: operation,
            errMsg: errMsg
        });

        MsgActions.showError('auth-app-group', operation, errMsg);

    },

    onRetrieveAuthAppGroup: function(uuid) {
        var self = this;
        var filter = {};
        filter.uuid = uuid;
        var url = this.getServiceUrl('auth-app-group/get-all');
        Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
            if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.recordSet = result.object.list;
                self.startPage = result.object.startPage;
                self.pageRow = result.object.pageRow;
                self.totalRow = result.object.totalRow;
                self.uuid = uuid;

                self.fireEvent('retrieve', '', self);
            }
            else{
                self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
            }
        }, function(value){
            self.fireEvent('retrieve', "调用服务错误", self);
        });
    },

    onRetrieveAuthAppGroupPage: function(uuid, startPage, pageRow) {
        var self = this;
        self.startPage = startPage;
        self.pageRow = pageRow;
        var filter = {};
        filter.uuid = uuid;
        var url = this.getServiceUrl('auth-app-group/get-all');
        Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
            if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.recordSet = result.object.list;
                self.startPage = result.object.startPage;
                self.pageRow = result.object.pageRow;
                self.totalRow = result.object.totalRow;
                self.uuid = uuid;

                self.fireEvent('retrieve', '', self);
            }
            else{
                self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
            }
        }, function(value){
            self.fireEvent('retrieve', "调用服务错误", self);
        });
    },

    onRetrieveAuthAppGroupPage: function(uuid, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveAuthAppGroup( uuid );
    },

    onInitAuthAppGroup: function(uuid) {
        if( this.recordSet.length > 0 ){
            if( this.uuid === uuid ){
                this.fireEvent('retrieve', '', this);
                return;
            }
        }

        this.onRetrieveAuthAppGroup(uuid);
    },

    onCreateAuthAppGroup: function(appGroup) {
        var url = this.getServiceUrl('auth-app-group/create');
        Utils.recordCreate(this, appGroup, url);
    },

    onUpdateAuthAppGroup: function(appGroup) {
        var url = this.getServiceUrl('auth-app-group/update');
        Utils.recordUpdate(this, appGroup, url);
    },

    onDeleteAuthAppGroup: function(uuid) {
        var url = this.getServiceUrl('auth-app-group/remove');
        Utils.recordDelete(this, uuid, url);
    }
});

module.exports = AppGroupStore;

