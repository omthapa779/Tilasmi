// Function to get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Function to pre-select service based on URL parameter
function preSelectService() {
    const serviceParam = getUrlParameter('service');
    console.log('Service parameter:', serviceParam); // Debug log
    
    if (serviceParam) {
        const serviceSelect = document.getElementById('service');
        if (serviceSelect) {
            // Find the option that matches the service parameter
            const options = serviceSelect.querySelectorAll('option');
            let found = false;
            
            options.forEach(option => {
                if (option.value === serviceParam) {
                    option.selected = true;
                    found = true;
                    console.log('Service selected:', option.text); // Debug log
                }
            });
            
            if (found) {
                // Add a visual indicator that the service was pre-selected
                serviceSelect.style.borderColor = '#d4af37';
                serviceSelect.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.2)';
                serviceSelect.style.background = 'rgba(212, 175, 55, 0.1)';
                
                // Remove the visual indicator after 3 seconds
                setTimeout(() => {
                    serviceSelect.style.borderColor = '';
                    serviceSelect.style.boxShadow = '';
                    serviceSelect.style.background = '';
                }, 3000);
            }
        }
    }
}

// Initialize EmailJS
(function() {
    emailjs.init("GU4jNpc5U3rVhomOd");
})();

// Function to handle form submission
function handleFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.style.background = 'linear-gradient(135deg, #d4af37, #eab942)';
    
    // Get form data
    const formData = new FormData(form);
    const formObject = {};
    
    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
        formObject[key] = value;
    }
    
    // Add service parameter if available
    const serviceParam = getUrlParameter('service');
    if (serviceParam) {
        formObject.selected_service = serviceParam;
    }
    
    // Get current timestamp
    const now = new Date();
    const timeString = now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // EmailJS template parameters
    const templateParams = {
        user_name: formObject.name,
        user_email: formObject.email,
        user_phone: formObject.phone,
        user_contact_method: formObject.contact_method || 'Not specified',
        user_service: formObject.service || formObject.selected_service || 'Not specified',
        user_budget: formObject.budget || 'Not specified',
        user_message: formObject.message,
        time: timeString
    };
    
    // Send email using EmailJS
    emailjs.send('service_rsyz14m', 'template_un7nyve', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            
            // Success
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            
            // Show success message
            showNotification('Thank you! Your message has been sent successfully.', 'success');
            
            // Reset form
            form.reset();
            
            // Redirect to thank you page after 2 seconds
            setTimeout(() => {
                window.location.href = 'thank-you.html';
            }, 2000);
        }, function(error) {
            console.log('FAILED...', error);
            
            // Show error message
            submitBtn.textContent = 'Error - Try Again';
            submitBtn.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
            showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        });
}

// Function to show notifications
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'linear-gradient(135deg, #f44336, #d32f2f)'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        font-family: 'Modernist', sans-serif;
        font-weight: 500;
        transform: translateX(400px);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-left: 15px;
        padding: 0;
        line-height: 1;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Contact page loaded');
    console.log('Current URL:', window.location.href);
    
    // Pre-select service if URL parameter exists
    preSelectService();
    
    // Add form submission handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
        console.log('Form submission handler added');
    } else {
        console.error('Contact form not found!');
    }
    
    // Add smooth focus effects to form inputs
    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
    
    // Debug: Log all service options
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
        const options = serviceSelect.querySelectorAll('option');
        console.log('Available service options:');
        options.forEach(option => {
            console.log(`- ${option.value}: ${option.text}`);
        });
    }
}); 