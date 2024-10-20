<template>
    <div class="swiper-container fullscreen">
      <swiper
        :slides-per-view="1"
        :space-between="30"
        class="mySwiper"
        :initial-slide="initialSlide"
      >
        <swiper-slide v-for="(image, index) in images" :key="index">
          <img :src="image.imageUrl" :alt="image.title" class="fullscreen-image" />
        </swiper-slide>
      </swiper>
      <!-- z-index를 높여 닫기 버튼이 항상 위에 오도록 설정 -->
      <i class="fa-solid fa-x text-white fs-2 close-icon" @click="closeModal"></i>
    </div>
  </template>
  
  <script setup>
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import 'swiper/swiper-bundle.css';
  
  const props = defineProps({
    images: Array,
    initialSlide: Number // 클릭한 이미지의 인덱스를 받아서 사용
  });
  
  const emit = defineEmits(['close']);
  
  // 닫기 함수
  function closeModal() {
    emit('close');
  }
  </script>
  
  <style scoped>
  .fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1050; /* Swiper의 기본 z-index보다 높게 설정 */
    background-color: rgba(0, 0, 0, 0.9);
  }
  
  .fullscreen-image {
    width: 100%;
    height: 100vh;
    object-fit: contain;
  }
  
  .close-icon {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 1100; /* 닫기 버튼이 최상위로 오도록 설정 */
    cursor: pointer;
    color: white;
    pointer-events: auto; /* 클릭 가능하도록 설정 */
  }
  </style>
  