class ProductList extends HTMLElement {
  async connectedCallback() {
    this.initVariables();

    try {
      const products = await this.loadProducts();
      this.render(products);
    } catch (error) {
      console.error('Could not load products:', error);
      this.innerHTML = '<p class="mt-6 text-center text-(--color-muted)">Sorry, products could not be loaded. Please try again later.</p>';
    }
  }

  initVariables() {
    this.apiUrl = 'https://api.npoint.io/34e31e1ba446f2e67982';
    this.fallbackUrl = 'products.json';
    this.mobileVisibleCount = 4;
  }

  // Falls back to products.json if the API fails
  async loadProducts() {
    try {
      return await this.fetchProducts(this.apiUrl);
    } catch (error) {
      console.warn('Mock API unavailable, using products.json instead:', error);
      return await this.fetchProducts(this.fallbackUrl);
    }
  }

  async fetchProducts(url) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Request to ${url} failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.products;
  }

  render(products) {
    let productCards = '';

    products.forEach((product, index) => {
      let saleBadge = '';

      if (product.compareAtPrice > product.price) {
        const discount = Math.round((product.compareAtPrice - product.price) / product.compareAtPrice * 100);
        saleBadge = `<span class="badge badge-sale">Save ${discount}%</span>`;
      }

      const hiddenOnMobile = index >= this.mobileVisibleCount ? 'max-md:invisible' : '';

      let productCard = `
        <li class="md:w-(--card-width) md:shrink-0 ${hiddenOnMobile}">
          <product-card class="block pb-2 md:pb-4">
            <a href="#" tabindex="-1" class="group relative block aspect-[158/159] overflow-hidden md:aspect-square rounded-(--card-radius) bg-gray-100">
              <span class="absolute inset-0 flex items-center justify-center text-(--color-star-empty)" aria-hidden="true">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
              </span>
              <img src="${this.imageUrl(product.image)}" alt="${product.alt}" loading="lazy" class="product-image group-hover:opacity-0">
              <img src="${this.imageUrl(product.hoverImage)}" alt="" loading="lazy" class="product-image opacity-0 group-hover:opacity-100">
              <span class="badge">Best Seller</span>
              ${saleBadge}
            </a>

            <div class="mt-3 flex flex-col gap-2 px-2 md:mt-4 md:px-3">
              <h3 class="product-title">
                <a href="#" class="hover:underline">${product.name}</a>
              </h3>
              <p class="product-reviews flex items-center gap-1 whitespace-nowrap">
                <span class="flex gap-0.5" aria-hidden="true">${this.renderStars(product.rating)}</span>
                <span class="sr-only">Rated ${product.rating} out of 5,</span>
                ${product.reviews.toLocaleString('en-US')} Reviews
              </p>
              <p class="font-medium">$${product.price.toFixed(2)}</p>
            </div>
          </product-card>
        </li>
      `;

      productCards += productCard;
    });

    this.innerHTML = `
      <ul class="relative mt-6 grid grid-cols-2 gap-x-[11px] gap-y-3 overflow-hidden transition-[max-height] duration-500 ease-in-out max-md:max-h-(--grid-height) md:mt-9 md:flex md:gap-6 md:overflow-x-auto">
        ${productCards}
      </ul>
      <button type="button" class="button mt-3 w-full cursor-pointer px-6 py-4 md:hidden">Show More</button>
    `;

    this.setupImageFallback();
    this.setupShowMore();
  }

  // Removes broken photos so the placeholder or the other photo shows
  setupImageFallback() {
    this.querySelectorAll('.product-image').forEach((image) => {
      image.addEventListener('error', () => {
        const imageBox = image.parentElement;
        image.remove();

        const remainingImage = imageBox.querySelector('.product-image');
        if (remainingImage) {
          remainingImage.className = 'product-image';
        }
      });
    });
  }

  // Mobile only
  setupShowMore() {
    const grid = this.querySelector('ul');
    const button = this.querySelector('button');
    const cards = [...grid.children];
    const hiddenCards = cards.slice(this.mobileVisibleCount);

    if (hiddenCards.length === 0) {
      button.remove();
      return;
    }

    const lastVisibleCard = cards[this.mobileVisibleCount - 1];
    const collapse = () => {
      grid.style.setProperty('--grid-height', `${lastVisibleCard.offsetTop + lastVisibleCard.offsetHeight}px`);
    };

    // Re-measure whenever the layout changes (styles loading, screen rotation, resizing)
    const resizeObserver = new ResizeObserver(collapse);
    resizeObserver.observe(grid);

    button.addEventListener('click', () => {
      resizeObserver.disconnect();
      hiddenCards.forEach((card) => card.classList.remove('max-md:invisible'));
      grid.style.setProperty('--grid-height', `${grid.scrollHeight}px`);
      grid.addEventListener('transitionend', () => grid.style.setProperty('--grid-height', 'none'), { once: true });
      button.hidden = true;
    });
  }

  imageUrl(photoId) {
    return `https://images.unsplash.com/photo-${photoId}?w=710&h=710&fit=crop&q=80&auto=format`;
  }

  renderStars(rating) {
    const star = (colorClass) => `<svg class="block ${colorClass}" width="11" height="10" viewBox="0 0 11 10"><path d="M5.53568 0.0730128C5.33151 -0.0243376 5.0943 -0.0243376 4.89012 0.0730128C4.71361 0.15717 4.6163 0.303289 4.56722 0.38345C4.51648 0.466319 4.4644 0.571883 4.41364 0.674777L3.33577 2.85842L0.924746 3.21082C0.81125 3.22739 0.694796 3.24439 0.600339 3.2671C0.508958 3.28908 0.340003 3.3366 0.205548 3.47852C0.0500022 3.6427 -0.0231489 3.86831 0.0064613 4.09253C0.0320567 4.28635 0.140979 4.42397 0.202079 4.49538C0.265238 4.5692 0.349563 4.6513 0.431745 4.73132L2.17564 6.42987L1.76416 8.82901C1.74473 8.94213 1.72481 9.05818 1.71714 9.15506C1.70972 9.24877 1.70254 9.42422 1.79589 9.59608C1.90387 9.79487 2.09581 9.93431 2.31824 9.97554C2.51055 10.0112 2.67519 9.95013 2.76201 9.91411C2.85178 9.87686 2.95599 9.82203 3.05757 9.76858L5.2129 8.63511L7.36824 9.76859C7.46982 9.82203 7.57403 9.87686 7.6638 9.91411C7.75062 9.95013 7.91526 10.0112 8.10756 9.97554C8.33 9.93431 8.52194 9.79487 8.62991 9.59608C8.72326 9.42422 8.71609 9.24877 8.70867 9.15506C8.701 9.05818 8.68107 8.94214 8.66165 8.82903L8.25016 6.42987L9.99408 4.7313C10.0763 4.65129 10.1606 4.5692 10.2237 4.49538C10.2848 4.42397 10.3937 4.28635 10.4193 4.09253C10.449 3.86831 10.3758 3.6427 10.2203 3.47852C10.0858 3.3366 9.91685 3.28908 9.82547 3.2671C9.73101 3.24439 9.61455 3.22739 9.50106 3.21082L7.09003 2.85842L6.01219 0.674815C5.96142 0.571914 5.90933 0.466325 5.85859 0.38345C5.80951 0.303289 5.71219 0.15717 5.53568 0.0730128Z"/></svg>`;
    const fullStar = star('fill-(--color-ink)');
    const emptyStar = star('fill-(--color-star-empty)');
    // Half star = empty star with a full star on top, cropped to its left half
    const halfStar = `
      <span class="relative block">
        ${emptyStar}
        <span class="absolute inset-0 w-1/2 overflow-hidden">${fullStar}</span>
      </span>
    `;

    let stars = '';

    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars += fullStar;
      } else if (rating >= i - 0.5) {
        stars += halfStar;
      } else {
        stars += emptyStar;
      }
    }

    return stars;
  }
}

customElements.define('product-list', ProductList);
