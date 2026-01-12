import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import {
  MdArrowBack,
  MdShare,
  MdBookmark,
  MdTag
} from "react-icons/md";

// Mock blog data (same as Blog.jsx)
const blogPosts = [
  {
    id: 1,
    title: "5 Ways to Improve Street Safety in Your Neighborhood",
    excerpt: "Discover practical steps you can take to make your streets safer for everyone, from simple reporting to community organizing.",
    content: `
# 5 Ways to Improve Street Safety in Your Neighborhood

Street safety is a crucial aspect of community well-being. Whether you're a parent concerned about your children walking to school, a senior citizen wanting to feel secure while exercising, or simply a resident who cares about the neighborhood, there are concrete steps you can take to make our streets safer for everyone.

## 1. Report Issues Promptly and Detailed

The most effective way to improve street safety is through prompt and detailed reporting. When you notice a safety issue, don't wait—report it immediately through the CityFix platform.

**What to report:**
- Burned-out streetlights
- Potholes and road damage
- Missing or faded crosswalks
- Broken sidewalks
- Overgrown vegetation blocking visibility
- Malfunctioning traffic signals

**Tips for effective reporting:**
- Take clear photos from multiple angles
- Provide specific location details
- Describe the safety risk clearly
- Include time of day when the issue is most problematic

## 2. Organize Neighborhood Safety Audits

Collective action is often more powerful than individual efforts. Organize regular neighborhood safety audits with your neighbors.

**How to conduct a safety audit:**
- Gather a group of residents
- Walk through the neighborhood at different times
- Document safety concerns systematically
- Prioritize issues by severity
- Create a comprehensive action plan

**Benefits of safety audits:**
- Identifies issues you might miss alone
- Builds community relationships
- Creates a unified voice for change
- Demonstrates commitment to city officials

## 3. Advocate for Traffic Calming Measures

Work with local authorities to implement traffic calming measures that can significantly reduce accident rates.

**Effective traffic calming measures:**
- Speed bumps and tables
- Chicanes (road narrowing)
- Raised crosswalks
- Traffic circles
- Protected bike lanes

**How to advocate:**
- Collect data on traffic speeds and volumes
- Document accident history
- Present solutions to city council
- Build community support through petitions
- Partner with local businesses

## 4. Improve Visibility and Lighting

Good visibility and proper lighting are fundamental to street safety.

**Lighting improvements:**
- Request additional streetlights in dark areas
- Report burned-out lights immediately
- Advocate for LED conversion for better visibility
- Consider motion-activated lighting in certain areas

**Visibility enhancements:**
- Trim overgrown trees and shrubs
- Remove illegal signage that blocks sight lines
- Ensure crosswalk markings are visible
- Advocate for reflective road markings

## 5. Create Safe Routes Programs

Establish programs that identify and promote safe routes through the neighborhood.

**Safe Routes to School:**
- Map safest walking routes to schools
- Organize walking school buses
- Educate children about street safety
- Work with schools on safety education

**Senior Safe Routes:**
- Identify well-lit, even pathways
- Mark benches and rest areas
- Organize walking groups for safety
- Coordinate with local senior centers

## Conclusion

Improving street safety is an ongoing process that requires community participation and persistence. By taking these five approaches—prompt reporting, organized audits, traffic calming advocacy, visibility improvements, and safe routes programs—you can make a significant difference in your neighborhood's safety.

Remember, every small action contributes to a larger impact. Start today by reporting that streetlight you've noticed is out, or by talking to a neighbor about organizing a safety audit. Together, we can create safer streets for everyone.

*Have you successfully improved street safety in your neighborhood? Share your story in the comments below!*
    `,
    author: "Sarah Johnson",
    date: "2024-01-08",
    category: "Infrastructure",
    tags: ["safety", "streets", "community"],
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1578912651518-4bf6e8b5c6e0?w=1200",
    featured: true,
    views: 1542,
    likes: 89
  },
  // Add other blog posts here as needed...
];

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    // Simulate loading and find the post
    setTimeout(() => {
      const foundPost = blogPosts.find(p => p.id === parseInt(id));
      setPost(foundPost);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    // Here you would typically save to backend/localStorage
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-base-content mb-4">Article Not Found</h1>
          <Link to="/blog" className="text-primary hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-base-content/60 hover:text-primary transition-colors"
          >
            <MdArrowBack className="text-xl" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          {/* Category */}
          <div className="mb-4">
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-black text-base-content mb-6 tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-base-content/50 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-linear-to-r from-primary to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-base-content">{post.author}</p>
                <p className="text-sm">Author</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              📅
              <span>{new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              ⏱️
              <span>{post.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              👁️
              <span>{post.views} views</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-base-300 bg-base-100 text-base-content/70 hover:bg-base-200 transition-colors"
            >
              <MdShare className="text-lg" />
              Share
            </button>
            <button
              onClick={handleBookmark}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${bookmarked
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-base-300 bg-base-100 text-base-content/70 hover:bg-base-200"
                }`}
            >
              <MdBookmark className={`text-lg ${bookmarked ? "fill-current" : ""}`} />
              {bookmarked ? "Saved" : "Save"}
            </button>
          </div>
        </motion.header>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
        >
          <div className="h-64 sm:h-96 rounded-2xl overflow-hidden shadow-lg">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="prose prose-lg max-w-none data-[theme=dark]:prose-invert"
        >
          <div
            className="text-base-content/80 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }}
          />
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 pt-8 border-t border-base-200"
        >
          <div className="flex items-center gap-2 mb-4">
            <MdTag className="text-xl text-base-content/40" />
            <span className="text-sm font-semibold text-base-content/50 uppercase tracking-wider">
              Tags
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-base-200 text-base-content/70 text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Related Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 pt-8 border-t border-base-200"
        >
          <h2 className="text-2xl font-bold text-base-content mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts
              .filter(p => p.id !== post.id && p.category === post.category)
              .slice(0, 2)
              .map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.id}`}
                  className="group p-6 rounded-xl bg-base-100 border border-base-200 hover:shadow-lg transition-all"
                >
                  <h3 className="text-lg font-semibold text-base-content mb-2 group-hover:text-primary transition-colors">
                    {relatedPost.title}
                  </h3>
                  <p className="text-base-content/60 text-sm line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 mt-4 text-xs text-base-content/40">
                    <span>{relatedPost.readTime}</span>
                    <span>{new Date(relatedPost.date).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
          </div>
        </motion.div>
      </article>
    </div>
  );
};

export default BlogDetail;