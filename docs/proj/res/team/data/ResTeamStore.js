var Reflux = require('reflux');
var ResTeamActions = require('../action/ResTeamActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');
var FindNameActions = require('../../../../lib/action/FindNameActions');

var ResTeamStore = Reflux.createStore({
	listenables: [ResTeamActions],
	
	poolUuid: '',
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,

    // uuid <--> name
    teamMap: {},

	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.projUrl+action;
	},
	
	fireEvent: function(operation, errMsg, self)
    {
        // 生成名称对照表
        if (self.poolUuid !== undefined && self.poolUuid !== null && self.poolUuid !== '') {
            var tMap = {};
            self.recordSet.map((node, i) => {
                tMap[node.uuid] = node.teamName;
            });

            self.teamMap[self.poolUuid] = tMap;
        }

		self.trigger({
			poolUuid: self.poolUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('res-team', operation, errMsg);
	},
	
	onRetrieveResTeam: function(poolUuid) {
		var self = this;
		var filter = {};
		filter.poolUuid = poolUuid;
		var url = this.getServiceUrl('res-team/get-by-pool_uuid');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.poolUuid = poolUuid;
				
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onRetrieveResTeamPage: function(poolUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveResTeam( poolUuid );
	},
	
	onInitResTeam: function(poolUuid) {
		if( this.recordSet.length > 0 ){
			if( this.poolUuid === poolUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveResTeam(poolUuid);
	},
	
	onCreateResTeam: function(resTeam) {
		var url = this.getServiceUrl('res-team/create');
		Utils.recordCreate(this, resTeam, url);
	},
	
	onUpdateResTeam: function(resTeam) {
		var url = this.getServiceUrl('res-team/update');
		Utils.recordUpdate(this, resTeam, url);
	},
	
	onDeleteResTeam: function(uuid) {
		var url = this.getServiceUrl('res-team/remove');
		Utils.recordDelete(this, uuid, url);
    },
    onGetTeamName: function (poolUuid, uuid) {
        var tMap = this.teamMap[poolUuid];
        if (tMap !== undefined && tMap !== null) {
            var teamName = tMap[uuid];
            if (teamName === undefined || teamName === null) {
                teamName = uuid;
            }

            FindNameActions.findName('res_team', uuid, teamName);
            return;
        }
        
        this.onRetrieveResTeam(poolUuid);
    }
});

module.exports = ResTeamStore;

