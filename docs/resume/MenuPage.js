"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { browserHistory } from 'react-router'
var Utils = require('../public/script/utils');
var LeftList2 = require('../lib/Components/LeftList2');
import Context from './resumeContext';
var ResumeStore = require('./resume/data/ResumeStore');
var ResumeActions = require('./resume/action/ResumeActions');

var MenuPage = React.createClass({
	getInitialState : function() {
		return {
			navItems: [
			{
				name: '简历预览',
				to: '/resume2/PreviewPage/'
			},
			{
				name: '基本信息',
				icon: 'home',
				to:'det',
				childItems: [
					{
						name: '个人信息',
						to: '/resume2/ResumePage/'
					},
					{
						id: 'introList',
						name: '个人介绍',
						to: '/resume2/perIntro/'
					},
					{
						id: 'reviewList',
						name: '个人评价',
						to: '/resume2/perAss/'
					},
					{
						id: 'contactList',
						name: '地址维护',
						to: '/resume2/contactInfor/'
					},
					{
						id: 'identityList',
						name: '身份信息',
						to: '/resume2/identityInfor/'
					},
					{
						id: 'otherList',
						name: '其他信息',
						to: '/resume2/otherInfor/'
					}
				]
			},
			{
				name: '教育背景',
				icon: 'home',
				to:'edu', 
				childItems: [
					{
						id: 'eduList',
						name: '教育背景',
						to: '/resume2/education/'
					},
					{
						id: 'honorList',
						name: '奖学金',
						to: '/resume2/eduHonor/'
					},
					{
						id: 'honor2List',
						name: '在校奖励',
						to: '/resume2/schHonor/'
					},
					{
						id: 'pracList',
						name: '学校实践',
						to: '/resume2/schPrac/'
					}
				]
			},
			{
				name: '工作经验',
				icon: 'home',
				to: 'work',
				childItems: [
					{
						id: 'peCompList',
						name: '工作经历',
						to: '/resume2/peComp/'
					},
					{
						id: 'peProjList',
						name: '项目经历',
						to: '/resume2/peProj/'
					},
					{
						id: 'workHonorList',
						name: '奖励记录',
						to: '/resume2/workHonor/'
					}
				]
			},
			
			{
				name: '技能/证书',
				icon: 'home',
				to: 'book',  
				childItems: [
					{
						id: 'trainList',
						name: '培训经历',
						to: '/resume2/train/'
					},
					{
						id: 'certList',
						name: '证书',
						to: '/resume2/cert/'
					},
					{
						id: 'techSkillList',
						name: '开发技能',
						to: '/resume2/techSkill/'
					},
					{
						id: 'biziSkillList',
						name: '业务技能',
						to: '/resume2/biziSkill/'
					},
					{
						id: 'projSkillList',
						name: '项目技能',
						to: '/resume2/projSkill/'
					},
					{
						id: 'langList',
						name: '语言能力',
						to: '/resume2/lang/'
					},
					{
						id: 'otherSkillList',
						name: '其他技能',
						to: '/resume2/otherSkill/'
					}

				]
			},
			{
				name: '发表作品',
				icon: 'home',
				to: 'issue',  
				childItems: [
					{
						id: 'wsProjList',
						name: '开源作品',
						to: '/resume2/wsProj/'
					},
					{
						id: 'wsThesisList',
						name: '公开论文',
						to: '/resume2/wsThesis/'
					},
					{
						id: 'wsIssueList',
						name: '网上作品',
						to: '/resume2/wsIssue/'
					},
				]
			},
			{
				name: '社会关系',
				icon: 'home',
				to: 'social',  
				childItems: [
					{
						id: 'familyList',
						name: '家庭关系',
						to: '/resume2/family/'
					},
					{
						id: 'socialList',
						name: '社会关系',
						to: '/resume2/social/'
					},
					{
						id: 'benefitList',
						name: '公益活动',
						to: '/resume2/benefit/'
					},
					{
						id: 'soHonorList',
						name: '社会荣誉',
						to: '/resume2/soHonor/'
					},
					{
						id: 'emergList',
						name: '紧急联系人',
						to: '/resume2/emerg/'
					},
				]
			},
		]}
	},
	
	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete")],
	onServiceComplete: function(data) {
		var navItems = this.state.navItems;
		if(data.errMsg === ''){
			var ccMap={};
			for(var name in data.person){
				try{
					var obj=data.person[name]
					if(typeof(obj) === "object" && obj.constructor === Array){
						ccMap[name] = obj.length;
					}
				}catch(E){}
			}
			
			// 计算数量
			var len = navItems.length;
			for( var i=0; i<len; i++ ){
				var items = navItems[i].childItems;
				if(typeof(items) !== 'undefined'){
					var len2 = items.length;
					for( var i2=0; i2<len2; i2++ ){
						var item = items[i2];
						var pos = item.name.indexOf('(');
						if(pos > 0){
							item.name = item.name.substr(0, pos);
						}
						
						var cc = ccMap[item.id]
						if(typeof(cc) !== 'undefined'){
							item.name = item.name + '('+cc+')';
						}
					}
				}
			}
		}
		
		this.setState({
			navItems: navItems,
		});
	},
	handleModClick:function(node){
		if(typeof(node.to) !== 'undefined'){
			browserHistory.push({
		        pathname: node.to
			});
		}
	},
	render:function(){
        const {
        	onSelectMod,
            ...attributes,
        } = this.props;

		var recordSet = this.state.navItems;
		return (
			<LeftList2 width='220px' style={{display: 'flex', height:'100%'}} dataSource={recordSet} rowKey='to' rowText='name' onClick={this.handleModClick} activeNode='/resume2/PreviewPage/' {...attributes}/>
		);
	}
});

module.exports = MenuPage;
