<template>
    <view class="loading-container">
      <view class="spinner"></view>
      <text>正在分析喵...</text>
    </view>
  </template>
  
  <script>
  export default {
    data() {
      return {};
    },
    mounted() {
      console.log('AnalyzeWaitingPage mounted');
    },
    methods: {}
  };
  </script>
  
  <style scoped>
  .loading-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
	background-color: #e6fae9;
  }
  
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-top: 4px solid #1e873c;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
  
  text{
	  line-height: 60px;
	  letter-spacing: 2px;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  </style>