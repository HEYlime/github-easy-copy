
import Link from 'next/link';
import dynamic from 'next/dynamic';
// import MarkdownIt from 'markdown-it';
// import 'github-markdown-css';

import withRepoBasic from './../../components/with-repo-basic';
const MarkdownRender = dynamic(
  () => import('./../../components/markdownRender'),
  {
    loading: () => <p>Loading</p>
  }
);


import api from './../../lib/api';

// const md = new MarkdownIt({
//   html: true,
//   linkify: true
// });

// function b64_to_utf8(str) {
//   return decodeURIComponent(escape(atob(str)));
// }

function Detail({ readme }) {
  // const content = b64_to_utf8(readme.content);
  // const html = md.render(content);
  return (
    // <div className="markdown-body">
    //   <div dangerouslySetInnerHTML={{ __html: html }}></div>
    // </div>
    <MarkdownRender content={readme.content} isBase64={true} />
  )
}


Detail.getInitialProps = async (content) => {
  const { router, ctx } = content;
  const { name, owner } = ctx.query;
  const readmeData = await api.request(
    {
      url: `/repos/${owner}/${name}/readme`
    },
    ctx.req,
    ctx.res
  )

  return {
    readme: readmeData.data
  }
}

export default withRepoBasic(Detail, 'index');