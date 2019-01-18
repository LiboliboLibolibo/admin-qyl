/*eslint-disable*/
import React, { Component } from 'react';
import { Card, Button, Col, Row, Tabs } from 'antd';
import { connect } from 'dva';
import styles from './ActivityCreate.less';
import AreaTree from './CreateComponents/AreaTree';
import FormCompontent from './CreateComponents/FormCompontent';
import _ from 'lodash';
@connect(({ activityCreate, loading }) => ({
  activityCreate,
  loading: loading.models.activityCreate,
}))
class ActivityCreate extends Component {


  render() {
    const { activityCreate: {  } } = this.props;
    return (
      <Card className={styles.flex_box}>
        <div style={{width: '18%'}}>
          <AreaTree styles={styles} />
        </div>
        <div style={{width: '82%'}}>
          <FormCompontent styles={styles} />
        </div>
      </Card>
    );
  }
}

export default ActivityCreate;
