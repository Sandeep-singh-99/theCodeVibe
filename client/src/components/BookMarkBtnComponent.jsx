import { Bookmark, BookmarkCheck } from "lucide-react";
import { useBookmarkPost } from "../api/bookmarkApi";
import { useDispatch, useSelector } from "react-redux";
import { setBookmarkPosts } from "../redux/slice/bookmarkSlice";
import toast from "react-hot-toast";

export default function BookMarkBtnComponent({ id }) {
  const bookmarkMutation = useBookmarkPost();
  const { bookmarkPosts, isLoading } = useSelector((state) => state.bookmark);

  const dispatch = useDispatch()

  const isBookmarked = Array.isArray(bookmarkPosts)
  ? bookmarkPosts.some((bookmark) => {
      const post = bookmark.postId;
      return typeof post === "string" ? post === id : post._id === id;
    })
  : false;


  const handleBookmarkClick = () => {
  bookmarkMutation.mutate(id, {
    onSuccess: (data) => {
      console.log("Bookmark data:", data);
      dispatch(setBookmarkPosts(data.data)); 
      toast.success(data.message);
    },
    onError: (error) => {
      console.log("Bookmark error:", error);
      const errorMessage =
        error.response?.data?.error || "Bookmark action failed.";
      toast.error(errorMessage);
    },
  });
};


  if (isLoading) {
    return (
      <button className="btn btn-ghost" disabled>
        Loading...
      </button>
    );
  }

  return (
    <button
      className={`btn text-base-content/60 btn-ghost ${
        isBookmarked ? "text-primary" : ""
      }`}
      onClick={handleBookmarkClick}
      title={isBookmarked ? "Already Bookmarked" : "Add Bookmark"}
    >
      {isBookmarked ? <BookmarkCheck className="fill-current" /> : <Bookmark />}
    </button>
  );
}
