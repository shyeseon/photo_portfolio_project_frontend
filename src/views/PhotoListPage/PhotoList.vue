<template>
  <div class="photo-gallery">
    <div class="d-flex flex-wrap  mb-5 mt-4">
      <div v-for="category in subCategory" :key="category.id">
        <button @click="selectedCategory(category.id)" class="btn border-0 p-2">
          <h4 class="mb-0">{{ category.subName }}
          <span v-if="category.index !== subCategory.length"> / </span>
          </h4>
        </button>
      </div>
    </div>
    <ProjectCard/>
  </div>
</template>

<script setup>
import axios from "axios";
import {  onMounted, ref, watch } from "vue";

import { useRoute, useRouter } from "vue-router";
import ProjectCard from "./ProjectCard.vue";
const route = useRoute();
const router = useRouter();

const hasMore = ref(true); //더 가져올 프로젝트가 있는지
const page = ref(0); 
const projects = ref([]);
const categoryId = ref(0);
const subCategoryId =ref(0);

const subCategory = ref([])
const selectCategory= ref(null);

onMounted(()=>{
  if(categoryId.value!=null){
  getSubCategory();
}
})

categoryId.value= route.params.categoryId;
const getSubCategory = async() =>{
  try{
    const response = await axios.get(`/subCategory/${categoryId.value}`);
    subCategory.value=response.data.map( sub =>({
      id:sub.id,
      subName:sub.name
    }));
  }catch (error){
    console.error("subCategory 로드 실패 "+error);
  }
}


const selectedCategory = (categoryName) => {
  selectCategory.value = categoryName;
  if (!categoryName) {
    console.log("none")
  } else {
    subCategoryId.value = selectCategory.value;
    //해결 해야 할 문제 => 카테고리 클릭 시 계속 router push로 계속 보내면 안됨
    router.push({ name: 'photoList', params: { categoryId: categoryId.value, subCategoryId:subCategoryId.value } })
    projects.value = [];
    page.value = 0;
    hasMore.value = true;
  }
};

watch(route, (newRoute)=>{
    categoryId.value=newRoute.params.categoryId;
    getSubCategory();

  
})


</script>
<style scoped>
.skeleton_loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 346px;
  background: #f0f0f0;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
 
</style>