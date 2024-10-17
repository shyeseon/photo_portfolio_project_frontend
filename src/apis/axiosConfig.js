import axios from "axios";

// 기본 경로 설정
axios.defaults.baseURL = "http://localhost:8181/api";

// withCredentials : 서로 다른 도메인에서 쿠키 & authorization 요청 허용 
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
    (response) => response,
    (err) => {
        if(err.response && err.response.status === 401) {
            console.error("인증 실패");
            window.location.href = "http://localhost:8181/login";
        }
        return Promise.reject(err);
    }
);