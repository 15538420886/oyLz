'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import { Button, Icon, Modal, Tabs, Checkbox, Row, Col } from 'antd';
const TabPane = Tabs.TabPane;

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
import ChkProjTree from './Components/ChkProjTree';
import ChkProjFlow from './Components/ChkProjFlow';
import ChkProjActions from './action/ChkProjActions';

var ChkProjPage = React.createClass({
    getInitialState: function () {
        return {
            chkProjObject: {},
        }
    },

    // 第一次加载
    componentDidMount: function () {
    },
    //选择项目树的项目组有效，选择项目群无效
    onSelectChkProj: function (chkProj) {
        // console.log(chkProj);
        if (chkProj === null || typeof (chkProj) === undefined) {
            return;
        }
        if (chkProj.parentUuid) {
            this.state.chkProjObject = chkProj;
            this.refs.chkProjFLow.onRetrieveChkProjFlowState(chkProj.uuid);
            this.setState({
                loading: false
            });
        } else {
            this.state.chkProjObject = chkProj;
            this.refs.chkProjFLow.onGetProjByUuid(chkProj.uuid);
            this.setState({
                loading: false
            });
        }
    },

    render: function () {
        // 主页面
        var cs = Common.getGridMargin(this, 0);
        return (
            <div className='grid-page'>
                <div style={{ margin: cs.margin }}>
                    <ServiceMsg ref='mxgBox' svcList={['proj_info/retrieve', 'proj_group/retrieve', 'flow-def/get-by-corpUuid',
                        'chk-proj/get-by-uuid', 'chk-proj/update', 'chk-proj/create', 'chk-proj-grp/create',
                        'chk-proj-grp/update', 'chk-proj-grp/get-by-uuid']} />
                </div>
                <div style={{ display: 'flex', height: '100%' }}>
                    <div className='left-tree' style={{ flex: '0 0 280px', width: '280px', overflowY: 'auto', overflowX: 'hidden' }}>
                        <ChkProjTree onSelectChkProj={this.onSelectChkProj} />
                    </div>
                    <div className='left-tree' style={{ width: '300px', overflowY: 'auto', overflowX: 'hidden', borderRightWidth: '0px', padding: '10px 16px 16px 16px' }}>
                        <ChkProjFlow ref='chkProjFLow' chkProjObject={this.state.chkProjObject} />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = ChkProjPage;
