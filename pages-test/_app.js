import App, { Container } from 'next/app';
import { Provider } from 'react-redux';

import 'antd/dist/antd.css';
import MyContext from './../lib/my-context';
import Layout from './.././components/Layout';

import WithReduxApp from '../lib/with-redux';


class MyApp extends App {
  state = {
    value: 'context value'
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
        <Layout>
          {/* React-Redux 提供Provider组件，可以让容器组件拿到state */}
          {/* store={reduxStore} */}
          <Provider store={reduxStore}>
            <MyContext.Provider value={this.state.value}>
              <Component {...pageProps} />
              <br />
              <button onClick={() => this.setState({ value: `${this.state.value}...` })}>app.js updateContext</button>
            </MyContext.Provider>
          </Provider>
        </Layout>
      </Container>
    )

  }
}

export default WithReduxApp(MyApp)