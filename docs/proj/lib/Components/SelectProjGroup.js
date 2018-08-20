import React from 'react';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');

import { Modal, Button, Table, Icon} from 'antd';
var SearchProjGroupStore = require('../data/SearchProjGroupStore');
var SearchProjGroupActions = require('../action/SearchProjGroupActions');

var SelectProjGroup = React.createClass({
    getInitialState : function() {
        return {
            projGroupSet: {
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
            selectProjGroup:{},
            modal:false
        }
    },
	mixins: [Reflux.listenTo(SearchProjGroupStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            projGroupSet: data,
            selectIndex:-1,
            selectProjGroup:{},
        });
    },

  // 第一次加载
  componentDidMount : function(){
  },
  clear : function(projGroupSet){
    this.state.projGroupSet = projGroupSet;
    this.state.selectIndex=-1;
    this.state.selectProjGroup={};
  },
  toggle : function(){
    this.setState({
      modal: !this.state.modal
    });
  },
  onSelect: function(record, index){
    this.props.onSelectGroup(record);
    this.toggle();
  },
  onChangePage: function(pageNumber){
      this.setState({loading: true});
      this.state.projGroupSet.startPage = pageNumber;
      var filter = this.state.projGroupSet.filter;
      SearchProjGroupActions.retrieveProjGroupPage(filter, pageNumber, this.state.projGroupSet.pageRow);
  },

  render : function(){
    const columns = [
        {
            title: '编号',
            dataIndex: 'grpCode',
            key: 'grpCode',
            width: 140,
        },
        {
            title: '业务集群',
            dataIndex: 'deptCode',
            key: 'deptCode',
            width: 140,
        },
        {
            title: '项目群',
            dataIndex: 'grpName',
            key: 'grpName',
            width: 140,
        },
        {
            title: '客户',
            dataIndex: 'custName',
            key: 'custName',
            width: 140,
        },
    ];

    var projGroupList = this.state.projGroupSet.recordSet;
    var pag = {showQuickJumper: true, total:this.state.projGroupSet.totalRow, pageSize:this.state.projGroupSet.pageRow, current:this.state.projGroupSet.startPage, size:'large', onChange: this.onChangePage};
    return (
        <Modal visible={this.state.modal} width='760px' title="选择项目群" maskClosable={true} onOk={this.onClickSave} onCancel={this.toggle}
          footer={null}
          >
          <div style={{padding: '0 8px 0 8px'}}>
            <ServiceMsg ref='mxgBox' svcList={['proj_group/retrieve']}/>
            <Table columns={columns} onRowClick={this.onSelect}  dataSource={projGroupList} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder}/>
        </div>
      </Modal>
    );
  }
});

export default SelectProjGroup;
