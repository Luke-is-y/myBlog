<template>
  <div>
    <!-- 导航栏 -->
    <div class="nav__header">
      <!-- 折叠按钮 -->
      <div class="nav__is-foldr" @click="changeIsFold">
        <el-icon>
          <component :is="isFold"></component>
        </el-icon>
      </div>
      <!-- 右侧菜单 -->
      <div class="nav__right-menu">
        <!-- 用户选项 -->
        <el-dropdown @command="handleCommand">
          <el-avatar :size="40" :src="store.state.userModule.user.avatar" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="setting"> 个人中心 </el-dropdown-item>
              <el-dropdown-item command="logout" divided> 退出登录 </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <!-- 历史标签栏 -->
    <div class="nav__tabs-view-container">
      <span
        :class="isActive(item)"
        v-for="item of store.state.tabList"
        :key="item.path"
        @click="goTo(item)"
      >
        <span>
          {{ item.name }}
          <close v-if="item.path != '/'" class="nav__close-tab" @click.stop="removeTab(item)" />
        </span>
      </span>
      <div class="nav__tabs-close-item" style="float: right" @click="closeAllTab">全部关闭</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    onMounted(() => {
      store.commit('saveTab', route)
    })

    const goTo = (tab: any) => {
      router.push({ path: tab.path })
    }

    const removeTab = (tab: any) => {
      store.commit('removeTab', tab)
      if (tab.path == route.path) {
        const tabList = store.state.tabList
        router.push({ path: tabList[tabList.length - 1].path })
      }
    }

    const changeIsFold = () => {
      store.commit('changeIsFold')
    }

    const handleCommand = (command: any) => {
      if (command == 'setting') {
        router.push({ path: '/setting' })
      }
      if (command == 'logout') {
        store.commit('userModule/logout')
        store.commit('resetTab')
        router.push({ path: '/login' })
      }
    }

    const closeAllTab = () => {
      store.commit('resetTab')
      router.push({ path: '/' })
    }

    const isActive = computed(() => {
      //标签是否处于当前页
      return function (tab: any) {
        if (tab.path == route.path) {
          return 'tabs-view-item tabs-view-item-active'
        }
        return 'tabs-view-item'
      }
    })

    const isFold = computed(() => (store.state.collapse ? 'Expand' : 'Fold'))

    return {
      store,
      goTo,
      removeTab,
      changeIsFold,
      handleCommand,
      closeAllTab,
      isActive,
      isFold
    }
  }
})
</script>

<style scoped>
.nav__header {
  display: flex;
  align-items: center;
  padding-left: 15px;
  padding-right: 30px;
  height: 50px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
.nav__is-foldr {
  font-size: 1.25rem;
  cursor: pointer;
  margin-right: 24px;
}
.nav__tabs-view-container {
  display: flex;
  position: relative;
  padding-left: 10px;
  padding-right: 10px;
  height: 33px;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
}
.tabs-view-item {
  display: flex;
  cursor: pointer;
  height: 25px;
  line-height: 25px;
  border: 1px solid #d8dce5;
  color: #495060;
  background: #fff;
  padding: 0 8px;
  font-size: 12px;
  margin-top: 4px;
  margin-left: 5px;
}

.tabs-view-item-active {
  background-color: #42b983;
  color: #fff;
}
.nav__tabs-close-item {
  position: absolute;
  right: 10px;
  display: inline-block;
  cursor: pointer;
  height: 25px;
  line-height: 25px;
  border: 1px solid #d8dce5;
  color: #495060;
  background: #fff;
  padding: 0 8px;
  font-size: 12px;
  margin-top: 4px;
  margin-left: 5px;
}

.nav__right-menu {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.nav__close-tab {
  width: 12px;
  height: 12px;
}
</style>
