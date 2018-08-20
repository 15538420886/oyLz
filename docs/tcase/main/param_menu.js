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
				name: '用例管理',
				icon: 'home',
        to: 'man_org',
				childItems: [
		          {
		            name: '用例列表',
		            to: '/tcase/path/PathPage/'
		          },
		        ]
		    },
	      ]
      }
  },

  render : function() {
    return (
        <LeftMenu navItems={this.state.navItems} activeNode="/tcase/resume/UsecaseListPage/" children={this.props.children}/>
    );
  }
});

ParamMenuIndex.propTypes = propTypes;
module.exports = ParamMenuIndex;


