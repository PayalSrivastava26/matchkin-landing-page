
class MatchKinApp {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.setupAnimations();
        this.createParticles();
    }

    init() {
        // Initialize theme
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.applyTheme(this.currentTheme);
        
        // Initialize scroll position
        this.lastScrollY = window.scrollY;
        this.isScrolling = false;
        
        // Initialize form data
        this.formData = {
            name: '',
            email: '',
            role: '',
            company: '',
            expertise: '',
            newsletter: false
        };
        
        // Initialize intersection observer
        this.setupIntersectionObserver();
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
            
            // Close mobile menu when clicking links
            const mobileLinks = mobileMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMobileMenu());
            });
        }

        // scrolling for navigation links
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Scroll events
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        window.addEventListener('resize', () => this.handleResize(), { passive: true });

        // Form handling
        this.setupFormValidation();

        // Scroll to top button
        const scrollTopBtn = document.getElementById('scroll-top');
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', () => this.scrollToTop());
        }

        // Hero CTA buttons
        const joinWaitlistBtns = document.querySelectorAll('button:contains("Join Waitlist")');
        joinWaitlistBtns.forEach(btn => {
            if (btn.textContent.includes('Join Waitlist')) {
                btn.addEventListener('click', () => this.scrollToWaitlist());
            }
        });

        // Learn more button
        const learnMoreBtn = document.querySelector('button:contains("Learn More")');
        if (learnMoreBtn && learnMoreBtn.textContent.includes('Learn More')) {
            learnMoreBtn.addEventListener('click', () => this.scrollToAbout());
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme(theme) {
        const body = document.getElementById('body');
        const themeIcon = document.getElementById('theme-icon');
        
        if (theme === 'light') {
            body.classList.add('light-theme');
            if (themeIcon) themeIcon.textContent = '☀️';
        } else {
            body.classList.remove('light-theme');
            if (themeIcon) themeIcon.textContent = '🌙';
        }
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        
        if (mobileMenu) {
            const isOpen = mobileMenu.classList.contains('open');
            
            if (isOpen) {
                this.closeMobileMenu();
            } else {
                mobileMenu.classList.add('open');
                mobileMenu.style.transform = 'translateX(0)';
                
                // Animate hamburger to X
                const spans = mobileMenuBtn.querySelectorAll('span');
                if (spans.length === 3) {
                    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    spans[1].style.opacity = '0';
                    spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                }
            }
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        
        if (mobileMenu) {
            mobileMenu.classList.remove('open');
            mobileMenu.style.transform = 'translateX(100%)';
            
            // Reset hamburger
            const spans = mobileMenuBtn.querySelectorAll('span');
            if (spans.length === 3) {
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            }
        }
    }

    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
        
        this.closeMobileMenu();
    }

    handleScroll() {
        if (!this.isScrolling) {
            window.requestAnimationFrame(() => {
                this.updateScrollEffects();
                this.isScrolling = false;
            });
            this.isScrolling = true;
        }
    }

    updateScrollEffects() {
        const scrollY = window.scrollY;
        const scrollTopBtn = document.getElementById('scroll-top');
        
        // Show/hide scroll to top button
        if (scrollTopBtn) {
            if (scrollY > 500) {
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.pointerEvents = 'auto';
            } else {
                scrollTopBtn.style.opacity = '0';
                scrollTopBtn.style.pointerEvents = 'none';
            }
        }

        // Parallax effect for hero section
        const heroSection = document.getElementById('home');
        if (heroSection && scrollY < window.innerHeight) {
            const parallaxSpeed = 0.5;
            heroSection.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
        }

        // Update navbar background opacity
        const nav = document.querySelector('nav');
        if (nav) {
            const opacity = Math.min(scrollY / 100, 0.95);
            nav.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
        }

        this.lastScrollY = scrollY;
    }

    handleResize() {
        // Close mobile menu on resize
        if (window.innerWidth >= 768) {
            this.closeMobileMenu();
        }
        
        // Recreate particles on resize
        this.createParticles();
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    scrollToWaitlist() {
        const waitlistSection = document.getElementById('waitlist');
        if (waitlistSection) {
            const offsetTop = waitlistSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    scrollToAbout() {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            const offsetTop = aboutSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Add stagger animation for feature cards
                    if (entry.target.classList.contains('feature-card')) {
                        const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                        setTimeout(() => {
                            entry.target.style.animationDelay = `${delay}ms`;
                            entry.target.classList.add('animate-slide-up');
                        }, delay);
                    }
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.fade-in, .scale-in, .feature-card');
        animatedElements.forEach(el => observer.observe(el));

        // Add fade-in class to sections
        const sections = document.querySelectorAll('section > div');
        sections.forEach(section => {
            section.classList.add('fade-in');
            observer.observe(section);
        });

        // Add feature-card class to feature items
        const featureCards = document.querySelectorAll('#features .group');
        featureCards.forEach(card => {
            card.classList.add('feature-card', 'scale-in');
            observer.observe(card);
        });
    }

    setupAnimations() {
        // Typing effect for hero text
        this.setupTypingEffect();
        
        // Floating animation for elements
        this.setupFloatingElements();
        
        // Stats counter animation
        this.setupStatsAnimation();
    }

    setupTypingEffect() {
        const typingText = document.querySelector('.animate-gradient');
        if (typingText) {
            const text = typingText.textContent;
            typingText.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    typingText.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            
            setTimeout(typeWriter, 1000);
        }
    }

    setupFloatingElements() {
        const floatingElements = document.querySelectorAll('.animate-float');
        floatingElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.5}s`;
        });
    }

    setupStatsAnimation() {
        const statsNumbers = document.querySelectorAll('.text-3xl.font-bold');
        
        const animateCounter = (element, target) => {
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    element.textContent = Math.floor(current) + (target >= 1000 ? '+' : '%');
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target + (target >= 1000 ? '+' : target === 98 ? '%' : '');
                }
            };
            
            updateCounter();
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const text = entry.target.textContent;
                    const number = parseInt(text.replace(/[^0-9]/g, ''));
                    animateCounter(entry.target, number);
                    observer.unobserve(entry.target);
                }
            });
        });

        statsNumbers.forEach(stat => observer.observe(stat));
    }

    setupFormValidation() {
        const form = document.getElementById('waitlist-form');
        if (!form) return;

        const inputs = form.querySelectorAll('input, select, textarea');
        
        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Form submission
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    validateField(input) {
        const value = input.value.trim();
        const errorElement = input.parentNode.querySelector('.error-message');
        let isValid = true;
        let errorMessage = '';

        switch(input.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    isValid = false;
                    errorMessage = 'Email is required';
                } else if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
                
            case 'text':
                if (input.hasAttribute('required') && !value) {
                    isValid = false;
                    errorMessage = `${input.labels[0]?.textContent || 'This field'} is required`;
                }
                break;
                
            default:
                if (input.tagName === 'SELECT' && !value) {
                    isValid = false;
                    errorMessage = 'Please select an option';
                }
        }

        if (errorElement) {
            if (!isValid) {
                errorElement.textContent = errorMessage;
                errorElement.classList.remove('hidden');
                errorElement.classList.add('show');
                input.classList.add('border-red-500');
            } else {
                this.clearFieldError(input);
            }
        }

        return isValid;
    }

    clearFieldError(input) {
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.classList.add('hidden');
            errorElement.classList.remove('show');
            input.classList.remove('border-red-500');
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const submitText = document.getElementById('submit-text');
        const loadingSpinner = document.getElementById('loading-spinner');
        const successMessage = document.getElementById('success-message');
        
        // Validate all fields
        const inputs = form.querySelectorAll('input[required], select[required]');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) return;

        // Show loading state
        submitBtn.disabled = true;
        submitText.textContent = 'Joining...';
        loadingSpinner.classList.remove('hidden');

        // Collect form data
        const formData = new FormData(form);
        this.formData = Object.fromEntries(formData.entries());

        try {
            // Simulate API call
            await this.simulateAPICall();
            
            // Show success
            this.showSuccessMessage(successMessage);
            form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage('Something went wrong. Please try again.');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitText.textContent = 'Join Waitlist';
            loadingSpinner.classList.add('hidden');
        }
    }

    async simulateAPICall() {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Waitlist data:', this.formData);
                resolve();
            }, 2000);
        });
    }

    showSuccessMessage(element) {
        if (element) {
            element.classList.remove('hidden');
            element.classList.add('success-bounce');
            
            // Scroll to success message
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }
    }

    showErrorMessage(message) {
        // Create temporary error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'mt-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg';
        errorDiv.innerHTML = `
            <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-red-400 font-medium">Error: ${message}</span>
            </div>
        `;
        
        const form = document.getElementById('waitlist-form');
        form.insertAdjacentElement('afterend', errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    createParticles() {
        // Remove existing particles
        const existingParticles = document.querySelectorAll('.particle');
        existingParticles.forEach(particle => particle.remove());

        const heroSection = document.getElementById('home');
        if (!heroSection || window.innerWidth < 768) return;

        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 5) + 's';
            heroSection.appendChild(particle);
        }
    }
}

// Utility functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Enhanced scroll performance
const optimizedScroll = throttle(() => {
    if (window.matchKinApp) {
        window.matchKinApp.handleScroll();
    }
}, 16);

window.addEventListener('scroll', optimizedScroll, { passive: true });

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.matchKinApp = new MatchKinApp();
    
    // Add loading complete class
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.classList.add('paused');
    } else {
        // Resume animations when tab becomes visible
        document.body.classList.remove('paused');
    }
});

// Preload critical resources
const preloadResources = () => {
    const criticalFonts = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
    ];
    
    criticalFonts.forEach(font => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = font;
        document.head.appendChild(link);
    });
};

// Initialize preloading
preloadResources();

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MatchKinApp;
}