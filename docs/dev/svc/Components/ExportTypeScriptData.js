import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var Common = require('../../../public/script/common');

import { Form, Modal, Button, Input } from 'antd';
const FormItem = Form.Item;

var ExportTypeScriptData = React.createClass({
	getInitialState : function() {
		return {
			typeScriptData:'',
			modal:false
		}
	},
	toggle:function(){
		if(this.props.typescript.length === 0){
			Common.infoMsg('暂无数据');
			return;
		}
		this.setState({
			modal:!this.state.modal
		});
		this.setValue();
	},
	// 第一次加载
	componentDidMount : function(){
	},
	setValue:function(){
        var data = this.props.typescript;
		var len = data.length;
		var typeScriptData = '';
        for (var i = 0; i < len; i++){
            var fieldDesc = data[i].fieldDesc;
            if (fieldDesc) {
                typeScriptData += '\t\t' + data[i].fieldName + ' : string;\t// ' + fieldDesc + '\n'
            }
            else {
                typeScriptData += '\t\t' + data[i].fieldName + ' : string;\n'
            }
        }

		typeScriptData = '\t'+`export class UserInfoData{`+'\n'+typeScriptData+ '\t'+`}`;
		this.setState({
			typeScriptData:typeScriptData
		});
	},
	render : function(){
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			wrapperCol: ((layout=='vertical') ? null : {span: 24}),
		};
		return (
			<Modal visible={this.state.modal} width='540px' title="TypeScript类型数据" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}> 
					<FormItem colon={true}>
						<Input type="textarea" style={{height:"350px"}} value={this.state.typeScriptData}/>
					</FormItem>
				</Form>
			</Modal>
		);
	}
});

export default ExportTypeScriptData;

