import React from 'react';
import TopMenu from '../lib/Components/TopMenu';

const propTypes = {
  children: React.PropTypes.node
};

var ResumePageIndex = React.createClass({
  getInitialState : function() {
      return {
	      navItems: [
	        {
	          name: '简历查询',
	          to: '/resume/QueryPage/'
	        },
	        {
	          name: '简历内容',
	          to: '/resume2/ResumePage/'
	        }
	      ]
      }
  },
  
  render : function() {
    return (
      <TopMenu navItems={this.state.navItems} activeNode="/resume/QueryPage/" children={this.props.children}/>
    );
  }
});

ResumePageIndex.propTypes = propTypes;
module.exports = ResumePageIndex;

