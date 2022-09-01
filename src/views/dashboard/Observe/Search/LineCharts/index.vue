<template>
    <div>
        <div class="header">
            <span class="search-header">搜索用户数</span>
            <i class="el-icon-info"></i>
        </div>
        <div class="main">
            <span class="main-title">12312</span>
            <span class="main-content">17.1%</span>
            <i class="el-icon-caret-bottom"></i>
        </div>
        <div class="footer">
            <div class="charts" ref="charts"></div>
        </div>
    </div>
</template>

<script>
import * as echarts from "echarts";
export default {
    name: "LineCharts",
    mounted() {
        // 初始化echarts实例
        let lineCharts = echarts.init(this.$refs.charts);
        lineCharts.setOption({
            xAxis: {
                show: false,
                type: "category",
            },
            yAxis: {
                show: false,
            },
            // 系列
            series: [
                {
                    type: "line",
                    data: [10, 7, 33, 12, 48, 9, 29, 10, 44],
                    smooth: true,
                    itemStyle: {
                        opacity: 0,
                    },
                    lineStyle: {
                        color: "purple",
                    },
                    areaStyle: {
                        color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: "purple", // 0% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: "#fff", // 100% 处的颜色
                                },
                            ],
                            global: false, // 缺省为 false
                        },
                    },
                },
            ],
            // 布局调试
            grid: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
            },
        });
    },
};
</script>

<style>
.header {
    display: flex;
    align-items: center;
    color: #999;
}
.search-header {
    margin-right: 20px;
}
.main {
    margin: 10px 0;
}
.main-title {
    margin-right: 30px;
}
.main-content {
    margin-right: 10px;
}
.charts {
    width: 100%;
    height: 100px;
}
</style>