'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import { withRouter } from 'react-router'
import { Table, Button, Icon, Input, Spin, Modal } from 'antd';
const Search = Input.Search;
var Utils = require('../../../public/script/utils');
var Common = require('../../../public/script/common');
var ProjTempStore = require('./data/ProjTempStore');
var ProjTempActions = require('./action/ProjTempActions');
var ProjTempDetailPage = require('../proj-tempDetail/ProjTempDetailPage');

var filterValue = '';
var ProjTempPage = React.createClass({
    getInitialState: function () {
        return {
            projTempSet: {
                recordSet: [],
                errMsg: '',
            },
            loading: false,
            action: 'query',
            projTemp: {},
        }
    },

    mixins: [Reflux.listenTo(ProjTempStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            projTempSet: data
        });
    },

    componentDidMount: function (filter) {
        this.setState({ loading: true });

        var filter = {};
        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.staffCode = window.loginData.compUser.userCode;
        ProjTempActions.initProjTemp(filter);
    },

    handleProjClick: function (projTemp, e) {
        this.state.projTemp = projTemp;
        this.setState({ action: 'form' });
    },
    goBack: function () {
        this.setState({
            action: 'query'
        });
    },

    onFilterRecord: function (e) {
        filterValue = e.target.value;
        this.setState({ loading: this.state.loading });
    },

    render: function () {
        var recordSet = Common.filter(this.state.projTempSet.recordSet, filterValue);
        var visible = (this.state.action === 'query') ? '' : 'none';
        var cs = Common.getCardMargin(this);

        var cardList =
            recordSet.map((projTemp, i) => {
                return <div key={projTemp.uuid} className='card-div' style={{ width: 300 }}>
                    <div className="ant-card ant-card-bordered" style={{ width: '100%' }} onClick={this.handleProjClick.bind(this, projTemp)} title='点击进入临时组'>
                        <div className="ant-card-head"><h3 className="ant-card-head-title">{projTemp.projCode}</h3></div>
                        <div className="ant-card-body" style={{ cursor: 'pointer', height: '66px', overflow: 'hidden' }}>{projTemp.projName}({projTemp.pmName})</div>
                    </div>
                </div>
            });

        var cardList2 =
            <div className='grid-page' style={{ padding: cs.padding, display: visible }}>
                <div style={{ margin: cs.margin }}>
                    <ServiceMsg ref='mxgBox' svcList={['proj_temp_member/user-temp-proj']} />

                    <div className='toolbar-card'>
                        <div style={{ float: 'left' }}>
                            <div style={{ paddingTop: '16px', paddingRight: '4px', display: 'inline' }}>{recordSet.length}个临时项目组</div>
                        </div>
                        <div style={{ textAlign: 'right', width: '100%' }}>
                            <Search placeholder="查找记录" style={{ width: Common.searchWidth }} value={filterValue} onChange={this.onFilterRecord} />
                        </div>
                    </div>
                </div>

                {
                    this.state.loading ?
                        <Spin tip="正在努力加载数据..." style={{ minHeight: '200px' }}>{cardList}</Spin>
                        :
                        <div className='card-body'>{cardList}</div>
                }
            </div>

        var page = null;
        if (this.state.action === 'form') {
            page = <ProjTempDetailPage proj={this.state.projTemp} goBack={this.goBack} />
        }

        return (
            <div style={{ width: '100%', height: '100%' }}>
                {cardList2}
                {page}
            </div>

        );
    }
});

module.exports = ProjTempPage;
