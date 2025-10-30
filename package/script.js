// Video player functionality
let currentScene = 0;
let totalScenes = 0;
let isPlaying = false;
let playInterval = null;

function initVideoPlayer() {
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const scenes = document.querySelectorAll('.scene-transition');
    
    totalScenes = scenes.length;
    currentScene = 0;
    
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlayPause);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', previousScene);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextScene);
    }
    
    // Initialize feather icons for player controls
    feather.replace();
}

function togglePlayPause() {
    isPlaying = !isPlaying;
    const playPauseBtn = document.getElementById('play-pause-btn');
    const icon = playPauseBtn.querySelector('i');
    
    if (isPlaying) {
        icon.setAttribute('data-feather', 'pause');
        feather.replace();
        startAutoPlay();
    } else {
        icon.setAttribute('data-feather', 'play');
        feather.replace();
        stopAutoPlay();
    }
}

function startAutoPlay() {
    playInterval = setInterval(() => {
        if (currentScene < totalScenes - 1) {
            nextScene();
        } else {
            stopAutoPlay();
            isPlaying = false;
            const playPauseBtn = document.getElementById('play-pause-btn');
            const icon = playPauseBtn.querySelector('i');
            icon.setAttribute('data-feather', 'play');
            feather.replace();
        }
    }, 5000); // 5 seconds per scene
}

function stopAutoPlay() {
    if (playInterval) {
        clearInterval(playInterval);
        playInterval = null;
    }
}

function nextScene() {
    const scenes = document.querySelectorAll('.scene-transition');
    if (currentScene < totalScenes - 1) {
        scenes[currentScene].classList.remove('opacity-100');
        scenes[currentScene].classList.add('opacity-0');
        currentScene++;
        scenes[currentScene].classList.remove('opacity-0');
        scenes[currentScene].classList.add('opacity-100');
        updateSceneCounter();
    }
}

function previousScene() {
    const scenes = document.querySelectorAll('.scene-transition');
    if (currentScene > 0) {
        scenes[currentScene].classList.remove('opacity-100');
        scenes[currentScene].classList.add('opacity-0');
        currentScene--;
        scenes[currentScene].classList.remove('opacity-0');
        scenes[currentScene].classList.add('opacity-100');
        updateSceneCounter();
    }
}

function updateSceneCounter() {
    const counter = document.getElementById('scene-counter');
    if (counter) {
        counter.textContent = `Scene ${currentScene + 1} of ${totalScenes}`;
    }
}

// Download functionality
document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            alert('MP4 export feature coming soon! Currently you can take screenshots of each scene.');
        });
    }
});