import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Button, Input,DatePicker, Col, Row} from 'antd';
import DictSelect from '../../../lib/Components/DictSelect';
import InsurSelect from '../../lib/Components/InsurSelect';
import TripSelect from '../../lib/Components/TripSelect';
import AllowSelect from '../../lib/Components/AllowSelect';
const FormItem = Form.Item;

var BenefitsStore = require('../data/BenefitsStore');
var BenefitsActions = require('../action/BenefitsActions');

var DetFromPage = React.createClass({
	getInitialState : function() {
		return{
			benefits: {},
		};
	},
	
	// 第一次加载
	componentDidMount : function(){
		
	},	
	initPage: function(benefits)
	{
		this.setState({benefits: benefits});
	},

	render : function() {
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};
	 
		return (
			<div style={{width:'800px'}}>
			   	<Form layout={layout}>
					<Row>	
					  <Col span="8">			
						<FormItem {...formItemLayout2} label="工资卡银行" required={false} colon={true} className={layoutItem} >
							<Input type="text" name="salaryBank" id="salaryBank" value={this.state.benefits.salaryBank }  />
						</FormItem>
					  </Col>
					  <Col span="8">
						<FormItem {...formItemLayout2} label="工资卡" required={false} colon={true} className={layoutItem} >
							<Input type="text" name="salaryCard" id="salaryCard" value={this.state.benefits.salaryCard }  />
						</FormItem>
					  </Col>
					</Row>
					<Row>	
					  <Col span="8">
						<FormItem {...formItemLayout2} label="报销卡银行" required={false} colon={true} className={layoutItem} >
							<Input type="text" name="reimBank" id="reimBank" value={this.state.benefits.reimBank } />
						</FormItem>
					  </Col>
					  <Col span="8">
						<FormItem {...formItemLayout2} label="报销卡" required={false} colon={true} className={layoutItem} >
							<Input type="text" name="reimCard" id="reimCard" value={this.state.benefits.reimCard }  />
						</FormItem>
					  </Col>
					</Row>
					<Row>	
					  <Col span="8">	
						<FormItem {...formItemLayout2} label="基本工资" required={false} colon={true} className={layoutItem} >
							<Input type="text" name="salary" id="salary" value={this.state.benefits.salary } />
						</FormItem>
					  </Col>
					  <Col span="8">
						<FormItem {...formItemLayout2} label="绩效工资" required={false} colon={true} className={layoutItem} >
							<Input type="text" name="salary2" id="salary2" value={this.state.benefits.salary2 }  />
						</FormItem>
					  </Col>
					</Row>
					<Row>	
					  <Col span="8">
						<FormItem {...formItemLayout2} label="岗位津贴" required={false} colon={true} className={layoutItem} >
							<Input type="text" name="salary3" id="salary3" value={this.state.benefits.salary3 }  />
						</FormItem>
					  </Col>
					  <Col span="8">
						<FormItem {...formItemLayout2} label="项目经费" required={false} colon={true} className={layoutItem} >
							<Input type="text" name="salary7" id="salary7" value={this.state.benefits.salary7 }  />
						</FormItem>
					  </Col>
					</Row>
					<Row>	
					  <Col span="8">
						<FormItem {...formItemLayout2} label="加班补偿基数" required={false} colon={true} className={layoutItem}>
							<Input type="text" name="salary6" id="salary6" value={this.state.benefits.salary6 }  />
						</FormItem>
				      </Col>
					  <Col span="8">
						<FormItem {...formItemLayout2} label="笔记本补贴" required={false} colon={true} className={layoutItem} >
							<Input type="text" name="devAllow" id="devAllow" value={this.state.benefits.devAllow }  />
						</FormItem>
					  </Col>
					</Row>
					<Row>	
					  <Col span="8">
						<FormItem {...formItemLayout2} label="社保基数" required={false} colon={true} className={layoutItem} >
							<Input type="text" name="insuBase" id="insuBase" value={this.state.benefits.insuBase } />
						</FormItem>
					  </Col>
					  <Col span="8">
						<FormItem {...formItemLayout2} label="公积金基数" required={false} colon={true} className={layoutItem} >
							<Input type="text" name="cpfBase" id="cpfBase" value={this.state.benefits.cpfBase }  />
						</FormItem>
					  </Col>
					</Row>
					<Row>	
					  <Col span="8">	
						<FormItem {...formItemLayout2} label="社保类型" required={false} colon={true} className={layoutItem} >
							<InsurSelect ref="insuName" name="insuName" id="insuName" value={this.state.benefits.insuName}  />
						</FormItem>
					  </Col>
					  <Col span="8">
						<FormItem {...formItemLayout2} label="补贴类型" required={false} colon={true} className={layoutItem} >	
							<AllowSelect ref="allowName" name="allowName" id="allowName" value={this.state.benefits.allowName}  />
						</FormItem>
					  </Col>
					</Row>
					<Row>	
					  <Col span="8">
						<FormItem {...formItemLayout2} label="差旅级别" required={false} colon={true} className={layoutItem}>
							<TripSelect name="tripName" id="tripName" value={this.state.benefits.tripName} />
						</FormItem>
					  </Col>
					</Row>	
					<Row>	
					  <Col span="8">
						<FormItem {...formItemLayout2} label="审批人" required={false} colon={true} className={layoutItem}>
							<Input type="text" name="approver" id="approver" value={this.state.benefits.approver }  />
						</FormItem>
					  </Col>
					  <Col span="8">
					  	<FormItem {...formItemLayout2} label="生效日期" required={false} colon={true} className={layoutItem}>
								<Input type="text" name="effectDate" id="effectDate" value={this.state.benefits.effectDate }/>
						</FormItem>
					  </Col>	
					</Row>
				</Form>
			</div>
		);
	}
});

export default DetFromPage;

