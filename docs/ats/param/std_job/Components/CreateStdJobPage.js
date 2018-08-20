import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Button, Input, Select, Tabs, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const InputGroup = Input.Group;

import DictSelect from '../../../../lib/Components/DictSelect';
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

var StdJobStore = require('../data/StdJobStore');
var StdJobActions = require('../action/StdJobActions');

var CreateStdJobPage = React.createClass({
    getInitialState: function () {
        return {
            stdJobSet: {},
            loading: false,
            stdJob: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(StdJobStore, "onServiceComplete"), ModalForm('stdJob')],
    onServiceComplete: function (data) {
        if (data.operation === 'create') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.goBack();
            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    stdJobSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'jobCode', desc: '岗位代码', required: true, max: 64, },
            { id: 'category', desc: '岗位类别', required: true, max: 64, },
            { id: 'jobLevel', desc: '岗位级别', required: true, max: 64, },
            { id: 'jobDesc', desc: '岗位说明', required: false, max: 512, },
            { id: 'eduDegree', desc: '最低学历', required: false, max: 64, },
            { id: 'induYears', desc: '工作经验', required: false, max: 24, },
            { id: 'jobRequire', desc: '岗位要求', required: false, max: 512, },
        ];
        this.clear();
    },

    clear: function (filter) {
        this.state.hints = {};
        this.state.stdJob.uuid = '';
        this.state.stdJob.corpUuid = window.loginData.compUser.corpUuid;
        this.state.stdJob.jobCode = '';
        this.state.stdJob.category = '';
        this.state.stdJob.jobDesc = '';
        this.state.stdJob.jobLevel = '';
        this.state.stdJob.eduDegree = '本科';
        this.state.stdJob.induYears = '';
        this.state.stdJob.jobRequire = '';

        this.state.loading = false;
        if (typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onClickSave: function () {
        if (Common.formValidator(this, this.state.stdJob)) {
            this.setState({ loading: true });
            var otherJob = [];
            this.state.stdJob.other = otherJob;
            StdJobActions.createStdJob(this.state.stdJob);
        }
    },

    goBack: function () {
        this.props.onBack();
    },

    onTabChange: function (activeKey) {
        if (activeKey === '1') {
            this.props.onBack();
        }
    },

    render: function () {
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 4 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
        };
        const formItemLayout2 = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };

        var hints = this.state.hints;
        return (
            <div style={{ overflow: 'hidden', height: '100%', paddingLeft: '4px' }}>
                <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                    <TabPane tab="返回" key="1" style={{ width: '100%', height: '100%' }}>
                    </TabPane>
                    <TabPane tab="增加标准岗位" key="2" style={{ width: '100%', height: '100%' }}>
                        <div style={{ padding: "24px 0 16px 8px", height: '100%', overflowY: 'auto' }}>
                            <ServiceMsg ref='mxgBox' svcList={['stdJob/create']} />
                            <Form layout={layout} style={{ width: '600px' }}>
                                <Row>
                                    <Col span='12'>
                                        <FormItem {...formItemLayout2} className={layoutItem} label='岗位代码' required={true} colon={true} help={hints.jobCodeHint} validateStatus={hints.jobCodeStatus}>
                                            <Input type='text' name='jobCode' id='jobCode' value={this.state.stdJob.jobCode} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span='12'>
                                        <FormItem {...formItemLayout2} className={layoutItem} label='岗位类别' required={true} colon={true} help={hints.categoryHint} validateStatus={hints.categoryStatus}>
                                            <DictSelect name='category' id='category' appName='招聘管理' optName='岗位类别' value={this.state.stdJob.category} onSelect={this.handleOnSelected.bind(this, 'category')} />
                                        </FormItem>
                                    </Col>

                                    <Col span='12'>
                                        <FormItem {...formItemLayout2} className={layoutItem} label='岗位级别' required={true} colon={true} help={hints.jobLevelHint} validateStatus={hints.jobLevelStatus}>
                                            <DictSelect name='jobLevel' id='jobLevel' appName='招聘管理' optName='岗位级别' value={this.state.stdJob.jobLevel} onSelect={this.handleOnSelected.bind(this, 'jobLevel')} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span='12'>
                                        <FormItem {...formItemLayout2} className={layoutItem} label='最低学历' required={false} colon={true} help={hints.eduDegreeHint} validateStatus={hints.eduDegreeStatus}>
                                            <DictSelect name='eduDegree' id='eduDegree' appName='简历系统' optName='教育背景' value={this.state.stdJob.eduDegree} onSelect={this.handleOnSelected.bind(this, 'eduDegree')} />
                                        </FormItem>
                                    </Col>
                                    <Col span='12'>
                                        <FormItem {...formItemLayout2} className={layoutItem} label='工作经验' required={false} colon={true} addonAfter="年" help={hints.induYearsHint} validateStatus={hints.induYearsStatus}>
                                            <InputGroup compact>
                                                <Input type='text' style={{ width: '80%' }} name='induYears' id='induYears' value={this.state.stdJob.induYears} onChange={this.handleOnChange} />
                                                <Input style={{ width: '20%', textAlign: 'center' }} defaultValue="年" readOnly={true} />
                                            </InputGroup>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <FormItem {...formItemLayout} className={layoutItem} label='岗位说明' required={false} colon={false} help={hints.jobDescHint} validateStatus={hints.jobDescStatus}>
                                    <Input type='textarea' name='jobDesc' id='jobDesc' value={this.state.stdJob.jobDesc} onChange={this.handleOnChange} style={{ height: '130px' }} />
                                </FormItem>
                                <FormItem {...formItemLayout} className={layoutItem} label='岗位要求' required={false} colon={true} help={hints.jobRequireHint} validateStatus={hints.jobRequireStatus}>
                                    <Input type='textarea' name='jobRequire' id='jobRequire' value={this.state.stdJob.jobRequire} onChange={this.handleOnChange} style={{ height: '160px' }} />
                                </FormItem>
                                <FormItem style={{ textAlign: 'right', margin: '4px 0' }} className={layoutItem}>
                                    <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                                    <Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
                                </FormItem>
                            </Form>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
});

export default CreateStdJobPage;