<template>
    <div class="container mt-5 pt-5">
      <div class="row">
        <div class="col-md-5">
          <img
            src="https://www.davehillphoto.com/images/pics/1536/18865_zYcW4F_20240416_hill_liquid_iv_sbc_beach_volleyball_16968.jpg"
            alt="profile-picture"
            class="img-fluid"
          />
        </div>
        <div class="col-md-5">
          <form ref="form" @submit.prevent="sendEmail">
            <h5 class="text-muted mb-4 mt-2">CONTACT</h5>
            <div class="mb-4">
              <input type="text" name="from_name" class="form-control border-0 border-bottom border-dark ps-0 rounded-0" placeholder="name*" required
              v-model="userInfo.name"/>
            </div>
            <div class="mb-4">
              <input type="email" name="from_email" class="form-control border-0 border-bottom border-dark ps-0 rounded-0" placeholder="email*" required
              v-model="userInfo.email" />
              <small v-if="!isUserEmailValid && userInfo.email" class="text-danger">
              Invalid email format
            </small>
            </div>
            <div class="mb-5">
              <textarea name="message" class="form-control border-0 border-bottom border-dark ps-0 rounded-0" placeholder="message*" rows="3" required
              v-model="userInfo.message"></textarea>
            </div>
            <div class="text-center">
              <button type="submit" class="btn btn-outline-dark px-4" :disabled="!isEmailFormValid" @click="openEmailModal">
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- email confirmation modal -->
    <div class="modal fade" id="emailModal" tabindex="-1">
      <div class="modal-dialog ">
        <div class="modal-content">
          <button type="button" class="btn-close position-absolute top-0 end-0 m-2" data-bs-dismiss="modal" aria-label="Close"
          @click="closeEmailModal"></button>
          <div class="modal-body text-center mt-4">
            <h4 class="modal-title mb-3" id="emailModalLabel">Email Confirmation</h4>
            <p>
              <span>Thank you! </span>
              <span>Your message has been successfully sent</span>
            </p>
          </div>
        </div>
      </div>
    </div>    
  </template>
  
  <script setup>
  import emailjs from '@emailjs/browser';
  import { Modal } from 'bootstrap';
  import { computed, ref, onMounted } from 'vue';

  const form = ref(null);
  let emailConfirmationModal = null;

  onMounted(() => {
  emailConfirmationModal = new Modal(document.getElementById("emailModal"));
  });

  // 이메일 작성 폼 
  const userInfo = ref({
    name: "",
    email: "",
    message: ""
  });

  // emailJs
  const sendEmail = () => {
    emailjs.sendForm('service_eh2bf9q', 'template_fh2rule', form.value, {
          publicKey: 'pxfaPAyeIbJiQxtUZ',
        })
        .then(
          () => {
            // console.log('sending email is SUCCESS!');
          },
          (error) => {
            // console.log('sending email is FAILED...', error.text);
          },
        );
  };

  // 이메일 정규식
  const isUserEmailValid = computed(() => {
    const regex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i // 정규표현식
    return regex.test(userInfo.value.email); // test : js 정규식 검사 method 
  });

  // send 버튼 활성화
  const isEmailFormValid = computed(() => {
    return userInfo.value.name !== "" && userInfo.value.message !== ""
    && isUserEmailValid.value
  });

  // 이메일 confirmation 모달 열고 닫기
  const openEmailModal = () => {
    emailConfirmationModal.show();
  }
  const closeEmailModal = () => {
    emailConfirmationModal.hide();
  }

  </script>
  
  <style scoped>
  
  
  .form-control:focus {
    box-shadow: none;
    border-color: #888888;
  }
  
  textarea {
    resize: vertical;
  }
  
  h5 {
    font-weight: normal;
  }

  </style>