import React from 'react';
import LeftMenu from '../lib/Components/LeftMenu';

const propTypes = {
    children: React.PropTypes.node
};

var ParamPageIndex = React.createClass({
    getInitialState: function () {
        return {
            navItems: [
                {
                    name: '字典查询',
                    to: '/param/DictFindPage/'
                },
                {
                    name: '系统字典',
                    icon: 'home',
                    to: 'system-dict',
                    childItems: [
                        {
                            name: '模块管理',
                            to: '/param/ModPage/?app=system'
                        },
                        {
                            name: '字典维护',
                            to: '/param/DictPage/?app=system'
                        }
                    ]
                },
                {
                    name: '公共字典',
                    icon: 'home',
                    to: 'common-dict',
                    childItems: [
                        {
                            name: '模块管理',
                            to: '/param/ModPage/?app=common'
                        },
                        {
                            name: '字典维护',
                            to: '/param/DictPage/?app=common'
                        }
                    ]
                },
                {
                    name: '字典和参数',
                    to: '/param/AppPage/'
                },
                {
                    name: 'UI参数维护',
                    to: '/param/UiParamPage/'
                },
                {
                    name: '模板管理',
                    to: '/param/ModelPage/'
                },
                {
                    name: '刷新模板',
                    to: '/param/ModelRefreshPage/'
                },
            ]
        }
    },

    render: function () {
        return (
            <LeftMenu navItems={this.state.navItems} activeNode="/param/AppPage/" children={this.props.children} />
        );
    }
});

ParamPageIndex.propTypes = propTypes;
module.exports = ParamPageIndex;
