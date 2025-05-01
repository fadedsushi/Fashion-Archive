// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeToggle.textContent = 'Toggle Dark Mode';
        updateThemeColors('light');
    }

    // Toggle theme on button click
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('light-mode');
        
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = 'Toggle Dark Mode';
            updateThemeColors('light');
        } else {
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = 'Toggle Light Mode';
            updateThemeColors('dark');
        }
    });

    // Function to update theme colors
    function updateThemeColors(mode) {
        const root = document.documentElement;
        
        if (mode === 'light') {
            // Change accent colors for light mode
            root.style.setProperty('--timeline-line', 'var(--light-accent-primary)');
        } else {
            // Restore original accent colors for dark mode
            root.style.setProperty('--timeline-line', 'var(--accent-primary)');
        }
    }

    // Image Modal/Lightbox Functionality
    // Create modal elements if they don't exist
    let modal = document.querySelector('.image-modal');

    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.id = 'imageModal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        const modalImage = document.createElement('img');
        modalImage.className = 'modal-image';
        modalImage.id = 'modalImage';
        modalImage.src = '';
        modalImage.alt = '';
        
        const modalClose = document.createElement('button');
        modalClose.className = 'modal-close';
        modalClose.id = 'modalClose';
        modalClose.innerHTML = '&times;';
        
        const modalCaption = document.createElement('div');
        modalCaption.className = 'modal-caption';
        modalCaption.id = 'modalCaption';
        
        modalContent.appendChild(modalImage);
        modalContent.appendChild(modalClose);
        modalContent.appendChild(modalCaption);
        modal.appendChild(modalContent);
        
        document.body.appendChild(modal);
    }

    const modalImage = modal.querySelector('.modal-image');
    const modalClose = modal.querySelector('.modal-close');
    const modalCaption = modal.querySelector('.modal-caption');

    // Function to open modal with image
    function openImageModal(src, caption) {
        modalImage.src = src;
        modalCaption.textContent = caption || '';
        modal.classList.add('active');
        document.body.classList.add('no-scroll');
    }

    // Function to close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    // Add expand overlay to all expandable images
    function addExpandOverlays() {
        const expandableImages = document.querySelectorAll('.timeline-image img, .decade-image, .category-image-container img, .about-image img');
        
        expandableImages.forEach(img => {
            const parent = img.parentElement;
            
            // Skip if this is already inside an overlay container or already has an overlay
            if (parent.classList.contains('expand-overlay') || parent.querySelector('.expand-overlay')) {
                return;
            }
            
            // Make sure parent has position relative for overlay positioning
            if (getComputedStyle(parent).position === 'static') {
                parent.style.position = 'relative';
            }
            
            // Create expand overlay
            const expandOverlay = document.createElement('div');
            expandOverlay.className = 'expand-overlay';
            expandOverlay.innerHTML = '<span>Click to Expand</span>';
            
            // Add overlay to parent
            parent.appendChild(expandOverlay);
        });
        
        // Special handling for decade images in explore page
        const decadeImages = document.querySelectorAll('.decade-image');
        decadeImages.forEach(img => {
            // If not already wrapped, wrap in container
            if (!img.parentElement.classList.contains('decade-image-container')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'decade-image-container';
                img.parentNode.insertBefore(wrapper, img);
                wrapper.appendChild(img);
                
                // Create expand overlay
                const expandOverlay = document.createElement('div');
                expandOverlay.className = 'expand-overlay';
                expandOverlay.innerHTML = '<span>Click to Expand</span>';
                
                // Add overlay to wrapper
                wrapper.appendChild(expandOverlay);
            }
        });
    }
    
    // Call function to add overlays
    addExpandOverlays();

    // Add click event to all images that should be expandable
    function setupImageClicks() {
        const expandableImages = document.querySelectorAll('.timeline-image img, .decade-image, .category-image-container img, .about-image img');
        
        expandableImages.forEach(img => {
            img.addEventListener('click', function() {
                const fullImg = this.getAttribute('data-full-img') || this.src;
                const caption = this.getAttribute('data-caption') || this.alt;
                openImageModal(fullImg, caption);
            });
        });
    }
    
    // Call function to setup image clicks
    setupImageClicks();

    // Close modal when clicking the close button or outside the image
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Timeline Animation and Functionality
    if (document.querySelector('.timeline')) {
        const timelineItems = document.querySelectorAll('.timeline-item');
        const decadeMarkers = document.querySelectorAll('.decade-marker');
        const decadeLinks = document.querySelectorAll('.decade-quick-link');
        
        // Function to check if an element is in viewport
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
                rect.bottom >= 0
            );
        }
        
        // Function to handle scroll animation
        function handleScroll() {
            timelineItems.forEach(item => {
                if (isInViewport(item)) {
                    item.classList.add('visible');
                }
            });
            
            // Highlight decade marker when scrolled to
            decadeMarkers.forEach(marker => {
                if (isInViewport(marker)) {
                    marker.classList.add('highlight');
                    
                    // Update active decade in navigation
                    const id = marker.id;
                    decadeLinks.forEach(link => {
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                } else {
                    marker.classList.remove('highlight');
                }
            });
        }
        
        // Smooth scroll to decade sections
        decadeLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Calculate offset for header
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active class
                    decadeLinks.forEach(link => link.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
        
        // Initial check on page load
        handleScroll();
        
        // Check on scroll
        window.addEventListener('scroll', handleScroll);
    }

    // Archive Page Category Tabs
    if (document.querySelector('.category-buttons')) {
        const categoryButtons = document.querySelectorAll('.category-buttons button');
        const categoryContents = document.querySelectorAll('.category-content');
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                // Update active button
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Show selected category content
                categoryContents.forEach(content => {
                    if (content.getAttribute('data-category') === category) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    }

    // Home Page Image Rotation
    if (document.querySelector('.rotating-images')) {
        const images = document.querySelectorAll('.rotating-images img');
        let currentIndex = 0;
        
        // Show first image initially
        if (images.length > 0) {
            images[0].style.opacity = 1;
        }
        
        // Rotate images every 5 seconds
        setInterval(() => {
            images[currentIndex].style.opacity = 0;
            currentIndex = (currentIndex + 1) % images.length;
            images[currentIndex].style.opacity = 1;
        }, 5000);
    }

    // Form submission handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate form submission
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate API call with timeout
            setTimeout(() => {
                alert('Thank you for your message! This is a demo form, so no message was actually sent.');
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
        });
    }

    // Decade navigation for Archive page
    const decadeNavItems = document.querySelectorAll('.decade-nav-item');
    if (decadeNavItems.length > 0) {
        decadeNavItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Update active class
                decadeNavItems.forEach(navItem => navItem.classList.remove('active'));
                this.classList.add('active');
                
                // Scroll to decade section
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Create modal elements
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const modalImage = document.createElement('img');
    modalImage.className = 'modal-image';
    
    const modalClose = document.createElement('button');
    modalClose.className = 'modal-close';
    modalClose.innerHTML = '&times;';
    
    const modalCaption = document.createElement('div');
    modalCaption.className = 'modal-caption';
    
    modalContent.appendChild(modalImage);
    modalContent.appendChild(modalClose);
    modalContent.appendChild(modalCaption);
    modal.appendChild(modalContent);
    
    document.body.appendChild(modal);
    
    // Add click event to all timeline images
    const timelineImages = document.querySelectorAll('.timeline-image img, .decade-image, .category-image-container img, .about-image img');
    
    timelineImages.forEach(img => {
        img.addEventListener('click', function() {
            modalImage.src = this.src;
            modalCaption.textContent = this.alt;
            modal.classList.add('active');
            document.body.classList.add('no-scroll');
        });
    });
    
    // Close modal when clicking the close button or outside the image
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
});
