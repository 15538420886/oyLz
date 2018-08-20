'use strict';

module.exports = {
    roleName: { id: 'roleName', type: 'radio', desc: '角色', required: true, max: '64', defValue: '助理', opts: '#项目管理.角色', showCode:false },
    staffCode: { id: 'staffCode', type: 'text', desc: '员工编号', required: true, max: '64' },
    perName: { id: 'perName', type: 'text', desc: '姓名', required: true, max: '32' },
    beginDate: { id: 'beginDate', type: 'date', desc: '开始日期', required: false, max: '24' },
    endDate: { id: 'endDate', type: 'date', desc: '结束日期', required: false, max: '24' },

};
