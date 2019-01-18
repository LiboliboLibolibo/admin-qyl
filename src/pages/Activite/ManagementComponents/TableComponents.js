/*eslint-disable*/
import React, { PureComponent } from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import _ from 'lodash';
import { Card, Button, Row, Col, Table, Divider, Popconfirm, message, Tooltip } from 'antd';
import ShowDetailModal from './ShowDetailModal';
import ShowResultModal from './ResultModal';
import JoinStudentModal from './JoinStudentModal';
@connect(({ activityManagement, loading }) => ({
  activityManagement,
  loading: loading.models.activityManagement,
}))
export default class TableComponents extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 展示当前活动的详情
  showActiviteDetailModal = (e, record) => {
    this.props.dispatch({
      type: 'activityManagement/updateState',
      payload: {
        showDetailModal: true,
        detailRecord: record,
      },
    })
  }

  // 删除当前的活动
  handleDeleteActivite = (e, record) => {
    let _this = this;
    this.props.dispatch({
      type: 'activityManagement/deleteActivite',
      payload: {
        id: record.activityId,
      },
      callback(type, msg) {
        if(type == 'success') {
          message.success('活动删除成功！');
          _this.props.dispatch({
            type: 'activityManagement/v1',
            payload: {
              cityId: 0,
              countyId: 0,
              targets: 2,
              commitFlag: 2,
            },
          });
        } else {
          message.error(msg);
        }
      }
    })
  }

  // 上架或者下架
  hadleUpperOrLower = (e, record) => {
    const { activityManagement: { conditionParams } } = this.props;
    let _this = this;
    this.props.dispatch({
      type: 'activityManagement/upperOrLower',
      payload: {
        id: record.activityId,
        commitFlag: record.commitFlag == '1'? '0' : '1',
      },
      callback(type, msg) {
        if(type == 'success') {
          message.success('操作成功！');
          _this.props.dispatch({
            type: 'activityManagement/v1',
            payload: {
              ...conditionParams,
            },
          });
        } else {
          message.error(msg);
        }
      }
    })
  }

  // 添加或者修改活动结果
  showResultModal = (e, record, type) => {
    this.props.dispatch({
      type: 'activityManagement/updateState',
      payload: {
        showResultModal: true,
        resultRecord: record,
      },
    }); 
  }

  // 点击修改活动
  handleEdit = (e, record) => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '../activite/activity-create',
        query: {
          editParams: {
            multiplex: false,
            ...record,
          }
        },
      })
    );
  }

  // 点击复用活动
  handleMultiplex = (e, record) => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '../activite/activity-create',
        query: {
          editParams: {
            multiplex: true,
            ...record,
          }
        },
      })
    );
  }

  // 展示学生弹出框列表
  handleShowStudentModal = (e, record) => {
    this.props.dispatch({
      type: 'activityManagement/joinStudent',
      payload: {
        activityId: record.activityId,
        current: 1,
        size: 10,
      },
    }); 
    this.props.dispatch({
      type: 'activityManagement/updateState',
      payload: {
        joinStudentRecord: record,
        showStudentModal: true,
        studentConditionParams: {
          activityId: record.activityId,
        },
      },
    }); 
  }

  // 分页
  handleTableChange(page) {
    const { activityManagement: { conditionParams } } = this.props;
    this.props.dispatch({
      type: 'activityManagement/v1',
      payload: {
        ...conditionParams,
        current: page.current,
        size: page.pageSize,
      },
    }); 
    this.props.dispatch({
      type: 'activityManagement/updateState',
      payload: {
        conditionParams:{
          current: page.current,
          size: page.pageSize,
          ...conditionParams,          
        }
      },
    }); 
  }
  render() {
    const { activityManagement: { pagination, loading, data }, styles } = this.props;

    const columns = [
      {
        title: '序号',
        dataIndex: 'sort',
        key: 'sort',
        width: 60,
        render: (text, record, index) => {
          return <span>{index + 1}</span>;
        },
      },
      {
        title: '活动名称',
        dataIndex: 'activityName',
        key: 'activityName',
        width: 140,
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
        width: 120,
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        width: 120,
      },
      {
        title: '区域',
        dataIndex: 'areas',
        key: 'areas',
        width: 220,
        render: (text, record, index) => {
          return (<Tooltip placement="topLeft" title={ text }>
            <span>{text.length > 14? text.substring(0,14)+'...' : text}</span>
          </Tooltip>)
           
        },
      },
      {
        title: '对象',
        dataIndex: 'targets',
        key: 'targets',
        width: 80,
        render: (text, record, index) => {
          return <span>{text == 0? '所有学生' : '仅小记者'}</span>;
        },
      },
      {
        title: '是否置顶',
        dataIndex: 'top',
        key: 'top',
        width: 80,
        render: (text, record, index) => {
          return <span>{text == 0? '未置顶' : '置顶'}</span>;
        },
      },
      {
        title: '上架时间',
        dataIndex: 'commitTime',
        key: 'commitTime',
        width: 120,
        render: (text, record, index) => {
          return <span>{text? text : '----'}</span>;
        },
      },
      {
        title: '启用状态',
        dataIndex: 'commitFlag',
        key: 'commitFlag',
        width: 80,
        render: (text, record, index) => {
          return <span>{text == 0? '下架' : '上架'}</span>;
        },
      },
      {
        title: '已参加人数',
        dataIndex: 'joinNums',
        key: 'joinNums',
        width: 90,
        render: (text, record) => {
          return (text && text>0?
            <a onClick={(e) => this.handleShowStudentModal(e,record)} href='javascript:;'>{text}</a>
            : <span>{text}</span>
          )
        },
      },
      {
        title: '成果展示',
        dataIndex: 'resultFlag',
        key: 'resultFlag',
        width: 80,
        render: (text, record, index) => {
          return <span>{text == 0? '----' : (text==1? <a onClick={(e) => this.showResultModal(e, record, 'edit')} href='javascript:;'>修改</a> 
          : <a onClick={(e) => this.showResultModal(e, record, 'add')} href='javascript:;'>新增</a>)}</span>;
        },
      },
      {
        title: '操作',
        dataIndex: 'active',
        key: 'active',
        width: 200,
        render: (text, record, index) => {
          return (
            <span>
              <a onClick={(e) => this.showActiviteDetailModal(e, record)} href="javascript:;">预览</a> {' '}|{' '}
              <a onClick={(e) => this.handleMultiplex(e, record)} style={{ color: '#886600' }} href="javascript:;">复用</a>{' '}|{' '}
              <a disabled={record.commitFlag == 1? true : false} onClick={(e) => this.handleEdit(e, record)} style={{ color: '#669933' }} href="javascript:;">修改</a>{' '}|{' '}
              <Popconfirm title="确定删除本条活动?" onConfirm={(e) => this.handleDeleteActivite(e, record)} okText="确定" cancelText="取消">
                <a disabled={record.commitFlag == 1? true : false} style={{ color: 'red' }} href="javascript:;">删除</a>
              </Popconfirm>
              {' '}|{' '}
              <a onClick={(e) => this.hadleUpperOrLower(e, record)} href="javascript:;">{record &&  record.commitFlag == 1? '下架' : '上架'}</a>
            </span>  
          )
        }
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
        <ShowDetailModal styles={styles} />
        <ShowResultModal styles={styles} />
        <JoinStudentModal styles={styles} />
      </div>
    );
  }
}
