import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  Image as ImageIcon,
  Save,
  Trash2,
  Plus,
  Lock,
  Globe,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import axios from "axios";
import { login } from "../../store/authSlice";
import MobileBottomNav from "../DashBoard/MobileBottomNav";

const POPULAR_PLATFORMS = [
  "Twitter / X",
  "Instagram",
  "GitHub",
  "LinkedIn",
  "YouTube",
  "Website",
];

function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth?.userData);

  // Form State
  const [fullName, setFullName] = useState(currentUser?.fullName || "");
  const [bioText, setBioText] = useState(
    currentUser?.bio?.text && currentUser.bio.text !== "This user hasn’t added a bio yet."
      ? currentUser.bio.text
      : ""
  );
  const [city, setCity] = useState(currentUser?.bio?.location?.city || "");
  const [country, setCountry] = useState(currentUser?.bio?.location?.country || "");
  const [gender, setGender] = useState(currentUser?.bio?.gender || "prefer_not_to_say");
  const [dateOfBirth, setDateOfBirth] = useState(
    currentUser?.bio?.dateOfBirth
      ? new Date(currentUser.bio.dateOfBirth).toISOString().split("T")[0]
      : ""
  );
  const [isPrivate, setIsPrivate] = useState(Boolean(currentUser?.isPrivate));
  const [socialLinks, setSocialLinks] = useState(currentUser?.bio?.socialLinks || []);

  // New Social Link Input
  const [platform, setPlatform] = useState(POPULAR_PLATFORMS[0]);
  const [url, setUrl] = useState("");

  // Media Previews & Files
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(
    currentUser?.profilePicture || ""
  );
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(
    currentUser?.bio?.bannerImage && currentUser.bio.bannerImage.trim()
      ? currentUser.bio.bannerImage
      : ""
  );

  // Password Update Modal / Fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ text: "", isError: false });

  // Status & Loaders
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ text: "", isError: false });

  // Handle Profile Picture selection
  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicFile(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  // Handle Banner Image selection
  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  // Add a social link
  const handleAddSocialLink = () => {
    if (!url.trim()) return;
    setSocialLinks((prev) => [...prev, { platform, url: url.trim() }]);
    setUrl("");
  };

  // Remove a social link
  const handleRemoveSocialLink = (indexToRemove) => {
    setSocialLinks((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Save General Profile Details
  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ text: "", isError: false });

    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("bioText", bioText);
      formData.append("city", city);
      formData.append("country", country);
      formData.append("gender", gender);
      if (dateOfBirth) formData.append("dateOfBirth", dateOfBirth);
      formData.append("isPrivate", isPrivate);
      formData.append("socialLinks", JSON.stringify(socialLinks));

      if (profilePicFile) formData.append("profilePicture", profilePicFile);
      if (bannerFile) formData.append("bannerImage", bannerFile);

      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/user/update_profile`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const updatedUser = res?.data?.response;
      if (updatedUser) {
        dispatch(
          login({
            userData: updatedUser,
            token: updatedUser.RefreshToken || currentUser?.RefreshToken,
          })
        );
        setFeedback({
          text: "Profile updated successfully! Redirecting...",
          isError: false,
        });
        setTimeout(() => navigate("/my_account"), 1200);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setFeedback({
        text: err?.response?.data?.message || "Failed to update profile. Please try again.",
        isError: true,
      });
    } finally {
      setSaving(false);
    }
  };

  // Change Password Handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ text: "", isError: false });

    if (!currentPassword || !newPassword) {
      setPasswordMsg({ text: "Please provide both passwords.", isError: true });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ text: "New password must be at least 6 characters.", isError: true });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: "New passwords do not match.", isError: true });
      return;
    }

    setPasswordLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/user/change_password`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );

      setPasswordMsg({ text: "Password changed successfully!", isError: false });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Password update error:", err);
      setPasswordMsg({
        text: err?.response?.data?.message || "Incorrect current password.",
        isError: true,
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col pb-24 md:pb-12">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5">
        <div className="w-full max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/my_account")}
            className="group flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-slate-300 hover:text-white transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs sm:text-sm font-medium font-poppins">Back to Profile</span>
          </button>

          <h1 className="text-sm sm:text-base font-bold text-slate-100 font-montserrat">
            Edit Profile
          </h1>

          <div className="w-20" />
        </div>
      </header>

      {/* Main Content Form */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Feedback Alert */}
        {feedback.text && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-poppins transition-all ${
              feedback.isError
                ? "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
            }`}
          >
            {feedback.isError ? (
              <AlertCircle className="w-5 h-5 shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmitProfile} className="space-y-8">
          {/* Section 1: Visuals (Banner & Avatar) */}
          <div className="bg-slate-900/60 border border-slate-800/90 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
            {/* Banner preview with upload button */}
            <div className="relative h-44 sm:h-56 w-full bg-gradient-to-r from-cyan-900/40 via-purple-900/30 to-indigo-950/60 overflow-hidden">
              {bannerPreview ? (
                <img
                  src={bannerPreview}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                  <ImageIcon className="w-8 h-8 mb-1" />
                  <span className="text-xs font-poppins">Upload Banner Image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-black/30" />

              <label className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-900/80 hover:bg-slate-900 border border-slate-700/80 text-slate-200 hover:text-white rounded-xl backdrop-blur-md text-xs sm:text-sm font-medium cursor-pointer shadow-lg transition-transform hover:scale-105">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>Change Banner</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Avatar preview with upload button */}
            <div className="px-6 pb-6 pt-0 relative">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14 sm:-mt-16 mb-4">
                <div className="relative inline-block self-start">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 p-1 shadow-2xl">
                    <img
                      src={profilePicPreview || "/default-avatar.png"}
                      alt="Avatar preview"
                      className="w-full h-full rounded-full object-cover border-4 border-slate-900 bg-slate-800"
                    />
                  </div>

                  <label className="absolute bottom-0 right-0 p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-full text-cyan-400 hover:text-white shadow-lg cursor-pointer transition-transform hover:scale-110">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="space-y-0.5">
                  <h3 className="text-lg font-bold text-white font-montserrat">
                    {fullName || "Your Full Name"}
                  </h3>
                  <p className="text-xs sm:text-sm text-cyan-400 font-poppins">
                    @{currentUser?.userName || "username"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Basic Info */}
          <div className="bg-slate-900/60 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-6">
            <h2 className="text-base sm:text-lg font-bold text-white font-montserrat flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              General Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs uppercase font-semibold text-slate-400 font-poppins tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 hover:bg-slate-800/70 focus:bg-slate-800/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm outline-none focus:border-cyan-400 transition-colors font-poppins"
                />
              </div>

              {/* Bio */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs uppercase font-semibold text-slate-400 font-poppins tracking-wider">
                  Bio / About You
                </label>
                <textarea
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  maxLength={280}
                  rows={4}
                  placeholder="Write a short summary about yourself..."
                  className="w-full px-4 py-3 bg-slate-800/50 hover:bg-slate-800/70 focus:bg-slate-800/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm outline-none focus:border-cyan-400 transition-colors font-poppins resize-none leading-relaxed"
                />
                <p className="text-[11px] text-slate-500 text-right">
                  {bioText.length}/280 characters
                </p>
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-semibold text-slate-400 font-poppins tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" /> City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. New York"
                  className="w-full px-4 py-3 bg-slate-800/50 hover:bg-slate-800/70 focus:bg-slate-800/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm outline-none focus:border-cyan-400 transition-colors font-poppins"
                />
              </div>

              {/* Country */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-semibold text-slate-400 font-poppins tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" /> Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. United States"
                  className="w-full px-4 py-3 bg-slate-800/50 hover:bg-slate-800/70 focus:bg-slate-800/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm outline-none focus:border-cyan-400 transition-colors font-poppins"
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-semibold text-slate-400 font-poppins tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" /> Birthday
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 hover:bg-slate-800/70 focus:bg-slate-800/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm outline-none focus:border-cyan-400 transition-colors font-poppins"
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-semibold text-slate-400 font-poppins tracking-wider">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 hover:bg-slate-800/70 focus:bg-slate-800/90 border border-slate-700/80 rounded-xl text-white text-sm outline-none focus:border-cyan-400 transition-colors font-poppins"
                >
                  <option value="Male" className="bg-slate-900 text-white">Male</option>
                  <option value="Female" className="bg-slate-900 text-white">Female</option>
                  <option value="Other" className="bg-slate-900 text-white">Other</option>
                  <option value="prefer_not_to_say" className="bg-slate-900 text-white">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Privacy Toggle */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white font-montserrat">
                  Private Account
                </p>
                <p className="text-xs text-slate-400 font-poppins">
                  When enabled, your profile and posts will only be visible to confirmed friends.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPrivate((prev) => !prev)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isPrivate ? "bg-cyan-500" : "bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isPrivate ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Section 3: Social Links */}
          <div className="bg-slate-900/60 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-5">
            <h2 className="text-base sm:text-lg font-bold text-white font-montserrat flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-purple-400" />
              Social Links
            </h2>

            {/* Existing links list */}
            {socialLinks.length > 0 ? (
              <div className="space-y-2.5">
                {socialLinks.map((link, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white capitalize">
                        {link.platform}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{link.url}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSocialLink(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No social links added yet.</p>
            )}

            {/* Add new link */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full sm:w-44 px-4 py-2.5 bg-slate-800/50 border border-slate-700/80 rounded-xl text-white text-xs sm:text-sm outline-none focus:border-cyan-400 font-poppins"
              >
                {POPULAR_PLATFORMS.map((p) => (
                  <option key={p} value={p} className="bg-slate-900 text-white">
                    {p}
                  </option>
                ))}
              </select>

              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-4 py-2.5 bg-slate-800/50 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm outline-none focus:border-cyan-400 font-poppins"
              />

              <button
                type="button"
                onClick={handleAddSocialLink}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Save Profile Button */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/my_account")}
              className="px-6 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-poppins text-sm font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-montserrat text-sm font-bold shadow-xl hover:shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Section 4: Security & Password Update */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="bg-slate-900/60 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl">
            <h2 className="text-base sm:text-lg font-bold text-white font-montserrat flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-purple-400" />
              Change Password
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-poppins mb-6">
              Update your password safely without needing email verification codes.
            </p>

            {passwordMsg.text && (
              <div
                className={`mb-5 p-3.5 rounded-xl text-xs sm:text-sm font-poppins ${
                  passwordMsg.isError
                    ? "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                    : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                }`}
              >
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-semibold text-slate-400 font-poppins tracking-wider">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/80 rounded-xl text-white text-xs sm:text-sm outline-none focus:border-purple-400 font-poppins"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase font-semibold text-slate-400 font-poppins tracking-wider">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/80 rounded-xl text-white text-xs sm:text-sm outline-none focus:border-purple-400 font-poppins"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase font-semibold text-slate-400 font-poppins tracking-wider">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  required
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/80 rounded-xl text-white text-xs sm:text-sm outline-none focus:border-purple-400 font-poppins"
                />
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="mt-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-montserrat text-xs sm:text-sm font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {passwordLoading ? "Updating Password..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}

export default EditProfile;
