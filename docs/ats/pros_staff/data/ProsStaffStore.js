var Reflux = require('reflux');
var ProsStaffActions = require('../action/ProsStaffActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var ProsStaffStore = Reflux.createStore({
    listenables: [ProsStaffActions],

    filter: {},
    recordSet: [],
    mailBody:'',
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
            mailBody: self.mailBody,
            startPage: self.startPage,
            pageRow: self.pageRow,
            totalRow: self.totalRow,
            operation: operation,
            errMsg: errMsg
        });
        MsgActions.showError('pros-staff', operation, errMsg);
    },
    onGetCacheData: function() {
        this.fireEvent('cache', '', this);
    },
    //获取邮件内容
    onGenerateEmailBody: function(filter) {
        var self = this;
        var url = this.getServiceUrl('pros-staff/mail-body');
        Utils.doRetrieveService(url, filter).then(function(result) {
            if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.mailBody = result.object;
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
    //发送邮件
    onSendEmail: function(filter) {
        var self = this;
        var url = this.getServiceUrl('pros-staff/send-mail');
        Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
            if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.filter = filter;
                self.fireEvent('create', '', self);
            }
            else{
                self.fireEvent('create', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
            }
        }, function(value){
            self.fireEvent('create', "调用服务错误", self);
        });
    },
    //查询待入职人员信息
    onRetrieveProsStaff: function(corpUuid) {
        var self = this;
        var url = this.getServiceUrl('pros-staff/retrieve');
        var filter = {};
        filter.corpUuid = corpUuid;
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

    onRetrieveProsStaffPage: function(filter, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveProsStaff( filter );
    },

    onInitProsStaff: function(filter) {
        if( this.recordSet.length > 0 ){
            if( Utils.compareTo(this.filter, filter) ){
                this.fireEvent('retrieve', '', this);
                return;
            }
        }

        // FIXME 翻页
        this.startPage = 1;
        this.pageRow = 10;
        this.onRetrieveProsStaff(filter);
    },

    onCreateProsStaff: function(prosStaff) {
        var url = this.getServiceUrl('pros-staff/create');
        Utils.recordCreate(this, prosStaff, url);
    },

    onUpdateProsStaff: function(prosStaff) {
        var url = this.getServiceUrl('pros-staff/update');
        Utils.recordUpdate(this, prosStaff, url);
    },

    onDeleteProsStaff: function(uuid) {
        var url = this.getServiceUrl('pros-staff/remove');
        Utils.recordDelete(this, uuid, url);
    }
});

module.exports = ProsStaffStore;
