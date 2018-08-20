﻿var Reflux = require('reflux');
var TmBugActions = require('../action/TmBugActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var TmBugStore = Reflux.createStore({
    listenables: [TmBugActions],
    
    InTmBug: '',
    recordSet: [],
    startPage : 0,
    pageRow : 0,
    totalRow : 0,
    
    init: function() {
    },
    getServiceUrl: function(action)
    {
        return Utils.tbugUrl+action;
    },
    
    fireEvent: function(operation, errMsg, self)
    {
        self.trigger({
            InTmBug: self.InTmBug,
            recordSet: self.recordSet,
            startPage: self.startPage,
            pageRow: self.pageRow,
            totalRow: self.totalRow,
            operation: operation,
            errMsg: errMsg
        });
        MsgActions.showError('tm-bug', operation, errMsg);
    },
    
    onRetrieveTmBug: function(InTmBug) {
        var self = this;
        var filter = {};
        filter.InTmBug = InTmBug;
        filter.cmpId = window.loginData.compUser.corpUuid;
        filter.procStatus = InTmBug.procStatus;
        var url = this.getServiceUrl('tm-bug/get-bugs');
        Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
            if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.recordSet = result.object.list;
                self.startPage = result.object.startPage;
                self.pageRow = result.object.pageRow;
                self.totalRow = result.object.totalRow;
                self.InTmBug = InTmBug;
                self.fireEvent('retrieve', '', self);
            }
            else{
                self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
            }
        }, function(value){
            self.fireEvent('retrieve', "调用服务错误", self);
        });
    },

    onMoreTmBug: function (InTmBug,procStatus) {
        var self = this;
        var filter = {};
        filter = InTmBug;
        filter.procStatus = procStatus;
        filter.cmpId = window.loginData.compUser.corpUuid;
        var url = this.getServiceUrl('tm-bug/get-more-bugs');
        Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.recordSet = result.object.list;
                self.startPage = result.object.startPage;
                self.pageRow = result.object.pageRow;
                self.totalRow = result.object.totalRow;
                self.InTmBug = InTmBug;
                self.fireEvent('retrieve', '', self);
            }
            else {
                self.fireEvent('retrieve', "处理错误[" + result.errCode + "][" + result.errDesc + "]", self);
            }
        }, function (value) {
            self.fireEvent('retrieve', "调用服务错误", self);
        });
    },

    onRetrieveTmBugPage: function(InTmBug, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveTmBug( InTmBug );
    },
    
    onInitTmBug: function(InTmBug) {
        if( this.recordSet.length > 0 ){
            if( this.InTmBug === InTmBug ){
                this.fireEvent('retrieve', '', this);
                return;
            }
        }
        
        // FIXME 翻页
        // this.startPage = 1;
        // this.pageRow = 10;
        this.onRetrieveTmBug(InTmBug);
    },
    
    onCreateTmBug: function(tmBug) {
        var url = this.getServiceUrl('tm-bug/create');
        Utils.recordCreate(this, tmBug, url);
    },
    
    onUpdateTmBug: function(tmBug) {
        var url = this.getServiceUrl('tm-bug/update');
        Utils.recordUpdate(this, tmBug, url);
    },
    
    onDeleteTmBug: function(uuid) {
        var url = this.getServiceUrl('tm-bug/remove');
        Utils.recordDelete(this, uuid, url);
    },
});

module.exports = TmBugStore;