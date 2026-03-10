import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Logo from "../DashBoard/Logo.jsx";
import LeftSideBar from "../DashBoard/LeftSideBar.jsx";
import LeftSideBarUserProfile from "../DashBoard/LeftSideBarUserProfile.jsx";
import MobileBottomNav from "../DashBoard/MobileBottomNav.jsx";

function AppLayout() {
  const [follower, setFollower] = useState({ followerCount: 0, followingCount: 0 });
  const userId = useSelector((state) => state.auth.userData?._id);

  useEffect(() => {
    const fetchFollowerData = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/user/user_data/${userId}`,
          { withCredentials: true }
        );
        if (res?.data?.response?.[0]) {
          setFollower({
            followerCount: res.data.response[0].Followers?.length || 0,
            followingCount: res.data.response[0].Following?.length || 0,
          });
        }
      } catch (err) {
        console.log("Error fetching follower data:", err);
      }
    };
    fetchFollowerData();
  }, [userId]);

  return (
    <div className="flex flex-col md:grid md:grid-cols-12 gap-1 min-h-[100dvh] w-full overflow-x-hidden relative pb-16 md:pb-0">
      {/* Left Sidebar — consistent across all pages */}
      <div className="hidden md:block md:col-span-2 shadow-md px-2 py-2 bg-opacity-30">
        <Logo />
        <LeftSideBarUserProfile
          followers={follower.followerCount}
          followings={follower.followingCount}
        />
        <div className="py-2 my-2">
          <LeftSideBar />
        </div>
      </div>

      {/* Main Content Area — pages render here */}
      <div className="w-full md:col-span-10 relative h-[100dvh] overflow-y-auto scrollbar-custom overflow-x-hidden">
        <Outlet />
      </div>

      {/* Mobile Bottom Navigation — consistent across all pages */}
      <MobileBottomNav />
    </div>
  );
}

export default AppLayout;
