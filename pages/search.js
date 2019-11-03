
import { useCallback, memo, isValidElement, useEffect } from 'react';
import Router, { withRouter } from 'next/router';
import { Row, Col, List, Pagination } from 'antd';
import Link from 'next/link';

import Repo from './../components/Repo';
import { cacheArray } from './../lib/repo-basic-cache';

const api = require('./../lib/api');

const LANGUAGES = ['Javasript', 'HTML', 'CSS', 'TypeScript', 'JAVA', 'C'];
const SORT_TYPES = [
  {
    name: 'Best Match'
  },
  {
    name: 'Most Stars',
    value: 'stars',
    order: 'desc'
  },
  {
    name: 'Fewest Stars',
    value: 'stars',
    order: 'asc'
  },
  {
    name: 'Most Forks',
    value: 'forks',
    order: 'desc'
  },
  {
    name: 'Fewest Forks',
    value: 'forks',
    order: 'asc'
  }
]

const selectedItemStyle = {
  borderLeft: '2px solid #e36209',
  fontWeight: 100
}
const per_page = 10;

const FilterLink = ({ name, query, lang, sort, order, page }) => {
  // const doSearch = () => {
  //   Router.push({
  //     pathname: '/search',
  //     query: {
  //       lang,
  //       query,
  //       sort,
  //       order
  //     }
  //   })
  // }
  let queryString = `?query=${query}`;
  if (lang) {
    queryString += `&lang=${lang}`;
  }
  if (sort) {
    queryString += `&sort=${sort}&order=${order || 'desc'}`;
  }
  if (page) {
    queryString += `&page=${page}`
  }
  queryString += `&per_page=${per_page}`
  return (
    <Link href={`/search${queryString}`}>
      {
        isValidElement(name) ? name : <a>{name}</a>
      }
    </Link>
  );
}

const noop = () => {

}

/**
 *  query: 
 *  sort: 排序方式
 *  order: 排序顺序
 *  lang: 仓库的项目开发语言
 *  page: 分页页面
 */
const isServer = typeof window === 'undefined';
function Search({ router, repos }) {
  const { sort, order, lang, page } = router.query;
  const { ...querys } = router.query;

  useEffect(() => {
    if (!isServer) {
      cacheArray(repos.items)
    }
  })

  return (
    <div className='root'>
      <Row gutter={20}>
        <Col span={6}>
          <List
            bordered
            header={<span className="list-header">语言</span>}
            style={{ marginBottom: 20 }}
            dataSource={LANGUAGES}
            renderItem={(item) => {
              let selected = lang === item;
              return (
                <List.Item style={selected ? selectedItemStyle : null}>
                  {/* <a onClick={() => doSearch({
                    query,
                    lang: item,
                    sort,
                    order,
                  })}>{item}</a> */}
                  {
                    selected ?
                      <span>{item}</span>
                      :
                      <FilterLink
                        {...querys}
                        name={item}
                        lang={item} />
                  }
                </List.Item>
              )
            }}
          ></List>
          <List
            bordered
            header={<span className="list-header">排序</span>}
            style={{ marginBottom: 20 }}
            dataSource={SORT_TYPES}
            renderItem={(item) => {
              let selected = false;
              if (item.name === 'Best Match' && !sort) {
                selected = true;
              } else if (item.value === sort && item.order === order) {
                selected = true;
              }
              return (
                <List.Item style={selected ? selectedItemStyle : null}>
                  {
                    selected ?
                      <span>{item.name}</span>
                      :
                      <FilterLink
                        {...querys}
                        name={item.name}
                        sort={item.value || ''}
                        order={item.order || ''} />
                  }

                </List.Item>
              )
            }}
          ></List>
        </Col>
        <Col span={18}>
          <h3 className="repos-title">{repos.total_count} 个仓库</h3>
          {
            repos.total_count > 0 ?
              repos.items.map((repo) => {
                return (
                  <Repo key={repo.id} repo={repo} />
                )

              }) : null
          }
          <div className="pagination">
            <Pagination
              pageSize={per_page}
              current={Number(page) || 1}
              total={repos.total_count > 1000 ? 1000 : repo.total_count}
              onChange={noop}
              itemRender={(page, type, ol) => {
                const p = type === 'page' ? page : type === 'prev' ? page - 1 : page + 1;
                const name = type === 'page' ? page : ol;
                return <FilterLink {...querys} page={p} name={name} />
              }}
            ></Pagination>
          </div>
        </Col>
      </Row>
      <style jsx>{`
        .root{
          padding: 20px 0;
        }
        .list-header{
          font-weight: 800;
          font-size: 16px;
          line-height: 50px;
        }
        .pagination{
          padding: 20px;
          text-align: center;
        }
      `}</style>
    </div>
  )
}

Search.getInitialProps = async ({ ctx }) => {
  const { query, sort, order, lang, page } = ctx.query;
  if (!query) {
    return {
      repos: {
        total_count: 0,
        items: []
      }
    }
  }

  // ?q=react+language=scritp&sort=stars&order=desc&page=2
  let queryString = `?q=${query}`;
  if (lang) {
    queryString += `+language:${lang}`;
  }
  if (sort) {
    queryString += `&sort=${sort}&order=${order}`;
  }
  if (page) {
    queryString += `&page=${page}`;
  }
  queryString += `&per_page=${per_page}`

  const result = await api.request(
    {
      url: `/search/repositories${queryString}`
    },
    ctx.req,
    ctx.res
  )
  return {
    repos: result.data
  }

}

export default withRouter(Search);
