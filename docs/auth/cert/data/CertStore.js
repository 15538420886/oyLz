var Reflux = require('reflux');
var CertActions = require('../action/CertActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var CertStore = Reflux.createStore({
  listenables: [CertActions],

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

    MsgActions.showError('corp-key', operation, errMsg);
  },

  onCreateCorpKey: function(cert) {
    var url = this.getServiceUrl('corp-key/create');
    Utils.recordCreate(this, cert, url);
  },

  onUpdateCorpKey: function(cert) {
    var url = this.getServiceUrl('corp-key/update');
    Utils.recordUpdate(this, cert, url);
  },

  onDeleteCorpKey: function(uuid) {
    var url = this.getServiceUrl('corp-key/remove');
    Utils.recordDelete(this, uuid, url);
  }
});

module.exports = CertStore;
