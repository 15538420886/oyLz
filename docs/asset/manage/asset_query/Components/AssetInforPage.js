import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

import { Form, Modal, Button, Input, Table, Row, Col, Spin } from 'antd';
const FormItem = Form.Item;
var AssetInfoTablePage = require('../Components/AssetInfoTablePage');
var AssetInfoTablePage1 = require('../Components/AssetInfoTablePage1');
var AssetQueryStore = require('../data/AssetQueryStore');
var AssetQueryActions = require('../action/AssetQueryActions');


var AssetInforPage = React.createClass({
	getInitialState : function() {
		return {
			assetQuerySet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(AssetQueryStore, "onServiceComplete"), ModalForm('assetQuery')],
	onServiceComplete: function(data) {
		if(data.operation === 'retrieve'){
				 this.setState({
	            loading: false,
	            assetQuerySet: data
	        });
		}
	},

	// 第一次加载
	componentDidMount : function(){
		this.initPage();
	},

	initPage: function()
	{
		if(window.loginData.compUser){
			this.setState({loading: true});
			var filter = {};
			filter.corpUuid = window.loginData.compUser.corpUuid;
			AssetQueryActions.initAssetInfo( filter );
		}
	},
    
    goBack: function () {
        if (this.props.goBack) {
            this.props.goBack();
        }
    },

	render : function() {
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 6}),
			wrapperCol: ((layout=='vertical') ? null : {span: 18}),
		};
        const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 3}),
			wrapperCol: ((layout=='vertical') ? null : {span: 21}),
		};

		var hints=this.state.hints;
        var asset = this.props.asset;
		var form=(
			<Form layout={layout} style={{width:'600px'}}>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="编号" required={false} colon={true} className={layoutItem} help={hints.typeCodeHint} validateStatus={hints.typeCodeStatus}>
                            <Input type="text" name="typeCode" id="typeCode" disabled={true} value={ asset.typeCode } onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="名称" required={false} colon={true} className={layoutItem} help={hints.typeNameHint} validateStatus={hints.typeNameStatus}>
                            <Input type="text" name="typeName" id="typeName" disabled={true} value={ asset.typeName } onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="资产种类" required={false} colon={true} className={layoutItem} help={hints.assertClazzHint} validateStatus={hints.assertClazzStatus}>
                            <Input type="text" name="assertClazz" id="assertClazz" disabled={true} value={ asset.assertClazz } onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="型号" required={false} colon={true} className={layoutItem} help={hints.assetModelHint} validateStatus={hints.assetModelStatus}>
                            <Input type="text" name="assetModel" id="assetModel" disabled={true} value={ asset.assetModel } onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <FormItem {...formItemLayout2} label="规格参数" required={false} colon={true} className={layoutItem} help={hints.modelParamHint} validateStatus={hints.modelParamStatus}>
                    <Input type="text" name="modelParam" id="modelParam" disabled={true} value={ asset.modelParam } onChange={this.handleOnChange} />
                </FormItem>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="在库状态" required={false} colon={true} className={layoutItem} help={hints.borrowStateHint} validateStatus={hints.borrowStateStatus}>
                            <Input type="text" name="borrowState" id="borrowState" disabled={true} value={ asset.borrowState } onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="可用状态" required={false} colon={true} className={layoutItem} help={hints.assertStateHint} validateStatus={hints.assertStateStatus}>
                            <Input type="text" name="assertState" id="assertState" disabled={true} value={ asset.assertState } onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="城市" required={false} colon={true} className={layoutItem} help={hints.assetCityHint} validateStatus={hints.assetCityStatus}>
                            <Input type="text" name="assetCity" id="assetCity" disabled={true} value={ asset.assetCity } onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="存放地址" required={false} colon={true} className={layoutItem} help={hints.assetLocHint} validateStatus={hints.assetLocStatus}>
                            <Input type="text" name="assetLoc" id="assetLoc" disabled={true} value={ asset.assetLoc } onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="货架编号" required={false} colon={true} className={layoutItem} help={hints.shelfCodeHint} validateStatus={hints.shelfCodeStatus}>
                            <Input type="text" name="shelfCode" id="shelfCode" disabled={true} value={ asset.shelfCode } onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="可外借" required={false} colon={true} className={layoutItem} help={hints.isLendHint} validateStatus={hints.isLendStatus}>
                            <Input type="text" name="isLend" id="isLend" disabled={true} value={ asset.isLend } onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="借用人" required={false} colon={true} className={layoutItem} help={hints.borrowNameHint} validateStatus={hints.borrowNameStatus}>
                            <Input type="text" name="borrowName" id="borrowName" disabled={true} value={ asset.borrowName } onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="电话" required={false} colon={true} className={layoutItem} help={hints.borrowPhoneHint} validateStatus={hints.borrowPhoneStatus}>
                            <Input type="text" name="borrowPhone" id="borrowPhone" disabled={true} value={ asset.borrowPhone } onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="借用日期" required={false} colon={true} className={layoutItem} help={hints.borrowTimeHint} validateStatus={hints.borrowTimeStatus}>
                            <Input type="text" name="borrowTime" id="borrowTime" disabled={true} value={ asset.borrowTime } onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="归还日期" required={false} colon={true} className={layoutItem} help={hints.returnDateHint} validateStatus={hints.returnDateStatus}>
                            <Input type="text" name="returnDate" id="returnDate" disabled={true} value={ asset.returnDate } onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="采购部门" required={false} colon={true} className={layoutItem} help={hints.requDeptHint} validateStatus={hints.requDeptStatus}>
                            <Input type="text" name="requDept" id="requDept" disabled={true} value={ asset.requDept } onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="价格" required={false} colon={true} className={layoutItem} help={hints.priceHint} validateStatus={hints.priceStatus}>
                            <Input type="text" name="price" id="price" disabled={true} value={ asset.price } onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="申请编号" required={false} colon={true} className={layoutItem} help={hints.applyCodeHint} validateStatus={hints.applyCodeStatus}>
                            <Input type="text" name="applyCode" id="applyCode" disabled={true} value={ asset.applyCode } onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="用途" required={false} colon={true} className={layoutItem} help={hints.applyReasonHint} validateStatus={hints.applyReasonStatus}>
                            <Input type="text" name="applyReason" id="applyReason" disabled={true} value={ asset.applyReason } onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="生产厂家" required={false} colon={true} className={layoutItem} help={hints.manufacturerHint} validateStatus={hints.manufacturerStatus}>
                            <Input type="text" name="manufacturer" id="manufacturer" disabled={true} value={ asset.manufacturer } onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="入库日期" required={false} colon={true} className={layoutItem} help={hints.storDateHint} validateStatus={hints.storDateStatus}>
                            <Input type="text" name="storDate" id="storDate" disabled={true} value={ asset.storDate } onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="负责部门" required={false} colon={true} className={layoutItem} help={hints.assetDeptHint} validateStatus={hints.assetDeptStatus}>
                            <Input type="text" name="assetDept" id="assetDept" disabled={true} value={ asset.assetDept } onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="管理员" required={false} colon={true} className={layoutItem} help={hints.managerCodeHint} validateStatus={hints.managerCodeStatus}>
                            <Input type="text" name="managerCode" id="managerCode" disabled={true} value={ asset.managerCode } onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="来源" required={false} colon={true} className={layoutItem} help={hints.assetSourceHint} validateStatus={hints.assetSourceStatus}>
                            <Input type="text" name="assetSource" id="assetSource" disabled={true} value={ asset.assetSource } onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="折旧价格" required={false} colon={true} className={layoutItem} help={hints.deprePriceHint} validateStatus={hints.deprePriceStatus}>
                            <Input type="text" name="deprePrice" id="deprePrice" disabled={true} value={ asset.deprePrice } onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="折旧方法" required={false} colon={true} className={layoutItem} help={hints.depreTypeHint} validateStatus={hints.depreTypeStatus}>
                            <Input type="text" name="depreType" id="depreType" disabled={true} value={ asset.depreType } onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="折旧年限" required={false} colon={true} className={layoutItem} help={hints.depreYearsHint} validateStatus={hints.depreYearsStatus}>
                            <Input type="text" name="depreYears" id="depreYears" disabled={true} value={ asset.depreYears } onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>			
            </Form>
		);

		return (
			<div style={{padding:"20px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
	        	<ServiceMsg ref='mxgBox' svcList={['asset-info/retrieve']}/>
	        	{this.state.loading ? <Spin>{form}</Spin> : form}
                <div style={{ width:'614px' }}>
                    <p style={{ fontSize: '14px', margin:' 20px 0px -8px 16px' }}>物品清单</p>
                    <AssetInfoTablePage ref="AssetInfoTablePage" asset={asset}/>
                </div>
                <div style={{ width:'614px' }}>
                    <p style={{ fontSize: '14px', margin:' 20px 0px -8px 16px' }}>规格参数</p>
                    <AssetInfoTablePage1 ref="AssetInfoTablePage1" asset={asset}/>
                </div>
                <div key="footerDiv" style={{ width:'600px', display: 'block', textAlign: 'right' }}>
                    <Button key="btnClose" size="middle" onClick={this.goBack}>返回</Button>
                </div>
	        </div>

		);
	}
});

module.exports=AssetInforPage;
