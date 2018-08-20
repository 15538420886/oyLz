import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';
var ProjContext = require('../ProjContext');

const propTypes = {
  children: React.PropTypes.node
};

var ProjInnPageIndex = React.createClass({
  getInitialState : function() {
      return {
          navItems: [
              {
                  name: '项目管理',
                  icon: 'home',
                  to: 'proj_man',
                  childItems: [
			        {
				        name: '项目小组',
				        to: '/proj/proj2/ProjTeamPage/'
		            },
			        {
				        name: '管理人员',
				        to: '/proj/proj2/ProjRolePage/'
                    },
                    {
                        name: '人员需求',
                        to: '/proj/proj2/ProjHrReqPage/'
                    },
                    {
                        name: '人员挑选',
                        to: '/proj/proj2/ProjCondPage/'
                    },
                  ]
              },
            {
                name: '人员管理',
                icon: 'home',
                to: 'hr_man',
                childItems: [
					{
						name: '项目成员',
						to: '/proj/proj2/ProjMemberPage/'
					},
                    {
                        name: '人员入组',
                        to: '/proj/proj2/EntryPage/'
                    },
                    {
                        name: '临时成员',
                        to: '/proj/proj2/TempMemberPage/'
                    },
                ]
              },
              {
                  name: '订单管理',
                  icon: 'home',
                  to: 'hr_order',
                  childItems: [
                      {
                          name: '项目订单',
                          to: '/proj/proj2/ProjTaskPage/'
                      },
                      {
                          name: '订单人员',
                          to: '/proj/proj2/TaskMemberPage/'
                      },
                  ]
              },
            {
                name: '其他',
                icon: 'home',
                to: 'pj_other',
                childItems: [
                    {
                        name: '人员评价',
                        to: '/proj/proj2/MemberEvalPage/'
                    },
			        {
				        name: '项目事件',
				        to: '/proj/proj2/ProjEventPage/'
			        },
			        {
				        name: '人员日志',
				        to: '/proj/proj2/MemberLogPage/'
			        },
                    {
                        name: '定级查询',
                        to: '/proj/proj2/ProjLevelPage/'
                    },
                    /*{
                        name: '批量导入组员',
                        to: '/proj/proj2/BatchInputPage/'
                    },*/
                ]
            },
            /*{
                name: '其他2',
                icon: 'home',
                to: 'pj_other2',
                childItems: [
			        {
				        name: '项目考勤',
				        to: '/proj/proj2/ProjCheckPage/'
			        },
			        {
				        name: '客户考勤',
				        to: '/proj/proj2/CustCheckPage/'
			        },
			        {
				        name: '项目报告',
				        to: '/proj/proj2/ProjReportPage/'
			        },
			        {
				        name: '个人报告',
				        to: '/proj/proj2/WorkReportPage/'
			        },
			        {
				        name: '工作量日报',
				        to: '/proj/proj2/ProjDailyPage/'
                    },
                ]
            },*/
			{
				name: '返回',
                to: ProjContext.goBackUrl,
				icon: 'rollback'
			},
	      ]
      }
  },
  
  render : function() {
    return (
    	<LeftMenu navItems={this.state.navItems} activeNode="/proj/proj2/ProjMemberPage/" children={this.props.children}/>
    );
  }
});

ProjInnPageIndex.propTypes = propTypes;
module.exports = ProjInnPageIndex;
