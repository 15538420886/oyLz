var Reflux = require('reflux');
var FntAppActions = require('../action/FntAppActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');


var FntAppStore = Reflux.createStore({
    listenables: [FntAppActions],

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

        MsgActions.showError('fnt-app', operation, errMsg);

    },

    onRetrieveFntApp: function(uuid) {
        var self = this;
        var filter = {};
        filter.uuid = uuid;
        var url = this.getServiceUrl('fnt-app/retrieve');
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

    onRetrieveFntAppPage: function(uuid, startPage, pageRow) {
        var self = this;
        self.startPage = startPage;
        self.pageRow = pageRow;
        var filter = {};
        filter.uuid = uuid;
        var url = this.getServiceUrl('fnt-app/retrieve');
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

    onRetrieveFntAppPage: function(uuid, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveFntApp( uuid );
    },

    onInitFntApp: function(uuid) {
        if( this.recordSet.length > 0 ){
            if( this.uuid === uuid ){
                this.fireEvent('retrieve', '', this);
                return;
            }
        }

        this.onRetrieveFntApp(uuid);
    },

    onCreateFntApp: function(fntApp) {
        var url = this.getServiceUrl('fnt-app/create');
        Utils.recordCreate(this, fntApp, url);
    },

    onUpdateFntApp: function(fntApp) {
        var url = this.getServiceUrl('fnt-app/update');
        Utils.recordUpdate(this, fntApp, url);
    },

    onDeleteFntApp: function(uuid) {
        var url = this.getServiceUrl('fnt-app/remove');
        Utils.recordDelete(this, uuid, url);
    }
});

module.exports = FntAppStore;

