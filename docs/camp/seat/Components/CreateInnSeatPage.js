import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');
import DictSelect from '../../../lib/Components/DictSelect';

var InnSeatStore = require('../data/InnSeatStore.js');
var InnSeatActions = require('../action/InnSeatActions');

var CreateInnSeatPage = React.createClass({
    getInitialState: function () {
        return {
            seatSet: {},
            loading: false,
            modal: false,
            seat: {},
            hints: {},
            validRules: []
        }
    },
    mixins: [Reflux.listenTo(InnSeatStore, "onServiceComplete"), ModalForm('seat')],
    onServiceComplete: function (data) {
        if (this.state.modal && data.operation === 'create') {
            if (data.errMsg === '') {
                // 成功
                this.setState({
                    modal: false
                });
            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    seatSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'seatCode', desc: '工位编号', required: true, max: 256 },
            { id: 'seatType', desc: '工位类型', required: true, max: 32 },
            { id: 'rowSpan', desc: '行数', required: true, dataType: 'int', max: 3 },
            { id: 'colSpan', desc: '列数', required: true, dataType: 'int', max: 3 },
            { id: 'seatDesc', desc: '工位说明', max: 256 }
        ];
    },

    clear: function (roomUuid, rowIndex, colIndex) {
        this.state.hints = {};
        this.state.seat.roomUuid = roomUuid;
        this.state.seat.seatCode = '';
        this.state.seat.seatDesc = '';
        this.state.seat.seatType = '1';
        this.state.seat.rowIndex = rowIndex;
        this.state.seat.colIndex = colIndex;
        this.state.seat.rowSpan = '1';
        this.state.seat.colSpan = '1';

        this.state.loading = false;
        this.state.seatSet.operation = '';
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onClickSave: function () {
        if (Validator.formValidator(this, this.state.seat)) {
            this.state.seatSet.operation = '';
            this.setState({ loading: true });
            InnSeatActions.createHrSeat(this.state.seat);
        }
    },

    render: function () {
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 4 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
        };

        var hints = this.state.hints;
        return (
            <Modal visible={this.state.modal} width='540px' title="增加工位" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['hr-seat/create']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <Form layout={layout}>
                    <FormItem {...formItemLayout} label="工位编号" colon={true} className={layoutItem} help={hints.seatCodeHint} validateStatus={hints.seatCodeStatus}>
                        <Input type="text" name="seatCode" id="seatCode" value={this.state.seat.seatCode} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="工位类型" colon={true} className={layoutItem}>
                        <Input type="text" name="seatType2" id="seatType2" value='工位' readOnly={true} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="坐标" colon={true} className={layoutItem} help={hints.seatPosHint} validateStatus={hints.seatPosStatus}>
                        <Input type="text" name="seatPos" id="seatPos" value={this.state.seat.seatPos} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="位置" colon={true} className={layoutItem}>
                        <Col span="8">
                            <FormItem help={hints.rowIndexHint} validateStatus={hints.rowIndexStatus}>
                                <InputGroup compact>
                                    <Input style={{ width: '35%', textAlign: 'center' }} defaultValue="行" readOnly={true} />
                                    <Input style={{ width: '65%', textAlign: 'center' }} type="text" name="rowIndex" id="rowIndex" value={this.state.seat.rowIndex} onChange={this.handleOnChange} />
                                </InputGroup>
                            </FormItem>
                        </Col>
                        <Col span="3">
                        </Col>
                        <Col span="8">
                            <FormItem help={hints.colIndexHint} validateStatus={hints.colIndexStatus}>
                                <InputGroup compact>
                                    <Input style={{ width: '35%', textAlign: 'center' }} defaultValue="列" readOnly={true} />
                                    <Input style={{ width: '65%', textAlign: 'center' }} type="text" name="colIndex" id="colIndex" value={this.state.seat.colIndex} onChange={this.handleOnChange} />
                                </InputGroup>
                            </FormItem>
                        </Col>
                    </FormItem>
                    <FormItem {...formItemLayout} label="大小" colon={true} className={layoutItem}>
                        <Col span="8">
                            <FormItem help={hints.rowSpanHint} validateStatus={hints.rowSpanStatus}>
                                <InputGroup compact>
                                    <Input style={{ width: '35%', textAlign: 'center' }} defaultValue="行高" readOnly={true} />
                                    <Input style={{ width: '65%', textAlign: 'center' }} type="text" name="rowSpan" id="rowSpan" value={this.state.seat.rowSpan} onChange={this.handleOnChange} />
                                </InputGroup>
                            </FormItem>
                        </Col>
                        <Col span="3">
                        </Col>
                        <Col span="8">
                            <FormItem help={hints.colSpanHint} validateStatus={hints.colSpanStatus}>
                                <InputGroup compact>
                                    <Input style={{ width: '35%', textAlign: 'center' }} defaultValue="列宽" readOnly={true} />
                                    <Input style={{ width: '65%', textAlign: 'center' }} type="text" name="colSpan" id="colSpan" value={this.state.seat.colSpan} onChange={this.handleOnChange} />
                                </InputGroup>
                            </FormItem>
                        </Col>
                    </FormItem>
                    <FormItem {...formItemLayout} label="工位说明" colon={true} className={layoutItem} help={hints.seatDescHint} validateStatus={hints.seatDescStatus}>
                        <Input type="textarea" name="seatDesc" id="seatDesc" value={this.state.seat.seatDesc} onChange={this.handleOnChange} style={{ height: '80px' }} />
                    </FormItem>
                </Form>
            </Modal>
        );
    }
});

export default CreateInnSeatPage;
