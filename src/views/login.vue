<template>
  <div class="login">
    <div class="title-style"></div>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
    >
      <h3 class="title">欢迎登录</h3>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          auto-complete="off"
          placeholder="账号（姓名）"
        >
          <i
            slot="prefix"
            class="el-icon-user-solid el-input__icon input-icon"
          ></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <!-- <svg-icon
            slot="prefix"
            icon-class="password"
            class="el-input__icon input-icon"
          /> -->
          <i slot="prefix" class="el-icon-lock el-input__icon input-icon"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="captchaOnOff">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <!-- <i slot="prefix" class="el-icon-lock el-input__icon input-icon"></i> -->
          <svg-icon
            slot="prefix"
            icon-class="safe"
            class="el-input__icon input-icon"
          />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img" />
        </div>
      </el-form-item>
      <el-checkbox
        v-model="loginForm.rememberMe"
        style="margin: 0px 0px 25px 0px"
        >记住密码</el-checkbox
      >
      <el-form-item style="width: 100%">
        <el-button
          class="login-btn"
          :loading="loading"
          size="medium"
          type="primary"
          style="width: 100%"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div style="float: right;color: blue;" v-if="register">
          <router-link class="link-type" :to="'/register'"
            >立即注册</router-link
          >
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <!-- <span>Copyright © 2018-2022 dadadadada.vip All Rights Reserved.</span> -->
    </div>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'
import { getRouters } from '@/api/menu'

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" }
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }]
      },
      loading: false,
      // 验证码开关
      captchaOnOff: true,
      // 注册开关
      register: true,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.captchaOnOff = res.captchaOnOff === undefined ? true : res.captchaOnOff;
        if (this.captchaOnOff) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          this.$store.dispatch("Login", this.loginForm).then(() => {
            this.getRouter();
            // this.$router.push({ path: this.redirect || "/" }).catch(()=>{
            // });
          }).catch(() => {
            this.loading = false;
            if (this.captchaOnOff) {
              this.getCode();
            }
          });
        }
      });
    },
    // 向后端请求路由数据
    getRouter(){
      getRouters().then(res => {
        this.path = '';
        this.findChildrenPath(res.data);
        console.log(this.path)
        this.$router.push({ path: this.path }).catch(()=>{});
      })
    },
    // 查找登录页
    findChildrenPath(list){
      this.path = this.path + '/' + list[0].path.replace('/', '');
      if (list[0].children && list[0].children.length > 0) {
        return this.findChildrenPath(list[0].children);
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url('../assets/images/test22.png');
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #fff;
}

.title-style {
  width: 418px;
  height: 87px;
  position: absolute;
  top: 7px;
  left: 50%;
  transform: translate(-50%, 0);
}

.login-form {
  background: url('../assets/images/border.png') no-repeat center center;
  background-size: 100% 100%;
  border-radius: 6px;
  width: 500px;
  padding: 80px 76px 60px 76px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
      background: #205ba7;
      color: #ffffff;
      border-radius: 0;
      border-color: #1771bf;
    }
  }
  .el-checkbox__inner {
    background: #205ba7;
    color: #ffffff;
    border-radius: 0;
    border-color: #1771bf;
  }
  .el-checkbox__label {
    color: #c0c4cc;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #4aabfe;
    border-color: #4aabfe;
  }
  .login-btn {
    background: #4aabfe;
    border-radius: 0;
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
  .el-input__icon {
    color: #4aaafd;
  }
}
.login-tip {
  font-size: 14px;
  text-align: center;
  color: #fff;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
</style>
