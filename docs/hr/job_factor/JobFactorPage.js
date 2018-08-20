import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import ModalForm from '../../lib/Components/ModalForm';
var Validator = require('../../public/script/common');

import { Form, Modal, Button, Input, Select, Spin } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var JobFactorStore = require('./data/JobFactorStore.js');
var JobFactorActions = require('./action/JobFactorActions');
var WorkFactorActions = require('../work_factor/action/WorkFactorActions');
var WorkFactorStore = require('../work_factor/data/WorkFactorStore');

var JobFactorPage = React.createClass({
    getInitialState: function () {
        return {
            jobFactorSet: {
                recordSet: [],
                startPage: 0,
                pageRow: 0,
                totalRow: 0,
                operation: '',
                errMsg: ''
            },
            workFactorSet: {
                recordSet: [],
                startPage: 0,
                pageRow: 0,
                totalRow: 0,
                errMsg: ''
            },
            jobLoading: false,
            workLoading: false,
            modal: false,
            factorList: [],
            jobUuid: '',
            hints: {},
            validRules: []
        }
    },
    mixins: [Reflux.listenTo(JobFactorStore, "onServiceComplete1"), Reflux.listenTo(WorkFactorStore, "onServiceComplete2"), ModalForm('jobFactor')],

    onServiceComplete1: function (data) {
        this.setState({
            jobLoading: false,
            jobFactorSet: data
        });
        if (this.state.modal && data.operation === 'create') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.setState({
                    modal: false
                });
            }
            else {
                // 失败
                this.setState({
                    jobLoading: false,
                    jobFactorSet: data
                });
            }
        }
        this.doFillter();

    },
    onServiceComplete2: function (data) {
        this.setState({
            workLoading: false,
            workFactorSet: data
        });
        this.doFillter();
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
        ];

    },

    clear: function (corpUuid, workUuid, jobUuid) {
        this.state.hints = {};

        this.state.workLoading = false;
        this.state.jobLoading = false;
        this.state.jobFactorSet.operation = '';
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    fillterList: function () {
        var factorList = [];
        var jobList = this.state.jobFactorSet.recordSet;
        var workList = this.state.workFactorSet.recordSet;
        var len = jobList.length;

        workList.map((item, i) => {
            var obj = {
                "kpiName": item.kpiName,
                "workUuid": item.workUuid,
                "jobUuid": this.state.jobUuid,
                "factorUuid": item.uuid,
            }
            for (let i = 0; i < len; i++) {
                if (jobList[i].factorUuid === item.uuid) {
                    obj.kpiValue = jobList[i].kpiValue;
                    obj.uuid = jobList[i].uuid;
                    break;
                }
            }
            factorList.push(obj);
        });
        this.setState({
            factorList: factorList
        });

    },

    doFillter: function () {
        var loading = (this.state.jobLoading || this.state.workLoading);
        if (!loading) {
            this.fillterList();
        }
    },

    onClickSave: function () {
        var factorList = this.state.factorList;
        console.log(factorList)
        var newList = [];
        factorList.map((item, i) => {
            if (item.uuid || item.kpiValue) {
                newList.push(item);
            }
        })

        this.state.jobFactorSet.operation = '';
        this.setState({ jobLoading: true });
        JobFactorActions.createHrJobFactorValue(newList);
    },

    loadFactor: function (workUuid, jobUuid) {
        this.setState({ workLoading: true, jobLoading: true, jobUuid: jobUuid });
        JobFactorActions.initHrJobFactorValue(workUuid, jobUuid);
        WorkFactorActions.initHrWorkFactor(workUuid);
    },

    onValueChange: function (i, e) {
        var objList = this.state.factorList;
        objList[i].kpiValue = e.target.value;
        this.setState({
            modal: this.state.modal
        });
    },

    render: function () {
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 4 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
        };

        var hints = this.state.hints;
        var loading = (this.state.jobLoading || this.state.workLoading);
        const jobFactorList = this.state.factorList;
        const obj = (<Form layout={layout}>
            {
                jobFactorList.map((item, i) => {
                    return <FormItem {...formItemLayout} label={item.kpiName} required={false} colon={true} className={layoutItem} help={hints.jobCodeHint} validateStatus={hints.jobCodeStatus}>
                        <Input type="text" name={item.uuid} id={item.uuid} value={this.state.factorList[i].kpiValue} onChange={this.onValueChange.bind(this, i)} />
                    </FormItem>
                })
            }
        </Form>);

        return (
            <Modal visible={this.state.modal} width='540px' title="岗位指标维护" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['hr-work-factor/retrieve', 'hr-job-factor-value/retrieve1', 'hr-job-factor-value/create']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.jobLoading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                {loading ? <Spin>{obj}</Spin> : obj}
            </Modal>
        );
    }
});

export default JobFactorPage;