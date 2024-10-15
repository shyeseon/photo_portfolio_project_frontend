import axios from "axios";
import router from "@/router";

// 기본 경로 설정
axios.defaults.baseURL = "http://localhost/api";

// withCredentials : 서로 다른 도메인에서 쿠키 & authorization 요청 허용 
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
    (response) => response,
    (err) => {
        if(err.response && err.response.status === 401) {
            console.error("인증 실패");
            router.push("/login");
        }
        return Promise.reject(err);
    }
);