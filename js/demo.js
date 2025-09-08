// Demo page controller for VR 180 + UI overlay
(function() {
  function $(sel) { return document.querySelector(sel); }
  function formatTime(s) {
    if (!isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const scene = $('#aframeScene');
    const video = $('#vr180Video');
    const camera = $('#camera');

    const playBtn = $('#play-btn');
    const playToggle = $('#play-toggle');
    const rewindBtn = $('#rewind-btn');
    const forwardBtn = $('#forward-btn');
    const fullscreenBtn = $('#fullscreen-btn');
    const resetViewBtn = $('#reset-view');
    const vrModeBtn = $('#vr-mode');
    const helpBtn = $('#help-btn');

    const progressTrack = $('#progress-track');
    const progressBar = $('#progress-bar');
    const timeDisplay = $('#time-display');
    const placeholderText = $('#placeholderText');
    const vrSceneContainer = $('#vr-scene');

    // Hotspots and info panels (HTML overlay)
    const hotspots = document.querySelectorAll('.hotspot');
    const infoPanels = document.querySelectorAll('.info-panel');

    // Update time/progress
    function updateProgress() {
      const dur = video.duration || 0;
      const cur = video.currentTime || 0;
      const pct = dur ? (cur / dur) * 100 : 0;
      progressBar.style.width = `${pct}%`;
      timeDisplay.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;
    }

    function setPlayingUI(isPlaying) {
      playToggle.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
      playBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i> Pause Experience' : '<i class="fas fa-play"></i> Play Experience';
      placeholderText && (placeholderText.style.display = isPlaying ? 'none' : 'flex');
    }

    function togglePlay() {
      if (video.paused) {
        const p = video.play();
        if (p && typeof p.then === 'function') {
          p.then(() => setPlayingUI(true)).catch(() => {
            // Autoplay blocked
            setPlayingUI(false);
          });
        } else {
          setPlayingUI(true);
        }
      } else {
        video.pause();
        setPlayingUI(false);
      }
    }

    // Bind UI controls
    playBtn && playBtn.addEventListener('click', togglePlay);
    playToggle && playToggle.addEventListener('click', togglePlay);

    rewindBtn && rewindBtn.addEventListener('click', () => {
      video.currentTime = Math.max(0, (video.currentTime || 0) - 10);
      updateProgress();
    });

    forwardBtn && forwardBtn.addEventListener('click', () => {
      const dur = video.duration || 0;
      video.currentTime = Math.min(dur, (video.currentTime || 0) + 10);
      updateProgress();
    });

    fullscreenBtn && fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        (vrSceneContainer.requestFullscreen || document.documentElement.requestFullscreen).call(vrSceneContainer);
      } else {
        document.exitFullscreen && document.exitFullscreen();
      }
    });

    resetViewBtn && resetViewBtn.addEventListener('click', () => {
      if (camera) {
        camera.setAttribute('rotation', { x: 0, y: 0, z: 0 });
      }
      infoPanels.forEach(p => p.style.display = 'none');
    });

    vrModeBtn && vrModeBtn.addEventListener('click', () => {
      if (scene && scene.enterVR) scene.enterVR();
      else alert('VR mode not supported in this browser/device.');
    });

    helpBtn && helpBtn.addEventListener('click', () => {
      alert('Welcome to the VR 180 Experience!\n\n• Drag to look around\n• Click hotspots for more info\n• Use the playback controls to navigate\n• Use VR Mode if available');
    });

    // Click to seek on progress track
    progressTrack && progressTrack.addEventListener('click', (e) => {
      const rect = progressTrack.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const ratio = x / rect.width;
      if (isFinite(video.duration)) video.currentTime = ratio * video.duration;
    });

    // Hotspots -> show info panels near the hotspot (within container bounds)
    hotspots.forEach(h => {
      h.addEventListener('click', (e) => {
        e.stopPropagation();
        const infoId = h.getAttribute('data-info');
        const infoPanel = document.getElementById(infoId);
        if (!infoPanel) return;

        // Hide all first
        infoPanels.forEach(p => p.style.display = 'none');

        // Position panel
        const rect = h.getBoundingClientRect();
        const vrRect = vrSceneContainer.getBoundingClientRect();
        let leftPos = rect.left - vrRect.left + 40;
        let topPos = rect.top - vrRect.top;
        if (leftPos + 300 > vrRect.width) leftPos = vrRect.width - 320;
        if (topPos + 200 > vrRect.height) topPos = vrRect.height - 220;
        infoPanel.style.left = `${leftPos}px`;
        infoPanel.style.top = `${topPos}px`;
        infoPanel.style.display = 'block';
      });
    });

    // Close panels when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.info-panel') && !e.target.closest('.hotspot')) {
        infoPanels.forEach(p => p.style.display = 'none');
      }
    });

    // Also wire close buttons if present
    document.querySelectorAll('.close-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const p = btn.closest('.info-panel');
        if (p) p.style.display = 'none';
      });
    });

    // Video events
    video.addEventListener('loadedmetadata', updateProgress);
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('play', () => setPlayingUI(true));
    video.addEventListener('pause', () => setPlayingUI(false));
    video.addEventListener('ended', () => setPlayingUI(false));

    // Drag & drop support for loading a local VR180/360 MP4
    function handleDropFile(file){
      if (!file || !file.type.startsWith('video/')) return;
      try {
        const url = URL.createObjectURL(file);
        // Replace current sources with the dropped file
        video.pause();
        while (video.firstChild) video.removeChild(video.firstChild);
        video.removeAttribute('src');
        video.src = url;
        video.load();
        video.play().catch(()=>{});
        setPlayingUI(true);
      } catch (e) {
        console.error('Failed to load dropped file', e);
      }
    }

    const dropTarget = vrSceneContainer;
    if (dropTarget) {
      ['dragenter','dragover'].forEach(ev => dropTarget.addEventListener(ev, e => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }));
      dropTarget.addEventListener('drop', e => {
        e.preventDefault();
        const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        handleDropFile(file);
      });
    }

    // Initialize UI state
    setPlayingUI(false);
    updateProgress();
  });
})();

