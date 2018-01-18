<template>
    <el-row class="rider-offed-contain">
        <el-row class="title">
            <h3>骑手详情</h3>            
        </el-row>
        <el-row>
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="back"><i class="el-icon--left el-icon-arrow-left"></i>返回列表</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <ul class="order-lists" v-if="rider">
                <li>骑手id：{{rider.riderId}}</li>
                <li>骑手名称：{{rider.riderName}}</li>
                <li>骑手电话：{{rider.username }}</li>
                <li>申请理由：{{rider.offReason}}</li>
                <li>审核状态：{{formatAuditStatus(rider.auditStatus)}}</li>
                <li>拒绝理由：{{rider.rejectReason? rider.rejectReason:'-' }}</li>
                <li>申请时间：{{moment(rider.applicationDate).format('YYYY-MM-DD HH:mm:ss')}}</li>
                <li>审核时间：{{rider.auditDate? moment(rider.applicationDate).format('YYYY-MM-DD HH:mm:ss'):'-'}}</li>
                <li>配送站Id：{{rider.distributionStationId}}</li>
            </ul>
        </el-row>
    </el-row>
</template>
<script>
import {
    findRiderOffById
} from '@/api/api'
export default {
    data: function() {
        return {
            rider: null
        }
    },
    created: function() {
        var riderOffReasonId = this.$route.query.riderOffReasonId;
        if (riderOffReasonId) {
            findRiderOffById(riderOffReasonId).then(res => {
                console.log(res);
                this.rider = res;
            })
        } else {
            this.$message({
                type: 'error',
                message: '骑手Id错误'
            })
            setTimeout(() => {
                this.back()
            }, 1500)
        }
    },
    methods: {
        back: function() {
            this.$router.back()
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
    }
}

</script>
<style scoped lang="scss">
.rider-offed-contain {
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
    .order-lists {
        list-style: none;
        padding-left: 20px;
        line-height: 2;
        font-size: 16px;
    }
    .driver {
        padding-left: 20px;
        margin: 0;
    }
    .avatar {
        width: 100px;
        height: auto;
    }
}

</style>
