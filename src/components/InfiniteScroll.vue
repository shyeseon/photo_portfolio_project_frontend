<script>
import { onMounted, ref } from 'vue';

export default function useInfiniteScroll(lists, perPage){
const listImages = ref(lists);
const displayedImages=ref([]); 
  const pageNo=ref(1);
  const isLoading =ref(false);   //이미지 로딩 상태  
  const allLoaded = ref(false);  //이미지 데이터 로드 상태
  const observerTarget = ref(null);
  const lastScrollPosition = ref(0);


//업로드할 이미지 불러오기
const loadMoreItems =() => {

// 이미 로딩 중이거나 모든 데이터를 로드한 경우 함수를 종료
if (isLoading.value || allLoaded.value) return;

// 로딩 상태를 true로 설정
isLoading.value = true;

try {

   const start = (pageNo.value - 1) * perPage;
   const end = pageNo.value * perPage;
    const newImages = listImages.value.slice(start, end);
    

 if (newImages.length === 0) {
   allLoaded.value = true;
 } else {
   //스피너가 동작할 시간을 기다림
   setTimeout(()=>{
     //기존의 배열에 새로운 이미지를 추가
     displayedImages.value=[...displayedImages.value, ...newImages];
   },500)
    
 }
 //불러올 이미지가 남아있는 경우 
 if (!allLoaded.value) {
   pageNo.value++;
 }
} catch (error) {
 console.error(error);
} finally {
 setTimeout(() => {
   isLoading.value = false;
 }, 1000);
}
};

onMounted(() => {
const observer = new IntersectionObserver(
 (entries) => {
   if (entries[0].isIntersecting) {
     loadMoreItems();
   }
 },
 {
   root: null, 
   rootMargin: "100px", 
   threshold: 0.5,   
 }
);
if (observerTarget.value) {

 observer.observe(observerTarget.value);
}

});

return {
    displayedImages,
    isLoading,
    allLoaded,
    observerTarget,
  };
}


</script>