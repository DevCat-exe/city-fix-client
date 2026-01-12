import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  MdSearch,
  MdPerson,
  MdChevronLeft,
  MdChevronRight,
  MdNewspaper,
} from "react-icons/md";

// Mock blog data
const blogPosts = [
  {
    id: 1,
    title: "5 Ways to Improve Street Safety in Your Neighborhood",
    excerpt:
      "Discover practical steps you can take to make your streets safer for everyone, from simple reporting to community organizing.",
    content:
      "Street safety is a crucial aspect of community well-being. In this comprehensive guide, we'll explore five effective strategies that residents can implement to enhance safety in their neighborhoods...",
    author: "Sarah Johnson",
    date: "2024-01-08",
    category: "Infrastructure",
    tags: ["safety", "streets", "community"],
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1578912651518-4bf6e8b5c6e0?w=800",
    featured: true,
  },
  {
    id: 2,
    title: "How Riverside Park Got Its Makeover",
    excerpt:
      "Follow the journey of how community reports transformed a neglected park into a vibrant space for families and children.",
    content:
      "Riverside Park was once an overlooked space in our community, but through the power of collective action and persistent reporting, it's now a thriving hub of activity...",
    author: "Mark Smith",
    date: "2024-01-05",
    category: "Success Story",
    tags: ["parks", "transformation", "community"],
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800",
    featured: true,
  },
  {
    id: 3,
    title: "The Complete Guide to Reporting Infrastructure Issues",
    excerpt:
      "Learn how to write effective reports that get attention and lead to quick resolutions, with tips and best practices.",
    content:
      "Reporting infrastructure issues effectively is both an art and a science. This guide will walk you through the process of creating reports that get results...",
    author: "Emily Chen",
    date: "2024-01-03",
    category: "Guide",
    tags: ["reporting", "tips", "best-practices"],
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1586953208448-2151a3c9c1c6?w=800",
    featured: false,
  },
  {
    id: 4,
    title: "Winter Maintenance: Keeping Our Streets Clear",
    excerpt:
      "Understanding the city's snow removal process and how residents can help during winter weather events.",
    content:
      "Winter brings unique challenges to urban infrastructure maintenance. Here's what you need to know about how the city handles snow and ice removal...",
    author: "David Martinez",
    date: "2024-01-01",
    category: "Seasonal",
    tags: ["winter", "maintenance", "streets"],
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800",
    featured: false,
  },
  {
    id: 5,
    title: "Community Engagement: Building Better Cities Together",
    excerpt:
      "Explore how citizen participation is reshaping urban planning and creating more responsive local governments.",
    content:
      "The future of urban development lies in collaborative approaches that bring together citizens, officials, and experts to create better communities...",
    author: "Lisa Anderson",
    date: "2023-12-28",
    category: "Community",
    tags: ["engagement", "planning", "participation"],
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1517245136467-4c8ed4b037a9?w=800",
    featured: false,
  },
  {
    id: 6,
    title: "Technology in Public Works: Smart City Solutions",
    excerpt:
      "How emerging technologies are making infrastructure management more efficient and responsive to citizen needs.",
    content:
      "Smart city technologies are revolutionizing how we manage public infrastructure, from IoT sensors to AI-powered maintenance scheduling...",
    author: "Tech Team",
    date: "2023-12-25",
    category: "Technology",
    tags: ["smart-city", "innovation", "tech"],
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    featured: false,
  },
];

const categories = [
  "All",
  "Infrastructure",
  "Success Story",
  "Guide",
  "Seasonal",
  "Community",
  "Technology",
];

const Blog = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Filter posts
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      post.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);

    return matchesSearch && matchesCategory && matchesTag;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-page">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary-content dark:text-secondary text-sm font-semibold mb-4">
            <MdNewspaper className="text-base" />
            <span>CityFix Blog</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-base-content mb-4 tracking-tight">
            Stories & Insights
          </h1>
          <p className="text-xl text-base-content/60 max-w-2xl mx-auto">
            Tips, success stories, and insights about building better
            communities
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 text-xl" />
            <input
              type="text"
              placeholder="Search articles by title, content, or author..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-base-300 bg-base-200 text-base-content placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-primary text-primary-content shadow-lg shadow-primary/30"
                      : "bg-base-100 text-base-content/70 border border-base-300 hover:bg-base-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Tag Filter */}
          {selectedTag && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-base-content/50">
                Filtering by tag:
              </span>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {selectedTag}
              </span>
              <button
                onClick={() => setSelectedTag("")}
                className="text-base-content/40 hover:text-base-content transition-colors"
              >
                ×
              </button>
            </div>
          )}
        </motion.div>

        {/* Featured Posts */}
        {currentPage === 1 && !search && selectedCategory === "All" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-base-content mb-6">
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogPosts
                .filter((post) => post.featured)
                .slice(0, 2)
                .map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.5 + index * 0.1,
                      ease: "easeOut",
                    }}
                    className="group rounded-2xl bg-base-100 border border-base-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="h-64 relative overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-base-content mb-3 group-hover:text-primary transition-colors">
                        <Link to={`/blog/${post.id}`}>{post.title}</Link>
                      </h3>
                      <p className="text-base-content/60 mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-base-content/50">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <MdPerson className="text-base" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            📅
                            {new Date(post.date).toLocaleDateString()}
                          </span>
                        </div>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </motion.article>
                ))}
            </div>
          </motion.div>
        )}

        {/* Blog Posts Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {currentPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.7 + index * 0.1,
                ease: "easeOut",
              }}
              className="group flex flex-col bg-base-100 rounded-2xl border border-base-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 shadow-sm"
            >
              <div className="h-48 relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-base-content mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </h3>
                <p className="text-base-content/60 mb-4 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSelectedTag(tag);
                        setCurrentPage(1);
                      }}
                      className="px-2 py-1 rounded-full bg-base-200 text-base-content/70 text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-base-content/50">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MdPerson className="text-base" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      📅
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                  </div>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* No Results */}
        {currentPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-base-200 mb-6">
              <MdNewspaper className="text-4xl text-base-content/20" />
            </div>
            <h3 className="text-2xl font-bold text-base-content mb-2">
              No articles found
            </h3>
            <p className="text-base-content/60 mb-6">
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
                setSelectedTag("");
                setCurrentPage(1);
              }}
              className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
            className="flex justify-center items-center gap-4 mt-12"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-base-300 bg-base-100 text-base-content hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              <MdChevronLeft className="text-lg" />
              Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                      currentPage === pageNum
                        ? "bg-primary text-primary-content shadow-lg shadow-primary/30"
                        : "bg-base-100 text-base-content border border-base-300 hover:bg-base-200"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-base-300 bg-base-100 text-base-content hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              Next
              <MdChevronRight className="text-lg" />
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Blog;
