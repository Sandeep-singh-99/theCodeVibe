import { useState } from "react";
import { useAddComment } from "../api/commentApi";
import { useDispatch, useSelector } from "react-redux";
import { setComment } from "../redux/slice/commentSlice";

const CommentSection = ({ postId }) => {
  const [commentText, setCommentText] = useState("")
  const { mutate: addCommentById, isPending } = useAddComment(postId)

  const { comments } = useSelector((state) => state.comment)

  const { user } = useSelector((state) => state.auth)

  const dispatch = useDispatch()

  const handleSubmit = (e) => {
  e.preventDefault();
  if (commentText.trim() === "") {
    return;
  }

  const commentData = { text: commentText };
  
  const optimisticComment = {
    _id: `temp-${Date.now()}`,
    content: commentText,
    postId,
    userId: {
      _id: user._id,
      username: user.username,
      profilePic: user.profilePic || "https://via.placeholder.com/32",
    },
    createdAt: new Date().toISOString(),
  };

  dispatch(setComment([...comments, optimisticComment]));

  addCommentById(commentData, {
    onSuccess: () => {
      setCommentText("");
    },
    onError: (error) => {
      console.error("Error adding comment:", error);
      queryClient.invalidateQueries(["getComment", postId]);
    },
  });
};


  return (
    <div className="w-full h-full p-6 rounded-xl shadow-xl border border-base-100 overflow-hidden">
      <h2 className="text-xl font-semibold text-base-content mb-4">Comments</h2>
      <div className="h-[calc(75%-2.5rem)] overflow-y-auto pr-2">
        {comments.length === 0 ? (
          <p className="text-base-content/60 text-center">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="mb-4 p-4 bg-base-100 rounded-lg border border-base-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="w-8 h-8 rounded-full ring ring-primary/50 ring-offset-base-100 ring-offset-1">
                      <img
                        src={comment.userId.profilePic}
                        alt="Commenter"
                        className="object-cover rounded-full"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-base-content">
                      {comment.userId.username}
                    </span>
                    <span className="text-xs text-base-content/50 block">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-base-content/80">{comment.content}</p>
            </div>
          ))
        )}
      </div>
      {/* Comment Input */}
      <div className="mt-4">
        <form onSubmit={handleSubmit}>
          <textarea
          className="textarea textarea-bordered w-full"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={isPending}
        ></textarea>
        <button disabled={isPending || !commentText.trim()} className="btn bg-white text-black font-semibold mt-2">
          {isPending ? "Posting..." : "Post Comment"}
        </button>
        </form>
      </div>
    </div>
  );
};


export default CommentSection;
