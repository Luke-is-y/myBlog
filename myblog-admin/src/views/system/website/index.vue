<template>
  <el-card>
    <el-tabs v-model="activeName">
      <!-- 修改信息 -->
      <el-tab-pane label="网站信息" name="info">
        <el-form label-width="100px" :model="websiteConfigForm" label-position="left">
          <el-form-item label="网站头像">
            <el-upload
              drag
              action="http://upload-cn-east-2.qiniup.com"
              :data="{ token }"
              :on-success="webUploadCover"
            >
              <div v-if="websiteConfigForm.websiteAvatar == ''"></div>
              <el-image v-else :src="websiteConfigForm.websiteAvatar" :show-file-list="false" />
            </el-upload>
          </el-form-item>
          <el-form-item label="网站名称">
            <el-input v-model="websiteConfigForm.websiteName" size="small" style="width: 400px" />
          </el-form-item>
          <el-form-item label="网站作者">
            <el-input v-model="websiteConfigForm.websiteAuthor" size="small" style="width: 400px" />
          </el-form-item>
          <el-form-item label="网站简介">
            <el-input v-model="websiteConfigForm.websiteIntro" size="small" style="width: 400px" />
          </el-form-item>
          <el-form-item label="网站创建日期">
            <el-date-picker
              style="width: 400px"
              value-format="yyyy-MM-dd"
              v-model="websiteConfigForm.websiteCreateTime"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="网站公告">
            <el-input
              v-model="websiteConfigForm.websiteNotice"
              placeholder="请输入公告内容"
              style="width: 400px"
              type="textarea"
              :rows="5"
            />
          </el-form-item>
          <el-form-item label="备案号">
            <el-input
              v-model="websiteConfigForm.websiteRecordNo"
              size="small"
              style="width: 400px"
            />
          </el-form-item>
          <el-button
            type="primary"
            size="medium"
            style="margin-left: 6.3rem"
            @click="updateWebsiteConfig"
          >
            修改
          </el-button>
        </el-form>
      </el-tab-pane>
      <!-- 网站公告 -->
      <el-tab-pane label="社交信息" name="notice">
        <el-form label-width="70px" :model="websiteConfigForm">
          <el-form-item label="QQ">
            <el-input
              v-model="websiteConfigForm.qq"
              size="small"
              style="width: 400px; margin-right: 1rem"
            />
          </el-form-item>
          <el-form-item label="Github">
            <el-input
              v-model="websiteConfigForm.github"
              size="small"
              style="width: 400px; margin-right: 1rem"
            />
          </el-form-item>
          <el-form-item label="Gitee">
            <el-input
              v-model="websiteConfigForm.gitee"
              size="small"
              style="width: 400px; margin-right: 1rem"
            />
          </el-form-item>
          <el-button
            type="primary"
            size="medium"
            style="margin-left: 4.375rem"
            @click="updateWebsiteConfig"
          >
            修改
          </el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="七牛图床设置">
        <el-form label-width="130px" :model="websiteConfigForm" label-position="left">
          <el-form-item label="设定AccessKey" required>
            <el-input v-model="websiteConfigForm.AccessKey" size="small" style="width: 400px" />
          </el-form-item>
          <el-form-item label="设定SecretKey" required>
            <el-input v-model="websiteConfigForm.SecretKey" size="small" style="width: 400px" />
          </el-form-item>
          <el-form-item label="设定存储空间名" required>
            <el-input v-model="websiteConfigForm.Bucket" size="small" style="width: 400px" />
          </el-form-item>
          <el-form-item label="设定访问网址" required>
            <el-input v-model="websiteConfigForm.Domain" size="small" style="width: 400px" />
          </el-form-item>
          <el-form-item label="确认存储区域">
            <el-input v-model="websiteConfigForm.StorageArea" size="small" style="width: 400px" />
          </el-form-item>
          <el-form-item label="设定网址后缀">
            <el-input v-model="websiteConfigForm.WebsiteSuffix" size="small" style="width: 400px" />
          </el-form-item>
          <el-form-item label="指定存储路径">
            <el-input v-model="websiteConfigForm.StoragePath" size="small" style="width: 400px" />
          </el-form-item>
          <el-button
            type="primary"
            size="medium"
            style="margin-left: 6.3rem"
            @click="updateWebsiteConfig"
          >
            修改
          </el-button>
        </el-form>
      </el-tab-pane>
      <!-- 修改密码 -->
      <el-tab-pane label="其他设置" name="password">
        <el-form label-width="120px" :model="websiteConfigForm" label-position="left">
          <el-row style="width: 600px">
            <el-col :md="12">
              <el-form-item label="用户头像">
                <el-upload
                  drag
                  action="http://upload-cn-east-2.qiniup.com"
                  :data="{ token }"
                  :on-success="userUploadCover"
                >
                  <div v-if="websiteConfigForm.userAvatar == ''"></div>
                  <el-image v-else :src="websiteConfigForm.userAvatar" :show-file-list="false" />
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="邮箱通知">
            <el-radio-group v-model="websiteConfigForm.isEmailNotice">
              <el-radio :label="0">关闭</el-radio>
              <el-radio :label="1">开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="评论审核">
            <el-radio-group v-model="websiteConfigForm.isCommentReview">
              <el-radio :label="0">关闭</el-radio>
              <el-radio :label="1">开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="留言审核">
            <el-radio-group v-model="websiteConfigForm.isMessageReview">
              <el-radio :label="0">关闭</el-radio>
              <el-radio :label="1">开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="打赏状态">
            <el-radio-group v-model="websiteConfigForm.isReward">
              <el-radio :label="0">关闭</el-radio>
              <el-radio :label="1">开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-row style="width: 600px" v-show="websiteConfigForm.isReward == 1">
            <el-col :md="12">
              <el-form-item label="微信收款码">
                <el-upload
                  action="/api/admin/config/images"
                  :show-file-list="false"
                  :on-success="handleWeiXinSuccess"
                >
                  <img
                    v-if="websiteConfigForm.weiXinQRCode"
                    :src="websiteConfigForm.weiXinQRCode"
                  />
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="支付宝收款码">
                <el-upload
                  action="/api/admin/config/images"
                  :show-file-list="false"
                  :on-success="handleAlipaySuccess"
                >
                  <img
                    v-if="websiteConfigForm.alipayQRCode"
                    :src="websiteConfigForm.alipayQRCode"
                  />
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="聊天室状态">
            <el-radio-group v-model="websiteConfigForm.isChatRoom">
              <el-radio :label="0">关闭</el-radio>
              <el-radio :label="1">开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Websocket地址" v-show="websiteConfigForm.isChatRoom == 1">
            <el-input v-model="websiteConfigForm.websocketUrl" size="small" style="width: 400px" />
          </el-form-item>
          <el-form-item label="音乐播放器状态">
            <el-radio-group v-model="websiteConfigForm.isMusicPlayer">
              <el-radio :label="0">关闭</el-radio>
              <el-radio :label="1">开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-button
            type="primary"
            size="medium"
            style="margin-left: 6.3rem"
            @click="updateWebsiteConfig"
          >
            修改
          </el-button>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'

import { getQiniuToken, getWebAllConfig, updateWebConfig } from '@/api/system/website'

export default defineComponent({
  setup() {
    onMounted(() => {
      getWebsiteConfig()
      getQiniuToken().then((res) => {
        token.value = res.data.data
      })
    })
    const token = ref('')

    interface websiteConfig {
      [key: string]: any
    }
    const websiteConfigForm: websiteConfig = ref({
      websiteAvatar: '',
      websiteName: '',
      websiteAuthor: '',
      websiteIntro: '',
      websiteNotice: '',
      websiteCreateTime: null,
      websiteRecordNo: '',
      qq: '',
      github: '',
      gitee: '',
      // qiniu
      AccessKey: '',
      SecretKey: '',
      Bucket: '',
      Domain: '', // 外链域名
      StorageArea: '', // 存储区域
      WebsiteSuffix: '', // 网站后缀
      StoragePath: '', // 存储路径
      // qiniu
      userAvatar: '',
      isReward: 1,
      weiXinQRCode: '',
      alipayQRCode: '',
      isChatRoom: 1,
      websocketUrl: '',
      isMusicPlayer: 1,
      isEmailNotice: 1,
      isCommentReview: 0,
      isMessageReview: 0
    })
    const activeName = ref('info')

    const webUploadCover = (response: any) => {
      websiteConfigForm.value.websiteAvatar = response.fileUrl
    }

    const userUploadCover = (response: any) => {
      websiteConfigForm.value.userAvatar = response.fileUrl
    }

    const getWebsiteConfig = () => {
      getWebAllConfig().then((res) => {
        websiteConfigForm.value = { ...websiteConfigForm.value, ...res.data.data }
      })
    }

    const handleWeiXinSuccess = (response: any) => {
      websiteConfigForm.value.weiXinQRCode = response.data
    }
    const handleAlipaySuccess = (response: any) => {
      websiteConfigForm.value.alipayQRCode = response.data
    }

    const updateWebsiteConfig = () => {
      const websiteConfig: any[] = []
      Object.keys(websiteConfigForm.value).forEach((key: any) => {
        if (websiteConfigForm.value[key] && websiteConfigForm.value[key]?.length) {
          websiteConfig.push({
            configKey: key,
            configValue: websiteConfigForm.value[key]
          })
        }
      })
      updateWebConfig(websiteConfig)
    }

    return {
      token,
      websiteConfigForm,
      activeName,
      handleWeiXinSuccess,
      handleAlipaySuccess,
      updateWebsiteConfig,
      webUploadCover,
      userUploadCover
    }
  }
})
</script>
