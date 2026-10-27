import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setFollowingIds,
  addFollowingId,
  removeFollowingId,
} from "../../store/authSlice.js";
import { toast } from "react-toastify";
import Logo from "../DashBoard/Logo.jsx";
import LeftSideBar from "../DashBoard/LeftSideBar.jsx";
import LeftSideBarUserProfile from "../DashBoard/LeftSideBarUserProfile.jsx";
import MobileBottomNav from "../DashBoard/MobileBottomNav.jsx";
import {
  Share2,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Info,
  X,
  Send,
  UserCheck,
  UserPlus,
} from "lucide-react";
import VideoPlayer from "./VideoSetup/VideoPlayer.jsx";

// Helper: Format relative timestamp (e.g., "2d ago")
function formatRelativeTime(dateString) {
  if (!dateString) return "";
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function Reels() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth?.userData);
  const reduxFollowingIds = useSelector(
    (state) => state.auth?.followingIds || []
  );

  const [res, setResponse] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedDescMap, setExpandedDescMap] = useState({});
  const [followingMap, setFollowingMap] = useState({});
  const [followActionLoading, setFollowActionLoading] = useState({});

  // Dynamic user follow stats for left sidebar
  const [userFollowersCount, setUserFollowersCount] = useState(0);
  const [userFollowingsCount, setUserFollowingsCount] = useState(0);

  // Comments drawer state
  const [commentsState, setCommentsState] = useState({
    isOpen: false,
    videoId: null,
    comments: [],
    loading: false,
    newComment: "",
    submitting: false,
  });

  const observer = useRef();
  const reelRefs = useRef([]);

  // Fetch logged-in user's followings & sidebar counts to maintain consistent state
  useEffect(() => {
    if (!currentUser?._id) return;

    const fetchUserSocialState = async () => {
      try {
        const [followingsRes, followersRes] = await Promise.allSettled([
          axios.get(
            `${import.meta.env.VITE_API_URL}/follow/getAllFollowingsOfLoggedInUser`,
            { withCredentials: true }
          ),
          axios.get(
            `${import.meta.env.VITE_API_URL}/follow/getAllFollowersOfLoggedInUser`,
            { withCredentials: true }
          ),
        ]);

        if (followingsRes.status === "fulfilled") {
          const raw =
            followingsRes.value?.data?.response ??
            followingsRes.value?.data?.data;
          const list = Array.isArray(raw) ? raw : [];
          const map = {};
          const ids = [];
          list.forEach((item) => {
            const id = (item._id || item.Following || item)?.toString();
            if (id) {
              map[id] = true;
              ids.push(id);
            }
          });
          setFollowingMap(map);
          setUserFollowingsCount(list.length);
          dispatch(setFollowingIds(ids));
        }

        if (followersRes.status === "fulfilled") {
          const raw =
            followersRes.value?.data?.response ??
            followersRes.value?.data?.data;
          const followers = Array.isArray(raw) ? raw : [];
          setUserFollowersCount(followers.length);
        }
      } catch (err) {
        console.error("Error fetching social state:", err);
      }
    };

    fetchUserSocialState();
  }, [currentUser?._id, dispatch]);

  // Fetch reels with pagination & credentials
  const fetchReels = useCallback(
    async (isReset = false) => {
      const targetPage = isReset ? 1 : page;
      if (isReset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_VIDEO_SERVICE_URL}/video/fetch?page=${targetPage}&limit=5`,
          { withCredentials: true }
        );

        const rawData = response.data?.data || [];
        const currentUserId = currentUser?._id
          ? currentUser._id.toString()
          : null;

        // Normalize reel metadata and compute user's like/dislike state
        const normalized = rawData.map((item) => {
          const likesList = Array.isArray(item.likes) ? item.likes : [];
          const dislikesList = Array.isArray(item.dislikes) ? item.dislikes : [];

          const isLiked = currentUserId
            ? likesList.some(
                (uid) => (uid?._id || uid)?.toString() === currentUserId
              )
            : false;

          const isDisliked = currentUserId
            ? dislikesList.some(
                (uid) => (uid?._id || uid)?.toString() === currentUserId
              )
            : false;

          const rawUsername =
            item.owner?.username || item.userId?.userName || "creator";
          const cleanUsername = rawUsername.replace(/^@+/, "");

          return {
            ...item,
            owner: {
              _id: item.owner?._id || item.userId?._id || null,
              username: cleanUsername,
              fullName:
                item.owner?.fullName ||
                item.userId?.fullName ||
                cleanUsername,
              profilePic:
                item.owner?.profilePic ||
                item.userId?.profilePicture ||
                "/default-avatar.png",
              followers: item.owner?.followers || 0,
            },
            likesCount:
              typeof item.likesCount === "number"
                ? item.likesCount
                : likesList.length,
            dislikesCount:
              typeof item.dislikesCount === "number"
                ? item.dislikesCount
                : dislikesList.length,
            commentsCount:
              typeof item.commentsCount === "number"
                ? item.commentsCount
                : Array.isArray(item.comments)
                ? item.comments.length
                : 0,
            isLiked,
            isDisliked,
          };
        });

        if (isReset) {
          setResponse(normalized);
          setHasMore(normalized.length >= 5);
        } else {
          if (normalized.length === 0) {
            setHasMore(false);
          } else {
            setResponse((prev) => {
              const existingIds = new Set(prev.map((r) => r._id));
              const freshOnly = normalized.filter((r) => !existingIds.has(r._id));
              return [...prev, ...freshOnly];
            });
          }
        }
      } catch (error) {
        console.error("Error fetching video data:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [page, currentUser]
  );

  useEffect(() => {
    fetchReels(page === 1);
  }, [page, fetchReels]);

  // Infinite Scroll Intersection Observer
  const lastVideoRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore]
  );

  // Active visible reel observer for audio control
  useEffect(() => {
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.reelIndex);
            if (!isNaN(index)) setActiveIndex(index);
          }
        });
      },
      { threshold: 0.6 }
    );

    reelRefs.current.forEach((el) => {
      if (el) visibilityObserver.observe(el);
    });

    return () => visibilityObserver.disconnect();
  }, [res]);

  // Handle Like
  const handleLike = async (videoId) => {
    if (!currentUser?._id) {
      toast.info("Please login to like reels");
      return;
    }

    const reel = res.find((r) => r._id === videoId);
    if (!reel) return;

    const wasLiked = reel.isLiked;

    // Optimistic UI update
    setResponse((prev) =>
      prev.map((item) => {
        if (item._id !== videoId) return item;
        return {
          ...item,
          isLiked: !wasLiked,
          isDisliked: false,
          likesCount: wasLiked
            ? Math.max(0, item.likesCount - 1)
            : item.likesCount + 1,
          dislikesCount: item.isDisliked
            ? Math.max(0, item.dislikesCount - 1)
            : item.dislikesCount,
        };
      })
    );

    try {
      const apiRes = await axios.patch(
        `${import.meta.env.VITE_VIDEO_SERVICE_URL}/video/like-video/${videoId}`,
        {},
        { withCredentials: true }
      );
      if (apiRes.data?.data) {
        setResponse((prev) =>
          prev.map((item) =>
            item._id === videoId
              ? {
                  ...item,
                  likesCount: apiRes.data.data.likeCount,
                  dislikesCount: apiRes.data.data.dislikeCount,
                  isLiked: true,
                  isDisliked: false,
                }
              : item
          )
        );
      }
    } catch (err) {
      console.error("Error liking reel:", err);
      toast.error(err.response?.data?.message || "Could not like reel");
      fetchReels(true);
    }
  };

  // Handle Dislike
  const handleDislike = async (videoId) => {
    if (!currentUser?._id) {
      toast.info("Please login to dislike reels");
      return;
    }

    const reel = res.find((r) => r._id === videoId);
    if (!reel) return;

    const wasDisliked = reel.isDisliked;

    // Optimistic UI update
    setResponse((prev) =>
      prev.map((item) => {
        if (item._id !== videoId) return item;
        return {
          ...item,
          isDisliked: !wasDisliked,
          isLiked: false,
          dislikesCount: wasDisliked
            ? Math.max(0, item.dislikesCount - 1)
            : item.dislikesCount + 1,
          likesCount: item.isLiked
            ? Math.max(0, item.likesCount - 1)
            : item.likesCount,
        };
      })
    );

    try {
      const apiRes = await axios.patch(
        `${import.meta.env.VITE_VIDEO_SERVICE_URL}/video/dislike-video/${videoId}`,
        {},
        { withCredentials: true }
      );
      if (apiRes.data?.data) {
        setResponse((prev) =>
          prev.map((item) =>
            item._id === videoId
              ? {
                  ...item,
                  likesCount: apiRes.data.data.likeCount,
                  dislikesCount: apiRes.data.data.dislikeCount,
                  isLiked: false,
                  isDisliked: true,
                }
              : item
          )
        );
      }
    } catch (err) {
      console.error("Error disliking reel:", err);
      toast.error(err.response?.data?.message || "Could not dislike reel");
      fetchReels(true);
    }
  };

  // Handle Share
  const handleShare = async (reel) => {
    const shareUrl = `${window.location.origin}/reels`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: reel.title || "SocioVerse Reel",
          text: reel.description || "Watch this reel on SocioVerse!",
          url: shareUrl,
        });
      } catch {
        // user dismissed dialog
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Reel link copied to clipboard! 📋");
    }
  };

  // Handle Follow User
  const handleFollow = async (ownerId) => {
    if (!currentUser?._id) {
      toast.info("Please login to follow creators");
      return;
    }
    if (!ownerId) return;
    const idStr = ownerId.toString();
    if (currentUser._id?.toString() === idStr) return;

    setFollowActionLoading((prev) => ({ ...prev, [idStr]: true }));

    // Optimistic UI update: mark as followed in both local state and Redux
    setFollowingMap((prev) => ({ ...prev, [idStr]: true }));
    dispatch(addFollowingId(idStr));
    setUserFollowingsCount((prev) => prev + 1);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/follow/followUser/${idStr}`,
        {},
        { withCredentials: true }
      );
      toast.success("Following creator! 🎉");
    } catch (err) {
      console.error("Follow error:", err);
      // Revert if error
      setFollowingMap((prev) => ({ ...prev, [idStr]: false }));
      dispatch(removeFollowingId(idStr));
      setUserFollowingsCount((prev) => Math.max(0, prev - 1));
      toast.error(err.response?.data?.message || "Could not follow creator");
    } finally {
      setFollowActionLoading((prev) => ({ ...prev, [idStr]: false }));
    }
  };

  // Open Comments Drawer
  const openComments = async (videoId) => {
    setCommentsState({
      isOpen: true,
      videoId,
      comments: [],
      loading: true,
      newComment: "",
      submitting: false,
    });

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_VIDEO_SERVICE_URL}/video/comments/${videoId}`,
        { withCredentials: true }
      );
      setCommentsState((prev) => ({
        ...prev,
        comments: response.data?.data || [],
        loading: false,
      }));
    } catch (err) {
      console.error("Error fetching comments:", err);
      setCommentsState((prev) => ({ ...prev, loading: false }));
    }
  };

  // Submit New Comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser?._id) {
      toast.info("Please login to comment");
      return;
    }
    const text = commentsState.newComment.trim();
    if (!text) return;

    setCommentsState((prev) => ({ ...prev, submitting: true }));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_VIDEO_SERVICE_URL}/video/comment/${commentsState.videoId}`,
        { comment: text },
        { withCredentials: true }
      );

      const added = response.data?.data?.comment || {
        _id: Date.now().toString(),
        comment: text,
        timestamp: new Date(),
        userId: {
          userName: currentUser.userName,
          fullName: currentUser.fullName,
          profilePicture: currentUser.profilePicture,
        },
      };

      setCommentsState((prev) => ({
        ...prev,
        comments: [...prev.comments, added],
        newComment: "",
        submitting: false,
      }));

      // Update count on reel card
      setResponse((prev) =>
        prev.map((item) =>
          item._id === commentsState.videoId
            ? { ...item, commentsCount: (item.commentsCount || 0) + 1 }
            : item
        )
      );

      toast.success("Comment added!");
    } catch (err) {
      console.error("Failed to post comment:", err);
      toast.error(err.response?.data?.message || "Failed to post comment");
      setCommentsState((prev) => ({ ...prev, submitting: false }));
    }
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-12 gap-1 min-h-[100dvh] w-full overflow-x-hidden relative pb-16 md:pb-0">
      {/* Left Sidebar — matches Dashboard layout */}
      <div className="hidden md:block md:col-span-2 shadow-md px-2 py-2 bg-opacity-30">
        <Logo />
        <LeftSideBarUserProfile
          followers={userFollowersCount}
          followings={userFollowingsCount}
        />
        <div className="py-2 my-2">
          <LeftSideBar />
        </div>
      </div>

      {/* Main Reels Content */}
      <main className="w-full md:col-span-10 relative h-[100dvh] overflow-y-scroll snap-y snap-mandatory scrollbar-hide flex justify-center px-2 sm:px-6">
        <div className="w-full sm:w-[28rem] md:w-[32rem] lg:w-[34rem] xl:w-[36rem] py-6">
          {loading && res.length === 0 ? (
            /* Skeleton loader */
            <div className="flex flex-col gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-[80vh] rounded-2xl bg-slate-800/60 animate-pulse"
                />
              ))}
            </div>
          ) : res.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-[70vh] text-slate-400">
              <Info size={48} className="mb-4 text-sky-400" />
              <p className="text-lg font-montserrat font-semibold text-sky-300">
                No reels yet
              </p>
              <p className="text-sm mt-1">
                Check back later or upload your first reel!
              </p>
            </div>
          ) : (
            res.map((el, index) => {
              const isLast = index === res.length - 1;
              const ownerId = (el.owner?._id || el.userId?._id)?.toString();
              const isSelf =
                currentUser?._id &&
                ownerId &&
                currentUser._id.toString() === ownerId;
              const isFollowing = ownerId
                ? Boolean(
                    followingMap[ownerId] || reduxFollowingIds.includes(ownerId)
                  )
                : false;
              const isDescExpanded = !!expandedDescMap[el._id];

              return (
                <div
                  key={el?._id || index}
                  ref={(node) => {
                    reelRefs.current[index] = node;
                    if (isLast) lastVideoRef(node);
                  }}
                  data-reel-index={index}
                  className="snap-start relative w-full h-[85vh] mb-6 rounded-2xl overflow-hidden bg-black shadow-xl border border-slate-700/40"
                >
                  {/* Video Player */}
                  <VideoPlayer
                    src={el?.hlsPath}
                    isVisible={index === activeIndex}
                    className="w-full h-full object-cover"
                  />

                  {/* Bottom Overlay — User info, date & dynamic caption */}
                  <div className="absolute bottom-0 w-full p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none">
                    <div className="pointer-events-auto">
                      {/* Creator Info Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className="flex items-center gap-3 cursor-pointer group"
                          onClick={() => {
                            if (ownerId) {
                              if (isSelf) {
                                navigate("/my_account");
                              } else {
                                navigate(`/userAdmin/${ownerId}`);
                              }
                            }
                          }}
                        >
                          <img
                            src={el?.owner?.profilePic || "/default-avatar.png"}
                            alt={el?.owner?.username || "creator"}
                            onError={(e) => {
                              e.target.src = "/default-avatar.png";
                            }}
                            className="w-10 h-10 rounded-full border-2 border-sky-400/60 shadow-md object-cover group-hover:scale-105 transition-transform"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-sky-100 font-montserrat group-hover:text-sky-300 transition-colors">
                                @{el?.owner?.username || "creator"}
                              </p>
                              {el?.createdAt && (
                                <span className="text-[11px] text-slate-400">
                                  • {formatRelativeTime(el.createdAt)}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-blue-200/70 font-montserrat">
                              {el?.owner?.fullName || "Creator"}
                            </p>
                          </div>
                        </div>

                        {/* Follow Button: consistent state across application */}
                        {isSelf ? (
                          <span className="px-3 py-1 text-xs font-semibold bg-slate-800/80 border border-slate-600/40 text-slate-300 rounded-full font-montserrat">
                            You
                          </span>
                        ) : isFollowing ? (
                          /* Already followed: disabled / marked as follow */
                          <button
                            disabled
                            aria-label="Following"
                            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full bg-slate-800/90 text-sky-400 border border-sky-400/40 cursor-default font-montserrat shadow-sm"
                          >
                            <UserCheck size={14} className="text-sky-400" />
                            <span>Following</span>
                          </button>
                        ) : (
                          /* Not followed: active follow button */
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFollow(ownerId);
                            }}
                            disabled={ownerId ? followActionLoading[ownerId] : false}
                            aria-label="Follow creator"
                            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full bg-sky-500 hover:bg-sky-400 active:scale-95 text-white font-montserrat shadow-md shadow-sky-500/25 transition-all disabled:opacity-50"
                          >
                            {ownerId && followActionLoading[ownerId] ? (
                              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                <UserPlus size={14} />
                                <span>Follow</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Video Title & Description */}
                      <h2 className="text-base sm:text-lg font-semibold text-white font-montserrat drop-shadow-md">
                        {el.title || "Untitled Reel"}
                      </h2>
                      {el.description && (
                        <p className="text-xs sm:text-sm text-blue-100/80 mt-1 font-montserrat leading-relaxed">
                          {isDescExpanded
                            ? el.description
                            : el.description.length > 85
                            ? `${el.description.slice(0, 85)}...`
                            : el.description}
                          {el.description.length > 85 && (
                            <button
                              onClick={() =>
                                setExpandedDescMap((prev) => ({
                                  ...prev,
                                  [el._id]: !prev[el._id],
                                }))
                              }
                              className="ml-1 text-sky-400 font-semibold hover:underline"
                            >
                              {isDescExpanded ? " less" : " more"}
                            </button>
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Side Actions Bar */}
                  <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
                    {/* Like Action */}
                    <div className="flex flex-col items-center gap-1 group">
                      <button
                        aria-label="Like"
                        onClick={() => handleLike(el._id)}
                        className={`p-3 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95 ${
                          el.isLiked
                            ? "bg-sky-500/30 border-sky-400 text-sky-400 shadow-sky-500/40"
                            : "bg-slate-900/70 border-slate-700/50 text-slate-300 hover:text-sky-300 hover:border-sky-400/40"
                        }`}
                      >
                        <ThumbsUp
                          size={22}
                          className={el.isLiked ? "fill-sky-400" : ""}
                        />
                      </button>
                      <span className="text-[11px] font-semibold text-sky-200 font-montserrat">
                        {el.likesCount ?? 0}
                      </span>
                    </div>

                    {/* Dislike Action */}
                    <div className="flex flex-col items-center gap-1 group">
                      <button
                        aria-label="Dislike"
                        onClick={() => handleDislike(el._id)}
                        className={`p-3 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95 ${
                          el.isDisliked
                            ? "bg-rose-500/30 border-rose-400 text-rose-400 shadow-rose-500/40"
                            : "bg-slate-900/70 border-slate-700/50 text-slate-300 hover:text-rose-300 hover:border-rose-400/40"
                        }`}
                      >
                        <ThumbsDown
                          size={22}
                          className={el.isDisliked ? "fill-rose-400" : ""}
                        />
                      </button>
                      <span className="text-[11px] font-semibold text-slate-300 font-montserrat">
                        {el.dislikesCount ?? 0}
                      </span>
                    </div>

                    {/* Comment Action */}
                    <div className="flex flex-col items-center gap-1 group">
                      <button
                        aria-label="Comment"
                        onClick={() => openComments(el._id)}
                        className="p-3 rounded-full bg-slate-900/70 backdrop-blur-md border border-slate-700/50 shadow-lg transition-all duration-300 ease-out hover:scale-110 hover:bg-sky-500/20 hover:border-sky-400/40 text-slate-300 hover:text-sky-300"
                      >
                        <MessageCircle size={22} />
                      </button>
                      <span className="text-[11px] font-semibold text-slate-300 font-montserrat">
                        {el.commentsCount ?? 0}
                      </span>
                    </div>

                    {/* Share Action */}
                    <div className="flex flex-col items-center gap-1 group">
                      <button
                        aria-label="Share"
                        onClick={() => handleShare(el)}
                        className="p-3 rounded-full bg-slate-900/70 backdrop-blur-md border border-slate-700/50 shadow-lg transition-all duration-300 ease-out hover:scale-110 hover:bg-sky-500/20 hover:border-sky-400/40 text-slate-300 hover:text-sky-300"
                      >
                        <Share2 size={22} />
                      </button>
                      <span className="text-[10px] text-slate-400 font-montserrat">
                        Share
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Loading indicator when fetching more */}
          {loadingMore && (
            <div className="flex justify-center py-6">
              <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!hasMore && res.length > 0 && (
            <p className="text-center py-6 text-slate-500 font-montserrat text-sm">
              No more reels 🎬
            </p>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* ── Create Reel FAB ── */}
      <button
        aria-label="Create a new Reel"
        onClick={() => navigate("/reels/upload")}
        className="fixed bottom-24 md:bottom-8 right-6 md:right-10 z-40
          flex items-center gap-2.5
          px-5 py-3
          rounded-full
          bg-gradient-to-r from-sky-500 to-blue-600
          hover:from-sky-400 hover:to-blue-500
          text-white font-montserrat font-semibold text-sm tracking-wide
          shadow-lg shadow-sky-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <span>Create Reel</span>
      </button>

      {/* ── Comments Drawer / Modal ── */}
      {commentsState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full sm:max-w-md bg-slate-900 border border-slate-700/70 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[75vh] h-[70vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800">
              <h3 className="font-montserrat font-semibold text-white text-base">
                Comments ({commentsState.comments.length})
              </h3>
              <button
                onClick={() =>
                  setCommentsState((prev) => ({ ...prev, isOpen: false }))
                }
                className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {commentsState.loading ? (
                <div className="flex justify-center py-12">
                  <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : commentsState.comments.length === 0 ? (
                <div className="text-center py-12 text-slate-400 font-montserrat text-sm">
                  No comments yet. Start the conversation!
                </div>
              ) : (
                commentsState.comments.map((c, i) => (
                  <div key={c._id || i} className="flex gap-3 text-sm">
                    <img
                      src={
                        c.userId?.profilePicture || "/default-avatar.png"
                      }
                      alt={c.userId?.userName || "user"}
                      onError={(e) => {
                        e.target.src = "/default-avatar.png";
                      }}
                      className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                    />
                    <div className="flex-1 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/40">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-sky-200 font-montserrat">
                          @{c.userId?.userName || "user"}
                        </span>
                        {c.timestamp && (
                          <span className="text-[10px] text-slate-400">
                            {formatRelativeTime(c.timestamp)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-200 font-montserrat break-words">
                        {c.comment}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Input */}
            <form
              onSubmit={handleCommentSubmit}
              className="p-3 border-t border-slate-800 flex items-center gap-2 bg-slate-900/90"
            >
              <input
                type="text"
                placeholder={
                  currentUser?._id
                    ? "Add a comment..."
                    : "Please login to comment"
                }
                disabled={!currentUser?._id || commentsState.submitting}
                value={commentsState.newComment}
                onChange={(e) =>
                  setCommentsState((prev) => ({
                    ...prev,
                    newComment: e.target.value,
                  }))
                }
                className="flex-1 bg-slate-800/80 border border-slate-700 text-sm text-white rounded-full px-4 py-2 focus:outline-none focus:border-sky-400 placeholder:text-slate-500 font-montserrat"
              />
              <button
                type="submit"
                disabled={
                  !currentUser?._id ||
                  !commentsState.newComment.trim() ||
                  commentsState.submitting
                }
                className="p-2.5 rounded-full bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:hover:bg-sky-500 text-white transition-all shadow-md shadow-sky-500/20"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reels;
