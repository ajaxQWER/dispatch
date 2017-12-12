<template>
    <div>
        <el-row>
            <el-col>
                <h1>欢迎来到共享点餐调度平台</h1>
                <p>用户：{{username}}</p>
                <p>注册时间：{{registrationTime}}</p>
                <p>上次登录时间：{{lastLoginTime}}</p>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    data: function() {
        return {
            username: '',
            registrationTime: '',
            lastLoginTime: ''
        }
    },
    created: function(){
        var user = JSON.parse(sessionStorage.getItem('user'));
        this.username = user.username;
        this.registrationTime = this.moment(user.registrationTime).format('YYYY-MM-DD HH:mm:ss');
        this.lastLoginTime = this.moment(user.lastLoginTime).format('YYYY-MM-DD HH:mm:ss');
    }
}
</script>