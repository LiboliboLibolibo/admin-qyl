/*eslint-disable*/
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button, Upload, Icon, Input, message, Select, Radio, Row, Col, DatePicker } from 'antd';
import { EditorState, convertToRaw, convertFromRaw, ContentState, editorContent } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import moment from 'moment';
const { RangePicker } = DatePicker;
import { routerRedux } from 'dva/router';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import _ from 'lodash';

const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
    md: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
    md: { span: 18 },
  },
};
let initHtml = '<p></p>';
const initFromHTML = htmlToDraft(initHtml);
const conState = ContentState.createFromBlockArray(
  initFromHTML.contentBlocks,
  initFromHTML.entityMap
);

@connect(({ activityCreate, loading }) => ({
  activityCreate,
  loading: loading.models.activityCreate,
}))
@Form.create()
export default class FormCompontent extends PureComponent {
  state = {
    startTime: '',
    endTime: '',
    loading: false,
  };

  componentWillMount() {
    if(sessionStorage.getItem('editParams')) {
      let editParams = JSON.parse(sessionStorage.getItem('editParams')); 
      let editContents =  editParams.contents;
      if(editContents) {
        const blocksFromHTML = htmlToDraft(editContents);
        const state = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        );
        this.setState({
          editorState: EditorState.createWithContent(state),
        })
        this.props.dispatch({
          type: 'activityCreate/updateState',
          payload: {
            isUpdate: sessionStorage.getItem('editParams')== ''?false : true,
          },
        })
      }  
    } 
  }

  // 活动时间发生变化
  handleActiiteTimeChange = (date, dateString) => {
    this.setState({
      startTime: dateString[0],
      endTime: dateString[1],
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }

  // 点击保存
  handleSave = (e) => {
    const { activityCreate: { themeImgUrl, submitTreeData, harfAndCheckedKeys, checkedKeys } } = this.props;
    let _this = this;
    const { editorState, startTime, endTime } = this.state;
    let templateContent = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    e.preventDefault();
    
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(_.isEmpty(submitTreeData)) {
          message.error('请检查活动对象是否勾选');
          return
        }
        if(_.isEmpty(themeImgUrl)) {
          message.error('请检查主题图片是否上传');
          return
        }
        if(templateContent.replace(/\s/g, '') == `<p></p>`) {
          message.error('请检查活动内容是否填写');
          return
        }
        this.setState({loading: true})
        let pueryParams = {
          treeNode: submitTreeData,
          contents: templateContent,
          startTime: startTime,
          endTime: endTime,
          targets: values.targets,
          top: values.top,
          picUrl: values.picUrl,
          activityName: values.activityName,
          areaids: harfAndCheckedKeys,
        }
        this.props.dispatch({
          type: 'activityCreate/v1',
          payload: {
            ...pueryParams,
          },
          callback(type, ret) {
            _this.setState({loading: false})
            if(type=='success') {
              message.success('活动创建成功！');
              _this.setState({
                editorState: EditorState.createEmpty(),
              });
              _this.props.form.resetFields();
              _this.props.dispatch({
                type: 'activityCreate/updateState',
                payload: {
                  themeImgUrl: '',
                  checkedKeys: [],
                },
              });
            } else {
              message.error('活动创建失败！');
            }
          },
        });   
      }
    });
  };

  // 修改活动的保存
  handleEdit = (e) => {
    const { activityCreate: { themeImgUrl, submitTreeData, harfAndCheckedKeys, checkedKeys } } = this.props;
    let _this = this;
    const { editorState, startTime, endTime } = this.state;
    let templateContent = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    e.preventDefault();
    
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let editParams = JSON.parse(sessionStorage.getItem('editParams')); 
        let [
          editAreaids, 
          editPicUrl,
          editStartTime,
          editEndTime,
          editId
        ] = [
          editParams.areaids,
          editParams.picUrl,
          editParams.startTime,
          editParams.endTime,
          editParams.activityId,
        ]; 
        if(_.isEmpty(submitTreeData)&&!editAreaids) {
          message.error('请检查活动对象是否勾选');
          return
        }
        if(_.isEmpty(themeImgUrl)&&!editPicUrl) {
          message.error('请检查主题图片是否上传');
          return
        }
        if(templateContent.replace(/\s/g, '') == `<p></p>`) {
          message.error('请检查活动内容是否填写');
          return
        }
        this.setState({loading: true})
        let pueryParams = {
          treeNode: !_.isEmpty(submitTreeData)? submitTreeData : '',
          contents: templateContent,
          startTime: startTime? startTime : editStartTime,
          endTime: endTime? endTime : editEndTime,
          targets: values.targets,
          top: values.top,
          picUrl: values.picUrl,
          activityName: values.activityName,
          areaids: harfAndCheckedKeys,
          id: editId
        }
        this.props.dispatch({
          type: 'activityCreate/updateActive',
          payload: {
            ...pueryParams,
          },
          callback(type, ret) {
            _this.setState({loading: false})
            if(type=='success') {
              message.success('活动修改成功！');
              _this.props.dispatch(
                routerRedux.push({
                  pathname: '../activite/activity-management',
                })
              );
              _this.props.dispatch({
                type: 'activityCreate/updateState',
                payload: {
                  isUpdate: false,
                },
              });
            } else {
              message.error('活动修改失败！');
            }
          },
        });   
      }
    });
  };

  // 复用活动
  handleMultiplex = (e) => {
    const { activityCreate: { themeImgUrl, submitTreeData, harfAndCheckedKeys, checkedKeys } } = this.props;
    let _this = this;
    const { editorState, startTime, endTime } = this.state;
    let templateContent = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let editParams = JSON.parse(sessionStorage.getItem('editParams')); 
        let [
          editAreaids, 
          editPicUrl,
          editStartTime,
          editEndTime,
        ] = [
          editParams.areaids,
          editParams.picUrl,
          editParams.startTime,
          editParams.endTime,
        ]; 
        if(_.isEmpty(submitTreeData)) {
          message.error('请检查活动对象是否勾选');
          return
        }
        if(_.isEmpty(themeImgUrl)&&!editPicUrl) {
          message.error('请检查主题图片是否上传');
          return
        }
        if(templateContent.replace(/\s/g, '') == `<p></p>`) {
          message.error('请检查活动内容是否填写');
          return
        }
        this.setState({loading: true})
        let pueryParams = {
          treeNode: !_.isEmpty(submitTreeData)? submitTreeData : '',
          contents: templateContent,
          startTime: startTime? startTime : editStartTime,
          endTime: endTime? endTime : editEndTime,
          targets: values.targets,
          top: values.top,
          picUrl: values.picUrl,
          activityName: values.activityName,
          areaids: harfAndCheckedKeys,
        }
        this.props.dispatch({
          type: 'activityCreate/v1',
          payload: {
            ...pueryParams,
          },
          callback(type, ret) {
            _this.setState({loading: false})
            if(type=='success') {
              message.success('活动复用成功！');
              _this.props.dispatch(
                routerRedux.push({
                  pathname: '../activite/activity-management',
                })
              );
              _this.props.dispatch({
                type: 'activityCreate/updateState',
                payload: {
                  isUpdate: false,
                },
              });
            } else {
              message.error('活动复用失败！');
            }
          },
        });   
      }
    });
  };

  // 前端删除主题图片
  deleteArtilceThemePic = () => {
    this.props.dispatch({
      type: 'activityCreate/updateState',
      payload: {
        themeImgUrl: '',
      },
    });
  };

  // 图片发生变化
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
        })
      );
    }
  };

  // 编辑富文本编辑框里的内容更改editorState
  onEditorStateChange = editorState => {
    this.setState({
      editorState,
    });
  };

  // 富文本上传图片
  uploadImageCallBack = file => {
    const { activityCreate: { } } = this.props;
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/activities/uploadPic/v1');
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
      xhr.setRequestHeader('Access-Control-Allow-Headers', 'X-Requested-With');
      xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
      const data = new FormData();
      data.append('img', file);
      xhr.send(data);
      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText);
        resolve({ data: { link: response.picUrl } });
      });
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    });
  };

  // 更改图片
  onChange = info => {
    if (info.file.status !== 'uploading') {
    }
    if (info.file.status === 'done') {
      const { activityCreate: { themeImgUrl }  } = this.props;
      message.success(`${info.file.name} 上传成功！`);
      this.props.dispatch({
        type: 'activityCreate/updateState',
        payload: {
          themeImgUrl: info.file.response.picUrl,
        },
      });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败！.`);
    }
  };

  // 点击取消判断是新增的取消还是修改的取消，新增取消清空form清空树，修改取消跳回列表页
  handleCancel = () => {
    const { activityCreate: { isUpdate } } = this.props;
    const { resetFields } = this.props.form;
    const { editorState } = this.state;
    if(isUpdate) {
      this.props.dispatch(
        routerRedux.push({
          pathname: '../activite/activity-management',
        })
      );
    } else {
      resetFields();
      this.setState({
        editorState: EditorState.createEmpty(),
      });
    }
  }

  render() {
    const { activityCreate: { themeImgUrl, submitTreeData, isUpdate=false }, styles } = this.props;
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const { editorState } = this.state;
    let [
      editPicUrl,
      editStartTime,
      editEndTime,
      editActivityName,
      editTargets,
      editTop,
    ] = [];
    let multiplex = false;
    if(isUpdate&&sessionStorage.getItem('editParams')) {
      let editParams = JSON.parse(sessionStorage.getItem('editParams'));
      let Multiplex = JSON.parse(sessionStorage.getItem('editParams')).multiplex; 
      [
        editPicUrl,
        editStartTime,
        editEndTime,
        editActivityName,
        editTargets,
        editTop,
      ] = [
        editParams.picUrl,
        editParams.startTime,
        editParams.endTime,
        editParams.activityName,
        editParams.targets,
        editParams.top,
      ]; 
      multiplex = Multiplex;
    }
    const props = {
      name: 'img',
      action: '/activities/uploadPic/v1',
      headers: {
        authorization: 'authorization-text',
      },
      data: {
      },
      showUploadList: false,
    };

    return (
      <div>
        <Row>
          <Form>
            <Col span='12'>
              <Row>
                <div>
                  <Col span="24">
                    <FormItem {...formItemLayout} label="活动名称:">
                      {getFieldDecorator('activityName', {
                        rules: [{ required: true, message: '请输入活动名称！' }],
                        initialValue: isUpdate&&editActivityName? editActivityName : '',
                      })(
                        <Input style={{ width: 200 }} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span="24">
                    <FormItem {...formItemLayout} label="活动时间:">
                      {getFieldDecorator('activeTime', {
                        rules: [{ required: true, message: '请选择活动时间！' }],
                        initialValue: isUpdate&&editStartTime&&editEndTime?  [moment(editStartTime, dateFormat), moment(editEndTime, dateFormat)] : [],
                        onChange: this.handleActiiteTimeChange,
                      })(
                        <RangePicker style={{ width: 260 }} showTime />
                      )}
                    </FormItem>
                  </Col>
                  <Col span="24">
                    <FormItem {...formItemLayout} label="对象:">
                      {getFieldDecorator('targets', {
                        rules: [{ required: true, message: '请选择发送对象' }],
                        initialValue: isUpdate&&editTargets? Number(editTargets) : '',
                      })(
                        <RadioGroup>
                          <Radio value={0}>所有学生</Radio>
                          <Radio value={1}>仅小记者</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>
                  <Col span="24">
                    <FormItem {...formItemLayout} label="是否置顶:">
                      {getFieldDecorator('top', {
                        rules: [{ required: true, message: '选择是否置顶' }],
                        initialValue: isUpdate&&editTop? Number(editTop) : '',
                      })(
                        <RadioGroup>
                          <Radio value={1}>是</Radio>
                          <Radio value={0}>否</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>
                  <Col span="24">
                    <FormItem {...formItemLayout} label="主题图片:">
                      {getFieldDecorator('picUrl', {
                        initialValue: isUpdate&&editPicUrl? editPicUrl : themeImgUrl,
                      })(<Input style={{ width: 240, display: 'none' }} />)}
                      <span>
                        <div className={styles.imgShowDiv}>
                        {(isUpdate || !_.isEmpty(themeImgUrl)) && <img src={isUpdate&&editPicUrl? editPicUrl : themeImgUrl} alt="主题图片" />}
                        </div>
                        <Col>
                          <Col span="5">
                            <Upload {...props} onChange={this.onChange}>
                              <Button size="small" style={{ marginRight: 10 }}>
                                <Icon type="upload" /> 添加图片
                              </Button>
                            </Upload>
                          </Col>
                          <Col style={{ marginLeft: 10 }} span="5">
                            <Button onClick={this.deleteArtilceThemePic} size="small" type="danger">
                              <Icon type="delete" />移除图片
                            </Button>
                          </Col>
                        </Col>
                      </span>
                    </FormItem>
                  </Col>
                </div>
              </Row>
            </Col>
            <Col span='12'>
              <FormItem {...formItemLayout} className={styles.contentLabel} label="内容:">
                {getFieldDecorator('articleContent', {
                  initialValue: '',
                })(<Input style={{ width: 240, display: 'none' }} />)}
              </FormItem>
              <div style={{ minHeight: 560, border: '1px solid #ddd' }}>
                <Editor
                  editorState={editorState}
                  wrapperClassName="wrapper-class"
                  editorClassName="editor-class"
                  toolbarClassName="toolbar-class"
                  localization={{ locale: 'zh' }}
                  placeholder=" 请输入内容 "
                  onEditorStateChange={this.onEditorStateChange}
                  toolbar={{
                    fontFamily: {
                      options: [
                        '宋体',
                        '黑体',
                        '楷体',
                        '微软雅黑',
                        'Arial',
                        'Georgia',
                        'Impact',
                        'Tahoma',
                        'Times New Roman',
                        'Verdana',
                      ],
                    },
                    image: {
                      uploadCallback: this.uploadImageCallBack,
                    },
                  }}
                />
              </div>
            </Col>
          </Form>
        </Row>
        <Row>
          <Col className={styles.handleAction} span="24">
            <Button loading={this.state.loading} type="primary" onClick={ isUpdate? (multiplex == false? this.handleEdit : this.handleMultiplex) : this.handleSave}>
              确定
            </Button>
            <Button onClick={this.handleCancel}>取消</Button>
          </Col>
        </Row>
      </div>
    );
  }
}
