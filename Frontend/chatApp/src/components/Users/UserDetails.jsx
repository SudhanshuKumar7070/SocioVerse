import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addFollowingId, removeFollowingId } from "../../store/authSlice.js";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  UserPlus,
  Heart,
  MessageCircle,
  MapPin,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Lock,
  Grid3X3,
  List,
  Image as ImageIcon,
  Sparkles,
  Users,
  Plus,
} from "lucide-react";
import TweetCard from "../Tweets/TweetCard";
import MobileBottomNav from "../DashBoard/MobileBottomNav";

/* ───────── Skeleton Loaders ───────── */
const ProfileSkeleton = () => (
  <div className="animate-pulse">
    {/* Banner Skeleton */}
    <div className="h-44 sm:h-60 md:h-72 bg-slate-800/60 w-full" />
    <div className="px-4 sm:px-8 pb-6">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 sm:-mt-20 mb-6">
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-slate-800 border-4 border-slate-900 shrink-0" />
        <div className="flex-1 space-y-3 pt-4">
          <div className="w-48 h-6 bg-slate-800 rounded-lg" />
          <div className="w-28 h-4 bg-slate-800/70 rounded" />
        </div>
      </div>
      <div className="space-y-3 mb-6">
        <div className="w-full h-3 bg-slate-800/60 rounded" />
        <div className="w-3/4 h-3 bg-slate-800/60 rounded" />
      </div>
      <div className="flex gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-20 h-12 bg-slate-800/50 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

const TweetSkeleton = () => (
  <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-lg animate-pulse">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-full bg-slate-800 shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1">
        <div className="w-32 h-3.5 bg-slate-800 rounded" />
        <div className="w-20 h-2.5 bg-slate-800/70 rounded" />
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="w-full h-3 bg-slate-800/90 rounded" />
      <div className="w-5/6 h-3 bg-slate-800/90 rounded" />
    </div>
    <div className="flex justify-between items-center pt-2 border-t border-slate-800/50">
      <div className="w-12 h-4 bg-slate-800/60 rounded" />
      <div className="w-12 h-4 bg-slate-800/60 rounded" />
      <div className="w-12 h-4 bg-slate-800/60 rounded" />
    </div>
  </div>
);

const GridSkeleton = () => (
  <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
    {[...Array(9)].map((_, i) => (
      <div
        key={i}
        className="aspect-square bg-slate-800/60 rounded-lg animate-pulse"
      />
    ))}
  </div>
);

/* ───────── Stat Pill ───────── */
const StatPill = ({ label, value, icon: Icon, color }) => (
  <motion.div
    className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl bg-slate-800/40 border border-slate-700/50 min-w-[80px] hover:bg-slate-800/60 transition-all cursor-default"
    whileHover={{ scale: 1.05, y: -2 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
      <Icon className="w-4 h-4" />
    </div>
    <span className="text-lg font-bold text-white font-montserrat">{value}</span>
    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-poppins">
      {label}
    </span>
  </motion.div>
);

/* ───────── Main Component ───────── */
export default function UserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth?.userData);
  const Url = import.meta.env.VITE_API_URL;

  const reduxFollowingIds = useSelector(
    (state) => state.auth?.followingIds || []
  );

  // Profile data states
  const [data, setData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(() =>
    userId ? reduxFollowingIds.includes(userId.toString()) : false
  );
  const [isFriend, setIsFriend] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Sync follow state when reduxFollowingIds or userId changes
  useEffect(() => {
    if (userId) {
      setIsFollowing(reduxFollowingIds.includes(userId.toString()));
    }
  }, [userId, reduxFollowingIds]);

  // Tweets states
  const [tweets, setTweets] = useState([]);
  const [tweetsPage, setTweetsPage] = useState(1);
  const [hasMoreTweets, setHasMoreTweets] = useState(true);
  const [tweetsLoading, setTweetsLoading] = useState(true);
  const isFetchingTweets = useRef(false);

  // View mode: grid or list
  const [viewMode, setViewMode] = useState("list");

  /* ───────── Fetch Profile ───────── */
  const fetchProfile = useCallback(async () => {
    setProfileLoading(true);
    try {
      const res = await axios.get(`${Url}/user/user_data/${userId}`, {
        withCredentials: true,
      });
      const raw = res?.data?.response;
      const profile = Array.isArray(raw) ? raw[0] : raw;
      setData(profile || null);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    } finally {
      setProfileLoading(false);
    }
  }, [userId, Url]);

  /* ───────── Fetch Tweets ───────── */
  const fetchTweets = useCallback(
    async (page = 1, reset = false) => {
      if (isFetchingTweets.current) return;
      isFetchingTweets.current = true;
      if (page === 1) setTweetsLoading(true);

      try {
        const res = await axios.get(
          `${Url}/tweet/userTweets/${userId}?page=${page}&limit=9`,
          { withCredentials: true }
        );
        const resData = res?.data?.response;
        const list =
          resData?.tweets ||
          resData?.[0]?.UserTweets ||
          (Array.isArray(resData) ? resData : []);

        if (reset || page === 1) {
          setTweets(list);
        } else {
          setTweets((prev) => {
            const ids = new Set(prev.map((t) => t?._id?.toString()));
            const filtered = list.filter(
              (t) => t?._id && !ids.has(t._id.toString())
            );
            return [...prev, ...filtered];
          });
        }
        setTweetsPage(page);
        setHasMoreTweets(resData?.hasNextPage ?? list.length >= 9);
      } catch (err) {
        console.error("Error fetching user tweets:", err);
        if (page === 1) setTweets([]);
        setHasMoreTweets(false);
      } finally {
        setTweetsLoading(false);
        isFetchingTweets.current = false;
      }
    },
    [userId, Url]
  );

  const fetchNextTweets = () => {
    if (!hasMoreTweets || isFetchingTweets.current) return;
    fetchTweets(tweetsPage + 1);
  };

  /* ───────── Follow Status Check ───────── */
  const checkFollowStatus = useCallback(async () => {
    if (!userId || currentUser?._id === userId) return;
    try {
      const res = await axios.get(`${Url}/follow/isFollowingUser/${userId}`, {
        withCredentials: true,
      });
      if (res?.data?.response?.isFollowing !== undefined) {
        const following = Boolean(res.data.response.isFollowing);
        setIsFollowing(following);
        if (following) {
          dispatch(addFollowingId(userId.toString()));
        } else {
          dispatch(removeFollowingId(userId.toString()));
        }
      }
    } catch (err) {
      console.error("Error checking follow status:", err);
    }
  }, [userId, currentUser?._id, Url, dispatch]);

  /* ───────── Actions ───────── */
  const handleFollowUser = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    const targetUserId = userId?.toString();
    try {
      if (isFollowing) {
        setIsFollowing(false);
        if (targetUserId) dispatch(removeFollowingId(targetUserId));
        setData((prev) => {
          if (!prev) return prev;
          const currentFollowers = Array.isArray(prev.Followers) ? prev.Followers : [];
          return {
            ...prev,
            Followers: currentFollowers.filter(
              (f) => (f.Follower || f._id)?.toString() !== currentUser?._id?.toString()
            ),
          };
        });
        await axios.post(
          `${Url}/follow/unfollowUser/${targetUserId}`,
          {},
          { withCredentials: true }
        );
      } else {
        setIsFollowing(true);
        if (targetUserId) dispatch(addFollowingId(targetUserId));
        setData((prev) => {
          if (!prev) return prev;
          const currentFollowers = Array.isArray(prev.Followers) ? prev.Followers : [];
          return {
            ...prev,
            Followers: [...currentFollowers, { Follower: currentUser?._id }],
          };
        });
        await axios.post(
          `${Url}/follow/followUser/${targetUserId}`,
          { message: "followed user" },
          { withCredentials: true }
        );
      }
    } catch (err) {
      console.error("Error toggling follow user:", err);
      // Revert if error
      setIsFollowing((prev) => !prev);
      if (isFollowing) {
        if (targetUserId) dispatch(addFollowingId(targetUserId));
      } else {
        if (targetUserId) dispatch(removeFollowingId(targetUserId));
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendFriendRequest = async () => {
    setActionLoading(true);
    try {
      await axios.post(
        `${Url}/friend_request/send_friend_request/${userId}`,
        { message: "friend request sent" },
        { withCredentials: true }
      );
      setIsFriend(true);
    } catch (err) {
      console.error("Error sending friend request:", err);
    } finally {
      setActionLoading(false);
    }
  };

  /* ───────── Effects ───────── */
  useEffect(() => {
    if (userId) {
      fetchProfile();
      checkFollowStatus();
      fetchTweets(1, true);
    }
  }, [userId, fetchProfile, checkFollowStatus, fetchTweets]);

  /* ───────── Derived Values ───────── */
  const bio = data?.bio || {};
  const banner =
    bio?.bannerImage && bio.bannerImage.trim() ? bio.bannerImage : null;
  const locationText = [bio?.location?.city, bio?.location?.country]
    .filter(Boolean)
    .join(", ");
  const isPrivate = data?.isPrivate || false;
  const isOwnProfile = currentUser?._id === userId;

  // If private and not own profile, hide posts
  const canViewPosts = !isPrivate || isOwnProfile || isFollowing;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-x-hidden flex flex-col pb-24 md:pb-12">
      {/* ─── Sticky Header ─── */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5">
        <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-slate-300 hover:text-white transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs sm:text-sm font-medium font-poppins">
              Back
            </span>
          </button>

          <div className="flex flex-col items-center">
            <h1 className="text-sm sm:text-base font-bold text-slate-100 font-montserrat truncate max-w-[180px] sm:max-w-xs">
              {data?.fullName || data?.userName || "User Profile"}
            </h1>
            <span className="text-[11px] text-slate-400 font-poppins">
              @{data?.userName || "user"}
            </span>
          </div>

          <div className="w-[72px]" />
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 mt-4 sm:mt-6">
        {profileLoading ? (
          <div className="bg-slate-900/60 border border-slate-800/90 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
            <ProfileSkeleton />
          </div>
        ) : !data ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Users className="w-16 h-16 text-slate-600" />
            <p className="text-slate-400 font-poppins text-sm">
              User not found
            </p>
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800/90 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
            {/* ─── Banner Hero ─── */}
            <div className="relative h-44 sm:h-60 md:h-72 w-full overflow-hidden bg-gradient-to-r from-cyan-900/40 via-purple-900/30 to-indigo-950/60">
              {banner ? (
                <img
                  src={banner}
                  alt="Profile Banner"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-cyan-600/30 via-indigo-600/20 to-purple-700/30 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-slate-600/40" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/20" />

              {/* Decorative circles */}
              <div className="absolute top-6 right-6 opacity-10">
                <div className="w-28 h-28 rounded-full border-2 border-white/30" />
              </div>
              <div className="absolute -bottom-4 -left-4 opacity-5">
                <div className="w-32 h-32 rounded-full bg-cyan-400" />
              </div>
            </div>

            {/* ─── Profile Identity ─── */}
            <div className="relative px-4 sm:px-8 pb-6 pt-0">
              {/* Avatar & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
                {/* Avatar */}
                <motion.div
                  className="relative inline-block self-start"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                >
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 p-1 shadow-2xl">
                    <img
                      src={
                        data?.profilePicture ||
                        "https://picsum.photos/seed/user/200/200"
                      }
                      alt={data?.fullName || "User"}
                      className="w-full h-full rounded-full object-cover border-4 border-slate-900 bg-slate-800"
                    />
                  </div>
                  <div
                    className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 rounded-full border-4 border-slate-900 shadow-md"
                    title="Online"
                  />
                </motion.div>

                {/* Action Buttons */}
                {!isOwnProfile && (
                  <motion.div
                    className="flex items-center gap-2.5 sm:gap-3 flex-wrap"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <button
                      onClick={handleFollowUser}
                      disabled={actionLoading}
                      className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 ${
                        isFollowing
                          ? "bg-slate-800/80 border border-slate-700 text-white hover:bg-slate-700"
                          : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-cyan-500/30"
                      }`}
                    >
                      {isFollowing ? (
                        <Heart className="w-4 h-4 fill-current text-rose-400" />
                      ) : (
                        <UserPlus className="w-4 h-4" />
                      )}
                      {isFollowing ? "Following" : "Follow"}
                    </button>

                    <button
                      onClick={handleSendFriendRequest}
                      disabled={actionLoading || isFriend}
                      className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 ${
                        isFriend
                          ? "bg-emerald-600/20 border border-emerald-500/40 text-emerald-400"
                          : "bg-slate-800/80 border border-slate-700 text-white hover:bg-slate-700"
                      }`}
                    >
                      {isFriend ? (
                        <Users className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      {isFriend ? "Friends" : "Add Friend"}
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/center_area/start_chat`)
                      }
                      className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white hover:bg-slate-700 font-semibold text-xs sm:text-sm transition-all duration-200 shadow-lg hover:scale-105 active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Name & Handle */}
              <motion.div
                className="space-y-1 mb-5"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-montserrat tracking-tight">
                    {data?.fullName || data?.userName || "User"}
                  </h2>
                  {data?.isVerified && (
                    <ShieldCheck
                      className="w-5 h-5 text-sky-400 shrink-0"
                      title="Verified"
                    />
                  )}
                  {isPrivate && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-semibold uppercase tracking-wider">
                      <Lock className="w-3 h-3" />
                      Private
                    </span>
                  )}
                </div>
                <p className="text-sm sm:text-base text-cyan-400 font-medium font-poppins">
                  @{data?.userName || "user"}
                </p>
              </motion.div>

              {/* Bio */}
              {bio?.text && (
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-5 max-w-3xl whitespace-pre-line font-poppins">
                  {bio.text}
                </p>
              )}

              {/* Meta info pills */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm text-slate-400 font-poppins mb-6">
                {locationText && (
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{locationText}</span>
                  </div>
                )}
                {bio?.dateOfBirth && (
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>
                      Born{" "}
                      {new Date(bio.dateOfBirth).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {data?.createdAt && (
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>
                      Joined{" "}
                      {new Date(data.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap pb-6 border-b border-slate-800/80">
                <StatPill
                  label="Followers"
                  value={data?.Followers?.length || 0}
                  icon={UserPlus}
                  color="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
                />
                <StatPill
                  label="Following"
                  value={data?.Following?.length || 0}
                  icon={Heart}
                  color="bg-purple-500/10 border border-purple-500/20 text-purple-400"
                />
                <StatPill
                  label="Friends"
                  value={data?.Friends?.length || 0}
                  icon={Users}
                  color="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                />
              </div>

              {/* Social Links */}
              {bio?.socialLinks && bio.socialLinks.length > 0 && (
                <div className="pt-5 pb-4 border-b border-slate-800/80">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-montserrat flex items-center gap-2 mb-3">
                    <ExternalLink className="w-4 h-4 text-cyan-400" />
                    Social Links
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {bio.socialLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 text-slate-300 hover:text-white transition-all text-xs font-medium group hover:scale-[1.03]"
                      >
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0 group-hover:border-cyan-400">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                        <span className="capitalize">
                          {link.platform || "Website"}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── Posts Section ─── */}
              <div className="pt-5">
                {/* Section Header + View Toggle */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-montserrat flex items-center gap-2">
                    <Grid3X3 className="w-4 h-4 text-cyan-400" />
                    Posts
                    {!tweetsLoading && (
                      <span className="text-[10px] text-slate-500 font-poppins normal-case ml-1">
                        ({tweets.length})
                      </span>
                    )}
                  </h3>

                  {canViewPosts && tweets.length > 0 && (
                    <div className="flex items-center bg-slate-800/60 border border-slate-700/50 rounded-lg p-0.5">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-1.5 rounded-md transition-all ${
                          viewMode === "grid"
                            ? "bg-cyan-500/20 text-cyan-400"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-1.5 rounded-md transition-all ${
                          viewMode === "list"
                            ? "bg-cyan-500/20 text-cyan-400"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Private Account Gate */}
                {!canViewPosts ? (
                  <motion.div
                    className="flex flex-col items-center justify-center py-16 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="w-20 h-20 rounded-full bg-slate-800/60 border border-slate-700/50 flex items-center justify-center">
                      <Lock className="w-9 h-9 text-slate-500" />
                    </div>
                    <h4 className="text-lg font-semibold text-white font-montserrat">
                      This Account is Private
                    </h4>
                    <p className="text-sm text-slate-400 font-poppins text-center max-w-sm">
                      Follow this account to see their posts and activity.
                    </p>
                  </motion.div>
                ) : tweetsLoading ? (
                  viewMode === "grid" ? (
                    <GridSkeleton />
                  ) : (
                    <div className="flex flex-col gap-4">
                      <TweetSkeleton />
                      <TweetSkeleton />
                      <TweetSkeleton />
                    </div>
                  )
                ) : tweets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <ImageIcon className="w-14 h-14 text-slate-600" />
                    <p className="text-sm text-slate-500 font-poppins">
                      No posts yet
                    </p>
                  </div>
                ) : viewMode === "grid" ? (
                  /* ─── Grid View (Instagram-like) ─── */
                  <InfiniteScroll
                    dataLength={tweets.length}
                    next={fetchNextTweets}
                    hasMore={hasMoreTweets}
                    loader={
                      <div className="grid grid-cols-3 gap-1 sm:gap-1.5 mt-1 sm:mt-1.5">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="aspect-square bg-slate-800/60 rounded-lg animate-pulse"
                          />
                        ))}
                      </div>
                    }
                    endMessage={
                      <p className="text-center py-6 text-[11px] text-slate-500 font-poppins">
                        No more posts to load
                      </p>
                    }
                  >
                    <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
                      {tweets.map((t, idx) => (
                        <motion.div
                          key={t?._id || `grid-${idx}`}
                          className="aspect-square relative rounded-lg overflow-hidden cursor-pointer group bg-slate-800/40 border border-slate-800/50"
                          onClick={() =>
                            t?._id && navigate(`/tweet/${t._id}`)
                          }
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.03 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          {t?.imageUrl ? (
                            <img
                              src={t.imageUrl}
                              alt="Post"
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center p-2 bg-gradient-to-br from-slate-800/80 to-slate-900/80">
                              <p className="text-[10px] sm:text-xs text-slate-300 text-center line-clamp-4 font-poppins leading-snug">
                                {t?.TextContent || "Post"}
                              </p>
                            </div>
                          )}
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4">
                            <div className="flex items-center gap-1.5 text-white text-xs font-semibold">
                              <Heart className="w-4 h-4 fill-white" />
                              {t?.likeCount || 0}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </InfiniteScroll>
                ) : (
                  /* ─── List View ─── */
                  <InfiniteScroll
                    dataLength={tweets.length}
                    next={fetchNextTweets}
                    hasMore={hasMoreTweets}
                    loader={
                      <div className="py-4">
                        <TweetSkeleton />
                      </div>
                    }
                    endMessage={
                      <p className="text-center py-6 text-[11px] text-slate-500 font-poppins">
                        No more posts to load
                      </p>
                    }
                  >
                    <div className="flex flex-col gap-4">
                      {tweets.map((t, idx) => {
                        const author =
                          (Array.isArray(t?.UserData)
                            ? t.UserData[0]
                            : t?.UserData) || data;

                        return (
                          <motion.div
                            key={t?._id || `list-${idx}`}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.04 }}
                          >
                            <TweetCard
                              currentTweetId={t?._id}
                              isLiked={Boolean(t?.isLikedByUser)}
                              currentUserId={author?._id || ""}
                              profilePicSrc={
                                author?.profilePicture ||
                                data?.profilePicture
                              }
                              username={
                                author?.fullName || data?.fullName
                              }
                              content={t?.TextContent || ""}
                              imageContent={t?.imageUrl || ""}
                              handle={
                                author?.userName || data?.userName
                              }
                              likes={t?.likeCount || 0}
                              timestamp={t?.createdAt}
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  </InfiniteScroll>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
