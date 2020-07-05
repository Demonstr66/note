<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  created() {
    //get data on app created
    this.$store.dispatch("getDataFromBase");
  }
};
</script>

<style lang="scss">
@import "@/assets/css/main.scss";

* {
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  margin: 0;
  padding: 0;
}
body {
  background-color: $bg-color;
  background: url("./assets/bg-list.svg") no-repeat fixed;
  background-position-y: 150px;
  background-position-x: 50px;
}
.main {
  width: 100vw;
  padding: 0;
  margin: 0 auto;
  text-align: center;

  @include for-tablet-landscape-up {
    margin: 10vh auto;
    width: 80vw;
  }

  .empty {
    font-size: 24px;
    padding: 10px;
    margin: 20px 10px;
    p a {
      color: rgb(0, 0, 214);
      text-decoration: underline;
      text-decoration-color: rgb(8, 8, 172);
    }
    p a:hover {
      cursor: pointer;
    }
  }
}
.header {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  min-height: 10vh;
  box-sizing: border-box;
  border-radius: 3px;
  text-align: center;
  background-color: $header-bg;
  color: $light;
  padding: 3px 25px;

  @include for-tablet-landscape-up {
    padding: 3px 15px;
  }
  h1:hover {
    cursor: pointer;
  }
}
.btn-group {
  display: flex;
  flex-direction: row;
  .btn {
    border-radius: 0;
  }
  & :not(:last-child) {
    border-right: none;
  }
  & :first-child {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  & :last-child {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }
}
input.text {
  width: 100%;
  display: block;
  background-color: $light;
  position: relative;
  font-size: 24px;
  padding: 3px 15px;
  border: none;
  border-bottom: 2px solid #444;
  box-sizing: border-box;

  &:focus {
    outline: none;
  }

  &::placeholder {
    font-style: italic;
    color: rgba(161, 161, 161, 0.897);
  }

  & + label {
    color: red;
  }
}
.bg-none {
  background-color: rgba(0, 0, 0, 0) !important;
}
</style>
