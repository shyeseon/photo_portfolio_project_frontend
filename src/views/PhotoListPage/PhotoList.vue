<template>
  <div class="photo-gallery">
    <div class="d-flex flex-wrap  mb-5 mt-4">
  <div v-for="category in subCategory" :key="category.index">
    <button @click="selectedCategory(category.cName)" class="btn border-0 p-2">
      <h4 class="mb-0">{{ category.cName }}
      <span v-if="category.index !== subCategory.length"> / </span>
      </h4>
    </button>
  </div>
</div>
    <div class="row row-cols-1 row-cols-md-3 g-4 mt-5">
      <div v-for="photo in displayedImages" :key="photo.id" class="col">
        <RouterLink :to="{name:'DetailList', params:{id:photo.id}}" class="card h-100 border-0 text-decoration-none">
          <div class="skeleton_loading" v-if="isLoading && !allLoaded">
            <div class="skeleton_img w-100 h-100"></div>
          </div>
          <img :src="photo.src" class="card-img-top" :alt="photo.title" />

          <div class="card-body ps-0">
            <h5 class="card-title fw-bolder">{{ photo.title }}</h5>
            <small class="text-muted font-lighter">{{ photo.category }}</small>
          </div>
        </RouterLink>
      </div>
      <div ref="observerTarget"></div>
    </div>
  </div>
</template>

<script setup>
import {  ref } from "vue";
import InfiniteScroll from "@/components/InfiniteScroll.vue";
//dummy data
const photos = ref([
  {
    id: 1,
    title: "Liquid IV",
    category: "Lifestyle",
    src: "https://www.davehillphoto.com/images/pics/1536/18865_zYcW4F_20240416_hill_liquid_iv_sbc_beach_volleyball_16968.jpg",
  },
  {
    id: 2,
    title: "Ora Cat",
    category: "Automotive",
    src: "https://www.davehillphoto.com/images/pics/1536/17197_SMt7mI_220122_dh_jvm_oracat_m96_oldcity_08_0266jpeg.jpg",
  },
  {
    id: 3,
    title: "Toyota Corolla Cross",
    category: "Automotive",
    src: "https://www.davehillphoto.com/images/pics/1536/17145_BOBsQQ_corolla_cross_890b_08732_0031_santee_court_rear_3_4_lifestyle_004846.jpg",
  },
  {
    id: 1,
    title: "Liquid IV",
    category: "Lifestyle",
    src: "https://www.davehillphoto.com/images/pics/1536/18865_zYcW4F_20240416_hill_liquid_iv_sbc_beach_volleyball_16968.jpg",
  },
  {
    id: 2,
    title: "Ora Cat",
    category: "Automotive",
    src: "https://www.davehillphoto.com/images/pics/1536/17197_SMt7mI_220122_dh_jvm_oracat_m96_oldcity_08_0266jpeg.jpg",
  },
  {
    id: 3,
    title: "Toyota Corolla Cross",
    category: "Automotive",
    src: "https://www.davehillphoto.com/images/pics/1536/17145_BOBsQQ_corolla_cross_890b_08732_0031_santee_court_rear_3_4_lifestyle_004846.jpg",
  },
  {
    id: 1,
    title: "Liquid IV",
    category: "Lifestyle",
    src: "https://www.davehillphoto.com/images/pics/1536/18865_zYcW4F_20240416_hill_liquid_iv_sbc_beach_volleyball_16968.jpg",
  },
  {
    id: 2,
    title: "Ora Cat",
    category: "Automotive",
    src: "https://www.davehillphoto.com/images/pics/1536/17197_SMt7mI_220122_dh_jvm_oracat_m96_oldcity_08_0266jpeg.jpg",
  },
  {
    id: 3,
    title: "Toyota Corolla Cross",
    category: "Automotive",
    src: "https://www.davehillphoto.com/images/pics/1536/17145_BOBsQQ_corolla_cross_890b_08732_0031_santee_court_rear_3_4_lifestyle_004846.jpg",
  },
  {
    id: 1,
    title: "Liquid IV",
    category: "Lifestyle",
    src: "https://www.davehillphoto.com/images/pics/1536/18865_zYcW4F_20240416_hill_liquid_iv_sbc_beach_volleyball_16968.jpg",
  },
  {
    id: 2,
    title: "Ora Cat",
    category: "Automotive",
    src: "https://www.davehillphoto.com/images/pics/1536/17197_SMt7mI_220122_dh_jvm_oracat_m96_oldcity_08_0266jpeg.jpg",
  },
  {
    id: 3,
    title: "Toyota Corolla Cross",
    category: "Automotive",
    src: "https://www.davehillphoto.com/images/pics/1536/17145_BOBsQQ_corolla_cross_890b_08732_0031_santee_court_rear_3_4_lifestyle_004846.jpg",
  },
  {
    id: 1,
    title: "Liquid IV",
    category: "Lifestyle",
    src: "https://www.davehillphoto.com/images/pics/1536/18865_zYcW4F_20240416_hill_liquid_iv_sbc_beach_volleyball_16968.jpg",
  },
  {
    id: 2,
    title: "Ora Cat",
    category: "Automotive",
    src: "https://www.davehillphoto.com/images/pics/1536/17197_SMt7mI_220122_dh_jvm_oracat_m96_oldcity_08_0266jpeg.jpg",
  },
  {
    id: 3,
    title: "Toyota Corolla Cross",
    category: "Automotive",
    src: "https://www.davehillphoto.com/images/pics/1536/17145_BOBsQQ_corolla_cross_890b_08732_0031_santee_court_rear_3_4_lifestyle_004846.jpg",
  },
  {
    id: 1,
    title: "Liquid IV",
    category: "Lifestyle",
    src: "https://www.davehillphoto.com/images/pics/1536/18865_zYcW4F_20240416_hill_liquid_iv_sbc_beach_volleyball_16968.jpg",
  },
  {
    id: 2,
    title: "Ora Cat",
    category: "Automotive",
    src: "https://www.davehillphoto.com/images/pics/1536/17197_SMt7mI_220122_dh_jvm_oracat_m96_oldcity_08_0266jpeg.jpg",
  },
  {
    id: 3,
    title: "Toyota Corolla Cross",
    category: "Automotive",
    src: "https://www.davehillphoto.com/images/pics/1536/17145_BOBsQQ_corolla_cross_890b_08732_0031_santee_court_rear_3_4_lifestyle_004846.jpg",
  },
  {
    id: 1,
    title: "Liquid IV",
    category: "Lifestyle",
    src: "https://www.davehillphoto.com/images/pics/1536/18865_zYcW4F_20240416_hill_liquid_iv_sbc_beach_volleyball_16968.jpg",
  },
  {
    id: 2,
    title: "Ora Cat",
    category: "Automotive",
    src: "https://www.davehillphoto.com/images/pics/1536/17197_SMt7mI_220122_dh_jvm_oracat_m96_oldcity_08_0266jpeg.jpg",
  },
  {
    id: 3,
    title: "Toyota Corolla Cross",
    category: "Automotive",
    src: "https://www.davehillphoto.com/images/pics/1536/17145_BOBsQQ_corolla_cross_890b_08732_0031_santee_court_rear_3_4_lifestyle_004846.jpg",
  },
]);

const subCategory = ref([
  {index:1,
  cName:"Ian"
  },
  {index:2,
  cName:"minkyueng"
  },
  {index:3,
  cName:"leek"
  },
  {index:4,
  cName:"hyeseon"
  },

])
const { displayedImages, isLoading, allLoaded, observerTarget } = InfiniteScroll(photos, 12);

const selectCategory= ref(null);

const selectedCategory = (categoryName) => {
  selectCategory.value = categoryName;
  if (selectCategory.value === "") {
    console.log("none")
  } else {
    console.log("category"+selectCategory.value)
  }
};
  


</script>
<style scoped>
.skeleton_loading {
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--bg-color);
}

.skeleton_loading * {
    background: linear-gradient(120deg, #e5e5e5 30%, #f0f0f0 38%, #f0f0f0 40%, #e5e5e5 48%);
    background-size: 200% 100%;
    background-position: 100% 0;
    animation: load 1s infinite;
}
 
</style>