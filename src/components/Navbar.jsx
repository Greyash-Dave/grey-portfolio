import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Navbar.css';
import { useModal } from '../components/ModalContext'

// Predefined playlist
const PLAYLIST = [
  { id: 'qjElWBGZou4', title: 'Dosi & Aisake @NCS' },
  { id: 'ihPTNp7370s', title: 'sumu - apart @NCS' },
  { id: '0Wa_CR0H8g4', title: 'Best of Me @NEFFEX' },
  { id: 'TXcg25C56xM', title: 'Hope @NEFFEX' },
  // Add more songs as needed
];

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

const MusicControls = ({ 
  isPlaying, 
  onTogglePlay, 
  isVisible, 
  currentSong,
  onNextTrack,
  playlist,
  currentIndex 
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
  const [showMusicControls, setShowMusicControls] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const lastScrollY = useRef(0);
  const playerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const { isModalOpen } = useModal(); // Access the modal state

  // Pause music when modal is open
  useEffect(() => {
    if (playerRef.current) {
      if (isModalOpen) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        // Ensure the player is ready before trying to play
        if (playerRef.current.getPlayerState() !== window.YT.PlayerState.PLAYING) {
          playerRef.current.playVideo();
        }
        setIsPlaying(true);
      }
    }
  }, [isModalOpen]);
  

useEffect(() => {
  // Function to handle other audio/video playing
  const handleOtherAudioPlay = (event) => {
    if (event.target !== playerRef.current) {
      // Pause your music if another audio/video plays
      if (playerRef.current && playerRef.current.pauseVideo) {
        playerRef.current.pauseVideo();
      }
    }
  };

  // Add event listeners to all audio and video elements
  const allMedia = document.querySelectorAll('audio, video');
  allMedia.forEach((media) => {
    media.addEventListener('play', handleOtherAudioPlay);
  });

  return () => {
    // Clean up event listeners
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
        videoId: PLAYLIST[0].id,
        playerVars: {
          autoplay: 1,
          controls: 0,
          showinfo: 0,
          modestbranding: 1
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
          },
          onStateChange: (event) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
            // Auto-play next song when current one ends
            if (event.data === window.YT.PlayerState.ENDED) {
              handleNextTrack();
            }
          }
        }
      });
    };
  };

  const handlePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const handleNextTrack = () => {
    if (playerRef.current) {
      const nextIndex = (currentSongIndex + 1) % PLAYLIST.length;
      setCurrentSongIndex(nextIndex);
      playerRef.current.loadVideoById(PLAYLIST[nextIndex].id);
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
      if (playerRef.current) {
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
              style={{ cursor: 'pointer' }}
            />
            <MusicControls 
              isPlaying={isPlaying}
              onTogglePlay={handlePlayPause}
              onNextTrack={handleNextTrack}
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