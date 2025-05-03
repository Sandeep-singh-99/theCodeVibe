import React, { useEffect, useRef } from "react";
import SuggestedUsers from "../components/SuggestedUsers";
import PostCardComponents from "../components/PostCardComponents";
import { useGetAllPost } from "../api/postApi";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, setLoading, setError } from "../redux/slice/postSlice";
import toast from "react-hot-toast";

export default function Home() {
  const dispatch = useDispatch();
  const { posts, isError: reduxError } = useSelector((state) => state.posts);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useGetAllPost();
  const loadMoreRef = useRef(null);


  useEffect(() => {
    if (data) {
      const allPosts = data.pages.flatMap((page) => page.posts);
      dispatch(setPosts(allPosts));
    }
  }, [data, dispatch]);

  
  useEffect(() => {
    dispatch(setLoading(isLoading || isFetchingNextPage));
    if (isError) {
      const errorMessage = error?.response?.data?.message || error.message;
      dispatch(setError(errorMessage));
      toast.error(errorMessage, { id: "post-error" });
    }
  }, [isLoading, isFetchingNextPage, isError, error, dispatch]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="min-h-screen p-6 bg-black">
      <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="flex-1 max-w-2xl">
          <div className="space-y-6">
            {isLoading && <p className="text-white text-center">Loading posts...</p>}
            <PostCardComponents />
            <div ref={loadMoreRef} className="h-10">
              {isFetchingNextPage && <p className="text-white text-center">Loading more...</p>}
              {!hasNextPage && posts.length > 0 && (
                <p className="text-white text-center">No more posts to load.</p>
              )}
            </div>
          </div>
        </div>

        <div className="hidden lg:block w-80 sticky top-6 h-fit z-[10]">
          <div className="rounded-2xl shadow-lg">
            {/* <SuggestedUsers /> */}
          </div>
        </div>
      </div>
    </div>
  );
}