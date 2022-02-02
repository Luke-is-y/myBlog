<template>
  <el-card>
    <yh-table
      :Data="menuList"
      v-bind="tableConfig"
      @add-btn="openAddModal(null)"
      @search-btn="searchMenu"
    >
      <template #header>
        <div class="base-page-title">
          {{ route.name }}
        </div>
      </template>
      <template #icon="scope">
        <el-icon>
          <component :is="scope.row.icon"></component>
        </el-icon>
      </template>
      <template #isHidden="scope">
        <el-switch v-model="scope.row.isHidden"></el-switch>
      </template>
      <template #createTime="scope">
        {{ dateFormat(scope.row.createTime) }}
      </template>
      <template #edit="scope">
        <div class="table-btns">
          <el-button
            type="text"
            size="small"
            icon="plus"
            @click="openAddModal(scope.row, 'add')"
            v-if="scope.row.children"
            >新增</el-button
          >
          <el-button type="text" size="small" icon="edit" @click="openAddModal(scope.row, 'edit')"
            >修改</el-button
          >
          <el-popconfirm
            title="确定删除吗？"
            style="margin-left: 10px"
            @confirm="deleteMenu(scope.row.id)"
          >
            <template #reference>
              <el-button type="text" size="small" icon="delete">删除</el-button>
            </template>
          </el-popconfirm>
        </div>
      </template>
    </yh-table>

    <el-dialog v-model="addUpdateModal" width="30%" :title="modelTitle">
      <el-form label-width="80px" size="medium" :model="menuForm">
        <!-- 菜单类型 -->
        <el-form-item label="菜单类型" v-if="isShowMenuType">
          <el-radio-group v-model="addMenuType">
            <el-radio :label="true">目录</el-radio>
            <el-radio :label="false">一级菜单</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 菜单名称 -->
        <el-form-item label="菜单名称">
          <el-input v-model="menuForm.name" style="width: 220px" />
        </el-form-item>
        <!-- 菜单图标 -->
        <el-form-item label="菜单图标">
          <el-popover placement="bottom-start" width="300" trigger="click">
            <el-row>
              <el-col v-for="(item, index) of iconList" :key="index" :md="12" :gutter="10">
                <div class="icon-item" @click="checkIcon(item)">
                  <i :class="'iconfont ' + item" /> {{ item }}
                </div>
              </el-col>
            </el-row>
            <template #reference>
              <el-input
                :icon="'iconfont ' + menuForm.icon"
                v-model="menuForm.icon"
                style="width: 220px"
              />
            </template>
          </el-popover>
        </el-form-item>
        <!-- 组件路径 -->
        <el-form-item label="组件路径" v-show="!addMenuType">
          <el-input v-model="menuForm.component" style="width: 220px" />
        </el-form-item>
        <!-- 路由地址 -->
        <el-form-item label="访问路径">
          <el-input v-model="menuForm.path" style="width: 220px" />
        </el-form-item>
        <!-- 显示排序 -->
        <el-form-item label="显示排序">
          <el-input-number
            v-model="menuForm.orderNum"
            controls-position="right"
            :min="1"
            :max="10"
          />
        </el-form-item>
        <!-- 显示状态 -->
        <el-form-item label="显示状态">
          <el-radio-group v-model="menuForm.isHidden">
            <el-radio :label="0">显示</el-radio>
            <el-radio :label="1">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button @click="addUpdateModal = false">取 消</el-button>
          <el-button type="primary" @click="addUpdateMenu"> 确 定 </el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { updateMenu, delMenu } from '@/api/permission/menu'
import { tableConfig } from './config/menu.config'
import { dateFormat } from '@/utils/filter'
import YhTable from '@/components/common/table/YhTable.vue'

export default defineComponent({
  components: {
    YhTable
  },
  setup() {
    const store = useStore()
    const route = useRoute()

    onMounted(() => {
      listMenus()
    })

    const menuList = computed(() => store.state.menuModule.menuList)
    const listMenus = () => {
      store.dispatch('menuModule/getMenuList', { keywords: keywords.value })
    }
    const keywords = ref('')
    const searchMenu = (key: string) => {
      keywords.value = key
      listMenus()
    }
    const menuForm = ref({
      id: null,
      name: '',
      icon: '',
      component: '',
      path: '',
      orderNum: 1,
      parentId: null,
      isHidden: 0
    })
    const openAddModal = (row: any, type = '') => {
      if (row) {
        isShowMenuType.value = false
        addMenuType.value = false
        if (type === 'add') {
          menuForm.value = {
            id: null,
            name: '',
            icon: '',
            component: '',
            path: '',
            orderNum: 1,
            parentId: null,
            isHidden: 0
          }
          modelTitle.value = '新增菜单'
          menuForm.value.parentId = JSON.parse(JSON.stringify(row.id))
        } else {
          modelTitle.value = '修改菜单'
          menuForm.value = JSON.parse(JSON.stringify(row))
        }
      } else {
        isShowMenuType.value = true
        modelTitle.value = '新增菜单'
        menuForm.value = {
          id: null,
          name: '',
          icon: '',
          component: 'Layout',
          path: '',
          orderNum: 1,
          parentId: null,
          isHidden: 0
        }
      }
      addUpdateModal.value = true
    }
    const addUpdateMenu = () => {
      if (menuForm.value.name.trim() == '') {
        ElMessage({
          message: '菜单名不能为空',
          type: 'error'
        })
        return false
      }
      if (menuForm.value.icon.trim() == '') {
        ElMessage({
          message: '菜单icon不能为空',
          type: 'error'
        })
        return false
      }
      if (menuForm.value.component.trim() == '') {
        ElMessage({
          message: '菜单组件路径不能为空',
          type: 'error'
        })
        return false
      }
      if (menuForm.value.path.trim() == '') {
        ElMessage({
          message: '菜单访问路径不能为空',
          type: 'error'
        })
        return false
      }

      updateMenu(menuForm.value).then((res) => {
        if (res.data.code) {
          // 重新加载菜单
          store.dispatch('userModule/generaMenu')
          listMenus()
        }
        addUpdateModal.value = false
      })
    }

    const iconList: string[] = []
    const checkIcon = (icon: string) => {
      menuForm.value.icon = icon
    }

    const addUpdateModal = ref(false) // 控制dialog的展开
    const isShowMenuType = ref(false) // 左上方新增菜单
    const addMenuType = ref(true) // 左上方新增菜单类型
    const modelTitle = ref('新增菜单')

    const deleteMenu = (id: number) => {
      delMenu(id).then((res) => {
        if (res.data.code) {
          // 重新加载菜单
          store.dispatch('userModule/generaMenu')
          listMenus()
        }
      })
    }

    return {
      route,
      tableConfig,
      menuList,

      searchMenu,
      menuForm,
      openAddModal,
      addUpdateMenu,

      iconList,
      checkIcon,

      isShowMenuType,
      addMenuType,
      addUpdateModal,
      modelTitle,

      deleteMenu,

      dateFormat
    }
  }
})
</script>
