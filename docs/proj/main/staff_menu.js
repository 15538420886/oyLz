import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';

const propTypes = {
    children: React.PropTypes.node
};

var StaffPageIndex = React.createClass({
    getInitialState: function () {
        return {
            navItems: [
                {
                    name: '资源池管理',
                    to: '/proj/group/PoolPage/'
                },
                {
                    name: '项目群管理',
                    to: '/proj/group/ProjGroupPage/'
                },
                /*{
                    name: '项目组管理',
                    to: '/proj/group/ProjPage/'
                },*/
                {
                    name: '事务性项目',
                    to: '/proj/group/BiziProjPage/'
                },
                {
                    name: '项目调度日志',
                    to: '/proj/staff/StaffDispPage/'
                },
                /*{
                    name: '考勤查询',
                    to: '/proj/staff/UserCheckPage/'
                },
                {
                    name: '加班查询',
                    to: '/proj/staff/OverBookPage/'
                },*/
                {
                  name: '查询',
                  icon: 'home',
                  to: 'staff_query',
                  childItems: [
	                {
	                    name: '人员查询',
	                    to: '/proj/staff/StaffQueryPage/'
	                },
			        {
				        name: '项目人员查询',
				        to: '/proj/staff/ProjMemberPage/'
                    },
                    {
                        name: '订单人员查询',
                        to: '/proj/staff/TaskMemberPage/'
                    },
                    {
                        name: '技术小组查询',
                        to: '/proj/staff/ResGroupQueryPage/'
                    },
                  ]
                },
            ]
        }
    },

    render: function () {
        var pathname = this.props.location.pathname;
        if (pathname === undefined || pathname === null || pathname === '') {
            pathname = "/proj/group/ProjGroupPage/";
        }

        return (
            <LeftMenu navItems={this.state.navItems} activeNode={pathname} children={this.props.children} />
        );
    }
});

StaffPageIndex.propTypes = propTypes;
module.exports = StaffPageIndex;
