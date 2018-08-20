import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var ProjContext = require('../../../ProjContext');
import { Form, Modal, Button, Input, Select, Row, Col, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var ProjLevelFilter = React.createClass({
	getInitialState : function(){
		return {
            modal: this.props.moreFilter,
			hints: {},
			validRules: [],
			projLevel: {
                perName:'',
                staffCode:'',
                proLevel:'',
                beginMonth:'',
			},
		}
	},

    mixins: [ModalForm('projLevel')],
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'staffCode', desc:'员工编号', required: false, max: '64'},
            {id: 'perName', desc:'姓名', required: false, max: '32'},
            {id: 'proLevel', desc:'定级', required: false, max: '24'},
            {id: 'beginMonth', desc:'调整月份', required: false, max: '16'},
		];
	},
     componentWillReceiveProps:function(newProps){
         this.setState({
            modal: newProps.moreFilter,
        });
     },
	render : function() {
	   if( !this.state.modal ){
			return null;
		}

        var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};
        var hints=this.state.hints;
	    return (
			<div style={{width:'100%', height:'104px', padding:'20px 18px 0px 24px'}}>
				<div style={{width:'100%', maxWidth: '900px', height:'100%', float: 'right'}}>
					<Form layout={layout} style={{width:'100%'}}>
                        <Row>
                            <Col span="8"></Col>
                            <Col span="8">
                                <FormItem {...formItemLayout} label="姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                                    <Input type="text" name="perName" id="perName" value={this.state.projLevel.perName } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem {...formItemLayout} label="员工号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
                                    <Input type="text" name="staffCode" id="staffCode" value={this.state.projLevel.staffCode } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
						</Row>
                        <Col span="8"></Col>
						<Col span="8">
                            <FormItem {...formItemLayout} label="定级" required={false} colon={true} className={layoutItem} help={hints.proLevelHint} validateStatus={hints.proLevelStatus}>
                                <Input type="text" name="proLevel" id="proLevel" value={this.state.projLevel.proLevel } onChange={this.handleOnChange} />
                            </FormItem>
						</Col>
						<Col span="8">
                            <FormItem {...formItemLayout} label="调整月份" required={false} colon={true} className={layoutItem} help={hints.beginMonthHint} validateStatus={hints.beginMonthStatus}>
                                <DatePicker style={{width:'100%'}} name="beginMonth" id="beginMonth"  value={this.formatDate(this.state.projLevel.beginMonth, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"beginMonth", Common.dateFormat)}/>
                            </FormItem>
						</Col>
					</Form>
				</div>
			</div>
		);
	}
});

module.exports = ProjLevelFilter;
