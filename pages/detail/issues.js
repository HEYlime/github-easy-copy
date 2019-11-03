
import { useState, useCallback, useEffect } from 'react';
import { Avatar, Button, Select } from 'antd';
import dynamic from 'next/dynamic';
import { formatTime } from './../../lib/utils';

import withRepoBasic from './../../components/with-repo-basic';
import SearchUser from './../../components/SearchUser';
const MarkDownRender = dynamic(() => import('./../../components/markdownRender'));

const { Option } = Select;

import api from './../../lib/api';

const CACHE = {};


function makeQuery(creator, state, labels) {
  let creatorStr = creator ? `creator=${creator}` : '';
  let stateStr = state ? `state=${state}` : '';
  let labelStr = '';
  if (labels && labels.length > 0) {
    labelStr = `labels=${labels.join(',')}`
  }

  const arr = [];
  if (creatorStr) {
    arr.push(creatorStr);
  }
  if (stateStr) {
    arr.push(stateStr);
  }
  if (labelStr) {
    arr.push(labelStr);
  }


  return `?${arr.join('&')}`
}

function Label({ label }) {
  return (
    <>
      <span
        className="label"
        style={{ backgroundColor: `#${label.color}` }}
      >
        {label.name}
      </span>
      <style jsx>{`
        .label{
          display: inline-block;
          line-height: 20px;
          padding: 3px 10px;
          border-radius: 4px;
          font-size: 14px;
        }
        .label , .label + .label{
          margin-left: 10px;
        }
      `}</style>
    </>
  )
}

function IssueDetail({ issue }) {
  return (
    <div className="root">
      <MarkDownRender content={issue.body} />
      <div className="actions">
        <Button href={issue.html_url} target="_blank">打开issue讨论页面</Button>
      </div>
      <style jsx>{`
        .root{
          background: #fafafa;
          padding: 20px;
        }
        .actions{
          text-align: right;
        }
      `}</style>
    </div>
  )
}

function IssuesItem({ issue }) {

  const [showDetail, setShowDetail] = useState(false);

  // useCallback 不依赖外部声明的showDetail 逃避闭包
  const toggleShowDetail = useCallback(() => {
    setShowDetail(detail => !detail);
  }, [])

  return (
    <div>
      <div className="issue">
        <Button type="primary" size="small"
          style={{ position: 'absolute', right: 10, top: 10 }}
          onClick={toggleShowDetail}
        >
          {showDetail ? '隐藏' : '查看'}
        </Button>
        <div className="avatar">
          <Avatar src={issue.user.avatar_url} shap="square" size={50} />
        </div>
        <div className="main-info">
          <h6>
            <span>{issue.title}
              {
                issue.labels.map(label => <Label label={label} key={label.id} />)
              }
            </span>
          </h6>
          <p className="sub-info">
            <span>Updated at {formatTime(issue.updated_at)}</span>
          </p>
        </div>
        <style jsx>{`
        .issue {
          display: flex;
          position: relative;
          padding: 10px;
        }
        .issue:hover{
          background: #fafafa;
        }
        .issue + .issue {
          border-top: 1px solid #eee;
        }
        .main-info > h6 {
          max-width: 600px;
          font-size: 16px;
          padding-right: 40px;
        }
        .avatar{
          margin-right: 20px
        }
        .sub-info{
          margin-bottom: 0;
        }
        .sub-info > span + span{
          display: inline-block;
          margin-left: 20px;
          font-size: 12px;
        }
      `}</style>
      </div >
      {showDetail ?
        <IssueDetail issue={issue} /> :
        null
      }
    </div>
  )
}

const isServer = typeof window === 'undefined';
function Issues({ initialIssues, labels, owner, name }) {
  console.log(initialIssues);
  console.log(labels)
  if (!isServer) {
    useEffect(() => {
      CACHE[`${owner}/${name}`] = labels;
    }, [owner, name, labels])
  }


  const [creator, setCreator] = useState();
  const [state, setState] = useState();
  const [label, setLabel] = useState([]);
  const [issues, setIssues] = useState(initialIssues);

  const handleCreatorChange = useCallback((value) => {
    setCreator(value);
  }, [])

  const handleStateChange = useCallback((value) => {
    setState(value)
  }, [])

  const handleLabelChange = useCallback((value) => {
    setLabel(value)
  }, [])

  const handleSearch = async () => {
    await api.request(
      {
        url: `/repos/${owner}/${name}/issues${makeQuery(creator, state, label)}`
      }
    ).then((resp) => {
      setIssues(resp.data)
    })
  }

  return (
    <div className="root">
      <div className="search">
        <SearchUser
          onChange={handleCreatorChange}
          value={creator} />

        <Select
          placeholder='状态'
          onChange={handleStateChange}
          value={state}
          style={{ width: 200, marginLeft: 20 }}
        >
          <Option value="all">all</Option>
          <Option value="open">open</Option>
          <Option value="closed">closed</Option>
        </Select>

        <Select
          placeholder='Label'
          onChange={handleLabelChange}
          value={label}
          style={{ flexGrow: 1, marginLeft: 20, marginRight: 20, minWidth: 200 }}
          mode="multiple"
        >
          {
            labels.map(label => {
              return (
                <Option value={label.name} key={label.id}>
                  {label.name}
                </Option>
              )
            })
          }
        </Select>
        <Button type="primary" onClick={handleSearch}>搜索</Button>
      </div>


      <div className="issues">
        {issues.map(issue => {
          return <IssuesItem issue={issue} key={issue.id} />
        })}
      </div>
      <style jsx>{`
        .issues{
          border: 1px solid #eee;
          border-radius: 5px;
          margin-bottom: 20px;
          margin-top: 20px;
        }
        .search{
          display: flex;
        }
      `}</style>
    </div>
  )
}
Issues.getInitialProps = async (content) => {
  const { router, ctx } = content;
  const { name, owner } = ctx.query;

  const full_name = `${owner}/${name}`;

  const fetches = await Promise.all([
    await api.request(
      {
        url: `/repos/${owner}/${name}/issues`
      },
      ctx.req,
      ctx.res
    ),
    CACHE[full_name]
      ? Promise.resolve({ data: CACHE[full_name] })
      : await api.request(
        {
          url: `/repos/${owner}/${name}/labels`
        },
        ctx.req,
        ctx.res
      ),
  ])

  return {
    owner,
    name,
    initialIssues: fetches[0].data,
    labels: fetches[1].data
  }
}


export default withRepoBasic(Issues, 'issues');