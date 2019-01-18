/*eslint-disable*/
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Tree, Divider } from 'antd';
import _ from 'lodash';
const TreeNode = Tree.TreeNode;
@connect(({ activityCreate, loading }) => ({
  activityCreate,
  loading: loading.models.activityCreate,
}))
export default class AreaTree extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [
        { title: '河南省', key: '001', type: '1', children: [] },
      ],
    };
  }

  onExpand = (expandedKeys) => {
    this.props.dispatch({
      type: 'activityCreate/updateState',
      payload: {
        expandedKeys,
      },
    })
  };


  onCheck = (checkedKeys, info) => {
    const { submitTreeData,  } = this.state;
    // 判断如果是全选省
    if(checkedKeys.indexOf('001') > -1) {
      this.props.dispatch({
        type: 'activityCreate/updateState',
        payload: {
          submitTreeData: ['001-河南省-1'],
          harfAndCheckedKeys: checkedKeys.join(','),
          checkedKeys: checkedKeys,
        },
      })
    } else {
      let paramsArr = info.checkedNodes.map(c => {
        return `${c.props.dataRef.id}-${c.props.dataRef.name}-${c.props.dataRef.type}`
      })
      this.props.dispatch({
        type: 'activityCreate/updateState',
        payload: {
          submitTreeData: paramsArr,
          harfAndCheckedKeys: checkedKeys.join(','),
          checkedKeys: checkedKeys,
        },
      })
    }
  }

  onLoadData = (treeNode) => {
    const { activityCreate: { expandedKeys, checkedKeys } } = this.props;
    let _this = this;
    return new Promise((resolve) => {
      resolve();
      this.props.dispatch({
        type: 'activityCreate/atomTrees',
        payload: {
          id: treeNode.props.eventKey,
          type: treeNode.props.dataRef.type,
        },
        callback(type, ret) {
          if (type === 'success') {
            let data = [];
            if (ret.rows.length>0) {
              data = ret.rows.map(td => {
                return {
                  key: td.id,
                  title: td.name,
                  isLeaf: td.type == 5? true : false,
                  ...td,
                }
              })
              treeNode.props.dataRef.children = data;
              _this.props.dispatch({
                type: 'activityCreate/updateState',
                payload: {
                  checkedKeys: [...checkedKeys],
                },
              })
            } else {
              let filterExpandedKeys = expandedKeys.filter(e => e != treeNode.props.id)
              _this.props.dispatch({
                type: 'activityCreate/updateState',
                payload: {
                  expandedKeys: filterExpandedKeys,
                },
              })
            }
            _this.setState({
              treeData: [..._this.state.treeData],
            })
          }
        },
      });
    });    
  }

  renderTreeNodes = treeData => {
    return treeData.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode dataRef={item} {...item} />;
    });
  };

  render() {
    const { activityCreate: { editParams, checkedKeys, selectedKeys = [], expandedKeys = [] }, styles } = this.props;
    return (
      <div className={styles.treeDiv}>
        <Tree
          showLine
          checkable
          onExpand={this.onExpand}
          loadData={this.onLoadData}
          expandedKeys={expandedKeys}
          onCheck={this.onCheck}
          checkedKeys={checkedKeys}
          selectedKeys={selectedKeys}
        >
          {this.renderTreeNodes(this.state.treeData)}
        </Tree>        
      </div>
      
    );
  }
}
