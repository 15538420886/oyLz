'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Button, Table, Icon, Modal, Input, Radio, Spin, Tabs } from 'antd';
const Search = Input.Search;
const TabPane = Tabs.TabPane;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var ProjContext = require('../../ProjContext');
import CodeMap from '../../../hr/lib/CodeMap';

var ResTeamActions = require('../team/action/ResTeamActions');
var ResTeamStore = require('../team/data/ResTeamStore');
var ResTeamGrpTreePage = require('./ResTeamGrpTreePage');

var ResTeamGrpPage = React.createClass({
    getInitialState: function () {
        return {
            resTeamSet: {
                recordSet: [],
                errMsg: ''
            },

            loading: false,
            teamLoading: false,
            viewType: '1',
            team: {},

            action: 'team',
        }
    },

    mixins: [Reflux.listenTo(ResTeamStore, "onServiceComplete2"), CodeMap()],
    onServiceComplete2: function (data) {
        this.setState({
            teamLoading: false,
            resTeamSet: data
        });
    },

    handleQueryClickTeam: function () {
        var poolUuid = ProjContext.selectedPool.uuid;
        this.setState({ teamLoading: true });
        this.state.resTeamSet.operation = '';
        ResTeamActions.retrieveResTeam(poolUuid);
    },

    // 第一次加载
    componentDidMount: function () {
        var poolUuid = ProjContext.selectedPool.uuid;
        this.setState({ teamLoading: true });
        ResTeamActions.initResTeam(poolUuid);
    },
    handleItemClick: function (team, e) {
        this.setState({ team: team, action: 'group' });
    },
    onGoBackTeam: function () {
        this.setState({ action: 'team' });
    },
    onTabChange: function (activeKey) {
        if (activeKey === '1') {
            this.onGoBackTeam();
        }
    },

    render: function () {
        var teamVisible = (this.state.action === 'team') ? '' : 'none';
        var resItem = this.state.resTeamSet.recordSet;
        var len = resItem.length;
        var teamCardList =
            resItem.map((team, i) => {
                return <div key={team.uuid} className='card-div' style={{ width: 300 }}>
                    <div className="ant-card ant-card-bordered" style={{ width: '100%' }} onClick={this.handleItemClick.bind(this, team)} title='点击进入小组成员管理页面'>
                        <div className="ant-card-head"><h3 className="ant-card-head-title">{team.teamName}</h3></div>
                        <div className="ant-card-body" style={{ cursor: 'pointer', height: '66px', overflow: 'hidden' }}>
                            <p>{team.teamDesc}（{team.tmName}）<Icon type="user" title="成员数量" style={{ marginLeft: '10px' }} /> {team.memberCount ? team.memberCount : 0}</p>
                        </div>
                    </div>
                </div>
            });

        var cs = Common.getCardMargin(this);
        var teamCard =
            <div className='card-page' style={{ padding: cs.padding, display: teamVisible }}>
                <div style={{ margin: cs.margin }}>
                    <ServiceMsg ref='mxgBox' svcList={['res-team/retrieve', 'res-team/remove']} />

                    <div className='toolbar-card'>
                        <div style={{ float: 'left' }}>
                            <div style={{ paddingTop: '16px', paddingRight: '4px', display: 'inline' }}>共{len}个小组</div>
                            <Icon type="reload" onClick={this.handleQueryClickTeam} title='刷新数据' className='toolbar-icon' style={{ paddingLeft: '8px' }} />
                        </div>
                    </div>
                </div>
                {
                    this.state.teamLoading ?
                        <Spin tip="正在努力加载数据..."><div style={{ minHeight: '200px' }}>{teamCardList}</div></Spin>
                        :
                        <div>{teamCardList}</div>
                }
            </div>;

        var page = null;
        if (this.state.action === 'group') {
            page = <ResTeamGrpTreePage team={this.state.team} />

            page = <div style={{ overflow: 'hidden', height: '100%', paddingLeft: '4px' }}>
                <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                    <TabPane tab="返回" key="1" style={{ width: '100%', height: '100%' }}>
                    </TabPane>
                    <TabPane tab="小组管理" key="2" style={{ width: '100%', height: '100%' }}>
                        <ResTeamGrpTreePage goBack={this.onGoBackTeam} team={this.state.team} />
                    </TabPane>
                </Tabs>
            </div>
        }

        return (
            <div style={{ width: '100%', height: '100%' }}>
                {teamCard}
                {page}
            </div>
        );
    }
});

module.exports = ResTeamGrpPage;

