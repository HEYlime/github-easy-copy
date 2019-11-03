import App, { Container } from 'next/app';
import { Provider } from 'react-redux';
import Router from 'next/router';
import Link from 'next/link';
import axios from 'axios';


import 'antd/dist/antd.css';
// import MyContext from './../lib/my-context';
import Layout from './.././components/Layout';
import PageLoading from './pageLoading';

import WithReduxApp from '../lib/with-redux';

class MyApp extends App {
  state = {
    value: 'context value',
    loading: false
  }

  startLoading = () => {
    this.setState({
      loading: true
    })
  }
  stopLoading = () => {
    this.setState({
      loading: false
    })
  }

  componentDidMount() {
    Router.events.on('routeChangeStart', this.startLoading);
    Router.events.on('routeChangeComplete', this.stopLoading);
    Router.events.on('routeChangeError', this.stopLoading);

  }
  componentWillUnmount() {
    Router.events.off('routeChangeStart', this.startLoading);
    Router.events.off('routeChangeComplete', this.stopLoading);
    Router.events.off('routeChangeError', this.stopLoading);
  }

  static async getInitialProps(ctx) {
    const { Component } = ctx;
    let pageProps;
    console.log('app init');
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return {
      pageProps
    }
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props;
    return (
      <Container>
        <Provider store={reduxStore}>
          {this.state.loading ? <PageLoading /> : null}
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </Container>
    )
  }
}

export default WithReduxApp(MyApp)