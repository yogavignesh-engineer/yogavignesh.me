import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Container
const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #FF6B35;
  box-shadow: 0 8px 32px rgba(255, 107, 53, 0.2);
`;

// Video element
const Video = styled.video`
  width: 100%;
  height: auto;
  display: block;
  cursor: pointer;
`;

// Controls overlay
const ControlsOverlay = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
  padding: 1.5rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

// Progress bar container
const ProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  
  &:hover {
    height: 8px;
  }
`;

// Progress bar fill
const ProgressBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #FF6B35, #E85A28);
  border-radius: 3px;
  width: ${props => props.progress}%;
  transition: width 0.1s linear;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    background: #FF6B35;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(255, 107, 53, 0.5);
  }
`;

// Time tooltip
const TimeTooltip = styled(motion.div)`
  position: absolute;
  bottom: 100%;
  left: ${props => props.left}%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: #FFF;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;
`;

// Controls bar
const ControlsBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

// Button
const ControlButton = styled.button`
  background: none;
  border: none;
  color: #FFF;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  transition: all 0.2s ease;
  
  &:hover {
    color: #FF6B35;
    transform: scale(1.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Time display
const TimeDisplay = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: #FFF;
  margin-left: auto;
`;

// Volume control
const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

// Volume slider
const VolumeSlider = styled.input`
  width: 80px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #FF6B35;
    cursor: pointer;
    box-shadow: 0 0 5px rgba(255, 107, 53, 0.5);
  }
  
  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #FF6B35;
    cursor: pointer;
    border: none;
  }
`;

// Play overlay (shown on pause)
const PlayOverlay = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: rgba(255, 107, 53, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFF;
  font-size: 2rem;
  cursor: pointer;
  pointer-events: none;
  box-shadow: 0 4px 20px rgba(255, 107, 53, 0.4);
`;

// Loading spinner
const LoadingSpinner = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 107, 53, 0.2);
  border-top-color: #FF6B35;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }
`;

// Format time helper
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * VideoPlayer Component
 * Custom video player with controls, progress bar, volume, fullscreen
 */
const VideoPlayer = ({ src, poster, title }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(0);
  
  const controlsTimeoutRef = useRef(null);
  
  // Handle video metadata loaded
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
    };
    
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);
  
  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    } else {
      setShowControls(true);
    }
    
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, showControls]);
  
  // Toggle play/pause
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
  
  // Seek video
  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const time = percentage * duration;
    videoRef.current.currentTime = time;
  };
  
  // Handle progress bar hover
  const handleProgressHover = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const time = (x / rect.width) * duration;
    setHoverPosition(percentage);
    setHoverTime(time);
  };
  
  // Skip forward/backward
  const skip = (seconds) => {
    videoRef.current.currentTime += seconds;
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    videoRef.current.muted = !isMuted;
  };
  
  // Change volume
  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    videoRef.current.volume = vol;
    if (vol === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current.parentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  
  // Show controls on mouse move
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  };
  
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  return (
    <VideoContainer onMouseMove={handleMouseMove}>
      <Video
        ref={videoRef}
        src={src}
        poster={poster}
        onClick={togglePlay}
      />
      
      {isLoading && <LoadingSpinner />}
      
      <AnimatePresence>
        {!isPlaying && !isLoading && (
          <PlayOverlay
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={togglePlay}
          >
            ▶
          </PlayOverlay>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showControls && !isLoading && (
          <ControlsOverlay
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <ProgressBarContainer
              onClick={handleSeek}
              onMouseMove={handleProgressHover}
              onMouseLeave={() => setHoverTime(null)}
            >
              <ProgressBarFill progress={progress} />
              
              <AnimatePresence>
                {hoverTime !== null && (
                  <TimeTooltip
                    left={hoverPosition}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {formatTime(hoverTime)}
                  </TimeTooltip>
                )}
              </AnimatePresence>
            </ProgressBarContainer>
            
            <ControlsBar>
              <ControlButton onClick={togglePlay}>
                {isPlaying ? '⏸' : '▶'}
              </ControlButton>
              
              <ControlButton onClick={() => skip(-10)}>
                ⏪
              </ControlButton>
              
              <ControlButton onClick={() => skip(10)}>
                ⏩
              </ControlButton>
              
              <VolumeControl>
                <ControlButton onClick={toggleMute}>
                  {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
                </ControlButton>
                <VolumeSlider
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                />
              </VolumeControl>
              
              <TimeDisplay>
                {formatTime(currentTime)} / {formatTime(duration)}
              </TimeDisplay>
              
              <ControlButton onClick={toggleFullscreen}>
                ⛶
              </ControlButton>
            </ControlsBar>
          </ControlsOverlay>
        )}
      </AnimatePresence>
    </VideoContainer>
  );
};

export default VideoPlayer;
