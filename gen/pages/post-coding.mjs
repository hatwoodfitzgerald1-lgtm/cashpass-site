import { POSTS } from '../content/blog.mjs';
import { renderPost } from '../partials/post.mjs';
export function render() { return renderPost(POSTS.find((p) => p.key === 'coding')); }
