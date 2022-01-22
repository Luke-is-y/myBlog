<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-title">管理员登录</div>
      <!-- 登录表单 -->
      <el-form status-icon :model="loginForm" :rules="rules" ref="ruleForm" class="login-form">
        <!-- 用户名输入框 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名" @keyup.enter="login" />
        </el-form-item>
        <!-- 密码输入框 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            show-password
            placeholder="密码"
            @keyup.enter="login"
          />
        </el-form-item>
      </el-form>
      <!-- 登录按钮 -->
      <el-button type="primary" @click="login">登录</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import { ElForm, ElMessage } from 'element-plus'

import yhRequest from '@/utils/service'

export default defineComponent({
  setup() {
    const store = useStore()
    const router = useRouter()
    const loginForm = reactive({
      username: 'hpf',
      password: '123456'
    })
    const rules = reactive({
      username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
      password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
    })

    const ruleForm = ref<InstanceType<typeof ElForm>>()

    const login = () => {
      ruleForm.value?.validate((valid) => {
        if (valid) {
          //发送登录请求
          yhRequest
            .request({
              url: '/login',
              method: 'POST',
              params: loginForm
            })
            .then((res) => {
              console.log(res)
              window.sessionStorage.setItem('token', res.data.data.token)
              if (res.data.data.info) {
                // 登录后保存用户信息
                store.commit('userModule/login', res.data.data.info)
                // 加载用户菜单
                store.dispatch('userModule/generaMenu').then(() => {
                  ElMessage({
                    message: '登录成功',
                    type: 'success'
                  })
                  router.push('/')
                })
              } else {
                ElMessage({
                  message: '账号或密码错误',
                  type: 'error'
                })
              }
            })
        } else {
          return false
        }
      })
    }

    return {
      loginForm,
      rules,
      ruleForm,

      login
    }
  }
})
</script>

<style scoped>
.login-container {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: url(https://www.static.talkxj.com/config/0w3pdr.jpg) center center / cover no-repeat;
}
.login-card {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  background: #fff;
  padding: 170px 60px 180px;
  width: 350px;
}
.login-title {
  color: #303133;
  font-weight: bold;
  font-size: 1rem;
}
.login-form {
  margin-top: 1.2rem;
}
.login-card button {
  margin-top: 1rem;
  width: 100%;
}
</style>
