<template>
  <el-card>
    <yh-table
      :Data="userList"
      v-bind="tableConfig"
      @search-btn="searchUser"
      @update:page="handlePageStatus"
      :page="pageConfig"
      :page-count="userCount"
    >
      <template #header>
        <div class="base-page-title">
          {{ route.name }}
        </div>
      </template>
      <template #linkAvatar="scope">
        <el-image :src="scope.row.avatar" fit="fill"></el-image>
      </template>
      <template #roleList="scope">
        <el-tag v-for="role in scope.row.roleList" :key="role.id">{{ role.roleName }}</el-tag>
      </template>
      <template #createTime="scope">
        {{ dateFormat(scope.row.createTime) }}
      </template>
      <template #recentLogin="scope">
        {{ dateFormat(scope.row.recentLogin) }}
      </template>
      <template #edit="scope">
        <el-button type="primary" size="mini" @click="openEditModel(scope.row)"> 编辑 </el-button>
      </template>
    </yh-table>
    <el-dialog v-model="editModal" width="30%" title="修改用户">
      <el-form label-width="60px" size="medium" :model="userForm">
        <el-form-item label="昵称">
          <el-input v-model="userForm.nickname" style="width: 220px" />
        </el-form-item>
        <el-form-item label="角色">
          <el-checkbox-group v-model="roleIdList">
            <el-checkbox v-for="item in userRoleList" :key="item.id" :label="item.id">
              {{ item.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editModal = false">取 消</el-button>
        <el-button type="primary" @click="editUserRole"> 确 定 </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

import YhTable from '@/components/common/table/YhTable.vue'
import { tableConfig } from './config/user.config'
import { dateFormat } from '@/utils/filter'
import { getUserRoles, updateUserInfo } from '@/api/user'

export default defineComponent({
  components: {
    YhTable
  },
  setup() {
    const store = useStore()
    const route = useRoute()

    onMounted(() => {
      listUsers()
      listRoles()
    })

    const userList = computed(() => store.state.userModule.userList)
    const userCount = computed(() => store.state.userModule.userCount)
    const userRoleList = ref()
    const pageConfig = ref({
      current: 1,
      size: 10
    })
    const keywords = ref('')
    const listUsers = () => {
      store.dispatch('userModule/getUserList', {
        ...pageConfig.value,
        keywords: keywords.value
      })
    }

    const listRoles = () => {
      getUserRoles().then((res: any) => {
        userRoleList.value = res.data.data
      })
    }
    const searchUser = (keys: string) => {
      keywords.value = keys
      listUsers()
    }

    const handlePageStatus = (page: { current: number; size: number }) => {
      pageConfig.value = { ...page }
      listUsers()
    }

    const editModal = ref(false)

    const userForm = ref({
      userInfoId: -1,
      nickname: '',
      roleList: []
    })

    const roleIdList = ref<Array<number>>([])

    const openEditModel = (user: any) => {
      roleIdList.value = []
      userForm.value = JSON.parse(JSON.stringify(user))
      userForm.value.roleList.forEach((item: any) => {
        roleIdList.value.push(item.id)
      })
      editModal.value = true
    }

    const editUserRole = () => {
      updateUserInfo({
        nickname: userForm.value.nickname,
        userInfoId: userForm.value.userInfoId,
        roleIdList: roleIdList.value
      }).then((res: any) => {
        if (res.data.code) {
          listUsers()
        }
        editModal.value = false
      })
    }
    return {
      route,
      tableConfig,
      pageConfig,
      userList,
      userCount,
      searchUser,
      handlePageStatus,
      editModal,
      userForm,
      roleIdList,
      userRoleList,
      openEditModel,
      editUserRole,
      dateFormat
    }
  }
})
</script>
