import React from "react";
import { useSelector } from "react-redux";
import { Heart, MessageCircle, Share2 } from "lucide-react";

export default function PostCardComponents() {
  const { posts, isLoading, isError } = useSelector(
    (state) => state.posts || { posts: [], isLoading: false, isError: false }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return <div className="text-error text-center">Error loading posts</div>;
  }

  // Handle empty posts
  if (!posts || posts.length === 0) {
    return (
      <div className="text-base-content/60 text-center">No posts available</div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto px-4">
      {posts.map((post) => (
        <div
          key={post._id}
          className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-200/30 rounded-2xl overflow-hidden"
        >
          <div className="card-body p-6">
            {/* User Info */}
            <div className="flex items-center space-x-4 mb-5">
              <div className="avatar">
                <div className="w-12 h-12 rounded-full ring ring-primary/50 ring-offset-base-100 ring-offset-2 transition-transform hover:scale-105">
                  <img
                    src={post.userId.profilePic}
                    alt="Profile"
                    className="object-cover rounded-full"
                  />
                </div>
              </div>
              <div>
                <span className="font-semibold text-lg text-base-content">
                  {post.userId.username}
                </span>
                <span className="text-xs text-base-content/50 block">
                  {new Date(post.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Media: Images and Videos */}
            {(post.imagePic.length > 0 || post.videos.length > 0) && (
              <div className="mb-6">
                <div className="carousel rounded-xl w-full h-[450px] bg-base-200/30 relative overflow-hidden">
                  {[...post.imagePic, ...post.videos].map((media, index) => (
                    <div
                      key={`${post._id}-media-${index}`}
                      className="carousel-item w-full relative"
                    >
                      {media.includes("video") || media.endsWith(".mp4") ? (
                        <video
                          controls
                          className="w-full h-[450px] object-contain rounded-xl transition-transform duration-300 hover:scale-[1.02]"
                        >
                          <source src={media} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={media}
                          alt={`Post media ${index + 1}`}
                          className="w-full h-[450px] object-contain rounded-xl transition-transform duration-300 hover:scale-[1.02]"
                        />
                      )}
                      {/* Media counter */}
                      {[...post.imagePic, ...post.videos].length > 1 && (
                        <div className="absolute top-3 right-3 badge badge-neutral badge-sm font-medium">
                          {index + 1}/
                          {[...post.imagePic, ...post.videos].length}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            {post.content && (
              <p className="text-base-content/90 text-base leading-relaxed mb-6 font-light tracking-wide">
                {post.content}
              </p>
            )}

            {/* Interaction Buttons */}
            <div className="flex gap-4">
              <button className="btn btn-ghost btn-circle text-base-content/60 hover:text-error hover:bg-error/10 transition-all duration-200">
                <Heart className="w-5 h-5" />
                <span className="ml-1 text-sm">24</span>
              </button>
              <button className="btn btn-ghost btn-circle text-base-content/60 hover:text-primary hover:bg-primary/10 transition-all duration-200">
                <MessageCircle className="w-5 h-5" />
                <span className="ml-1 text-sm">8</span>
              </button>
              <button className="btn btn-ghost btn-circle text-base-content/60 hover:text-secondary hover:bg-secondary/10 transition-all duration-200">
                <Share2 className="w-5 h-5" />
                <span className="ml-1 text-sm">3</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
