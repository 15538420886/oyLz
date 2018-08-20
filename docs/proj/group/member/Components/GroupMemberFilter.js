import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import DictSelect from '../../../../lib/Components/DictSelect';
import ProjContext from '../../../../proj/ProjContext.js'
import { Input, Form, Modal, Col, Row, DatePicker, } from 'antd';
import ProjInfoSelect from '../../../lib/Components/ProjInfoSelect';
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
var Common = require('../../../../public/script/common');
import ModalForm from '../../../../lib/Components/ModalForm';



var GroupMemberFilter = React.createClass({
    getInitialState: function () {
        return {
            modal: this.props.moreFilter,
            hints: {},
            validRules: [],

            GroupMember: {
                staffCode: '',
                perName: '',
                userLevel: '',
                projLevel: '',
                beginMonth: '',
            },
        }
    },

    mixins: [ModalForm('GroupMember')],
    componentWillReceiveProps: function (newProps) {
        this.setState({
            modal: newProps.moreFilter,
        });
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'staffCode', desc: '员工编号', required: false, max: '225' },
            { id: 'perName', desc: '姓名', required: false, max: '64' },
            { id: 'userLevel', desc: '人员级别', required: false, max: '0' },
            { id: 'projLevel', desc: '客户定级', required: false, max: '0' },
        ];
    },
    render: function () {
        if (!this.state.modal) {
            return null;
        }
        var projUuid = ProjContext.selectedGroup.uuid;
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 7 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 17 }),
        };

        console.log(this.state.GroupMember.userLevel)
        var hints = this.state.hints;
        return (
            <div style={{ width: '100%', height: '104px', padding: '0px 18px 0px 24px' }}>
                <div style={{ width: '100%', maxWidth: '1000px', height: '100%', float: 'right' }}>
                    <Form layout={layout} style={{ width: '1000px', padding: '20px 0px' }}>
                        <Row gutter={24}>
                            <Col className="gutter-row" span={6}></Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="项目组" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
                                    <ProjInfoSelect parentUuid={projUuid} value={this.state.GroupMember.projUuid} name='projName' id='projName' placeholder="选择 ( 项目组 )" style={{ textAlign: 'left', width: Common.searchWidth }} onSelect={this.handleOnSelected.bind(this, "projUuid")} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="客户定级" required={false} colon={true} className={layoutItem} help={hints.projLevelHint} validateStatus={hints.projLevelStatus}>
                                    <Input type="text" name="projLevel" id="projLevel" value={this.state.GroupMember.projLevel} onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="人员级别" required={false} colon={true} className={layoutItem} help={hints.userLevelHint} validateStatus={hints.userLevelStatus}>
                                    <DictSelect name="userLevel" id="userLevel" value={this.state.GroupMember.userLevel} appName='项目管理' optName='人员级别' onSelect={this.handleOnSelected.bind(this, "userLevel")} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col className="gutter-row" span={6}></Col>
                            <Col className="gutter-row" span="6">
                                <FormItem {...formItemLayout} label="入组月份" required={false} colon={true} className={layoutItem} help={hints.date1Hint} validateStatus={hints.date1Status}>
                                    <MonthPicker style={{ width: '100%' }} name="beginMonth" id="beginMonth" format={Common.monthFormat} value={this.formatMonth(this.state.GroupMember.beginMonth, Common.monthFormat)} onChange={this.handleOnSelDate.bind(this, "beginMonth", Common.monthFormat)} />

                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="员工号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
                                    <Input type="text" name="staffCode" id="staffCode" value={this.state.GroupMember.staffCode} onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                                    <Input type="text" name="perName" id="perName" value={this.state.GroupMember.perName} onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        );
    }
});

module.exports = GroupMemberFilter;
