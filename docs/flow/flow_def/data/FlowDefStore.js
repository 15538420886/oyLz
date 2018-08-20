var Reflux = require('reflux');
var FlowDefActions = require('../action/FlowDefActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var FlowDefStore = Reflux.createStore({
    listenables: [FlowDefActions],

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
            startPage: self.startPage,
            pageRow: self.pageRow,
            totalRow: self.totalRow,
            operation: operation,
            errMsg: errMsg
        });

        MsgActions.showError('flow-def', operation, errMsg);
    },
    onGetCacheData: function() {
        this.fireEvent('cache', '', this);
    },

    onRetrieveFlowDef: function(filter) {
        var self = this;
        var url = this.getServiceUrl('flow-def/get-by-corpUuid');
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

    onRetrieveFlowDefPage: function(filter, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveFlowDef( filter );
    },

    onInitFlowDef: function(filter) {
        if( this.recordSet.length > 0 ){
            if( Utils.compareTo(this.filter, filter) ){
                this.fireEvent('retrieve', '', this);
                return;
            }
        }

        // FIXME 翻页
        this.startPage = 1;
        this.pageRow = 10;
        this.onRetrieveFlowDef(filter);
    },

    onCreateFlowDef: function(flowDef) {
        var url = this.getServiceUrl('flow-def/create');
        Utils.recordCreate(this, flowDef, url);
    },

    onUpdateFlowDef: function(flowDef) {

        var url = this.getServiceUrl('flow-def/update');
        Utils.recordUpdate(this, flowDef, url);

    },

    onDeleteFlowDef: function(uuid) {
        var url = this.getServiceUrl('flow-def/remove');
        Utils.recordDelete(this, uuid, url);
    }
});

module.exports = FlowDefStore;