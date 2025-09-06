<template>
  <div class="thinking">
    <div class="title" @click="isExpanded = !isExpanded">
      <div class="title-text">
        <template v-if="loading">
          <i class="el-icon-loading"></i>
          思考中...
        </template>
        <template v-else>
          <i class="el-icon-success"></i>
          思考完成
        </template>
      </div>
      <i class="el-icon-arrow-up title-icon" :class="{ 'expanded': isExpanded }"></i>
    </div>
    <Transition @enter="enter" :css="false" @leave="leave">
      <div class="content" v-show="isExpanded">
        {{ content }}
      </div>
    </Transition>
  </div>
</template>

<script>
export default {
  name: "Thinking",
  components: {
  },
  props: {
    content: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isExpanded: false,
    }
  },
  methods: {
    enter(el, done) {
      done();
      el.style.height = 'auto';
      const h = el.offsetHeight;
      el.style.height = 0;
      el.clientHeight
      el.style.transition = 'height 0.3s';
      el.style.height = `${h + 12}px`;
    },
    leave(el, done) {
      done();
      el.style.display = 'block';
      el.style.transition = 'height 0.3s';
      el.style.height = 0;
    }
  }
};
</script>

<style lang="less" scoped>
.thinking {
  background-color: #F2F3F8;
  border: 1px solid #ebebeb;
  border-radius: 12px;
  padding: 0 12px 0;
  overflow: hidden;

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    color: #000000d9;
    cursor: pointer;
    user-select: none;

    .el-icon-success{
      color: #52c41a;
    }

    .title-text {
      font-size: 14px;
      color: #333;
    }

    .title-icon {
      font-size: 14px;
      color: #333;
      transform: rotate(0deg);
      transition: transform 0.2s ease-in-out;

      &.expanded {
        transform: rotate(180deg);
      }
    }
  }

  .content {
    font-size: 14px;
    color: #00000080;
  }
}
</style>