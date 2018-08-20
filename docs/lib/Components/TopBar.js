import React from 'react';
import Helmet from 'react-helmet';
import { browserHistory } from 'react-router'
import { Layout, Menu, Breadcrumb, Icon, Dropdown } from 'antd';
const { Header, Content, Footer } = Layout;
var LoginUtil = require('../../login2/LoginUtil');

var Utils = require('../../public/script/utils');

const propTypes = {
    children: React.PropTypes.node,
    navItems: React.PropTypes.array,
    activeNode: React.PropTypes.string,
    offsetLeft: React.PropTypes.string,
    home: React.PropTypes.string,
    console.log(children)
};

var TopBar = React.createClass({
    getInitialState: function () {
        return null
    },

    goHome: function (e) {
        var url = this.props.home;
        if (url === null || typeof (url) === 'undefined') {
            url = '/main/DeskPage/';
        }

        // 不检查主页面的菜单
        Utils.setActiveMenuName('');

        if (url.charAt(0) === '@') {
            document.location.href = url.substr(1);
        }
        else {
            browserHistory.push({
                pathname: url
            });
        }
    },
    handleMenuClick: function (e) {
        if (e.key === '1') {
            // 改密
            browserHistory.push({
                pathname: '/main/passwd/'
            });
        }
        else if (e.key === '2') {
            // 签退
            document.location.href = '/index.html';
        }
        else {
            console.log('handleMenuClick', e);
        }
    },
    handleClick: function (e) {
        var url = e.key;
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
        if (window.loginData === null || typeof (window.loginData) === 'undefined') {
            if (!LoginUtil.loadContext()) {
                browserHistory.push({
                    pathname: '/index.html'
                });

                return null;
            }
        }

        const menu = (
            <Menu onClick={this.handleMenuClick}>
                <Menu.Item key="1">修改密码</Menu.Item>
                <Menu.Item key="2">用户签退</Menu.Item>
            </Menu>
        );

        var offsetLeft = this.props.offsetLeft;
        if (offsetLeft === null || typeof (offsetLeft) === 'undefined') {
            offsetLeft = '200px';
        }

        var aNode = [this.props.activeNode];
        return <div style={{ width: '100%', height: '100%', padding: '38px 0 0' }}>
            <Helmet
                titleTemplate="隆正互联 - %s"
                title="管理软件"
                defaultTitle="管理软件"
                meta={[{ 'name': '隆正互联' }]}
            />
            <Header style={{ margin: '-38px 0 0', height: '38px', lineHeight: '38px', paddingLeft: '36px', paddingRight: '24px' }}>
                <div style={{ float: 'left', color: '#EFEFEF' }}>隆正软件</div>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={aNode} onClick={this.handleClick}
                    style={{ lineHeight: '38px', float: 'left', paddingLeft: offsetLeft }}
                >
                    {
                        this.props.navItems.map((item, i) => {
                            // 检查权限
                            var itemColor = 'hsla(0, 0%, 100%, .67)';
                            var itemPriv = Utils.checkMenuPriv(item.to);
                            if(itemPriv === 2){
                                // return null ;
                                itemColor = 'red';
                            }else if(itemPriv === 0){
                                return null ;
                            }

                            var iconType = 'file';
                            if (typeof (item.icon) != "undefined") {
                                iconType = item.icon;
                            }

                            return <Menu.Item key={item.to}>
                                <span>
                                    <Icon type={iconType} />
                                    <span className={itemColor === 'red' ? 'errorHint' : 'nav-text'}>{item.name}</span>
                                </span>
                            </Menu.Item>
                        })
                    }
                </Menu>
                <div style={{ float: 'right', color: '#EFEFEF' }}>
                    <Icon type="home" onClick={this.goHome} title='返回主页' style={{ padding: '0 8px 0 0', cursor: 'pointer' }} />
                    <Dropdown overlay={menu}>
                        <Icon type="setting" style={{ cursor: 'pointer' }} />
                    </Dropdown>
                </div>
            </Header>
            <Content style={{ width: '100%', height: '100%', padding: '0 0px' }}>
                {this.props.children}
            </Content>
        </div>
    }
});

TopBar.propTypes = propTypes;
module.exports = TopBar;
