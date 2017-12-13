<template>
    <el-form :model="ruleForm" ref="ruleForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
        <h3 class="title">共享点餐调度平台</h3>
        <el-form-item prop="account">
            <el-input type="text" v-model="ruleForm.username" auto-complete="off" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
            <el-input type="password" v-model="ruleForm.secretkey" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item style="width:100%;">
            <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">登录</el-button>
        </el-form-item>
        <p class="copyright">鑫圆共享电子商务股份有限公司© 2017
            <br>蜀ICP备17032496号-4</p>
    </el-form>
</template>
<script>
 import {
     dispatherLogin
 } from '@/api/api';
export default {
    data: function() {
        return {
            logining: false,
            ruleForm: {
                username: '',
                secretkey: ''
            }
        };
    },
    methods: {
        handleSubmit: function() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    var loginParams = {
                        username: this.ruleForm.username,
                        secretkey: this.ruleForm.secretkey
                    };
                    dispatherLogin(loginParams).then(data => {
                        console.log(data)
                        sessionStorage.setItem('user', JSON.stringify(data.shopDispatcher));
                        sessionStorage.setItem('jwt', data.jwt);
                        this.$router.push({
                            path: '/index'
                        });
                    })
                } else {
                    return false;
                }
            });
        }
    }
}
</script>
<style lang="scss" scoped>
.login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 15% 0 0 60%;
    ;
    background-color: #eee;
    width: 290px;
    padding: 15px 35px;
    .title {
        font-size: 20px;
        margin: 10px auto;
        text-align: center;
        color: #363f44;
    }
    .remember {
        margin-bottom: 20px;
    }
    .copyright {
        font-size: 14px;
        color: #98a6ad;
        text-align: center;
    }
}
</style>
