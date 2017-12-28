<template>
    <el-row class="contain">
        <el-row class="title">
            <h3>订单管理</h3>
        </el-row>
        <el-row>
            <el-form :inline="true">
                <el-form-item label="订单状态">
                    <el-select v-model="orderStatus" placeholder="请选择订单状态" @change="orderChange">
                        <el-option v-for="(item,index) in orderStatusList" :key="index" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否异常">
                    <el-select v-model="isException" @change="exceptionChange">
                        <el-option v-for="(item,index) in orderExceptionArr" :key="index" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序">
                    <el-select v-model="sqlOrderType" @change="sortChange">
                        <el-option v-for="(item,index) in sqlOrderTypeList" :key="index" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="autoFresh">10秒自动更新订单</el-checkbox>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table :data="orderList" border :row-style="{fontSize:'12px'}">
                <el-table-column prop="orderId" label="订单ID" align="center" width="80px"></el-table-column>
                <el-table-column prop="sellerOrderNum" label="订单号" align="center"></el-table-column>
                <el-table-column label="下单时间" align="center">
                    <template slot-scope="scope">{{moment(scope.row.orderAddTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
                </el-table-column>
                <el-table-column label="需要送达时间" align="center">
                    <template slot-scope="scope">{{moment(scope.row.requireReceiveTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
                </el-table-column>
                <el-table-column label="取货点信息" align="center">
                    <el-table-column label="门店信息" align="center">
                        <template slot-scope="scope">{{scope.row.pickUpInfo&&scope.row.pickUpInfo.pickUpName?scope.row.pickUpInfo.pickUpName:'-'}}
                            <br><span v-if="scope.row.pickUpInfo.pickUpPhone">({{scope.row.pickUpInfo.pickUpPhone}})</span></template>
                    </el-table-column>
                    <el-table-column label="门店编号" align="center">
                        <template slot-scope="scope">{{scope.row.pickUpInfo&&scope.row.pickUpInfo.storeCode?scope.row.pickUpInfo.storeCode:'-'}}</template>
                    </el-table-column>
                    <!-- <el-table-column label="联系方式" align="center">
                        <template slot-scope="scope">{{scope.row.pickUpInfo&&scope.row.pickUpInfo.pickUpPhone?scope.row.pickUpInfo.pickUpPhone:'-'}}</template>
                    </el-table-column> -->
                    <el-table-column label="取货地址" align="center">
                        <template slot-scope="scope">{{scope.row.pickUpInfo&&scope.row.pickUpInfo.pickUpAddress?scope.row.pickUpInfo.pickUpAddress:'-'}}</template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="收货人信息" align="center">
                    <el-table-column label="收货人" align="center">
                        <template slot-scope="scope">{{scope.row.recevierInfo&&scope.row.recevierInfo.receiverName?scope.row.recevierInfo.receiverName:'-'}}
                            <br><span v-if="scope.row.recevierInfo.receiverPrimaryPhone">{{scope.row.recevierInfo.receiverPrimaryPhone}}</span><span v-if="scope.row.recevierInfo.receiverSecondPhone">/{{scope.row.recevierInfo.receiverSecondPhone}}</span></template>
                    </el-table-column>
                    <el-table-column label="收货地址" align="center">
                        <template slot-scope="scope">{{scope.row.recevierInfo&&scope.row.recevierInfo.receiverAddress?scope.row.recevierInfo.receiverAddress:'-'}}</template>
                    </el-table-column>
                </el-table-column>
                <el-table-column prop="orderStatus" label="订单状态" align="center" width="100px">
                    <template slot-scope="scope">{{formatOrderStatus(scope.row.orderStatus)}}<span v-if="scope.row.isException" class="exception"><br>异常</span></template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="180px">
                    <template slot-scope="scope">
                        <el-button class="audit-btn" size="mini" type="success" @click="showDispatchOrderDialog(scope.row, true)" :disabled="scope.row.orderStatus != 'WAIT_ALLOCATE'">派单</el-button>
                        <el-button class="audit-btn" size="mini" type="danger" @click="showDispatchOrderDialog(scope.row, false)" :disabled="formatDisabaled(scope.row.orderStatus) || scope.row.isException">改派</el-button>
                        <el-button class="audit-btn" size="mini" type="danger" @click="setOrderExceptionBtn(scope.row)" :disabled="formatDisabaled(scope.row.orderStatus) || scope.row.isException">异常</el-button>
                        <el-button class="audit-btn" :disabled="formatCancelDisabled(scope.row.orderStatus) || scope.row.isException" size="mini" type="danger" @click="cancelOrderBtn(scope.row)">取消</el-button>
                        <el-button class="audit-btn" size="mini" type="primary" @click="showOrderDetail(scope.row)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <!-- 分页 -->
        <el-row class="pagination">
            <el-pagination @current-change="currentChange" :current-page="pageId" :page-size="pageSize" layout="total, prev, pager, next" :total="counts">
            </el-pagination>
        </el-row>
        <el-dialog :title="dispatch?'派单':'改派'" :visible.sync="dispatchOrderDialog" size="small" @close="closedispatchOrderDialog" class="dialog">
            <el-form label-width="120px">
                <el-form-item label="订单地图:">
                    <div class="amap-container" v-if="dispatchOrderDialog">
                        <el-amap ref="amap" vid="amapDemo" class="amap" :zoom="mapZoom" :center="mapCenter">
                            <el-amap-marker v-for="(marker,index) in markers" :key="index" :position="marker.position" :title="marker.title" :icon="marker.icon"></el-amap-marker>
                        </el-amap>
                    </div>
                </el-form-item>
                <el-form-item label="选择骑手">
                    <el-select v-model="riderId" placeholder="请选择骑手" filterable>
                        <el-option v-for="(item,index) in reiderList" :key="index" :label="item.riderName" :value="item.riderId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closedispatchOrderDialog">取 消</el-button>
                <el-button type="primary" @click="dispatchOrder">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="取消订单" :visible.sync="cancelOrderDialog" size="tiny" @close="closeCancelOrderDialog" class="dialog">
            <el-form label-width="120px">
                <el-form-item label="取消原因:">
                    <el-input type="textarea" v-model="cancelReason" placeholder="请输入取消原因"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeCancelOrderDialog">取 消</el-button>
                <el-button type="primary" @click="cancelOrder">确 定</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>
<script>
import { getOrderLists, getRiderLists, doDispatchOrder, reDoDispatchOrder, getOrderGeoInfo, setOrderException, cancelOrderById } from '@/api/api'
import shop from '@/assets/images/shop.png'
import carrier from '@/assets/images/carrier.png'
import buyer from '@/assets/images/buyer.png'
export default {
    data: function() {
        return {
            pageId: 1,
            pageSize: 20,
            counts: 0,
            orderStatus: '',
            isException: '',
            orderList: [],
            orderStatusList: [{
                label: '全部',
                value: ''
            }, {
                label: '待分配',
                value: 'WAIT_ALLOCATE'
            }, {
                label: '待取货',
                value: 'WAIT_PICKUP'
            }, {
                label: '取货中',
                value: 'PICKUPING'
            }, {
                label: '配送中',
                value: 'SHIPPING'
            }, {
                label: '已送达',
                value: 'DELIVERED'
            }, {
                label: '已完成',
                value: 'TRANSACT_FINISHED'
            }, {
                label: '已取消',
                value: 'CANCELLATION'
            }],
            orderExceptionArr: [{
                label: '全部',
                value: ''
            }, {
                label: '异常',
                value: 'true'
            }, {
                label: '正常',
                value: 'false'
            }],
            sqlOrderTypeList: [{
                label: '倒序',
                value: 'DESC'
            }, {
                label: '正序',
                value: 'ASC'
            }],
            sqlOrderType: 'ASC',
            dispatch: true,
            orderId: 0,
            riderId: null,
            reiderList: [],
            dispatchOrderDialog: false,
            mapZoom: 13,
            mapCenter: [],
            markers: [],
            lngArr: [],
            latArr: [],
            autoFresh: false,
            cancelOrderDialog: false,
            cancelReason: ''
        }
    },
    created: function() {
        var orderStatus = this.$route.query.orderStatus || '';
        var isException = this.$route.query.isException || '';
        var sqlOrderType = this.$route.query.sqlOrderType || 'DESC';
        this.pageId = parseInt(this.$route.query.pageId) || 1;
        this.orderStatus = orderStatus;
        this.isException = isException;
        this.sqlOrderType = sqlOrderType;
        this.getOrderList()
    },
    watch: {
        autoFresh: function(newVal, oldVal) {
            if (newVal) {
                this.interVal = setInterval(() => {
                    this.getOrderList();
                }, 10000)
            } else {
                clearInterval(this.interVal)
                this.interVal = null;
            }
        }
    },
    destroyed: function() {
        clearInterval(this.interVal)
        this.interVal = null;
    },
    methods: {
        getOrderList: function() {
            var params = {
                orderStatus: this.orderStatus,
                pageId: this.pageId,
                pageSize: this.pageSize,
                isException: this.isException,
                sqlOrderType: this.sqlOrderType
            }
            getOrderLists({ params: params }).then(res => {
                console.log(res)
                var str = '?';
                for (var key in params){
                    if(params[key]){
                        str += key + '=' + params[key] + '&'
                    }
                }
                this.$router.push(str)
                this.orderList = res.list;
                this.counts = res.count;
            })
        },
        getRiderList: function() {
            getRiderLists({ params: { pageSize: 99999 } }).then(res => {
                console.log(res)
                this.reiderList = res.list;
                res.list.forEach((item) => {
                    if (item['riderLocation']['riderLocationLongitude']) {
                        this.markers.push({ position: [item['riderLocation']['riderLocationLongitude'], item['riderLocation']['riderLocationLatitude']], title: item.riderName, icon: this.formatMakerIconSrc('carrier') })
                        this.lngArr.push(item['riderLocation']['riderLocationLongitude'])
                        this.latArr.push(item['riderLocation']['riderLocationLatitude'])
                    }
                })
                this.getAllGeoInfo(this.orderId)
            })
        },
        formatOrderStatus: function(status) {
            switch (status) {
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
            }
        },
        showOrderDetail: function(row) {
            this.$router.push({ path: '/orderDetail', query: { orderId: row.orderId } })
        },
        orderChange: function(value) {
            this.orderStatus = value;
            this.getOrderList()

        },
        exceptionChange: function(value) {
            this.isException = value;
            this.getOrderList()
        },
        sortChange: function(value) {
            this.sqlOrderType = value;
            this.getOrderList()
        },
        showDispatchOrderDialog: function(row, status) {
            this.dispatch = status;
            this.orderId = row.orderId;
            // this.riderId = row.riderId;
            this.getRiderList()
        },
        getAllGeoInfo: function(orderId) {
            getOrderGeoInfo(orderId).then(res => {
                console.log(res)
                for (var key in res) {
                    if (res[key]['longitude'] && key != 'carrier') {
                        this.markers.push({ position: [res[key]['longitude'], res[key]['latitude']], title: this.formatMakerTitle(key), icon: this.formatMakerIconSrc(key) })
                        this.lngArr.push(res[key]['longitude'])
                        this.latArr.push(res[key]['latitude'])
                    }
                }

                //求地图中心点 经度和/点坐标数
                var mapCenterLng = this.lngArr.reduce((prev, curr) => prev + curr) / this.markers.length;
                var mapCenterLat = this.latArr.reduce((prev, curr) => prev + curr) / this.markers.length;
                this.mapCenter = [mapCenterLng, mapCenterLat];

                this.dispatchOrderDialog = true;
            })
        },
        closedispatchOrderDialog: function() {
            this.orderId = 0;
            this.riderId = null;
            this.dispatchOrderDialog = false;
            this.markers = [];
            this.mapCenter = [];
            this.lngArr = [];
            this.latArr = [];

        },
        dispatchOrder: function() {
            if (!this.riderId) {
                this.$message({
                    message: '请选择骑手',
                    type: 'error'
                })
                return;
            }
            if (!this.orderId) {
                this.$message({
                    message: '订单ID错误',
                    type: 'error'
                })
                return;
            }
            var orderId = [];
            orderId.push(this.orderId)
            var params = {
                orderIds: orderId,
                riderId: this.riderId
            }
            console.log(params)
            if (this.dispatch) {
                doDispatchOrder(params).then(() => {
                    this.$message({
                        message: '订单指派成功！',
                        type: 'success'
                    })
                    this.getOrderList();
                    this.closedispatchOrderDialog();
                })
            } else {
                reDoDispatchOrder(params).then(() => {
                    this.$message({
                        message: '订单改派成功！',
                        type: 'success'
                    })
                    this.getOrderList();
                    this.closedispatchOrderDialog();
                })
            }
        },
        formatDisabaled: function(status) {
            return (status == 'WAIT_ALLOCATE' || status == 'DELIVERED' || status == 'TRANSACT_FINISHED' || status == 'CANCELLATION');
        },
        formatCancelDisabled: function(status){
            return (status == 'DELIVERED' || status == 'TRANSACT_FINISHED' || status == 'CANCELLATION' || status == 'REFUSED');
        },
        formatMakerTitle: function(name) {
            switch (name) {
                case 'shop':
                    return '店铺';
                case 'buyer':
                    return '买家';
                case 'carrier':
                    return '骑手';
            }
        },
        formatMakerIconSrc: function(name) {
            switch (name) {
                case 'shop':
                    return this.formatMakerIcon(shop);
                case 'buyer':
                    return this.formatMakerIcon(buyer);
                case 'carrier':
                    return this.formatMakerIcon(carrier);
            }
        },
        formatMakerIcon: function(img) {
            return new AMap.Icon({
                image: img,
                size: [23.65, 33]
            })
        },
        setOrderExceptionBtn: function(row) {
            this.$confirm('确定将该订单设置为异常状态?', '设置异常单', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                setOrderException(row.orderId).then(() => {
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                    this.getOrderList()
                })
            }).catch(() => {});
        },
        closeCancelOrderDialog: function(){
            this.orderId = 0;
            this.cancelReason = '';
            this.cancelOrderDialog = false;
        },
        cancelOrderBtn: function(row){
            this.orderId = row.orderId;
            this.cancelOrderDialog = true;
        },
        cancelOrder: function(){
            var params = {
                orderId: this.orderId,
                content: this.cancelReason
            }
            cancelOrderById(params).then(() => {
                this.$message({
                    type: 'success',
                    message: '操作成功!'
                });
                this.getOrderList();
                this.closeCancelOrderDialog()
            })
        },
        //分页
        currentChange: function(val) {
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
    .exception {
        color: #ff0000;
    }
    .amap-container {
        width: 100%;
        height: 500px;
    }
}

</style>
