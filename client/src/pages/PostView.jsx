import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useGetPostById } from "../api/postApi";
import { setPostById } from "../redux/slice/postSlice";
import { Heart, MessageCircle, Share2, MoreVertical } from "lucide-react";
import BookMarkBtnComponent from "../components/BookMarkBtnComponent";
import FollowUnfollowButton from "../components/FollowUnFollowBtn";
import CommentSection from "../components/CommentSection";
import { useGetComment } from "../api/commentApi";
import { clearComments, getComments } from "../redux/slice/commentSlice";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

export default function PostView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { postById, isLoading, isError } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const {
    data: post,
    isLoading: queryLoading,
    error: queryError,
  } = useGetPostById(id);

  const { data: postComment } = useGetComment(id);

  useEffect(() => {
    dispatch(clearComments());
  }, [id, dispatch]);

  useEffect(() => {
    if (post) {
      dispatch(setPostById(post.data));
    }
    if (postComment) {
      dispatch(getComments(postComment.data));
    }
  }, [post, postComment, dispatch]);

  useEffect(() => {
    if (queryError?.response?.status === 404) {
      navigate("/");
    }
  }, [queryError, navigate]);

  if (queryLoading || isLoading) {
    return <div className="text-base-content/60 text-center">Loading...</div>;
  }

  if (queryError || isError) {
    return (
      <div className="text-error text-center">
        Error: {queryError?.message || "Failed to load post"}
      </div>
    );
  }

  if (!postById) {
    return (
      <div className="text-base-content/60 text-center">Post not found</div>
    );
  }

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
    <div className="flex max-w-6xl mx-auto px-4 py-8 gap-6">
      {/* Post View Section */}
      <div className="w-1/2">
        <div className="card bg-black shadow-xl border border-base-100 rounded-xl overflow-hidden">
          <div className="p-6">
            {/* User Info */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-4">
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full ring ring-primary/50 ring-offset-base-100 ring-offset-2 transition-transform hover:scale-105">
                    <img
                      src={
                        postById.userId?.profilePic ||
                        "https://via.placeholder.com/48"
                      }
                      alt="Profile"
                      className="object-cover rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-lg text-base-content">
                    {postById.userId?.username || "Unknown User"}
                  </span>
                  <span className="text-xs text-base-content/50 block">
                    {new Date(postById.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              {/* Dropdown Menu */}
              {user?._id !== postById.userId?._id && (
                <div className="dropdown dropdown-end">
                  <button
                    tabIndex={0}
                    className="btn btn-ghost btn-circle text-base-content/60 hover:text-primary hover:bg-primary/10"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52"
                  >
                    <li>
                      <FollowUnfollowButton
                        userId={postById.userId?._id}
                        className="text-sm font-semibold justify-start"
                        btnClassName={`${
                          user?.following?.some(
                            (followedUser) =>
                              followedUser._id === postById.userId?._id
                          )
                            ? "bg-base-100"
                            : "bg-base-200"
                        } w-full text-left`}
                      />
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Media: Images and Videos */}
            {(postById.imagePic?.length > 0 || postById.videos?.length > 0) && (
              <div className="mb-5">
                <div className="carousel rounded-xl w-full h-[400px] relative overflow-hidden">
                  {[
                    ...(postById.imagePic || []),
                    ...(postById.videos || []),
                  ].map((media, index) => (
                    <div
                      key={`${postById._id}-media-${index}`}
                      className="carousel-item w-full relative"
                    >
                      {media.includes("video") || media.endsWith(".mp4") ? (
                        <video
                          controls
                          className="w-full h-[400px] object-contain rounded-xl transition-transform duration-300 hover:scale-[1.02]"
                        >
                          <source src={media} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={media}
                          alt={`Post media ${index + 1}`}
                          className="w-full h-[400px] object-contain rounded-xl transition-transform duration-300 hover:scale-[1.02]"
                        />
                      )}
                      {[
                        ...(postById.imagePic || []),
                        ...(postById.videos || []),
                      ].length > 1 && (
                        <div className="absolute top-3 right-3 badge badge-neutral badge-sm font-medium">
                          {index + 1}/
                          {
                            [
                              ...(postById.imagePic || []),
                              ...(postById.videos || []),
                            ].length
                          }
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            {postById?.content && (
              <div className="prose prose-xs max-w-none mb-4">
                {customParser(postById?.content)}
              </div>
            )}

            {/* Interaction Buttons */}
            <div className="flex justify-between items-center gap-4">
              <button className="btn btn-ghost text-base-content/60 hover:text-error hover:bg-error/10 transition-all duration-200">
                <Heart className="w-5 h-5" />
                <span className="ml-1 text-sm">
                  {postById.likes?.length || 0}
                </span>
              </button>
              <button className="btn btn-ghost btn-circle text-base-content/60 hover:text-primary hover:bg-primary/10 transition-all duration-200">
                <MessageCircle className="w-5 h-5" />
                <span className="ml-1 text-sm">
                  {postById.comments?.length || 0}
                </span>
              </button>
              <button className="btn btn-ghost btn-circle text-base-content/60 hover:text-secondary hover:bg-secondary/10 transition-all duration-200">
                <Share2 className="w-5 h-5" />
                <span className="ml-1 text-sm">0</span>
              </button>
              <div>
                <BookMarkBtnComponent id={postById._id} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Section */}
      <div className="w-1/2 h-screen">
        <CommentSection postId={id} />
      </div>
    </div>
  );
}
