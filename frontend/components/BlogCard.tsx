
type Blog = { id:string; title:string; excerpt:string; content:string; tags:string[]; published_date:string; };
export default function BlogCard({ post }: { post: Blog }) {
  return (
    <article className="card-luxe p-4 h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">{post.title}</h5>
        <span className="badge bg-secondary-subtle text-secondary-emphasis">{new Date(post.published_date).toDateString()}</span>
      </div>
      <p className="text-secondary">{post.excerpt}</p>
      <div className="mt-auto d-flex flex-wrap gap-2">{post.tags.map(t => <span className="badge-gold" key={t}>{t}</span>)}</div>
    </article>
  );
}
