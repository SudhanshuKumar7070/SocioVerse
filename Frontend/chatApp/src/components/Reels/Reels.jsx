import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { ArrowBigDownIcon, ArrowBigUp } from 'lucide-react'
import { 
  ThumbsUp,       // like
  ThumbsDown,     // dislike
  MessageCircle,  // comment
  Info            // description/info
} from 'lucide-react'
import VideoPlayer from './VideoSetup/VideoPlayer.jsx'

function Reels() {
  const [videoUrl, setVideoUrl] = useState("")
  const [res, setResponse] = useState([])
  const [videoNumber, setVideoNumber] = useState(0)
  const [loading, setLoading] = useState(true)

  // Debounce utility to limit fetch frequency on scroll
  function debounce(fn, ms) {
    let timer
    return function (...args) {
      clearTimeout(timer)
      timer = setTimeout(() => fn.apply(this, args), ms)
    }
  }

  // Method to fetch reels
  const fetchReels = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:3002/api/v1/video/fetch")
      if (!response.data) {
        console.log("response not found")
        return
      }

      const newData = response.data.data
      setResponse((prev) => [...prev, ...newData]) // append new data

      // Set initial video URL if this is the first load
      if (newData.length > 0 && videoNumber === 0) {
        setVideoUrl(newData[0].hlsPath)
      }
    } catch (error) {
      console.log("something went wrong in fetching video data", error)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchReels()
  }, [])

  // Update current video URL when videoNumber or res changes
  useEffect(() => {
    if (res.length > 0 && res[videoNumber]) {
      setVideoUrl(res[videoNumber].hlsPath)
    }
  }, [videoNumber, res])

  // Navigation functions - next and previous video
  const getNextVideo = () => {
    if (videoNumber < res.length - 1) {
      setVideoNumber((prev) => prev + 1)
    }
  }

  const getPrevVideo = () => {
    if (videoNumber > 0) {
      setVideoNumber((prev) => prev - 1)
    }
  }

  const threshold = 24

  // Debounced scroll handler for fetching more videos near bottom
  const handleScroll = useCallback(
    debounce(async (e) => {
      const scrollHeight = e.target.scrollHeight
      const clientHeight = e.target.clientHeight
      const scrollTop = e.target.scrollTop
      const remainingScroll = scrollHeight - (scrollTop + clientHeight)
      if (remainingScroll < threshold) {
        await fetchReels()
      }
    }, 200),
    []
  )

  return (
    <>
      <div className="w-full h-full flex justify-center items-center ">
             
        <div
          id="scrollig_window"
          onScroll={handleScroll}
          style={{ scrollBehavior: "smooth" }}
          className="w-[50%] h-[90vh] overflow-y-scroll scrollbar-custom  "
        >
          <div
            id="reelContainer"
            className="sm:w-[32vw] w-[80vw] max-h-full  rounded-md text-white text-center font-poppins bg-slate-900 bg-opacity-20 shadow-xl  mx-auto"
          >
            {loading && res.length === 0 ? (
              <p className="text-white font-poppins text-xl text-center p-2 m-3">Loading</p>
            ) : (
              <div className="w-full rounded-lg bg-blue-950 bg-opacity-15">
                {res && res.length > 0 ? (
                  res.map((el, index) => (
                    <div key={index} className="p-4 my-2 rounded-lg flex gap-1 justify-center bg-slate-900 bg-opacity-65 w-full relative  ">
                      <div className='absolute bottom-12 z-10 bg-slate-800 px-4 py-2 bg-opacity-25 rounded-xl'>{el.title}</div>
                      <VideoPlayer src={el?.hlsPath} className='w-[85%]' />
                     <div className='text-white w-[15%] min-h-full flex flex-col p-1 justify-around  rounded-md bg-gray-800 bg-opacity-40'>
      <button
        aria-label="Like"
        className="flex items-center justify-center p-2 hover:text-green-400 cursor-pointer rounded-full bg-slate-700 hover:transition-all duration-200 ease-linear hover:bg-slate-900  "
        onClick={() => alert('Liked!')} // replace with your functionality
      >
        <ThumbsUp size={20} />
      </button>

      <button
        aria-label="Dislike"
        className="flex items-center justify-center p-2 hover:text-red-500 cursor-pointer rounded-full bg-slate-700 hover:transition-all duration-200 ease-linear hover:bg-slate-900 "
        onClick={() => alert('Disliked!')} // replace with your functionality
      >
        <ThumbsDown size={20} />
      </button>

      <button
        aria-label="Comment"
        className="flex items-center justify-center p-2 hover:text-blue-400 cursor-pointer rounded-full bg-slate-700 hover:transition-all duration-200 ease-linear hover:bg-slate-900 "
        onClick={() => alert('Open comments section')} // replace with your functionality
      >
        <MessageCircle size={20} />
      </button>

      <button
        aria-label="Description"
        title={el?.description || "No description available"} // simple tooltip on hover
        className="flex items-center justify-center p-2 hover:text-yellow-300 cursor-pointer rounded-full bg-slate-700 hover:transition-all duration-200 ease-linear hover:bg-slate-900 "
        onClick={() => alert(el?.description || "No description available")} // optional popup or modal
      >
        <Info size={20} />
      </button>
    </div>
                    </div>
                  ))
                ) : (
                  <p className="text-white font-poppins text-xl text-center p-2 m-3">No video available</p>
                )}
              </div>
            )}
          </div>
          
        </div>

        <div className="text-xl text-white flex flex-col justify-center items-center ml-4 space-y-2">
          <button
            className="hover:border rounded-full p-2 hover:transition-all duration-150 ease-out hover:bg-slate-100 hover:bg-opacity-30 shadow-md disabled:opacity-50"
            onClick={getPrevVideo}
            disabled={videoNumber === 0}
            aria-label="Previous Video"
          >
            <ArrowBigUp />
          </button>
          <button
            className="hover:border rounded-full p-2 hover:transition-all duration-150 ease-out hover:bg-slate-100 hover:bg-opacity-30 shadow-md disabled:opacity-50"
            onClick={getNextVideo}
            disabled={videoNumber >= res.length - 1}
            aria-label="Next Video"
          >
            <ArrowBigDownIcon />
          </button>
        </div>
      </div>
    </>
  )
}

export default Reels
