import { useDispatch, useSelector } from "react-redux";
import { useFollowOrUnfollow } from "../api/authApi";
import { setUpdateProfile } from "../redux/slice/authSlice";
import toast from "react-hot-toast";

const FollowUnfollowBtn = ({ userId, className = "", btnClassName = "" }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { mutate: followOrUnfollow, isPending } = useFollowOrUnfollow();

  if (!user) {
    return null; 
  }

  const isFollowing = user?.following?.some((followedUser) => followedUser._id === userId) || false;

  const handleFollowToggle = () => {
    const updatedFollowing = isFollowing
      ? user.following.filter((followedUser) => followedUser._id !== userId)
      : [
          ...user.following,
          { _id: userId, username: "", profilePic: "" },
        ];
    dispatch(setUpdateProfile({ ...user, following: updatedFollowing }));

    followOrUnfollow(userId, {
      onSuccess: (data) => {
        const following = data.data.following?.map((user) => ({
          _id: user._id,
          username: user.username,
          profilePic: user.profilePic,
        })) || [];
        const followers = data.data.followers?.map((user) => ({
          _id: user._id,
          username: user.username,
          profilePic: user.profilePic,
        })) || [];
        dispatch(
          setUpdateProfile({
            ...data.data,
            following,
            followers,
          })
        );
        toast.success(data?.message || "Follow status updated");
      },
      onError: (err) => {
        dispatch(setUpdateProfile(user));
        toast.error(err?.message || "Failed to update follow status");
      },
    });
  };

  return (
    <button
      onClick={handleFollowToggle}
      className={`cursor-pointer ${className} ${
        isFollowing ? "text-blue-500" : "text-red-500"
      } ${btnClassName} transition-all duration-200`}
      disabled={isPending}
    >
      {isPending ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowUnfollowBtn;