var Reflux = require('reflux');
var StdJobActions = require('../action/StdJobActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');
var FindNameActions = require('../../../../lib/action/FindNameActions');

var StdJobStore = Reflux.createStore({
    listenables: [StdJobActions],
    
    filter: {},
    recordSet: [],
    startPage : 0,
    pageRow : 0,
    totalRow : 0,

    // uuid <--> name
    jobMap: {},
    
    init: function() {
    },
    getServiceUrl: function(action)
    {
        return Utils.atsUrl+action;
    },
    
    fireEvent: function(operation, errMsg, self)
    {
        // 生成名称对照表
        if (self.filter.corpUuid !== undefined && self.filter.corpUuid !== null) {
            var jMap = {};
            self.recordSet.map((node, i) => {
                jMap[node.uuid] = node.jobCode;
            });

            self.jobMap[self.filter.corpUuid] = jMap;
        }

        self.trigger({
            filter: self.filter,
            recordSet: self.recordSet,
            startPage: self.startPage,
            pageRow: self.pageRow,
            totalRow: self.totalRow,
            operation: operation,
            errMsg: errMsg
        });

        MsgActions.showError('stdJob', operation, errMsg);
    },

    onGetCacheData: function() {
        this.fireEvent('cache', '', this);
    },
    
    onRetrieveStdJob: function(filter) {
        var self = this;
        var url = this.getServiceUrl('stdJob/retrieve');
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
    
    onRetrieveStdJobPage: function(filter, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveStdJob( filter );
    },
    
    onInitStdJob: function(filter) {
        if( this.recordSet.length > 0 ){
            if( Utils.compareTo(this.filter, filter) ){
                this.fireEvent('retrieve', '', this);
                return;
            }
        }
        
        // FIXME 翻页
        this.startPage = 1;
        this.pageRow = 10;
        this.onRetrieveStdJob(filter);
    },
    
    onCreateStdJob: function(stdJob) {
        var url = this.getServiceUrl('stdJob/create');
        Utils.recordCreate(this, stdJob, url);
    },
    
    onUpdateStdJob: function(stdJob) {
        var url = this.getServiceUrl('stdJob/update');
        Utils.recordUpdate(this, stdJob, url);
    },
    
    onDeleteStdJob: function(uuid) {
        var url = this.getServiceUrl('stdJob/remove');
        Utils.recordDelete(this, uuid, url);
    },

    onGetJobCodeName: function (corpUuid, uuid) {
        var jMap = this.jobMap[corpUuid];
        if (jMap !== undefined && jMap !== null) {
            var jobCode = jMap[uuid];
            if (jobCode === undefined || jobCode === null) {
                jobCode = uuid;
            }
            FindNameActions.findName('stdJob', uuid, jobCode);
            return;
        }

        var f = { corpUuid: corpUuid};
        this.onRetrieveStdJob(f);
    }
});

module.exports = StdJobStore;