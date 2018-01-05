<template>
    <el-row class="container">
        <el-col :span="24" class="header">
            <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
                <router-link to="/index" class="router-link">
                    <img src="../assets/images/logo.png" alt="logo" v-if="collapsed">
                    <span v-else-if="!collapsed">蜂鹰配送调度平台</span>
                </router-link>
            </el-col>
            <el-col :span="10">
                <div class="tools" @click.prevent="collapse">
                    <i class="fa fa-align-justify"></i>
                </div>
            </el-col>
            <el-col :span="4" class="userinfo">
                <el-dropdown trigger="hover">
                    <span class="el-dropdown-link userinfo-inner">{{sysUserName}}</span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="updateSecretkey">修改密码</el-dropdown-item>
                        <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-col>
        <el-col :span="24" class="main">
            <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
                <!--导航菜单-->
                <el-menu :default-active="$route.path" class="el-menu-vertical-demo" unique-opened router v-if="!collapsed" theme="dark">
                    <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
                        <el-submenu :index="index+''" v-if="!item.leaf">
                            <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
                            <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
                        </el-submenu>
                        <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
                    </template>
                </el-menu>
                <!--导航菜单-折叠后-->
                <ul class="el-menu el-menu-vertical-demo collapsed" v-if="collapsed" ref="menuCollapsed">
                    <li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">
                        <template v-if="!item.leaf">
                            <div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i class="icon-color" :class="item.iconCls"></i></div>
                            <ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
                                <li v-for="child in item.children" v-if="!child.hidden" :key="child.path" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>
                            </ul>
                        </template>
                        <template v-else>
                            <li class="el-submenu">
                                <div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>
                            </li>
                        </template>
                    </li>
                </ul>
            </aside>
            <section class="content-container" id="container">
                <el-col :span="24" class="content-wrapper">
                    <transition name="fade" mode="out-in">
                        <router-view></router-view>
                    </transition>
                </el-col>
            </section>
        </el-col>
        <!-- 修改密码 -->
        <el-dialog title="修改密码" :visible.sync="dialog" size="tiny" @close="closeDialog" class="dialog">
            <el-form :model="password" label-width="100px" ref="newVideo">
                <el-form-item label="原密码" prop="title">
                    <el-input type="password" v-model="password.oldSecretkey" auto-complete="off" placeholder="原密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="title">
                    <el-input type="password" v-model="password.secretkey" auto-complete="off" placeholder="新密码"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="update">确 定</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>
<script>
// import {updatePwd} from '@/api/api';
export default {
    data: function() {
        return {
            collapsed: false,
            sysUserName: '',
            password: {
                oldSecretkey: '',
                secretkey: ''
            },
            dialog: false
        }
    },
    methods: {
        //退出登录
        logout: function() {
            var _this = this;
            this.$confirm('确认退出吗?', '提示', {
                type: 'info'
            }).then(() => {
                this.clearStorage();
            }).catch(() => {

            });
        },
        clearStorage: function(){
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('jwt');
            this.$router.push('/login');
        },
        //折叠导航栏
        collapse: function() {
            this.collapsed = !this.collapsed;
        },
        showMenu: function(i, status) {
            this.$refs.menuCollapsed.querySelector('.submenu-hook-' + i).style.display = status ? 'block' : 'none';
        },
        closeDialog: function(){
            this.password = {
                oldSecretkey: '',
                secretkey: ''
            }
        },
        cancel: function(){
            this.dialog = false;
        },
        updateSecretkey: function(){
            this.dialog = true;
        },
        update: function(){
            updatePwd(this.password).then(data=>{
                this.$message({
                    message: '修改成功',
                    type: 'success'
                })
                this.dialog = false;
                this.clearStorage();
            })
        }
    },
    mounted: function() {
        var user = sessionStorage.getItem('user');
        if (user) {
            user = JSON.parse(user);
            this.sysUserName = user.username || '';
        }
    },
}
</script>
<style scoped lang="scss">
.container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    .header {
        height: 60px;
        line-height: 60px;
        color: #fff;
        background-color: #324157;
        .userinfo {
            text-align: right;
            padding-right: 35px;
            float: right;
            .userinfo-inner {
                cursor: pointer;
                color: #fff;
            }
        }
        .logo {
            height: 60px;
            font-size: 22px;
            border-color: rgba(238, 241, 146, 0.3);
            border-right-width: 1px;
            border-right-style: solid;
            .router-link {
                display: inline-block;
                width: 100%;
                height: 100%;
                padding: 0 20px;
                box-sizing: border-box;
                text-align: center;
                color: #fff;
                text-decoration: none;
            }
            img {
                width: 100%;
                vertical-align: middle;
            }
            .txt {
                color: #fff;
            }
        }
        .logo-width {
            width: 231px;
        }
        .logo-collapse-width {
            width: 60px;
            padding: 0;
            text-align: center;
            .router-link {
                padding: 0;
            }
        }
        .tools {
            padding: 0px 23px;
            width: 14px;
            height: 60px;
            line-height: 60px;
            cursor: pointer;
        }
    }
    .main {
        display: flex;
        position: absolute;
        top: 60px;
        bottom: 0px;
        overflow: hidden;
        aside {
            flex: 0 0 230px;
            width: 230px;
            .el-menu {
                border-radius: 0;
                height: 100%;
            }
            .collapsed {
                width: 60px;
                background-color: #324157;
                .item {
                    position: relative;
                }
                .submenu {
                    position: absolute;
                    top: 0px;
                    left: 60px;
                    z-index: 99999;
                    height: auto;
                    display: none;
                }
            }
        }
        .menu-collapsed {
            flex: 0 0 60px;
            width: 60px;
        }
        .menu-expanded {
            flex: 0 0 230px;
            width: 230px;
        }
        .icon-color {
            color: #bfcbd9;
        }
        .content-container {
            background-color: #fff;
            flex: 1;
            overflow-y: scroll;
            padding: 20px;
            .breadcrumb-container {
                .title {
                    width: 200px;
                    float: left;
                    color: #475669;
                }
                .breadcrumb-inner {
                    float: right;
                }
            }
            .content-wrapper {
                background-color: #fff;
                box-sizing: border-box;
            }
        }
        .icon {
            color: #fff;
        }
    }
}
.el-message-box__headerbtn {
    position: absolute;
    top: 19px;
    right: 20px;
    background: transparent;
    border: none;
    outline: none;
    padding: 0;
    cursor: pointer;
}
</style>
