var Reflux = require('reflux');
var FlowRoleStaffActions = require('../action/FlowRoleStaffActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var FlowRoleStaffStore = Reflux.createStore({
    listenables: [FlowRoleStaffActions],

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

        MsgActions.showError('flow-role', operation, errMsg);
    },
    onGetCacheData: function() {
        this.fireEvent('cache', '', this);
    },

    onRetrieveFlowRoleStaff: function(corpUuid) {
        var filter = {};
        filter.corpUuid = corpUuid;
        var self = this;
        var url = this.getServiceUrl('flow-role/retrieve');
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

    onRetrieveFlowRoleStaffPage: function(filter, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveFlowRole( filter );
    },

    onInitFlowRoleStaff: function(filter) {
        console.log('filter',filter)
        if( this.recordSet.length > 0 ){
            if( Utils.compareTo(this.filter, filter) ){
                this.fireEvent('retrieve', '', this);
                return;
            }
        }

        // FIXME 翻页
        this.startPage = 1;
        this.pageRow = 10;
        this.onRetrieveFlowRoleStaff(filter);
    },

    onCreateFlowRoleStaff: function(flowRole) {
        var url = this.getServiceUrl('flow-role/create');
        Utils.recordCreate(this, flowRole, url);
    },

    onUpdateFlowRoleStaff: function(flowRole) {
        var url = this.getServiceUrl('flow-role/update');
        Utils.recordUpdate(this, flowRole, url);

    },
    onUpdateFlowRole2: function(filter) {
        var self = this;
        console.log('filter',filter)
        var url = this.getServiceUrl('flow-role/update');
        Utils.doUpdateService(url, filter).then(function(result) {
            if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
               console.log(result.object.staff);
              self.staff =   result.object.staff;
                self.fireEvent('update', '', self);
            }
            else{
                self.fireEvent('update', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
            }
        }, function(value){
            self.fireEvent('update', "调用服务错误", self);
        });
    },

    onDeleteFlowRoleStaff: function(uuid) {
        console.log('uuid',uuid);
        var url = this.getServiceUrl('flow-role/remove');
        Utils.recordDelete(this, uuid, url);
    }
});

module.exports = FlowRoleStaffStore;