var Reflux = require('reflux');
var TripAgentActions = require('../action/TripAgentActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var TripAgentStore = Reflux.createStore({
    listenables: [TripAgentActions],

    filter: {},
    recordSet: [],
    startPage : 0,
    pageRow : 0,
    totalRow : 0,

    init: function() {
    },
    getServiceUrl: function(action)
    {
        return Utils.costUrl+action;
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

        MsgActions.showError('trip-agent', operation, errMsg);
    },
    onGetCacheData: function() {
        this.fireEvent('cache', '', this);
    },

    onRetrieveTripAgent: function(filter) {
        var self = this;
        var url = this.getServiceUrl('trip-agent/retrieve');
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

    onRetrieveTripAgentPage: function(filter, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveTripAgent( filter );
    },

    onInitTripAgent: function(filter) {
        if( this.recordSet.length > 0 ){
            if( Utils.compareTo(this.filter, filter) ){
                this.fireEvent('retrieve', '', this);
                return;
            }
        }

        // FIXME 翻页
        this.startPage = 1;
        this.pageRow = 10;
        this.onRetrieveTripAgent(filter);
    },

    onCreateTripAgent: function(tripAgent) {
        var url = this.getServiceUrl('trip-agent/create');
        Utils.recordCreate(this, tripAgent, url);
    },

    onUpdateTripAgent: function(tripAgent) {
        var url = this.getServiceUrl('trip-agent/update');
        Utils.recordUpdate(this, tripAgent, url);
    },

    onDeleteTripAgent: function(uuid) {
        var url = this.getServiceUrl('trip-agent/remove');
        Utils.recordDelete(this, uuid, url);
    }
});

module.exports = TripAgentStore;