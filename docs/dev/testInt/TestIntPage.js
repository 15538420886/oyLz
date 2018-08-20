'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import { Form, Button, Input, Select, layout, Radio, Row, Col, Upload, Table} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

var Validator = require('../../public/script/common');
var Utils = require('../../public/script/utils');

var selectedRowUuid = '';
var TestIntPage = React.createClass({
    getInitialState: function () {
        return {
            response: "",
            testData: {
                postType: '0',
                pageRow: '10',
                startPage: '1',
                prefixUrl: 'projUrl',
            },
            storageText: [],
            hints: {},
            file: {},
            uploadFile: null,
            validRules: []
        }
    },
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'testUrl', desc: 'URL地址', required: true, max: '128' },
        ];
    },

    onSubmit: function () {
        var data = this.state.testData;
        if (!data.testUrl) {
            return;
        }

        var url = (data.prefixUrl.startsWith('http')) ? data.prefixUrl+data.testUrl : Utils[data.prefixUrl]+data.testUrl;
        var obj = eval('(' + this.state.testData.sendBody + ')');

        var self = this;
        var postType = data.postType;
        if (postType === "1") {
            Utils.doRetrieveService(url, obj, data.startPage, data.pageRow, 0).then(function (result) {
                var str = JSON.stringify(result);
                self.setState({ response: str });
            }, function (result) {
                self.setState({
                    response: "调用服务错误"
                });
            });
        }
        else if (postType === "2") {
            if (this.state.uploadFile === null) {
                Common.infoMsg('请选择文件');
                return;
            }

            var fileList = [];
            fileList.push(this.state.uploadFile);
            Utils.doUploadService(url, obj, fileList).then(function (result) {
                var str = JSON.stringify(result);
                self.setState({ response: str });
            }, function (value) {
                self.setState({
                    response: "上传文件错误"
                });
            });
        }
        else {
            Utils.doGetRecordService(url, obj).then(function (result) {
                var str = JSON.stringify(result);
                self.setState({ response: str });
            }, function (result) {
                self.setState({
                    response: "调用服务错误"
                });
            });
        }

        this.textIntStorage();
    },

    textIntStorage: function () {
        var WebStore = {
            store: localStorage,
            segmentation: "-",
            orderKey: "url-order",

            getKey: function (key) {
                for (var i = this.store.length; i > 0; i--) {
                    var k = this.store.key(i - 1);
                    if (k.startsWith(key)) {
                        return k
                    }
                }
                return ""
            },

            getHistory: function (key) {
                var result = new Array();
                for (var i = 0; i < this.store.length; i++) {
                    var k = this.store.key(i);
                    if (k.startsWith(key)) {
                        result[result.length] = this.store.getItem(k)
                    }
                }
                return result
            },

            setBody: function (key, body) {
                var history = this.getHistory(key);
                for (var i = 0; i < history.length; i++) {
                    if (history[i] == body) {
                        return true
                    }
                }

                var id = this.getId();
                this.store.setItem(key + this.segmentation + (id + 1), body);
                this.store.setItem(this.orderKey, id + 1)

            },

            getId: function () {
                var index = this.store.getItem(this.orderKey);
                return index ? parseInt(index) : 0;
            }
        }

        var key = this.state.testData.testUrl;
        var body = this.state.testData.sendBody;
        WebStore.setBody(key, body)
    },

    handleOnChange: function (e) {
        var obj = this.state.testData;
        obj[e.target.id] = e.target.value;
        Validator.validator(this, obj, e.target.id);

        this.setState({ testData: obj });
    },

    onUrlChange: function (e) {
        var value = e.target.value;
        var obj = this.state.testData;
        obj[e.target.id] = e.target.value;
        Validator.validator(this, obj, e.target.id);
        this.setState({ testData: obj });

        if(this.state.testData.testUrl !== ""){
          var list = [];
          var storage = window.localStorage;
          for (var i = 0, len = storage.length; i < len; i++) {
            var key = storage.key(i);
            var url = key.slice(0, key.lastIndexOf("-"));
            var num = key.slice(key.lastIndexOf("-")+1);
            if (value == url && storage[key] != "undefined") {
              var object = {};
              object.data = storage[key];
              object.uuid = num;
              list.push(object)
            }
          }
          this.state.storageText = list;
        }else{
          this.state.storageText = null;
          this.state.testData.sendBody = null;
        }
    },

    onChangeUrlPrefix: function (value) {
        this.state.testData.prefixUrl = value;
    },

    onRadioChange: function (e) {
        var obj = this.state.testData;
        obj['postType'] = e.target.value;
        this.setState({ testData: obj });
    },

    fillterJson: function (json) {
        if (!json) {
            return;
        }
        let str = JSON.stringify(json);
        const reg1 = /,/g;
        const reg2 = /{/g;
        const reg3 = /}/g;
        const reg4 = /\\"/g;
        str = str.replace(reg1, `,
`);
        str = str.replace(reg2, `{
`);
        str = str.replace(reg3, `
}`);
        str = str.replace(reg4, `"`);
        return str;
    },

    beforeUpload: function (file) {
        this.state.fileName = file.name;
        this.setState({ uploadFile: file });
        return false;
    },

    onRowClick: function(record, index){
        selectedRowUuid = record.uuid;
        this.setState({
          storageText: this.state.storageText
        });

      this.state.testData.sendBody = record.data;
    },

    getRowClassName: function(record, index){
        var uuid = record.uuid;
        if(selectedRowUuid == uuid){
            return 'selected';
        }
        else{
            return '';
        }
    },

    render: function () {
        const responseText = this.fillterJson(this.state.response);
        var hints = this.state.hints;
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 2 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
        };
        const formItemLayout_0 = {
            labelCol: ((layout == 'vertical') ? null : { span: 4 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 15 }),
        };
        const formItemLayout_1 = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 15 }),
        };
        const formItemLayout_2 = {
            labelCol: ((layout == 'vertical') ? null : { span: 3 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
        };
        var page = null;
        if (this.state.testData.postType === "1") {
            page =
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout_0} label="起始页" required={true} colon={true} className={layoutItem}
                            help={hints.startPageHint} validateStatus={hints.startPageStatus}>
                            <Input type="text" name="startPage" id="startPage" value={this.state.testData.startPage}
                                onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout_1} label="每页记录数量" required={true} colon={true} className={layoutItem}
                            help={hints.pageRowHint} validateStatus={hints.pageRowStatus}>
                            <Input type="text" name="pageRow" id="pageRow" value={this.state.testData.pageRow}
                                onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
        }
        else if (this.state.testData.postType === "2") {
            page =
                <Row>
                    <FormItem {...formItemLayout_2} label="上传文件" required={true} colon={true} className={layoutItem} style={{ marginLeft: '-22px' }}>
                        <Col span="19">
                            <Input type="text" name="fileName" id="fileName" value={this.state.fileName}
                                readOnly={true} />
                        </Col>
                        <Col span="5">
                            <Upload name='file' action='/posts/' beforeUpload={this.beforeUpload} style={{ width: '100%' }}>
                                <Button icon="upload" style={{ width: '100%', marginLeft: '4px' }}>选择文件</Button>
                            </Upload>
                        </Col>
                    </FormItem>
                </Row>
        }

        var storageText = this.state.storageText;

        const columns = [
            {
                title: '测试数据',
                dataIndex: 'data',
                key: 'data',
                width: 320,
            }
        ];

        const selectBefore = (
            <Select defaultValue="projUrl" onChange={this.onChangeUrlPrefix} style={{ width: 240 }}>
                <Option value="authUrl">authUrl</Option>
                <Option value="paramUrl">paramUrl</Option>
                <Option value="campUrl">campUrl</Option>
                <Option value="devUrl">devUrl</Option>
                <Option value="resumeUrl">resumeUrl</Option>
                <Option value="hrUrl">hrUrl</Option>
                <Option value="projUrl">projUrl</Option>
                <Option value="http://127.0.0.1:8806/">auth://127.0.0.1:8806/</Option>
                <Option value="http://127.0.0.1:18806/">camp://127.0.0.1:18806/</Option>
                <Option value="http://127.0.0.1:18805/">resume://127.0.0.1:18805/</Option>
                <Option value="http://127.0.0.1:8801/">param://127.0.0.1:8801/</Option>
                <Option value="http://127.0.0.1:23801/">dev://127.0.0.1:23801/</Option>
                <Option value="http://127.0.0.1:8812/">hr://127.0.0.1:8812/</Option>
                <Option value="http://127.0.0.1:12301/">proj://127.0.0.1:12301/</Option>
            </Select>
        );

        return (
            <div className='form-page' style={{ margin: '14px 0 0 14px' }}>
                <div style={{ width: '690px', marginRight: '20px', float: 'left' }}>
                    <Form layout={layout}>
                        <FormItem colon={true}>
                            <span style={{
                                display: 'block',
                                width: '555px',
                                marginRight: '10px',
                                overflow: 'hidden',
                                float: 'left',
                                paddingTop: '2px'
                            }}>
                                <Input ref='urlBox' addonBefore={selectBefore} placeholder="Please input URL" type="text" name="testUrl" id="testUrl"
                                    value={this.state.testData.testUrl} onChange={this.onUrlChange} style={{ width: 300 }} />
                            </span>

                            <Button type="primary" htmlType="submit" onClick={this.onSubmit}>发送</Button>
                        </FormItem>
                        <FormItem {...formItemLayout} label="提交方式" colon={true} className={layoutItem}>
                            <RadioGroup name="postType" id="postType" onChange={this.onRadioChange} value={this.state.testData.postType}>
                                <Radio value='0'>单记录POST</Radio>
                                <Radio value='1'>分页POST</Radio>
                                <Radio value='2'>文件</Radio>
                            </RadioGroup>
                        </FormItem>
                        {page}
                        <FormItem label="Body：" colon={true}>
                            <Input type="textarea" name="sendBody" id="sendBody" value={this.state.testData.sendBody}
                                onChange={this.handleOnChange} style={{ height: '260px' }} />
                        </FormItem>
                        <FormItem label="Response：" colon={true}>
                            <Input type="textarea" name="response" id="response" value={responseText} style={{ height: '260px' }} />
                        </FormItem>
                    </Form>
                </div>
                <div style={{width: '320px', height: '700px', float: 'left', borderLeft:'1px solid #e2e2e2' }}>
                    <Table columns={columns} dataSource={storageText} rowKey={record => record.uuid} onRowClick={this.onRowClick} loading={this.state.loading} pagination={false} size='small' bordered/>
                </div>
            </div>
        );
    }
});

module.exports = TestIntPage;

