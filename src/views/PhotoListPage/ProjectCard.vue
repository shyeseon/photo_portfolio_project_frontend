<template>
    <div class="row row-cols-1 row-cols-md-3 g-4 mt-5">
      <div v-for="project in projects" :key="project.id" class="col">
        <RouterLink :to="{ name: 'DetailList', params: { projectId: project.id } }" class="card h-100 border-0 text-decoration-none">
          <div class="skeleton_loading" v-if="!project.imageLoaded  ">
            <div class="skeleton_img w-100 h-100"></div>
          </div>
          <img :src="project.imageUrl" class="card-img-top object-fit-cover" :alt="project.title"  height="346px" 
           @load="onImageLoad(project.id)"/>

          <div class="card-body ps-0">
            <h5 class="card-title fw-bolder">{{ project.title }}</h5>
            <small class="text-muted font-lighter">{{ project.categoryName }}</small>
          </div>
        </RouterLink>
      </div>
    </div>
    <InfiniteScroll :loading="isLoading" :hasMore="hasMore" @load-more="loadMoreItems" />
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import InfiniteScroll from '@/components/InfiniteScroll.vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute();
const isLoading = ref(false);
const hasMore = ref(true);

const projects = ref([]);
const newImages= ref([]); //새롭게 load된 프로젝트 
const page=ref(0);
const categoryId = ref(0);
const subCategoryId = ref(0);

onMounted(()=>{
    loadMoreItems();
})

const loadMoreItems = async () => {
    categoryId.value = route.params.categoryId;
    subCategoryId.value=route.params.subCategoryId;
  console.log("실행")

  if (isLoading.value || !hasMore.value) return;
  const params = {
      categoryId:categoryId.value,
      subCategoryId: subCategoryId.value,
      page: page.value,
      size: 6
    };
  isLoading.value = true;
  try {
    const response = await axios.get('/get/project', {params});
    newImages.value = response.data.map(item => ({
      id: item.id,
      imageUrl: item.imageUrl,
      title: item.title,
      categoryName: item.categoryName,
      imageLoaded:false
    }));
    if (newImages.value.length === 0) {
      hasMore.value = false;
    }else{
      //현재 api로 값을 받아오자 마자 배열에 추가해 주고 잇음 -> 이미지가 순차적으로 로드되어 초기 로딩 시간은 짧으나 부드럽지 못한 이미지 출력
      //이미지를 모두 받아온 후에 배열에 추가해 주면 상대적으로 스크롤할 때 이미지가 부드럽게 출력됨 그러나 초기 로딩이 길어진다는 단점이 있음
      projects.value = [...projects.value, ...newImages.value];
    page.value++;
    }
    
  } catch (error) {
    console.error('photoList 불러오기 실패', error);
  } finally {
    isLoading.value = false;
  }
};
const onImageLoad = (projectId) => {
  const project = projects.value.find(p => p.id === projectId);
  if (project) {
    project.imageLoaded = true;
  }
};

watch(route, (newRoute)=>{
    categoryId.value=newRoute.params.categoryId;
    subCategoryId.value=null;
    projects.value = [];
    page.value = 0;
    hasMore.value = true;
    loadMoreItems();
  
})
</script>