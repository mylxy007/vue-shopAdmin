<template>
    <div class="charts" ref="charts"></div>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";
export default {
    name: "progressCharts",
    mounted() {
        // 初始化echarts实例
        let lineCharts = echarts.init(this.$refs.charts);
        lineCharts.setOption({
            xAxis: {
                show: false,
                min: 0,
                max: 100,
            },
            yAxis: {
                show: false,
                type: "category",
            },
            // 系列
            series: [
                {
                    // 柱状图
                    type: "bar",
                    data: [78],
                    smooth: true,
                    color: "green",
                    // 柱状图的宽度
                    barWidth: 10,
                    color: "yellowgreen",
                    // 背景颜色的设置
                    showBackground: true,
                    // 设置背景颜色
                    backgroundStyle: {
                        color: "#eee",
                    },
                    label: {
                        show: true,
                        // 改变文本内容
                        formatter: "|",
                        // 改变文本位置
                        position: "right",
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
            tooltip: {},
        });
    },
};
</script>

<style scoped>
.charts {
    width: 100%;
    height: 100%;
}
</style>