<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-title">用户注册</div>
      <el-form
        status-icon
        :model="registerForm"
        :rules="rules"
        ref="ruleForm"
        class="register-form"
      >
        <el-form-item prop="username">
          <el-input v-model="registerForm.username" placeholder="用户名" @keyup.enter="register" />
        </el-form-item>
        <el-form-item prop="emial">
          <el-input v-model="registerForm.email" placeholder="邮箱" @keyup.enter="register" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            show-password
            placeholder="密码"
            @keyup.enter="register"
          />
        </el-form-item>
      </el-form>
      <div class="login-and-register-btn">
        <el-button type="primary" @click="register" class="register-btn">注册</el-button>
        <el-button type="primary" @click="login" class="login-btn">返回登录</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElForm } from 'element-plus'
import { userRegister } from '@/api/register'

export default defineComponent({
  setup() {
    const router = useRouter()
    const registerForm = reactive({
      username: '',
      email: '',
      password: ''
    })
    const rules = reactive({
      username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
      password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
      email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }]
    })

    const ruleForm = ref<InstanceType<typeof ElForm>>()

    const login = () => {
      router.push('/login')
    }
    const register = () => {
      ruleForm.value?.validate((valid) => {
        if (valid) {
          userRegister(registerForm).then((res) => {
            if (res.data.success) {
              router.push('/login')
            }
          })
        }
      })
    }

    return {
      login,
      registerForm,
      rules,
      ruleForm,
      register
    }
  }
})
</script>

<style lang="less">
.register-container {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: url(https://pic3.zhimg.com/80/v2-73c5ff9597484a1bdb4d42fe260c4aa9_r.jpg) center center /
    cover no-repeat;
  .register-card {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    background: #fff;
    padding: 170px 60px 180px;
    width: 350px;
    .register-title {
      color: #303133;
      font-weight: bold;
      font-size: 1rem;
    }
    .register-form {
      margin-top: 1.2rem;
    }
  }
  .login-and-register-btn {
    display: flex;
    justify-content: space-between;
  }

  .login-btn,
  .register-btn {
    flex: 1;
  }
}
</style>
