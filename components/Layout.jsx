

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Link from 'next/link';
// connect withRouter 可以拿到router对象
import { withRouter } from 'next/router';
import getConfig from 'next/config';
import { connect } from 'react-redux';
import { Layout, Input, Icon, Avatar, Tooltip, Dropdown, Menu } from 'antd';

import './Layout.less';
import Container from './Container';
import { logout } from './../store/store';



const { Header, Content, Footer } = Layout;
const { publicRuntimeConfig } = getConfig();

// const Comp = ({ color, children, style }) => <div style={{ color, ...style }}>{children}</div>


function MyLayout({ children, user, logout, router }) {

  const urlQuery = (router.query && router.query.query);
  const [search, setSearch] = useState(urlQuery || '');

  const handleInputChange = useCallback(
    event => {
      setSearch(event.target.value)
    },
    [setSearch]
  );
  const handleInputSearch = useCallback(() => {
    router.push(`/search?query=${search}`);
  }, [search]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout])

  const handelGotoOAuth = useCallback((e) => {
    e.preventDefault();
    axios.get(`/prepare-auth?url=${router.asPath}`).then((resp) => {
      if (resp.status === 200) {
        location.href = publicRuntimeConfig.OAUTH_URL;
      } else {
        console.log('prepare auth failed' + JSON.stringify(resp))
      }
    }).catch((error) => {
      console.log('prepare auth failed' + JSON.stringify(error))
    })
  }, [])

  const userDropDown = (
    <Menu>
      <Menu.Item>
        <a href="javascritp:void(0)" onClick={handleLogout}>登 出</a>
      </Menu.Item>
    </Menu>
  )

  return (
    <Layout>
      <Header>
        <Container renderer={<div className="header-inner" />}>
          <div className="header-left">
            <div className="logo">
              {/* <Link href="/"> */}
              <Icon type="global" />
              {/* </Link> */}
            </div>
            <Input.Search
              placeholder="搜索仓库"
              value={search}
              onChange={handleInputChange}
              onSearch={handleInputSearch}
            />
          </div>
          <div className="header-right">
            <div className="user">
              {user && user.id ? (
                <Dropdown overlay={userDropDown}>
                  <a href='/'>
                    <Avatar size={40} icon="user" src={user.avatar_url} />
                  </a>
                </Dropdown>
              ) : (
                  <Tooltip title="点击登录">
                    <a onClick={handelGotoOAuth}>
                      <Avatar size={40} icon="user" />
                    </a>
                  </Tooltip>

                )}

            </div>
          </div>
        </Container>
      </Header>

      <Content>
        {/* React.createElement */}
        <Container renderer={<div />}>{children}</Container>

        {/* <Container renderer={<Comp style={{ color: 'red' }} />}>{children}</Container> */}
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        Likeness-GitHub ©2019 Created by HEYlime
      </Footer>
    </Layout >
  )

}

export default connect(
  function mapState(state) {
    return {
      user: state.user,
    }
  },
  function mapReducer(dispatch) {
    return {
      logout: () => dispatch(logout()),
    }
  }
)(withRouter(MyLayout));