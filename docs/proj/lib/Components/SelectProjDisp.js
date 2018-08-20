import React from 'react';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');

import { Modal, Button, Table, Icon} from 'antd';
var SearchProjDispStore = require('../data/SearchProjDispStore');
var SearchProjDispAction = require('../action/SearchProjDispAction');

var SelectProjDisp = React.createClass({
    getInitialState : function() {
        return {
            projDispSet: {
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
            SelectProjDisp:{},
            modal:false
        }
    },
	mixins: [Reflux.listenTo(SearchProjDispStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            projDispSet: data,
            selectIndex:-1,
            SelectProjDisp:{},
        });
    },

  // 第一次加载
  componentDidMount : function(){
  },
  clear : function(projDispSet){
    this.state.projDispSet = projDispSet;
    this.state.selectIndex=-1;
    this.state.SelectProjDisp={};
  },
  toggle : function(){
    this.setState({
      modal: !this.state.modal
    });
  },
  onSelect: function(record, index){
    this.props.onSelectDisp(record);
    this.toggle();
  },
  onChangePage: function(pageNumber){
      this.setState({loading: true});
      this.state.projDispSet.startPage = pageNumber;
      var filter = this.state.projDispSet.filter;
      SearchProjDispAction.retrieveProjDispPage(filter, pageNumber, this.state.projDispSet.pageRow);
  },

  render : function(){
    const columns = [
        {
          title: '调度人编号',
          dataIndex: 'dispCode',
          key: 'dispCode',
          width: 140,
        },
        {
          title: '调度人',
          dataIndex: 'dispatcher',
          key: 'dispatcher',
          width: 140,
        },
    ];

    var projDispList= this.state.projDispSet.recordSet;
    var pag = {showQuickJumper: true, total:this.state.projDispSet.totalRow, pageSize:this.state.projDispSet.pageRow, current:this.state.projDispSet.startPage, size:'large', onChange: this.onChangePage};
    return (
        <Modal visible={this.state.modal} width='760px' title="选择调度人员" maskClosable={true} onOk={this.onClickSave} onCancel={this.toggle}
          footer={null}
          >
          <div style={{padding: '0 8px 0 8px'}}>
            <ServiceMsg ref='mxgBox' svcList={['hr-projMember/retrieve']}/>
            <Table columns={columns} onRowClick={this.onSelect}  dataSource={projDispList} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder}/>
        </div>
      </Modal>
    );
  }
});

export default SelectProjDisp;