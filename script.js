// Initialize Lenis but pause it initially
const lenis = new Lenis({
  duration: 1.2,
  smooth: true
});
lenis.stop(); // disables scrolling

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);


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
const loadingScreen =  document.querySelector('.loading');

let progress = 0;

function updateProgress() {
  if (progress < 100) {
    progress += 1;
    progressBar.style.width = progress + '%';
    progressText.textContent = progress + '%';
    requestAnimationFrame(updateProgress);
  }
}

// Start simulating progress
updateProgress();

window.addEventListener('load', () => {
  progressBar.style.width = '100%';
  progressText.textContent = '100%';

  setTimeout(() => {
    gsap.to(loadingScreen, {
      height: 0,
      duration: 0.4,
      ease: "power1.inOut",
      onComplete: () => {
        // Re-enable Lenis scroll AFTER loading screen is gone
        lenis.start();
        hero_section_reveal();
      }
    });
  }, 1700);
});


function hero_section_reveal(){
  const splitWords = (el) => {
    const text = el.textContent.trim();
    el.textContent = "";
    el.style.visibility = "visible";

    text.split(" ").forEach((word) => {
      const span = document.createElement("span");
      span.textContent = word;
      span.classList.add("word");
      el.appendChild(span);
      el.append(" "); // Add space after each word
    });
  };

  const animateWords = (el) => {
    const words = el.querySelectorAll(".word");
    gsap.to(words, {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.1,
      ease: "power4.out"
    });
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        splitWords(el);
        animateWords(el);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll(".animate-text").forEach(el => observer.observe(el));
}

const image = document.querySelector(".about-image-wrapper");
const text = document.querySelector(".about-text");
const abouttexts = document.querySelectorAll(".about-text h2");

gsap.timeline({
  scrollTrigger: {
    trigger: "#aboutTrigger",
    start: "center center",
    end: "center 20%",
    scrub: true,
    markers: true,
    pin: true
  }
})
.to(image, {
  scale: 3,
  borderRadius: "0%",
  ease: "power2.inOut"
}, 0)
.to(text.children[0], { // ABOUT
  x: "-100%",
  opacity: 0,
  display: "none"
}, 0)
.to(text.children[2], { // US
  x: "100%",
  opacity: 0,
    onComplete: () => {
      abouttexts.style.display = "none"; // Show the h2 elements
    }
}, 0)
.to(image, {
  width: "100vw",
  height: "100vh",
  scale: 1,
  duration: 1,
  ease: "power2.inOut"
}, 0.5);