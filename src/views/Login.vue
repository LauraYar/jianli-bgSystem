<template>
  <div class="main">
    <div class="login">
      <div class="title">监利市农业信息后台管理系统</div>
      <!-- form表单 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        label-width="0px"
        class="login_form"
        :rules="loginFormRules"
      >
        <el-form-item prop="username">
          <el-input
            placeholder="请输入用户名"
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            type="password"
            v-model="loginForm.password"
            prefix-icon="el-icon-eleme"
          >
          </el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import userService from '@/global/service/user';

// import DataStore from '@/globals/storage/index';
export default {
  data() {
    return {
      // loginFormRef: {},
      loginForm: { username: 'admin', password: '123456' },
      // 表单的验证规则对象
      loginFormRules: {
        //  验证用户名是否符合规范
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    //点击重置登录表单
    resetLoginForm() {
      console.log(this);
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate((valid) => {
        if (!valid) return;
        let params = {
          username: this.loginForm.username,
          password: this.loginForm.password,
        };
        userService
          .login(params)
          .then((res) => {
            if (res.status === 200) {
              let token = res.data;
              window.sessionStorage.setItem('token', token);
              this.$router.push('/home');
            } else if (res.status === 500) {
              this.$message.info('该用户不存在或密码错误！');
            }
          })
          .catch((ex) => {
            this.$message.error('登录异常！', ex);
          });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  background: url('../assets/images/login-bg.jpg') no-repeat center;
  background-size: 100% 100%;
  width: 100%;
  height: 100vh;
  opacity: 0.8;
  .login {
    position: absolute;
    right: 10%;
    bottom: 30%;
    width: 500px;
    height: 340px;
    background: #fff;
    border-radius: 40px;
    .title {
      margin: 40px;
      text-align: center;
      font-size: 24px;
    }
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
