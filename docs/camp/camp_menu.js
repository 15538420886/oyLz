import React from 'react';
import LeftMenu from '../lib/Components/LeftMenu';

const propTypes = {
  children: React.PropTypes.node
};

var AuthPageIndex = React.createClass({
  getInitialState : function() {
      return {
	      navItems: [
			  {
				name: '工位管理',
				to: '/camp/CampusPage/'
			  },
			  {
				name: '工位查询',
				to: '/camp/CampusStatPage/'
              },
			  {
				name: '定位测试',
				to: '/camp/CampusTestPage/'
              },
              {
                  name: '考勤查询',
                  to: '/camp/UserPosPage/'
              },
              {
                  name: '地址查询',
                  to: '/camp/CheckLocPage/'
              }
	      ]
      }
  },

  render : function() {
    return (
    	<LeftMenu navItems={this.state.navItems} activeNode="/camp/CampusPage/" children={this.props.children}/>
    );
  }
});

AuthPageIndex.propTypes = propTypes;
module.exports = AuthPageIndex;
