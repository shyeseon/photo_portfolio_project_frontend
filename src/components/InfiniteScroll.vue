<template>
  <div ref="observerTarget"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  loading: Boolean,
  hasMore:Boolean
});

const emit = defineEmits(['load-more']);

const observerTarget = ref(null);

onMounted(() => {
  //observer 인스턴스 생성 
  const observer = new IntersectionObserver(
    //callback
    (entries) => {
      if (entries[0].isIntersecting && !props.loading && props.hasMore) {
        emit('load-more');
      }
    },
    //options
    {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    }
  );
  //타겟요소 관찰 시작 
  if (observerTarget.value) {
    observer.observe(observerTarget.value);
  }
  //타겟 요소 관찰 중지
  onUnmounted(() => {
    if (observerTarget.value) {
      observer.unobserve(observerTarget.value);
    }
  });
  
});
</script>