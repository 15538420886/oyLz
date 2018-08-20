import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';
var ProjContext = require('../ProjContext');

const propTypes = {
    children: React.PropTypes.node
};

var ChkProjPageIndex = React.createClass({
    getInitialState: function () {
        return {
            navItems: [
                {
                    name: '项目组员考勤',
                    to: '/proj/proj2/UserCheckPage/'
                },
                {
                    name: '临时组员考勤',
                    to: '/proj/proj2/TempCheckPage/'
                },
                {
                    name: '考勤查询',
                    to: '/proj/proj2/CheckQueryPage/'
                },
                {
                    name: '返回',
                    to: ProjContext.goBackUrl,
                    icon: 'rollback'
                },
            ]
        }
    },

    render: function () {
        return (
            <LeftMenu navItems={this.state.navItems} activeNode="/proj/proj2/UserCheckPage/" children={this.props.children} />
        );
    }
});

ChkProjPageIndex.propTypes = propTypes;
module.exports = ChkProjPageIndex;
