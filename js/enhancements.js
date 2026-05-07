// Enhanced navigation and page interactions
document.addEventListener('DOMContentLoaded', () => {
  // Set active navigation link based on current page
  setActiveNavLink();
  
  // Add smooth scroll behavior
  addSmoothScroll();
  
  // Add page transition effects
  addPageTransitions();
  
  // Add mobile menu toggle for responsive design
  addMobileMenu();
});

// Set active navigation link
function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop() || 'index.html';
  
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    
    const href = link.getAttribute('href');
    if (href === currentPage || 
        (currentPage === '' && href === 'index.html') ||
        (currentPage === 'index.html' && href === 'index.html#projects') ||
        (currentPage === 'index.html' && href === 'index.html#how-it-works')) {
      link.classList.add('active');
    }
  });
}

// Add smooth scroll behavior
function addSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Add page transition effects
function addPageTransitions() {
  // Add fade-in effect to page content
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s ease-in-out';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
  
  // Add hover effects to navigation links
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.transform = 'translateY(-1px)';
    });
    
    link.addEventListener('mouseleave', () => {
      link.style.transform = 'translateY(0)';
    });
  });
}

// Add mobile menu toggle
function addMobileMenu() {
  const nav = document.querySelector('nav');
  const navLinks = document.querySelector('.nav-links');
  
  // Create mobile menu button
  const mobileMenuBtn = document.createElement('button');
  mobileMenuBtn.className = 'mobile-menu-btn';
  mobileMenuBtn.innerHTML = '☰';
  mobileMenuBtn.style.cssText = `
    display: none;
    background: none;
    border: none;
    color: var(--text);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
  `;
  
  nav.appendChild(mobileMenuBtn);
  
  // Toggle mobile menu
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
    mobileMenuBtn.innerHTML = navLinks.classList.contains('mobile-open') ? '✕' : '☰';
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && navLinks.classList.contains('mobile-open')) {
      navLinks.classList.remove('mobile-open');
      mobileMenuBtn.innerHTML = '☰';
    }
  });
}

// Add loading states for buttons
function addLoadingStates() {
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
      if (!this.classList.contains('loading')) {
        this.classList.add('loading');
        this.disabled = true;
        this.innerHTML = '<span style="animation: spin 1s linear infinite;">⚡</span> Loading...';
        
        // Simulate loading (remove this in production)
        setTimeout(() => {
          this.classList.remove('loading');
          this.disabled = false;
          this.innerHTML = this.getAttribute('data-original-text') || 'Buy Now';
        }, 2000);
      }
    });
    
    // Store original text
    button.setAttribute('data-original-text', button.innerHTML);
  });
}

// Add intersection observer for animations
function addScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe elements for animations
  document.querySelectorAll('.card, .section, .video-card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(element);
  });
}

// Initialize all enhancements
document.addEventListener('DOMContentLoaded', () => {
  addLoadingStates();
  addScrollAnimations();
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Close any open modals
    document.querySelectorAll('.modal-overlay.active').forEach(modal => {
      modal.classList.remove('active');
    });
    
    // Close mobile menu
    document.querySelector('.nav-links.mobile-open')?.classList.remove('mobile-open');
  }
});

// Add print styles
window.addEventListener('beforeprint', () => {
  document.body.classList.add('printing');
});

window.addEventListener('afterprint', () => {
  document.body.classList.remove('printing');
});

// Add performance monitoring
window.addEventListener('load', () => {
  const loadTime = performance.now();
  console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
  
  // Add performance indicator (for development)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    const perfIndicator = document.createElement('div');
    perfIndicator.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      background: var(--surface);
      color: var(--text);
      padding: 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      z-index: 9999;
    `;
    perfIndicator.textContent = `Load: ${loadTime.toFixed(0)}ms`;
    document.body.appendChild(perfIndicator);
  }
});
