
import Link from 'next/link';
import Router from 'next/router';
import { Button } from 'antd';

import { connect } from 'react-redux'

// import store from './../store/store';

const BJS = ({ counter, username, rename, add }) => {
  return (
    <>
      <span>count: {counter}</span> <br />
      <a>username: {username}</a> <br />
      <input value={username} onChange={(e) => rename(e.target.value)} /> <br />
      <Button onClick={() => add(counter)} > do add </Button> <br />
    </>
  )
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
)(BJS);