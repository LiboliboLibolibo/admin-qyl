/*eslint-disable*/
import React, { PureComponent } from 'react';
import { routerRedux, Route, Switch  } from 'dva/router';
import { connect } from 'dva';
import _ from 'lodash';
import { Table } from 'antd';
import StuListModal from './StuListModal';
@connect(({ paymentParticulars, loading }) => ({
  paymentParticulars,
  loading: loading.models.paymentParticulars,
}))
export default class DetailTableComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      params: {
        type: '',
        recordParams: {},
      },
    };
  }

  // 展示班级缴费人员列表信息
  handleShowStuList = (e, record, stuType) => {
    const { paymentParticulars: { schoolId }, styles } = this.props;
    let itemId = JSON.parse(sessionStorage.getItem('detailParams')).itemId; 
    this.setState({
      params: {
        type: stuType,
        recordParams: record,
      },
    })
    this.props.dispatch({
      type: 'paymentParticulars/stuItems',
      payload: {
        schoolId: schoolId,
        itemId: itemId,
        className: record.className,
        flag: stuType,
      },
    });
    this.props.dispatch({
      type: 'paymentParticulars/updateState',
      payload: {
        showStuListModal: true,
      },
    });
  }

  // 分页
  handleTableChange(page) {
    const { paymentParticulars: { conditionParams, schoolId } } = this.props;
    let itemId = JSON.parse(sessionStorage.getItem('detailParams')).itemId; 
    this.props.dispatch({
      type: 'paymentParticulars/statisticsByClassId',
      payload: {
        ...conditionParams,
        schoolId: schoolId,
        itemId: itemId,
        current: page.current,
        size: 10,
      },
    }); 
  }

  render() {
    const { paymentParticulars: { pagination, data=[], loading }, styles } = this.props;
    const { params } = this.state;
    const columns = [
      {
        title: '年级',
        dataIndex: 'gradeName',
        key: 'gradeName',
        width: 200,
      },
      {
        title: '班级',
        dataIndex: 'className',
        key: 'className',
        width: 200,
      },
      {
        title: '应缴情况',
        children: [{
          title: '应缴金额(元)',
          dataIndex: 'totalMoney',
          key: 'totalMoney',
          width: 160,
        }, {
          title: '应缴人数(人)',
          dataIndex: 'totalCount',
          key: 'totalCount',
          width: 160,
          render: (text, record) => {
            return (<span>{text>0? <a onClick={(e) => this.handleShowStuList(e, record, '0')} href="javascript:;">{text}</a> : text}</span>)
          }
        }],
      },
      {
        title: '实缴情况',
        children: [{
          title: '实缴金额(元)',
          dataIndex: 'payMoney',
          key: 'payMoney',
          width: 160,
        }, {
          title: '实缴人数(人)',
          dataIndex: 'paycount',
          key: 'paycount',
          width: 160,
          render: (text, record) => {
            return (<span>{text>0? <a onClick={(e) => this.handleShowStuList(e, record, '1')} href="javascript:;">{text}</a> : text}</span>)
          }
        }],
      },
      {
        title: '欠缴情况',
        children: [{
          title: '欠缴金额(元)',
          dataIndex: 'notPayMoney',
          key: 'notPayMoney',
          width: 160,
        }, {
          title: '欠缴人数(人)',
          dataIndex: 'notPayCount',
          key: 'notPayCount',
          width: 160,
          render: (text, record) => {
            return (<span>{text>0? <a onClick={(e) => this.handleShowStuList(e, record, '2')} href="javascript:;">{text}</a> : text}</span>)
          }
        }],
      }
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
        <StuListModal styles={styles} params={params}/>
      </div>
    );
  }
}
