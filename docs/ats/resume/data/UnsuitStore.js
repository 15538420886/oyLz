var Reflux = require('reflux');

var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');
var CommunicateActions = require('../action/CommunicateActions');
var EmployedActions = require('../action/EmployedActions');
var InterviewActions = require('../action/InterviewActions');
var UnsuitActions = require('../action/UnsuitActions');
var UnsuitStore = Reflux.createStore({
    listenables: [UnsuitActions],
    
    filter: '',
    recordSet: [],
    startPage : 0,
    pageRow : 0,
    totalRow : 0,
    
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

        MsgActions.showError('resume', operation, errMsg);
    },
    onAddUnsuit: function(data){
        var self = this;
        self.recordSet.push(data);
        self.fireEvent('create', '', self);
    },
    onRetrieveResume: function(filter) {
        var self = this;
        var url = this.getServiceUrl('resume/retrieve');
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
    
    onRetrieveResumePage: function(filter, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveResume( filter );
    },
    
    onInitResume: function(filter) {
        if( this.recordSet.length > 0 ){
            if( this.filter === filter ){
                this.fireEvent('retrieve', '', this);
                return;
            }
        }
        
        // FIXME 翻页
        // this.startPage = 1;
        // this.pageRow = 10;
        this.onRetrieveResume(filter);
    },
     // review评分store

    findRecord: function(self, uuid, resumeIdx)
    {
        var resume = self.recordSet[resumeIdx] ;
        for(var x = resume.review.length-1; x>=0; x--){
            if(resume.review[x].uuid === uuid){
                return x;
            }
        }

        return -1;
    },
     onCreateReview: function(filter) {
         
        var url = this.getServiceUrl('review/create');
        var self = this;
        Utils.doCreateService(url, filter).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                var resumeUuid=filter.filter;
                var resumeIdx = Utils.findRecord( self, resumeUuid );
                if(resumeIdx > -1){
                    var review = self.recordSet[resumeIdx].review;
                    if(!review){
                        self.recordSet[resumeIdx].review = [];
                    }
                    self.recordSet[resumeIdx].review.push(result.object); 

                } 

                self.fireEvent('create', '', self);
            }
            else{
                self.fireEvent('create', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
            }
        }, function (value) {
            self.fireEvent('create', util.getResErrMsg(value), self);
        }); 

    },
    
    onUpdateReview: function(filter) {
        var self = this;
        var url = this.getServiceUrl('review/update');
        Utils.doGetRecordService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
            if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                
                // self.object = result.object;
                //做页面处理 recordSet 下的对象的 review数组 的 某一个 对象
                var resumeUuid=filter.filter;
                var resumeIdx = Utils.findRecord( self, resumeUuid );
                var resumeObject = {};
                if(resumeIdx > -1){
                    //找到简历下的list
                    var idx = self.findRecord( self, result.object.uuid, resumeIdx);
                    self.recordSet[resumeIdx].review[idx] = result.object;
                }
                
                self.fireEvent('update', '', self);
            }
            else{
                self.fireEvent('update', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
            }
        }, function(value){
            self.fireEvent('update', "调用服务错误", self);
        });
    },
    onCreateResume: function(resume) {
        var url = this.getServiceUrl('resume/create');
        Utils.recordCreate(this, resume, url);
    },
    onUpdateResume: function(resume) {
        var url = this.getServiceUrl('resume/update');
        Utils.recordUpdate(this, resume, url);
    },
     onBatchUpdateResume: function(resume) {  
         var self = this; 
        var url = this.getServiceUrl('resume/batchUpdate');
        Utils.doCreateService(url, resume).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                 resume.uuidList.map(uuid => {
                    var idx = Utils.findRecord( self, uuid );
                    if(idx > -1){
                        //把self.recordSet[idx]放在相应的页面
                        if(resume.resumeState === '待沟通'){
                            //调用该页面的刷新
                            CommunicateActions.addCommunicate(self.recordSet[idx]);
                        }else if(resume.resumeState === '待面试'){
                            InterviewActions.addInterview(self.recordSet[idx]);
                        }else if(resume.resumeState === '已录用'){
                            EmployedActions.addEmployed(self.recordSet[idx]);
                        }else if(resume.resumeState === '不合适'){
                            UnsuitActions.addUnsuit(self.recordSet[idx]);
                        }
                        self.recordSet.splice(idx, 1);
                        self.totalRow = self.totalRow - 1;
                    }
                 });
                 self.fireEvent('batchUpdate', '', self);
            }
            else {
                self.fireEvent("处理错误[" + result.errCode + "][" + result.errDesc + "]");
            }
        }, function (xhr, errorText, errorType) {
            self.fireEvent('未知错误');
        });
    },
    
    onDeleteResume: function(uuid) {
        var url = this.getServiceUrl('resume/remove');
        Utils.recordDelete(this, uuid, url);
    }
});

module.exports = UnsuitStore;