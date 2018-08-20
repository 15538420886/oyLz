var Reflux = require('reflux');
var ProjTeamActions = require('../action/ProjTeamActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');
var ProjContext = require('../../../ProjContext');
var FindNameActions = require('../../../../lib/action/FindNameActions');

var ProjTeamStore = Reflux.createStore({
	listenables: [ProjTeamActions],
	
	filter: {},
	recordSet: [],
	startPage : 0,
	pageRow : 0,
    totalRow: 0,

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
        if (self.filter.projUuid !== undefined && self.filter.projUuid !== null) {
            var tMap = {};
            self.recordSet.map((node, i) => {
                tMap[node.uuid] = node.teamName;
            });

            self.teamMap[self.filter.projUuid] = tMap;
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

		MsgActions.showError('proj_team', operation, errMsg);
	},

    onGetCacheData: function (projUuid) {
        if (this.filter.projUuid !== projUuid) {
            this.filter = {};
            this.recordSet = [];
            this.startPage = 0;
            this.pageRow = 0;
            this.totalRow = 0;
        }

		this.fireEvent('cache', '', this);
	},
	
	onRetrieveProjTeam: function(filter) {
		var self = this;
        var url = this.getServiceUrl('proj_team/get-by-ProjUuid');
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
	
	onRetrieveProjTeamPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveProjTeam( filter );
	},
	
	onInitProjTeam: function(filter) {
		if( this.recordSet.length > 0 ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveProjTeam(filter);
	},
	
	onCreateProjTeam: function(projTeam) {
		var url = this.getServiceUrl('proj_team/create');
		Utils.recordCreate(this, projTeam, url);
	},
	
	onUpdateProjTeam: function(projTeam) {
		var url = this.getServiceUrl('proj_team/update');
		Utils.recordUpdate(this, projTeam, url);
	},
	
	onDeleteProjTeam: function(uuid) {
		var url = this.getServiceUrl('proj_team/remove');
		Utils.recordDelete(this, uuid, url);
    },
    onGetTeamName: function (projUuid, uuid) {
        var tMap = this.teamMap[projUuid];
        if (tMap !== undefined && tMap !== null) {
            var teamName = tMap[uuid];
            if (teamName === undefined || teamName === null) {
                teamName = uuid;
            }

            FindNameActions.findName('proj_team', uuid, teamName);
            return;
        }

        var f = { projUuid: projUuid};
        this.onRetrieveProjTeam(f);
    }
});

module.exports = ProjTeamStore;

