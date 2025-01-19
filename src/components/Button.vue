<template>
<div class="button">
  <i v-if="icon" :class="{[icon]: true, withLabel: label !== ''}"></i>
  <label>{{label}}</label>
</div>
</template>

<script>
export default {
  name: "Button",
  props: {
    label: {
      default: "",
      type: String,
    },
    icon: {
      default: undefined,
      type: String,
    },
    textColor: {
      default: "#fff",
      type: String,
    },
    backgroundColor: {
      default: "rgba(51, 142, 255, 1)",
      type: String,
    },
  },
  data() {
    return {
      iconMargin: (this.label === "" ? 0 : "0.4em"),
    }
  }
}
</script>

<style lang="scss" scoped>
.button {
  display: flex;
  flex-direction: row;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  color: v-bind(textColor);
  background: v-bind(backgroundColor);
  -webkit-transition: all 0.1s ease-in-out;
  -o-transition: all 0.1s ease-in-out;
  transition: all 0.1s ease-in-out;
}

label {
  cursor: pointer;
}

.withLabel {
  margin-right: 0.5rem;
} 

.button:hover {
  -webkit-box-shadow:inset 0 0 0 2px v-bind(textColor);
  -moz-box-shadow:inset 0 0 0 2px v-bind(textColor);
  box-shadow:inset 0 0 0 2px v-bind(textColor);
}

.button:active {
  filter: brightness(85%);
}


</style>