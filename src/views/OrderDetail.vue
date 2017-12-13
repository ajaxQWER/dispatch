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
                <el-form-item label="订单id:">{{orderDetail.order_id}}</el-form-item>
                <el-form-item label="商户订单号:">{{orderDetail.seller_order_num}}</el-form-item>
                <el-form-item label="备注信息:">{{orderDetail.seller_remark}}</el-form-item>
                <el-form-item label="订单流水号:">{{orderDetail.serial_number}}</el-form-item>
                <el-form-item label="门店编号:">{{orderDetail.store_code}}</el-form-item>
                <el-form-item label="下单时间:">{{moment(orderDetail.order_add_time).format('YYYY-MM-DD HH:mm:ss')}}</el-form-item>
                <el-form-item label="订单状态:">{{formatOrderStatus(orderDetail.order_status)}}</el-form-item>
                <el-form-item label="需要送达时间:">{{moment(orderDetail.require_receive_time).format('YYYY-MM-DD HH:mm:ss')}}</el-form-item>
                <el-form-item label="订单货物件数:">{{orderDetail.goods_count + '件'}}</el-form-item>
                <el-form-item label="订单总重量:">{{orderDetail.order_weight + 'kg'}}</el-form-item>
                <el-form-item label="订单总金额:">{{formatMoney(orderDetail.order_total_amount) + '元'}}</el-form-item>
                <el-form-item label="客户实际支付金额:">{{formatMoney(orderDetail.order_actual_amount) + '元'}}</el-form-item>
                <el-form-item label="订单支付状态:">{{orderDetail.order_payment_status}}</el-form-item>
                <el-form-item label="订单备注:">{{orderDetail.order_remark}}</el-form-item>
                <el-form-item label="取货点信息:">
                	<el-form v-if="orderDetail.pick_up_info" class="info-form">
                		<el-form-item label="门店名称">{{orderDetail.pick_up_info.pick_up_name?orderDetail.pick_up_info.pick_up_name:'-'}}</el-form-item>
                		<el-form-item label="门店编号">{{orderDetail.pick_up_info.store_code?orderDetail.pick_up_info.store_code:'-'}}</el-form-item>
                		<el-form-item label="门店地址">{{orderDetail.pick_up_info.pick_up_address?orderDetail.pick_up_info.pick_up_address:'-'}}</el-form-item>
                		<el-form-item label="联系方式">{{orderDetail.pick_up_info.pick_up_phone?orderDetail.pick_up_info.pick_up_phone:'-'}}</el-form-item>
                		<el-form-item label="门店经度">{{orderDetail.pick_up_info.pick_up_longitude?orderDetail.pick_up_info.pick_up_longitude:'-'}}</el-form-item>
                		<el-form-item label="门店纬度">{{orderDetail.pick_up_info.pick_up_remark?orderDetail.pick_up_info.pick_up_remark:'-'}}</el-form-item>
                		<el-form-item label="备注">{{orderDetail.pick_up_info.pick_up_name?orderDetail.pick_up_info.pick_up_name:'-'}}</el-form-item>
                	</el-form>
                </el-form-item>
                <el-form-item label="收货人信息:">
                	<el-form v-if="orderDetail.recevier_info" class="info-form">
                		<el-form-item label="收货人ID">{{orderDetail.recevier_info.recevier_id?orderDetail.recevier_info.recevier_id:'-'}}</el-form-item>
                		<el-form-item label="收货人名称">{{orderDetail.recevier_info.pick_up_name?orderDetail.recevier_info.pick_up_name:'-'}}</el-form-item>
                		<el-form-item label="联系地址">{{orderDetail.recevier_info.receiver_address?orderDetail.recevier_info.receiver_address:'-'}}</el-form-item>
                		<el-form-item label="联系方式">{{orderDetail.recevier_info.receiver_primary_phone?orderDetail.recevier_info.receiver_primary_phone:'-'}}</el-form-item>
                		<el-form-item label="备用联系方式">{{orderDetail.recevier_info.receiver_second_phone?orderDetail.recevier_info.receiver_second_phone:'-'}}</el-form-item>
                		<el-form-item label="收货人经度">{{orderDetail.recevier_info.receiver_longitude?orderDetail.recevier_info.receiver_longitude:'-'}}</el-form-item>
                		<el-form-item label="收货人纬度">{{orderDetail.recevier_info.receiver_latitude?orderDetail.recevier_info.receiver_latitude:'-'}}</el-form-item>
                	</el-form>
                </el-form-item>
                <el-form-item label="订单商品:">
                	<el-table v-if="orderDetail.orderGoods" :data="orderDetail.orderGoods" style="width: 1000px; margin-left: 20px;" border>
                	    <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
                	    <el-table-column property="order_goods_id" label="商品ID" align="center"></el-table-column>
                	    <el-table-column property="order_goods_name" label="商品名称" align="center"></el-table-column>
                	    <el-table-column property="order_goods_size" label="商品数量" align="center">
                	    </el-table-column>
                	    <el-table-column label="商品金额" align="center">
                	        <template slot-scope="scope">
                	            {{scope.row.order_goods_price?formatMoney(scope.row.order_goods_price) : '0.00'}}元
                	        </template>
                	    </el-table-column>
                	    <el-table-column property="order_goods_price" label="商品尺寸" align="center"></el-table-column>
                	    <el-table-column property="order_goods_remark" label="备注" align="center"></el-table-column>
                	</el-table>
                </el-form-item>
            </el-form>
        </el-row>
    </el-row>
</template>
<script>
import {getOrderDetail} from '@/api/api'
	export default {
		data: function(){
			return {
				orderDetail: null
			}
		},
		created: function(){
			var orderId = parseInt(this.$route.query.orderId)
			if(orderId){
				getOrderDetail(orderId).then(res => {
					console.log(res)
					this.orderDetail = res;
				})
			}
		},
		methods: {
			back: function(){
				this.$router.back()
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
	    .el-form-item{
	    	margin-bottom: 0;
	    }
	    .info-form{
	    	display: block;
	    	margin-left: 90px;
	    }
	}
</style>