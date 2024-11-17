<template>
  <div class="infinite-scroll-component">
    <slot></slot>
    <div ref="observerTarget" class="observer-target"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  loading: Boolean,
  hasMore: Boolean,
});

const emit = defineEmits(['load-more']);
const observerTarget = ref(null);

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !props.loading && props.hasMore) {
        console.log("IntersectionObserver triggered at:", new Date().toISOString());
        emit('load-more');
      }
    },
    {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    }
  );

  if (observerTarget.value) {
    observer.observe(observerTarget.value);
  }

  // Cleanup
  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
  });
});
</script>

<style scoped>
.infinite-scroll-component {
  min-height: 100px;
}

.observer-target {
  height: 20px;
  width: 100%;
}
</style>