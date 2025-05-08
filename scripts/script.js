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
                duration: 1.2,
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
                duration: 1.2,
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
    await new Promise(resolve => setTimeout(resolve, 300));

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
    tl.to(".loading_right", {
        transform: "translateY(-100%)",
        duration: 1.2,
        delay: -1.1,
        ease: "power2.inOut"
    });
    tl.to(".loading_container", {
        height: "0%",
        duration: 1.2,
        delay: -0.2,
        ease: "power2.inOut"
    });
}

loadingAnimation();