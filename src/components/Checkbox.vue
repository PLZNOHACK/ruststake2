<template>
  <div class="checkbox-wrapper">
    <div class="checkbox" :class="{ 'checked': checked, 'disabled': disabled }" :for="id" @click="toggleCheck()">
      <i class="fas" :class="{'fa-check': checked, 'fa-xmark': !checked}"></i>
      {{ label }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Checkbox',
  data() {
    return {
      checked: false,
    }
  },
  mounted() {
    this.checked = this.value;
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleCheck() {
      if(!this.disabled) {
        this.checked = !this.checked;
        this.$emit('change', this.checked);
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.checkbox-wrapper {
  width: 25px;
  height: 25px;

  input[type="checkbox"] {
    display: none;
  }
}

.checkbox {
  display: flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 2px solid rgba(45, 51, 60, 1);
  width: 25px;
  height: 25px;

  &.checked {
    border: 2px solid rgba(51, 142, 255, 1);
  }

  &:not(.disabled) {
    cursor: pointer;
  }

  // disabled and not checked
  &.disabled {

    &:not(.checked) {
      border: 2px solid rgba(255, 50, 50, 1);

      .fa-xmark {
        color: rgba(255, 50, 50, 1);
      }
    }

    &.checked {
      border: 2px solid rgba(138, 195, 41, 1);
      .fa-check {
        color: rgba(138, 195, 41, 1);
      }
    }
  }

  .fas {
    font-size: 12px;
  }

  .fa-xmark {
    color: rgba(45, 51, 60, 1);
  }

  .fa-check {
    color: rgba(51, 142, 255, 1);
  }
}
</style>