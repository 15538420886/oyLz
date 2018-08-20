import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var Context = require('../../ParamContext');

import { Select, Spin } from 'antd';
const Option = Select.Option;

var ParamEnvStore = require('../../param-env/data/ParamEnvStore.js');
var ParamEnvActions = require('../../param-env/action/ParamEnvActions');

var EnvSelect = React.createClass({
  getInitialState : function() {
      return {
        paramEnvSet : {
              recordSet: [],
              errMsg:'',
              operation:''
        },
        loading: false
      }
  },

	mixins: [Reflux.listenTo(ParamEnvStore, "onServiceComplete")],
	onServiceComplete: function(data) {
	  if(data.operation === 'retrieve'){
	      this.state.paramEnvSet = data;
	      this.setState({loading: false});
	  }
	},

  // 第一次加载
  componentDidMount : function(){
      this.state.paramEnvSet = {
            recordSet: [],
            errMsg:'',
            operation:''
      };

		this.setState({loading: true});
      ParamEnvActions.initParamEnv();
  },
  render : function(){
      var skipEnv = Context.envApp.uuid;
      var recordSet = this.state.paramEnvSet.recordSet;

      var opts = [];
      var len = recordSet.length;
      for( var i=0; i<len; i++ ){
          var env = recordSet[i];
          if(env.uuid !== skipEnv){
              opts.push( env );
          }
      }

		var box = 
	      <Select {...this.props}>
	        {
	          opts.map((env, i) => {
	              return <Option key={env.uuid} value={env.uuid}>{env.envName}</Option>
	          })
	        }
	      </Select>
	      
    return this.state.loading ? <Spin>{box}</Spin> : box;
  }
});

export default EnvSelect;
