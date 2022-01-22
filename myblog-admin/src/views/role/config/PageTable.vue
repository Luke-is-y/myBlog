<template>
  <div class="page-table">
    <yh-table
      :Data="roleList"
      v-bind="tableConfig"
      @search-btn="searchRoles"
      @add-btn="openMenuModel(null)"
      @del-btn="isDeleteVisible = true"
      @selection="getSelectionData"
      :pageCount="roleListCount"
    >
      <template #header>
        <div class="title">
          {{ route.name }}
        </div>
      </template>
      <template #isDisable="scope">
        <el-switch
          v-model="scope.row.isDisable"
          active-color="#13ce66"
          inactive-color="#F4F4F5"
          :active-value="1"
          :inactive-value="0"
        ></el-switch>
      </template>
      <template #createTime="scope">
        {{ dateFormat(scope.row.createTime) }}
      </template>
      <template #edit="scope">
        <div class="table-btns">
          <el-button type="text" size="small" icon="plus" @click="openMenuModel(scope.row)"
            >菜单权限</el-button
          >
          <el-button type="text" size="small" icon="edit" @click="openResourceModel(scope.row)"
            >资源权限</el-button
          >
          <el-popconfirm
            title="确定删除吗？"
            style="margin-left: 10px"
            @confirm="deleteRoles(scope.row.id)"
          >
            <template #reference>
              <el-button type="text" size="small" icon="delete">删除</el-button>
            </template>
          </el-popconfirm>
        </div>
      </template>
    </yh-table>
    <!-- 菜单对话框 -->
    <el-dialog v-model="roleMenuVisible" width="30%">
      <template #title>
        <div class="dialog-title-container">{{ menuTitle }}</div>
      </template>

      <el-form label-width="80px" size="medium" :model="roleForm">
        <el-form-item label="角色名">
          <el-input v-model="roleForm.roleName" style="width: 250px" />
        </el-form-item>
        <el-form-item label="权限标签">
          <el-input v-model="roleForm.roleDescription" style="width: 250px" />
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            :data="menuList"
            :default-checked-keys="roleForm.menuIdList"
            check-strictly
            show-checkbox
            node-key="id"
            ref="menuTree"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button @click="roleMenuVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveOrUpdateRoleMenu"> 确 定 </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 资源对话框 -->
    <el-dialog v-model="roleResourceVisible" width="30%" top="9vh">
      <template #title>
        <div class="dialog-title-container">修改资源权限</div>
      </template>
      <el-form label-width="80px" size="medium" :model="roleForm">
        <el-form-item label="角色名">
          <el-input v-model="roleForm.roleName" style="width: 250px" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="roleForm.roleDescription" style="width: 250px" />
        </el-form-item>
        <el-form-item label="资源权限">
          <el-tree
            :data="resourceList"
            :default-checked-keys="roleForm.resourceIdList"
            show-checkbox
            check-strictly
            node-key="id"
            ref="resourceTree"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button @click="roleResourceVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveOrUpdateRoleResource"> 确 定 </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 批量删除对话框 -->
    <el-dialog v-model="isDeleteVisible" width="30%">
      <template #title>
        <div class="dialog-title-container">
          <i class="el-icon-warning" style="color: #ff9900" />提示
        </div>
      </template>

      <div style="font-size: 1rem">是否删除选中项？</div>
      <template #footer>
        <div>
          <el-button @click="isDeleteVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteRoles()"> 确 定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

import { ElNotification, ElMessage } from 'element-plus'

import yhRequest from '@/utils/request'

import YhTable from '@/components/common/table/YhTable.vue'
import { ITable } from '@/components/common/table/types'
import { RoleForm } from './type'

import { dateFormat } from '@/utils/filter'

export default defineComponent({
  components: {
    YhTable
  },
  props: {
    tableConfig: {
      type: Object as PropType<ITable>,
      required: true
    }
  },
  setup() {
    const store = useStore()
    const route = useRoute()

    onMounted(() => {
      listRoles()
    })

    const roleList = computed(() => store.state.roleModule.roleList)
    const menuList = computed(() => store.state.roleModule.menuList)
    const resourceList = computed(() => store.state.roleModule.resourceList)
    const roleListCount = computed(() => store.state.roleModule.roleListCount)

    const rolePage = ref({
      currentPage: 1,
      size: 10
    })

    const listRoles = () => {
      store.dispatch('roleModule/getRoleList', { keywords: keywords.value })
      store.dispatch('roleModule/getMenuList')
      store.dispatch('roleModule/getResourceList')
    }

    const keywords = ref('')

    // 菜单dialog 相关

    const roleMenuVisible = ref(false)

    const roleForm = ref<RoleForm>({
      roleName: '',
      roleDescription: '',
      resourceIdList: [],
      menuIdList: []
    })

    const roleIdList = ref({})

    const menuTitle = ref('修改角色')

    const menuTree = ref()

    const openMenuModel = (role: any) => {
      if (role != null) {
        menuTitle.value = '修改角色'
        roleForm.value = JSON.parse(JSON.stringify(role))
      } else {
        menuTitle.value = '新增角色'
        roleForm.value = {
          roleName: '',
          roleDescription: '',
          resourceIdList: [],
          menuIdList: []
        }
      }
      roleMenuVisible.value = true
    }

    const saveOrUpdateRoleMenu = () => {
      if (roleForm.value.roleName.trim() == '') {
        ElMessage({
          message: '角色名不能为空',
          type: 'error'
        })
        return false
      }
      if (roleForm.value.roleDescription.trim() == '') {
        ElMessage({
          message: '权限标签不能为空',
          type: 'error'
        })
        return false
      }
      roleForm.value.resourceIdList = []
      roleForm.value.menuIdList = menuTree.value
        .getCheckedKeys()
        .concat(menuTree.value.getHalfCheckedKeys())

      yhRequest
        .request({
          url: '/admin/role',
          method: 'POST',
          data: roleForm.value
        })
        .then((res) => {
          if (res.data.code) {
            ElNotification({
              title: '成功',
              message: res.data.message,
              type: 'success'
            })
            listRoles()
          } else {
            ElNotification({
              title: '失败',
              message: res.data.message,
              type: 'error'
            })
          }
          roleMenuVisible.value = false
        })
    }

    // 资源dialog 相关
    const roleResourceVisible = ref(false)

    const resourceTree = ref()

    const openResourceModel = (role: any) => {
      // this.$nextTick(function() {
      //   this.$refs.resourceTree.setCheckedKeys([]);
      // });
      roleForm.value = {
        id: role.id,
        menuIdList: role.menuIdList,
        resourceIdList: role.resourceIdList,
        roleDescription: role.roleDescription,
        roleName: role.roleName
      }
      roleResourceVisible.value = true
    }

    const saveOrUpdateRoleResource = () => {
      roleForm.value.menuIdList = []
      roleForm.value.resourceIdList = resourceTree.value.getCheckedKeys()
      yhRequest
        .request({
          url: '/admin/role',
          method: 'POST',
          data: roleForm.value
        })
        .then((res) => {
          if (res.data.code) {
            ElNotification({
              title: '成功',
              message: res.data.message,
              type: 'success'
            })
            listRoles()
          } else {
            ElNotification({
              title: '失败',
              message: res.data.message,
              type: 'error'
            })
          }
          roleResourceVisible.value = false
        })
    }

    // 批量删除对话框
    const isDeleteVisible = ref(false)

    const getSelectionData = (selection: any[]) => {
      roleIdList.value = selection.map((item: any) => item.id)
    }

    const deleteRoles = (id?: number) => {
      if (id) {
        roleIdList.value = [id]
      }
      yhRequest
        .request({
          url: '/admin/roles',
          method: 'DELETE',
          data: roleIdList.value
        })
        .then((res) => {
          if (res.data.code) {
            ElNotification({
              title: '成功',
              message: res.data.message,
              type: 'success'
            })
            listRoles()
          } else {
            ElNotification({
              title: '失败',
              message: res.data.message,
              type: 'error'
            })
          }
          isDeleteVisible.value = false
        })
    }

    const searchRoles = (key: string) => {
      keywords.value = key
      listRoles()
    }

    const sizeChange = () => {
      listRoles()
    }

    return {
      route,
      roleList,
      roleListCount,
      rolePage,
      menuList,
      resourceList,
      resourceTree,

      roleMenuVisible,
      roleForm,
      menuTitle,
      menuTree,

      roleResourceVisible,

      isDeleteVisible,
      openMenuModel,
      saveOrUpdateRoleMenu,
      openResourceModel,
      saveOrUpdateRoleResource,
      getSelectionData,
      deleteRoles,
      dateFormat,
      searchRoles,
      sizeChange
    }
  }
})
</script>

<style lang="less" scoped>
.main-card {
  min-height: calc(100vh - 126px);
  .title {
    // position: absolute;
    // left: 0;
    font-size: 16px;
    font-weight: 700;
    color: #202a34;
  }

  .title:before {
    content: '';
    width: 24px;
    height: 16px;
    border-left: 3px solid #0081ff;
    margin-right: 20px;
  }
  .operation-container {
    display: flex;
    align-items: center;
    // margin-bottom: 1.25rem;
    padding-top: 2.25rem;
  }

  .header {
    padding-top: 30px;
  }
}
</style>
