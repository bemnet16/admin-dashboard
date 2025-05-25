"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

// Video player component
export const VideoPlayer = ({
  src,
  thumbnailUrl,
  autoPlay = false,
}: {
  src: string;
  thumbnailUrl?: string;
  autoPlay?: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Play automatically if autoPlay is true
  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log("Auto-play prevented:", e));
    }
  }, [autoPlay]);

  // Add this new useEffect to handle play state changes from outside
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);

    return () => {
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && videoRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Stop video when component unmounts or when collapsed
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };
  }, []);

  return (
    <div className="relative rounded-md overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={src}
        poster={thumbnailUrl}
        className="w-full h-auto max-h-[400px]"
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div
          ref={progressRef}
          className="h-2 bg-white/30 rounded-full mb-2 cursor-pointer"
          onClick={handleProgressClick}
        >
          <div
            ref={progressBarRef}
            className="h-full bg-white rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 text-white"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <div className="text-xs text-white ml-2">
            {videoRef.current
              ? formatTime(videoRef.current.currentTime)
              : "0:00"}{" "}
            / {formatTime(duration)}
          </div>
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 text-white"
            onClick={toggleMute}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Media gallery component for handling multiple media items
export const MediaGallery = ({
  mediaItems,
  postId,
}: {
  mediaItems: any[];
  postId: string;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = mediaItems[activeIndex];

  // If there's only one item, just render it directly
  if (mediaItems.length === 1) {
    return (
      <div className="mb-4 rounded-md overflow-hidden">
        {mediaItems[0].type === "image" ? (
          <img
            src={mediaItems[0].url || "/placeholder.svg"}
            alt="Post content"
            className="w-full object-cover max-h-[400px]"
          />
        ) : (
          <VideoPlayer
            src={mediaItems[0].url}
            thumbnailUrl={mediaItems[0].thumbnailUrl}
          />
        )}
      </div>
    );
  }

  // Handle changing the active media item
  const handleMediaChange = (index: number) => {
    // Pause all videos before changing
    const videos = document.querySelectorAll<HTMLVideoElement>(
      `[data-post-id="${postId}"] video`
    );
    videos.forEach((video) => video.pause());

    // Set the new active index
    setActiveIndex(index);

    // If the new active item is a video, we need to ensure it will autoplay
    // but we need to do this after the component has re-rendered with the new active item
    if (mediaItems[index].type === "video") {
      setTimeout(() => {
        const newActiveVideo = document.querySelector<HTMLVideoElement>(
          `[data-post-id="${postId}"] video`
        );
        if (newActiveVideo) {
          newActiveVideo
            .play()
            .catch((e) => console.log("Auto-play prevented:", e));
        }
      }, 0);
    }
  };

  return (
    <div className="mb-4" data-post-id={postId}>
      <div className="rounded-md overflow-hidden mb-2">
        {activeItem.type === "image" ? (
          <img
            src={activeItem.url || "/placeholder.svg"}
            alt="Post content"
            className="w-full object-cover max-h-[400px]"
          />
        ) : (
          <VideoPlayer
            src={activeItem.url}
            thumbnailUrl={activeItem.thumbnailUrl}
            autoPlay={true}
          />
        )}
      </div>

      {/* Thumbnails for navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {mediaItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleMediaChange(index)}
            className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
              index === activeIndex ? "border-primary" : "border-transparent"
            }`}
          >
            {item.type === "image" ? (
              <img
                src={item.url || "/placeholder.svg"}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <img
                  src={item.thumbnailUrl || "/placeholder.svg"}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="h-4 w-4 text-white" />
                </div>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
