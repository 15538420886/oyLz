import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Modal, Button, Progress } from 'antd';

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var DictStore = require('../data/DictStore');
var DictActions = require('../action/DictActions');

var BatchDictPage = React.createClass({
    getInitialState: function () {
        return {
            recordSet: {
                errMsg: ''
            },

            recordList: [],
            len: 0,
            index: 0,
            modal: false,
            stop: false,
        }
    },

    mixins: [Reflux.listenTo(DictStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        if (this.state.modal) {
            if (data.errMsg === '') {
                // 成功
                var len = this.state.len;
                var index = this.state.index;
                var stop = this.state.stop;
                if (stop) {
                    return;
                }

                if (index + 1 === len) {
                    //结束
                    this.setState({
                        index: index + 1,
                    });
                } else {
                    //继续回调
                    this.setState({
                        index: index + 1,
                    });
                    this.doBatchCreate(this.state.recordList);
                }
            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    stop: true,
                    recordSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount: function () {
    },

    clear: function (recordList) {
        this.state.recordList = recordList;
        this.state.index = 0;
        this.state.len = recordList.length;
        this.state.stop = false;
        this.doBatchCreate(recordList);
    },

    doBatchCreate: function (recordList) {
        var i = this.state.index;
        var record = recordList[i];

        record.uuid = '';
        DictActions.createSysCodeData(record );
    },

    onStop: function () {
        this.state.stop = true;
    },
	toggle : function(){
		this.setState({
			modal: !this.state.modal
        });
	},

    render: function () {
        var index = this.state.index;
        var record = this.state.recordList[index];
        var codeDesc = record ? record.codeDesc : '';
        var perc = Math.floor(index / this.state.len * 100);

        var button = null;
        var text = null;
        if (this.state.stop) {
            button = <Button key="btnClose" type="primary" size="large" onClick={this.toggle}>完成</Button>;
            text = <span>已终止！</span>
        }
        else {
            button = codeDesc ?
                <Button key="btnClose" type="primary" size="large" onClick={this.onStop}>终止</Button> :
                <Button key="btnClose" type="primary" size="large" onClick={this.toggle}>完成</Button>;

            text = codeDesc ? <span>正在生成 {codeDesc} ……</span> : <span>已完成！</span>;
        }
        return (
            <Modal visible={this.state.modal} width='540px' closable={false} maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['hr-job/create']} />
                        {button}
                    </div>
                ]}
            >
                <div style={{ padding: '24px 0px' }}>
                    <Progress percent={perc} status="active" />
                    <p style={{ padding: '12px 0 0 0' }}>{text}</p>
                </div>
            </Modal>
        );
    }
});

export default BatchDictPage;

