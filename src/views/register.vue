<template>
  <div class="register">
    <div class="title-style"></div>
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="registerRules"
      class="register-form"
    >
      <h3 class="title">欢迎注册</h3>
      <el-form-item prop="username">
        <el-input
          v-model="registerForm.username"
          type="text"
          auto-complete="off"
          placeholder="姓名"
        >
          <i
            slot="prefix"
            class="el-icon-user-solid el-input__icon input-icon"
          ></i>
        </el-input>
      </el-form-item>

      <el-form-item prop="phonenumber">
        <el-input
          v-model="registerForm.phonenumber"
          type="text"
          auto-complete="off"
          placeholder="手机号"
        >
          <i
            slot="prefix"
            class="el-icon-user-solid el-input__icon input-icon"
          ></i>
        </el-input>
      </el-form-item>


      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleRegister"
        >
          <svg-icon
            slot="prefix"
            icon-class="password"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
          auto-complete="off"
          placeholder="确认密码"
          @keyup.enter.native="handleRegister"
        >
          <i slot="prefix" class="el-icon-lock el-input__icon input-icon"></i>
        </el-input>
      </el-form-item>

      
      <el-form-item prop="college">
        <el-input
          v-model="registerForm.college"
          type="text"
          auto-complete="off"
          placeholder="所属学院"
        >
          <i
            slot="prefix"
            class="el-icon-user-solid el-input__icon input-icon"
          ></i>
        </el-input>
      </el-form-item>



      <el-form-item prop="identity">
        <el-select
          v-model="registerForm.identity"
          type="text"
          auto-complete="off"
          placeholder="选择身份"
        >
          
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
             </el-option>

          <i
            slot="prefix"
            class="el-icon-user-solid el-input__icon input-icon"
          ></i>
        </el-select>
      </el-form-item>

      <el-form-item prop="studentno">
        <el-input
          v-model="registerForm.studentno"
          type="text"
          auto-complete="off"
          placeholder="学/工号"
        >
          <i
            slot="prefix"
            class="el-icon-user-solid el-input__icon input-icon"
          ></i>
        </el-input>
      </el-form-item>

      <el-form-item prop="code" v-if="captchaOnOff">
        <el-input
          v-model="registerForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleRegister"
        >
          <svg-icon
            slot="prefix"
            icon-class="safe"
            class="el-input__icon input-icon"
          />
        </el-input>
        <div class="register-code">
          <img :src="codeUrl" @click="getCode" class="register-code-img" />
        </div>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button
          class="login-btn"
          :loading="loading"
          size="medium"
          type="primary"
          style="width: 100%"
          @click.native.prevent="handleRegister"
        >
          <span v-if="!loading">注 册</span>
          <span v-else>注 册 中...</span>
        </el-button>
        <div style="float: right">
          <router-link class="link-type" :to="'/login'"
            >使用已有账户登录</router-link
          >
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-register-footer">
      <!-- <span>Copyright © 2018-2022 dadadadada.vip All Rights Reserved.</span> -->
    </div>
  </div>
</template>

<script>
import { getCodeImg, register } from "@/api/login";

export default {
  name: "Register",
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.registerForm.password !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {

      options: [{
          value: '学生',
          label: '学生'
        }, {
          value: '教师',
          label: '教师'
        }],
      codeUrl: "",
      registerForm: {
        username: "",
        phonenumber:"",
        studentno:"",
        password: "",
        confirmPassword: "",
        college:"",
        identity:"",
        code: "",
        uuid: ""
      },
      registerRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" },
          { min: 2, max: 20, message: '用户账号长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        phonenumber: [
          { required: true, trigger: "blur", message: "请输入您的手机号" },
          { min: 11, max:11, message: '手机号长度必须为11位', trigger: 'blur' }
        ],
        studentno: [
          { required: true, trigger: "blur", message: "请输入您的学/工号" },
          { min: 6, max:10, message: '学/工号长度必须介于 5 和 10 之间', trigger: 'blur' }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" },
          { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, trigger: "blur", message: "请再次输入您的密码" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ],
        college: [
          { required: true, trigger: "blur", message: "请输入学院名称" },
          { min: 2, max: 20, message: '名称长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        identity: [
          { required: true, trigger: "blur", message: "请选择注册身份" }
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }]
      },
      loading: false,
      captchaOnOff: true
    };
  },
  created() {
    this.getCode();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.captchaOnOff = res.captchaOnOff === undefined ? true : res.captchaOnOff;
        if (this.captchaOnOff) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.registerForm.uuid = res.uuid;
        }
      });
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true;
          register(this.registerForm).then(res => {
            const username = this.registerForm.username;
            this.$alert("<font color='red'>恭喜你，您的账号 " + username + " 注册成功！</font>", '系统提示', {
              dangerouslyUseHTMLString: true,
              type: 'success'
            }).then(() => {
              this.$router.push("/login");
            }).catch(() => {});
          }).catch(() => {
            this.loading = false;
            if (this.captchaOnOff) {
              this.getCode();
            }
          })
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.register {
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
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translate(-50%, 0);
}
.register-form {
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
  .el-input__icon {
    color: #4aaafd;
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.register-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.register-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-register-footer {
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
.register-code-img {
  height: 38px;
}
</style>
