var Reflux = require('reflux');
var ParamFormActions = require('../action/ParamFormActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');


var ParamFormStore = Reflux.createStore({
	listenables: [ParamFormActions],

	groupUuid: "",
	envUuid: '',
	paramDefList: [],
	paramValueMap: {},

	recordSet: [],
	paramValueList: [],

	init: function() {
	},

	getServiceUrl: function(action)
	{
		return Utils.paramUrl+action;
	},

	fireEvent: function(operation, errMsg, self)
	{
		self.paramValueList = [];
		if(errMsg === ''){
			// 生成结果数据
			var valueMap = {};
			self.recordSet.map((para, i)=>{
				valueMap[para.paraUuid] = para;
			});

			self.paramDefList.map((def, i)=>{
				var def2 = {};
				def2.paraUuid = def.uuid;
				def2.paraName = def.paraName;
				def2.paraDesc = def.paraDesc;
				def2.valueSet = def.valueSet;
				def2.paraStatus = def.paraStatus;
				self.paramValueList.push( def2 );

				var para = valueMap[def.uuid];
				if(para === null || typeof(para) === 'undefined'){
					def2.para = null;
					def2.paraValue = '';
				}
				else{
					def2.para = para;
					def2.paraValue = para.paraValue;
				}
			});
		}

		// console.log(self.recordSet);
		//console.log(self.paramDefList);
		//console.log(self.paramValueList);

		Utils.actionFlowNo ++;
		self.trigger({
			paramDefList: self.paramDefList,
			paramValueList: self.paramValueList,
			recordSet: self.recordSet,

			actionID: Utils.actionFlowNo,
			groupUuid: self.groupUuid,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('para_value', operation, errMsg);
	},

	onRetrieveParam: function(groupUuid, envUuid, opType) {
		if(this.envUuid !== envUuid){
			this.envUuid = '';
			this.paramValueMap = {};
		}

		if(this.groupUuid !== groupUuid){
			this.groupUuid = '';
			this.paramDefList = [];
		}

		var self = this;
		// console.log('groupUuid=' + this.groupUuid + ':' + groupUuid);
		this.recordSet = [];
		if( groupUuid === null || groupUuid === '' || envUuid === null || envUuid === '' ){
			self.fireEvent(opType, '', self);
		}

		if( this.groupUuid === '' ){
			var filter = {};
			filter.groupUuid = groupUuid;
			var paramUrl = this.getServiceUrl('para_def/get-by-groupUuid');
			Utils.doRetrieveService(paramUrl, filter, 0, 0, 0).then(function(result) {
				if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
					self.paramDefList = result.object.list;
					self.groupUuid = groupUuid;

					// 加载参数
					self.retrieveParamValue(groupUuid, envUuid, self, opType);
				}
				else{
					self.fireEvent(opType, "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
				}
			}, function(value){
				self.fireEvent(opType, "调用服务错误", self);
			});
		}
		else{
			// 加载参数
			self.retrieveParamValue(groupUuid, envUuid, self, opType);
		}
	},
	retrieveParamValue: function(groupUuid, envUuid, self, opType) {
		if( self.envUuid !== '' ){
			self.recordSet = this.paramValueMap[groupUuid];
			if( self.recordSet !== null && typeof(self.recordSet) !== 'undefined' ){
				self.fireEvent(opType, '', self);
				return;
			}
		}

		var filter = {};
		filter.envUuid = envUuid;
		filter.groupUuid = groupUuid;
		self.recordSet = [];
		var evnValueUrl = self.getServiceUrl('para_value/get-by-groupUuid');
		Utils.doRetrieveService(evnValueUrl, filter, 0, 0, 0).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.envUuid = envUuid;
				self.paramValueMap[groupUuid] = self.recordSet;

				self.fireEvent(opType, '', self);
			}
			else{
				self.fireEvent(opType, "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent(opType, "调用服务错误", self);
		});
	},

	onCreateParamForm: function(para) {
		var self = this;
		var url = this.getServiceUrl('para_value/insert');
		Utils.doCreateService(url, para).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.syncParamValue( para, self );
				self.fireEvent('create', '', self);
			}
			else{
				self.fireEvent('create', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('create', "调用服务错误", self);
		});
	},

	onUpdateParamForm: function( para, srcPara ) {
		var self = this;
		var url = this.getServiceUrl('para_value/update');
		Utils.doUpdateService(url, para).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				srcPara.paraValue = para.paraValue;
				// console.log('srcPara.paraValue=', srcPara);
				self.fireEvent('update', '', self);
			}
			else{
				self.fireEvent('update', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('update', "调用服务错误", self);
		});
	},

	onCopyList: function(copyList) {
		 var self = this;
		 var url = this.getServiceUrl('para_value/para-copy');
		 Utils.doGetRecordService(url, copyList).then(function(result) {
		 	if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				result.object.list.map((copy, i)=>{
					self.syncParamValue( copy, self );
				});

		 		self.fireEvent('copy', '', self);
			}
			else{

				self.fireEvent('copy', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
		 	}
		 }, function(value){

			self.fireEvent('copy', "调用服务错误", self);
		 });
	},

	syncParamValue: function(para, self){
		// console.log('syncParamValue', self.envUuid, para);
		if(para.envUuid !== self.envUuid){
			return;
		}

		var paraSet = self.paramValueMap[para.groupUuid];
		if( paraSet === null || typeof(paraSet) === 'undefined' ){
			return;
		}

		var len = paraSet.length;
		for( var i=0; i<len; i++ ){
			if( paraSet[i].uuid = para.uuid ){
				Utils.copyValue( para, paraSet[i] );
				return;
			}
		}

		paraSet.push( para );
	}
});

module.exports = ParamFormStore;
