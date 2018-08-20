import React from 'react';
import {Input, Form, Col, Row, Button } from 'antd';
const FormItem = Form.Item;
const propTypes = {
  leave: React.PropTypes.object,
};

var LeaveInfor = React.createClass({
    getInitialState: function () {
		return {
			leaveSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
            },

            leave:this.props.leave,
		}
	},
    // 第一次加载
	componentDidMount : function(){
	},

	render : function() {
        var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};
        const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
        };

        // 计算年假和调休
        var leave = this.props.leave;
        var annual = leave.annual ? leave.annual : '' ;
        var pos = annual.indexOf('.');
        if (pos > 0) {
            leave.annual_1 = annual.substr(0, pos);
            leave.annual_2 = annual.substr(pos + 1);
        }
        else {
            leave.annual_1 = annual;
            leave.annual_2 = '0';
        }

        var dayoff = leave.dayoff ?leave.dayoff : '' ;
        var pos = dayoff.indexOf('.');
        if (pos > 0) {
            leave.dayoff_1 = dayoff.substr(0, pos);
            leave.dayoff_2 = dayoff.substr(pos + 1);
        }
        else {
            leave.dayoff_1 = dayoff;
            leave.dayoff_2 = '0';
        }

	    return (
            <div style={{width:'100%',maxWidth:'600px',margin:'24px 20px 16px 24px'}} >
                <Form layout={layout}>
                    <Row>
                        <Col className="gutter-row" span={12}>
                            <FormItem {...formItemLayout} label="员工编号"  required={false} colon={true} className={layoutItem}>
                                <Input type="text" name="staffCode" id="staffCode" value={this.state.leave.staffCode } readOnly={true}/>
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <FormItem {...formItemLayout} label="员工姓名"  required={false} colon={true} className={layoutItem}>
                                <Input type="text" name="perName" id="perName" value={this.state.leave.perName } readOnly={true} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-row" span={24}>
                            <FormItem {...formItemLayout2} label="任职部门"  required={false} colon={true} className={layoutItem}>
                                <Input type="text" name="deptName" id="deptName" value={this.state.leave.deptName } readOnly={true} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-row" span={12}>
                            <FormItem {...formItemLayout} label="年假" required={false} colon={true} className={layoutItem}>
                                <Col className="gutter-row" span={8}>
                                    <Input type="text" name="annual_1" id="annual_1" value={this.state.leave.annual_1} readOnly={true} />
                                </Col>
                                <Col className="gutter-row" span={4}>
                                    <div style={{margin: '0 0 0 6px'}}>天</div>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    <Input type="text" name="annual_2" id="annual_2" value={this.state.leave.annual_2} readOnly={true} />
                                </Col>
                                <Col className="gutter-row" span={4}>
                                    <div style={{ margin: '0 0 0 6px' }}>小时</div>
                                </Col>
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <FormItem {...formItemLayout} label="调休" required={false} colon={true} className={layoutItem}>
                                <Col className="gutter-row" span={8}>
                                    <Input type="text" name="dayoff_1" id="dayoff_1" value={this.state.leave.dayoff_1} readOnly={true} />
                                </Col>
                                <Col className="gutter-row" span={4}>
                                    <div style={{ margin: '0 0 0 6px' }}>天</div>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    <Input type="text" name="dayoff_2" id="dayoff_2" value={this.state.leave.dayoff_2} readOnly={true} />
                                </Col>
                                <Col className="gutter-row" span={4}>
                                    <div style={{ margin: '0 0 0 6px' }}>小时</div>
                                </Col>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-row" span={12}>
                            <FormItem {...formItemLayout} label="婚假"  required={false} colon={true} className={layoutItem}>
                                <Input type="text" name="wedding" id="wedding" value={this.state.leave.wedding } readOnly={true} />
                            </FormItem>

                        </Col>
                        <Col className="gutter-row" span={12}>
                            <FormItem {...formItemLayout} label="产假"  required={false} colon={true} className={layoutItem}>
                                <Input type="text" name="maternity" id="maternity" value={this.state.leave.maternity } readOnly={true} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-row" span={12}>
                            <FormItem {...formItemLayout} label="陪护假"  required={false} colon={true} className={layoutItem}>
                                <Input type="text" name="paternity" id="paternity" value={this.state.leave.paternity } readOnly={true} />
                            </FormItem>

                        </Col>
                        <Col className="gutter-row" span={12}>
                            <FormItem {...formItemLayout} label="探亲假"  required={false} colon={true} className={layoutItem}>
                                <Input type="text" name="family" id="family" value={this.state.leave.family } readOnly={true} />
                            </FormItem>

                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-row" span={12}>
                            <FormItem {...formItemLayout} label="丧假"  required={false} colon={true} className={layoutItem}>
                                <Input type="text" name="funeral" id="funeral" value={this.state.leave.funeral } readOnly={true} />
                            </FormItem>

                        </Col>
                        <Col className="gutter-row" span={12}>
                            <FormItem {...formItemLayout} label="带薪假"  required={false} colon={true} className={layoutItem}>
                                <Input type="text" name="paidLeave" id="paidLeave" value={this.state.leave.paidLeave } readOnly={true}  />
                            </FormItem>

                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-row" span={12}>
                            <FormItem {...formItemLayout} label="其他假"  required={false} colon={true} className={layoutItem}>
                                <Input type="text" name="otherLeave" id="otherLeave" value={this.state.leave.otherLeave } readOnly={true} />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
	    );
	}
});

LeaveInfor.propTypes = propTypes;
module.exports = LeaveInfor;
