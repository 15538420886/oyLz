import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Button, Input, Select, Tabs, Row, Col , DatePicker} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;


import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DictSelect from '../../../../lib/Components/DictSelect';
import DeptTreeSelect from '../../../../hr/lib/Components/DeptTreeSelect';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

import ArticlesPage from '../../articles/ArticlesPage';
import ParamsPage from '../../params/ParamsPage';

var AssetTypeStore = require('../data/AssetTypeStore.js');
var AssetTypeActions = require('../action/AssetTypeActions');

var UpdateAssetTypePage = React.createClass({
	getInitialState : function() {
		return {
			assetTypeSet: {},
			loading: false,
			assetType: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(AssetTypeStore, "onServiceComplete"), ModalForm('assetType')],
	onServiceComplete: function(data) {
	  if(data.operation === 'update'){
		  if( data.errMsg === ''){
			  // 成功，关闭窗口
			  this.goBack();
		  }
		  else{
			  // 失败
			  this.setState({
				  loading: false,
				  assetTypeSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'typeCode', desc:'类别编号', required: true, max: '36'},
            {id: 'typeName', desc:'类别名称', required: true, max: '128'},
            {id: 'assertClazz', desc:'资产种类', required: false, max: '64'},
            {id: 'measuUnit', desc:'计量单位', required: false, max: '32'},
            {id: 'depreYear', desc:'折旧年限', required: false, max: '12'},
            {id: 'depreType', desc:'折旧方法', required: false, max: '32'},
            {id: 'depreParam', desc:'折旧参数', required: false, max: '512'},
            {id: 'purchDept', desc:'采购部门', required: false, max: '64'},
            {id: 'memo2', desc:'备注', required: false, max: '512'},
		];
		this.initPage( this.props.assetType );
	},

	initPage: function(assetType)
	{
		this.state.hints = {};
		Utils.copyValue(assetType, this.state.assetType);
		
		this.setState({loading: false})
		if( typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

    handleOnSelected2 : function(uuid, target){
        var purchDept = target[0].props.children;
        var obj = this.state.assetType;
        obj.purchDept = purchDept;
        Common.validator(this, obj, 'purchDept');

        this.setState({
            loading: this.state.loading
        });
    },

	onClickSave : function(){
		if(Common.formValidator(this, this.state.assetType)){
			this.setState({loading: true});
			AssetTypeActions.updateAssetType( this.state.assetType , this.props.assertClazz);
		}
	},

	goBack:function(){
        this.props.onBack();
    },

    onTabChange:function(activeKey){
        if(activeKey === '1'){
            this.props.onBack();
        }
    },

	render : function() {
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};
		const formItemLayout2 = {
			labelCol: ((layout == 'vertical') ? null : { span: 8 }),
			wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
		};
		
		var hints=this.state.hints;
		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
					</TabPane>
					<TabPane tab="修改资产类别" key="2" style={{width: '100%', height: '100%'}}>
						<div style={{padding:"8px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
                            <ServiceMsg ref='mxgBox' svcList={['asset-type/create']}/>
                            <Form layout={layout} style={{width:'600px'}}>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="编号" required={true} colon={true} className={layoutItem} help={hints.typeCodeHint} validateStatus={hints.typeCodeStatus}>
                                            <Input type="text" name="typeCode" id="typeCode" value={this.state.assetType.typeCode } onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="名称" required={true} colon={true} className={layoutItem} help={hints.typeNameHint} validateStatus={hints.typeNameStatus}>
                                            <Input type="text" name="typeName" id="typeName" value={this.state.assetType.typeName } onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="资产种类" required={false} colon={true} className={layoutItem} help={hints.assertClazzHint} validateStatus={hints.assertClazzStatus}>
                                            <DictSelect name="assertClazz" id="assertClazz" value={this.state.assetType.assertClazz} appName='固定资产' optName='资产种类' onSelect={this.handleOnSelected.bind(this, "assertClazz")}/>
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="计量单位" required={false} colon={true} className={layoutItem} help={hints.measuUnitHint} validateStatus={hints.measuUnitStatus}>
                                            <Input type="text" name="measuUnit" id="measuUnit" value={this.state.assetType.measuUnit } onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="折旧年限" required={false} colon={true} className={layoutItem} help={hints.depreYearHint} validateStatus={hints.depreYearStatus}>
                                            <Input type="text" name="depreYear" id="depreYear" value={this.state.assetType.depreYear } onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="折旧方法" required={false} colon={true} className={layoutItem} help={hints.depreTypeHint} validateStatus={hints.depreTypeStatus}>
                                            <DictSelect name="depreType" id="depreType" value={this.state.assetType.depreType} appName='固定资产' optName='折旧方法' onSelect={this.handleOnSelected.bind(this, "depreType")}/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <FormItem {...formItemLayout} label="折旧参数" required={false} colon={true} className={layoutItem} help={hints.depreParamHint} validateStatus={hints.depreParamStatus}>
                                    <Input type="text" name="depreParam" id="depreParam" value={this.state.assetType.depreParam } onChange={this.handleOnChange} />
                                </FormItem>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="采购部门" required={false} colon={true} className={layoutItem} help={hints.purchDeptHint} validateStatus={hints.purchDeptStatus}>
                                            <DeptTreeSelect name="purchDept" id="purchDept" value={this.state.assetType.purchDept } onSelect={this.handleOnSelected2} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <FormItem {...formItemLayout} label="备注" required={false} colon={true} className={layoutItem} help={hints.memo2Hint} validateStatus={hints.memo2Status}>
                                    <Input type="text" name="memo2" id="memo2" value={this.state.assetType.memo2 } onChange={this.handleOnChange} />
                                </FormItem>
                                <FormItem style={{textAlign:'right',margin:'4px 0'}} className={layoutItem}>
                                    <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                                    <Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
                                </FormItem>
                            </Form>
                        </div>
					</TabPane>
					<TabPane tab="物品清单" key="3" style={{width: '100%', height: '100%'}}>
						<ArticlesPage assetType={this.state.assetType}/>
					</TabPane>
					<TabPane tab="规格参数" key="4" style={{width: '100%', height: '100%'}}>
                        <ParamsPage assetType={this.state.assetType}/>
					</TabPane>
				</Tabs>
			</div>
		);
	}
});

export default UpdateAssetTypePage;