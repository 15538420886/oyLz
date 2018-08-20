import React from 'react';
import { browserHistory } from 'react-router'
import { Layout, Menu, Icon } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

var Utils = require('../../public/script/utils');

const propTypes = {
    children: React.PropTypes.node,
    navItems: React.PropTypes.array,
    activeNode: React.PropTypes.string
};

var TopMenu = React.createClass({
    getInitialState: function () {
        return {
            current: this.props.activeNode,
        }
    },

    handleClick: function (e) {
        var url = e.key;
        this.state.current = url;

        var param = '';
        var pos = url.indexOf('?');
        if (pos > 0) {
            param = url.substring(1 + pos);
            url = url.substring(0, pos);
        }

        var pr = { fromDashboard: true };
        if (param !== '') {
            var values = param.split("&");
            values.map((str, i) => {
                pos = str.indexOf('=');
                if (pos > 0) {
                    var name = str.substring(0, pos);
                    var value = str.substring(1 + pos);
                    pr[name] = value;
                }
            });
        }

        // console.log('pr', pr);
        browserHistory.push({
            pathname: url,
            query: pr
        });
    },

    render: function () {
        return (
            <Layout style={{ width: '100%', height: '100%' }}>
                <Header style={{ height: '48px', padding: '0 0px' }}>
                    <Menu mode='horizontal' selectedKeys={[this.state.current]} onClick={this.handleClick}>
                        {
                            this.props.navItems.map((item, i) => {
                                // 检查权限
                                var itemColor = 'rgba(0,0,0,.65)';
                                var itemPriv = Utils.checkMenuPriv(item.to);
                                if(itemPriv === 2){
                                    // return null ;
                                    itemColor = 'red';
                                }else if(itemPriv === 0){
                                    return null ;
                                }

                                if (typeof (item.childItems) == "undefined") {
                                    var iconType = 'file';
                                    if (typeof (item.icon) != "undefined") {
                                        iconType = item.icon;
                                    }

                                    return <Menu.Item key={item.to}>
                                        <span className={itemColor === 'red' ? 'errorHint' : 'nav-text'}>
                                            <Icon type={iconType} />
                                            <span>{item.name}</span>
                                        </span>
                                    </Menu.Item>
                                }
                                else {
                                    var iconType = 'setting';
                                    if (typeof (item.icon) != "undefined") {
                                        iconType = item.icon;
                                    }

                                    var childNodes = [];
                                    item.childItems.map((o, i) => {
                                        // 检查权限
                                        var oColor = 'rgba(0,0,0,.65)';
                                        var oPriv = Utils.checkMenuPriv(o.to);
                                        if(oPriv===2)oColor = 'red';


                                        var iconType2 = 'file';
                                        if (typeof (o.icon) != "undefined") {
                                            iconType2 = o.icon;
                                        }

                                        childNodes.push(
                                            <Menu.Item key={o.to}>
                                                <span className={oColor === 'red' ? 'errorHint' : 'nav-text'}>
                                                    <Icon type={iconType2} />
                                                    <span>{o.name}</span>
                                                </span>
                                            </Menu.Item>
                                        );
                                    });

                                    if (childNodes.length === 0) {
                                        return null;
                                    }

                                    return <SubMenu key={item.to} title={<span><Icon type={iconType} /><span>{item.name}</span></span>}>
                                        {childNodes}
                                    </SubMenu>
                                }
                            })
                        }
                    </Menu>
                </Header>
                <Layout style={{ backgroundColor: '#fefefe', height: '100%', width: '100%' }}>
                    {this.props.children}
                </Layout>
            </Layout>
        );
    }
});

TopMenu.propTypes = propTypes;
module.exports = TopMenu;
