<template>
    <div class="imgList mt-5">
      <div class="list">
        <div class="text-start fs-2 mb-3">
          <router-link to="/"><i class="fa-solid fa-arrow-left-long text-black"></i></router-link>
        </div>
        <div class="d-flex align-items-end mb-4">
          <!-- <h2 class="fw-bold mb-0 me-3">{{ projectName }}</h2> -->
          <!-- <h6 class="mb-1">{{ projectCategory }}</h6> -->
        </div>
      
        <div class="masonry-layout">
          <!-- 이미지 배열을 담은 컬럼 반복 -->
        <div v-for="column in columns" :key="column.id" class="masonry-column">
           <!-- 컬럼 내의 이미지 배열을 반복-->
          <div v-for="item in column.items" :key="item.id" class="masonry-item">
            <img :src="item.imageUrl" :alt="item.alt" @click="modalOpen(item, item.id)" />
          </div>
        </div>
      </div>
      <InfiniteScroll :loading="isLoading" @load-more="loadMoreItems" />
        <!-- 데스크탑에서는 기존 모달 사용 -->
        <ImageDetailModal v-if="!isMobile" id="ImageDetailmodal" @close="closeModal" :objectProp="listImages" :selectedIndex="currentSlideIndex"
        />
  
        <!-- 모바일에서는 Swiper 모달 사용 -->
        <SwiperModal
          v-if="isMobile && showSwiperModal"
          :images="listImages"
          :initial-slide="currentSlideIndex"
          @close="closeSwiperModal"
        />
      </div>
    </div>
  </template>
  
  <script setup> 
  import { ref, computed, onMounted, watch } from 'vue';
  import ImageDetailModal from './ImageDetailModal.vue';
  import SwiperModal from './SwiperModal.vue';
  import { Modal } from 'bootstrap';
  import InfiniteScroll from '@/components/InfiniteScroll.vue';
  import axios from 'axios';
  import {  useRoute } from 'vue-router';
  import "@/apis/axiosConfig";
  
  const route = useRoute();
  const id = ref(null);
  id.value = route.query.projectId;
  const listImages = ref([]);
  const isLoading = ref(false);
  const page = ref(0);
  const newImages=ref([]);
  const hasMore = ref(true);
  //let projectName = ref(listImages.value[0].title);
  //let projectCategory = ref(listImages.value[0].pc);
  let ImageDetailmodal = null;
 
  const imagesLoaded = ref(false);
  const isMobile = computed(() => window.innerWidth <= 768); // 모바일 화면 감지
  const showSwiperModal = ref(false); // Swiper 모달 상태
  const currentSlideIndex = ref(0); // Swiper에서 현재 열려 있는 슬라이드 인덱스

  const columns = ref([]);
  const loadedImages = ref(0);
  const width = ref(window.innerWidth);

  onMounted(()=>{
    createColumns();
    loadMoreItems();
  })
  const loadMoreItems = async () => {
  // 이미 로딩 중이거나 모든 데이터를 로드한 경우 함수를 종료
   if (isLoading.value) return;

  // 로딩 상태를 true로 설정
  isLoading.value = true;
    try {
      const response = await axios.get(`/photos/${id.value}`);
      console.log(response.data)
      newImages.value = response.data.map(item =>({
        id:item.id,
        imageUrl:item.imageUrl,
        title:item.title
      }))
      if (newImages.value.length === 0) {
        hasMore.value = false;
      }else{
        console.log(newImages.value.length );
        listImages.value = [...listImages.value, ...newImages.value];
        page.value++;
        distributeItems();
      }
      
    } catch (error) {
      console.error('Error fetching project images:', error);
    } finally {
      isLoading.value = false;
    }
};

  const columnsCount = computed(() => {
    if (width.value <= 768) return 1;
    else if (width.value <= 1200) return 2;
    else return 3;
  });
  
  //이미지 배열을 담을 컬럼 생성하기
  const createColumns = () => {
    columns.value = Array.from({ length: columnsCount.value }, (index) => ({
      id: index,
      items: []
    }));
  };
  
  //생성된 컬럼에 이미지의 크기를 비교해 담기
const distributeItems = () => {
  createColumns();
  //생성된 컬럼을 0으로 모두 초기화 
  const columnHeights = Array(columnsCount.value).fill(0);

    listImages.value.forEach((image, index) => {
    //이미지의 높이를 계산하기 위해 이미지 객체를 생성해 src를 할당해 줘야 이미지가 출력됨
    //onload 이벤트 호출 시 이미지가 로딩될 때 스크롤바가 위로 튕기는 문제가 발생)
    const img = new Image();
    img.src = image.imageUrl;
    const imgHeight = calculateImageHeight(img); 
    
    //현재 컬럼에서 길이가 가장 짧은 컬럼ㅇ르 찾아 이미지 추가 
    const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights)); 
 
    columns.value[shortestColumnIndex].items.push({
      id: index,
      ...image,
    });
      //이미지를 추가한 컬럼의 높이를 업데이트
      columnHeights[shortestColumnIndex] += imgHeight;
    });
  };

  //이미지 높이를 계산하기 위한 함수 
  const calculateImageHeight = (img) => {
    const aspectRatio = img.height / img.width;
    return  aspectRatio;
  };

  // 창 크기 변경 시 이미지 재배치
  const handleResize = () => {
    width.value = window.innerWidth
    createColumns();
    distributeItems(); 
  };

  onMounted(() => {
  window.addEventListener('resize', handleResize); // Add resize listener
  });


  onMounted(() => {
    preloadImages();
    if (!isMobile.value) {
      ImageDetailmodal = new Modal(document.querySelector("#ImageDetailmodal"));
    }
  });


  function modalOpen(item, index) {
    if (!isMobile.value) {
      currentSlideIndex.value = index;
      ImageDetailmodal.show();


    } else {
      currentSlideIndex.value = index; // 클릭한 이미지 인덱스 설정
      showSwiperModal.value = true; // 모바일에서 Swiper 모달 열기
    }
  }
  
  function closeModal() {
    if (!isMobile.value) {
      console.log("모달 닫기");
      ImageDetailmodal.hide();
    }
  }
  
  function closeSwiperModal() {
    console.log("Swiper 모달 닫기");
    showSwiperModal.value = false; // Swiper 모달 닫기
  }
  
  function preloadImages() {
  let loadedCount = 0;
  const totalImages = listImages.value.length;

  listImages.value.forEach((item) => {
    const img = new Image();
    img.onload = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        imagesLoaded.value = true;
      }
    };
    img.src = item.src;
  });
}


watch(listImages, () => {
  distributeItems();
  loadedImages.value = 0;
}, { deep: true });

watch(columnsCount, ()=>{
  width.value = window.innerWidth;
  createColumns(); 
  distributeItems();
})

</script>
  
<style scoped>
html {
  scroll-behavior: smooth; /* 부드러운 스크롤 */
}
.list {
  margin: 0 2.25rem;
}
  
.masonry-layout {
  display: flex;
  gap: 10px;
}

.masonry-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.masonry-item img {
  width: 100%;
  display: block;
  object-fit: cover;
}

.skeleton_loading {
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--bg-color);
}
/* 스켈레톤 이미지 */
.skeleton_img {
    width: 100%;
    height: 100%;
}
.skeleton_loading * {
    background: linear-gradient(120deg, #e5e5e5 30%, #f0f0f0 38%, #f0f0f0 40%, #e5e5e5 48%);
    border-radius: 1rem;
    background-size: 100% 100%;
    background-position: 100% 0;
    animation: load 1s infinite;
}

</style>
  