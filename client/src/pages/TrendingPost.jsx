import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useInView } from "react-intersection-observer";
import { useGetTrendingPosts } from "../api/trendingApi";
import {
  setTrendingPosts,
  setLoading,
  setError,
} from "../redux/slice/trendingSlice";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

const TrendingPost = () => {
  const dispatch = useDispatch();
  const { trendingPosts, loading, error } = useSelector(
    (state) => state.trending
  );
  const { ref, inView } = useInView({ threshold: 0.1 });
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error: queryError,
  } = useGetTrendingPosts({ days: 7 });

  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading(true));
    } else if (isError) {
      dispatch(setError(queryError.message));
    } else if (data) {
      const allPosts = data.pages.flatMap((page) => page.posts);
      dispatch(setTrendingPosts(allPosts));
    }
  }, [data, isLoading, isError, queryError, dispatch]);

  useEffect(() => {
    if (inView && hasNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isLoading]);


  const customParser = (html) => {
      const sanitizedHtml = DOMPurify.sanitize(html);
      return parse(sanitizedHtml, {
        replace: (domNode) => {
          if (domNode.name === "iframe") {
            return (
              <iframe
                src={domNode.attribs.src}
                width="100%"
                height="400"
                title="Iframe Content"
                frameBorder="0"
              />
            );
          }
          if (domNode.name === "script") {
            return null;
          }
          return null;
        },
      });
    };
  

  if (loading && !trendingPosts.length) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <div className="space-y-4">
          {/* Skeleton loader for initial loading */}
          {[...Array(3)].map((_, index) => (
            <div key={index} className="card bg-base-100 shadow-xl p-6">
              <div className="skeleton h-8 w-3/4 mb-4"></div>
              <div className="skeleton h-4 w-full mb-2"></div>
              <div className="skeleton h-4 w-5/6 mb-4"></div>
              <div className="skeleton h-48 w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <div className="alert alert-error shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Error: {error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!trendingPosts.length) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 text-center">
        <div className="alert alert-info shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current flex-shrink-0 w-6 h-6"
            >
              <path
                ificates
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>No trending posts available</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 text-base-content">
        Trending Posts
      </h1>
      <div className="space-y-6">
        {trendingPosts.map((post) => (
          <div
            key={post._id}
            className="card bg-base-300 border border-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="card-body">
              <div className="flex items-center gap-3 mb-4">
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={
                        post.userId.profilePic || "https://via.placeholder.com/48"
                      }
                      alt="User avatar"
                      className="object-cover"
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/48")
                      }
                    />
                  </div>
                </div>
                <h3 className="card-title text-lg sm:text-xl font-semibold text-base-content">
                  {post.userId.username}
                </h3>
              </div>
              <p className="prose prose-sm max-w-none mb-4">{customParser(post.content)}</p>
              {post.imagePic.length > 0 && (
                <figure className="relative">
                  <img
                    src={post.imagePic[0]}
                    alt="Post"
                    className="w-full max-h-96 rounded-lg object-cover"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </figure>
              )}
              <div className="flex gap-2 flex-wrap mt-4">
                <span className="badge badge-primary badge-outline">
                  Likes: {post.likesCount}
                </span>
                <span className="badge badge-secondary badge-outline">
                  Comments: {post.commentsCount}
                </span>
                <span className="badge badge-accent badge-outline">
                  Score: {post.trendingScore}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {hasNextPage && (
        <div ref={ref} className="text-center py-8">
          <span className="loading loading-spinner loading-md text-primary"></span>
        </div>
      )}
      {!hasNextPage && trendingPosts.length > 0 && (
        <div className="text-center py-8 text-base-content/60">
          No more posts to load
        </div>
      )}
    </div>
  );
};

export default TrendingPost;
