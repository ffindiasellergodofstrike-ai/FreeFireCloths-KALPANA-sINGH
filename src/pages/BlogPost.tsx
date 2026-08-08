import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/products';

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const post = BLOG_POSTS.find(b => String(b.id) === id);

  if (!post) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>Article Not Found</h2>
        <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>The blog post you are looking for does not exist.</p>
        <Link to="/blog" className="btn btn-black btn-lg">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div id="blog-post-page-root">
      <div className="container" style={{ padding: '40px 20px 60px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <Link 
            to="/blog" 
            style={{ 
              fontFamily: 'var(--font-h)', 
              fontSize: '11px', 
              fontWeight: 700, 
              letterSpacing: '1.5px', 
              textTransform: 'uppercase', 
              borderBottom: '1px solid var(--dark)', 
              display: 'inline-block', 
              marginBottom: '28px', 
              cursor: 'pointer' 
            }}
          >
            ← BACK TO JOURNAL
          </Link>

          <div id="blogPostContent">
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>{post.emoji}</div>
            <div style={{ fontFamily: 'var(--font-h)', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '12px' }}>
              {post.cat} · {post.date}
            </div>
            <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: '20px' }}>{post.title}</h1>
            <p style={{ fontSize: '15px', color: 'var(--gray)', lineHeight: 1.8, marginBottom: '20px' }}>{post.excerpt}</p>
            <p style={{ fontSize: '15px', color: 'var(--gray)', lineHeight: 1.8, marginBottom: '20px' }}>
              Fashion is not just about what you wear — it's about how you wear it, the story you tell, and the confidence you carry. At FREE FIRE STORE, we believe every piece in your wardrobe should add value and versatility to your lifestyle.
            </p>
            <p style={{ fontSize: '15px', color: 'var(--gray)', lineHeight: 1.8, marginBottom: '28px' }}>
              Whether you're building a capsule wardrobe or looking for the latest trends, our curated collection has something for everyone. Explore our range of men's fashion, women's wear, and cutting-edge electronics — all at prices that make quality accessible.
            </p>
            <Link to="/collections/all" className="btn btn-black">SHOP THE COLLECTION</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
