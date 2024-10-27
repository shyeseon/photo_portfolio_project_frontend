<template>
  <div class="photo-gallery">
    <div class="d-flex flex-wrap mb-5 mt-4">
      <div v-for="category in subCategory" :key="category.id">
        <button @click="selectedCategory(category.id)" class="btn border-0 p-2">
          <h4 class="mb-0">
            {{ category.subName }}
            <span v-if="category.index !== subCategory.length"> / </span>
          </h4>
        </button>
      </div>
    </div>
    <div
      v-if="projects.length === 0 && !isLoading"
      class="position-absolute top-50 start-50 fw-bold fs-5"
    >
      Projects not found
    </div>
    <div class="row row-cols-1 row-cols-md-3 g-4 mt-5">
      <div v-for="project in projects" :key="project.id" class="col">
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
    <InfiniteScroll
      :loading="isLoading"
      :hasMore="hasMore"
      @load-more="loadMoreItems"
    />
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import InfiniteScroll from "@/components/InfiniteScroll.vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const isLoading = ref(false);
const hasMore = ref(true);

const page = ref(0);

const projects = ref([]);
const newImages = ref([]);
const categoryId = ref(null);
const subCategoryId = ref(null);

const subCategory = ref([]);

onMounted(async () => {
  if (categoryId.value != null) {
    await Promise.all([getSubCategory(), loadMoreItems()]);
  }
});

categoryId.value = route.params.categoryId;
const getSubCategory = async () => {
  try {
    const response = await axios.get(`/subCategory/${categoryId.value}`);
    subCategory.value = response.data.map((sub) => ({
      id: sub.id,
      subName: sub.name,
    }));
  } catch (error) {
    console.error("subCategory 로드 실패 " + error);
  }
};

const loadMoreItems = async () => {
  if (isLoading.value || !hasMore.value) return;
  const params = {
    categoryId: categoryId.value,
    subCategoryId: subCategoryId.value,
    page: page.value,
    size: 9,
  };
  isLoading.value = true;
  try {
    const response = await axios.get("/get/project", { params });
    newImages.value = response.data.content.map((item) => ({
      id: item.id,
      imageUrl: item.imageUrl,
      title: item.title,
      categoryName: item.categoryName,
      imageLoaded: false,
    }));
    if (newImages.value.length === 0) {
      hasMore.value = false;
    } else {
      projects.value = [...projects.value, ...newImages.value];
      page.value++;
    }
  } catch (error) {
    console.error("photoList 불러오기 실패", error);
  } finally {
    isLoading.value = false;
  }
};

const selectCategory = ref(null);

const selectedCategory = (categoryName) => {
  selectCategory.value = categoryName;
  if (!categoryName) {
    console.log("none");
  } else {
    subCategoryId.value = selectCategory.value;
    //해결 해야 할 문제 => 카테고리 클릭 시 계속 router push로 계속 보내면 안됨
    router.push({
      name: "photoList",
      params: {
        categoryId: categoryId.value,
        subCategoryId: subCategoryId.value,
      },
    });
    projects.value = [];
    page.value = 0;
    hasMore.value = true;
    loadMoreItems();
  }
};

const onImageLoad = (projectId) => {
  const project = projects.value.find((p) => p.id === projectId);
  if (project) {
    project.imageLoaded = true;
  }
};

watch(route, async (newRoute) => {
  if (newRoute.params.categoryId !== categoryId.value) {
    categoryId.value = newRoute.params.categoryId;
    subCategoryId.value = null;
    projects.value = [];
    page.value = 0;
    hasMore.value = true;
    await Promise.all([getSubCategory(), loadMoreItems()]);
  }
});
</script>
<style scoped>
.skeleton_loading {
  position: absolute;
  width: 100%;
  height: 346px; /* 이미지 높이와 동일하게 설정 */
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
