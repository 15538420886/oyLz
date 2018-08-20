var Reflux = require('reflux');
var AstResumeActions = require('../action/AstResumeActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var AstResumeStore = Reflux.createStore({
    listenables: [AstResumeActions],
    
    filter: '',
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

        MsgActions.showError('ast-resume', operation, errMsg);
    },
    
    onRetrieveAstResume: function(filter) {
        var self = this;
        var filter = {};
		filter.filter = filter;
        var url = this.getServiceUrl('ast-resume/retrieve');
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
    
    onRetrieveAstResumePage: function(filter, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveAstResume( filter );
    },
    
    onInitAstResume: function(filter) {
        if( this.recordSet.length > 0 ){
            if( this.filter === filter ){
                this.fireEvent('retrieve', '', this);
                return;
            }
        }
        
        // FIXME 翻页
        // this.startPage = 1;
        // this.pageRow = 10;
        this.onRetrieveAstResume(filter);
    },
    
    onCreateAstResume: function(astResume) {
        var url = this.getServiceUrl('ast-resume/create');
        Utils.recordCreate(this, astResume, url);
    },
    
    onUpdateAstResume: function(astResume) {
        var url = this.getServiceUrl('ast-resume/update');
        Utils.recordUpdate(this, astResume, url);
    },
    
    onDeleteAstResume: function(uuid) {
        var url = this.getServiceUrl('ast-resume/remove');
        Utils.recordDelete(this, uuid, url);
    }
});

module.exports = AstResumeStore;