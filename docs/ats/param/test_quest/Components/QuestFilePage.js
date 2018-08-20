import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col,Upload} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;


import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import FileRequest from '../../../../lib/Components/FileRequest';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

var CreateProvNodesPage = React.createClass({
    getInitialState : function() {
        return {
            provNodesSet: {},
            loading: false,
            modal: false,
            hints: {},
            validRules: [],
            localData:{},
            questFileList:[],
            answerFileList:[],
        }
    },

    // 第一次加载
    componentDidMount : function(){
    },

    clear : function(filter){
        // FIXME 输入参数，对象初始化
        this.state.hints = {};
        this.state.localData=filter;
        this.state.loading = false;
        if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
            this.refs.mxgBox.clear();
        }
    },

    downloadQuest: function()
    {
        var url = Utils.atsUrl+'quest-file/quest-down?uuid='+this.state.localData.uuid;
        window.location.href = Utils.fmtGetUrl(url);
    },
    downloadAnswer: function()
    {
        var url = Utils.atsUrl+'quest-file/answer-down?uuid='+this.state.localData.uuid;
        window.location.href = Utils.fmtGetUrl(url);
    },
    onQuestChange:function(result){
        var lastQuestFile=result.fileList.slice(-1);
        this.setState({questFileList:lastQuestFile});

        if(result.file.status=='done'&&lastQuestFile[0].response.errCode=='000000'){
            alert('上传'+lastQuestFile[0].name+'成功');
            this.setState({questFileList:[]});
        };
    },
    onAnswerChange:function(result){
        var lastAnswerFile=result.fileList.slice(-1);
        this.setState({answerFileList:lastAnswerFile});

        if(result.file.status=='done'&&lastAnswerFile[0].response.errCode!=='000000'){
            alert(lastAnswerFile[0].response.errDesc);
            this.setState({answerFileList:[]});
        }
        else if(result.file.status=='done'&&lastAnswerFile[0].response.errCode=='000000'){
            alert('上传'+lastAnswerFile[0].name+'成功');
            this.setState({answerFileList:[]});
        };

    },

    toggle: function () {
        this.setState({
            modal: !this.state.modal
        });
    },
    render : function(){
        var layout='horizontal';
        var layoutItem='form-item-'+layout;
        var questFileList=this.state.questFileList;
        var answerFileList=this.state.answerFileList;

        const formItemLayout = {
            labelCol: ((layout=='vertical') ? null : {span: 4}),
            wrapperCol: ((layout=='vertical') ? null : {span: 20}),
        };
        const formItemLayout2 = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };
        const uuid = {
            body:{uuid:this.state.localData.uuid},
        };

        var questUrl =Utils.atsUrl+'quest-file/quest-upload';
        var answerUrl=Utils.atsUrl+'quest-file/answer-upload';
        var hints=this.state.hints;
        return (
            <Modal visible={this.state.modal} width='400px' title="面试题上传下载" maskClosable={false} onCancel={this.toggle} footer={null}>
                <Form layout={layout}>
                    <Row type="flex">
                        <Col span="12">
                            <Upload name='quest' fileList={questFileList} data={uuid}  onChange={this.onQuestChange}  customRequest={FileRequest}  action={questUrl} beforeUpload={this.beforeUpload} style={{width: '100%'}}>
                                <Button style={{width:'120px',marginLeft:'30px',fontSize:'14px',height:'32px'}} >上传面试题</Button>
                            </Upload>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout} className={layoutItem}   colon={true} help={hints.answerUploadHint} validateStatus={hints.answerUploadStatus}>
                                <Button style={{width:'120px',marginBottom:'10px'}}  onClick={this.downloadQuest}>下载面试题</Button>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex">
                        <Col span="12">
                            <Upload name='answer' data={uuid} fileList={answerFileList}  onChange={this.onAnswerChange} customRequest={FileRequest} action={answerUrl}  beforeUpload={this.beforeUpload} style={{width: '100%'}}>
                                <Button style={{width:'120px',marginLeft:'30px',fontSize:'14px',height:'32px'}} >上传标准答案</Button>
                            </Upload>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout}  className={layoutItem} colon={true} help={hints.questUploadHint} validateStatus={hints.questUploadStatus}>
                                <Button style={{width:'120px',marginBottom:'30px'}} onClick={this.downloadAnswer}>下载标准答案</Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
});

export default CreateProvNodesPage;