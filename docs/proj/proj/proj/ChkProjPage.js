'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Icon, Button, Spin, Alert } from 'antd';

var ProjContext = require('../../ProjContext');
import ServiceMsg from '../../../lib/Components/ServiceMsg';

var ProjStore = require('./data/ProjChkStore.js');
var ProjActions = require('./action/ProjChkActions');

var ChkProjPage = React.createClass({
    getInitialState: function () {
        return {
            projSet: {
                proj: {},
                operation: '',
                errMsg: ''
            },
            loading: false,
        }
    },
    mixins: [Reflux.listenTo(ProjStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        if (data.operation === 'retrieve') {
            // console.log('data:::',data);
            this.setState({
                loading: false,
                projSet: data,
            });
        }
    },

    // 第一次加载
    componentDidMount: function () {
        if (window.loginData.compUser) {
            var filter = {};
            filter.staffCode = window.loginData.compUser.userCode;
            filter.corpUuid = window.loginData.compUser.corpUuid;
            filter.chkRole = '1';
            this.setState({ loading: true });
            ProjActions.initProj(filter);
        }
    },
    handleResClick: function (proj) {
        ProjContext.openResChkPage(proj);
    },
    handleGroupClick: function (proj) {
        ProjContext.openGroupChkPage(proj);
    },
    handleProjClick: function (proj) {
        ProjContext.openProjChkPage(proj);
    },
    handleBiziProjClick: function (proj) {
        ProjContext.openBiziProjChkPage(proj);
    },

    render: function () {
        var proj = this.state.projSet.proj;
        var resCardList = [];
        var groupCardList = [];
        var projCardList = [];
        var biziCardList = [];
        var resLen = 0;
        var groupLen = 0;
        var projLen = 0;
        var biziLen = 0;
        if (proj.res && proj.res.length > 0) {
            resLen = proj.res.length;
            resCardList =
                proj.res.map((res, i) => {
                    return <div key={res.uuid} className='card-div' style={{ width: 300 }}>
                        <div className="ant-card ant-card-bordered" style={{ width: '100%' }} onClick={this.handleResClick.bind(this, res)} >
                            <div className="ant-card-head"><h3 className="ant-card-head-title">
                                {res.poolName}
                                <p style={{float:'right'}}>
                                    <Icon type="team" title="小组数量" /> {res.childCount? res.childCount : 0}
                                    <span style={{padding:'0 8px'}}>|</span>
                                    <Icon type="user" title="成员数量" /> {res.memberCount? res.memberCount : 0}
                                </p>
                            </h3></div>
                            <div className="ant-card-body" style={{ cursor: 'pointer', minHeight: 84 }}>{res.poolDesc}</div>
                        </div>
                    </div>
                });
        };
        if (proj.group && proj.group.length > 0) {
            groupLen = proj.group.length;
            groupCardList =
                proj.group.map((group, i) => {
                    return <div key={group.uuid} className='card-div' style={{ width: 300 }}>
                        <div className="ant-card ant-card-bordered" style={{ width: '100%' }} onClick={this.handleGroupClick.bind(this, group)} >
                            <div className="ant-card-head"><h3 className="ant-card-head-title">
                                {group.grpName}
                                <p style={{float:'right'}}>
                                    <Icon type="share-alt" title="项目数量" /> {group.childCount? group.childCount : 0}
                                    <span style={{padding:'0 8px'}}>|</span>
                                    <Icon type="user" title="成员数量" /> {group.memberCount? group.memberCount : 0}
                                </p>
                            </h3></div>
                            <div className="ant-card-body" style={{ cursor: 'pointer', minHeight: 84 }}>{group.grpDesc}</div>
                        </div>
                    </div>
                });
        };
        if (proj.proj && proj.proj.length > 0) {
            projLen = proj.proj.length;
            projCardList =
                proj.proj.map((proj, i) => {
                    return <div key={proj.uuid} className='card-div' style={{ width: 300 }}>
                        <div className="ant-card ant-card-bordered" style={{ width: '100%' }} onClick={this.handleProjClick.bind(this, proj)} >
                            <div className="ant-card-head"><h3 className="ant-card-head-title">
                                {proj.projName}
                                <p style={{float:'right'}}>
                                    <Icon type="team" title="小组数量" /> {proj.childCount? proj.childCount : 0}
                                    <span style={{padding:'0 8px'}}>|</span>
                                    <Icon type="user" title="成员数量" /> {proj.memberCount? proj.memberCount : 0}
                                </p>
                            </h3></div>
                            <div className="ant-card-body" style={{ cursor: 'pointer', minHeight: 84 }}>{proj.projDesc}</div>
                        </div>
                    </div>
                });
        };

        if (proj.bizi && proj.bizi.length > 0) {
            biziLen = proj.bizi.length;
            biziCardList =
                proj.bizi.map((bizi, i) => {
                    return <div key={bizi.uuid} className='card-div' style={{ width: 300 }}>
                        <div className="ant-card ant-card-bordered" style={{ width: '100%' }} onClick={this.handleBiziProjClick.bind(this, bizi)} >
                            <div className="ant-card-head"><h3 className="ant-card-head-title">
                                {bizi.projName}
                                <p style={{float:'right'}}><Icon type="user" title="成员数量" /> {bizi.memberCount? bizi.memberCount : 0}</p>
                            </h3></div>
                            <div className="ant-card-body" style={{ cursor: 'pointer', minHeight: 84 }}>{bizi.projDesc}</div>
                        </div>
                    </div>
                });
        };

        var cardList =
            <div>
                {resLen === 0 && groupLen === 0 && projLen === 0 && biziLen === 0 ? <div style={{ marginLeft: '16px', marginBottom: '12px' }}>没有可管理的资源池和项目</div> : ''}
                <div style={{ overflow: 'hidden' }}>
                    {resLen === 0 ? '' : <div style={{ marginLeft: '16px', marginBottom: '12px' }}>共{resLen}个资源池</div>}
                    {resCardList}
                </div>
                <div style={{ overflow: 'hidden' }}>
                    {groupLen === 0 ? '' : <div style={{ marginLeft: '16px', marginBottom: '12px' }}>共{groupLen}个项目群</div>}
                    {groupCardList}
                </div>
                <div style={{ overflow: 'hidden' }}>
                    {projLen === 0 ? '' : <div style={{ marginLeft: '16px', marginBottom: '12px' }}>共{projLen}个项目组</div>}
                    {projCardList}
                </div>
                <div style={{ overflow: 'hidden' }}>
                    {biziLen === 0 ? '' : <div style={{ marginLeft: '16px', marginBottom: '12px' }}>共{biziLen}个事务性项目</div>}
                    {biziCardList}
                </div>
            </div>

        return (
            <div className='form-page' style={{ width: '100%', padding: '24px 16px 0 16px' }}>
                <ServiceMsg ref='mxgBox' svcList={['proj/retrieve']} />

                {
                    this.state.loading ?
                        <Spin tip="正在努力加载数据..."><div style={{ minHeight: '200px' }}>{cardList}</div></Spin>
                        :
                        <div>{cardList}</div>
                }
            </div>
        );
    }
});

module.exports = ChkProjPage;
