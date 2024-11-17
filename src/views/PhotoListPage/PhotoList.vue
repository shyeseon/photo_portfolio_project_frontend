<template>
  <div class="photo-gallery">
    <div class="d-flex flex-wrap mb-4 mt-4">
      <div v-for="category in subCategory" :key="category.id">
        <button @click="selectedCategory(category.id)" class="btn border-0 p-2 d-flex" >
          <h4 class="category-name mb-0 me-1" :class="{ 'selected-category': category.id === selectCategory }">
            {{ category.subName }}
            </h4>
            <h4 v-if="category.index !== subCategory.length"> / </h4>
          
        </button>
      </div>
    </div>
    <div
      v-if="projects.length === 0 && !isLoading"
      class="position-absolute top-50 start-50 fw-bold fs-5"
    >
      Projects not found
    </div>
    <div class="row row-cols-1 row-cols-md-3 g-4 mt-5 mb-5">
      <div v-for="project in projects" :key="project.id" class="col m-0">
        <RouterLink
          :to="{ name: 'DetailList', params: { projectId: project.id } }"
          class="card h-100 border-0 text-decoration-none"
        >
          <div class="skeleton_loading" v-if="!project.imageLoaded">
            <div class="skeleton_img w-100 h-100"></div>
          </div>
          <img
            :src="project.imageUrl"
            class="card-img-top object-fit-cover"
            :alt="project.title"
            height="346px"
            @load="onImageLoad(project.id)"
          />

          <div class="card-body ps-0">
            <h5 class="card-title fw-bolder">{{ project.title }}</h5>
            <small class="text-muted font-lighter">{{
              project.categoryName
            }}</small>
          </div>
        </RouterLink>
      </div>
    </div>
    <div v-if="isLoading &&page>0" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <InfiniteScroll
      :loading="isLoading"
      :hasMore="hasMore"
      @load-more="loadMoreItems"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import InfiniteScroll from "@/components/InfiniteScroll.vue";
import axios from "axios";

const isLoading = ref(false);
const hasMore = ref(true);
const page = ref(0);
const projects = ref([]);

// 이미지 핸들링 함수
const onImageLoaded = (event) => {
  // 이미지 로드 성공 처리
  event.target.classList.add('loaded');
};

const onImageError = (event) => {
  // 이미지 로드 실패시 대체 이미지로 교체
  event.target.src = '/placeholder-image.jpg';
};

const loadMoreItems = async () => {
  if (isLoading.value || !hasMore.value) {
    console.log('Skip loading:', { isLoading: isLoading.value, hasMore: hasMore.value });
    return;
  }

  console.log('Starting to load page:', page.value);
  isLoading.value = true;

  try {
    const response = await axios.get("/get/project", {
      params: {
        page: page.value,
        size: 9
      }
    });

    console.log('Full API Response:', response.data);
    
    if (response.data && Array.isArray(response.data.content)) {
      // 데이터 처리 전에 유효성 검사
      const validProjects = response.data.content.map(project => ({
        ...project,
        imageUrl: project.imageUrl || '/placeholder-image.jpg' // 이미지 URL이 없는 경우 대체 이미지 사용
      }));

      // 새 데이터 추가
      projects.value = [...projects.value, ...validProjects];
      
      // 다음 페이지 존재 여부 확인
      hasMore.value = response.data.hasNext;
      
      if (response.data.content.length > 0) {
        page.value++;
      }

      console.log('Updated state:', {
        projectsCount: projects.value.length,
        currentPage: page.value,
        hasMore: hasMore.value
      });
    }
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    hasMore.value = false;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadMoreItems();
});
</script>
<style scoped>
.selected-category{
  text-decoration: underline;
  text-underline-offset: 8px;
}
.category-name:hover {
  color: gray;
}
.skeleton_loading {
  position: absolute;
  width: 100%;
  height: 346px;
  background: var(--bg-color);
}

.skeleton_img {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    #e5e5e5 30%,
    #f0f0f0 38%,
    #f0f0f0 40%,
    #e5e5e5 48%
  );
  background-size: 200% 100%;
  background-position: 100% 0;
  animation: load 1s infinite;
}
.card {
  position: relative;
  overflow: hidden;
}

.card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0); /* 초기 상태 - 투명 */
  transition: background-color 0.3s ease; /* 부드러운 전환 효과 */
  z-index: 2; /* 오버레이 요소에 높은 z-index 설정 */
}

.card:hover::before {
  background-color: rgba(0, 0, 0, 0.2); /* hover 시 약 20% 어두운 오버레이 */
}

.card .card-img-top {
  position: relative;
  z-index: 1; /* 이미지에 낮은 z-index 설정 */
}


</style>
