import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';
var ProjContext = require('../ProjContext');

const propTypes = {
    children: React.PropTypes.node
};

var PgInnPageIndex = React.createClass({
    getInitialState: function () {
        return {
            navItems: [
                {
                    name: '项目组管理',
                    to: '/proj/group/ProjPage/'
                },
                {
                    name: '项目管理员',
                    to: '/proj/group/GroupManPage/'
                },
                {
                    name: '组员查询',
                    to: '/proj/group/GroupMemberPage/'
                },
                {
                    name: '订单分配',
                    to: '/proj/group/ProjTaskDispPage/'
                },
                {
                    name: '返回',
                    to: ProjContext.goBackUrl ==='/proj/group/ProjPage/'? ProjContext.lastUrl : ProjContext.goBackUrl,
                    icon: 'rollback'
                },
            ]
        }
    },

    render: function () {
        return (
            <LeftMenu navItems={this.state.navItems} activeNode="/proj/group/ProjPage/" children={this.props.children} />
        );
    }
});

PgInnPageIndex.propTypes = propTypes;
module.exports = PgInnPageIndex;

