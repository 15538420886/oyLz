var Reflux = require('reflux');
var RecruitActions = require('../action/RecruitActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var RecruitStore = Reflux.createStore({
    listenables: [RecruitActions],

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

        MsgActions.showError('recruit', operation, errMsg);
    },
    onGetCacheData: function() {
            this.fireEvent('cache', '', this);
    },

    onRetrieveRecruit: function(filter) {
        var self = this;
        var url = this.getServiceUrl('recruit/retrieve');
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

    onRetrieveRecruitPage: function(filter, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveRecruit( filter );
    },

    onInitRecruit: function(filter) {
        if( this.recordSet.length > 0 ){
            if( Utils.compareTo(this.filter, filter) ){
                this.fireEvent('retrieve', '', this);
                return;
            }
        }

        // FIXME 翻页
        this.startPage = 1;
        this.pageRow = 10;
        this.onRetrieveRecruit(filter);
    },

    onCreateRecruit: function(recruit) {
        var url = this.getServiceUrl('recruit/create');
        Utils.recordCreate(this, recruit, url);
    },

    onUpdateRecruit: function(recruit) {
        var url = this.getServiceUrl('recruit/update');
        Utils.recordUpdate(this, recruit, url);
    },

    onDeleteRecruit: function(uuid) {
        var url = this.getServiceUrl('recruit/remove');
        Utils.recordDelete(this, uuid, url);
    }
});

module.exports = RecruitStore;
