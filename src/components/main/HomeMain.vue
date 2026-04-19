<script>
import linksData from "./../../data/links.json";

export default {
  name: "HomeMain",
  data() {
    return {
      collections: [],
    };
  },
  created() {
    this.extractCollections();
  },
  methods: {
    extractCollections() {
      if (Array.isArray(linksData.links)) {
        this.collections = linksData.links.map((section) => {
          return {
            name: section.collection,
            count: section.data.length,
          };
        });
      }
    },
  },
};
</script>

<template>
  <div class="container py-5">
    <div class="row justify-content-center align-items-center mb-5">
      <div class="col-12 col-lg-6 mb-4 mb-lg-0">
        <p class="display-3 fw-bold text-lg-start hero-title">
          Turn coding into a daily working tool
        </p>

        <p class="display-6 text-lg-start hero-subtitle">
          Tools, tutorials and resources to use code in real projects
        </p>

        <p class="hero-text">
          <span class="fw-bold">fromScratch</span> is a curated archive of practical
          resources that helps you turn coding into a concrete working tool.
        </p>

        <p class="hero-text">
          It focuses on real-world use: automation, data handling, and building
          efficient workflows that you can apply directly in your daily tasks.
        </p>

        <p class="hero-text">
          Start from setup, explore tools, and gradually build a workflow that fits
          your needs.
        </p>
      </div>

      <div class="col-12 col-lg-6 d-flex flex-wrap justify-content-center gap-3">
        <router-link class="collection-card text-center text-decoration-none p-3" v-for="(item, index) in collections"
          :key="index" :to="{ path: '/links', query: { collection: item.name } }">
          <h6 class="fw-bold mb-1">{{ item.name }}</h6>
          <small class="items_links">{{ item.count }} links</small>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>


.collection-card {
  min-width: 140px;
  border-radius: 16px;
  background: #f3f4f6;
  color: #111827;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.collection-card:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
  transform: translateY(-3px);
}

.items_links {
  color: #6b7280;
}
</style>