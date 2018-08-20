var Reflux = require('reflux');
var JobSalaryActions = require('../action/JobSalaryActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var JobSalaryStore = Reflux.createStore({
    listenables: [JobSalaryActions],
    
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
            errMsg: errMsg,
            object:self.object,
        });

        MsgActions.showError('stdJob', operation, errMsg);
    },
    
    onRetrieveStdJob: function(filter,stdJobUuid) {
        var self = this;
        var url = this.getServiceUrl('stdJob/retrieve');
        Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
            if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                result.object.list.map(function(item,index){
                    if(item.uuid ==stdJobUuid) {
                        self.recordSet = item.other;
                        self.startPage = result.object.startPage;
                        self.pageRow = result.object.pageRow;
                        self.totalRow = result.object.totalRow;
                        self.filter = filter;
                    }
                })
                
                self.fireEvent('retrieve', '', self);
            }
            else{
                self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
            }
        }, function(value){
            self.fireEvent('retrieve', "调用服务错误", self);
        });
    },
    
    onRetrieveStdJobPage: function(filter, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveStdJob( filter );
    },
    
    onInitStdJob: function(filter) {
        if( this.recordSet.length > 0 ){
            if( this.filter === filter ){
                this.fireEvent('retrieve', '', this);
                return;
            }
        }
        
        // FIXME 翻页
        // this.startPage = 1;
        // this.pageRow = 10;
        this.onRetrieveStdJob(filter);
    },

    onCreateStdJob: function(stdJob) {
        var url = this.getServiceUrl('stdJob/other-create');
        Utils.recordCreate(this, stdJob, url);
    },
    
    onUpdateStdJob: function(filter) {
        var self = this;
        var url = this.getServiceUrl('stdJob/other-update');
        Utils.doGetRecordService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
            if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.object = result.object;
                self.fireEvent('update', '', self);
            }
            else{
                self.fireEvent('update', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
            }
        }, function(value){
            self.fireEvent('update', "调用服务错误", self);
        });
    },
    
    onDeleteStdJob: function(filter) {
        var self = this;
        var url = this.getServiceUrl('stdJob/other-remove');
        Utils.doGetRecordService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
            if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.object = result.object;
                self.fireEvent('remove', '', self);
            }
            else{
                self.fireEvent('remove', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
            }
        }, function(value){
            self.fireEvent('remove', "调用服务错误", self);
        });
    },
    
});

module.exports = JobSalaryStore;