<template>
    <div>
        <el-row :gutter="10">
            <el-col :span="6">
                <Detail title="总销售额" count="￥ 126560">
                    <template #charts>
                        <span>周同比&nbsp;&nbsp;56.67%</span>
                        <span class="el-icon-caret-top"></span>
                        &nbsp;&nbsp;
                        <span>日同比&nbsp;&nbsp;19.96% &nbsp;</span>
                        <span class="el-icon-caret-bottom"></span>
                    </template>
                    <template #footer>
                        <span>日销售额￥ 12423</span>
                    </template>
                </Detail>
            </el-col>
            <el-col :span="6">
                <Detail title="访问量" count="88460">
                    <template #charts>
                        <lineCharts></lineCharts>
                    </template>
                    <template #footer>
                        <span>日访问量&nbsp;&nbsp;12423</span>
                    </template>
                </Detail>
            </el-col>
            <el-col :span="6">
                <Detail title="支付笔数" count="88460">
                    <template #charts>
                        <barCharts></barCharts>
                    </template>
                    <template #footer>
                        <span>转化率 64%</span>
                    </template>
                </Detail>
            </el-col>
            <el-col :span="6">
                <Detail title="运营活动效果" count="78%">
                    <template #charts>
                        <progressCharts></progressCharts>
                    </template>
                    <template #footer>
                        <span>周同比&nbsp;&nbsp;56.67%</span>
                        <span class="el-icon-caret-top"></span>
                        &nbsp;&nbsp;
                        <span>日同比&nbsp;&nbsp;19.96% &nbsp;</span>
                        <span class="el-icon-caret-bottom"></span>
                    </template>
                </Detail>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Detail from "./Detail";
import lineCharts from "./lineCharts";
import barCharts from "./barCharts";
import progressCharts from "./progressCharts";

export default {
    name: "Card",
    components: {
        Detail,
        lineCharts,
        barCharts,
        progressCharts,
    },
};
</script>

<style>
</style>