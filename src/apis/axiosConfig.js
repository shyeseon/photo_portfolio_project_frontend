import axios from "axios";

// 기본 경로 설정
axios.defaults.baseURL = "https://photo-portfolio-project-backend-450062450110.us-central1.run.app/api";

// withCredentials : 서로 다른 도메인에서 쿠키 & authorization 요청 허용 
axios.defaults.withCredentials = true;  
export default axios;