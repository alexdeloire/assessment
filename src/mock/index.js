import { createServer } from 'miragejs';

import data from './data.json';

createServer({
  routes() {
    this.namespace = 'api';

    // Route to get all categories
    this.get('/categories', () => {
      // Extract unique categories from all posts
      const allCategories = data.posts.reduce((categories, post) => {
        return categories.concat(post.categories);
      }, []);

      // Deduplicate categories based on their names
      const uniqueCategories = [];
      for (let i = 0; i < allCategories.length; i++) {
        const category = allCategories[i];
        if (uniqueCategories.find(c => c.name === category.name) === undefined) {
          uniqueCategories.push(category);
        }
      }

      return uniqueCategories;
    });

    // Get posts route handles pagination and category filtering
    this.get('/posts', (schema, request) => {
      const { searchOptions = [], page = 1, pageSize = 10 } = request.queryParams;

      // Filter posts that have at least one matching category
      const filteredPosts = data.posts.filter(post =>
        searchOptions.length === 0 || post.categories.some(category => searchOptions.includes(category.name))
      );

      const startIndex = page * pageSize;
      const endIndex = startIndex + parseInt(pageSize);

      const paginatedData = filteredPosts.slice(startIndex, endIndex);
      const totalPages = Math.ceil(filteredPosts.length / pageSize);

      return {
        items: paginatedData,
        total: filteredPosts.length,
        totalPages,
      };
    });

  },
});
