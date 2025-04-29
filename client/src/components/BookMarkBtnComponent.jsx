import React from 'react'
import { Bookmark } from 'lucide-react'
import { useBookmarkPost } from '../api/bookmarkApi'
import toast from 'react-hot-toast'

export default function BookMarkBtnComponent({ id }) {
  const bookmarkMutation = useBookmarkPost();

  const handleBookmarkClick = () => {
    bookmarkMutation.mutate(id, {
      onSuccess: (data) => {
        toast.success(data.message || "Bookmark created!");
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || "Failed to bookmark");
      },
    });
  };

  return (
    <button onClick={handleBookmarkClick}>
      <Bookmark />
    </button>
  );
}
