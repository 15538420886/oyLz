var Reflux = require('reflux');
var SpecDefActions = require('../action/SpecDefActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var SpecDefStore = Reflux.createStore({
    listenables: [SpecDefActions],
    
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

        MsgActions.showError('spec_flow_def', operation, errMsg);
    },
    onGetCacheData: function() {
            this.fireEvent('cache', '', this);
    },
    
    onRetrieveSpecFlowDef: function(filter) {
        var self = this;
        var url = this.getServiceUrl('spec_flow_def/get-by-corpUuid');
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
    
    onRetrieveSpecFlowDefPage: function(filter, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveSpecFlowDef( filter );
    },
    
    onInitSpecFlowDef: function(filter) {
        if( this.recordSet.length > 0 ){
            if( Utils.compareTo(this.filter, filter) ){
                this.fireEvent('retrieve', '', this);
                return;
            }
        }
        
        // FIXME 翻页
        this.startPage = 1;
        this.pageRow = 10;
        this.onRetrieveSpecFlowDef(filter);
    },
    
    onCreateSpecFlowDef: function(specDef) {
        var url = this.getServiceUrl('spec_flow_def/create');
        Utils.recordCreate(this, specDef, url);
    },
    
    onUpdateSpecFlowDef: function(specDef) {
        var url = this.getServiceUrl('spec_flow_def/update');
        Utils.recordUpdate(this, specDef, url);
    },
    onUpdateSpecFlowDef2: function(filter) {
        var self = this;
        var url = this.getServiceUrl('spec_flow_def/update');
        Utils.doUpdateService(url, filter).then(function(result) {
            if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.fireEvent('update', '', self);
            }
            else{
                self.fireEvent('update', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
            }
        }, function(value){
            self.fireEvent('update', "调用服务错误", self);
        });
    },
    onDeleteSpecFlowDef: function(uuid) {
        var url = this.getServiceUrl('spec_flow_def/remove');
        Utils.recordDelete(this, uuid, url);
    }
});

module.exports = SpecDefStore;