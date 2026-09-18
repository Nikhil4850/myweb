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
  if (!nav || !navLinks) return;

  if (nav.querySelector('.mobile-menu-btn')) return;

  const mobileMenuBtn = document.createElement('button');
  mobileMenuBtn.className = 'mobile-menu-btn';
  mobileMenuBtn.setAttribute('aria-label', 'Toggle mobile menu');
  mobileMenuBtn.innerHTML = '☰';
  
  nav.appendChild(mobileMenuBtn);
  
  mobileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navLinks.classList.toggle('mobile-open');
    mobileMenuBtn.innerHTML = isOpen ? '✕' : '☰';
  });
  
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && navLinks.classList.contains('mobile-open')) {
      navLinks.classList.remove('mobile-open');
      mobileMenuBtn.innerHTML = '☰';
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      mobileMenuBtn.innerHTML = '☰';
    });
  });
}

// Add Floating WhatsApp button
function addWhatsAppFloatingBtn() {
  if (!document.body || document.querySelector('.wa-float')) return;
  const wa = document.createElement('a');
  wa.href = 'https://wa.me/917058871972?text=Hello%2C%20I%20want%20to%20inquire%20about%20NiksProjects%20services.';
  wa.target = '_blank';
  wa.rel = 'noopener noreferrer';
  wa.className = 'wa-float';
  wa.setAttribute('aria-label', 'Chat on WhatsApp');
  wa.innerHTML = `<svg viewBox="0 0 32 32" fill="currentColor"><path d="M16 2a13.9 13.9 0 0 0-12 20.8L2 30l7.4-1.9A13.9 13.9 0 1 0 16 2zm0 25.5c-2.3 0-4.5-.6-6.4-1.8l-.5-.3-4.4 1.1 1.2-4.3-.3-.5A11.6 11.6 0 1 1 16 27.5zm6.4-8.7c-.3-.2-2-.9-2.3-1-.3-.1-.5-.2-.7.2s-.8 1-.9 1.2c-.1.2-.3.2-.6.1-.3-.1-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.2-1.2 2.8 1.2 3.2 1.4 3.4c.2.2 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .8.8.2 1.6.2 2.2.1.7-.1 2.1-.8 2.4-1.7.3-.9.3-1.6.2-1.7-.1-.2-.3-.2-.6-.4z"/></svg>`;
  document.body.appendChild(wa);
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
    // Skip the hero section — it has its own animations
    if (element.classList.contains('hero')) return;
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(element);
  });
}

// Add ambient glass background light orbs
function addGlassOrbs() {
  if (!document.body || document.querySelector('.glass-orb')) return;
  const container = document.createElement('div');
  container.className = 'glass-orbs-container';
  container.innerHTML = `
    <div class="glass-orb glass-orb-1"></div>
    <div class="glass-orb glass-orb-2"></div>
    <div class="glass-orb glass-orb-3"></div>
  `;
  document.body.prepend(container);
}

// Initialize all enhancements
document.addEventListener('DOMContentLoaded', () => {
  addGlassOrbs();
  addLoadingStates();
  addScrollAnimations();
  addWhatsAppFloatingBtn();
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
