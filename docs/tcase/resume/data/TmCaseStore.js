var Reflux = require('reflux');
var TmCaseActions = require('../action/TmCaseActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var TmCaseStore = Reflux.createStore({
    listenables: [TmCaseActions],
    
    uuid: '',
    casecode:'',
    recordSet: [],
    startPage : 0,
    pageRow : 10,
    totalRow : 0,
    tmBugList:[],
    init: function() {
    },
    getServiceUrl: function(action)
    {
        return Utils.tcaseUrl+action;
    },
    
    fireEvent: function(operation, errMsg, self)
    {
        self.trigger({
            uuid: self.uuid,
            recordSet: self.recordSet,
            tmBugList:self.tmBugList,
            startPage: self.startPage,
            pageRow: self.pageRow,
            totalRow: self.totalRow,
            operation: operation,
            errMsg: errMsg
        });

        MsgActions.showError('tm-case', operation, errMsg);
    },
    
    onRetrieveRecruit: function(filter) {
        var self = this;
        var url = this.getServiceUrl('recruit/retrieve');       
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
    
    
    onRetrieveTmCase: function(uuid) {
        var self = this;
        var filter = {};
		filter.uuid = uuid;
        var url = this.getServiceUrl('tm-case/caselist');
        Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
            if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.recordSet = result.object.list[0].tmcaseList;
                self.startPage = result.object.startPage;
                self.pageRow = result.object.pageRow;
                self.totalRow = result.object.totalRow;
                self.uuid= result.object.list[0].pid;
                self.fireEvent('retrieve', '', self);
            }
            else{
            	
                self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
            }
        }, function(value){
            self.fireEvent('retrieve', "调用服务错误", self);
        });
    },
    onBugList:function(uuid,casecode){   	
    	var self = this;
        var filter = {};
		filter.uuid = uuid;
		filter.casecode=casecode;		
        var url = this.getServiceUrl('tm-case/get-by-bugcode');
        Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
        	 if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.tmBugList = result.object;
                self.fireEvent('retrieve', '', self);
            }
            else{
            	
                self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
            }
        }, function(value){
            self.fireEvent('retrieve', "调用服务错误", self);
        });
//      this.onRetrieveTmCase( thisuuid );
        
    },
    onDeleteMore:function(uuid,pid){   		
    	var self = this;
        var url = this.getServiceUrl('tm-case/removeMore');   
        Utils.doRetrieveService(url, uuid, self.startPage, self.pageRow, self.totalRow).then(function(result) {
        	 console.log(result)
        	 if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.totalRow = result.object.totalRow;
                self.fireEvent('retrieve', '', self);
                self.onRetrieveTmCase(pid);
            }
            else{
            	
                self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
            }
        }, function(value){
            self.fireEvent('retrieve', "调用服务错误", self);
        });    
    },
     onSearch: function(filter,uuid) {
        var self = this;
        filter.uuid = uuid
        var url = this.getServiceUrl('tm-case/caselist');
        Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
            if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.recordSet = result.object.list[0].tmcaseList;
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
    
    onRetrieveTmCasePage: function(uuid, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveTmCase( uuid );
    },
    
    onInitTmCase: function(uuid) {
        if( this.recordSet.length > 0 ){
            if( this.uuid === uuid ){
                this.fireEvent('retrieve', '', this);
                return;
            }
        }
        
        // FIXME 翻页
        // this.startPage = 1;
        // this.pageRow = 10;
        this.onRetrieveTmCase(uuid);
    },
    
    onCreateTmCase: function(res) {
        var self = this;
		var url = this.getServiceUrl('tm-case/add');
 		var obj = {pid: self.uuid, tmcase: res};
		Utils.doCreateService(url, obj).then(function (result) {
		    self.onRetrieveTmCase(result.object.pid); 
        }, function (value) {
            self.fireEvent('createResource', '调用服务错误' , self);
		});
    },
    
    onUpdateTmCase: function(tmCase,uuid, startPage, pageRow) {
//  	console.log(tmCase)
//      var url = this.getServiceUrl('tm-case/update');
//      Utils.recordUpdate(this, tmCase, url);
       
        var self = this;
        var url = this.getServiceUrl('tm-case/update');
        var obj = tmCase;
        Utils.doCreateService(url, obj).then(function (result) {
        	  self.onRetrieveTmCasePage(uuid, startPage, pageRow);
        }, function (value) {
            self.fireEvent('createResource', '调用服务错误' , self);
		});        
    },    
    onDeleteTmCase: function(uuid) {    	
        var url = this.getServiceUrl('tm-case/remove');
        Utils.recordDelete(this, uuid, url);
    }
});

module.exports = TmCaseStore;