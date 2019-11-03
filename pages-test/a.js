
import { withRouter } from 'next/router';
import getConfig from 'next/config';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import styled from 'styled-components';

// import Comp from './../components/comp';
// 引入异步组件
const Comp = dynamic(import('./../components/comp'))

const Title = styled.h1`
color: yellow;
font-size: 40px;
`;

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const A = ({ router, name, time }) => {
  console.log(serverRuntimeConfig, publicRuntimeConfig)
  return (
    <>
      <Title>this is title {time} {process.env.customKey}</Title>
      <Comp />
      <Link href="#aaa">
        < a > AA {router.query.id}{name}</a >
      </Link>

      <style jsx>{`
        a{
          color: blue;
        }
      `}</style>
      <style jsx global>{`
        p{
          color: pink;
        }
      `}</style>
    </>
  )
}

// 在服务端和客户端都执行
A.getInitialProps = async (ctx) => {

  const moment = await import('moment');// 使用的时候加载 异步加载 需要使用 default 方法

  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: 'jokcy',
        time: moment.default(Date.now() - 60 * 1000).fromNow()
      })
    }, 1000);
  })

  return await promise;
}

export default withRouter(A);