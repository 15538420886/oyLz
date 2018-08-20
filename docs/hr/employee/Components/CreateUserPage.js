import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Modal, Button, Tabs } from 'antd';
const TabPane = Tabs.TabPane;

var Utils = require('../../../public/script/utils');
import CreateStaffUserPage from '../../../auth/user/Components/CreateStaffUserPage'; SendMailPage
import CreateStaffMemberPage from '../../../proj/res/member/Components/CreateStaffMemberPage';
import SendMailPage from './SendMailPage';

const steps = [{
  title: '建立基本信息',
  content: '建立用户基本信息',
},
{
  title: '创建用户',
  content: '创建公司内部的用户',
}];

var CreateUserPage = React.createClass({
	getInitialState : function() {
        return {
            modal: false,
            selectKey: '1',
            user: null,
            job: null,

            userCreated: false,
            memberCreated: false,
            noticed: false,
		}
	},

	// 第一次加载
    componentDidMount: function () {
	},
    initStaff: function (user, job) {
        if (job === null || job === undefined) {
            job = {};
        }
        
        // console.log('initStaff', user, job)
        this.state.user = {};
        this.state.job = {};
        Utils.copyValue(user, this.state.user);
        Utils.copyValue(job, this.state.job);

        var userPage = this.refs.userPage;
        if (userPage) {
            userPage.initStaff(user);
        }

        var memberPage = this.refs.memberPage;
        if (memberPage) {
            memberPage.initStaff(user, job);
        }

        var mailPage = this.refs.mailPage;
        if (mailPage) {
            mailPage.initStaff(user, job);
        }

        this.setState({
            selectKey: '1',
        });
    },
    onSave: function (type) {
        if (type === 'user') {
            this.setState({ userCreated: true, selectKey: '1' });
        }
        else if (type === 'member') {
            this.setState({ memberCreated: true, selectKey: '1' });
        }
        else if (type === 'notice') {
            this.setState({ noticed: true, selectKey: '1' });
        }

        if (this.state.userCreated && this.state.memberCreated && this.state.noticed) {
            this.toggle();
        }
    },
    
    toggle: function () {
        this.setState({
            selectKey: '1',
            userCreated: false,
            memberCreated: false,
            noticed: false,
            modal: !this.state.modal
        });
    },
    onTabChange: function (activeKey) {
        this.setState({ selectKey: activeKey });
    },

    render: function () {
        var idx = 0;
        var pages = [];
        if (!this.state.userCreated) {
            idx = idx + 1;
            pages.push(
                <TabPane tab="创建员工账号" key={''+idx} style={{ width: '100%', height: '100%', padding: '0 10px 0 0' }}>
                    <CreateStaffUserPage ref='userPage' onSave={this.onSave} modal={this.state.modal} />
                </TabPane>
            );
        }

        if (!this.state.memberCreated) {
            idx = idx + 1;
            pages.push(
                <TabPane tab="加入资源池" key={'' +idx} style={{ width: '100%', height: '100%', padding:'0 10px 0 0' }}>
                    <CreateStaffMemberPage ref='memberPage' onSave={this.onSave} obj={this.state} type='staff' />
                </TabPane>
            );
        }

        if (!this.state.noticed) {
            idx = idx + 1;
            pages.push(
                <TabPane tab="通知相关人员" key={'' +idx} style={{ width: '100%', height: '100%' }}>
                    <SendMailPage ref='mailPage' onSave={this.onSave} obj={this.state} type='staff' />
                </TabPane>
            );
        }

        if (idx === 0) {
            this.state.modal = false;
        }

		return (
			<Modal visible={this.state.modal} width='640px' title="后续操作" maskClosable={false} onCancel={this.toggle}
			  footer={null}
            >
                <Tabs ref='EmpTabs' activeKey={this.state.selectKey} onChange={this.onTabChange} size="small">
                    {pages}
                </Tabs>
			</Modal>
		);
	}
});

export default CreateUserPage;
