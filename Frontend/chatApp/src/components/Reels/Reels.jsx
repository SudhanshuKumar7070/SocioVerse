import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
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
} from "lucide-react";
import VideoPlayer from "./VideoSetup/VideoPlayer.jsx";

function Reels() {
  const [res, setResponse] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const observer = useRef();

  // Fetch API with pagination
  const fetchReels = useCallback(async () => {
    if (!hasMore) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3002/api/v1/video/fetch?page=${page}&limit=5`
      );
      const newData = response.data?.data || [];
      if (newData.length === 0) {
        setHasMore(false);
      } else {
        setResponse((prev) => [...prev, ...newData]);
      }
    } catch (error) {
      console.log("Error fetching video data:", error);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore]);

  // Infinite Scroll logic
  const lastVideoRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    fetchReels();
  }, [fetchReels]);

  return (
    <div className="flex flex-col md:grid md:grid-cols-12 gap-1 min-h-[100dvh] w-full overflow-x-hidden relative pb-16 md:pb-0">
      {/* Left Sidebar — matches Dashboard layout */}
      <div className="hidden md:block md:col-span-2 shadow-md px-2 py-2 bg-opacity-30">
        <Logo />
        <LeftSideBarUserProfile followers={0} followings={0} />
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
              <p className="text-lg font-montserrat font-semibold text-sky-300">No reels yet</p>
              <p className="text-sm mt-1">Check back later for new content</p>
            </div>
          ) : (
            res.map((el, index) => {
              const isLast = index === res.length - 1;
              return (
                <div
                  key={el?._id || index}
                  ref={isLast ? lastVideoRef : null}
                  className="snap-start relative w-full h-[85vh] mb-6 rounded-2xl overflow-hidden bg-black shadow-xl border border-slate-700/40"
                >
                  {/* Video */}
                  <VideoPlayer
                    src={el?.hlsPath}
                    className="w-full h-full object-cover"
                  />

                  {/* Bottom Overlay — User info & caption */}
                  <div className="absolute bottom-0 w-full p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none">
                    <div className="pointer-events-auto">
                      {/* User Info */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={el?.owner?.profilePic || "/default-avatar.png"}
                            alt="User"
                            className="w-10 h-10 rounded-full border-2 border-sky-400/50 shadow-md"
                          />
                          <div>
                            <p className="text-sm font-semibold text-sky-200 font-montserrat">
                              @{el?.owner?.username || "user"}
                            </p>
                            <p className="text-xs text-blue-300/70">
                              {el?.owner?.followers || 0} followers
                            </p>
                          </div>
                        </div>
                        <button className="px-4 py-1.5 text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-white rounded-full transition-all duration-300 font-montserrat shadow-lg shadow-sky-500/20">
                          Follow
                        </button>
                      </div>

                      {/* Caption */}
                      <h2 className="text-base sm:text-lg font-semibold text-white font-montserrat">
                        {el.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-blue-200/60 mt-1 line-clamp-2 font-montserrat">
                        {el.description || "No description available"}
                      </p>
                    </div>
                  </div>

                  {/* Right Side Actions */}
                  <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 flex flex-col gap-5">
                    {[
                      { icon: <ThumbsUp size={22} />, label: "Like", count: el?.likes },
                      { icon: <ThumbsDown size={22} />, label: "Dislike" },
                      { icon: <MessageCircle size={22} />, label: "Comment", count: el?.comments },
                      { icon: <Share2 size={22} />, label: "Share" },
                    ].map(({ icon, label, count }, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center gap-1 group"
                      >
                        <button
                          aria-label={label}
                          className="p-2.5 rounded-full bg-slate-800/70 backdrop-blur-md border border-slate-600/30 shadow-lg transition-all duration-300 ease-out hover:scale-110 hover:bg-sky-500/20 hover:border-sky-400/40 text-slate-300 hover:text-sky-300"
                        >
                          {icon}
                        </button>
                        {count !== undefined && count !== null && (
                          <span className="text-[10px] text-blue-300/70 group-hover:text-sky-300 transition-colors font-montserrat">
                            {count}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}

          {/* Loading indicator when fetching more */}
          {loading && res.length > 0 && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!hasMore && res.length > 0 && (
            <p className="text-center py-6 text-slate-500 font-montserrat text-sm">
              No more videos 🎬
            </p>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}

export default Reels;
