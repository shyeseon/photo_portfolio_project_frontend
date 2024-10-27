<template>
  <nav class="sidebar p-0 w-100 h-100">
    <!-- 사이드바 -->
    <div class="h-100 side-bar bg-black text-center d-flex flex-column">
      <div class="mt-5 flex-grow-0 sticky-top">
        <router-link class="text-decoration-none" to="/Admin/ManageImages"
        
        >   <h1
          class="admin-title text-white p-3 border-3 border-top border-bottom "
        >
          Admin
        </h1></router-link>
     

        <ul class="navbar-na mt-5s">
          <li class="nav-item mt-5">
            <RouterLink
              class="nav-link text-white btn btn-dark p-2"
              to="../../Admin/ManageImages"
              >Manage Images</RouterLink
            >
          </li>
          <li class="nav-item mt-5">
            <RouterLink
              class="nav-link text-white btn btn-dark p-2"
              to="../../Admin/ManageCategory"
              >Manage Category</RouterLink
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup></script>

<style scoped>
.side-bar {
  width: 200px;
  min-width: 200px;
  max-width: 200px;
}

.admin-title {
  font-size: 2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.flex-grow-0 > ul.navbar-na {
  list-style: none;
  padding-left: 0;
  width: 100%; /* 부모 요소에 맞춤 */
}

.flex-grow-0 > ul.navbar-na > li.nav-item {
  width: 100%; /* 부모 요소에 맞춤 */
}

.flex-grow-0 > ul.navbar-na > li.nav-item > .nav-link {
  width: 100%; /* 부모 요소에 맞춤 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
