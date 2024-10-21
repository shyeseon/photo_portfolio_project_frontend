<template>
  <div ref="observerTarget"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  loading: Boolean,
  hasMore:Boolean
});

const emit = defineEmits(['load-more']);

const observerTarget = ref(null);

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !props.loading && props.hasMore) {
        emit('load-more');
      }
    },
    {
      root: null,
      rootMargin: "100px",
      threshold: 0.2,
    }
  );

  if (observerTarget.value) {
    observer.observe(observerTarget.value);
  }
  
});
</script>