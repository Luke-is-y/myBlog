<template>
  <el-card>
    <el-tabs v-model="activeName">
      <!-- 修改信息 -->
      <el-tab-pane label="修改信息" name="info">
        <div class="setting__info-container">
          <el-form label-width="70px" :model="infoForm" style="width: 320px">
            <el-form-item label="昵称">
              <el-input v-model="infoForm.nickname" size="small" />
            </el-form-item>
            <el-form-item label="个人简介">
              <el-input v-model="infoForm.info" size="small" />
            </el-form-item>
            <el-form-item label="个人网站">
              <el-input v-model="infoForm.webSite" size="small" />
            </el-form-item>
            <el-button
              @click="updateInfo"
              type="primary"
              size="medium"
              style="margin-left: 4.375rem"
            >
              修改
            </el-button>
          </el-form>
          <div class="setting__avatar-container">
            <div class="setting__avatar-text">用户头像</div>
            <el-upload
              class="setting__avatar-uploader"
              action="http://upload-cn-east-2.qiniup.com"
              :data="{ token }"
              :show-file-list="false"
              :on-success="updateAvatar"
            >
              <img v-if="infoForm.avatar" :src="infoForm.avatar" class="setting__avatar" />
              <el-icon v-else class="setting__avatar-uploader-icon"><plus /></el-icon>
            </el-upload>
          </div>
        </div>
      </el-tab-pane>
      <!-- 修改密码 -->
      <el-tab-pane label="修改密码" name="password">
        <el-form label-width="70px" :model="passwordForm" style="width: 320px">
          <el-form-item label="旧密码">
            <el-input
              @keyup.enter="updatePassword"
              v-model="passwordForm.oldPassword"
              size="small"
              show-password
            />
          </el-form-item>
          <el-form-item label="新密码">
            <el-input
              @keyup.enter="updatePassword"
              v-model="passwordForm.newPassword"
              size="small"
              show-password
            />
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input
              @keyup.enter="updatePassword"
              v-model="passwordForm.confirmPassword"
              size="small"
              show-password
            />
          </el-form-item>
          <el-button
            type="primary"
            size="medium"
            style="margin-left: 4.4rem"
            @click="updatePassword"
          >
            修改
          </el-button>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { getQiniuToken } from '@/api/system/website'
import { updateUserInfo, updateUserPassword } from '@/api/setting'
import { Plus } from '@element-plus/icons-vue'
export default defineComponent({
  components: {
    Plus
  },
  setup() {
    const store = useStore()
    onMounted(() => {
      getQiniuToken().then((res) => {
        token.value = res.data.data
      })
    })
    const token = ref('')
    const infoForm = computed(() => store.state.userModule.user)

    const activeName = ref('info')
    const updateAvatar = (response: any) => {
      infoForm.value.avatar = response.fileUrl
    }

    const updateInfo = () => {
      if (infoForm.value.nickname.trim() == '') {
        ElMessage({
          type: 'error',
          message: '昵称不能为空'
        })
        return false
      }
      updateUserInfo(infoForm.value).then((res) => {
        if (res.data.code) {
          store.commit('updateUserInfo', infoForm)
        }
      })
    }

    const passwordForm = ref({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    const updatePassword = () => {
      if (passwordForm.value.oldPassword.trim() == '') {
        ElMessage({
          type: 'error',
          message: '旧密码不能为空'
        })
        return false
      }
      if (passwordForm.value.newPassword.trim() == '') {
        ElMessage({
          type: 'error',
          message: '新密码不能为空'
        })
        return false
      }
      if (passwordForm.value.newPassword.length < 6) {
        ElMessage({
          type: 'error',
          message: '新密码不能少于6位'
        })
        return false
      }
      if (passwordForm.value.newPassword != passwordForm.value.confirmPassword) {
        ElMessage({
          type: 'error',
          message: '两次密码输入不一致'
        })
        return false
      }
      updateUserPassword({
        newPassword: passwordForm.value.newPassword,
        oldPassword: passwordForm.value.oldPassword
      }).then((res) => {
        if (res.data.code) {
          passwordForm.value.oldPassword = ''
          passwordForm.value.newPassword = ''
          passwordForm.value.confirmPassword = ''
        }
      })
    }

    return {
      token,
      infoForm,
      passwordForm,
      activeName,
      updateAvatar,
      updateInfo,
      updatePassword
    }
  }
})
</script>

<style scoped>
.setting__avatar-container {
  margin-left: 300px;
}

.setting__avatar-text {
  margin: 0 0 10px 30px;
}
.setting__avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.setting__avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.setting__avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.setting__avatar {
  width: 120px;
  height: 120px;
  display: block;
}
.setting__info-container {
  display: flex;
  align-items: center;
}
</style>
