<template>
    <div class="not-found-container">
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <router-link to="/" class="home-button">Go back to Home</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFound'
  }
  </script>
  
  <style scoped>
  .not-found-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100vh;
    background-color: #f9f9f9;
    color: #333;
  }
  
  h1 {
    font-size: 6rem;
    margin: 0;
    color: #ff6b6b;
  }
  
  p {
    font-size: 1.5rem;
    margin: 1rem 0;
  }
  
  .home-button {
    padding: 0.8rem 1.5rem;
    margin-top: 1.5rem;
    font-size: 1rem;
    color: white;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    text-decoration: none;
    transition: background-color 0.3s ease;
  }
  
  .home-button:hover {
    background-color: #0056b3;
  }
  </style>
  