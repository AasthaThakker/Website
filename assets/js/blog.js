// Blog management module
const BlogManager = {
  elements: {
    postsList: null,
    postView: null,
    categoryContainer: null,
    searchInput: null,
    blogContentContainer: null,
    searchContainer: null
  },

  state: {
    activeCategory: 'All',
    searchTerm: ''
  },

  init() {
    this.elements.postsList = document.getElementById('postsList');
    this.elements.postView = document.getElementById('postView');
    this.elements.categoryContainer = document.getElementById('category-container');
    this.elements.searchInput = document.getElementById('searchInput');
    this.elements.blogContentContainer = document.getElementById('blog-content-container');
    this.elements.searchContainer = document.getElementById('search-container');

    this.renderCategories();
    this.renderPosts();
    this.bindEvents();
  },

  bindEvents() {
    this.elements.searchInput.addEventListener('input', (e) => {
      this.state.searchTerm = e.target.value;
      this.renderPosts();
    });

    this.elements.postsList.addEventListener('click', (e) => {
      const card = e.target.closest('.post-card');
      if (card) {
        this.openPost(card.dataset.id);
      }
    });
  },

  renderCategories() {
    this.elements.categoryContainer.innerHTML = CATEGORIES.map(cat => `
      <button class="py-2 px-4 rounded-full border text-sm font-medium transition-colors ${cat === this.state.activeCategory ? 'bg-primary-color text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}" data-category="${cat}">
        ${cat}
      </button>
    `).join('');

    this.elements.categoryContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (btn) {
        this.state.activeCategory = btn.dataset.category;
        this.renderCategories();
        this.renderPosts();
      }
    });
  },

  renderPosts() {
    this.elements.postView.classList.add('hidden');
    this.elements.postsList.classList.remove('hidden');
    this.elements.searchContainer.classList.remove('hidden');
    
    // Remove solid color class
    this.elements.blogContentContainer.classList.remove('blog-card', 'p-8');
    
    let filteredPosts = postsData;

    if (this.state.activeCategory !== 'All') {
      filteredPosts = filteredPosts.filter(p => p.category === this.state.activeCategory);
    }

    if (this.state.searchTerm) {
      const query = this.state.searchTerm.toLowerCase();
      filteredPosts = filteredPosts.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.excerpt.toLowerCase().includes(query) ||
        p.content.toLowerCase().includes(query)
      );
    }

    if (filteredPosts.length === 0) {
      this.elements.postsList.innerHTML = `<p class="text-center col-span-full py-8">No posts found.</p>`;
      return;
    }

    this.elements.postsList.innerHTML = filteredPosts.map(post => `
      <div class="card blog-card-fixed post-card rounded-xl shadow-lg hover-effect cursor-pointer" data-id="${post.id}">
        <img src="${post.cover}" alt="${post.title} cover" class="blog-card-image rounded-t-lg">
        <div class="blog-card-content">
          <h3 class="blog-card-title">${post.title}</h3>
          <p class="blog-card-meta text-gray-500 dark:text-gray-400">${new Date(post.date).toLocaleDateString()} • ${post.category}</p>
          <p class="blog-card-excerpt">${post.excerpt}</p>
        </div>
      </div>
    `).join('');
  },

  openPost(id) {
    const post = postsData.find(p => p.id === id);
    if (!post) {
      this.showStatusMessage('Post not found.', 'bg-red-500');
      return;
    }

    this.elements.postsList.classList.add('hidden');
    this.elements.postView.classList.remove('hidden');
    this.elements.searchContainer.classList.add('hidden');
    
    // Add solid color class
    this.elements.blogContentContainer.classList.add('blog-card', 'p-8', 'rounded-2xl', 'shadow-lg');

    this.elements.postView.innerHTML = `
      <div>
        <button onclick="BlogManager.closePost()" class="py-2 px-4 rounded-full border mb-6 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700">← Back to Blogs</button>
        <h1 class="text-3xl md:text-4xl font-bold mb-2">${post.title}</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">${new Date(post.date).toLocaleDateString()} • ${post.category}</p>
        <div class="prose max-w-none text-gray-700 dark:text-gray-300">
          ${post.content}
        </div>
      </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  closePost() {
    this.renderPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  showLatestPost() {
    const latestPost = postsData.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    NavigationManager.showSection('blogs');
    setTimeout(() => this.openPost(latestPost.id), 100);
  },

  showStatusMessage(message, colorClass) {
    let statusMessage = document.getElementById('statusMessage');
    if (!statusMessage) {
      statusMessage = document.createElement('div');
      statusMessage.id = 'statusMessage';
      statusMessage.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 py-3 px-6 rounded-lg text-white font-semibold shadow-lg transition-transform duration-300 transform-gpu z-[100]';
      document.body.appendChild(statusMessage);
    }
    statusMessage.textContent = message;
    statusMessage.className = `fixed bottom-4 left-1/2 -translate-x-1/2 py-3 px-6 rounded-lg text-white font-semibold shadow-lg transition-transform duration-300 transform-gpu z-[100] ${colorClass}`;
    statusMessage.style.transform = 'translate(-50%, 0)';
    setTimeout(() => {
      statusMessage.style.transform = 'translate(-50%, 100px)';
    }, 3000);
  }
};