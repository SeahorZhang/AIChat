<template>
  <div class="citation">
    <div class="title" @click="isExpanded = !isExpanded">
      <i v-if="loading" class="el-icon-loading"></i>
      引用来源
      <i class="el-icon-arrow-up title-icon" :class="{ 'expanded': isExpanded }"></i>
    </div>
    <Transition @enter="enter" :css="false" @leave="leave">
      <div class="content" v-show="isExpanded">
        <div v-for="item in content" :key="item.text">
          <a :href="item.url" target="_blank">{{ item.text }}</a>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
export default {
  name: "Citation",
  components: {
  },
  props: {
    content: {
      type: Array,
      default: () => [],
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
.citation {
  overflow: hidden;

  .title {
    padding: 12px 0;
    color: #000000d9;
    cursor: pointer;
    user-select: none;
    font-size: 14px;
    color: #333;

    .title-icon {
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