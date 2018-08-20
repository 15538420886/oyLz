'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import { Button, Table, Icon, Modal, Input, Radio, Spin, Upload } from 'antd';
const Search = Input.Search;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var EmployeeJobStore = require('../data/EmployeeJobStore');
var EmpJobActions = require('../action/EmpJobActions');

var JobStore = require('../../job/data/JobStore.js');
var JobActions = require('../../job/action/JobActions');
var LevelStore = require('../../level/data/LevelStore');
var LevelActions = require('../../level/action/LevelActions');

import CodeMap from '../../lib/CodeMap';
import XlsTempFile from '../../../lib/Components/XlsTempFile';
import XlsConfig from '../../lib/XlsConfig';

var BatchCreateEmpJobPage = React.createClass({
    getInitialState: function () {
        return {
            recordSet: [],
            loading: false,
            isSuccess: true,
            isTranslate: false,
            jobMap: {},
            jobSet: [],
            lvlMap: {},
            lvlMap2: {},
            lvlSet: [],
        }
    },

    mixins: [Reflux.listenTo(EmployeeJobStore, "onServiceComplete"),
        Reflux.listenTo(JobStore, "onJobComplete"),
        Reflux.listenTo(LevelStore, "onLevelComplete"),
        CodeMap(), XlsTempFile(),],

    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            recordSet: data.recordSet,
        });
    },
    onJobComplete: function (data) {
        var jobMap = {};
        data.recordSet.map((job,i)=>{
            jobMap[job.jobCode] = job.uuid;
        });

        // console.log('jobMap', jobMap)
        this.setState({
            jobSet: data.recordSet,
            jobMap: jobMap
        })
    },
    onLevelComplete: function (data) {
        var lvlMap = {};
        var lvlMap2 = {};
        data.recordSet.map((job,i)=>{
            lvlMap[job.lvlCode] = job.uuid;
            lvlMap2[job.uuid] = job.lvlCode;
        });

        // console.log('lvlMap', lvlMap)
        this.setState({
            lvlSet: data.recordSet,
            lvlMap: lvlMap,
            lvlMap2: lvlMap2
        })
    },
    translate: function (obj) {
        var tName = obj.newTechUuid;
        if (tName !== undefined && tName !== null && tName !== '') {
            obj.techUuid = this.state.jobMap[tName];
            if (obj.techUuid === undefined) {
                this.state.isSuccess = false
                obj.techName = '#' + tName;
            }
            else {
                obj.techName = tName;
            }
        }

        var mName = obj.newManUuid;
        if (mName !== undefined && mName !== null && mName !== '') {
            obj.manUuid = this.state.jobMap[mName];
            if (obj.manUuid === undefined) {
                this.state.isSuccess = false
                obj.manName = '#' + mName;
            }
            else {
                obj.manName = mName;
            }
        }

        var eLevel = obj.newEmpLevel;
        if (eLevel !== undefined && eLevel !== null && eLevel !== '') {
            obj.empLevel = this.state.lvlMap[eLevel];
            if (obj.empLevel === undefined) {
                obj.empLevel = '#' + eLevel;
                this.state.isSuccess = false;
            }
        }
    },
    getLevel: function (text) {
        if (text === null || text === '') {
            return '';
        }

        if (text.startsWith('#')) {
            return <span style={{ color: 'red' }}>{text}</span>;
        }

        var str = this.state.lvlMap2[text];
        if (str === undefined) {
            return text;
        }

        return str;
    },

    // 第一次加载
    componentDidMount: function () {
        var corpUuid = window.loginData.compUser.corpUuid;
        JobActions.initHrJob(corpUuid);
        LevelActions.initHrLevel(corpUuid);
    },

    // 批量增加数据
    handleBatchCreate: function (e) {
        this.setState({ loading: true });
        EmpJobActions.batchCreateHrEmpJob(this.state.recordSet);
    },

    handleTempDown: function (e) {
        this.downXlsTempFile(XlsConfig.empJobFields);
    },
    uploadComplete: function (errMsg, result) {
        this.setState({ loading: false});
        if (errMsg !== '') {
            Common.errMsg(errMsg);
        }
        else {
            var len = result.list.length;
            for (var i = 0; i < len; i++) {
                var job = result.list[i];
                job.status = '1';
            }

            this.setState({ recordSet: result.list });
        }
    },
    beforeUpload: function (file) {
        this.setState({ loading: true, isSuccess: true, recordSet: [], isTranslate: false });
        var url = Utils.hrUrl + 'hr_emp_job/retrieve-xls';
        var data = { corpUuid: window.loginData.compUser.corpUuid };
        this.uploadXlsFile(url, data, XlsConfig.empJobFields, file, this.uploadComplete);
        return false;
    },

    render: function () {
        var recordSet = this.state.recordSet;
        const columns = [
            {
                title: '员工号',
                dataIndex: 'staffCode',
                key: 'staffCode',
                width: 140,
            },
            {
                title: '员工',
                dataIndex: 'perName',
                key: 'perName',
                width: 140,
            },
            {
                title: '类型',
                dataIndex: 'empType',
                key: 'empType',
                width: 140,
                render: (text, record) => (Utils.getOptionName('HR系统', '员工类型', record.empType, false, this)),
            },
            {
                title: '级别',
                dataIndex: 'empLevel',
                key: 'empLevel', 
                width: 140,
                render: (text, record) => (this.getLevel(text)),
            },
            {
                title: '技术级别',
                dataIndex: 'techLevel',
                key: 'techLevel',
                width: 140,
            },
            {
                title: '管理级别',
                dataIndex: 'manLevel',
                key: 'manLevel',
                width: 140,
            },
            {
                title: '技术岗位',
                dataIndex: 'techName',
                key: 'techName',
                width: 140,
                render: (text, record) => ((text !== null && text.startsWith('#')) ? <span style={{ color: 'red' }}>{text}</span> : text),
            },
            {
                title: '管理岗位',
                dataIndex: 'manName',
                key: 'manUuid',
                width: 140,
                render: (text, record) => ((text !== null && text.startsWith('#')) ? <span style={{ color: 'red' }}>{text}</span> : text),
            },
            {
                title: '审批人',
                dataIndex: 'approver',
                key: 'approver',
                width: 140,
            },
        ];

        var disabled = (recordSet.length === 0 || this.state.jobSet.length === 0 || this.state.lvlSet.length === 0);
        if (!this.state.isTranslate && !disabled) {
            recordSet.map((data, i) => {
                this.translate(data);
            });
            
            this.state.isTranslate = true;
        }

        disabled = disabled || !this.state.isSuccess;
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div className='grid-page' style={{ padding: '8px 0 0 0', overflow: 'auto'}}>
                    <ServiceMsg ref='mxgBox' svcList={['hr_emp_job/create']} />
                    <div className='toolbar-table'>
                        <div style={{ float: 'left' }}>
                            <Button icon='save' type="primary" title="批量调整岗位信息" onClick={this.handleBatchCreate} disabled={disabled}>批量调整岗位信息</Button>
                            <Button icon='download' title="下载模板" onClick={this.handleTempDown} style={{ marginLeft: '4px' }} />
                            <Upload name='file' action='/posts/' beforeUpload={this.beforeUpload} style={{ marginLeft: '4px' }}>
                                <Button icon="upload" title='上传文件, 需要用户确认后才会保存到数据库'/>
                            </Upload>
                        </div>
                    </div>
                    <div className='grid-body'>
                        <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = BatchCreateEmpJobPage;

