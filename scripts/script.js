let tl = gsap.timeline();

function animateDigit(element, number, delay = 0) {
    return new Promise(resolve => {
        // Create container for smooth animation
        const digitContainer = document.createElement('div');
        digitContainer.className = 'digit-container';
        digitContainer.style.position = 'fixed'; // Changed from fixed to absolute
        digitContainer.style.width = '50%'; // Use full width of parent
        digitContainer.style.height = '100%';
        digitContainer.style.display = 'flex';
        
        const digit = document.createElement('h1');
        digit.className = 'secondary_font';
        digit.textContent = number;
        digitContainer.appendChild(digit);
        
        // Add to wrapper
        element.appendChild(digitContainer);

        // Previous digit container (if exists)
        const prevContainer = element.querySelector('div:nth-last-child(2)');
        
        if (prevContainer) {
            // Match the smooth exit animation style
            gsap.to(prevContainer, {
                transform: "translateY(-100%)",
                duration: 0.6,
                ease: "expo.inOut",
                onComplete: () => prevContainer.remove()
            });
        }           

        // Match the smooth entrance animation style
        gsap.fromTo(digitContainer,              
            { 
                transform: "translateY(100%)",
                opacity: 0,
            },
            {
                transform: "translateY(0%)",
                opacity: 1,
                delay: delay,                                    
                duration: 0.6,
                ease: "expo.inOut",
                onComplete: () => resolve()
            }
        );
    });
}

async function loadingAnimation() {
    const leftContainer = document.querySelector('.loading_left .block_counter_one');
    const rightContainer = document.querySelector('.loading_right .block_counter_one');
    
    // Clear existing content
    leftContainer.innerHTML = '';
    rightContainer.innerHTML = '';

    const steps = [
        { left: 2, right: 0 },  // 20
        { left: 4, right: 5 },  // 45
        { left: 6, right: 7 },  // 67
        { left: 8, right: 3 },  // 83
        { left: 9, right: 9 }   // 99
    ];

    let currentLeft = 0;
    let currentRight = 0;

    for(const step of steps) {
        // Animate both digits simultaneously for better performance
        await Promise.all([
            step.left !== currentLeft && animateDigit(leftContainer, step.left, 0),
            step.right !== currentRight && animateDigit(rightContainer, step.right, 0.1)
        ]);

        currentLeft = step.left;
        currentRight = step.right;
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));

    // Animate the final 99 sliding up
    const finalLeftDigit = leftContainer.querySelector('.digit-container');
    const finalRightDigit = rightContainer.querySelector('.digit-container');

    await Promise.all([
        new Promise(resolve => {
            gsap.to(finalLeftDigit, {
                transform: "translateY(-100%)",
                opacity: 0,
                duration: 1.2,
                ease: "expo.inOut",
                onComplete: resolve
            });
        }),
        new Promise(resolve => {
            gsap.to(finalRightDigit, {
                transform: "translateY(-100%)",
                opacity: 0,
                duration: 1.2,
                ease: "expo.inOut",
                onComplete: resolve
            });
        }),

        new Promise(resolve => {
            tl.to('.left_logo h2', {
                top: "0vh",
                duration: 1.2,
                ease: "power2.inOut"
            });
            tl.to('.right_logo h2', {
                top: "0vh",
                duration: 1.2,
                delay: -1.2,
                ease: "power2.inOut",
                onComplete: resolve
            });
        }),
    ]);

    // Wait with blank screen
    await new Promise(resolve => setTimeout(resolve, 600));

    // Final container exit animation
    tl.to('.border_top',{
        height: "50%",
        opacity: "100%",
        duration: 0.5,
        delay: 0.2,
        ease: "power2.inOut",
    });
    tl.to('.border_bottom',{
        height: "50%",
        opacity: "100%",
        duration: 0.5,
        delay: -0.5,
        ease: "power2.inOut",
    });
    tl.to(".loading_left", {
        transform: "translateY(-100%)",
        duration: 1.2,
        delay: -0.2,
        ease: "power2.inOut"
    });
    tl.to('.border_top, .border_bottom',{
        height: "0%",
        justifySelf: "flex-start",
        duration: 0.5,
        delay: -0.5,
        ease: "power2.inOut",
    });
    tl.to('.left_logo h2', {
        top: "10vh",
        duration: 0.7,
        delay: -1.2,
        ease: "power2.inOut"
    });
    tl.to('.right_logo h2', {
        top: "-10vh",
        duration: 1.1,
        delay: -1.2,
        ease: "power2.inOut",
    });
    tl.to(".loading_right", {
        transform: "translateY(-100%)",
        duration: 1.2,
        delay: -1.1,
        ease: "power2.inOut"
    });
    tl.to(".loading_container", {
        height: "0%",
        duration: 1.2,
        delay: -1.3,
        ease: "expo.inOut"
    });
    tl.to(".video_hero", {
        transform: "scale(1.1)",
        duration: 1.2,
        delay: -0.9,
        ease: "expo.inOut"
    });
}

function button_hover(){
      if (window.innerWidth <= 1024) return;
    gsap.to('.button_before',{
        transform: "translateX(110%)",
        duration: 0.6,
        ease: "power2.inOut",
    });
    gsap.to('.hero_button',{
        width: "13vw",
        duration: 0.6,
        ease: "power2.inOut",
    });
    gsap.to('.button_after',{
        transform: "translateX(0%)",
        duration: 0.6,
        ease: "power2.inOut",
    });
}

function button_leave(){
    if (window.innerWidth <= 1024) return;
    gsap.to('.button_before',{
        transform: "translateX(0%)",
        duration: 0.6,
        ease: "power2.inOut",
    });
    gsap.to('.hero_button',{
        width: "12vw",
        duration: 0.6,
        ease: "power2.inOut",
    });
    gsap.to('.button_after',{
        transform: "translateX(-110%)",
        duration: 0.6,
        ease: "power2.inOut",
    });
}
function initHeroAnimation() {
    // Split the text by lines and words for "website" special handling
    const heroTitle = document.querySelector('.hero_title h1');
    const split = new SplitText(heroTitle, {
        type: "lines,words",
        linesClass: "split-line",
        wordsClass: "word"
    });

    // Create wrapper for lines for cleaner animation
    split.lines.forEach(line => {
        const wrapper = document.createElement('div');
        wrapper.style.overflow = 'hidden';
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
    });

    // Set initial position
    gsap.set(split.lines, {
        y: 100,
    });

    // Create the animation
    const tl = gsap.timeline({
        delay: 0.8
    });

    // Animate each line
    tl.to(split.lines, {
        y: 0,
        duration: 1.8,
        stagger: 0.2,
        ease: "expo.out"
    });
}

// Call the animation after your loading sequence
function startPageAnimations() {
    // Your existing loading animation
    loadingAnimation().then(() => {
        // After loading is complete, start hero animations
        initHeroAnimation();
    });
}
startPageAnimations();