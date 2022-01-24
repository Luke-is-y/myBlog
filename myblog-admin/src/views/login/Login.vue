<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-title">管理员登录</div>
      <el-form status-icon :model="loginForm" :rules="rules" ref="ruleForm" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名" @keyup.enter="login" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            show-password
            placeholder="密码"
            @keyup.enter="login"
          />
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="login" class="login-btn">登录</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElForm } from 'element-plus'
import { Login } from '@/api/login'

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
          Login(loginForm).then((res) => {
            window.sessionStorage.setItem('token', res.data.data.token)
            if (res.data.data.info) {
              // 登录后保存用户信息
              store.commit('userModule/login', res.data.data.info)
              // 加载用户菜单
              store.dispatch('userModule/generaMenu').then(() => {
                router.push('/')
              })
            }
          })
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

<style lang="less">
.login-container {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: url(https://www.static.talkxj.com/config/0w3pdr.jpg) center center / cover no-repeat;
  .login-card {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    background: #fff;
    padding: 170px 60px 180px;
    width: 350px;
    .login-title {
      color: #303133;
      font-weight: bold;
      font-size: 1rem;
    }
    .login-form {
      margin-top: 1.2rem;
    }
    .login-btn {
      margin-top: 1rem;
      width: 100%;
    }
  }
}
</style>
