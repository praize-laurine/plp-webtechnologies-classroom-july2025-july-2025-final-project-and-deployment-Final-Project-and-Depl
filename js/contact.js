/**
 * Contact Form JavaScript - Brew Café Coffee Shop
 * Handles form validation, submission, and user feedback
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== FORM VALIDATION CONFIGURATION =====
    
    const validationConfig = {
        name: {
            required: true,
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-Z\s'-]+$/,
            errorMessages: {
                required: 'Please enter your full name',
                minLength: 'Name must be at least 2 characters long',
                maxLength: 'Name must be less than 50 characters',
                pattern: 'Please enter a valid name (letters, spaces, hyphens, and apostrophes only)'
            }
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            maxLength: 100,
            errorMessages: {
                required: 'Please enter your email address',
                pattern: 'Please enter a valid email address',
                maxLength: 'Email address is too long'
            }
        },
        phone: {
            required: false,
            pattern: /^[\+]?[1-9][\d]{0,15}$/,
            errorMessages: {
                pattern: 'Please enter a valid phone number'
            }
        },
        subject: {
            required: true,
            errorMessages: {
                required: 'Please select a subject'
            }
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 1000,
            errorMessages: {
                required: 'Please enter your message',
                minLength: 'Message must be at least 10 characters long',
                maxLength: 'Message must be less than 1000 characters'
            }
        }
    };
    
    // ===== FORM VALIDATION FUNCTIONS =====
    
    /**
     * Initialize contact form validation
     */
    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        
        // Add real-time validation to all form fields
        const formFields = form.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            // Validate on blur (when user leaves field)
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Clear errors on focus (when user starts typing)
            field.addEventListener('focus', function() {
                clearFieldError(this);
            });
            
            // Real-time validation for certain fields
            if (field.type === 'email' || field.name === 'phone') {
                field.addEventListener('input', debounce(function() {
                    validateField(this);
                }, 500));
            }
        });
        
        // Handle form submission
        form.addEventListener('submit', handleFormSubmission);
        
        // Initialize character counter for message field
        initCharacterCounter();
    }
    
    /**
     * Validate individual form field
     * @param {Element} field - Form field to validate
     * @returns {boolean} Is field valid
     */
    function validateField(field) {
        const fieldName = field.name;
        const fieldValue = field.value.trim();
        const config = validationConfig[fieldName];
        
        if (!config) return true;
        
        const errors = [];
        
        // Required field validation
        if (config.required && !fieldValue) {
            errors.push(config.errorMessages.required);
        }
        
        // Only validate other rules if field has value
        if (fieldValue) {
            // Minimum length validation
            if (config.minLength && fieldValue.length < config.minLength) {
                errors.push(config.errorMessages.minLength);
            }
            
            // Maximum length validation
            if (config.maxLength && fieldValue.length > config.maxLength) {
                errors.push(config.errorMessages.maxLength);
            }
            
            // Pattern validation
            if (config.pattern && !config.pattern.test(fieldValue)) {
                errors.push(config.errorMessages.pattern);
            }
        }
        
        // Display errors or clear them
        if (errors.length > 0) {
            showFieldError(field, errors[0]);
            return false;
        } else {
            clearFieldError(field);
            return true;
        }
    }
    
    /**
     * Show error message for a field
     * @param {Element} field - Form field
     * @param {string} message - Error message
     */
    function showFieldError(field, message) {
        const errorElement = document.getElementById(field.name + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
        
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', field.name + 'Error');
    }
    
    /**
     * Clear error message for a field
     * @param {Element} field - Form field
     */
    function clearFieldError(field) {
        const errorElement = document.getElementById(field.name + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
        
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
    }
    
    /**
     * Validate entire form
     * @param {Element} form - Form element
     * @returns {boolean} Is form valid
     */
    function validateForm(form) {
        const formFields = form.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        formFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // ===== FORM SUBMISSION HANDLING =====
    
    /**
     * Handle form submission
     * @param {Event} e - Submit event
     */
    function handleFormSubmission(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        
        // Validate form before submission
        if (!validateForm(form)) {
            showNotification('Please correct the errors in the form', 'error');
            
            // Focus on first error field
            const firstErrorField = form.querySelector('.error');
            if (firstErrorField) {
                firstErrorField.focus();
            }
            return;
        }
        
        // Show loading state
        showLoadingState(submitButton, true);
        
        // Collect form data
        const formData = collectFormData(form);
        
        // Simulate form submission (replace with actual API call)
        submitForm(formData)
            .then(response => {
                handleSubmissionSuccess(form, response);
            })
            .catch(error => {
                handleSubmissionError(error);
            })
            .finally(() => {
                showLoadingState(submitButton, false);
            });
    }
    
    /**
     * Collect form data into an object
     * @param {Element} form - Form element
     * @returns {Object} Form data object
     */
    function collectFormData(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value.trim();
        }
        
        // Add timestamp and additional info
        data.timestamp = new Date().toISOString();
        data.userAgent = navigator.userAgent;
        data.referrer = document.referrer;
        
        return data;
    }
    
    /**
     * Submit form data (simulated - replace with actual API call)
     * @param {Object} formData - Form data object
     * @returns {Promise} Submission promise
     */
    function submitForm(formData) {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                // Simulate random success/failure for demo
                if (Math.random() > 0.1) { // 90% success rate
                    resolve({
                        success: true,
                        message: 'Thank you for your message! We will get back to you within 24 hours.',
                        id: generateSubmissionId()
                    });
                } else {
                    reject(new Error('Server temporarily unavailable. Please try again later.'));
                }
            }, 2000);
        });
    }
    
    /**
     * Handle successful form submission
     * @param {Element} form - Form element
     * @param {Object} response - Server response
     */
    function handleSubmissionSuccess(form, response) {
        // Show success message
        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.classList.add('show');
        }
        
        // Hide form
        form.style.display = 'none';
        
        // Show notification
        showNotification(response.message, 'success');
        
        // Send analytics event (if analytics is implemented)
        trackFormSubmission(collectFormData(form));
        
        // Auto-hide success message after 10 seconds and reset form
        setTimeout(() => {
            resetContactForm(form, successMessage);
        }, 10000);
        
        console.log('Form submitted successfully:', response);
    }
    
    /**
     * Handle form submission error
     * @param {Error} error - Error object
     */
    function handleSubmissionError(error) {
        console.error('Form submission error:', error);
        showNotification(error.message || 'Something went wrong. Please try again.', 'error');
    }
    
    /**
     * Show/hide loading state on submit button
     * @param {Element} button - Submit button
     * @param {boolean} loading - Loading state
     */
    function showLoadingState(button, loading) {
        if (loading) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        } else {
            button.disabled = false;
            button.innerHTML = 'Send Message';
        }
    }
    
    /**
     * Reset contact form and success message
     * @param {Element} form - Form element
     * @param {Element} successMessage - Success message element
     */
    function resetContactForm(form, successMessage) {
        // Reset form
        form.reset();
        form.style.display = 'block';
        
        // Clear any validation errors
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(msg => {
            msg.classList.remove('show');
            msg.textContent = '';
        });
        
        const errorFields = form.querySelectorAll('.error');
        errorFields.forEach(field => {
            field.classList.remove('error');
            field.removeAttribute('aria-invalid');
            field.removeAttribute('aria-describedby');
        });
        
        // Hide success message
        if (successMessage) {
            successMessage.classList.remove('show');
        }
        
        // Update character counter
        updateCharacterCounter();
    }
    
    // ===== CHARACTER COUNTER =====
    
    /**
     * Initialize character counter for message field
     */
    function initCharacterCounter() {
        const messageField = document.getElementById('message');
        if (!messageField) return;
        
        const maxLength = validationConfig.message.maxLength;
        
        // Create counter element
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.9rem;
            color: var(--text-light);
            margin-top: 5px;
        `;
        
        // Insert counter after message field
        messageField.parentNode.insertBefore(counter, messageField.nextSibling);
        
        // Update counter on input
        messageField.addEventListener('input', updateCharacterCounter);
        
        // Initial update
        updateCharacterCounter();
    }
    
    /**
     * Update character counter
     */
    function updateCharacterCounter() {
        const messageField = document.getElementById('message');
        const counter = document.querySelector('.character-counter');
        
        if (!messageField || !counter) return;
        
        const currentLength = messageField.value.length;
        const maxLength = validationConfig.message.maxLength;
        const remaining = maxLength - currentLength;
        
        counter.textContent = `${currentLength}/${maxLength} characters`;
        
        // Change color based on remaining characters
        if (remaining < 50) {
            counter.style.color = 'var(--warning)';
        } else if (remaining < 0) {
            counter.style.color = 'var(--error)';
        } else {
            counter.style.color = 'var(--text-light)';
        }
    }
    
    // ===== UTILITY FUNCTIONS =====
    
    /**
     * Generate unique submission ID
     * @returns {string} Unique ID
     */
    function generateSubmissionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    /**
     * Track form submission for analytics
     * @param {Object} formData - Form data
     */
    function trackFormSubmission(formData) {
        // This would integrate with analytics services like Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'event_category': 'Contact',
                'event_label': formData.subject,
                'value': 1
            });
        }
        
        console.log('Form submission tracked:', {
            subject: formData.subject,
            timestamp: formData.timestamp
        });
    }
    
    /**
     * Debounce function to limit function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // ===== ACCESSIBILITY ENHANCEMENTS =====
    
    /**
     * Initialize accessibility enhancements
     */
    function initAccessibilityFeatures() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        
        // Add ARIA live region for form errors
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'form-status';
        form.appendChild(liveRegion);
        
        // Announce validation errors to screen readers
        form.addEventListener('submit', function(e) {
            const errors = form.querySelectorAll('.error-message.show');
            if (errors.length > 0) {
                liveRegion.textContent = `Form has ${errors.length} error${errors.length > 1 ? 's' : ''}. Please review and correct.`;
            }
        });
    }
    
    // ===== PROGRESSIVE ENHANCEMENT =====
    
    /**
     * Initialize progressive enhancements
     */
    function initProgressiveEnhancements() {
        // Add native HTML5 validation as fallback
        const form = document.getElementById('contactForm');
        if (!form) return;
        
        // Only use custom validation if JavaScript is enabled
        form.setAttribute('novalidate', 'true');
        
        // Add input event listeners for better UX
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            // Auto-resize textarea
            if (input.tagName === 'TEXTAREA') {
                input.addEventListener('input', autoResizeTextarea);
                autoResizeTextarea.call(input); // Initial resize
            }
            
            // Auto-capitalize name field
            if (input.name === 'name') {
                input.addEventListener('input', function() {
                    const words = this.value.split(' ');
                    const capitalizedWords = words.map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    );
                    this.value = capitalizedWords.join(' ');
                });
            }
        });
    }
    
    /**
     * Auto-resize textarea based on content
     */
    function autoResizeTextarea() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 200) + 'px';
    }
    
    // ===== INITIALIZE CONTACT FORM =====
    
    /**
     * Initialize all contact form functionality
     */
    function initContactPage() {
        try {
            initContactForm();
            initAccessibilityFeatures();
            initProgressiveEnhancements();
            
            console.log('Contact form initialized successfully');
        } catch (error) {
            console.error('Error initializing contact form:', error);
        }
    }
    
    // Start initialization
    initContactPage();
    
});