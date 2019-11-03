
import { useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Router from 'next/router';
import { Button } from 'antd';
import { connect } from 'react-redux'
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

import { add } from './../store/store';



const Index = ({ counter, username, rename, add }) => {

  useEffect(() => {
    axios.get('/api/user/info').then((resp) => {
      console.log(resp.data);
    })
  }, [])

  return (
    <>
      <span>count: {counter}</span> <br />
      <a>username: {username}</a> <br />
      <input value={username} onChange={(e) => rename(e.target.value)} /> <br />
      <Button onClick={() => add(counter)} > do add </Button> <br />
      <a href={publicRuntimeConfig.OAUTH_URL} >get github oauth</a>
    </>
  )
}

Index.getInitialProps = async ({ reduxStore }) => {
  reduxStore.dispatch(add(3));
  return {};
}

export default connect(
  // mapStateToProps是一个函数，它接受state作为参数，返回一个对象
  function mapStateToProps(state) {
    return {
      counter: state.counter.count,
      username: state.user.username
    }
  },
  // 可以是一个函数，也可以是一个对象
  // 是函数则会得到dispatch和ownProps（容器组件的props对象）两个参数
  // 是一个对象，它的每个键名也是对应 UI 组件的同名参数，键值应该是一个函数，会被当作 Action creator ，返回的 Action 会由 Redux 自动发出
  function mapDispatchToProps(dispatch) {
    return {
      add: num => dispatch({ type: 'ADD', num }),
      rename: name => dispatch({ type: 'UPDATE_USERNAME', username: name })
    }
  }
)(Index);