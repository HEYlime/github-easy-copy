import React from 'react';
import createStore from './../store/store'

// 是否是服务端
const isServer = typeof window === 'undefined';
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__';

function getOrCreateStore(initialState) {
  // 服务端
  if (isServer) {
    return createStore(initialState);
  }

  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = createStore(initialState);
  }
  return window[__NEXT_REDUX_STORE__];
}

export default (Comp) => {
  class WithReduxApp extends React.Component {
    constructor(props) {
      super(props);
      this.reduxStore = getOrCreateStore(props.initialReduxState);
    }
    render() {
      const { Component, pageProps, ...rest } = this.props;
      if (pageProps) {
        pageProps.test = '123';
      }
      return <Comp
        Component={Component}
        pageProps={pageProps}
        {...rest}
        reduxStore={this.reduxStore}
      />
    }
  }



  // TestHocComp.getInitialProps = Comp.getInitialProps;
  // next.js方法 getInitialProps 在客户端和服务端渲染都会被执行
  WithReduxApp.getInitialProps = async (ctx) => {
    let reduxStore;

    if (isServer) {
      const { req } = ctx.ctx;
      const session = req.session;

      if (session && session.userInfo) {
        reduxStore = getOrCreateStore({
          user: session.userInfo
        });
      } else {
        reduxStore = getOrCreateStore({})
      }
    } else {
      reduxStore = getOrCreateStore({})
    }

    ctx.reduxStore = reduxStore;

    let appProps = {};
    if (typeof Comp.getInitialProps === 'function') {
      appProps = await Comp.getInitialProps(ctx);
    }

    return {
      ...appProps,
      initialReduxState: reduxStore.getState()
    }

  }
  return WithReduxApp;
}