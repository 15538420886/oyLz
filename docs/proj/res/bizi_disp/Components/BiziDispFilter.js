import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import DictSelect from '../../../../lib/Components/DictSelect';
import {Input, Form, Modal, Col, Row, DatePicker,} from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
var Common = require('../../../../public/script/common');
import ModalForm from '../../../../lib/Components/ModalForm';

const propTypes = {
  moreFilter: React.PropTypes.bool,
};

var BiziDispFilter = React.createClass({
	getInitialState : function(){
		return {
            modal: this.props.moreFilter,
            hints: {},
            validRules: [],

            biziDisp: {
                projCode: '',
                projName: '',
                beginDate: '',
                beginDate1: '',
                beginDate2: '',
                projType: '',
                projHost: '',
				projLoc : '',
			},
		}
	},

    mixins: [ModalForm('biziDisp')],
	componentWillReceiveProps:function(newProps){
         this.setState({
            modal: newProps.moreFilter,
        });
     },

    // 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'projCode', desc:'项目编号', required: false, max: '64'},
            { id: 'projName', desc: '项目名称', required: false, max: '128'},
            {id: 'projType', desc:'项目类型', required: false, max: '64'},
            {id: 'projHost', desc:'主办方', required: false, max: '256'},
            {id: 'beginDate', desc:'开始日期', required: false, max: '24'},
            {id: 'projLoc', desc:'项目地址', required: false, max: '128'},
		];
	},

	render : function() {
		if( !this.state.modal ){
			return null;
		}

        var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 7}),
			wrapperCol: ((layout=='vertical') ? null : {span: 17}),
		};
		const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 6}),
			wrapperCol: ((layout=='vertical') ? null : {span: 18}),
		};

        var hints=this.state.hints;
	    return (
			<div style={{width:'100%', padding:'16px 18px 20px 24px'}}>
				<div style={{width:'100%', maxWidth: '800px', height:'100%', float: 'right'}}>
					<Form layout={layout}>
                        <Row  gutter={24}>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout2} label="项目名称" required={false} colon={true} className={layoutItem} help={hints.projNameHint} validateStatus={hints.projNameStatus}>
                                    <Input type="text" name="projName" id="projName" value={this.state.biziDisp.projName } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout2} label="项目编号" required={false} colon={true} className={layoutItem} help={hints.projCodeHint} validateStatus={hints.projCodeStatus}>
                                    <Input type="text" name="projCode" id="projCode" value={this.state.biziDisp.projCode } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout2} label="开始月份" required={false} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
                                    <MonthPicker  style={{width:'100%'}}  name="beginDate" id="beginDate"  format={Common.monthFormat} value={this.formatMonth(this.state.biziDisp.beginDate, Common.monthFormat)} onChange={this.handleOnSelDate.bind(this,"beginDate", Common.monthFormat)}/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row  gutter={24}>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout2} label="项目类型" required={false} colon={true} className={layoutItem} help={hints.projTypeHint} validateStatus={hints.projTypeStatus}>
                                    <DictSelect name="projType" id="projType" value={this.state.biziDisp.projType} appName='项目管理' optName='事务项目类型' onSelect={this.handleOnSelected.bind(this, "projType")}/>
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout2} label="主办方" required={false} colon={true} className={layoutItem} help={hints.projHostHint} validateStatus={hints.projHostStatus}>
                                    <Input type="text" name="projHost" id="projHost" value={this.state.biziDisp.projHost } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout2} label="所在城市" required={false} colon={true} className={layoutItem} help={hints.projLocHint} validateStatus={hints.projLocStatus}>
                                    <Input type="text" name="projLoc" id="projLoc" value={this.state.biziDisp.projLoc } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>


                </div>
            </div>
	    );
	}
});

BiziDispFilter.propTypes = propTypes;
module.exports = BiziDispFilter;
