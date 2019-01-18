/*eslint-disable*/
import React, { PureComponent } from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import _ from 'lodash';
import { Table } from 'antd';
@connect(({ flowPresentation, loading }) => ({
  flowPresentation,
  loading: loading.models.flowPresentation,
}))
export default class TableComponents extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 勾选table的row
  onRowSelectionChange =(selectedRowKeys, selectedRows) => {
    this.props.dispatch({
      type: 'flowPresentation/updateState',
      payload: {
        selectedRowKeys,
      },
    }); 
  }
  // 分页
  handleTableChange(page) {
    const { flowPresentation: { conditionParams } } = this.props;
    this.props.dispatch({
      type: 'flowPresentation/getDataList',
      payload: {
        ...conditionParams,
        current: page.current,
        size: page.pageSize,
      },
    })
  }
  render() {
    const { flowPresentation: { pagination, loading, data = [], selectedRowKeys }, styles } = this.props;

    const columns = [
      {
        title: '序号',
        dataIndex: 'sort',
        key: 'sort',
        width: 70,
        fixed: 'left',
        render: (text, record, index) => {
          return <span>{index + 1}</span>;
        },
      },
      {
        title: '学校',
        dataIndex: 'schoolName',
        key: 'schoolName',
        width: 200,
        fixed: 'left',
      },
      {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
        width: 80,
        fixed: 'left',
      },
      {
        title: '是否有奖励',
        dataIndex: 'rewardString',
        key: 'rewardString',
        width: 120,
      },
      {
        title: '操作手机号',
        dataIndex: 'userTel',
        key: 'userTel',
        width: 180,
      },
      {
        title: '流量额度',
        dataIndex: 'flowQuota',
        key: 'flowQuota',
        width: 100,
      },
      {
        title: '年级',
        dataIndex: 'gradeName',
        key: 'gradeName',
        width: 120,
      },
      {
        title: '班级',
        dataIndex: 'className',
        key: 'className',
        width: 120,
      },
      {
        title: '类型',
        dataIndex: 'roleTypeString',
        key: 'roleTypeString',
        width: 80,
      },
      {
        title: '达标时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 200,
      },
      {
        title: '需赠送手机号',
        dataIndex: 'giveTel',
        key: 'giveTel',
        width: 180,
      },
      {
        title: '赠送状态',
        dataIndex: 'giveFlagString',
        key: 'giveFlagString',
        width: 100,
      },
      {
        title: '赠送时间',
        dataIndex: 'sendTime',
        key: 'sendTime',
        width: 200,
      },
      {
        title: '是否可赠送',
        dataIndex: 'active',
        key: 'active',
        width: 120,
        fixed: 'right',
        render: (text, record, index) => {
          return(
            <span>
              {record && record.giveFlag == 2?
                <span>是</span> : 
                <span>否</span>
              }        
            </span>            
          )
        }
      },
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onRowSelectionChange,
      getCheckboxProps: record => ({
        disabled: record.giveFlag != 2 || record.reward == 1,
      }),
    };

    return (
      <Table
        rowKey={record => record.flowId}
        columns={columns}
        dataSource={data}
        rowSelection={rowSelection}
        pagination={pagination}
        onChange={this.handleTableChange.bind(this)}
        scroll={{ x: 1930 }}
        loading={loading}
        bordered
      />
    );
  }
}
