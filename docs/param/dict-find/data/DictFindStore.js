var Reflux = require('reflux');
var DictFindActions = require('../action/DictFindActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var DictFindStore = Reflux.createStore({
	listenables: [DictFindActions],

	codeName: '',
	recordSet: [],

	init: function() {
	},

	getServiceUrl: function(action)
	{
		return Utils.paramUrl+action;
	},

	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			codeName: self.codeName,
			recordSet: self.recordSet,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('SysCodeData', operation, errMsg);
	},

	onRetrieveSysCodeData: function(codeName) {
		var self = this;

		if(codeName === null || codeName === ''){
			self.codeName = '';
			self.recordSet = [];
			self.fireEvent('retrieve', '', self);
			return;
		}

		var filter = {};
		filter.codeName = codeName; 
		var url = this.getServiceUrl('SysCodeData/findCodeIndex');
        Utils.doGetRecordService(url, filter).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object;
				self.codeName = codeName;

				self.fireEvent('findCodeIndex', '', self);
			}
			else{
				self.fireEvent('findCodeIndex', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('findCodeIndex', "调用服务错误", self);
		});
	},

	onInitSysCodeData: function(codeName) {
		if( this.recordSet.length > 0 ){
			if( this.codeName === codeName ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveSysCodeData(codeName);
	},
});

module.exports = DictFindStore;
