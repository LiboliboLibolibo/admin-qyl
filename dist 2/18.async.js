(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[18],{EFhy:function(e,t,a){e.exports={treeDiv:"antd-pro-pages-activite-flow-presentation-treeDiv"}},WdYL:function(e,t,a){"use strict";var n=a("TqRt"),l=a("284h");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("+L6B");var o=n(a("2/Rp"));a("14J3");var r=n(a("BMrR"));a("5NDa");var d=n(a("5rEg"));a("jCWc");var i=n(a("kPKH")),s=n(a("pVnL"));a("miYZ");var u=n(a("tsqr")),f=n(a("MVZn")),c=n(a("lwsE")),p=n(a("W8MJ")),h=n(a("a1gu")),y=n(a("Nsbk")),m=n(a("7W2i")),w=n(a("PJYZ"));a("iQDF");var v=n(a("+eQT"));a("OaEy");var g=n(a("2fM7"));a("y8nQ");var k,P,E,x=n(a("Vl3Y")),S=l(a("q1tI")),b=(a("7DNP"),a("MuoO")),C=n(a("v7U9")),I=n(a("fJXk")),R=n(a("LvDl")),T=x.default.Item,M=g.default.Option,N=(v.default.RangePicker,{labelCol:{xs:{span:24},sm:{span:8},md:{span:8}},wrapperCol:{xs:{span:24},sm:{span:16},md:{span:16}}}),F=[{key:0,name:"\u5168\u90e8"},{key:1,name:"\u5426"},{key:2,name:"\u662f"}],D=[{key:0,name:"\u5168\u90e8"},{key:1,name:"\u5bb6\u957f"},{key:2,name:"\u8001\u5e08"}],K=[{key:0,name:"\u5168\u90e8"},{key:1,name:"\u672a\u5f55\u5165"},{key:2,name:"\u5df2\u5f55\u5165\uff0c\u672a\u9001"},{key:3,name:"\u5df2\u5f55\u5165\uff0c\u9001\u4e2d"},{key:5,name:"\u5df2\u5f55\u5165\uff0c\u9001\u5931\u8d25"},{key:6,name:"\u5df2\u5f55\u5165\uff0c\u9001\u6210\u529f"}],L=(k=(0,b.connect)(function(e){var t=e.flowPresentation,a=e.loading;return{flowPresentation:t,loading:a.models.flowPresentation}}),P=x.default.create(),k(E=P(E=function(e){function t(e){var a;return(0,c.default)(this,t),a=(0,h.default)(this,(0,y.default)(t).call(this,e)),a.handleSendFlow=function(){var e=a.props.flowPresentation,t=e.conditionParams,n=e.selectedRowKeys,l=R.default.isEmpty(n)?1:2,o=(0,w.default)((0,w.default)(a));a.props.dispatch({type:"flowPresentation/giveFlow",payload:(0,f.default)({updateFlag:l,flowIds:R.default.isEmpty(n)?"":n.join(",")},t),callback:function(e,a){"success"===e?(o.props.dispatch({type:"flowPresentation/updateState",payload:{selectedRowKeys:[],showConfirmModal:!1}}),u.default.success("\u64cd\u4f5c\u6210\u529f\uff01"),o.props.dispatch({type:"flowPresentation/getDataList",payload:(0,f.default)({},t,{current:1,size:10})})):u.default.success("\u64cd\u4f5c\u5931\u8d25\uff01")}})},a.handleShowConfirmModal=function(){a.props.dispatch({type:"flowPresentation/updateState",payload:{showConfirmModal:!0}})},a.resetForm=function(){var e=a.props.form.resetFields;e()},a.handleSearch=function(e){a.props.dispatch({type:"flowPresentation/getSchoolName",payload:{schoolName:e}})},a.handleSubmit=function(){var e=a.props,t=e.flowPresentation.conditionParams,n=(e.styles,a.props.form.getFieldsValue),l=n();a.props.dispatch({type:"flowPresentation/getDataList",payload:(0,f.default)({},t,l,{current:1,size:10})}),a.props.dispatch({type:"flowPresentation/updateState",payload:{selectedRowKeys:[],conditionParams:(0,f.default)({},t,l)}})},a.handleExport=function(){var e=a.props.flowPresentation.conditionParams,t="schoolId=".concat(e.schoolId?e.schoolId:"","&telNum=").concat(e.telNum?e.telNum:"","&regionId=").concat(e.regionId,"&type=").concat(e.type,"&roleType=").concat(e.roleType,"&giveFlag=").concat(e.giveFlag,"&reward=").concat(e.reward);window.open("http://192.168.12.169:8692/compositions/exportExcel/v1?".concat(t))},a.state={},a}return(0,m.default)(t,e),(0,p.default)(t,[{key:"componentDidMount",value:function(){this.props.onRef&&this.props.onRef(this)}},{key:"render",value:function(){var e=this.props,t=e.flowPresentation,a=(t.cityLists,t.schoolList),n=void 0===a?[]:a,l=(t.countryLists,t.data),u=e.styles,f=!!R.default.isEmpty(l),c=this.props.form.getFieldDecorator,p=n.map(function(e){return S.default.createElement(M,{value:e.id,key:e.id},e.schoolName)});return S.default.createElement("div",null,S.default.createElement(x.default,{style:{overflow:"hidden",clear:"both"}},S.default.createElement(r.default,{gutter:16},S.default.createElement(i.default,{span:"6"},S.default.createElement(T,(0,s.default)({},N,{label:"\u5b66\u6821\u540d\u79f0"}),c("schoolId",{initialValue:""})(S.default.createElement(g.default,{showSearch:!0,placeholder:"\u8f93\u5165\u5b66\u6821\u540d\u79f0",defaultActiveFirstOption:!1,showArrow:!1,filterOption:!1,onSearch:this.handleSearch},p)))),S.default.createElement(i.default,{span:"6"},S.default.createElement(T,(0,s.default)({},N,{label:"\u64cd\u4f5c\u624b\u673a\u53f7:"}),c("telNum",{initialValue:""})(S.default.createElement(d.default,{placeholder:"\u8bf7\u8f93\u5165\u624b\u673a\u53f7"})))),S.default.createElement(i.default,{span:"6"},S.default.createElement(T,(0,s.default)({},N,{label:"\u662f\u5426\u9001\u6d41\u91cf:"}),c("reward",{initialValue:0})(S.default.createElement(g.default,null,F.map(function(e){return S.default.createElement(M,{key:e.key,value:e.key},e.name)}))))),S.default.createElement(i.default,{span:"6"},S.default.createElement(T,(0,s.default)({},N,{label:"\u7c7b\u578b:"}),c("roleType",{initialValue:0})(S.default.createElement(g.default,null,D.map(function(e){return S.default.createElement(M,{key:e.key,value:e.key},e.name)})))))),S.default.createElement(r.default,{gutter:16},S.default.createElement(i.default,{span:"6"},S.default.createElement(T,(0,s.default)({},N,{label:"\u8d60\u9001\u72b6\u6001:"}),c("giveFlag",{initialValue:0})(S.default.createElement(g.default,null,K.map(function(e){return S.default.createElement(M,{key:e.key,value:e.key},e.name)}))))),S.default.createElement(i.default,{span:"18"},S.default.createElement(o.default,{style:{float:"right",marginTop:4,marginLeft:10},disabled:f,type:"primary",onClick:this.handleShowConfirmModal},"\u8d60\u9001\u6d41\u91cf"),S.default.createElement(o.default,{style:{float:"right",marginTop:4,marginLeft:10},disabled:f,onClick:this.handleExport},"\u5bfc\u51fa"),S.default.createElement(o.default,{style:{marginTop:4,float:"right"},type:"primary",onClick:this.handleSubmit},"\u641c\u7d22")))),S.default.createElement(C.default,{styles:u}),S.default.createElement(I.default,{handleSendFlow:this.handleSendFlow,styles:u}))}}]),t}(S.PureComponent))||E)||E);t.default=L},fJXk:function(e,t,a){"use strict";var n=a("TqRt"),l=a("284h");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("2qtc");var o=n(a("kLXV"));a("jCWc");var r,d,i=n(a("kPKH")),s=n(a("lwsE")),u=n(a("W8MJ")),f=n(a("a1gu")),c=n(a("Nsbk")),p=n(a("7W2i")),h=l(a("q1tI")),y=a("MuoO"),m=n(a("LvDl")),w=(r=(0,y.connect)(function(e){var t=e.flowPresentation,a=e.loading;return{flowPresentation:t,loading:a.models.flowPresentation}}),r(d=function(e){function t(e){var a;return(0,s.default)(this,t),a=(0,f.default)(this,(0,c.default)(t).call(this,e)),a.handleOk=function(){a.props.handleSendFlow()},a.handleCancel=function(){a.props.dispatch({type:"flowPresentation/updateState",payload:{showConfirmModal:!1}})},a.state={},a}return(0,p.default)(t,e),(0,u.default)(t,[{key:"render",value:function(){var e=this.props,t=e.flowPresentation,a=t.showConfirmModal,n=t.selectedRowKeys,l=(e.styles,!!m.default.isEmpty(n));return h.default.createElement(o.default,{width:"360px",title:"\u786e\u8ba4\u8d60\u9001\u4eba\u5458\u4fe1\u606f",visible:a,onCancel:this.handleCancel,onOk:this.handleOk},l?h.default.createElement(i.default,{style:{color:"red"}},"\u4f60\u5c06\u5bf9\u4e0b\u9762\u6570\u636e\u5217\u8868\u4e2d\u6240\u6709\u7b26\u5408\u8d60\u9001\u8981\u6c42\u7684\u4eba\u5458\u8d60\u9001\u6d41\u91cf, \u8bf7\u786e\u8ba4!"):h.default.createElement(i.default,{style:{color:"red"}},"\u60a8\u5df2\u9009\u62e9 ",n.length,"\u4eba\u5bf9\u5176\u8d60\u9001\u6d41\u91cf\u3002\u8bf7\u786e\u8ba4!"))}}]),t}(h.PureComponent))||d);t.default=w},jdNz:function(e,t,a){"use strict";var n=a("TqRt"),l=a("284h");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("IzEo");var o=n(a("bx4M"));a("14J3");var r=n(a("BMrR"));a("jCWc");var d,i,s=n(a("kPKH")),u=n(a("ZDp4")),f=n(a("lwsE")),c=n(a("W8MJ")),p=n(a("a1gu")),h=n(a("Nsbk")),y=n(a("7W2i")),m=l(a("q1tI")),w=a("MuoO"),v=(a("7DNP"),n(a("EFhy"))),g=n(a("pJlJ")),k=n(a("WdYL")),P=(n(a("LvDl")),d=(0,w.connect)(function(e){var t=e.flowPresentation,a=e.loading;return{flowPresentation:t,loading:a.models.flowPresentation}}),d(i=function(e){function t(){var e,a;(0,f.default)(this,t);for(var n=arguments.length,l=new Array(n),o=0;o<n;o++)l[o]=arguments[o];return a=(0,p.default)(this,(e=(0,h.default)(t)).call.apply(e,[this].concat(l))),a.clearForm=function(){a.child.resetForm()},a.onRef=function(e){a.child=e},a}return(0,y.default)(t,e),(0,c.default)(t,[{key:"render",value:function(){return(0,u.default)(this.props.flowPresentation),m.default.createElement(o.default,null,m.default.createElement(r.default,{gutter:32},m.default.createElement(s.default,{span:"5"},m.default.createElement(g.default,{clearForm:this.clearForm,styles:v.default})),m.default.createElement(s.default,{span:"19"},m.default.createElement(k.default,{onRef:this.onRef,styles:v.default}))))}}]),t}(m.Component))||i),E=P;t.default=E},pJlJ:function(e,t,a){"use strict";var n=a("TqRt"),l=a("284h");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=n(a("pVnL")),r=n(a("RIqP")),d=n(a("MVZn")),i=n(a("lwsE")),s=n(a("W8MJ")),u=n(a("a1gu")),f=n(a("Nsbk")),c=n(a("7W2i")),p=n(a("PJYZ"));a("ozfa");var h,y,m=n(a("MJZm")),w=l(a("q1tI")),v=a("MuoO"),g=(n(a("LvDl")),m.default.TreeNode),k=(h=(0,v.connect)(function(e){var t=e.flowPresentation,a=e.loading;return{flowPresentation:t,loading:a.models.flowPresentation}}),h(y=function(e){function t(e){var a;return(0,i.default)(this,t),a=(0,u.default)(this,(0,f.default)(t).call(this,e)),a.onExpand=function(e){a.props.dispatch({type:"flowPresentation/updateState",payload:{expandedKeys:e}})},a.onLoadData=function(e){var t=a.props.flowPresentation,n=t.expandedKeys,l=(t.checkedKeys,(0,p.default)((0,p.default)(a)));return new Promise(function(t){t(),a.props.dispatch({type:"flowPresentation/atomTrees",payload:{id:e.props.eventKey,type:e.props.dataRef.type},callback:function(t,a){if("success"===t){var o=[];if(a.rows.length>0)o=a.rows.map(function(e){return(0,d.default)({key:e.id,title:e.name,isLeaf:3==e.type},e)}),e.props.dataRef.children=o;else{var i=n.filter(function(t){return t!=e.props.id});l.props.dispatch({type:"flowPresentation/updateState",payload:{expandedKeys:i}})}l.setState({treeData:(0,r.default)(l.state.treeData)})}}})})},a.onSelect=function(e,t){a.props.flowPresentation.conditionParams;a.props.dispatch({type:"flowPresentation/updateState",payload:{selectedKeys:e,conditionParams:{giveFlag:0,roleType:0,reward:0,regionId:t.node.props.dataRef.id,type:t.node.props.dataRef.type}}}),a.props.dispatch({type:"flowPresentation/getDataList",payload:{giveFlag:0,roleType:0,reward:0,regionId:t.node.props.dataRef.id,type:t.node.props.dataRef.type}}),a.props.clearForm()},a.renderTreeNodes=function(e){return e.map(function(e){return e.children?w.default.createElement(g,{title:e.title,key:e.key,dataRef:e},a.renderTreeNodes(e.children)):w.default.createElement(g,(0,o.default)({dataRef:e},e))})},a.state={treeData:[{title:"\u6cb3\u5357\u7701",key:"001",type:"1",id:"001",children:[]}]},a}return(0,c.default)(t,e),(0,s.default)(t,[{key:"render",value:function(){var e=this.props,t=e.flowPresentation,a=t.checkedKeys,n=t.selectedKeys,l=void 0===n?["001"]:n,o=t.expandedKeys,r=void 0===o?[]:o,d=e.styles;return w.default.createElement("div",{className:d.treeDiv},w.default.createElement(m.default,{onExpand:this.onExpand,loadData:this.onLoadData,expandedKeys:r,onSelect:this.onSelect,onCheck:this.onCheck,checkedKeys:a,selectedKeys:l},this.renderTreeNodes(this.state.treeData)))}}]),t}(w.PureComponent))||y);t.default=k},v7U9:function(e,t,a){"use strict";var n=a("TqRt"),l=a("284h");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("g9YV");var o,r,d=n(a("wCAj")),i=n(a("MVZn")),s=n(a("lwsE")),u=n(a("W8MJ")),f=n(a("a1gu")),c=n(a("Nsbk")),p=n(a("7W2i")),h=l(a("q1tI")),y=(a("7DNP"),a("MuoO")),m=(n(a("LvDl")),o=(0,y.connect)(function(e){var t=e.flowPresentation,a=e.loading;return{flowPresentation:t,loading:a.models.flowPresentation}}),o(r=function(e){function t(e){var a;return(0,s.default)(this,t),a=(0,f.default)(this,(0,c.default)(t).call(this,e)),a.onRowSelectionChange=function(e,t){a.props.dispatch({type:"flowPresentation/updateState",payload:{selectedRowKeys:e}})},a.state={},a}return(0,p.default)(t,e),(0,u.default)(t,[{key:"handleTableChange",value:function(e){var t=this.props.flowPresentation.conditionParams;this.props.dispatch({type:"flowPresentation/getDataList",payload:(0,i.default)({},t,{current:e.current,size:e.pageSize})})}},{key:"render",value:function(){var e=this.props,t=e.flowPresentation,a=t.pagination,n=t.loading,l=t.data,o=void 0===l?[]:l,r=t.selectedRowKeys,i=(e.styles,[{title:"\u5e8f\u53f7",dataIndex:"sort",key:"sort",width:70,fixed:"left",render:function(e,t,a){return h.default.createElement("span",null,a+1)}},{title:"\u5b66\u6821",dataIndex:"schoolName",key:"schoolName",width:200,fixed:"left"},{title:"\u59d3\u540d",dataIndex:"userName",key:"userName",width:80,fixed:"left"},{title:"\u662f\u5426\u6709\u5956\u52b1",dataIndex:"rewardString",key:"rewardString",width:120},{title:"\u64cd\u4f5c\u624b\u673a\u53f7",dataIndex:"userTel",key:"userTel",width:180},{title:"\u6d41\u91cf\u989d\u5ea6",dataIndex:"flowQuota",key:"flowQuota",width:100},{title:"\u5e74\u7ea7",dataIndex:"gradeName",key:"gradeName",width:120},{title:"\u73ed\u7ea7",dataIndex:"className",key:"className",width:120},{title:"\u7c7b\u578b",dataIndex:"roleTypeString",key:"roleTypeString",width:80},{title:"\u8fbe\u6807\u65f6\u95f4",dataIndex:"createTime",key:"createTime",width:200},{title:"\u9700\u8d60\u9001\u624b\u673a\u53f7",dataIndex:"giveTel",key:"giveTel",width:180},{title:"\u8d60\u9001\u72b6\u6001",dataIndex:"giveFlagString",key:"giveFlagString",width:100},{title:"\u8d60\u9001\u65f6\u95f4",dataIndex:"sendTime",key:"sendTime",width:200},{title:"\u662f\u5426\u53ef\u8d60\u9001",dataIndex:"active",key:"active",width:120,fixed:"right",render:function(e,t,a){return h.default.createElement("span",null,t&&2==t.giveFlag?h.default.createElement("span",null,"\u662f"):h.default.createElement("span",null,"\u5426"))}}]),s={selectedRowKeys:r,onChange:this.onRowSelectionChange,getCheckboxProps:function(e){return{disabled:2!=e.giveFlag||1==e.reward}}};return h.default.createElement(d.default,{rowKey:function(e){return e.flowId},columns:i,dataSource:o,rowSelection:s,pagination:a,onChange:this.handleTableChange.bind(this),scroll:{x:1930},loading:n,bordered:!0})}}]),t}(h.PureComponent))||r);t.default=m}}]);