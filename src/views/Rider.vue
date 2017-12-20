<template>
    <el-row class="contain">
        <el-row class="title">
            <h3>骑手管理</h3>
        </el-row>
        <el-row>
            <el-form :inline="true">
                <el-form-item label="搜索骑手">
                    <el-input placeholder="请输入骑手名" icon="search" v-model="riderNameLike" :on-icon-click="getRiderList"></el-input>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table :data="riderList" border>
            	<el-table-column prop="riderId" label="骑手ID" align="center"></el-table-column>
            	<el-table-column prop="riderName" label="骑手名" align="center"></el-table-column>
            	<el-table-column prop="username" label="联系电话" align="center"></el-table-column>
            	<el-table-column prop="nickname" label="昵称" align="center"></el-table-column>
            	<el-table-column label="骑手状态" align="center">
                    <template slot-scope="scope">{{formatStatus(scope.row.status)}}</template>
                </el-table-column>
            	<el-table-column prop="distributionStationId" label="配送站ID" align="center"></el-table-column>
            	<el-table-column prop="integral" label="积分" align="center"></el-table-column>
            	<el-table-column prop="balance" label="余额" align="center"></el-table-column>
            	<el-table-column label="上次登陆时间" align="center">
            		<template slot-scope="scope">{{moment(scope.row.lastLoginTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
            	</el-table-column>
            </el-table>
        </el-row>
        <!-- 分页 -->
        <el-row class="pagination">
            <el-pagination @current-change="currentChange" :current-page="pageId" :page-size="pageSize" layout="total, prev, pager, next" :total="counts">
            </el-pagination>
        </el-row>
    </el-row>
</template>
<script>
import { getRiderLists } from '@/api/api'
export default {
    data: function() {
        return {
            pageId: 1,
            pageSize: 10,
            counts: 0,
            riderNameLike: '',
            riderList: []
        }
    },
    created: function() {
        this.getRiderList()
    },
    methods: {
        getRiderList: function() {
            getRiderLists({ params: {riderNameLike: this.riderNameLike, pageId: this.pageId, pageSize: this.pageSize} }).then(res => {
            	console.log(res)
            	this.riderList = res.list;
            	this.counts = res.count;
            })
        },
        formatMoney: function(money) {
            money = parseFloat((money + "").replace(/[^\d\.-]/g, "")).toFixed(2) + "";
            var l = money.split(".")[0].split("").reverse();
            var r = money.split(".")[1];
            var t = "";
            for (var i = 0; i < l.length; i++) {
                t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
            }
            return t.split("").reverse().join("") + "." + r;
        },
        formatStatus: function(type){
            switch(type){
                case 'START_WORK':
                    return '开工';
                case 'STOP_WORK':
                    return '收工';
            }
        },
        //分页
        currentChange: function(val) {
            this.$router.push('?page=' + val)
            this.pageId = val;
            this.getRiderList()
        }
    }
}

</script>
<style scoped lang="scss">
.contain {
    .title {
        font-size: 12px;
        border-bottom: 1px solid #eaeaea;
        margin-bottom: 5px;
        h3 {
            display: inline-block;
            padding: 5px 0;
            margin: 0;
            font-weight: normal;
            color: #23b7e5;
            border-bottom: 1px solid #23b7e5;
        }
    }
    .label-color {
        color: red;
    }
    .audit-btn {
        margin: 5px;
    }
}

</style>
