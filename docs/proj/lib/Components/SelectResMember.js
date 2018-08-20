import React from 'react';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');

import { Modal, Button, Table, Icon} from 'antd';
var SearchResMemberStore = require('../data/SearchResMemberStore');
var SearchResMemberActions = require('../action/SearchResMemberActions');

var SelectResMember = React.createClass({
    getInitialState : function() {
        return {
            resMemberSet: {
                filter: {},
                recordSet: [],
				startPage : 1,
				pageRow : 10,
				totalRow : 0,
                operation : '',
                errMsg : ''
            },
			loading: false,
            selectIndex:-1,
            selectResMember:{},
            modal:false
        }
    },
	mixins: [Reflux.listenTo(SearchResMemberStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            resMemberSet: data,
            selectIndex:-1,
            selectResMember:{},
        });
    },

  // 第一次加载
  componentDidMount : function(){
  },
  clear : function(resMemberSet){
    this.state.resMemberSet = resMemberSet;
    this.state.selectIndex=-1;
    this.state.selectResMember={};
  },
  toggle : function(){
    this.setState({
      modal: !this.state.modal
    });
  },
  onSelect: function(record, index){
    this.props.onSelectMember(record);
    this.toggle();
  },
  onChangePage: function(pageNumber){
      this.setState({loading: true});
      this.state.resMemberSet.startPage = pageNumber;
      var filter = this.state.resMemberSet.filter;
      SearchResMemberActions.retrieveResMemberPage(filter, pageNumber, this.state.resMemberSet.pageRow);
  },

  render : function(){
    const columns = [
        {
            title: '员工编号',
            dataIndex: 'staffCode',
            key: 'staffCode',
            width: 140,
        },
        {
            title: '姓名',
            dataIndex: 'perName',
            key: 'perName',
            width: 100,
        },
        {
            title: '当前状态',
            dataIndex: 'resStatus',
            key: 'resStatus',
            width: 140,
        },
        {
            title: '项目名称',
            dataIndex: 'resName',
            key: 'resName',
            width: 240,
        },
    ];

    var resMemberList = this.state.resMemberSet.recordSet;
    var pag = {showQuickJumper: true, total:this.state.resMemberSet.totalRow, pageSize:this.state.resMemberSet.pageRow, current:this.state.resMemberSet.startPage, size:'large', onChange: this.onChangePage};
    return (
        <Modal visible={this.state.modal} width='760px' title="选择资源池人员" maskClosable={true} onOk={this.onClickSave} onCancel={this.toggle}
          footer={null}
          >
          <div style={{padding: '0 8px 0 8px'}}>
            <ServiceMsg ref='mxgBox' svcList={['hr-resMember/retrieve']}/>
            <Table columns={columns} onRowClick={this.onSelect}  dataSource={resMemberList} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder}/>
        </div>
      </Modal>
    );
  }
});

export default SelectResMember;
