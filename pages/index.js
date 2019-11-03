import { useEffect } from 'react';
import { Button, Icon, Tabs } from 'antd';
import getConfig from 'next/config';
import { withRouter, Router } from 'next/router';
import { connect } from 'react-redux';
// 缓存策略
import LRU from 'lru-cache';

import Repo from './../components/Repo';

const api = require('./../lib/api');

const { publicRuntimeConfig } = getConfig();

// FUNC2
const cache = new LRU({
  maxAge: 1000 * 60 * 30 // 最长不使用数据的时间
})

const isServer = typeof window === 'undefined';
// 缓存数据
let cachedUserRepos, cachedUserStarredRepos;

function Index({ userRepos, userStarredRepos, user, router }) {
  // console.log(userRepos);
  // console.log(userStarredRepos);

  const tabKey = router.query.key || '1';
  const handleTabChange = (activeKey) => {
    router.push(`/?key=${activeKey}`);
  }

  useEffect(() => {
    if (!isServer) {
      // FUNC1
      // cachedUserRepos = userRepos.data;
      // cachedUserStarredRepos = userStarredRepos.data;
      // FUNC2
      if (userRepos) {
        cache.set('userRepos', userRepos);
      }
      if (userStarredRepos) {
        cache.set('userStarredRepos', userStarredRepos);
      }
      // FUNC3
      // cachedUserRepos = userRepos.data;
      // cachedUserStarredRepos = userStarredRepos.data;
      // const timeout = setTimeout(() => {
      //   cachedUserRepos = null;
      //   cachedUserStarredRepos = null;
      // }, 1000 * 10);
    }
  }, [userRepos, userStarredRepos])

  if (!user || !user.id) {
    return (
      <div className="root">
        <p>请先登录！</p>
        <Button type="primary" href={publicRuntimeConfig.OAUTH_URL}>登录</Button>
        <style jsx>{`
          .root{
            height: 400px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="root">
      <div className="user-info">
        <img src={user.avatar_url} alt="user avatar" className="avatar" />
        <span className="login">{user.login}</span>
        <span className="name">{user.name || 'HEYlime'}</span>
        <span className="bio">{user.bio || '输过败过 不曾怕过'}</span>
        <p className="email">
          <Icon type="mail" style={{ marginRight: 10 }}></Icon>
          <a href={`mailto:${user.email || '1844467642@qq.com'}`}>{user.email || '1844467642@qq.com'}</a>
        </p>
      </div>
      <div className="user-repos">

        <Tabs defaultActiveKey={tabKey} onChange={handleTabChange} animated={false}>
          <Tabs.TabPane tab="你的仓库" key="1">
            {
              userRepos.map((repo) => {
                return (
                  <Repo key={repo.id} repo={repo} />
                )

              })
            }
          </Tabs.TabPane>
          <Tabs.TabPane tab="你关注的仓库" key="2">
            {
              userStarredRepos.map((repo) => {
                return (
                  <Repo key={repo.id} repo={repo} />
                )
              })
            }
          </Tabs.TabPane>
        </Tabs>
      </div>
      <style jsx>{`
        .root{
          padding-top: 20px;
          display: flex;
          align-items: flex-start;
        }
        .user-info{
          width: 200px;
          margin-right: 40px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
        }
        .login{
          font-weight: 800;
          font-size: 20px;
          margin-top: 20px;
        }
        .name{
          font-size: 16px;
          color: #777;
        }
        .bio{
          margin-top: 20px;
          color: #333;
        }
        .avatar{
          width: 100%;
          border-radius: 5px;
        }
        .user-repos{
          flex-grow: 1;
        }
      `}</style>
    </div>
  )
}


Index.getInitialProps = async ({ ctx, reduxStore }) => {
  const user = reduxStore && reduxStore.getState().user;
  if (!user || !user.id) {
    return {
      isLogin: false
    }
  }
  if (!isServer) {
    // FUNC1
    // if (cachedUserRepos && cachedUserStarredRepos) {
    //   return {
    //     userRepos: cachedUserRepos,
    //     userStarredRepos: cachedUserStarredRepos,
    //   }
    // }
    // FUNC2
    if (cache.get('userRepos') && cache.get('userStarredRepos')) {
      return {
        userRepos: cache.get('userRepos'),
        userStarredRepos: cache.get('userStarredRepos'),
      }
    }
    // FUNC3
    // if (cachedUserRepos && cachedUserStarredRepos) {
    //   return {
    //     userRepos: cachedUserRepos,
    //     userStarredRepos: cachedUserStarredRepos,
    //   }
    // }
  }


  const userRepos = await api.request(
    {
      url: '/user/repos'
    },
    ctx.req,
    ctx.res
  );

  const userStarredRepos = await api.request(
    {
      url: '/user/starred'
    },
    ctx.req,
    ctx.res
  );

  return {
    isLogin: true,
    userRepos: userRepos.data,
    userStarredRepos: userStarredRepos.data
  }
}

export default withRouter(connect(
  function mapState(state) {
    return {
      user: state.user
    }
  }
)(Index));