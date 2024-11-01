<template>
  <div class="imgList mt-5">
    <div class="list">
      <div class="text-start fs-2 mb-3">
        <i
          class="fa-solid fa-arrow-left-long text-black"
          @click="routerBack"
        ></i>
      </div>
      <div class="d-flex align-items-end mb-4">
        <h4 class="fw-bold mb-0 me-3 user-select-none">{{ title }}</h4>
      </div>

      <!-- 로딩 중일 때 스피너 표시 -->
      <div v-if="isLoading" class="d-flex justify-content-center">
        <div
          class="spinner-border position-absolute top-50 start-50"
          role="status"
        >
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- 로딩 완료 후 이미지가 없을 때 메시지 표시 -->
      <div
        v-else-if="!isLoading && listImages.length === 0"
        class="no-images-message d-flex justify-content-center align-items-center text-center py-5"
      >
        <p class="text-muted fs-4 fw-bold">
          The project has no detailed images available.
        </p>
      </div>

      <!-- 이미지가 있는 경우 masonry 레이아웃을 표시 -->
      <div v-else class="masonry-layout">
        <div v-for="column in columns" :key="column.id" class="masonry-column">
          <div v-for="item in column.items" :key="item.id" class="masonry-item">
            <img
              :src="item.imageUrl"
              :alt="item.title + item.index"
              class="w-100 d-block object-fit-cover detail-image"
              @click="modalOpen(item.index)"
            />
          </div>
        </div>
      </div>
      <InfiniteScroll
        :loading="isLoading"
        :hasMore="hasMore"
        @load-more="loadMoreItems"
      />

      <!-- 데스크탑 모달 -->
      <ImageDetailModal
        v-if="!isMobile"
        id="ImageDetailmodal"
        @close="closeModal"
        :objectProp="listImages"
        :selectedIndex="currentSlideIndex"
      />

      <!-- 모바일 Swiper 모달 -->
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
import { ref, computed, onMounted, watch } from "vue";
import ImageDetailModal from "./ImageDetailModal.vue";
import SwiperModal from "./SwiperModal.vue";
import { Modal } from "bootstrap";
import InfiniteScroll from "@/components/InfiniteScroll.vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const listImages = ref([]);
const isLoading = ref(false);
const page = ref(0);
const newImages = ref([]);
const hasMore = ref(true);

let ImageDetailmodal = null;

const isMobile = computed(() => window.innerWidth <= 768); // 모바일 화면 감지
const showSwiperModal = ref(false); // Swiper 모달 상태
const currentSlideIndex = ref(0); // Swiper에서 현재 열려 있는 슬라이드 인덱스

const columns = ref([]);
const loadedImages = ref(0);
const width = ref(window.innerWidth);

const id = ref(null);
const title = ref(null);

//let projectCategory = ref(listImages.value[0].pc);

onMounted(() => {
  loadMoreItems();
  if (!isMobile.value) {
    ImageDetailmodal = new Modal(document.querySelector("#ImageDetailmodal"));
  }
  window.addEventListener("resize", handleResize); 
});

//이미지 불러오기
const loadMoreItems = async () => {
  // 이미 로딩 중이거나 모든 데이터를 로드한 경우 함수를 종료
  if (isLoading.value || !hasMore.value) return;
  isLoading.value = true;
  const params = {
    page: page.value,
  };

  try {
    id.value = route.params.projectId;
    await new Promise(resolve => setTimeout(resolve, 1000));
    const response = await axios.get(`/photos/${id.value}`, { params });
    console.log(response.data);
    title.value = response.data.title;
    //newImages.value를 받아와서 넣어주는 부분을 else문과 합칠 수 있을 것 같다
    newImages.value = response.data.photos.map((item, index) => ({
      id: item.id,
      imageUrl: item.imageUrl,
      //모달에서 보여질 때 배치가 달라지기 때문에 index값으로 보내줌
      index: listImages.value.length + index,
    }));
    hasMore.value = !response.data.last;
    listImages.value = [...listImages.value, ...newImages.value];
    // if (listImages.value.length > 0) {
    //   title.value = listImages.value[0].title;
    // }
    console.log("page" + page.value);
    await distributeItems();

    page.value++;
  } catch (error) {
    console.error("Error fetching project images:", error);
  } finally {
    isLoading.value = false;
  }
};

const columnsCount = computed(() => {
  if (width.value <= 768) return 1;
  else if (width.value <= 1200) return 2;
  else return 3;
});

//mansory 레이아웃 배치를 위한 컬럼 생성
const createColumns = () => {
  columns.value = Array.from({ length: columnsCount.value }, (index) => ({
    id: index,
    items: [],
  }));
};

//생성된 컬럼에 이미지의 크기를 비교해 담기
const distributeItems = async () => {
  const sortedImgs = await preloadAndSortImages();
  createColumns();
  //생성된 컬럼을 0으로 모두 초기화
  const columnHeights = Array(columnsCount.value).fill(0);

  sortedImgs.forEach((image, index) => {
    //현재 컬럼에서 길이가 가장 짧은 컬럼ㅇ르 찾아 이미지 추가
    const shortestColumnIndex = columnHeights.indexOf(
      Math.min(...columnHeights)
    );

    columns.value[shortestColumnIndex].items.push({
      id: index,
      ...image,
    });
    //이미지를 추가한 컬럼의 높이를 업데이트
    columnHeights[shortestColumnIndex] += image.height;
  });
};
//이미지가 로딩 되기 전 레이아웃 배치가 이루어 지지 않도록 이미지를 모두 불러오기
const preloadAndSortImages = async () => {
  //모든 이미지가 로딩되기 전에 distribute함수가 호출되면 에러가 발생하므로 promise를 사용해 모든 이미지가 로딩되고 함수가 실행하도록 함

  //의문??? => axios를 사용하는데 promise를 사용해야 하나??
  const loadedImages = await Promise.all(
    listImages.value.map(async (image) => {
      return new Promise((resolve) => {
        //이미지의 높이를 계산하기 위해 이미지 객체를 생성해 src를 할당해 줘야 이미지가 출력됨
        const img = new Image();
        img.onload = () => {
          resolve({
            ...image,
            height: img.height,
          });
        };
        img.src = image.imageUrl;
      });
    })
  );

  return loadedImages;
};

// 창 크기 변경 시 이미지 재배치
const handleResize = () => {
  width.value = window.innerWidth;
  createColumns();
  distributeItems();
};

async function modalOpen(index) {
  try {
    await preloadAndSortImages(listImages.value);
    currentSlideIndex.value = index; //클릭한 이미지 인덱스 설정
    if (!isMobile.value) {
      ImageDetailmodal.show();
    } else {
      showSwiperModal.value = true; // 모바일에서 Swiper 모달 열기
    }
  } catch (error) {
    console.error("모달 로드 실패" + error);
  }
}

const closeModal = () => {
  if (!isMobile.value) {
    ImageDetailmodal.hide();
  }
};

const closeSwiperModal = () => {
  showSwiperModal.value = false; // Swiper 모달 닫기
};

const routerBack = () => {
  router.back();
};

watch(
  listImages,
  () => {
    distributeItems();
    loadedImages.value = 0;
  },
  { deep: true }
);

watch(columnsCount, () => {
  width.value = window.innerWidth;
  createColumns();
  distributeItems();
});
</script>

<style scoped>
html {
  scroll-behavior: smooth; 
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
.detail-image {
  cursor: pointer;
}
.detail-image:hover {
  opacity: 0.8;
  transition: 0.3s ease;
}
.fa-arrow-left-long:hover {
  transition: 0.3s ease;
  opacity: 0.5;
  cursor: pointer;
}
</style>
