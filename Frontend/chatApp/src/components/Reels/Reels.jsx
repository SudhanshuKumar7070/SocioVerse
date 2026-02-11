import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import Logo from "../DashBoard/Logo.jsx";
import LeftSideBar from "../DashBoard/LeftSideBar.jsx";
import LeftSideBarUserProfile from "../DashBoard/LeftSideBarUserProfile.jsx";
import {
  ArrowBigDownIcon,
  ArrowBigUp,
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

  //  Fetch API with pagination
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

  //  Infinite Scroll logic
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
    <div className="w-full h-screen flex overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-[18vw] gap-2 max-w-[280px] bg-zinc-950/90 border-r border-white/10 p-4 overflow-y-auto">
        <Logo />
        <LeftSideBarUserProfile followers={0} followings={0} />
        <LeftSideBar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide flex justify-center items-center px-2 sm:px-6">
        <div className="w-full sm:w-[28rem] md:w-[32rem] lg:w-[34rem] xl:w-[36rem] py-6">
          {loading && res.length === 0 ? (
            //  Skeleton loader
            <div className="flex flex-col gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-[75vh] rounded-xl bg-zinc-800 animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            res.map((el, index) => {
              const isLast = index === res.length - 1;
              return (
                <div
                  key={index}
                  ref={isLast ? lastVideoRef : null}
                  className="snap-start relative w-full min-h-[75vh] mb-12 rounded-2xl overflow-hidden bg-black shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  {/* Video */}
                  <VideoPlayer
                    src={el?.hlsPath}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay Content */}
                  <div className="absolute bottom-0 w-full p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                    {/* User Info */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={el?.owner?.profilePic || "/default-avatar.png"}
                          alt="User"
                          className="w-10 h-10 rounded-full border border-white/30"
                        />
                        <div>
                          <p className="text-sm font-semibold">
                            @{el?.owner?.username || "user"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {el?.owner?.followers || 0} followers
                          </p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 text-xs bg-gradient-to-r from-pink-500 to-rose-600 hover:opacity-90 rounded-full transition-all">
                        Follow
                      </button>
                    </div>

                    {/* Caption */}
                    <h2 className="text-base sm:text-lg font-medium">
                      {el.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-300 mt-1 line-clamp-2">
                      {el.description || "No description available"}
                    </p>
                  </div>

                  {/* Right Side Actions */}
                  <div className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 flex flex-col gap-6">
                    {[
                      { icon: <ThumbsUp size={26} />, label: "Like", count: 1.2 },
                      {
                        icon: <ThumbsDown size={26} />,
                        label: "Dislike",
                        count: 0.2,
                      },
                      {
                        icon: <MessageCircle size={26} />,
                        label: "Comment",
                        count: 320,
                      },
                      { icon: <Share2 size={26} />, label: "Share", count: 50 },
                      {
                        icon: <Info size={26} />,
                        label: "Info",
                        onClick: () =>
                          alert(el?.description || "No description available"),
                      },
                    ].map(({ icon, label, count, onClick }, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center gap-1 group"
                      >
                        <button
                          aria-label={label}
                          onClick={onClick || (() => alert(`${label} clicked`))}
                          className="p-3 rounded-full bg-white/10 backdrop-blur-md shadow-lg transition-all duration-300 ease-out hover:scale-110 hover:bg-white/20"
                        >
                          {icon}
                        </button>
                        {count !== undefined && (
                          <span className="text-xs text-gray-300 group-hover:text-white transition-colors">
                            {count}k
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
            <p className="text-center py-6 text-gray-400">Loading more...</p>
          )}
          {!hasMore && (
            <p className="text-center py-6 text-gray-500">No more videos 🎬</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Reels;
