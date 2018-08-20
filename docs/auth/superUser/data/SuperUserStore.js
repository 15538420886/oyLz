var Reflux = require('reflux');
var SuperUserActions = require('../action/SuperUserActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var SuperUserStore = Reflux.createStore({
  listenables: [SuperUserActions],

  corpUuid: '',
  recordSet: [],
  startPage : 0,
  pageRow : 0,
  totalRow : 0,

  init: function() {
  },
  getServiceUrl: function(action)
  {
    return Utils.paramUrl+action;
  },

  fireEvent: function(operation, errMsg, self)
  {
    self.trigger({
      corpUuid: self.corpUuid,
      recordSet: self.recordSet,
      startPage: self.startPage,
      pageRow: self.pageRow,
      totalRow: self.totalRow,
      operation: operation,
      errMsg: errMsg
    });

    MsgActions.showError('super-user', operation, errMsg);
  },

  onRetrieveSuperUser: function(corpUuid) {
    var self = this;
    var filter = {};
    filter.corpUuid = corpUuid;
    var url = this.getServiceUrl('super-user/get-by-corp_uuid');
    Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
    	if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
        self.recordSet = result.object.list;
        self.startPage = result.object.startPage;
        self.pageRow = result.object.pageRow;
        self.totalRow = result.object.totalRow;
        self.corpUuid = corpUuid;

        self.fireEvent('retrieve', '', self);
      }
      else{
        self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
      }
    }, function(value){
      self.fireEvent('retrieve', "调用服务错误", self);
    });
  },

  onRetrieveSuperUserPage: function(corpUuid, startPage, pageRow) {
    this.startPage = startPage;
    this.pageRow = pageRow;
    this.onRetrieveSuperUser( corpUuid );
  },

  onInitSuperUser: function(corpUuid) {
    if( this.recordSet.length > 0 ){
      if( this.corpUuid === corpUuid ){
        this.fireEvent('retrieve', '', this);
        return;
      }
    }

    this.onRetrieveSuperUser(corpUuid);
  },

  onCreateSuperUser: function(superUser) {
    var url = this.getServiceUrl('super-user/create');
    Utils.recordCreate(this, superUser, url);
  },

  onUpdateSuperUser: function(superUser) {
    var url = this.getServiceUrl('super-user/update');
    Utils.recordUpdate(this, superUser, url);
  },

  onDeleteSuperUser: function(uuid) {
    var url = this.getServiceUrl('super-user/remove');
    Utils.recordDelete(this, uuid, url);
  }
});

module.exports = SuperUserStore;

