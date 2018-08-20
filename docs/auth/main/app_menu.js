import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';

const propTypes = {
    children: React.PropTypes.node
};

var AuthPageIndex = React.createClass({
    getInitialState: function () {
        return {
            navItems: [
                {
                    name: '服务管理',
                    to: '/auth/AppPage/'
                },
                /*{
                    name: '服务组管理',
                    to: '/auth/AppGroupPage/'
                },*/
                {
                    name: 'APP管理',
                    to: '/auth/FntAppPage/'
                },
                {
                    name: '刷新权限',
                    to: '/auth/LoadRedisPage/'
                },
            ]
        }
    },

    render: function () {
        return (
            <LeftMenu navItems={this.state.navItems} activeNode="/auth/AppPage/" children={this.props.children} />
        );
    }
});

AuthPageIndex.propTypes = propTypes;
module.exports = AuthPageIndex;
