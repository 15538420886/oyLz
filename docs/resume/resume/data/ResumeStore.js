var Reflux = require('reflux');
var ResumeActions = require('../action/ResumeActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var ResumeStore = Reflux.createStore({
	listenables: [ResumeActions],

	resumeID: '',
	userID:'',
	person: '',

	init: function() {
	},

	getServiceUrl: function(action)
	{
		return Utils.resumeUrl+action;
	},

	fireEvent: function(resource, operation, errMsg, self)
	{
		self.trigger({
			resumeID: self.resumeID,
			userID: self.userID,
			person: self.person,
			resource: resource,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError(resource, operation, errMsg);
	},

	// 公共函数
	recordCreate: function(resource, data, url)
	{
		var self = this;
		var obj = {filter: this.resumeID, object: data};
		Utils.doCreateService(url, obj).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				var list = self.person[resource];
				if(list === null || typeof(list) === 'undefined'){
					list = [];
					self.person[resource] = list;
				}

				list.push(result.object);
				self.person[resource+'Pos'] = list.length-1;

				self.fireEvent(resource, 'create', '', self);
			}
			else{
				self.fireEvent(resource, 'create', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent(resource, 'create', "调用服务错误", self);
		});
	},
	recordUpdate: function(resource, data, url)
	{
		var idx = -1;
		var uuid=data.uuid;

		var list = this.person[resource];
		for(var x=list.length-1; x>=0; x--){
			if(list[x].uuid === uuid){
				idx = x;
				break;
			}
		}

		var self = this;
		if(idx < 0){
			self.fireEvent(resource, 'update', '没有找到记录['+uuid+']', self);
			return;
		}

		var obj = {filter: this.resumeID, object: data};
		Utils.doUpdateService(url, obj).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				Utils.copyValue(result.object, list[idx]);
				self.person[resource+'Pos'] = idx;
				self.fireEvent(resource, 'update', '', self);
			}
			else{
				self.fireEvent(resource, 'update', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent(resource, 'update', "调用服务错误", self);
		});
	},
	recordDelete: function(resource, uuid, url) {
		var idx = -1;
		var list = this.person[resource];
		for(var x=list.length-1; x>=0; x--){
			if(list[x].uuid === uuid){
				idx = x;
				break;
			}
		}

		var self = this;
		if(idx < 0){
			self.fireEvent(resource, 'remove', '没有找到记录['+uuid+']', self);
			return;
		}

		var obj = {filter: this.resumeID, object: uuid};
		Utils.doRemoveService(url, obj).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				list.splice(idx, 1);
				if(idx < list.length){
					self.person[resource+'Pos'] = idx;
				}
				else if(list.length > 0){
					self.person[resource+'Pos'] = list.length - 1;
				}
				else{
					self.person[resource+'Pos'] = -1;
				}

				self.fireEvent(resource, 'remove', '', self);
			}
			else{
				self.fireEvent(resource, 'remove', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent(resource, 'remove', "调用服务错误", self);
		});
	},



	// 主记录
	onGetResumeByID: function(id) {
		var self = this;
		if(this.resumeID === id){
			self.fireEvent('person', 'find', '', self);
			return;
		}

		var filter = {};
		filter.id = id;
		var url = this.getServiceUrl('resPerson/find-resume');
		Utils.doGetRecordService(url, filter).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.person = result.object;
				self.resumeID = result.object.id;
				self.fireEvent('person', 'find', '', self);
			}
			else{
				self.fireEvent('person', 'find', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('person', 'find', "调用服务错误", self);
		});
	},
	onGetResumeByIdCode: function(idCode) {
		var self = this;
		if(self.person && this.userID === idCode){
			self.fireEvent('person', 'find', '', self);
			return;
		}
		var filter = {};
		filter.idCode = idCode;
		var url = this.getServiceUrl('resPerson/find-resume2');
		Utils.doGetRecordService(url, filter).then(function(result) {			
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.person = result.object;
				self.resumeID = result.object.id;
				self.userID = idCode;
				self.fireEvent('person', 'find', '', self);
			}
			else{
				if(!result.object){
					self.fireEvent('person', 'noResume', '', self);
				}else{
					self.fireEvent('person', 'find', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
				}
			}
		}, function(value){
			self.fireEvent('person', 'find', "调用服务错误", self);
		});
	},

	//--根据id删除个人所以信息
	recordDeleteById: function(store, uuid, url) {
		var idx = -1;
		for(var x=store.recordSet.length-1; x>=0; x--){
			if(store.recordSet[x].id === uuid){
				idx = x;
				break;
			}
		}

		var self = store;
		if(idx < 0){
			self.fireEvent('person', 'del-resume', '没有找到记录['+uuid+']', self);
			return;
		}

		Utils.doRemoveService(url, uuid).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet.splice(idx, 1);
				self.totalRow = self.totalRow - 1;
				self.fireEvent('del-resume', '', self);
			}
			else{
				self.fireEvent('person', 'del-resume', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('person', 'del-resume', "调用服务错误", self);
		});
	},

	onUpdateResume: function(resume) {
		var self = this;
		var url = this.getServiceUrl('resPerson/update-resume');
		Utils.doUpdateService(url, resume).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				Utils.copyValue(result.object, self.person);
				self.fireEvent('person', 'update', '', self);
			}
			else{
				self.fireEvent('person', 'update', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('person', 'update', "调用服务错误", self);
		});
	},










	// 个人介绍 introList
	onAddIntro( intro ){
		var url = this.getServiceUrl('resPeIntro/create');
		this.recordCreate( 'introList', intro, url );
	},
	onUpdateIntro(intro){
		var url = this.getServiceUrl('resPeIntro/update');
		this.recordUpdate( 'introList', intro, url );
	},
	onDelIntro(introID){
		var url = this.getServiceUrl('resPeIntro/remove');
		this.recordDelete( 'introList', introID, url );
	},

	// 联系方式 contactList
	onAddContact( contact ){
		var url = this.getServiceUrl('resPeContact/create');
		this.recordCreate( 'contactList', contact, url );
	},
	onUpdateContact(contact){
		var url = this.getServiceUrl('resPeContact/update');
		this.recordUpdate( 'contactList', contact, url );
	},
	onDelContact(contactID){
		var url = this.getServiceUrl('resPeContact/remove');
		this.recordDelete( 'contactList', contactID, url );
	},

	// 个人评价 reviewList
	onAddReview( review ){
		var url = this.getServiceUrl('resPeReview/create');
		this.recordCreate( 'reviewList', review, url );
	},
	onUpdateReview(review){
		var url = this.getServiceUrl('resPeReview/update');
		this.recordUpdate( 'reviewList', review, url );
	},
	onDelReview(contactID){
		var url = this.getServiceUrl('resPeReview/remove');
		this.recordDelete( 'reviewList', contactID, url );
	},

	// 身份信息 identityList
	onAddIdentity( identity ){
		var url = this.getServiceUrl('resPeIdentity/create');
		this.recordCreate( 'identityList', identity, url );
	},
	onUpdateIdentity(identity){
		var url = this.getServiceUrl('resPeIdentity/update');
		this.recordUpdate( 'identityList', identity, url );
	},
	onDelIdentity(identityID){
		var url = this.getServiceUrl('resPeIdentity/remove');
		this.recordDelete( 'identityList', identityID, url );
	},

	// 其他信息 otherList
	onAddOther( other ){
		var url = this.getServiceUrl('resPeOther/create');
		this.recordCreate( 'otherList', other, url );
	},
	onUpdateOther(other){
		var url = this.getServiceUrl('resPeOther/update');
		this.recordUpdate( 'otherList', other, url );
	},
	onDelOther(otherID){
		var url = this.getServiceUrl('resPeOther/remove');
		this.recordDelete( 'otherList', otherID, url );
	},

	// 教育背景 eduList
	onAddEdu( edu ){
		var url = this.getServiceUrl('pe-edu/create');
		this.recordCreate( 'eduList', edu, url );
	},
	onUpdateEdu( edu ){
		var url = this.getServiceUrl('pe-edu/update');
		this.recordUpdate( 'eduList', edu, url );
	},
	onDelEdu( eduID ){
		var url = this.getServiceUrl('pe-edu/remove');
		this.recordDelete( 'eduList', eduID, url );
	},

	// 奖学金 honorList
	onAddHonor( honor ){
		var url = this.getServiceUrl('edu-honor/create');
		this.recordCreate( 'honorList', honor, url );
	},
	onUpdateHonor(honor){
		var url = this.getServiceUrl('edu-honor/update');
		this.recordUpdate( 'honorList', honor, url );
	},
	onDelHonor(honorID){
		var url = this.getServiceUrl('edu-honor/remove');
		this.recordDelete( 'honorList', honorID, url );
	},

	// 在校奖励 honor2List
	onAddHonor2( honor2 ){
		var url = this.getServiceUrl('edu-honor2/create');
		this.recordCreate( 'honor2List', honor2, url );
	},
	onUpdateHonor2(honor2){
		var url = this.getServiceUrl('edu-honor2/update');
		this.recordUpdate( 'honor2List', honor2, url );
	},
	onDelHonor2(honor2ID){
		var url = this.getServiceUrl('edu-honor2/remove');
		this.recordDelete( 'honor2List', honor2ID, url );
	},

	// 校内实践 pracList
	onAddPrac( prac ){
		var url = this.getServiceUrl('edu-prac/create');
		this.recordCreate( 'pracList', prac, url );
	},
	onUpdatePrac(prac){
		var url = this.getServiceUrl('edu-prac/update');
		this.recordUpdate( 'pracList', prac, url );
	},
	onDelPrac(pracID){
		var url = this.getServiceUrl('edu-prac/remove');
		this.recordDelete( 'pracList', pracID, url );
	},

	// 校内实践 pracList
	onAddPeComp( peComp ){
		var url = this.getServiceUrl('peComp/create');
		this.recordCreate( 'peCompList', peComp, url );
	},
	onUpdatePeComp(peComp){
		var url = this.getServiceUrl('peComp/update');
		this.recordUpdate( 'peCompList', peComp, url );
	},
	onDelPeComp(peCompID){
		var url = this.getServiceUrl('peComp/remove');
		this.recordDelete( 'peCompList', peCompID, url );
	},

	// 校内实践 addPeProjList
	onAddPeProj( peProj ){
		var url = this.getServiceUrl('peProj/create');
		this.recordCreate( 'peProjList', peProj, url );
	},
	onUpdatePeProj(peProj){
		var url = this.getServiceUrl('peProj/update');
		this.recordUpdate( 'peProjList', peProj, url );
	},
	onDelPeProj(peProjID){
		var url = this.getServiceUrl('peProj/remove');
		this.recordDelete( 'peProjList', peProjID, url );
	},

	// 奖励记录 workHonor
	onAddWorkHonor( workHonor ){
		var url = this.getServiceUrl('work-honor/create');
		this.recordCreate( 'workHonorList', workHonor, url );
	},
	onUpdateWorkHonor(workHonor){
		var url = this.getServiceUrl('work-honor/update');
		this.recordUpdate( 'workHonorList', workHonor, url );
	},
	onDelWorkHonor(workHonorID){
		var url = this.getServiceUrl('work-honor/remove');
		this.recordDelete( 'workHonorList', workHonorID, url );
	},

	// 培训经历 resPeTrain
	onAddTrain( train ){
		var url = this.getServiceUrl('resPeTrain/create');
		this.recordCreate( 'trainList', train, url );
	},
	onUpdateTrain(train){
		var url = this.getServiceUrl('resPeTrain/update');
		this.recordUpdate( 'trainList', train, url );
	},
	onDelTrain(trainID){
		var url = this.getServiceUrl('resPeTrain/remove');
		this.recordDelete( 'trainList', trainID, url );
	},

	// 证书 resPeTrain
	onAddCert( cert ){
		var url = this.getServiceUrl('resPeCert/create');
		this.recordCreate( 'certList', cert, url );
	},
	onUpdateCert(cert){
		var url = this.getServiceUrl('resPeCert/update');
		this.recordUpdate( 'certList', cert, url );
	},
	onDelCert(certID){
		var url = this.getServiceUrl('resPeCert/remove');
		this.recordDelete( 'certList', certID, url );
	},

	// 开发技能 resTechSkill
	onAddTechSkill( skill ){
		var url = this.getServiceUrl('resTechSkill/create');
		this.recordCreate( 'techSkillList', skill, url );
	},
	onUpdateTechSkill(skill){
		var url = this.getServiceUrl('resTechSkill/update');
		this.recordUpdate( 'techSkillList', skill, url );
	},
	onDelTechSkill(skillID){
		var url = this.getServiceUrl('resTechSkill/remove');
		this.recordDelete( 'techSkillList', skillID, url );
	},

	// 项目技能 resProjSkill
	onAddProjSkill( skill ){
		var url = this.getServiceUrl('resProjSkill/create');
		this.recordCreate( 'projSkillList', skill, url );
	},
	onUpdateProjSkill(skill){
		var url = this.getServiceUrl('resProjSkill/update');
		this.recordUpdate( 'projSkillList', skill, url );
	},
	onDelProjSkill(skillID){
		var url = this.getServiceUrl('resProjSkill/remove');
		this.recordDelete( 'projSkillList', skillID, url );
	},

	// 业务技能 resBiziSkill
	onAddBiziSkill( skill ){
		var url = this.getServiceUrl('resBiziSkill/create');
		this.recordCreate( 'biziSkillList', skill, url );
	},
	onUpdateBiziSkill(skill){
		var url = this.getServiceUrl('resBiziSkill/update');
		this.recordUpdate( 'biziSkillList', skill, url );
	},
	onDelBiziSkill(skillID){
		var url = this.getServiceUrl('resBiziSkill/remove');
		this.recordDelete( 'biziSkillList', skillID, url );
	},

	// 语言能力 resPeLang
	onAddLang( lang ){
		var url = this.getServiceUrl('resPeLang/create');
		this.recordCreate( 'langList', lang, url );
	},
	onUpdateLang(lang){
		var url = this.getServiceUrl('resPeLang/update');
		this.recordUpdate( 'langList', lang, url );
	},
	onDelLang(langID){
		var url = this.getServiceUrl('resPeLang/remove');
		this.recordDelete( 'langList', langID, url );
	},

	// 其他技能 resOtherSkill
	onAddOtherSkill( skill ){
		var url = this.getServiceUrl('resOtherSkill/create');
		this.recordCreate( 'otherSkillList', skill, url );
	},
	onUpdateOtherSkill(skill){
		var url = this.getServiceUrl('resOtherSkill/update');
		this.recordUpdate( 'otherSkillList', skill, url );
	},
	onDelOtherSkill(skillID){
		var url = this.getServiceUrl('resOtherSkill/remove');
		this.recordDelete( 'otherSkillList', skillID, url );
	},

	// 开源作品 ws-proj
	onAddWsProj( skill ){
		var url = this.getServiceUrl('ws-proj/create');
		this.recordCreate( 'wsProjList', skill, url );
	},
	onUpdateWsProj(skill){
		var url = this.getServiceUrl('ws-proj/update');
		this.recordUpdate( 'wsProjList', skill, url );
	},
	onDelWsProj(skillID){
		var url = this.getServiceUrl('ws-proj/remove');
		this.recordDelete( 'wsProjList', skillID, url );
	},

	// 公开论文 resWsThesis
	onAddWsThesis( skill ){
		var url = this.getServiceUrl('resWsThesis/create');
		this.recordCreate( 'wsThesisList', skill, url );
	},
	onUpdateWsThesis(skill){
		var url = this.getServiceUrl('resWsThesis/update');
		this.recordUpdate( 'wsThesisList', skill, url );
	},
	onDelWsThesis(skillID){
		var url = this.getServiceUrl('resWsThesis/remove');
		this.recordDelete( 'wsThesisList', skillID, url );
	},

	// 网上作品 ws-issue
	onAddWsIssue( issue ){
		var url = this.getServiceUrl('ws-issue/create');
		this.recordCreate( 'wsIssueList', issue, url );
	},
	onUpdateWsIssue(issue){
		var url = this.getServiceUrl('ws-issue/update');
		this.recordUpdate( 'wsIssueList', issue, url );
	},
	onDelWsIssue(issueID){
		var url = this.getServiceUrl('ws-issue/remove');
		this.recordDelete( 'wsIssueList', issueID, url );
	},

	// 家庭关系 resPeFamily
	onAddFamily( family ){
		var url = this.getServiceUrl('resPeFamily/create');
		this.recordCreate( 'familyList', family, url );
	},
	onUpdateFamily(family){
		var url = this.getServiceUrl('resPeFamily/update');
		this.recordUpdate( 'familyList', family, url );
	},
	onDelFamily(familyID){
		var url = this.getServiceUrl('resPeFamily/remove');
		this.recordDelete( 'familyList', familyID, url );
	},

	// 社会关系 resPeSocial
	onAddSocial( social ){
		var url = this.getServiceUrl('resPeSocial/create');
		this.recordCreate( 'socialList', social, url );
	},
	onUpdateSocial(social){
		var url = this.getServiceUrl('resPeSocial/update');
		this.recordUpdate( 'socialList', social, url );
	},
	onDelSocial(socialID){
		var url = this.getServiceUrl('resPeSocial/remove');
		this.recordDelete( 'socialList', socialID, url );
	},

	// 公益活动 resPeBenefit
	onAddBenefit( benefit ){
		var url = this.getServiceUrl('resPeBenefit/create');
		this.recordCreate( 'benefitList', benefit, url );
	},
	onUpdateBenefit(benefit){
		var url = this.getServiceUrl('resPeBenefit/update');
		this.recordUpdate( 'benefitList', benefit, url );
	},
	onDelBenefit(benefitID){
		var url = this.getServiceUrl('resPeBenefit/remove');
		this.recordDelete( 'benefitList', benefitID, url );
	},

	// 社会荣誉 resSoHonor
	onAddSoHonor( soHonor ){
		var url = this.getServiceUrl('resSoHonor/create');
		this.recordCreate( 'soHonorList', soHonor, url );
	},
	onUpdateSoHonor(soHonor){
		var url = this.getServiceUrl('resSoHonor/update');
		this.recordUpdate( 'soHonorList', soHonor, url );
	},
	onDelSoHonor(soHonorID){
		var url = this.getServiceUrl('resSoHonor/remove');
		this.recordDelete( 'soHonorList', soHonorID, url );
	},

	// 紧急联系人 resPeEmerg
	onAddEmerg( emerg ){
		var url = this.getServiceUrl('resPeEmerg/create');
		this.recordCreate( 'emergList', emerg, url );
	},
	onUpdateEmerg(emerg){
		var url = this.getServiceUrl('resPeEmerg/update');
		this.recordUpdate( 'emergList', emerg, url );
	},
	onDelEmerg(emergID){
		var url = this.getServiceUrl('resPeEmerg/remove');
		this.recordDelete( 'emergList', emergID, url );
	},
});

module.exports = ResumeStore;
