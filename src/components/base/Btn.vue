<template>
  <button
    class="btn"
    :class="{
      fluid: fluid,
      disabled: disabled,
      invisible: invisible,
      light: light
    }"
    @click="click"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: "Btn",
  props: {
    fluid: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    light: {
      type: Boolean,
      default: false
    },
    invisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    click() {
      if (!this.disabled) this.$emit("click");
    }
  }
};
</script>

<style lang="scss" scoped>
$light: #fffdf6;
$disable: #777;

.btn {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: rgba(0, 0, 0, 0);
  border: 1px solid black;
  border-radius: 3px;
  padding: 4px;
  height: fit-content;
  width: fit-content;
  box-sizing: border-box;

  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 100%;
    padding: 0;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 1px;
    box-sizing: border-box;
  }
  &:hover:before {
    width: 100%;
    padding: 2px;
    cursor: pointer;
  }
  &:active {
    box-shadow: inset 0 0 2px black;
  }
  &:focus {
    outline: none;
  }
}
.fluid {
  width: 100%;
}
.invisible {
  border: none;
  background: none;

  &:before {
    border-radius: 10px;
  }
}
.light {
  background-color: $light;
}
.disabled {
  cursor: default;
  background-color: $disable;

  &.btn:hover:before {
    width: 0;
    padding: 0;
    cursor: default;
  }
  &.btn:active {
    box-shadow: none;
  }
}
</style>
