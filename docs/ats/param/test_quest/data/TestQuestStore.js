var Reflux = require('reflux');
var TestQuestActions = require('../action/TestQuestActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var TestQuestStore = Reflux.createStore({
    listenables: [TestQuestActions],

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

        MsgActions.showError('quest-store', operation, errMsg);
    },
    onGetCacheData: function() {
        this.fireEvent('cache', '', this);
    },

    onRetrieveQuestStore: function(filter) {
        var self = this;
        var url = this.getServiceUrl('quest-store/retrieve');
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

    onRetrieveQuestStorePage: function(filter, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveQuestStore( filter );
    },

    onInitQuestStore: function(filter) {
        if( this.recordSet.length > 0 ){
            if( Utils.compareTo(this.filter, filter) ){
                this.fireEvent('retrieve', '', this);
                return;
            }
        }

        // FIXME 翻页
        this.startPage = 1;
        this.pageRow = 10;
        this.onRetrieveQuestStore(filter);
    },

    onCreateQuestStore: function(questStore) {
        var url = this.getServiceUrl('quest-store/create');
        Utils.recordCreate(this, questStore, url);
    },

    onUpdateQuestStore: function(questStore) {
        var url = this.getServiceUrl('quest-store/update');
        Utils.recordUpdate(this, questStore, url);
    },

    onDeleteQuestStore: function(uuid) {
        var url = this.getServiceUrl('quest-store/remove');
        Utils.recordDelete(this, uuid, url);
    }
});

module.exports = TestQuestStore;