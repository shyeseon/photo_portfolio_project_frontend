<template>
  <div class="photo-list">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="project in projects" :key="project.id" class="project-item">
        <!-- 프로젝트 내용 -->
      </div>
    </div>
    
    <InfiniteScroll 
      :loading="isLoading" 
      :hasMore="hasMore" 
      @load-more="loadMoreItems"
    >
      <div v-if="isLoading" class="loading-indicator">
        Loading...
      </div>
    </InfiniteScroll>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import InfiniteScroll from "@/components/InfiniteScroll.vue";
import axios from "axios";

const isLoading = ref(false);
const hasMore = ref(true);
const page = ref(0);
const projects = ref([]);

const loadMoreItems = async () => {
  if (isLoading.value || !hasMore.value) {
    console.log('Skipping load: loading =', isLoading.value, 'hasMore =', hasMore.value);
    return;
  }

  console.log('Loading page:', page.value);
  isLoading.value = true;

  try {
    const response = await axios.get("/get/project", {
      params: {
        page: page.value,
        size: 9,
        // categoryId가 있다면 추가
        ...(categoryId.value && { categoryId: categoryId.value })
      },
    });

    console.log('Response:', {
      content: response.data.content.length,
      hasNext: response.data.hasNext,
      number: response.data.number
    });

    // 새 데이터 추가
    projects.value = [...projects.value, ...response.data.content];
    
    // 다음 페이지 있는지 확인
    hasMore.value = response.data.hasNext;
    
    // 페이지 증가
    if (response.data.content.length > 0) {
      page.value++;
    }
  } catch (error) {
    console.error("Data fetch failed:", error);
    hasMore.value = false;
  } finally {
    isLoading.value = false;
  }
};

// 카테고리 변경 감지
const categoryId = ref(null);
watch(categoryId, () => {
  // 카테고리 변경시 초기화
  projects.value = [];
  page.value = 0;
  hasMore.value = true;
  loadMoreItems();
});

onMounted(() => {
  loadMoreItems();
});
</script>

<style scoped>
.photo-list {
  min-height: 100vh;
}

.loading-indicator {
  text-align: center;
  padding: 1rem;
}
</style>