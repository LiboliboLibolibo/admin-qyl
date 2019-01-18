import React, { Component } from 'react';
import { Card, Button, Col, Row, Tabs } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './ActivityManagement.less';
import _ from 'lodash';
import SearchForm from './ManagementComponents/SearchForm';
import TableComponents from './ManagementComponents/TableComponents';
@connect(({ activityManagement, loading }) => ({
  activityManagement,
  loading: loading.models.activityManagement,
}))
class ActivityManagement extends Component {

  componentWillMount(){
  }
  hadleLinkToCreate = () => {
    sessionStorage.setItem('editParams', '');
    this.props.dispatch(
      routerRedux.push({
        pathname: '../activite/activity-create',
      })
    );
  }

  render() {
    const { activityManagement: {  } } = this.props;
    return (
      <Card>
        <Col className={styles.createAcitvite} size='large' span='24'><Button onClick={this.hadleLinkToCreate} type='primary' >新建活动</Button></Col>
        <SearchForm styles={styles} />
        <div>
          <TableComponents styles={styles} /> 
        </div>
      </Card>
    );
  }
}

export default ActivityManagement;
