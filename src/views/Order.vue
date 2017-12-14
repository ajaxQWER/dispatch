<template>
    <el-row class="contain">
        <el-row class="title">
            <h3>订单管理</h3>
        </el-row>
        <el-row>
            <el-form :inline="true">
                <el-form-item label="搜索订单">
                    <el-select v-model="orderStatus" placeholder="请选择订单状态" @change="orderChange">
                        <el-option
                                v-for="(item,index) in orderStatusList"
                                :key="index"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table :data="orderList" border>
            	<el-table-column prop="orderId" label="订单ID" align="center" width="80px"></el-table-column>
                <el-table-column prop="sellerOrderNum" label="订单号" align="center"></el-table-column>
                <el-table-column label="下单时间" align="center">
                    <template slot-scope="scope">{{moment(scope.row.orderAddTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
                </el-table-column>
                <el-table-column label="需要送达时间" align="center">
                    <template slot-scope="scope">{{moment(scope.row.requireReceiveTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
                </el-table-column>
            	<el-table-column label="取货点信息" align="center">
                    <el-table-column label="门店名称" align="center">
                        <template slot-scope="scope">{{scope.row.pickUpInfo&&scope.row.pickUpInfo.pickUpName?scope.row.pickUpInfo.pickUpName:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="门店编号" align="center">
                        <template slot-scope="scope">{{scope.row.pickUpInfo&&scope.row.pickUpInfo.storeCode?scope.row.pickUpInfo.storeCode:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="联系方式" align="center">
                        <template slot-scope="scope">{{scope.row.pickUpInfo&&scope.row.pickUpInfo.pickUpPhone?scope.row.pickUpInfo.pickUpPhone:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="取货地址" align="center">
                        <template slot-scope="scope">{{scope.row.pickUpInfo&&scope.row.pickUpInfo.pickUpAddress?scope.row.pickUpInfo.pickUpAddress:'-'}}</template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="收货人信息" align="center">
                    <el-table-column label="收货人名称" align="center">
                        <template slot-scope="scope">{{scope.row.recevierInfo&&scope.row.recevierInfo.receiverName?scope.row.recevierInfo.receiverName:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="联系方式" align="center">
                        <template slot-scope="scope">{{scope.row.recevierInfo&&scope.row.recevierInfo.receiverPrimaryPhone?scope.row.recevierInfo.receiverPrimaryPhone:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="备用联系方式" align="center">
                        <template slot-scope="scope">{{scope.row.recevierInfo&&scope.row.recevierInfo.receiverSecondPhone?scope.row.recevierInfo.receiverSecondPhone:'-'}}</template>
                    </el-table-column>
                    <el-table-column label="收货地址" align="center">
                        <template slot-scope="scope">{{scope.row.recevierInfo&&scope.row.recevierInfo.receiverAddress?scope.row.recevierInfo.receiverAddress:'-'}}</template>
                    </el-table-column>
                </el-table-column>
            	<el-table-column prop="orderStatus" label="订单状态" align="center" width="100px">
                    <template slot-scope="scope">{{formatOrderStatus(scope.row.orderStatus)}}</template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="80px">
                    <template slot-scope="scope">
                        <el-button class="audit-btn" size="small" type="primary" @click="showOrderDetail(scope.row)">详情</el-button>
                    </template>
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
import { getOrderLists } from '@/api/api'
export default {
    data: function() {
        return {
            pageId: 1,
            pageSize: 20,
            counts: 0,
            orderStatus: '',
            orderList: [],
            orderStatusList: [{
                label: '全部',
                value: ''
            },{
                label: '待分配',
                value: 'WAIT_ALLOCATE'
            },{
                label: '待取货',
                value: 'WAIT_PICKUP'
            },{
                label: '取货中',
                value: 'PICKUPING'
            },{
                label: '配送中',
                value: 'SHIPPING'
            },{
                label: '已送达',
                value: 'DELIVERED'
            },{
                label: '已完成',
                value: 'TRANSACT_FINISHED'
            },{
                label: '已取消',
                value: 'CANCELLATION'
            },{
                label: '已支付',
                value: 'PAYED'
            }]
        }
    },
    created: function() {
        var orderStatus = this.$route.query.orderStatus || '';
        this.orderStatus = orderStatus;
        this.getOrderList()
    },
    methods: {
        getOrderList: function() {
            getOrderLists({ params: {orderStatus: this.orderStatus, pageId: this.pageId, pageSize: this.pageSize} }).then(res => {
            	console.log(res)
            	this.orderList = res.list;
            	this.counts = res.count;
            })
        },
        formatOrderStatus: function(status){
            switch(status){
                case 'WAIT_ALLOCATE':
                    return '待分配';
                case 'WAIT_PICKUP':
                    return '待取货';
                case 'PICKUPING':
                    return '取货中';
                case 'SHIPPING':
                    return '配送中';
                case 'DELIVERED':
                    return '已送达';
                case 'TRANSACT_FINISHED':
                    return '已完成';
                case 'CANCELLATION':
                    return '已取消';
                case 'PAYED':
                    return '已支付';
            }
        },
        showOrderDetail: function(row){
            this.$router.push({path: '/orderDetail', query: {orderId: row.orderId}})
        },
        orderChange: function(value){
            console.log(value)
            this.orderStatus = value;
            this.$router.push({query: {orderStatus: value}})
            this.getOrderList()

        },
        //分页
        currentChange: function(val) {
            this.$router.push('?page=' + val)
            this.pageId = val;
            this.getOrderList()
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
