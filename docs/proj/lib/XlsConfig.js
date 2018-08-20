'use strict';

module.exports = {
    resMemberFields: [
        { id: 'A', name: 'perName', title: '姓名' },
        { id: 'B', name: 'staffCode', title: '员工编号' },
        { id: 'C', name: 'beginDate', title: '入池日期'},
        { id: 'D', name: 'beginHour', title: '时间' },
        { id: 'E', name: 'userCost', title: '核算成本' },
    ],
    checkMemberFields: [
        { id: 'A', name: 'staffCode', title: '员工号'},
        { id: 'B', name: 'perName', title: '姓名' },
        { id: 'C', name: 'deptName', title: '部门'},
        { id: 'D', name: 'manType', title: '类型' },
        { id: 'E', name: 'workHours', title: '工时' },
        { id: 'F', name: 'overHours', title: '加班' },
        { id: 'G', name: 'overHour2', title: '周末' },
        { id: 'H', name: 'overHour3', title: '节假日' },
        { id: 'I', name: 'leaveHour', title: '带薪假' },
        { id: 'J', name: 'leaveHour2', title: '无薪假' },

    ], 
    projMemberFields:[
        { id: 'A', name: 'perName', title: '姓名' },
        { id: 'B', name: 'staffCode', title: '员工编号' },
        { id: 'C', name: 'teamName', title: '项目小组' },
        { id: 'D', name: 'projLevel', title: '客户定级'},
        { id: 'E', name: 'userPrice', title: '结算价格' },
        { id: 'F', name: 'dispType', title: '派遣类型', opts: '#项目管理.派遣类型'},
        { id: 'G', name: 'roleName', title: '承担角色' },

    ],
    projMemberFields:[
				{ id: 'A', name: 'staffCode', title: '员工号'},
				{ id: 'B', name: 'perName', title: '姓名' },
				{ id: 'C', name: 'poolName', title: '资源池'},
				{ id: 'D', name: 'teamName', title: '小组名称'},
				{ id: 'E', name: 'grpName', title: '项目群' },
				{ id: 'F', name: 'projName', title: '项目组'},
				{ id: 'G', name: 'projLevel', title: '客户定级'},
	],
    projTaskMemberFields:[
        { id: 'A', name: 'ordCode', title: '订单编号'},
        { id: 'B', name: 'ordName', title: '订单名称' },
        { id: 'C', name: 'grpName', title: '项目群名称'},
        { id: 'D', name: 'member', title: '成员'},
	]
};



