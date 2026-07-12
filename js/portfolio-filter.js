/**
 * Dremora IT Portfolio Filter & Animation System
 * Uses View Transitions API (or FLIP fallback) for cinematic layout animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-pill');
  const searchInput = document.getElementById('portfolioSearch');
  const sortDropdown = document.getElementById('portfolioSort');
  const projectCards = Array.from(document.querySelectorAll('.portfolio-project'));
  const projectsContainer = document.getElementById('projectsContainer');
  const emptyState = document.getElementById('portfolioEmptyState');
  const projectCount = document.getElementById('projectCount');

  let currentCategory = 'All';
  let searchQuery = '';
  let currentSort = 'newest';

  // State initialization
  projectCards.forEach((card, index) => {
    card.dataset.index = index; // for "newest" sorting
  });

  function getCardData(card) {
    return {
      title: (card.dataset.title || '').toLowerCase(),
      tech: (card.dataset.tech || '').toLowerCase(),
      desc: (card.dataset.description || '').toLowerCase(),
      tags: (card.dataset.tags || '').toLowerCase(),
      category: (card.dataset.category || '').toLowerCase(),
      industry: (card.dataset.industry || '').toLowerCase(),
      isFeatured: card.dataset.featured === 'true'
    };
  }

  function filterAndSortProjects() {
    const isViewTransitionSupported = document.startViewTransition !== undefined;
    
    const updateDOM = () => {
      let visibleCount = 0;

      // 1. Filter
      const visibleCards = projectCards.filter(card => {
        const data = getCardData(card);
        const searchTarget = `${data.title} ${data.tech} ${data.desc} ${data.tags} ${data.category}`;
        
        const matchesCategory = currentCategory === 'All' || data.category.includes(currentCategory.toLowerCase()) || data.tags.includes(currentCategory.toLowerCase());
        const matchesSearch = searchTarget.includes(searchQuery.toLowerCase());
        
        return matchesCategory && matchesSearch;
      });

      // 2. Sort
      visibleCards.sort((a, b) => {
        if (currentSort === 'featured') {
          const aFeat = a.dataset.featured === 'true' ? 1 : 0;
          const bFeat = b.dataset.featured === 'true' ? 1 : 0;
          if (aFeat !== bFeat) return bFeat - aFeat;
          return parseInt(a.dataset.index) - parseInt(b.dataset.index);
        } else if (currentSort === 'alphabetical') {
          return (a.dataset.title || '').localeCompare(b.dataset.title || '');
        } else if (currentSort === 'industry') {
          return (a.dataset.industry || '').localeCompare(b.dataset.industry || '');
        }
        // newest (default - original DOM order)
        return parseInt(a.dataset.index) - parseInt(b.dataset.index);
      });

      // 3. Render
      // Hide all first
      projectCards.forEach(card => {
        card.style.display = 'none';
        card.classList.remove('is-visible');
      });

      // Show filtered and sorted
      visibleCards.forEach(card => {
        card.style.display = 'block';
        // Add to DOM in sorted order
        projectsContainer.appendChild(card);
        // Small delay to allow display:block to apply before animating opacity/transform
        requestAnimationFrame(() => {
          card.classList.add('is-visible');
        });
      });

      visibleCount = visibleCards.length;

      // 4. Update UI state
      if (projectCount) {
        projectCount.textContent = `Projects (${visibleCount})`;
      }

      if (visibleCount === 0) {
        emptyState.style.display = 'flex';
        setTimeout(() => emptyState.classList.add('is-visible'), 10);
      } else {
        emptyState.classList.remove('is-visible');
        setTimeout(() => emptyState.style.display = 'none', 300);
      }
      
      // Re-trigger scroll reveals if needed
      if (window.ScrollReveal) {
        window.ScrollReveal().sync();
      }
    };

    if (isViewTransitionSupported) {
      document.startViewTransition(() => updateDOM());
    } else {
      updateDOM(); // Fallback for browsers without View Transitions API
    }
  }

  // Event Listeners
  if (filterButtons) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterButtons.forEach(b => b.classList.remove('active'));
        const target = e.currentTarget;
        target.classList.add('active');
        currentCategory = target.dataset.filter;
        filterAndSortProjects();
      });
    });
  }

  // Debounce search
  let searchTimeout;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchQuery = e.target.value;
        filterAndSortProjects();
      }, 300);
    });
  }

  if (sortDropdown) {
    sortDropdown.addEventListener('change', (e) => {
      currentSort = e.target.value;
      filterAndSortProjects();
    });
  }
  
  // Initial setup classes
  projectCards.forEach(card => card.classList.add('is-visible'));
});
