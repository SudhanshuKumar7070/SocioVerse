import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../DashBoard/Logo.jsx";
import LeftSideBar from "../DashBoard/LeftSideBar.jsx";
import LeftSideBarUserProfile from "../DashBoard/LeftSideBarUserProfile.jsx";
import MobileBottomNav from "../DashBoard/MobileBottomNav.jsx";
import {
  UploadCloud,
  Film,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileVideo,
} from "lucide-react";
import { useEffect } from "react";

/* ─── Status enum ─── */
const STATUS = {
  IDLE: "idle",
  UPLOADING: "uploading",
  SUCCESS: "success",
  ERROR: "error",
};

export default function VideoUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [errorMsg, setErrorMsg] = useState("");
  const [dragging, setDragging] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  /* ─── File selection ─── */
  const handleFile = (selected) => {
    if (!selected) return;
    if (!selected.type.startsWith("video/")) {
      setErrorMsg("Only video files are supported.");
      setStatus(STATUS.ERROR);
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setStatus(STATUS.IDLE);
    setErrorMsg("");
    setProgress(0);
  };

  const onFileInputChange = (e) => handleFile(e.target.files[0]);

  /* ─── Drag & drop ─── */
  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  /* ─── Clear ─── */
  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setProgress(0);
    setStatus(STATUS.IDLE);
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ─── Submit ─── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setErrorMsg("Please select a video first."); setStatus(STATUS.ERROR); return; }
    if (!title.trim()) { setErrorMsg("Title is required."); setStatus(STATUS.ERROR); return; }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title.trim());
    formData.append("description", description.trim());

    setStatus(STATUS.UPLOADING);
    setProgress(0);
    setErrorMsg("");

    try {
      await axios.post(`${import.meta.env.VITE_VIDEO_SERVICE_URL}/video/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          const pct = Math.round((evt.loaded * 100) / evt.total);
          setProgress(pct);
        },
      });
      setStatus(STATUS.SUCCESS);
      setProgress(100);
    } catch (err) {
      console.error("Upload failed:", err);
      setErrorMsg(err?.response?.data?.message || "Upload failed. Please try again.");
      setStatus(STATUS.ERROR);
    }
  };

  const isUploading = status === STATUS.UPLOADING;
  const isSuccess   = status === STATUS.SUCCESS;

  useEffect(()=>{
    if(isSuccess){
      clearFile();
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    }
  },[isSuccess])

  return (
    <div className="flex flex-col md:grid md:grid-cols-12 gap-1 min-h-[100dvh] w-full overflow-x-hidden relative pb-16 md:pb-0">

      {/* ── Left Sidebar ── */}
      <div className="hidden md:block md:col-span-2 shadow-md px-2 py-2 bg-opacity-30">
        <Logo />
        <LeftSideBarUserProfile followers={0} followings={0} />
        <div className="py-2 my-2">
          <LeftSideBar />
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="w-full md:col-span-10 flex justify-center items-start px-4 py-8 overflow-y-auto">
        <div className="w-full max-w-2xl">

          {/* Page heading */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-1">
              <Film size={22} className="text-sky-400" />
              <h1 className="text-xl font-semibold text-white font-montserrat tracking-wide">
                Create Reel
              </h1>
            </div>
            <p className="text-sm text-slate-400 font-montserrat ml-9">
              Upload a video and it will be processed into a streamable reel.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* ── Drop zone ── */}
            <div
              onClick={() => !file && fileInputRef.current?.click()}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className={`
                relative w-full rounded-2xl border-2 border-dashed transition-all duration-300
                flex flex-col items-center justify-center overflow-hidden
                ${file ? "border-sky-400/30 bg-slate-900/60 cursor-default" : "cursor-pointer hover:border-sky-400/60 hover:bg-slate-800/40"}
                ${dragging ? "border-sky-400 bg-sky-500/10 scale-[1.01]" : "border-slate-600/50 bg-slate-900/40"}
              `}
              style={{ minHeight: file ? "auto" : "220px" }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={onFileInputChange}
                disabled={isUploading}
              />

              {!file ? (
                /* Empty state */
                <div className="flex flex-col items-center gap-3 py-12 px-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-sky-500/10 border border-sky-400/20 flex items-center justify-center">
                    <UploadCloud size={28} className="text-sky-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-300 font-montserrat">
                    {dragging ? "Drop it here!" : "Drag & drop a video or click to browse"}
                  </p>
                  <p className="text-xs text-slate-500 font-montserrat">
                    MP4, MOV, WebM · any size
                  </p>
                </div>
              ) : (
                /* Video preview */
                <div className="w-full">
                  <video
                    src={preview}
                    controls
                    className="w-full max-h-64 rounded-2xl object-contain bg-black"
                  />
                  {/* File info bar */}
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-800/60 border-t border-slate-700/40">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileVideo size={16} className="text-sky-400 shrink-0" />
                      <span className="text-xs text-slate-300 font-montserrat truncate max-w-[220px]">
                        {file.name}
                      </span>
                      <span className="text-xs text-slate-500 shrink-0">
                        ({(file.size / (1024 * 1024)).toFixed(1)} MB)
                      </span>
                    </div>
                    {!isUploading && !isSuccess && (
                      <button
                        type="button"
                        onClick={clearFile}
                        className="p-1.5 rounded-full hover:bg-slate-700/60 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── Progress bar ── */}
            {(isUploading || isSuccess) && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400 font-montserrat">
                  <span>{isSuccess ? "Upload complete" : "Uploading…"}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* ── Title ── */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 font-montserrat uppercase tracking-wider">
                Title <span className="text-sky-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your reel a title…"
                maxLength={100}
                disabled={isUploading || isSuccess}
                className="
                  w-full px-4 py-3 rounded-xl
                  bg-slate-800/60 border border-slate-600/40
                  text-sm text-white placeholder:text-slate-500
                  font-montserrat
                  focus:outline-none focus:border-sky-400/60 focus:bg-slate-800/80
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              />
            </div>

            {/* ── Description ── */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 font-montserrat uppercase tracking-wider">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this reel about? (optional)"
                rows={3}
                maxLength={500}
                disabled={isUploading || isSuccess}
                className="
                  w-full px-4 py-3 rounded-xl resize-none
                  bg-slate-800/60 border border-slate-600/40
                  text-sm text-white placeholder:text-slate-500
                  font-montserrat
                  focus:outline-none focus:border-sky-400/60 focus:bg-slate-800/80
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              />
              <p className="text-right text-[11px] text-slate-500 font-montserrat">
                {description.length}/500
              </p>
            </div>

            {/* ── Error / Success banners ── */}
            {status === STATUS.ERROR && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm font-montserrat">
                <AlertCircle size={17} className="shrink-0" />
                {errorMsg}
              </div>
            )}

            {isSuccess && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm font-montserrat">
                <CheckCircle2 size={17} className="shrink-0" />
                Reel submitted! It's being processed — you'll see it in your feed shortly.
              </div>
            )}

            {/* ── Submit ── */}
            {!isSuccess ? (
              <button
                type="submit"
                disabled={isUploading || !file}
                className="
                  flex items-center justify-center gap-2.5
                  w-full py-3 rounded-xl
                  bg-gradient-to-r from-sky-500/80 to-blue-600/80
                  hover:from-sky-500 hover:to-blue-600
                  border border-sky-400/30
                  text-white text-sm font-semibold font-montserrat tracking-wide
                  shadow-md shadow-sky-500/15
                  transition-all duration-250
                  disabled:opacity-50 disabled:cursor-not-allowed
                  hover:shadow-lg hover:shadow-sky-500/20
                  active:scale-[0.98]
                "
              >
                {isUploading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Uploading…
                  </>
                ) : (
                  <>
                    <UploadCloud size={17} />
                    Upload Reel
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  clearFile();
                  setTitle("");
                  setDescription("");
                  setStatus(STATUS.IDLE);
                }}
                className="
                  w-full py-3 rounded-xl
                  border border-slate-600/40 bg-slate-800/50
                  text-sm text-slate-300 font-montserrat font-medium
                  hover:bg-slate-700/50 hover:text-white
                  transition-all duration-200
                  active:scale-[0.98]
                "
              >
                Upload another reel
              </button>
            )}
          </form>
        </div>
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <MobileBottomNav />
    </div>
  );
}