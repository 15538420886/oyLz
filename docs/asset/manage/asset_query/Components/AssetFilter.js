import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DictSelect from '../../../../lib/Components/DictSelect';
var Common = require('../../../../public/script/common');

import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var AssetFilter = React.createClass({
	getInitialState : function(){
		return {
            modal: this.props.moreFilter,
			hints: {},
			validRules: [],
			filter: {
				corpUuid:window.loginData.compUser.corpUuid,
                assetCode:'',
                assetName:'',
                assertClazz:'',
                assetCity:'',
                borrowState:'',
                assertState:'',
			},
		}
	},

    mixins: [ModalForm('filter')],
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'assetCode', desc:'资产编号', required: false, max: '128'},
            {id: 'assetName', desc:'资产名称', required: false, max: '128'},
            {id: 'assertClazz', desc:'资产种类:建筑物,电子设备,家具,电器', required: false, max: '64'},
            {id: 'assetCity', desc:'所在城市', required: false, max: '128'},
            {id: 'borrowState', desc:'在库状态(在库，借出)', required: false, max: '16'},
            {id: 'assertState', desc:'状态(正常、转库、报废、丢失、维修、保养、封存、停用)', required: false, max: '16'},		
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
                        <Col span="8">
                            <FormItem {...formItemLayout} label="编号" required={false} colon={true} className={layoutItem} help={hints.assetCodeHint} validateStatus={hints.assetCodeStatus}>
                                <Input type="text" name="assetCode" id="assetCode" value={this.state.filter.assetCode } onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem {...formItemLayout} label="名称" required={false} colon={true} className={layoutItem} help={hints.assetNameHint} validateStatus={hints.assetNameStatus}>
                                <Input type="text" name="assetName" id="assetName" value={this.state.filter.assetName } onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem {...formItemLayout} label="种类" required={false} colon={true} className={layoutItem} help={hints.assertClazzHint} validateStatus={hints.assertClazzStatus}>
                                <DictSelect name="assertClazz" id="assertClazz" value={this.state.filter.assertClazz} appName='固定资产' optName='资产种类1'  onSelect={this.handleOnSelected.bind(this, "assertClazz")}/>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem {...formItemLayout} label="城市" required={false} colon={true} className={layoutItem} help={hints.assetCityHint} validateStatus={hints.assetCityStatus}>
                                <Input type="text" name="assetCity" id="assetCity" value={this.state.filter.assetCity } onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem {...formItemLayout} label="在库" required={false} colon={true} className={layoutItem} help={hints.borrowStateHint} validateStatus={hints.borrowStateStatus}>
                                <DictSelect name="borrowState" id="borrowState" value={this.state.filter.borrowState} appName='固定资产' optName='在库状态' onSelect={this.handleOnSelected.bind(this, "borrowState")}/>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem {...formItemLayout} label="状态" required={false} colon={true} className={layoutItem} help={hints.assertStateHint} validateStatus={hints.assertStateStatus}>
                                <DictSelect name="assertState" id="assertState" value={this.state.filter.assertState} appName='固定资产' optName='状态'  onSelect={this.handleOnSelected.bind(this, "assertState")}/>
                            </FormItem>
                        </Col>
                    </Form>                
                </div>
            </div>

	    );
	}
});
module.exports = AssetFilter;
