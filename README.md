# VR 180 Immersive Experience

An interactive VR 180 web application built with A-Frame. Includes video playback controls, VR headset support, and an overlay UI for desktop and mobile.

## Features
- VR 180 videosphere with playback controls (play/pause, volume, seek)
- Desktop, mobile, and VR headset support (WebXR)
- Gaze and click interactions inside the scene
- Overlay UI with auto-hide and accessibility improvements
- Ready-to-deploy GitHub Pages workflow

## Quickstart
Prerequisites: Node.js 16+ recommended

1) Install dependencies
   npm install

2) Start local server
   npm run start

3) Open the app
   http://localhost:8000

Note: Browser autoplay policies may block audio/video until the first user interaction. Click the Play control if needed.

## Project Structure
- index.html: Main A-Frame scene and UI overlay
- js/vr-experience.js: Core VR logic (playback, interactions, VR events)
- js/ui-controls.js: Overlay UI controls and accessibility
- css/style.css: Styling for loading, UI, modal, and responsiveness
- assets/: Place your videos and images here

## VR 180 Notes
The scene uses a-videosphere configured for 180° content. Replace the sample video source in index.html with your VR 180 video.

## Deployment (GitHub Pages)
This repo includes a GitHub Actions workflow (.github/workflows/deploy.yml) that deploys the site to GitHub Pages on every push to main.

Steps to deploy:
1) Create a new GitHub repository and add it as remote
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git branch -M main
   git push -u origin main

2) The included workflow will build and deploy automatically to GitHub Pages. Once it completes, your site will be live at:
   https://<your-username>.github.io/<repo-name>/

## Recording a Loom Demo
- Start the local server (npm run start)
- Open the app at http://localhost:8000
- Use Loom to record the screen while demonstrating:
  - Entering VR (if available) or desktop interactions
  - Play/pause, seeking, mute/unmute
  - Interacting with in-scene elements (buttons)
  - Mobile-friendly UI (optional)

## Customization Ideas
- Swap in your own VR 180 video and ambient audio
- Add hotspots with info panels
- Integrate subtitles or captions mapped to the sphere
- Add multiple scenes with a menu

## License
MIT
