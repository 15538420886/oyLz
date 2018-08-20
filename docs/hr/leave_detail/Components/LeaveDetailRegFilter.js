import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Input, Form, Modal, Col, Row, DatePicker,} from 'antd';
import DictSelect from '../../../lib/Components/DictSelect';
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
var Common = require('../../../public/script/common');
import ModalForm from '../../../lib/Components/ModalForm';
import DeptTreeSelect from '../../lib/Components/DeptTreeSelect';

const propTypes = {
  moreFilter: React.PropTypes.bool,
};

var LeaveDetailRegFilter = React.createClass({
	getInitialState : function(){
		return {
            modal: this.props.moreFilter,
            hints: {},
            validRules: [],

			leaveDetailReg: {
				effectDate1 : '',
				effectDate2 : '',
				baseCity : '',
				leaveType : '',
				staffCode : '',
				perName : '',
    			deptUuid : '',
			},
		}
	},

    mixins: [ModalForm('leaveDetailReg')],
	componentWillReceiveProps:function(newProps){
         this.setState({
            modal: newProps.moreFilter,
        });
     },

    // 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'perName', desc:'姓名', required: false, max: '0'},
            {id: 'staffCode', desc:'编号', required: false, max: '0'},
            {id: 'baseCity', desc:'归属地', required: false, max: '0'},
            {id: 'leaveType', desc:'假期类型', required: false, max: '0'},
            {id: 'deptUuid', desc:'部门uuid', required: false, max: '0'},
            {id: 'effectDate1', desc:'生效日期1', required: false, max: '0'},
            {id: 'effectDate2', desc:'生效日期2', required: false, max: '0'},
		];
	},

	render : function() {
		if( !this.state.modal ){
			return null;
		}

        var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 3}),
			wrapperCol: ((layout=='vertical') ? null : {span: 21}),
		};
		const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 6}),
			wrapperCol: ((layout=='vertical') ? null : {span: 18}),
		};

        var hints=this.state.hints;
	    return (
			<div style={{width:'100%', height:'104px', padding:'0px 18px 0px 24px'}}>
				<div style={{width:'100%', maxWidth: '900px', height:'100%', float: 'right'}}>
					<Form layout={layout} style={{width:'900px',padding:'20px 0px'}}>
                        <Row  gutter={18}>
                            <Col className="gutter-row" span={7}>
                                <FormItem {...formItemLayout2} label="姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                                    <Input type="text" name="perName" id="perName" value={this.state.leaveDetailReg.perName } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout2} label="员工编号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
                                    <Input type="text" name="staffCode" id="staffCode" value={this.state.leaveDetailReg.staffCode } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={9}>
                                <FormItem {...formItemLayout2} label="归属地" required={false} colon={true} className={layoutItem} help={hints.baseCityHint} validateStatus={hints.baseCityStatus}>
                                    <Input type="text" name="baseCity" id="baseCity" value={this.state.leaveDetailReg.baseCity } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row  gutter={18}>
                            <Col className="gutter-row" span={7}>
                                <FormItem {...formItemLayout2} label="类型" required={false} colon={true} className={layoutItem} help={hints.leaveTypeHint} validateStatus={hints.leaveTypeStatus}>
                                    <DictSelect name="leaveType" id="leaveType" value={this.state.leaveDetailReg.leaveType} appName='HR系统' optName='假期类型' onSelect={this.handleOnSelected.bind(this, "leaveType")}/>
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout2} label="部门" required={false} colon={true} className={layoutItem} help={hints.deptUuidHint} validateStatus={hints.deptUuidStatus}>
                                    <DeptTreeSelect name="deptUuid" id="deptUuid" value={this.state.leaveDetailReg.deptUuid } onSelect={this.handleOnSelected.bind(this, "deptUuid")}  />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={9}>
                                <FormItem {...formItemLayout2} label="休假日期" required={false} colon={true} className={layoutItem}>
                                    <Col span="11">
                                        <FormItem  help={hints.effectDate1Hint} validateStatus={hints.effectDate1Status}>
                                            <DatePicker  style={{width:'100%'}}  name="effectDate1" id="effectDate1" value={this.formatDate(this.state.leaveDetailReg.effectDate1, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"effectDate1", Common.dateFormat)}/>
                                        </FormItem>
                                    </Col>
                                    <Col span="2" style={{textAlign: 'center'}}>
                                        到
                                    </Col>
                                    <Col span="11">
                                        <FormItem  help={hints.effectDate2Hint} validateStatus={hints.effectDate2Status}>
                                            <DatePicker  style={{width:'100%'}}  name="effectDate2" id="effectDate2" value={this.formatDate(this.state.leaveDetailReg.effectDate2, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"effectDate2", Common.dateFormat)}/>
                                        </FormItem>
                                    </Col>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
	    );
	}
});

LeaveDetailRegFilter.propTypes = propTypes;
module.exports = LeaveDetailRegFilter;
