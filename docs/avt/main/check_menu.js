import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';

const propTypes = {
    children: React.PropTypes.node
};

var CheckPageIndex = React.createClass({
    getInitialState: function () {
        return {
            navItems: [
                {
                    name: '考勤查询',
                    to: '/avt/check/CheckQueryPage/'
                },
                {
                    name: '出勤日志',
                    to: '/avt/check/CheckLogPage/'
                },
                {
                    name: '休假记录',
                    to: '/avt/check/LeaveQueryPage/'
                },
                /*{
                  name: '加班记录',
                  to: '/avt/check/OverBookPage/'
                },
                {
                  name: '假日查询',
                  to: '/avt/check/LeaveLogPage/'
                },*/
                {
                    name: '工资单查询',
                    to: '/avt/hr/SalaryLogPage/'
                },
                {
                    name: '报销单查询',
                    to: '/avt/hr/AllowLogPage/'
                },
            ]
        }
    },

    render: function () {
        return (
            <LeftMenu navItems={this.state.navItems} activeNode="/avt/check/CheckQueryPage/" children={this.props.children} />
        );
    }
});

CheckPageIndex.propTypes = propTypes;
module.exports = CheckPageIndex;


