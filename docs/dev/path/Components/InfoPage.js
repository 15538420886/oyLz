'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ModalForm from '../../../lib/Components/ModalForm';
import SelectResMethod from '../../lib/Components/SelectResMethod';
var Validator = require('../../../public/script/common');
import { Button, Table, Icon, Input, Modal, Form, Row, Col, Spin, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import PathContext from '../PathContext';
var Common = require('../../../public/script/common');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Utils = require('../../../public/script/utils');
var PageDesignStore = require('../../page/data/PageDesignStore');
var PageDesignActions = require('../../page/action/PageDesignActions');

var InfoPage = React.createClass({
    getInitialState: function () {
        return {
            findRes: {},
            pageInfo: {},
            hints: {},
            validRules: [],
            loading: false,
            oldResName: '',
        }
    },

    mixins: [Reflux.listenTo(PageDesignStore, "onServiceComplete2"), ModalForm('pageInfo')],
    onServiceComplete2: function (data) {
        if (data.operation === 'updateResource') {
            var pageInfo = null;
            var resName = this.state.findRes.resName;
            var resList = data.pageInfo.resList;
            var len = resList.length;

            var x = 0;
            for (x = 0; x < len; x++) {
                var r = resList[x];
                if (r.resName === resName) {
                    pageInfo = r.pageInfo;
                    break;
                }
            }

            this.setState({
                loading: false,
                pageInfo: pageInfo
            });
        }
    },

    componentDidMount: function () {
        this.state.validRules = [
            {id: 'shortObject', desc:'对象名称', required: false, max: '64'},
            {id: 'objectName', desc:'变量名称', required: false, max: '64'},
            {id: 'resourceName', desc:'资源名称', required: false, max: '64'},
            {id: 'resourceTitle', desc:'资源标题', required: false, max: '64'},
            {id: 'params', desc:'输入参数', required: false, max: '128'},
        ];

        var findRes = this.props.findRes;
        var resName = findRes.resName;
        this.state.oldResName = resName;

        var pageInfo = null;
        var resList = this.props.data.pageInfo.resList;
        for (var x = 0; x < resList.length; x++) {
            var data = resList[x];
            if (data.resName === resName) {
                pageInfo = data.pageInfo;
                break;
            }
        }
        
        if (pageInfo === null || pageInfo === undefined) {
            //对象名称，变量名称处理
            resName = resName.replace(/_/g, "-")
            var inx1 = resName.indexOf('-');
            while (inx1 !== -1) {
                var letter = resName.charAt(inx1 + 1);
                resName = resName.replace('-' + letter, letter.toUpperCase());
                inx1 = resName.indexOf('-');
            }

            var objectName2 = resName;

            var inx0 = resName.charAt(0);
            var shortObject2 = objectName2.replace(inx0, inx0.toUpperCase());

            pageInfo = { resourceName: findRes.resName, resourceTitle: findRes.resDesc, shortObject: shortObject2, objectName: objectName2 };
        }

        this.setState({ pageInfo: pageInfo, findRes: findRes});
    },

    onClickSave: function () {
        if (Validator.formValidator(this, this.state.pageInfo)) {
            this.setState({ loading: true });
            PageDesignActions.updateResource(this.state.findRes.resName, this.state.pageInfo);
        }
    },
    
    render: function () {
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };

        var resUuid = this.state.findRes.uuid;
        var hints = this.state.hints;
        var form = (<Form layout={layout} style={{ width: '700px' }}>
            <Row>
                <Col span="12">
                    <FormItem {...formItemLayout} className={layoutItem} label="资源名称" colon={true} className={layoutItem} help={hints.resourceNameHint} validateStatus={hints.resourceNameStatus}>
                        <Input type="text" name="resourceName" id="resourceName" value={this.state.pageInfo.resourceName} onChange={this.handleOnChange} />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem {...formItemLayout} className={layoutItem} label="对象名称" colon={true} className={layoutItem} help={hints.shortObjectHint} validateStatus={hints.shortObjectStatus}>
                        <Input type="text" name="shortObject" id="shortObject" value={this.state.pageInfo.shortObject} onChange={this.handleOnChange} />
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem {...formItemLayout} className={layoutItem} label="变量名称" colon={true} className={layoutItem} help={hints.objectNameint} validateStatus={hints.objectNameStatus}>
                        <Input type="text" name="objectName" id="objectName" value={this.state.pageInfo.objectName} onChange={this.handleOnChange} />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem {...formItemLayout} className={layoutItem} label="资源标题" colon={true} className={layoutItem} help={hints.resourceTitleHint} validateStatus={hints.resourceTitleStatus}>
                        <Input type="text" name="resourceTitle" id="resourceTitle" value={this.state.pageInfo.resourceTitle} onChange={this.handleOnChange} />
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem {...formItemLayout} className={layoutItem} label="输入参数" colon={true} className={layoutItem} help={hints.pathNameHint} validateStatus={hints.pathNameStatus}>
                        <Input type="text" name="params" id="params" value={this.state.pageInfo.params} onChange={this.handleOnChange} />
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem {...formItemLayout} className={layoutItem} label="查询方法" >
                        <SelectResMethod name="retrieveMethod" id="retrieveMethod" resUuid={resUuid} value={this.state.pageInfo.retrieveMethod} onSelect={this.handleOnSelected.bind(this, "retrieveMethod")} />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem {...formItemLayout} className={layoutItem} label="增加方法" >
                        <SelectResMethod name="createMethod" id="createMethod" resUuid={resUuid} value={this.state.pageInfo.createMethod} onSelect={this.handleOnSelected.bind(this, "createMethod")} />
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem {...formItemLayout} className={layoutItem} label="修改方法" >
                        <SelectResMethod name="updateMethod" id="updateMethod" resUuid={resUuid} value={this.state.pageInfo.updateMethod} onSelect={this.handleOnSelected.bind(this, "updateMethod")} />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem {...formItemLayout} className={layoutItem} label="删除方法" >
                        <SelectResMethod name="removeMethod" id="removeMethod" resUuid={resUuid} value={this.state.pageInfo.removeMethod} onSelect={this.handleOnSelected.bind(this, "removeMethod")} />
                    </FormItem>
                </Col>
            </Row>
            <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
            </div>
        </Form>
        );
        return (
            <div style={{ padding: "24px 0 16px 0", height: '100%', overflowY: 'auto' }}>
                <ServiceMsg ref='mxgBox' svcList={['app-txn/retrieve','page-design/updateResource']} />
                {this.state.loading ? <Spin>{form}</Spin> : form}
            </div>
        );
    }
});

module.exports = InfoPage;
