/*eslint-disable*/
import React, { PureComponent } from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import _ from 'lodash';
import { Table } from 'antd';
const stateArr = ['', '未缴', '已缴']
@connect(({ paymentDetail, loading }) => ({
  paymentDetail,
  loading: loading.models.paymentDetail,
}))
export default class TableComponents extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 分页
  handleTableChange(page) {
    const { paymentDetail: { conditionParams, schoolId } } = this.props;
    this.props.dispatch({
      type: 'paymentDetail/stuItemsDetail',
      payload: {
        ...conditionParams,
        schoolId: schoolId,
        className: conditionParams.className == '全部'? '' : conditionParams.className,
        current: page.current,
        size: page.pageSize,
      },
    });
  }
  render() {
    const { paymentDetail: { pagination, loading = false, data = [] }, styles } = this.props;
    const columns = [
      {
        title: '缴费项目',
        dataIndex: 'itemName',
        key: 'itemName',
        width: 200,
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
        title: '身份证号',
        dataIndex: 'identity',
        key: 'identity',
        width: 140,
      },
      {
        title: '学生姓名',
        dataIndex: 'studentName',
        key: 'studentName',
        width: 100,
      },
      {
        title: '缴费状态',
        dataIndex: 'payStatus',
        key: 'payStatus',
        width: 140,
        render: (text) => {
          return(<span>{stateArr[text]}</span>)
        }
      },
      {
        title: '缴费金额(元)',
        dataIndex: 'payMoney',
        key: 'payMoney',
        width: 120,
      },
      {
        title: '缴费手机号',
        dataIndex: 'telNum',
        key: 'telNum',
        width: 140,
      },
      {
        title: '支付方式',
        dataIndex: 'payType',
        key: 'payType',
        width: 120,
      },
      {
        title: '第三方订单号',
        dataIndex: 'plantTradeNo',
        key: 'plantTradeNo',
        width: 200,
      },
      {
        title: '平台订单号',
        dataIndex: 'tradeNo',
        key: 'tradeNo',
        width: 200,
      },
      {
        title: '支付时间',
        dataIndex: 'payTime',
        key: 'payTime',
        width: 200,
      },
    ];

    return (
      <div>
        <Table
          rowKey={record => record.id}
          columns={columns}
          dataSource={data}
          pagination={pagination}
          onChange={this.handleTableChange.bind(this)}
          loading={loading}
          bordered
        />
      </div>
    );
  }
}
