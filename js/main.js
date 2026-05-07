// Enhanced main.js with loading states, filtering, and sorting
const grid = document.getElementById('projectsGrid');
let currentFilter = 'all';
let currentSort = 'default';

// Ensure projects are loaded
let filteredProjects = [];

// Wait for projects to be available
function initializeProjects() {
  // Check multiple times for projects to be loaded
  let attempts = 0;
  const maxAttempts = 50;
  
  function checkProjects() {
    attempts++;
    
    // Try to access projects from different sources
    if (typeof projects !== 'undefined' && projects && projects.length > 0) {
      console.log('Projects loaded:', projects.length, 'projects');
      filteredProjects = [...projects];
      renderProjects();
      setupEventListeners();
      return;
    }
    
    if (attempts < maxAttempts) {
      setTimeout(checkProjects, 100);
    } else {
      console.error('Failed to load projects after', maxAttempts, 'attempts');
      // Fallback: Show error message
      const grid = document.getElementById('projectsGrid');
      if (grid) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
            <p style="color: var(--text-secondary); font-size: 1.1rem;">Unable to load projects. Please refresh the page.</p>
            <button class="btn btn-primary" style="margin-top: 1rem;" onclick="window.location.reload()">Refresh Page</button>
          </div>
        `;
      }
    }
  }
  
  checkProjects();
}

// Add loading state
function showLoadingState() {
  grid.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
      <div style="font-size: 3rem; margin-bottom: 1rem; animation: spin 1s linear infinite;">⚡</div>
      <p style="color: var(--text-secondary); font-size: 1.1rem;">Loading amazing projects...</p>
    </div>
  `;
}

// Filter projects
function filterProjects(filter) {
  currentFilter = filter;
  
  if (filter === 'all') {
    filteredProjects = [...projects];
  } else if (filter === 'available') {
    // Only show projects with real demo links and marked as available
    filteredProjects = projects.filter(p => 
      p.available === true && 
      p.demoUrl && 
      p.demoUrl !== 'https://your-demo-link.com/chat' &&
      p.demoUrl !== 'https://your-demo-link.com/portfolio' &&
      p.demoUrl !== 'https://your-demo-link.com/taskmanager' &&
      p.demoUrl !== 'https://your-demo-link.com/blog' &&
      p.demoUrl !== 'https://your-demo-link.com/expense' &&
      p.demoUrl !== 'https://your-demo-link.com/weather' &&
      p.demoUrl !== 'https://your-demo-link.com/todo' &&
      p.demoUrl !== 'https://your-demo-link.com/calculator' &&
      p.demoUrl !== 'https://your-demo-link.com/stopwatch' &&
      p.demoUrl !== 'https://your-demo-link.com/notes' &&
      p.demoUrl !== 'https://your-demo-link.com/quiz' &&
      p.demoUrl !== 'https://your-demo-link.com/recipes' &&
      p.demoUrl !== 'https://your-demo-link.com/music' &&
      p.demoUrl !== 'https://your-demo-link.com/password' &&
      p.demoUrl !== 'https://your-demo-link.com/colorpicker' &&
      p.demoUrl !== 'https://your-demo-link.com/converter' &&
      p.demoUrl !== 'https://your-demo-link.com/bmi' &&
      p.demoUrl !== 'https://your-demo-link.com/quotes' &&
      p.demoUrl !== 'https://your-demo-link.com/clock' &&
      p.demoUrl !== 'https://your-demo-link.com/shortener' &&
      p.demoUrl !== 'https://your-demo-link.com/gallery' &&
      p.demoUrl !== 'https://your-demo-link.com/survey' &&
      p.demoUrl !== 'https://your-demo-link.com/filemanager' &&
      p.demoUrl !== 'https://your-demo-link.com/calendar' &&
      p.demoUrl !== 'https://your-demo-link.com/chatbot' &&
      p.demoUrl !== 'https://your-demo-link.com/videoplayer' &&
      p.demoUrl !== 'https://your-demo-link.com/elearning' &&
      p.demoUrl !== 'https://your-demo-link.com/jobs' &&
      p.demoUrl !== 'https://your-demo-link.com/fitness' &&
      p.demoUrl !== 'https://your-demo-link.com/booking' &&
      p.demoUrl !== 'https://your-demo-link.com/inventory'
    );
  } else if (filter === 'free') {
    filteredProjects = projects.filter(p => p.price === 1);
  } else if (filter === 'paid') {
    filteredProjects = projects.filter(p => p.price > 1);
  }
  
  // Apply current sort after filtering
  sortProjects(currentSort);
}

// Sort projects
function sortProjects(sortOption) {
  currentSort = sortOption;
  
  if (sortOption === 'price-low-high') {
    filteredProjects.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price-high-low') {
    filteredProjects.sort((a, b) => b.price - a.price);
  } else {
    // Default order - restore original order
    if (currentFilter === 'all') {
      filteredProjects = [...projects];
    }
  }
  
  renderProjects();
}

// Initialize with loading state
showLoadingState();

// Simulate loading delay for better UX
setTimeout(() => {
  renderProjects();
  setupEventListeners();
}, 800);

function renderProjects() {
  grid.innerHTML = '';
  
  if (filteredProjects.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
        <p style="color: var(--text-secondary); font-size: 1.1rem;">No projects found for this filter.</p>
        <button class="btn btn-outline" style="margin-top: 1rem;" onclick="resetFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }
  
  filteredProjects.forEach((p, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    const priceDisplay = p.price === 1 ? '₹1' : `₹${p.price}`;
    const originalPriceDisplay = p.originalPrice > 1 ? `₹${p.originalPrice}` : '';
    const discountDisplay = p.discount > 0 ? `${p.discount}% OFF` : '';
    const buttonClass = p.price === 1 ? 'btn-success' : 'btn-primary';
    const buttonText = p.price === 1 ? 'Get Now' : 'Buy Now';
    
    card.innerHTML = `
      <img class="card-thumb" src="${p.thumbnail}" alt="${p.title}" loading="lazy" />
      <div class="card-body">
        <div class="card-title">${p.title}</div>
        <div class="card-desc">${p.description}</div>
        <div class="card-tech">
          ${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
        <div class="card-footer">
          <div class="price-container">
            ${discountDisplay ? `<div class="discount-badge">${discountDisplay}</div>` : ''}
            <div class="price-wrapper">
              <div class="price-current">${priceDisplay}</div>
              ${originalPriceDisplay ? `<div class="price-original">${originalPriceDisplay}</div>` : ''}
            </div>
            <div class="price-note">${p.price === 1 ? 'limited offer' : 'one-time'}</div>
          </div>
          <div class="card-actions">
            <a href="${p.demoUrl}" target="_blank" class="btn btn-outline">Live Demo</a>
            <a href="project.html?id=${p.id}" class="btn ${buttonClass}">${buttonText}</a>
          </div>
        </div>
      </div>
    `;
    
    grid.appendChild(card);
    
    // Staggered animation for cards
    setTimeout(() => {
      card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

// Setup event listeners for filters and sorting
function setupEventListeners() {
  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');
      // Apply filter
      filterProjects(this.dataset.filter);
    });
  });
  
  // Sort select
  document.getElementById('sortSelect').addEventListener('change', function() {
    sortProjects(this.value);
  });
}

// Reset filters function
function resetFilters() {
  currentFilter = 'all';
  currentSort = 'default';
  filteredProjects = [...projects];
  
  // Reset UI
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
  document.getElementById('sortSelect').value = 'default';
  
  renderProjects();
}

// Add smooth scroll behavior
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

// Add parallax effect to hero section (disabled to fix overlap)
// window.addEventListener('scroll', () => {
//   const scrolled = window.pageYOffset;
//   const hero = document.querySelector('.hero');
//   if (hero) {
//     hero.style.transform = `translateY(${scrolled * 0.5}px)`;
//   }
// });

// Add intersection observer for fade-in animations
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

// Observe sections for animations
document.addEventListener('DOMContentLoaded', () => {
  // Setup event listeners
  setupEventListeners();
  
  // Initialize projects with proper loading
  initializeProjects();
  
  document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(section);
  });
});
