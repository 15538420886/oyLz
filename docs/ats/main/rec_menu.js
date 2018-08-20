import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';

const propTypes = {
    children: React.PropTypes.node
};

var AtsPageIndex = React.createClass({
    getInitialState: function () {
        return {
            navItems: [
                {
                    name: '招聘需求',
                    to: '/ats/RecruitPage/'
                },
                {
                    name: '项目需求',
                    to: '/ats/ProjReqPage/'
                },
                {
                    name: '简历管理',
                    to: '/ats/ResumePage/'
                },
                {
                    name: '待入职员工',
                    to: '/ats/ProsStaffPage/'
                },
                {
                    name: '入职资料',
                    to: '/ats/InfoCheckPage/'
                },
            ]
        }
    },

    render: function () {
        return (
            <LeftMenu navItems={this.state.navItems} activeNode="/ats/RecruitPage/" children={this.props.children} />
        );
    }
});

AtsPageIndex.propTypes = propTypes;
module.exports = AtsPageIndex;
