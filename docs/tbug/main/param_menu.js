import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';

const propTypes = {
  children: React.PropTypes.node
};

var ParamMenuIndex = React.createClass({
  getInitialState : function() {
      return {
            navItems: [
	          {
	            name: '缺陷列表',
	            to: '/tbug/components/tbugPage/'
	          },
	          {
	            name: '状态机管理',
	            to: '/tbug/components/tstatePage/'
	          },
	           {
	            name: '公司资料',
	            to: '/tbug/components/CompanyInfoPage/'
	          },
	           {
	            name: '用户列表',
	            to: '/tbug/components/UserPage/'
	          },
	           {
	            name: '被测系统',
	            to: '/tbug/components/SystemPage/'
	          },
	      ]
      }
  },

  render : function() {
    return (
        <LeftMenu navItems={this.state.navItems} activeNode="/tbug/components/tbugPage/" children={this.props.children}/>
    );
  }
});

ParamMenuIndex.propTypes = propTypes;
module.exports = ParamMenuIndex;


