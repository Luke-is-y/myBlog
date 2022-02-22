<template>
  <div>
    <el-menu
      class="side-nav-bar"
      router
      :collapse="store.state.collapse"
      :default-active="route.path"
      background-color="#304156"
      text-color="#BFCBD9"
      active-text-color="#409EFF"
    >
      <template v-for="val of store.state.userModule.userMenuList">
        <!-- 二级菜单 -->
        <template v-if="val.children && val.children.length > 0 && !val.hidden">
          <el-sub-menu :key="val.path" :index="val.path">
            <!-- 二级菜单标题 -->
            <template #title>
              <el-icon>
                <component :is="val.icon"></component>
              </el-icon>
              <span>{{ val.name }}</span>
            </template>
            <!-- 二级菜单选项 -->
            <template v-for="item of val.children" :key="item.path">
              <el-menu-item v-if="!item.hidden" :index="item.path">
                <el-icon>
                  <component :is="item.icon"></component>
                </el-icon>
                <span>{{ item.name }}</span>
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <!-- 一级菜单 -->
        <template v-else-if="!val.hidden">
          <el-menu-item :index="val.path" :key="val.path">
            <el-icon>
              <component :is="val.icon"></component>
            </el-icon>
            <span> {{ val.name }} </span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default defineComponent({
  setup() {
    const store = useStore()
    const route = useRoute()

    return {
      store,
      route
    }
  }
})
</script>

<style scoped>
.side-nav-bar:not(.el-menu--collapse) {
  width: 210px;
}
.side-nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
}
.side-nav-bar i {
  margin-right: 1rem;
}
*::-webkit-scrollbar {
  width: 0.5rem;
  height: 1px;
}
*::-webkit-scrollbar-thumb {
  border-radius: 0.5rem;
  background-color: rgba(144, 147, 153, 0.3);
}
</style>
