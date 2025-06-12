<template>
  <div>
    <div class="name item">
      <span class="__label">模型名称: </span>
      <div class="__value">
        <el-input class="__input" placeholder="请输入名称"
          :class="invalide ? 'invalide' : ''" v-model="name" @input="hideVaildMsg"></el-input>
        <span v-if="invalide" class="invalid_msg">模型名称重复，请修改模型名称</span>
      </div>
    </div>

    <div class="item">
      <span class="__label">模型专业: </span>
      <div class="__value">
        <el-select v-model="zy" placeholder="请选择专业" clearable multiple>
          <el-option v-for="item in $myDic.zyList" :key="item" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
    </div>

    <div class="file item">
      <span class="__label">文件名称: </span>
      <div class="__value">
        <span class="upload_files" v-if="fileNames">{{fileNames}} <icon class="iconfont bj-icon-delete" @click="deleteFile"></icon></span>
        <el-upload
          v-loading="uploading"
          class="avatar-uploader __value"
          action=""
          :show-file-list="false"
          :http-request="upload"
        >
          <span class="upload_span">{{ fileNames ? '重新上传' : '上传文件' }}</span>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      zy: null,
      files: [
        // {
        //   objectKey: null,
        //   name: '',
        //   size: 0,
        //   md5: ""
        // }
      ],

      invalide: false,
      uploading: false
    }
  },
  computed: {
    fileNames () {
      return this.files.map(f => {
        return f.name
      }).join(',')
    }
  },
  mounted () {
    if (!this.uploader) {
      this.uploader = gdaJsSDK.Uploader
    }
  },
  methods: {
    deleteFile () {
      this.files = []
    },
    showValideMsg () {
      this.invalide = true
    },
    resetForm () {
      this.name = ''
      this.zy = null
      this.files = []

      this.hideVaildMsg()
    },

    hideVaildMsg () {
      this.invalide = false
    },
    async upload({file}) {
      const uploadInfoUrl = 'api/bim-model-check/bimFile/passAuth/getUploadUrl'
      this.uploading = true
      const uploadRes = await this.uploader.upload({file, uploadInfoUrl})
      if (uploadRes && uploadRes.objectKey) {
        this.files = [{
          objectKey: uploadRes.objectKey,
          name: uploadRes.objectName,
          size: uploadRes.objectSize,
          md5: uploadRes.md5
        }]
      }
      this.uploading = false
    },
  }
}
</script>

<style lang="less" scoped>
.item {
  display: flex;
  margin-bottom: 16px;

  .__label{
    width: 74px;
    line-height: 32px;
  }
  .__value{
    flex-grow: 1;
    position: relative;
  }

  .upload_span{
    line-height: 32px;
  }
  .upload_files {
    line-height: 32px;
    margin-right: 16px;
    icon{
      &:hover{
        cursor: pointer;
        color: #0050B3;
      }
    }
  }
}
.upload_span{
  color: #0050B3;
  &:hover{
    cursor: pointer;
    text-decoration: underline;
  }
}

.invalid_msg{
  position: absolute;
  width: 200px;
  left: 0px;
  bottom: -16px;
  font-size: 12px;
  color: #f33;
}

.avatar-uploader{
  display: inline-block;
}
</style>
