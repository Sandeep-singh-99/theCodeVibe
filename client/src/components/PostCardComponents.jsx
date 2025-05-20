import { useDispatch, useSelector } from "react-redux";
import { Heart, MessageCircle, MoreVertical } from "lucide-react";
import BookMarkBtnComponent from "./BookMarkBtnComponent";
import FollowUnfollowButton from "./FollowUnFollowBtn";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import ReactPlayer from "react-player";
import { useDislikePost, useLikePost } from "../api/postApi";
import { setPosts } from "../redux/slice/postSlice";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function PostCardComponents() {
  const { posts } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  // Handle non-array or empty posts
  if (!Array.isArray(posts) || posts.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">No posts to show</div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto px-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} user={user} />
      ))}
    </div>
  );
}

function PostCard({ post, user }) {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);
  const queryClient = useQueryClient(); 
  const { mutate: likePost } = useLikePost();
  const { mutate: dislikePost } = useDislikePost();
  const [isLiking, setIsLiking] = useState(false);

  const isLiked = Array.isArray(post.likes) && post.likes.includes(user?._id);

  const handleLikeClick = () => {
    if (!user?._id) {
      alert("Please log in to like or dislike posts.");
      return;
    }
    if (isLiking) return;

    setIsLiking(true);
    const previousPosts = posts; 
    const updatedPost = {
      ...post,
      likes: isLiked
        ? (post.likes || []).filter((id) => id !== user._id)
        : [...(post.likes || []), user._id],
    };

    // Optimistic update
    dispatch(
      setPosts(posts.map((p) => (p._id === post._id ? updatedPost : p)))
    );

    if (isLiked) {
      dislikePost(post._id, {
        onSuccess: (serverPost) => {
          dispatch(
            setPosts(posts.map((p) => (p._id === serverPost._id ? serverPost : p)))
          );
          queryClient.invalidateQueries(["posts"]);
          setIsLiking(false);
        },
        onError: () => {
          dispatch(setPosts(previousPosts));
          setIsLiking(false);
        },
      });
    } else {
      likePost(post._id, {
        onSuccess: (serverPost) => {
          dispatch(
            setPosts(posts.map((p) => (p._id === serverPost._id ? serverPost : p)))
          );
          queryClient.invalidateQueries(["posts"]);
          setIsLiking(false);
        },
        onError: () => {
          dispatch(setPosts(previousPosts));
          setIsLiking(false);
        },
      });
    }
  };

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

  return (
    <div className="rounded-xl shadow-2xl max-w-lg transition-shadow duration-300 border border-base-100 overflow-hidden">
      <div className="p-5">
        {/* User Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-10 h-10 rounded-full ring ring-blue-100 ring-offset-2 transition-transform hover:scale-105">
                <img
                  src={post.userId.profilePic || "/default-avatar.png"}
                  alt={`${post.userId.username}'s avatar`}
                  className="object-cover rounded-full"
                />
              </div>
            </div>
            <div>
              <div
                className="font-semibold text-base-content"
              >
                {post.userId.username}
              </div>
              <span className="text-xs text-gray-500 block">
                {new Date(post.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>
          </div>
          {user?._id !== post.userId._id && (
            <div className="dropdown dropdown-end">
              <button
                tabIndex={0}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="More options"
              >
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-white rounded-lg w-48 border border-gray-100"
              >
                <li>
                  <FollowUnfollowButton
                    userId={post.userId._id}
                    className="text-sm font-medium text-gray-700 hover:bg-gray-50 w-full text-left"
                    btnClassName={`w-full text-left ${
                      user?.following?.some(
                        (followedUser) => followedUser._id === post.userId._id
                      )
                        ? "text-gray-500"
                        : "text-blue-500"
                    }`}
                  />
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Media: Images and Videos */}
        {(post.imagePic.length > 0 || post.videos.length > 0) && (
          <div className="mb-4">
            <div className="carousel rounded-lg w-full h-80 relative overflow-hidden bg-gray-50">
              {[...post.imagePic, ...post.videos].map((media, index) => (
                <div
                  key={`${post._id}-media-${index}`}
                  className="carousel-item w-full"
                >
                  {media.includes("video") || media.endsWith(".mp4") ? (
                    <ReactPlayer
                      key={media}
                      url={media}
                      controls
                      width="100%"
                      height="100%"
                      config={{
                        youtube: { playerVars: { showinfo: 1 } },
                        file: { attributes: { controlsList: "nodownload" } },
                      }}
                    />
                  ) : (
                    <img
                      src={media}
                      alt={`Post media ${index + 1}`}
                      className="w-full h-80 object-contain rounded-lg"
                    />
                  )}
                  {[...post.imagePic, ...post.videos].length > 1 && (
                    <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                      {index + 1}/{[...post.imagePic, ...post.videos].length}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {post.content && (
          <div className="prose max-w-none mb-4">
            {customParser(post.content)}
          </div>
        )}

        {/* Interaction Buttons */}
        <div className="flex justify-between items-center gap-3 pt-3">
          <div className="flex items-center gap-5">
             <button
            className={`flex items-center gap-1 ${
              isLiked
                ? "text-red-500 bg-red-50"
                : "text-gray-500 hover:text-red-500 hover:bg-red-50"
            } px-3 py-1 rounded-full transition-colors ${isLiking ? "opacity-50" : ""}`}
            onClick={handleLikeClick}
            disabled={isLiking}
            aria-label="Like post"
          >
            <Heart className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} />
            <span className="text-sm">{post.likes?.length || 0}</span>
          </button>
          <Link
            to={`postView/${post._id}`}
            className="flex items-center gap-1 text-gray-500 hover:text-blue-500 hover:bg-blue-50 px-3 py-1 rounded-full transition-colors"
            aria-label="Comment on post"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{post.comments?.length || 0}</span>
          </Link>
          </div>
          <BookMarkBtnComponent id={post._id} />
        </div>
      </div>
    </div>
  );
}