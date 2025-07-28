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
  scale: 1.3,
  width: "96vw",
  height: "90vh",
  borderRadius: "0%",
  scrollTrigger: {
    trigger: ".video_holder",
    start: "top 75%", // when 25% of video is in view
    end: "top 75%", // make it instant, no scroll scrub
    toggleActions: "play none none reverse", // instant on enter, instant reverse on leave
  },
  duration: 0.01 // make the animation instant
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

// Fade-in/fade-out navigation for .fade-link
function setupFadeNavigation() {
  const links = document.querySelectorAll('.fade-link');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      if (link.target === '_blank' || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      links.forEach(l => l.classList.remove('fade-in'));
      links.forEach(l => l.classList.add('fade-out'));
      setTimeout(() => {
        window.location.href = link.href;
      }, 400);
    });
    // On page load, fade in
    link.classList.remove('fade-out');
    link.classList.add('fade-in');
  });
}

// Instead of DOMContentLoaded, run after loading screen is gone
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
        setupFadeNavigation(); // <-- Run fade nav setup here
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