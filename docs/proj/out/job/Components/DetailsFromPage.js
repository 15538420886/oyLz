import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';

var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import ModalForm from '../../../../lib/Components/ModalForm';

import { Form, Modal, Button, Input, Select, Row, Col,DatePicker} from 'antd';
import DictSelect from '../../../../lib/Components/DictSelect';
const FormItem = Form.Item;

var DetailsFromPage = React.createClass({
	getInitialState : function() {
		return{
			job: {}
		};
	},
	mixins: [ModalForm('')],
	// 第一次加载
	componentDidMount : function(){
	},
	initPage: function(job)
	{
		this.setState({job: job});
	},

	render : function() {
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};
        const formItemLayout1 = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};
		return (
			<div style={{width:'600px'}}>
                <Form layout={layout}>
                    <FormItem {...formItemLayout1} label="调整原因" required={false} colon={true} className={layoutItem} >
                        <Input type="textarea" name="chgReason" id="chgReason" value={this.state.job.chgReason } style={{height: '100px'}}/>
                    </FormItem>	
					<Row>	
						<Col span="12">			
							<FormItem {...formItemLayout} label="审批人" required={false} colon={true} className={layoutItem}>
								<Input type="text" name="approver" id="approver" value={this.state.job.approver } />
							</FormItem>
						</Col>
				    	<Col span="12">	
							<FormItem {...formItemLayout} label="生效日期" required={false} colon={true} className={layoutItem} >
								<DatePicker  style={{width:'100%'}} name="effectDate" id="effectDate"  value={this.formatDate(this.state.job.effectDate, Common.dateFormat)}  format={Common.dateFormat} />
							</FormItem>
						</Col>	
					</Row>
                </Form>
			</div>
		);
	}
});

export default DetailsFromPage;
