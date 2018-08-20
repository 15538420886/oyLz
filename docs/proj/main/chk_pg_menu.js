import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';
var ProjContext = require('../ProjContext');

const propTypes = {
    children: React.PropTypes.node
};

var ChkPgPageIndex = React.createClass({
    getInitialState: function () {
        return {
            navItems: [
                {
                    name: '项目群考勤',
                    to: '/proj/group/GroupCheckPage/'
                },
                {
                    name: '临时组员考勤',
                    to: '/proj/group/TempCheckPage/'
                },
                {
                    name: '考勤查询',
                    to: '/proj/group/CheckQueryPage/'
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
            <LeftMenu navItems={this.state.navItems} activeNode="/proj/group/GroupCheckPage/" children={this.props.children} />
        );
    }
});

ChkPgPageIndex.propTypes = propTypes;
module.exports = ChkPgPageIndex;

