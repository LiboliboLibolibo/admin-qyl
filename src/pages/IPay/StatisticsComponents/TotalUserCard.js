/*eslint-disable*/
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Col } from 'antd';
import _ from 'lodash';
import { Pie, yuan } from '@/components/Charts';

@connect(({ iPayStatistics, loading }) => ({
  iPayStatistics,
  loading: loading.models.iPayStatistics,
}))
export default class TotalUserCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { iPayStatistics: { allData }, styles } = this.props;
    const userList = _.get(allData, 'data.oneCardUsersCountOfCities.data') || [];
    return (
      <Card className={styles.type_card}>
        <div className={styles.type_card_title}>
          一卡通用户总数：
        </div>
        <div className={styles.marquee_box}>
        {!_.isEmpty(userList) &&
          <Pie
            title="总人数"
            subTitle="总人数"
            total={() => (
              <span
                dangerouslySetInnerHTML={{
                  __html: userList.reduce((pre, now) => now.y + pre, 0)
                }}
              />
            )}
            data={userList}
            valueFormat={val => <span dangerouslySetInnerHTML={{ __html: yuan(val) }} />}
            height={248}
          />
        }
        {_.isEmpty(userList) &&
          <div style={{textAlign: 'center', lineHeight: '280px', fontSize: '26px'}}>
            暂无数据
          </div>
        }
        </div>
      </Card>
    );
  }
}
