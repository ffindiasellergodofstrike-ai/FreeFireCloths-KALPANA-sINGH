import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BLOG_POSTS } from '../data/products';

export default function Blog() {
  const navigate = useNavigate();

  return (
    <div id="blog-page-root">
      <div className="page-hero">
        <div className="container">
          <h1>Style Journal</h1>
          <p>Fashion tips, trends & inspiration</p>
        </div>
      </div>

      <div className="container">
        <div className="section">
          <div className="grid-3" id="blogGrid">
            {BLOG_POSTS.map(post => (
              <div 
                key={post.id} 
                className="blog-card" 
                onClick={() => navigate(`/blog/${post.id}`)}
                id={`blog-card-${post.id}`}
              >
                <div className="blog-card-img">{post.emoji}</div>
                <div className="blog-card-body">
                  <div className="blog-cat">{post.cat}</div>
                  <div className="blog-title">{post.title}</div>
                  <div className="blog-excerpt">{post.excerpt}</div>
                  <div className="blog-meta">{post.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
