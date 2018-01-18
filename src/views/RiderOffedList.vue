<template>
    <el-row class="rider-contain">
        <el-row class="title">
            <h3>骑手收工列表</h3>
        </el-row>
        <el-row>
            <el-form :inline="true">
                <el-form-item label="骑手搜索">
                    <el-select v-model="params.auditStatus" placeholder="请选择审核状态">
                        <el-option v-for="(item,index) in statusObj" :key="index" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="getRiderOffLists">搜索</el-button>
                    <el-button type="danger" @click="resetSearch">重置查询条件</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table :data="riderOffLists" :row-style="{fontSize:'12px'}">
                <el-table-column label="骑手Id " align="center" width="100px">
                    <template slot-scope="scope">{{scope.row.riderId ?scope.row.riderId :'-'}}</template>
                </el-table-column>
                <el-table-column label="骑手名" align="center">
                    <template slot-scope="scope">{{scope.row.riderName ?scope.row.riderName :'-'}}</template>
                </el-table-column>
                <el-table-column label="骑手电话" align="center">
                    <template slot-scope="scope">{{scope.row.username ?scope.row.username :'-'}}</template>
                </el-table-column>
                <el-table-column label="收工理由" align="center">
                    <template slot-scope="scope">{{scope.row.offReason}}</template>
                </el-table-column>
                <el-table-column label="申请时间" align="center">
                    <template slot-scope="scope">{{moment(scope.row.applicationDate ).format('YYYY-MM-DD HH:mm:ss')}}</template>
                </el-table-column>
                <el-table-column label="审核时间" align="center">
                    <template slot-scope="scope">{{scope.row.auditDate? moment(scope.row.applicationDate).format('YYYY-MM-DD HH:mm:ss'):'-'}}</template>
                </el-table-column>
                <el-table-column label="审核状态" align="center">
                    <template slot-scope="scope">{{formatAuditStatus(scope.row.auditStatus)}}</template>
                </el-table-column>
                <el-table-column label="拒绝理由" align="center">
                    <template slot-scope="scope">{{scope.row.rejectReason&&scope.row.rejectReason != 'null'?scope.row.rejectReason:''}}</template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="250px">
                    <template slot-scope="scope">
                        <el-button size="small" :disabled="scope.row.disabled" @click="doAdoptRider(scope.$index, scope.row)">通过</el-button>
                        <el-button size="small" :disabled="scope.row.disabled" type="danger" @click="showRejectDialog(scope.$index, scope.row)">不通过</el-button>
                        <el-button size="small" type="primary" @click="showRiderInfo(scope.$index, scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <!-- 分页 -->
        <el-row class="pagination">
            <el-pagination @current-change="currentChange" :current-page="params.pageId" :page-size="params.pageSize" layout="total, prev, pager, next" :total="counts">
            </el-pagination>
        </el-row>
        <el-dialog :visible.sync="rejectDialog" size="tiny" @close="closeRejectDialog" class="dialog" title="审核拒绝">
            <el-form label-width="80px">
                <el-form-item label="拒绝理由">
                    <el-input type="textarea" v-model="rejectReason"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="closeRejectDialog">取消</el-button>
                <el-button type="primary" @click="doUnAdoptRider">确定</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>
<script>
import {
    riderOffList,
    passRiderOffById,
    unPassRiderOffById
} from '@/api/api'
export default {
    data: function() {
        return {
            riderOffLists: [], //订单列表
            params: {
                pageId: 1,
                pageSize: 20,
                auditStatus: '',
                distributionStationId: JSON.parse(sessionStorage.getItem('user')).distributionStationId
            },
            counts: 0,
            riderId: 0,
            riderOffReasonId: 0,
            rejectDialog: false,
            rejectReason: '',
            statusObj: [{
                value: '',
                label: '全部'
            }, {
                value: 'UN_AUDIT',
                label: '不通过'
            }, {
                value: 'IN_THE_REVIEW',
                label: '审核中'
            }, {
                value: 'ADOPT',
                label: '通过'
            }],
        }
    },
    created: function() {
        this.params.pageId = parseInt(this.$route.query.pageId) || 1;
        this.params.auditStatus = this.$route.query.auditStatus || '';
        this.params.distributionStationId = JSON.parse(sessionStorage.getItem('user')).distributionStationId;
        this.getRiderOffLists();
    },
    methods: {
        //获取订单列表
        getRiderOffLists: function() {
            riderOffList({ params: this.params }).then(data => {
                console.log(data);
                var str = '?';
                for (var key in this.params) {
                    if (this.params[key]) {
                        str += key + '=' + this.params[key] + '&'
                    }
                }
                this.$router.push(str);
                this.counts = data.count;
                this.riderOffLists = data.list;
                var len = this.riderOffLists.length;
                if (len > 0) {
                    for (let i = 0; i < len; i++) {
                        if (this.riderOffLists[i].auditStatus == 'IN_THE_REVIEW') {
                            this.riderOffLists[i].disabled = false;
                        } else {
                            this.riderOffLists[i].disabled = true;
                        }
                    }
                    console.log(this.riderOffLists);

                }
            })
        },
        //分页
        currentChange: function(val) {
            this.params.pageId = val;
            this.getRiderOffLists();
        },


        //通过审核操作
        doAdoptRider: function(index, row) {
            var riderId = row.riderId;
            var riderOffReasonId = row.riderOffReasonId;
            this.$prompt('添加审核备注', '提示').then(({ value }) => {
                console.log(value);
                if (value) {
                    value = value;
                } else {
                    value = '';
                }
                var params = {
                    riderId: riderId,
                    riderOffReasonId: riderOffReasonId,
                    rejectReason: value
                };
                console.log(params);
                passRiderOffById(params).then(res => {
                    console.log(res);
                    this.$message({
                        message: '审核成功',
                        type: 'success'
                    });
                    this.getRiderOffLists();
                });
            }).catch(() => {})

        },

        //不通过审核操作
        showRejectDialog: function(index, row) {
            this.rejectDialog = true;
            this.riderId = row.riderId;
            this.riderOffReasonId = row.riderOffReasonId;
        },
        closeRejectDialog: function() {
            this.rejectDialog = false;
            this.rejectReason = '';
            this.riderId = 0;
            this.riderOffReasonId = 0;
        },
        doUnAdoptRider: function() {
            if (this.rejectReason == '') {
                this.$message({
                    type: 'error',
                    message: '请输入拒绝理由'
                });
                return;
            }
            var params = {
                riderId: this.riderId,
                riderOffReasonId: this.riderOffReasonId,
                rejectReason: this.rejectReason
            };
            console.log(params);
            unPassRiderOffById(params).then(res => {
                console.log(res);
                this.$message({
                    message: '审核成功',
                    type: 'success'
                });
                this.rejectDialog = false;
                this.rejectReason = '';
                this.riderId = 0;
                this.riderOffReasonId = 0;
                this.getRiderOffLists();
            });

        },

        // 查看详情
        showRiderInfo: function(index, row) {
            var riderOffReasonId = row.riderOffReasonId;
            this.$router.push('/riderOffedDetail?riderOffReasonId=' + riderOffReasonId);
        },
        resetSearch: function() {
            this.params = {
                pageId: 1,
                pageSize: 20,
                auditStatus: null,
                distributionStationId: JSON.parse(sessionStorage.getItem('user')).distributionStationId
            };
            this.getRiderOffLists();
        },
        formatAuditStatus: function(status) {
            switch (status) {
                case 'UN_AUDIT':
                    return '不通过';
                case 'IN_THE_REVIEW':
                    return '审核中';
                case 'ADOPT':
                    return '通过';
            }
        }

    },

}

</script>
<style scoped lang="scss">
.rider-contain {
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
    .thumb-img {
        width: 320px;
    }
    .banner-thumb {
        width: 100%;
        vertical-align: middle;
    }
}

</style>
