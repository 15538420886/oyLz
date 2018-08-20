var Reflux = require('reflux');
var HrExecutActions = require('../action/HrExecutActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');
var FindNameActions = require('../../../../lib/action/FindNameActions');

var HrExecutStore = Reflux.createStore({
    listenables: [HrExecutActions],
    
    filter: {},
    recordSet: [],
    startPage : 0,
    pageRow : 0,
    totalRow : 0,

    // uuid <--> name
    hrMap: {},
    
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
            var hMap = {};
            self.recordSet.map((node, i) => {
                hMap[node.uuid] = node.hrName;
            });
            self.hrMap[self.filter.corpUuid] = hMap;
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

        MsgActions.showError('hr_execut', operation, errMsg);
    },

    onGetCacheData: function() {
            this.fireEvent('cache', '', this);
    },
    
    onRetrieveHrExecut: function(filter) {
        var self = this;
        var url = this.getServiceUrl('hr_execut/retrieve');
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
    
    onRetrieveHrExecutPage: function(filter, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveHrExecut( filter );
    },
    
    onInitHrExecut: function(filter) {
        if( this.recordSet.length > 0 ){
            if( Utils.compareTo(this.filter, filter) ){
                this.fireEvent('retrieve', '', this);
                return;
            }
        }
        
        // FIXME 翻页
        this.startPage = 1;
        this.pageRow = 10;
        this.onRetrieveHrExecut(filter);
    },
    
    onCreateHrExecut: function(hrExecut) {
        var url = this.getServiceUrl('hr_execut/create');
        Utils.recordCreate(this, hrExecut, url);
    },
    
    onUpdateHrExecut: function(hrExecut) {
        var url = this.getServiceUrl('hr_execut/update');
        Utils.recordUpdate(this, hrExecut, url);
    },
    
    onDeleteHrExecut: function(uuid) {
        var url = this.getServiceUrl('hr_execut/remove');
        Utils.recordDelete(this, uuid, url);
    },

    onGetHrPersonName: function (corpUuid, uuid) {
        var hMap = this.hrMap[corpUuid];
        if (hMap !== undefined && hMap !== null) {
            var hrName = hMap[uuid];
            if (hrName === undefined || hrName === null) {
                hrName = uuid;
            }
            FindNameActions.findName('hr_execut', uuid, hrName);
            return;
        }

        var f = { corpUuid: corpUuid};
        this.onRetrieveHrExecut(f);
    }
});

module.exports = HrExecutStore;