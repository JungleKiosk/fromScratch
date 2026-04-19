<script>
import linksData from "../../data/links.json";
import { useRoute } from "vue-router";

export default {
  name: "LinksMain",
  data() {
    return {
      searchQuery: "",
      collections: linksData.links,
      filteredCollections: [],
      selectedTag: "",
      filterDownloadOnly: false,
      studyPathOnly: false,
      searchTimeout: null,
      selectedCollection: "",
    };
  },
  created() {
    this.applyFilters();
  },
  setup() {
    const route = useRoute();
    return { route };
  },
  mounted() {
    const collectionName = this.$route.query.collection;
    if (collectionName) {
      this.selectedCollection = collectionName;
      this.applyFilters();
    }
  },
  computed: {
    allTags() {
      const tags = new Set();

      this.collections.forEach((col) => {
        col.data.forEach((item) => {
          item.tags?.forEach((tag) => tags.add(tag.trim()));
        });
      });

      return Array.from(tags).sort();
    },
  },
  methods: {
    onSearchInput() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.applyFilters();
      }, 400);
    },
    filterByTag(tag) {
      this.selectedTag = this.selectedTag === tag ? "" : tag;
      this.applyFilters();
    },
    normalizeOrderValue(order) {
      if (
        order === undefined ||
        order === null ||
        order === "" ||
        order === "any"
      ) {
        return null;
      }
      return Number(order);
    },
    applyFilters() {
      const q = this.searchQuery.toLowerCase().trim();

      this.filteredCollections = this.collections
        .filter((col) => {
          return !this.selectedCollection || col.name === this.selectedCollection;
        })
        .map((col) => {
          const filteredData = col.data
            .filter((item) => {
              const matchesTitle = item.title?.toLowerCase().includes(q);
              const matchesDescription = item.description?.toLowerCase().includes(q);
              const matchesUrl = item.url?.toLowerCase().includes(q);
              const matchesVideo = item.video?.toLowerCase().includes(q);
              const matchesTags = item.tags?.some((tag) =>
                tag.toLowerCase().includes(q)
              );

              const matchesSearch =
                !q ||
                matchesTitle ||
                matchesDescription ||
                matchesUrl ||
                matchesVideo ||
                matchesTags;

              const matchesTag =
                !this.selectedTag || item.tags?.includes(this.selectedTag);

              const matchesDownload =
                !this.filterDownloadOnly || item.download === 1;

              const normalizedOrder = this.normalizeOrderValue(item.order);

              const matchesStudyPath =
                !this.studyPathOnly || normalizedOrder !== null;

              return (
                matchesSearch &&
                matchesTag &&
                matchesDownload &&
                matchesStudyPath
              );
            })
            .sort((a, b) => {
              const orderA = this.normalizeOrderValue(a.order);
              const orderB = this.normalizeOrderValue(b.order);

              if (orderA === null && orderB === null) return 0;
              if (orderA === null) return 1;
              if (orderB === null) return -1;

              return orderA - orderB;
            });

          return { ...col, data: filteredData };
        })
        .filter((col) => col.data.length > 0);
    },
    resetAllFilters() {
      this.searchQuery = "";
      this.selectedTag = "";
      this.filterDownloadOnly = false;
      this.studyPathOnly = false;
      this.selectedCollection = "";
      this.$router.replace({ path: "/links" });
      this.applyFilters();
    },
    toggleCollectionFilter(collectionName) {
      if (this.selectedCollection === collectionName) {
        this.selectedCollection = "";
      } else {
        this.selectedCollection = collectionName;
      }
      this.applyFilters();
    },
  },
};
</script>

<template>
  <div class="container">
    <div class="container_filters_links">
      <div class="col-12 col-lg-10">
        <div class="flex-grow-1 d-flex">
          <input
            v-model="searchQuery"
            @input="onSearchInput"
            type="text"
            class="form-control me-2"
            placeholder="Search..."
          />
          <button
            class="btn_all rounded-3 border-0 p-2 mx-2"
            @click="resetAllFilters"
          >
            All
          </button>
        </div>

        <div class="row mt-3">
          <div class="col-12 col-lg-4">
            <div class="form-check">
              <input
                type="checkbox"
                id="download-only"
                v-model="filterDownloadOnly"
                @change="applyFilters"
                class="form-check-input me-2"
              />
              <label for="download-only" class="form-check-label">
                Show Downloadable Only
              </label>
            </div>
          </div>

          <div class="col-12 col-lg-4 mt-2 mt-lg-0">
            <div class="form-check">
              <input
                type="checkbox"
                id="study-path-only"
                v-model="studyPathOnly"
                @change="applyFilters"
                class="form-check-input me-2"
              />
              <label for="study-path-only" class="form-check-label">
                Show Study Path Only
              </label>
            </div>
          </div>
        </div>

        <div class="row mt-3">
          <div class="col-12 mx-1">
            <span class="me-2">Collections:</span>
            <span
              v-for="col in collections"
              :key="col.name"
              class="badge text-dark me-1 mb-1 collections"
              :class="{ active: selectedCollection === col.name }"
              style="cursor: pointer"
              @click="toggleCollectionFilter(col.name)"
            >
              {{ col.name }}
            </span>
          </div>
        </div>

        <div class="row mt-3">
          <div class="col-12 mx-1">
            <span class="me-2">Tags:</span>
            <span
              v-for="tag in allTags"
              :key="tag"
              class="badge text-dark me-1 mb-1 tags_filter"
              :class="{ active: selectedTag === tag }"
              style="cursor: pointer"
              @click="filterByTag(tag)"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-5">
      <div v-for="col in filteredCollections" :key="col.name" class="mb-5">
        <h3 class="mb-3">{{ col.name }}</h3>

        <div class="row g-4">
          <div
            v-for="item in col.data"
            :key="item.id"
            class="col-12 col-md-6 col-lg-4"
          >
            <div class="card card_color h-100 shadow-sm">
              <div class="card-body d-flex flex-column">
                <div class="row align-items-center">
                  <div class="col-8">
                    <small>{{ col.name }}</small>
                  </div>
                  <div class="col-4 text-end">
                    <span
                      v-if="item.order !== undefined && item.order !== null && item.order !== '' && item.order !== 'any'"
                      class="step-badge"
                    >
                      Order: {{ item.order }}
                    </span>
                  </div>
                </div>

                <hr />

                <div class="d-flex align-items-center mb-2">
                  <h5 class="card-title text-info mb-0">
                    {{ item.title }}
                  </h5>
                </div>

                <p class="card-text flex-grow-1 mt-2">
                  {{ item.description }}
                </p>

                <div v-if="item.download === 1" class="fw-bold mb-2">
                  Download: {{ item.download_mode }}
                </div>

                <div class="mb-3">
                  <span
                    v-for="tag in item.tags"
                    :key="tag"
                    class="badge bg-info text-dark me-1"
                  >
                    {{ tag }}
                  </span>
                </div>

                <div class="d-flex flex-wrap gap-2 mt-auto">
                  <a
                    v-if="item.url"
                    :href="item.url"
                    target="_blank"
                    rel="noopener"
                    class="btn btn_fr"
                  >
                    Guide
                  </a>

                  <a
                    v-if="item.video"
                    :href="item.video"
                    target="_blank"
                    rel="noopener"
                    class="btn btn_video"
                  >
                    Video
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredCollections.length === 0" class="col-12 text-center">
        <p>No results found.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn_video {
  background: #dc2626;
  color: white;
  border: none;
}

.btn_video:hover {
  background: #b91c1c;
  color: white;
}

.btn_fr {
  background: #2563eb;
  color: white;
  border: none;
}

.btn_fr:hover {
  background: #1d4ed8;
  color: white;
}

.tags_filter {
  background: #e5e7eb;
}

.tags_filter:hover {
  background: #d1d5db;
}

.tags_filter.active {
  background: #0ea5e9;
  color: white !important;
}

.collections {
  background: #f3f4f6;
}

.collections.active {
  background: #111827;
  color: white !important;
}

.step-badge {
  color: rgb(0, 0, 0);
  font-weight: bold;
}

.card {
  border-radius: 14px;
}
</style>