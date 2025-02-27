import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Navbar.css';
import { useModal } from '../components/ModalContext'

// Predefined playlist remains the same
const PLAYLIST = [
  { id: 'qjElWBGZou4', title: 'Dosi & Aisake @NCS' },
  { id: 'ihPTNp7370s', title: 'sumu - apart @NCS' },
  { id: '0Wa_CR0H8g4', title: 'Best of Me @NEFFEX' },
  { id: 'TXcg25C56xM', title: 'Hope @NEFFEX' },
];

// NavItem component remains the same
const NavItem = ({ children, onClick, activeView, view }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovering(true);
    setIsHovered(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(true);
    setIsHovering(false);
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 300);
  }, []);

  return (
    <p 
      onClick={onClick} 
      className={`navbar-item ${activeView === view ? 'active' : ''} ${isHovering ? 'hovering' : ''} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </p>
  );
};

// Updated MusicControls component with clickable playlist items
const MusicControls = ({ 
  isPlaying, 
  onTogglePlay, 
  isVisible, 
  currentSong,
  onNextTrack,
  onPrevTrack,
  playlist,
  currentIndex,
  onSelectTrack 
}) => {
  return (
    <div 
      className={`music-controls ${isVisible ? 'visible' : ''}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="song-info">
        <p className="song-title">Now Playing:</p>
        <p className="song-name">{currentSong?.title || 'Loading...'}</p>
      </div>
      <div className="control-buttons">
        <button 
          className="control-button"
          onClick={onPrevTrack}
          type="button"
        >
          Prev
        </button>
        <button 
          className="control-button"
          onClick={onTogglePlay}
          type="button"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button 
          className="control-button"
          onClick={onNextTrack}
          type="button"
        >
          Next
        </button>
      </div>
      <div className="playlist-container">
        <p className="playlist-title">Playlist:</p>
        <div className="playlist-items">
          {playlist.map((song, index) => (
            <div 
              key={song.id} 
              className={`playlist-item ${index === currentIndex ? 'current' : ''}`}
              onClick={() => onSelectTrack(index)}
              style={{ cursor: 'pointer' }}
            >
              {song.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Navbar = ({ onWorkClick, onAboutClick, activeView }) => {
  const [hidden, setHidden] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  // State to track user's intended playback state
  const [userWantsPlaying, setUserWantsPlaying] = useState(true);
  const [showMusicControls, setShowMusicControls] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const lastScrollY = useRef(0);
  const playerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const { isModalOpen } = useModal();

  // Modal effect to respect user's playback preference
  useEffect(() => {
    if (playerRef.current && playerReady) {
      if (isModalOpen) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        // Only resume playing if the user wants it to play
        if (userWantsPlaying) {
          playerRef.current.playVideo();
          setIsPlaying(true);
        }
      }
    }
  }, [isModalOpen, userWantsPlaying, playerReady]);

  // Handle external audio interruptions
  useEffect(() => {
    const handleOtherAudioPlay = (event) => {
      if (event.target !== playerRef.current) {
        if (playerRef.current && playerRef.current.pauseVideo) {
          playerRef.current.pauseVideo();
          setIsPlaying(false);
          // Don't update userWantsPlaying here as this is an external interrupt
        }
      }
    };

    const allMedia = document.querySelectorAll('audio, video');
    allMedia.forEach((media) => {
      media.addEventListener('play', handleOtherAudioPlay);
    });

    return () => {
      allMedia.forEach((media) => {
        media.removeEventListener('play', handleOtherAudioPlay);
      });
    };
  }, []);

  const handleScroll = useCallback(() => {
    if (window.innerWidth <= 480) {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentScrollY;
    }
  }, []);

  const initializeYouTubePlayer = () => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: PLAYLIST[currentSongIndex].id,
        playerVars: {
          autoplay: 1,
          controls: 0,
          showinfo: 0,
          modestbranding: 1
        },
        events: {
          onReady: (event) => {
            setPlayerReady(true);
            if (userWantsPlaying && !isModalOpen) {
              event.target.playVideo();
            }
          },
          onStateChange: (event) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
            // Handle end of track
            if (event.data === window.YT.PlayerState.ENDED) {
              handleNextTrack();
            }
          },
          onError: (event) => {
            console.error("YouTube Player Error:", event.data);
            // If a video fails, try the next one
            handleNextTrack();
          }
        }
      });
    };
  };

  // Updated to track both actual and intended state
  const handlePlayPause = () => {
    if (playerRef.current && playerReady) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setUserWantsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setUserWantsPlaying(true);
      }
    }
  };

  const handleNextTrack = () => {
    if (playerRef.current && playerReady) {
      const nextIndex = (currentSongIndex + 1) % PLAYLIST.length;
      setCurrentSongIndex(nextIndex);
      playerRef.current.loadVideoById(PLAYLIST[nextIndex].id);
      // Maintain the user's playback preference when changing tracks
      if (userWantsPlaying && !isModalOpen) {
        setTimeout(() => {
          playerRef.current.playVideo();
        }, 100);
      }
    }
  };

  const handlePrevTrack = () => {
    if (playerRef.current && playerReady) {
      // If we're more than 3 seconds into the song, restart it instead of going to previous
      const currentTime = playerRef.current.getCurrentTime();
      if (currentTime > 3) {
        playerRef.current.seekTo(0);
      } else {
        // Go to previous song with wraparound
        const prevIndex = (currentSongIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
        setCurrentSongIndex(prevIndex);
        playerRef.current.loadVideoById(PLAYLIST[prevIndex].id);
        // Maintain the user's playback preference when changing tracks
        if (userWantsPlaying && !isModalOpen) {
          setTimeout(() => {
            playerRef.current.playVideo();
          }, 100);
        }
      }
    }
  };

  const handleSelectTrack = (index) => {
    if (playerRef.current && playerReady && index !== currentSongIndex) {
      setCurrentSongIndex(index);
      playerRef.current.loadVideoById(PLAYLIST[index].id);
      // Maintain the user's playback preference when changing tracks
      if (userWantsPlaying && !isModalOpen) {
        setTimeout(() => {
          playerRef.current.playVideo();
        }, 100);
      }
    }
  };

  const handleLogoHover = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowMusicControls(true);
  };

  const handleLogoLeave = () => {
    controlsTimeoutRef.current = setTimeout(() => {
      setShowMusicControls(false);
    }, 300);
  };

  useEffect(() => {
    initializeYouTubePlayer();
    window.addEventListener('scroll', handleScroll);

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [handleScroll]);

  return (
    <>
      <div className={`navbar ${hidden ? 'hidden' : ''}`}>
        <div className="container">
          <div className="a">Gresham Dave</div>
          <div className="b">
            <NavItem 
              onClick={onWorkClick} 
              activeView={activeView}
              view="work"
            >
              WORK
            </NavItem>
            <NavItem 
              onClick={onAboutClick} 
              activeView={activeView}
              view="about"
            >
              ABOUT
            </NavItem>
          </div>
          <div 
            className="c"
            onMouseEnter={handleLogoHover}
            onMouseLeave={handleLogoLeave}
          >
            <img 
              src='/Grey-Red-Logo.webp' 
              alt="Back" 
              onClick={handlePlayPause}
              // Add the 'spinning' class only when music is playing
              className={isPlaying ? 'spinning' : ''}
              style={{ cursor: 'pointer' }}
            />
            <MusicControls 
              isPlaying={isPlaying}
              onTogglePlay={handlePlayPause}
              onNextTrack={handleNextTrack}
              onPrevTrack={handlePrevTrack}
              onSelectTrack={handleSelectTrack}
              isVisible={showMusicControls}
              currentSong={PLAYLIST[currentSongIndex]}
              playlist={PLAYLIST}
              currentIndex={currentSongIndex}
            />
          </div>
        </div>
      </div>
      <div id="youtube-player" style={{ display: 'none' }} />
    </>
  );
};

export default Navbar;