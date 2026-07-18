// Enhanced main.js with loading states, filtering, sorting and search
const grid = document.getElementById('projectsGrid');
let currentFilter = 'all';
let currentSort = 'price-low-high';
let searchQuery = '';

// Ensure projects are loaded
let filteredProjects = [];

// Wait for projects to be available
function initializeProjects() {
  const projectsSection = document.getElementById('projects');
  if (projectsSection) {
    projectsSection.style.opacity = '1';
    projectsSection.style.visibility = 'visible';
  }
  
  if (typeof projects !== 'undefined' && projects && projects.length > 0) {
    console.log('Projects loaded:', projects.length, 'projects');
    filteredProjects = [...projects];
    filteredProjects.sort((a, b) => a.price - b.price);
    renderProjects();
    setupEventListeners();
    setupSearch();
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = 'price-low-high';
  } else {
    console.error('Projects not available');
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
  showingAll = false;
  applyFiltersAndSearch();
}

function applyFiltersAndSearch() {
  let base = [...projects];

  // Apply category filter
  if (currentFilter === 'available') {
    base = base.filter(p =>
      p.available === true &&
      p.demoUrl && p.demoUrl.trim() !== '' &&
      !p.demoUrl.includes('your-demo-link')
    );
  } else if (currentFilter === 'free') {
    base = base.filter(p => p.price === 99);
  } else if (currentFilter === 'popular') {
    base = base.filter(p => p.popular === true);
    base.sort((a, b) => b.price - a.price);
    filteredProjects = base;
    // Apply search on top
    if (searchQuery) {
      filteredProjects = filteredProjects.filter(p =>
        p.title.toLowerCase().includes(searchQuery) ||
        p.description.toLowerCase().includes(searchQuery) ||
        p.tech.some(t => t.toLowerCase().includes(searchQuery))
      );
    }
    renderProjects();
    return;
  } else if (currentFilter === '3d') {
    base = base.filter(p => p.category === '3d');
    base.sort((a, b) => b.price - a.price);
    filteredProjects = base;
    if (searchQuery) {
      filteredProjects = filteredProjects.filter(p =>
        p.title.toLowerCase().includes(searchQuery) ||
        p.description.toLowerCase().includes(searchQuery) ||
        p.tech.some(t => t.toLowerCase().includes(searchQuery))
      );
    }
    renderProjects();
    return;
  }

  // Apply search
  if (searchQuery) {
    base = base.filter(p =>
      p.title.toLowerCase().includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery) ||
      p.tech.some(t => t.toLowerCase().includes(searchQuery))
    );
  }

  filteredProjects = base;
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
    // Default order - sort by price low to high
    filteredProjects.sort((a, b) => a.price - b.price);
  }
  
  renderProjects();
}

// Initialize with loading state
showLoadingState();

const MOBILE_INITIAL = 6; // projects shown on mobile before "Show More"
let showingAll = false;

function renderProjects() {
  grid.innerHTML = '';
  grid.style.opacity = '1';
  grid.style.visibility = 'visible';

  if (filteredProjects.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <div class="no-results">
          <div class="nr-icon">🔍</div>
          <p style="color: var(--text-secondary); font-size: 1.1rem; margin-bottom:1rem;">No projects found.</p>
          <button class="btn btn-outline" onclick="resetFilters()">Clear Filters</button>
        </div>
      </div>
    `;
    updateShowMoreBtn();
    return;
  }

  const isMobile = window.innerWidth <= 768;
  const visibleProjects = (isMobile && !showingAll)
    ? filteredProjects.slice(0, MOBILE_INITIAL)
    : filteredProjects;

  visibleProjects.forEach((p, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';

    const priceDisplay = p.price === 1 ? '₹1' : `₹${p.price}`;
    const originalPriceDisplay = p.originalPrice > 1 ? `₹${p.originalPrice}` : '';
    const discountDisplay = p.discount > 0 ? `${p.discount}% OFF` : '';
    const buttonClass = p.price === 99 ? 'btn-success' : 'btn-primary';
    const buttonText = p.price === 99 ? 'Get Now' : 'Buy Now';

    card.innerHTML = `
      <img class="card-thumb" src="${p.thumbnail}" alt="${p.title}" loading="lazy" />
      ${p.popular ? `<div class="popular-badge">🔥 Popular</div>` : ''}
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
            <div class="price-note">${p.price === 99 ? 'limited offer' : 'one-time'}</div>
          </div>
          <div class="card-actions">
            ${p.demoUrl ? `<a href="${p.demoUrl}" target="_blank" class="btn btn-outline">Live Demo</a>` : `<a href="https://wa.me/917058871972?text=Hello%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(p.title)}%20project." target="_blank" rel="noopener noreferrer" class="btn btn-outline">WhatsApp</a>`}
            <a href="project.html?id=${p.id}" class="btn ${buttonClass}">${buttonText}</a>
          </div>
        </div>
      </div>
    `;

    grid.appendChild(card);

    setTimeout(() => {
      card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
      card.style.visibility = 'visible';
    }, index * 80);
  });

  updateShowMoreBtn();
}

// Setup event listeners for filters and sorting
function setupEventListeners() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      filterProjects(this.dataset.filter);
    });
  });
  
  document.getElementById('sortSelect').addEventListener('change', function() {
    sortProjects(this.value);
  });
}

// Setup search input
function setupSearch() {
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('searchClear');
  if (!input) return;

  input.addEventListener('input', function() {
    searchQuery = this.value.toLowerCase().trim();
    clearBtn.style.display = searchQuery ? 'block' : 'none';
    showingAll = false;
    applyFiltersAndSearch();
  });

  clearBtn.addEventListener('click', function() {
    input.value = '';
    searchQuery = '';
    this.style.display = 'none';
    input.focus();
    applyFiltersAndSearch();
  });
}

// Reset filters function
function resetFilters() {
  currentFilter = 'all';
  currentSort = 'default';
  searchQuery = '';
  showingAll = false;
  filteredProjects = [...projects];

  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
  document.getElementById('sortSelect').value = 'default';
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('searchClear');
  if (input) input.value = '';
  if (clearBtn) clearBtn.style.display = 'none';

  renderProjects();
}

function updateShowMoreBtn() {
  const isMobile = window.innerWidth <= 768;
  let btn = document.getElementById('showMoreBtn');

  if (!isMobile || filteredProjects.length <= MOBILE_INITIAL) {
    if (btn) btn.style.display = 'none';
    return;
  }

  if (!btn) {
    btn = document.createElement('div');
    btn.id = 'showMoreBtn';
    btn.style.cssText = 'text-align:center; margin-top:2rem;';
    grid.parentNode.insertBefore(btn, grid.nextSibling);
  }

  btn.style.display = 'block';
  const remaining = filteredProjects.length - MOBILE_INITIAL;
  btn.innerHTML = showingAll
    ? `<button class="btn btn-outline" onclick="toggleShowAll()">Show Less ↑</button>`
    : `<button class="btn btn-primary" onclick="toggleShowAll()">Show All ${filteredProjects.length} Projects (${remaining} more) ↓</button>`;
}

function toggleShowAll() {
  showingAll = !showingAll;
  renderProjects();
  if (!showingAll) {
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
  }
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

// Observe sections for animations (but not the projects section)
document.addEventListener('DOMContentLoaded', () => {
  // Initialize projects first
  initializeProjects();
  
  // Ensure projects section stays visible
  setTimeout(() => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.style.opacity = '1';
      projectsSection.style.visibility = 'visible';
      projectsSection.style.transform = 'none';
    }
  }, 100);
  
  document.querySelectorAll('.section').forEach(section => {
    // Skip the projects section and the hero to avoid conflicts
    if (section.id === 'projects' || section.classList.contains('hero')) return;
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(section);
  });
});
