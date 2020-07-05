<template>
  <transition name="modal-overlay">
    <div class="modal__overlay" v-if="open" v-on:keyup.enter="$emit('success')">
      <div class="modal__content" v-if="open">
        <div class="modal__header" :class="{ border: title }">
          <span>{{ title }}</span>
          <btn @click.native="$emit('cancel')" invisible>
            <icon i="close" size="15px" />
          </btn>
        </div>
        <div class="modal__body">
          <slot />
        </div>
        <div class="modal__footer">
          <div class="btn-group">
            <btn @click.native="$emit('success')"><b>OK</b></btn>
            <btn @click.native="$emit('close')"><b>Close</b></btn>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Modal",
  props: {
    open: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/main.scss";

.modal__overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.4);
}
.modal__content {
  width: 90vw;
  min-height: fit-content;
  margin: 100px auto;
  padding: 5px;
  background-color: $light;
  border-radius: 5px;
  box-sizing: border-box;
  z-index: 100;
  word-wrap: break-word;

  @include for-tablet-landscape-up {
    width: 40vw;
  }
}
.modal__header {
  display: flex;
  justify-content: space-between;
  align-content: center;

  span {
    align-self: center;
    margin: 10px 20px;
    font-size: 24px;
  }
}
.modal__body {
  padding: 10px;
  height: 100%;
}
.modal__footer {
  height: fit-content;
  display: flex;
  justify-content: flex-end;
  align-self: flex-end;
  padding-top: 10px;
  & > .btn-group > button {
    width: 75px;
  }
}
.border {
  border-bottom: 2px solid #444;
}
.modal-overlay-enter-active,
.modal-overlay-leave-active {
  transition: opacity 0.2s;
}
.modal-overlay-enter,
.modal-overlay-leave-to {
  opacity: 0;
}
</style>
