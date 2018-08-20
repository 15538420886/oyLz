import React from 'react';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
import ModalForm from '../../../lib/Components/ModalForm';

import {Form, Input,Col} from 'antd';
const InputGroup = Input.Group;
const FormItem = Form.Item;

var LeaveInput = React.createClass({
    getInitialState : function() {
        return {
			loading: false,
            hints:{},
            flag:true,
            accruedDay:'',
            accruedHour:'',
            realDay:'',
        }
    },

    
    // 第一次加载
    componentDidMount : function(){
    },
    componentWillMount: function () {
        const {
            type,
            readOnly,
            value,
            remainday,
            realLeave,
            ...attributes,
        } = this.props;
        this.state.loading = true;
    },

     handleOnChange: function (e) {
        var objName = e.target.id;
        this.state[objName] = e.target.value;
        this.setState({
            flag:false,
        }) 
    },

    render : function(){     
      const {
            type,
            readOnly,
            value,
            remainday,
            realLeave,
            ...attributes,
        } = this.props;
  
        var hints = this.state.hints;
        if(remainday) {
            var remnant = value[type]?value[type]:'0';
            var pos = remnant.indexOf('.');
            if (pos > 0) {
                this.state.accruedDay = remnant.substr(0, pos);
                this.state.accruedHour = remnant.substr(pos + 1);
            }
            else {
                this.state.accruedDay = remnant;
            }
        } else {
            if(this.state.flag) {
                if(realLeave) {
                    var realStr = value.spend?value.spend:'0';
                    var pos = realStr.indexOf('.');
                    if (pos > 0) {
                        this.state.accruedDay = realStr.substr(0, pos);
                        this.state.accruedHour = realStr.substr(pos + 1);
                    } else {
                        this.state.accruedDay = realStr;
                    }
                } 
                else {
                    this.state.accruedDay = value?value.accruedDay:'';
                    this.state.accruedHour = value?value.accruedHour:'';
                } 
            }  
        }
        this.state.flag = true;
        if(type==='annual' || type==='dayoff') {
            return (
                <div>
                    <Col className="gutter-row" span={13}>
                        <FormItem help={hints.accruedDayHint} validateStatus={hints.accruedDayStatus}>
                            <InputGroup compact>
                                <Input style={{ width: '70%' }} type="text" name='accruedDay' id='accruedDay'  value = {this.state.accruedDay} onChange={this.handleOnChange} readOnly={readOnly}/>
                                <Input style={{ width: '30%', textAlign: 'center' }} className="gutter-row" defaultValue="天" readOnly={true} />
                            </InputGroup>
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" span={11}>
                        <FormItem  help={hints.accruedDayHint} validateStatus={hints.accruedDayStatus} style={{ margin: '0 0 0 8px' }}>
                            <InputGroup compact>
                                <Input style={{ width: '55%' }} type="text" name='accruedHour' id='accruedHour'  value = {this.state.accruedHour} onChange={this.handleOnChange} readOnly={readOnly}/>
                                <Input style={{ width: '45%', textAlign: 'center'}} className="gutter-row" defaultValue="小时" readOnly={true} />
                            </InputGroup>
                        </FormItem>
                    </Col>
                </div>
            );
        }else {
            return (
                <FormItem help={hints.accruedDayHint} validateStatus={hints.accruedDayStatus}>
                    <InputGroup compact>
                        <Input style={{ width: '80%' }} type="text" name='accruedDay' id='accruedDay'  value = {this.state.accruedDay} onChange={this.handleOnChange} readOnly={readOnly}/>
                        <Input style={{ width: '20%', textAlign: 'center'}} className="gutter-row" defaultValue="天" readOnly={true} />
                    </InputGroup>
                </FormItem>
            );
        }
  }
});

export default LeaveInput;
