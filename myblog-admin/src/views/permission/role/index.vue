<template>
  <el-card>
    <yh-table
      :Data="roleList"
      v-bind="tableConfig"
      :page="pageConfig"
      :pageCount="roleListCount"
      @search-btn="searchRoles"
      @add-btn="openMenuModal(null)"
      @del-btn="delVisible = true"
      @selection="selectChange"
      @update:page="handlePageStatus"
    >
      <template #header>
        <div class="base-page-title">
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
          <el-button type="text" size="small" icon="plus" @click="openMenuModal(scope.row)"
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
    <el-dialog v-model="roleMenuModal" width="30%" :title="menuTitle">
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
            show-checkbox
            node-key="id"
            ref="menuTree"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button @click="roleMenuModal = false">取 消</el-button>
          <el-button type="primary" @click="editRoleMenu"> 确 定 </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 资源对话框 -->
    <el-dialog v-model="roleResourceModal" width="30%" top="9vh" title="修改资源权限">
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
          <el-button @click="roleResourceModal = false">取 消</el-button>
          <el-button type="primary" @click="editRoleResource"> 确 定 </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 批量删除对话框 -->
    <el-dialog v-model="delVisible" width="30%" title="提示">
      <div style="font-size: 1rem">是否删除选中项？</div>
      <template #footer>
        <div>
          <el-button @click="delVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteRoles()"> 确 定 </el-button>
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
import { updateRoleMenu, delRoles } from '@/api/permission/role'
import { tableConfig } from './config/role.config'
import { RoleForm } from './config/type'
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
      listRoles()
    })

    // 表格相关
    const roleList = computed(() => store.state.roleModule.roleList)
    const roleIdList = ref<number[]>()
    const roleListCount = computed(() => store.state.roleModule.roleListCount)
    const pageConfig = ref({
      current: 1,
      size: 10
    })
    const keywords = ref('')
    const listRoles = () => {
      store.dispatch('roleModule/getRoleList', {
        ...pageConfig.value,
        keywords: keywords.value
      })
      store.dispatch('roleModule/getMenuList')
      store.dispatch('roleModule/getResourceList')
    }

    const searchRoles = (key: string) => {
      keywords.value = key
      listRoles()
    }

    const selectChange = (selection: any[]) => {
      roleIdList.value = selection.map((item: any) => item.id)
    }

    const handlePageStatus = (page: { current: number; size: number }) => {
      pageConfig.value = { ...page }
      listRoles()
    }

    // 公共
    const roleForm = ref<RoleForm>({
      roleName: '',
      roleDescription: '',
      resourceIdList: [],
      menuIdList: []
    })

    const openMenuModal = (role: any) => {
      if (role) {
        menuTitle.value = '修改角色'
        roleForm.value = JSON.parse(JSON.stringify(role))
        menuTree.value?.setCheckedKeys(roleForm.value.menuIdList)
      } else {
        menuTitle.value = '新增角色'
        menuTree.value?.setCheckedKeys([])
        roleForm.value = {
          roleName: '',
          roleDescription: '',
          resourceIdList: [],
          menuIdList: []
        }
      }
      roleMenuModal.value = true
    }

    const openResourceModel = (role: any) => {
      resourceTree.value?.setCheckedKeys([])
      roleForm.value = {
        id: role.id,
        menuIdList: role.menuIdList,
        resourceIdList: role.resourceIdList,
        roleDescription: role.roleDescription,
        roleName: role.roleName
      }
      roleResourceModal.value = true
    }

    // 菜单dialog相关
    const menuList = computed(() => store.state.roleModule.menuList)
    const roleMenuModal = ref(false)
    const menuTitle = ref('修改角色')
    const menuTree = ref()
    const editRoleMenu = () => {
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

      roleForm.value.menuIdList = menuTree.value.getCheckedKeys(false)

      updateRoleMenu(roleForm.value).then((res) => {
        if (res.data.code) {
          listRoles()
        }
        roleMenuModal.value = false
      })
    }

    // 资源dialog相关
    const roleResourceModal = ref(false)
    const resourceList = computed(() => store.state.roleModule.resourceList)
    const resourceTree = ref()
    const editRoleResource = () => {
      roleForm.value.menuIdList = []
      roleForm.value.resourceIdList = resourceTree.value.getCheckedKeys()
      updateRoleMenu(roleForm.value).then((res) => {
        if (res.data.code) {
          listRoles()
        }
        roleResourceModal.value = false
      })
    }

    // 批量删除dialog相关
    const delVisible = ref(false)
    const deleteRoles = (id?: number) => {
      if (id) {
        roleIdList.value = [id]
      }
      delRoles(roleIdList.value).then((res) => {
        if (res.data.code) {
          listRoles()
        }
        delVisible.value = false
      })
    }

    return {
      route,
      roleForm,
      openMenuModal,
      openResourceModel,

      // 表格相关
      roleList,
      tableConfig,
      pageConfig,
      roleListCount,
      searchRoles,
      selectChange,
      handlePageStatus,

      // 菜单dialog相关
      roleMenuModal,
      menuTitle,
      menuList,
      menuTree,
      editRoleMenu,

      // 资源dialog
      roleResourceModal,
      resourceList,
      resourceTree,
      editRoleResource,

      // 批量删除dialog
      delVisible,
      deleteRoles,

      dateFormat
    }
  }
})
</script>
