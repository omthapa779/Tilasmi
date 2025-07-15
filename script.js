// Initialize Lenis
const lenis = new Lenis({
  autoRaf: true,
  lerp: 0.08,
});


gsap.registerPlugin(ScrollTrigger);

gsap.to(".video", {
  scale: 1.3,   // zoom scale, e.g. 1.5 means 150% zoom
  scrollTrigger: {
    trigger: ".video_holder",  // element that triggers animation
    start: "center 80%",          // when top of element hits 80% of viewport height
    end: "bottom 0%",            // when top hits 30% of viewport height
    scrub: true,               // smooth scrubbing, animation linked to scroll position        
    duration: 2,
}
});

const blob = document.querySelector('.gradient-blob');

window.addEventListener('mousemove', (e) => {
  gsap.to(blob, {
    duration: 0.5,          // animation lasts half a second
    left: e.clientX + 'px', // target position left
    top: e.clientY + 'px',  // target position top
    ease: "power3.out"      // smooth easing
  });
});

const progressBar = document.querySelector('.progress-bar');
const progressText = document.querySelector('.progress-text');

let progress = 0;

function updateProgress() {
  if (progress < 90) {
    progress += 1;
    progressBar.style.width = progress + '%';
    progressText.textContent = progress + '%';
    requestAnimationFrame(updateProgress);
  }
}

// Start simulating progress
updateProgress();

window.addEventListener('load', () => {
  // When page fully loads, jump to 100%
  progressBar.style.width = '100%';
  progressText.textContent = '100%';

  // Optionally hide progress bar after a delay
  setTimeout(() => {
    progressBar.style.opacity = '0';
  }, 500);
});
