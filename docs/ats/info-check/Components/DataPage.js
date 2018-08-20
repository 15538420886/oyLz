'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Button, Table, Select, Icon, Modal, Input, Row, Col, DatePicker } from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
const Search = Input.Search;
const FormItem = Form.Item;
import ModalForm from '../../../lib/Components/ModalForm';

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var DataPage = React.createClass({
    getInitialState: function () {
        return {
            dataField: '',
            hints: {},
            validRules: [],
            title: '',
            accbody: ''
        }
    },

    mixins: [ModalForm('dataField')],

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'idType', desc: '证件类型', required: true, max: 64, },
            { id: 'idCode', desc: '证件号码', required: true, max: 64, },

            { id: 'eduDegree', desc: '最高学历', max: 64, },
            { id: 'diplomaId', desc: '证件编号', max: 64, },
            { id: 'eduCollege', desc: '学校', max: 64, },
            { id: 'profession', desc: '专业', max: 64, },

            { id: 'gradDate', desc: '毕业时间', max: 64, },

            { id: 'certName', desc: '名称', max: 64, },
            { id: 'certRank', desc: '等级', max: 64, },
            { id: 'agency', desc: '发行机构', max: 64, },
            { id: 'issueDate', desc: '发行日期', max: 64, },

            { id: 'devName', desc: '电脑型号', max: 64, },
            { id: 'devPrice', desc: '采购金额', max: 64, },
            { id: 'devDate', desc: '采购日期', max: 64, },
            { id: 'pcMac', desc: '无线MAC', max: 64, },
            { id: 'pcBtl', desc: 'PC蓝牙', max: 64, },
            { id: 'phoneMac', desc: '手机MAC', max: 64, },
            { id: 'phoneBtl', desc: '手机蓝牙', max: 64, },

            { id: 'cityName', desc: '户口城市', max: 64, },

            { id: 'cardNo', desc: '卡号', max: 64, },
            { id: 'bankName', desc: '发卡行', max: 64, },

            { id: 'corpName', desc: '前公司', max: 64, },
            { id: 'deptName', desc: '部门', max: 64, },
            { id: 'title', desc: '职位', max: 64, },
        ];
        this.initPage(this.props.record);
    },
    initPage: function (record) {
        this.setState({
            dataField: record.accBody,
            title: record.title,
        });

    },

    render: function () {
        var hints = this.state.hints;
        var dataField = this.state.dataField;
        if (typeof (this.state.dataField) === 'string') {
            this.state.dataField = this.state.dataField != '' && this.state.dataField != undefined && this.state.dataField != null ? eval('(' + dataField + ')') : '';
        }

        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout2 = {
            labelCol: ((layout == 'vertical') ? null : { span: 5 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 19 }),
        };
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 6 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 18 }),
        };

        var formPage = null;
        if (this.state.title == "证件-反面") {
            formPage = <Form layout={layout} style={{ paddingTop: '18px', paddingLeft: '1px' }} >
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} className={layoutItem} label='证件类型' required={false} colon={true} help={hints.idTypeHint} validateStatus={hints.idTypeStatus} >
                            <Input type='text' name='idType' id='idType' value={this.state.dataField.idType} onChange={this.handleOnChange} readOnly={true} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} className={layoutItem} label='证件号码' required={false} colon={true} help={hints.idCodeHint} validateStatus={hints.idCodeStatus}>
                            <Input type='text' name='idCode' id='idCode' value={this.state.dataField.idCode} onChange={this.handleOnChange} readOnly={true} />
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        } else if (this.state.title == "户口本-本人") {
            formPage = <Form layout={layout} style={{ paddingTop: '18px', paddingLeft: '1px' }} >
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} className={layoutItem} label='户口城市' required={false} colon={true} help={hints.cityNameHint} validateStatus={hints.cityNameStatus} >
                            <Input type='text' name='cityName' id='cityName' value={this.state.dataField.cityName} onChange={this.handleOnChange} readOnly={true} />
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        } else if (this.state.title == "毕业证") {
            formPage = <Form layout={layout} style={{ paddingTop: '18px', paddingLeft: '1px' }} >
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} className={layoutItem} label='证件编号' required={false} colon={true} help={hints.eduDegreeHint} validateStatus={hints.eduDegreeStatus} >
                            <Input type='text' name='eduDegree' id='eduDegree' value={this.state.dataField.eduDegree} onChange={this.handleOnChange} readOnly={true} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} className={layoutItem} label='证件编号' required={false} colon={true} help={hints.diplomaIdHint} validateStatus={hints.diplomaIdStatus} >
                            <Input type='text' name='diplomaId' id='diplomaId' value={this.state.dataField.diplomaId} onChange={this.handleOnChange} readOnly={true} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} className={layoutItem} label='学校' required={false} colon={true} help={hints.eduCollegeHint} validateStatus={hints.eduCollegeStatus} >
                            <Input type='text' name='eduCollege' id='eduCollege' value={this.state.dataField.eduCollege} onChange={this.handleOnChange} readOnly={true} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} className={layoutItem} label='专业' required={false} colon={true} help={hints.professionHint} validateStatus={hints.professionStatus}>
                            <Input type='text' name='profession' id='profession' value={this.state.dataField.profession} onChange={this.handleOnChange} readOnly={true} />
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        } else if (this.state.title == "学位证") {
            formPage = <Form layout={layout} style={{ paddingTop: '18px', paddingLeft: '1px' }} >
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} className={layoutItem} label='最高学位' required={false} colon={true} help={hints.eduDegreeHint} validateStatus={hints.eduDegreeStatus} >
                            <Input type='text' name='eduDegree' id='eduDegree' value={this.state.dataField.eduDegree} onChange={this.handleOnChange} readOnly={true} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} className={layoutItem} label='证件编号' required={false} colon={true} help={hints.diplomaIdHint} validateStatus={hints.diplomaIdStatus}>
                            <Input type='text' name='diplomaId' id='diplomaId' value={this.state.dataField.diplomaId} onChange={this.handleOnChange} readOnly={true} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} className={layoutItem} label='毕业时间' required={false} colon={true} help={hints.gradDateHint} validateStatus={hints.gradDateStatus}>
                            <Input type="text" name="gradDate" id="gradDate"  value={Common.formatDate(this.state.dataField.gradDate, Common.dateFormat) } readOnly={true} />
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        }else if (this.state.title == "工资卡") {
            formPage = <Form layout={layout} style={{ paddingTop: '18px', paddingLeft: '1px' }} >
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} className={layoutItem} label='卡号' required={false} colon={true} help={hints.cardNoHint} validateStatus={hints.cardNoStatus} >
                            <Input type='text' name='cardNo' id='cardNo' value={this.state.dataField.cardNo} onChange={this.handleOnChange} readOnly={true} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} className={layoutItem} label='发卡行' required={false} colon={true} help={hints.bankNameHint} validateStatus={hints.bankNameStatus} >
                            <Input type='text' name='bankName' id='bankName' value={this.state.dataField.bankName} onChange={this.handleOnChange} readOnly={true} />
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        } else if (this.state.title == "离职证明") {
            formPage = <Form layout={layout} style={{ paddingTop: '18px', paddingLeft: '1px' }} >
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} className={layoutItem} label='前公司' required={false} colon={true} help={hints.corpNameHint} validateStatus={hints.corpNameStatus} >
                            <Input type='text' name='corpName' id='corpName' value={this.state.dataField.corpName} onChange={this.handleOnChange} readOnly={true} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} className={layoutItem} label='部门' required={false} colon={true} help={hints.deptNameHint} validateStatus={hints.deptNameStatus} >
                            <Input type='text' name='deptName' id='deptName' value={this.state.dataField.deptName} onChange={this.handleOnChange} readOnly={true} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} className={layoutItem} label='职位' required={false} colon={true} help={hints.titleHint} validateStatus={hints.titleStatus} >
                            <Input type='text' name='title' id='title' value={this.state.dataField.title} onChange={this.handleOnChange} readOnly={true} />
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        } else if (this.state.title == "设备信息") {
            formPage = <Form layout={layout} >
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} className={layoutItem} label='电脑型号' required={false} colon={true} help={hints.devNameHint} validateStatus={hints.devNameStatus} >
                            <Input type='text' name='devName' id='devName' value={this.state.dataField.devName} onChange={this.handleOnChange} readOnly={true} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} className={layoutItem} label='采购金额' required={false} colon={true} help={hints.devPriceHint} validateStatus={hints.devPriceStatus}>
                            <Input type='text' name='devPrice' id='devPrice' value={this.state.dataField.devPrice} onChange={this.handleOnChange} readOnly={true} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} className={layoutItem} label='采购日期' required={false} colon={true} help={hints.devDateHint} validateStatus={hints.devDateStatus}>
                            <Input type="text" name="devDate" id="devDate"  value={Common.formatDate(this.state.dataField.devDate, Common.dateFormat) } readOnly={true} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} className={layoutItem} label='无线MAC' required={false} colon={true} help={hints.pcMacHint} validateStatus={hints.pcMacStatus} >
                            <Input type='text' name='pcMac' id='pcMac' value={this.state.dataField.pcMac} onChange={this.handleOnChange} readOnly={true} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} className={layoutItem} label='PC蓝牙' required={false} colon={true} help={hints.pcBtlHint} validateStatus={hints.pcBtlStatus}>
                            <Input type='text' name='pcBtl' id='pcBtl' value={this.state.dataField.pcBtl} onChange={this.handleOnChange} readOnly={true} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} className={layoutItem} label='手机蓝牙' required={false} colon={true} help={hints.phoneBtlHint} validateStatus={hints.phoneBtlStatus}>
                            <Input type='text' name='phoneBtl' id='phoneBtl' value={this.state.dataField.phoneBtl} onChange={this.handleOnChange} readOnly={true} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} className={layoutItem} label='手机MAC' required={false} colon={true} help={hints.phoneMacHint} validateStatus={hints.phoneMacStatus} >
                            <Input type='text' name='phoneMac' id='phoneMac' value={this.state.dataField.phoneMac} onChange={this.handleOnChange} readOnly={true} />
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        } else if (this.state.title !== "" && this.state.title !== undefined && this.state.title !== null) {
                if( (this.state.title).indexOf("职业证书") > -1 || (this.state.title).indexOf("语言证书") > -1 ){
                formPage = <Form layout={layout} style={{ paddingTop: '18px', paddingLeft: '1px' }} >
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label='名称' required={false} colon={true} help={hints.certNameHint} validateStatus={hints.certNameStatus} >
                                <Input type='text' name='certName' id='certName' value={this.state.dataField.certName} onChange={this.handleOnChange} readOnly={true} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout} className={layoutItem} label='等级' required={false} colon={true} help={hints.certRankHint} validateStatus={hints.certRankStatus}>
                                <Input type='text' name='certRank' id='certRank' value={this.state.dataField.certRank} onChange={this.handleOnChange} readOnly={true} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label='发行机构' required={false} colon={true} help={hints.agencyHint} validateStatus={hints.agencyStatus}>
                                <Input type='text' name='agency' id='agency' value={this.state.dataField.agency} onChange={this.handleOnChange} readOnly={true} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout} className={layoutItem} label='发行日期' required={false} colon={true} help={hints.issueDateHint} validateStatus={hints.issueDateStatus} >
                                <Input type="text" name="issueDate" id="issueDate"  value={Common.formatDate(this.state.dataField.issueDate, Common.dateFormat) } readOnly={true} />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            };
       } 
        return (
            <div className='grid-page' style={{ padding: '38px 0 0 0' }}>
                {formPage}
            </div>
        );
    }
});

module.exports = DataPage;
