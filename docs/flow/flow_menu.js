import React from 'react';
import LeftMenu from '../lib/Components/LeftMenu';

const propTypes = {
    children: React.PropTypes.node
};

var FlowPageIndex = React.createClass({
    getInitialState: function () {
        return {
            navItems: [
                {
                    name: '流程定义',
                    to: '/param/flow/FlowDefPage/'
                },
                {
                    name: '特批流程',
                    to: '/param/flow/SpecDefPage/'
                },
                {
                    name: '角色定义',
                    to: '/param/flow/FlowRolePage/'
                },
                /*{
                    name: '项目群权限',
                    to: '/param/flow/ChkProjGrpPage/'
                },*/
                {
                    name: '项目组权限',
                    to: '/param/flow/ChkProjPage/'
                },
            ]
        }
    },

    render: function () {
        return (
            <LeftMenu navItems={this.state.navItems} activeNode="/param/flow/FlowDefPage/" children={this.props.children} />
        );
    }
});

FlowPageIndex.propTypes = propTypes;
module.exports = FlowPageIndex;


