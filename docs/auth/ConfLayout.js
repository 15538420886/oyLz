import React from 'react';
import TopBar from '../lib/Components/TopBar';
var Common = require('../public/script/common');


var ConfLayout = React.createClass({
    getInitialState: function () {
        var items = [];
        if (Common.corpStruct === '园区') {
            items.push(
                {
                    name: '公司和园区',
                    to: '/auth/CampusPage/'
                }
            );
        }
        else if (Common.corpStruct === '多公司') {
            items.push(
                {
                    name: '公司管理',
                    to: '/auth/CorpPage/'
                }
            );
        }
        else if (Common.corpStruct === '单公司') {
            items.push(
                {
                    name: '系统管理员',
                    to: '/auth/SysUserPage/'
                }
            );
        }

        items.push(
            {
                name: 'APP和服务',
                to: '/auth/AppPage/'
            }
        );

        items.push(
            {
                name: '参数管理',
                to: '/param/AppPage/'
            }
        );

        items.push(
            {
                name: '流程配置',
                to: '/param/flow/FlowDefPage/'
            }
        );

        return { navItems:items };
    },

    render: function () {
        return <TopBar navItems={this.state.navItems} activeNode={Common.authHome} home='@/index.html?from=conf' children={this.props.children} />
    }
});

module.exports = ConfLayout;



