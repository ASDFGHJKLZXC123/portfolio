// post.jsx — individual post detail page. Reads slug from URL. Editorial dark style.

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { EdPage, EdFooter, NotFound, useDarkMode } from '../components/editorial';

const FALLBACK = { posts: [] };

const fmtDate = (iso) => {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
};

export default function Post() {
  const [dark, setDark] = useDarkMode();
  const [data, setData] = React.useState(FALLBACK);
  const { slug } = useParams();

  React.useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/writing.json`).then((r) => r.ok ? r.json() : null).then((d) => { if (d) setData(d); }).catch(() => {});
  }, []);

  React.useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const post = data.posts.find((p) => p.slug === slug);
  const idx = data.posts.findIndex((p) => p.slug === slug);
  const next = idx >= 0 ? data.posts[(idx + 1) % data.posts.length] : null;
  const back = { to: '/writing', label: 'WRITING' };

  if (!post && data.posts.length > 0) {
    return (
      <EdPage dark={dark} setDark={setDark} back={back} crumb="NOT FOUND">
        <NotFound title="Post not found." back={{ to: '/writing', label: 'BACK TO WRITING' }} />
      </EdPage>
    );
  }
  if (!post) return null;

  const body = Array.isArray(post.body) ? post.body : [post.body || ''];

  return (
    <EdPage dark={dark} setDark={setDark} back={back} crumb={post.title.toUpperCase()}>
      <article key={slug} className="ed-article">
        <div className="ed-article-meta ed-rise">
          <span>{fmtDate(post.date)}</span>
          <span aria-hidden="true">·</span>
          <span>{post.readTime}</span>
          <span className="ed-pill">{post.tag.toUpperCase()}</span>
        </div>

        <h1 className="ed-article-title">
          <span className="ed-line"><span style={{ animationDelay: '80ms' }}>{post.title}</span></span>
        </h1>

        {post.summary && (
          <p className="ed-article-summary ed-rise" style={{ animationDelay: '220ms' }}>{post.summary}</p>
        )}

        <div className="ed-article-body ed-rise" style={{ animationDelay: '320ms' }}>
          {body.map((p, i) => (
            <p key={i} className={i === 0 ? 'has-dropcap' : undefined}>{p}</p>
          ))}
        </div>

        <div className="ed-article-end" aria-hidden="true">/ / /</div>
      </article>

      {next && next.slug !== post.slug && (
        <section className="ed-page-section ed-narrow-wide">
          <Link to={`/post/${next.slug}`} className="ed-next">
            <div className="ed-next-meta">
              <span>/ NEXT POST</span>
              <span>{next.readTime}</span>
            </div>
            <div className="ed-next-main">
              <div className="ed-next-title ed-next-title--serif">{next.title}</div>
              <span className="ed-contact-arrow ed-next-arrow" aria-hidden="true">→</span>
            </div>
            <div className="ed-next-summary">{next.summary}</div>
          </Link>
        </section>
      )}

      <EdFooter left={`Richard's Portfolio Page / WRITING / ${post.slug.toUpperCase()}`} right={<Link to="/writing" className="ed-link">← ALL POSTS</Link>} />
    </EdPage>
  );
}
