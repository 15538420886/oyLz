var Reflux = require('reflux');
var EntryLocActions = require('../action/EntryLocActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var EntryLocStore = Reflux.createStore({
    listenables: [EntryLocActions],

    filter: {},
    recordSet: [],
    startPage : 0,
    pageRow : 0,
    totalRow : 0,

    init: function() {
    },
    getServiceUrl: function(action)
    {
        return Utils.atsUrl+action;
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

        MsgActions.showError('entry-loc', operation, errMsg);
    },
    onGetCacheData: function() {
        this.fireEvent('cache', '', this);
    },

    onRetrieveEntryLoc: function(filter) {
        var self = this;
        var url = this.getServiceUrl('entry-loc/retrieve');
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

    onRetrieveEntryLocPage: function(filter, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveEntryLoc( filter );
    },

    onInitEntryLoc: function(filter) {
        if( this.recordSet.length > 0 ){
            if( Utils.compareTo(this.filter, filter) ){
                this.fireEvent('retrieve', '', this);
                return;
            }
        }

        // FIXME 翻页
        this.startPage = 1;
        this.pageRow = 10;
        this.onRetrieveEntryLoc(filter);
    },

    onCreateEntryLoc: function(entryLoc) {
        var url = this.getServiceUrl('entry-loc/create');
        Utils.recordCreate(this, entryLoc, url);
    },

    onUpdateEntryLoc: function(entryLoc) {
        var url = this.getServiceUrl('entry-loc/update');
        Utils.recordUpdate(this, entryLoc, url);
    },

    onDeleteEntryLoc: function(uuid) {
        var url = this.getServiceUrl('entry-loc/remove');
        Utils.recordDelete(this, uuid, url);
    }
});

module.exports = EntryLocStore;
