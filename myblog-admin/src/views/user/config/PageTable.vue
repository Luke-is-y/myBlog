<template>
  <div class="page-table">
    <yh-table :Data="userList" v-bind="tableConfig">
      <template #header>
        <div class="title">
          {{ route.name }}
        </div>
      </template>

      <template #linkAvatar="scope">
        <el-image :src="scope.row.avatar" fit="fill"></el-image>
      </template>
      <template #roleList="scope">
        <el-tag v-for="role in scope.row.roleList" :key="role.id">{{ role.roleName }}</el-tag>
      </template>
      <template #edit="scope">
        <el-button type="primary" size="mini" @click="openEditModel(scope.row)"> 编辑 </el-button>
      </template>
    </yh-table>
    <el-dialog v-model="isEdit" width="30%">
      <template #title>
        <div class="dialog-title-container">修改用户</div>
      </template>
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
        <el-button @click="isEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUserRole"> 确 定 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, onMounted, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

import YhTable from '@/components/common/table/YhTable.vue'
import { ITable } from '@/components/common/table/types'

import yhRequest from '@/utils/request'

import { ElNotification } from 'element-plus'
export default defineComponent({
  components: {
    YhTable
  },
  props: {
    tableConfig: {
      type: Object as PropType<ITable>,
      default: () => ({})
    }
  },
  setup() {
    const store = useStore()
    const route = useRoute()

    onMounted(() => {
      getUserListData()
      listRoles()
      console.log(userList.value)
    })

    const userList = computed(() => store.state.userModule.userList)
    const userRoleList = ref()

    const getUserListData = () => {
      store.dispatch('userModule/getUserList')
    }

    const listRoles = () => {
      yhRequest
        .request({
          url: '/admin/users/role',
          method: 'GET'
        })
        .then((res: any) => {
          console.log(res)
          userRoleList.value = res.data.data
        })
    }

    const isEdit = ref(false)

    const userForm = ref({
      userInfoId: null,
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
      isEdit.value = true
    }

    const editUserRole = () => {
      // userForm.value.roleIdList = roleIdList.value
      yhRequest
        .request({
          url: '/admin/users/role',
          method: 'POST',
          data: roleIdList.value
        })
        .then((res: any) => {
          if (res.data.code) {
            ElNotification({
              title: '成功',
              message: res.data.message,
              type: 'success'
            })
            getUserListData()
          } else {
            ElNotification({
              title: '失败',
              message: res.data.message,
              type: 'error'
            })
          }
          isEdit.value = false
        })
    }
    return {
      route,
      userList,
      isEdit,
      userForm,
      roleIdList,
      userRoleList,
      openEditModel,
      editUserRole
    }
  }
})
</script>

<style scoped>
.title {
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
</style>
