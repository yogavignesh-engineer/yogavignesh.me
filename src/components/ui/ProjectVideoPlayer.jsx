import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const VideoContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: ${props => props.$fullWidth ? '100%' : '1200px'};
  margin: ${props => props.$fullWidth ? '0' : '0 auto'};
  border-radius: ${props => props.$fullWidth ? '0' : '12px'};
  overflow: hidden;
  background: #000;
  box-shadow: ${props => props.$fullWidth ? 'none' : '0 20px 60px rgba(0, 0, 0, 0.5)'};
`;

const Video = styled.video`
  width: 100%;
  height: auto;
  display: block;
`;

const Controls = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, transparent 100%);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &:hover {
    height: 6px;
  }
`;

const Progress = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #66FCF1 0%, #45A29E 100%);
  border-radius: 2px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    background: #66FCF1;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(102, 252, 241, 0.8);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  ${ProgressBar}:hover &::after {
    opacity: 1;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ControlButton = styled(motion.button)`
  background: transparent;
  border: none;
  color: #EAEAEA;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  
  &:hover {
    color: #66FCF1;
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const TimeDisplay = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: #EAEAEA;
  margin-left: auto;
`;

const VolumeSlider = styled.input`
  width: 80px;
  height: 4px;
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.2);
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #66FCF1;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #66FCF1;
    cursor: pointer;
    border: none;
  }
`;

const PlayPauseOverlay = styled(motion.button)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(102, 252, 241, 0.9);
  backdrop-filter: blur(10px);
  border: none;
  color: #111;
  font-size: 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(102, 252, 241, 0.4);
  z-index: 10;
  
  &:hover {
    background: rgba(102, 252, 241, 1);
    transform: translate(-50%, -50%) scale(1.1);
  }
`;

const LoadingSpinner = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  border: 4px solid rgba(102, 252, 241, 0.2);
  border-top-color: #66FCF1;
  border-radius: 50%;
  z-index: 10;
`;

const formatTime = (seconds) => {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const ProjectVideoPlayer = ({ 
  src, 
  poster, 
  fullWidth = false, 
  autoPlay = false,
  loop = false 
}) => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [showPlayOverlay, setShowPlayOverlay] = useState(!autoPlay);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleEnded = () => {
      setPlaying(false);
      setShowPlayOverlay(true);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('waiting', () => setLoading(true));
    video.addEventListener('canplay', () => setLoading(false));

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('waiting', () => setLoading(true));
      video.removeEventListener('canplay', () => setLoading(false));
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
      setShowPlayOverlay(false);
    }
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.muted = false;
      setMuted(false);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <VideoContainer
      $fullWidth={fullWidth}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Video
        ref={videoRef}
        src={src}
        poster={poster}
        loop={loop}
        onClick={togglePlayPause}
      />

      <AnimatePresence>
        {loading && (
          <LoadingSpinner
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{ rotate: { duration: 1, repeat: Infinity, ease: 'linear' } }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPlayOverlay && !playing && (
          <PlayPauseOverlay
            onClick={togglePlayPause}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ▶
          </PlayPauseOverlay>
        )}
      </AnimatePresence>

      <Controls $visible={showControls || !playing}>
        <ProgressBar onClick={handleProgressClick}>
          <Progress
            initial={{ width: 0 }}
            animate={{ width: `${(currentTime / duration) * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </ProgressBar>

        <ButtonRow>
          <ControlButton onClick={togglePlayPause} whileTap={{ scale: 0.9 }}>
            {playing ? '⏸' : '▶'}
          </ControlButton>

          <ControlButton onClick={toggleMute} whileTap={{ scale: 0.9 }}>
            {muted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
          </ControlButton>

          <VolumeSlider
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
          />

          <TimeDisplay>
            {formatTime(currentTime)} / {formatTime(duration)}
          </TimeDisplay>

          <ControlButton onClick={toggleFullscreen} whileTap={{ scale: 0.9 }}>
            ⛶
          </ControlButton>
        </ButtonRow>
      </Controls>
    </VideoContainer>
  );
};

export default ProjectVideoPlayer;
