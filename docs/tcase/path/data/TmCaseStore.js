var Reflux = require('reflux');
var TmCaseActions = require('../action/TmCaseActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var TmCaseStore = Reflux.createStore({
    listenables: [TmCaseActions],
    
    pid: '',
    recordSet: [],
    startPage : 0,
    pageRow : 0,
    totalRow : 0,
    
    init: function() {
    },
    getServiceUrl: function(action)
    {
        return Utils.tcaseUrl+action;
    },
    
    fireEvent: function(operation, errMsg, self)
    {
        self.trigger({
            pid: self.pid,
            recordSet: self.recordSet,
            startPage: self.startPage,
            pageRow: self.pageRow,
            totalRow: self.totalRow,
            operation: operation,
            errMsg: errMsg
        });

        MsgActions.showError('tm-case', operation, errMsg);
    },
    
    onRetrieveTmCase: function(pid) {
        var self = this;
        var filter = {};
		filter.pid = pid;
        var url = this.getServiceUrl('tm-case/tmcaseCatelist');
        Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
        	
            if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
               self.recordSet = result.object.list
                self.pid = pid;
                
                self.fireEvent('retrieve', '', self);
            }
            else{
                self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
            }
        }, function(value){
            self.fireEvent('retrieve', "调用服务错误", self);
        });
    },
    
    onRetrieveTmCasePage: function(pid, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveTmCase( pid );
    },
    
    onInitTmCase: function(pid) {
        if( this.recordSet.length > 0 ){
            if( this.pid === pid ){
                this.fireEvent('retrieve', '', this);
                return;
            }
        }
        
        // FIXME 翻页
        // this.startPage = 1;
        // this.pageRow = 10;
        this.onRetrieveTmCase(pid);
    },
    
    onCreateTmCase: function(tmCase) {
        var url = this.getServiceUrl('tm-case/addTmcaseCate');
        Utils.recordCreate(this, tmCase, url);
    },
    
     onUpdateTmCase: function(path) {
        var url = this.getServiceUrl('tm-case/updateCaseCate');
        Utils.recordUpdate(this, path, url);
    },
    
    onDeleteTmCase: function(uuid) {
        var url = this.getServiceUrl('tm-case/removeTmcaseCate');
        Utils.recordDelete(this, uuid, url);
    }
});

module.exports = TmCaseStore;