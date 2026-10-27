import React from "react";
import { KeyRound, FileEdit, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ProfileSettingBar({
  className = "",
  onClose,
  onUpdateBio,
  onUpdatePassword,
}) {
  const navigate = useNavigate();

  const handleBioClick = () => {
    if (onUpdateBio) {
      onUpdateBio();
    } else {
      navigate("/edit_profile");
    }
    if (onClose) onClose();
  };

  const handlePasswordClick = () => {
    if (onUpdatePassword) {
      onUpdatePassword();
    } else {
      navigate("/forgotPassword");
    }
    if (onClose) onClose();
  };

  return (
    <div
      className={`p-2 rounded-2xl bg-slate-900/95 backdrop-blur-xl shadow-2xl border border-slate-700/80 overflow-hidden ${className}`}
    >
      <div className="flex flex-col gap-1">
        <button
          onClick={handleBioClick}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-poppins text-xs sm:text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors duration-150 text-left"
        >
          <FileEdit className="w-4 h-4 text-cyan-400" />
          <span>Edit Profile / Bio</span>
        </button>

        <button
          onClick={handlePasswordClick}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-poppins text-xs sm:text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors duration-150 text-left"
        >
          <KeyRound className="w-4 h-4 text-purple-400" />
          <span>Update Password</span>
        </button>
      </div>
    </div>
  );
}

export default ProfileSettingBar;
