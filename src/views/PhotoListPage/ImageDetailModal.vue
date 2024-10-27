<template>
  <div class="modal fade" tabindex="-1">
    <div class="modal-dialog border-0 modal-dialog-centered modal-lg mw-100">
      <div class="modal-content border-0 text-end">
        <i class="fa-solid fa-x text-white fs-2 me-5 closeBtn" @click="emit('close')"></i>

        <div class="modal-body p-0">
          <!-- 캐러셀을 닫았다가 다시 열 때 작동하지 않는 문제를 방지하기 위해 새로운 열 때 캐러셀을 리렌더링 -->
          <div id="imageCarousel" class="carousel slide" :key="props.selectedIndex" data-bs-ride="carousel">
            <div class="carousel-inner">
              <div
                class="carousel-item"
                :class="{ active: index === currentIndex }"
                v-for="(image, index) in props.objectProp"
                :key="image.id"
              >
                <img
                  :src="image.imageUrl"
                  :alt="image.alt"
                  class="d-block w-100 detailImage"
                  @click="handleZoom(index)"
                  :class="{ 'zoomed': imageStates.magnify }"
                />
                <button
                  class="carousel-control-prev prevIcon"
                  type="button"
                  data-bs-target="#imageCarousel"
                  data-bs-slide="prev"
                  @click="imageReset(index)"
                >
                  <i class="fa-solid fa-angle-left fs-1 fw-bold"></i>
                  <span class="visually-hidden">Prev</span>
                </button>

                <button
                  class="carousel-control-next nextIcon"
                  type="button"
                  data-bs-target="#imageCarousel"
                  data-bs-slide="next"
                  @click="imageReset(index)"
                >
                  <i class="fa-solid fa-chevron-right fs-1 fw-bold"></i>
                  <span class="visually-hidden">Next</span>
                </button>

                <div class="border-0">
                  <div class="text-center mt-4 text-white fs-6">{{ index + 1 }}/ {{ props.objectProp.length }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';

let ModalClose = null;
const emit = defineEmits(['close']);
const props = defineProps(['objectProp', 'selectedIndex']);
const currentIndex = ref(props.selectedIndex);
const imageStates = ref({});

onMounted(() => {
  ModalClose = document.querySelector('.closeBtn');
  ModalClose.addEventListener('click', allReset);
});

// 사진 클릭 시 확대 및 축소 기능
const handleZoom = (index) => {
  if (!imageStates.value[index]) {
    imageStates.value[index] = { zoom: 100, magnify: false };
  }

  const element = document.querySelectorAll('.detailImage')[index];
  if (!imageStates.value[index].magnify) {
    imageStates.value[index].zoom = 150;
    imageStates.value[index].magnify = true;
  } else {
    imageStates.value[index].zoom = 100;
    imageStates.value[index].magnify = false;
  }

  element.style.zoom = imageStates.value[index].zoom + '%';
};

// 이미지 크기 초기화
const imageReset = (index) => {
  if (imageStates.value[index]) {
    imageStates.value[index].magnify = false;
    const element = document.querySelectorAll('.detailImage')[index];
    element.style.zoom = '100%';
  }
};

// 전체 초기화
const allReset = () => {
  const elements = document.querySelectorAll('.carousel-item .detailImage');
  elements.forEach((element, index) => {
    if (imageStates.value[index]) {
      imageStates.value[index].magnify = false;
      element.style.zoom = '100%';
    }
  });
};

// 스크롤 시 이미지를 다시 가져올 때
watch(
  () => props.objectProp,
  (newValue) => {
    currentIndex.value = props.selectedIndex; // 인덱스 초기화
    allReset();
  }
);

watch(
  () => props.selectedIndex,
  (newValue) => {
    currentIndex.value = newValue; // 선택된 인덱스로 갱신
    allReset();
  }
);
</script>

<style scoped>
.modal-dialog {
  max-width: 80%;
}
.modal-content {
  background: none;
}
.carousel-item img {
  object-fit: contain;
  height: 80vh;
  cursor: zoom-in;
}
.carousel-item img.zoomed {
  cursor: zoom-out;
}
.modal {
  backdrop-filter: brightness(0.5);
}
</style>
