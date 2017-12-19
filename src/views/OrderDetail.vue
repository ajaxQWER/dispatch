<template>
    <el-row class="contain">
        <el-row class="title">
            <h3>订单详情</h3>
        </el-row>
        <el-row>
            <el-button type="primary" icon="arrow-left" @click="back">返回订单</el-button>
        </el-row>
        <el-row>
            <el-form v-if="orderDetail">
                <el-form-item label="订单id:">{{orderDetail.orderId}}</el-form-item>
                <el-form-item label="商户订单号:">{{orderDetail.sellerOrderNum}}</el-form-item>
                <el-form-item label="备注信息:">{{orderDetail.sellerRemark}}</el-form-item>
                <el-form-item label="订单流水号:">{{orderDetail.serialNumber}}</el-form-item>
                <el-form-item label="门店编号:">{{orderDetail.storeCode}}</el-form-item>
                <el-form-item label="下单时间:">{{moment(orderDetail.orderAddTime).format('YYYY-MM-DD HH:mm:ss')}}</el-form-item>
                <el-form-item label="订单状态:">{{formatOrderStatus(orderDetail.orderStatus)}}</el-form-item>
                <el-form-item label="需要送达时间:">{{moment(orderDetail.requireReceiveTime).format('YYYY-MM-DD HH:mm:ss')}}</el-form-item>
                <el-form-item label="订单货物件数:">{{orderDetail.goodsCount + '件'}}</el-form-item>
                <el-form-item label="订单总重量:">{{orderDetail.orderWeight + 'kg'}}</el-form-item>
                <el-form-item label="订单总金额:">{{formatMoney(orderDetail.orderTotalAmount) + '元'}}</el-form-item>
                <el-form-item label="客户实际支付金额:">{{formatMoney(orderDetail.orderActualAmount) + '元'}}</el-form-item>
                <el-form-item label="订单支付状态:">{{orderDetail.orderPaymentStatus?'已支付':'未支付'}}</el-form-item>
                <el-form-item label="订单备注:">{{orderDetail.orderRemark}}</el-form-item>
                <el-form-item label="取货点信息:">
                    <el-form v-if="orderDetail.pickUpInfo" class="info-form">
                        <el-form-item label="门店名称:">{{orderDetail.pickUpInfo.pickUpName?orderDetail.pickUpInfo.pickUpName:'-'}}</el-form-item>
                        <el-form-item label="门店编号:">{{orderDetail.pickUpInfo.storeCode?orderDetail.pickUpInfo.storeCode:'-'}}</el-form-item>
                        <el-form-item label="门店地址:">{{orderDetail.pickUpInfo.pickUpAddress?orderDetail.pickUpInfo.pickUpAddress:'-'}}</el-form-item>
                        <el-form-item label="联系方式:">{{orderDetail.pickUpInfo.pickUpPhone?orderDetail.pickUpInfo.pickUpPhone:'-'}}</el-form-item>
                        <el-form-item label="门店经度:">{{orderDetail.pickUpInfo.pickUpLongitude?orderDetail.pickUpInfo.pickUpLongitude:'-'}}</el-form-item>
                        <el-form-item label="门店纬度:">{{orderDetail.pickUpInfo.pickUpLatitude?orderDetail.pickUpInfo.pickUpLatitude:'-'}}</el-form-item>
                        <el-form-item label="备注:">{{orderDetail.pickUpInfo.pickUpRemark?orderDetail.pickUpInfo.pickUpRemark:'-'}}</el-form-item>
                    </el-form>
                </el-form-item>
                <el-form-item label="收货人信息:">
                    <el-form v-if="orderDetail.recevierInfo" class="info-form">
                        <el-form-item label="geohash:">{{orderDetail.recevierInfo.geohash || '-'}}</el-form-item>
                        <el-form-item label="收货人名称:">{{orderDetail.recevierInfo.receiverName?orderDetail.recevierInfo.receiverName:'-'}}</el-form-item>
                        <el-form-item label="联系地址:">{{orderDetail.recevierInfo.receiverAddress?orderDetail.recevierInfo.receiverAddress:'-'}}</el-form-item>
                        <el-form-item label="联系方式:">{{orderDetail.recevierInfo.receiverPrimaryPhone?orderDetail.recevierInfo.receiverPrimaryPhone:'-'}}</el-form-item>
                        <el-form-item label="备用联系方式:">{{orderDetail.recevierInfo.receiverSecondPhone?orderDetail.recevierInfo.receiverSecondPhone:'-'}}</el-form-item>
                        <el-form-item label="收货人经度:">{{orderDetail.recevierInfo.receiverLongitude?orderDetail.recevierInfo.receiverLongitude:'-'}}</el-form-item>
                        <el-form-item label="收货人纬度:">{{orderDetail.recevierInfo.receiverLatitude?orderDetail.recevierInfo.receiverLatitude:'-'}}</el-form-item>
                    </el-form>
                </el-form-item>
                <el-form-item label="骑手信息:">
                    <el-form v-if="orderDetail.riderCurrent" class="info-form">
                        <el-form-item label="骑手ID:">{{orderDetail.riderCurrent.riderId?orderDetail.riderCurrent.riderId:'-'}}</el-form-item>
                        <el-form-item label="骑手名称:">{{orderDetail.riderCurrent.riderName?orderDetail.riderCurrent.riderName:'-'}}</el-form-item>
                        <el-form-item label="联系方式:">{{orderDetail.riderCurrent.username?orderDetail.riderCurrent.username:'-'}}</el-form-item>
                        <el-form-item label="骑手经度:">{{orderDetail.riderCurrent.riderLocation.riderLocationLongitude?orderDetail.riderCurrent.riderLocation.riderLocationLongitude:'-'}}</el-form-item>
                        <el-form-item label="骑手纬度:">{{orderDetail.riderCurrent.riderLocation.riderLocationLatitude?orderDetail.riderCurrent.riderLocation.riderLocationLatitude:'-'}}</el-form-item>
                    </el-form>
                </el-form-item>
                <el-form-item label="订单商品:">
                    <el-table v-if="orderDetail.orderGoods" :data="orderDetail.orderGoods" style="width: 1000px; margin-left: 20px;" border>
                        <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
                        <el-table-column property="orderGoodsId" label="商品ID" align="center"></el-table-column>
                        <el-table-column property="orderGoodsName" label="商品名称" align="center"></el-table-column>
                        <el-table-column property="orderGoodsQuantity" label="商品数量" align="center">
                        </el-table-column>
                        <el-table-column property="orderGoodsPrice" label="订单金额" align="center"></el-table-column>
                        <el-table-column property="orderGoodsActualPrice" label="实际金额" align="center"></el-table-column>
                        <el-table-column property="orderGoodsSize" label="商品尺寸" align="center"></el-table-column>
                        <el-table-column property="orderGoodsRemark" label="备注" align="center"></el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item label="订单地图:">
                    <div class="amap-container" v-if="mapInit">
                        <el-amap ref="amap" vid="amapDemo" class="amap" :zoom="mapZoom" :center="mapCenter">
                            <el-amap-marker v-for="(marker,index) in markers" :key="index" :position="marker.position" :title="marker.title" :icon="marker.icon"></el-amap-marker>
                        </el-amap>
                    </div>
                </el-form-item>
            </el-form>
        </el-row>
    </el-row>
</template>
<script>
import { getOrderDetail, getOrderGeoInfo } from '@/api/api'
import shop from '@/assets/images/shop.png'
import carrier from '@/assets/images/carrier.png'
import buyer from '@/assets/images/buyer.png'
export default {
    data: function() {
        return {
            orderDetail: null,
            mapInit: false,
            mapZoom: 13,
            mapCenter: [],
            markers: [],
            lngArr: [],
            latArr: []
        }
    },
    created: function() {
        var orderId = parseInt(this.$route.query.orderId)
        if (orderId) {
            getOrderDetail(orderId).then(res => {
                console.log(res)
                this.orderDetail = res;
	            getOrderGeoInfo(orderId).then(res => {
	                console.log(res)
	                for (var key in res) {
	                    if (res[key]['longitude']) {
	                        this.markers.push({ position: [res[key]['longitude'], res[key]['latitude']], title: this.formatMakerTitle(key), icon: this.formatMakerIconSrc(key) })
	                        this.lngArr.push(res[key]['longitude'])
                        	this.latArr.push(res[key]['latitude'])
	                    }
	                }

	                //求中心点
	                var mapCenterLng = this.lngArr.reduce((prev,curr) => prev + curr) / this.markers.length;
	                var mapCenterLat = this.latArr.reduce((prev,curr) => prev + curr) / this.markers.length;
	                this.mapCenter = [mapCenterLng, mapCenterLat];

	                this.mapInit = true;
	            })
            })
        } else {
            this.$message({
                message: '订单ID无效',
                type: 'error'
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
                case 'PAYED':
                    return '已支付';
            }
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
    .el-form-item {
        margin-bottom: 0;
    }
    .info-form {
        display: block;
        margin-left: 90px;
    }
    .amap-container {
        margin: 30px 0;
        width: 600px;
        height: 600px;
    }
}

</style>
