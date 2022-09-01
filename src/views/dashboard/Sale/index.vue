<template>
    <el-card class="box-card" style="margin: 10px 0">
        <div slot="header" class="clearfix">
            <!-- 头部左侧内容 -->
            <el-tabs class="tab" v-model="activeName">
                <el-tab-pane label="销售额" name="sale"></el-tab-pane>
                <el-tab-pane label="访问量" name="visit"></el-tab-pane>
            </el-tabs>
            <!-- 头部右侧内容 -->
            <div class="right">
                <span @click="setDay">今日</span>
                <span @click="setWeek">本周</span>
                <span @click="setMonth">本月</span>
                <span @click="setYear">本年</span>
                <el-date-picker
                    v-model="date"
                    class="date"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    size="mini"
                    value-format="yyyy-MM-dd"
                >
                </el-date-picker>
            </div>
        </div>
        <div>
            <el-row :gutter="10">
                <el-col :span="18">
                    <div class="charts" ref="charts"></div>
                </el-col>
                <el-col :span="6" class="rank">
                    <h3 class="">门店{{ title }}排名</h3>
                    <ul>
                        <li>
                            <span class="rindex">1</span>
                            <span>肯德基</span>
                            <span class="rvalue">123456</span>
                        </li>
                        <li>
                            <span class="rindex">2</span>
                            <span>肯德基</span>
                            <span class="rvalue">123456</span>
                        </li>
                        <li>
                            <span class="rindex">3</span>
                            <span>肯德基</span>
                            <span class="rvalue">123456</span>
                        </li>
                        <li>
                            <span class="rindex">4</span>
                            <span>肯德基</span>
                            <span class="rvalue">123456</span>
                        </li>
                        <li>
                            <span class="rindex">5</span>
                            <span>肯德基</span>
                            <span class="rvalue">123456</span>
                        </li>
                        <li>
                            <span class="rindex">6</span>
                            <span>肯德基</span>
                            <span class="rvalue">123456</span>
                        </li>
                        <li>
                            <span class="rindex">7</span>
                            <span>肯德基</span>
                            <span class="rvalue">123456</span>
                        </li>
                    </ul>
                </el-col>
            </el-row>
        </div>
    </el-card>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
import { mapState } from "vuex";
export default {
    name: "Sale",
    data() {
        return {
            activeName: "sale",
            myCharts: null,
            date: [], //收集日历的数组
        };
    },
    mounted() {
        this.myCharts = echarts.init(this.$refs.charts);
        this.myCharts.setOption({
            title: {
                text: this.title + "趋势",
            },
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                },
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
            },
            xAxis: [
                {
                    type: "category",
                    data: [],
                    axisTick: {
                        alignWithLabel: true,
                    },
                },
            ],
            yAxis: [
                {
                    type: "value",
                },
            ],
            series: [
                {
                    name: "Direct",
                    type: "bar",
                    barWidth: "60%",
                    data: [],
                    color: "green",
                },
            ],
        });
    },
    computed: {
        title() {
            return this.activeName == "sale" ? "销售额" : "访问量";
        },
        ...mapState("home", ["list"]),
    },
    watch: {
        title() {
            // 图表配置数据可以再次修改，替换旧的
            this.myCharts.setOption({
                title: {
                    text: this.title + "趋势",
                },
                xAxis: {
                    data:
                        this.title == "销售额"
                            ? this.list.orderFullYearAxis
                            : this.list.userFullYearAxis,
                },
                series: {
                    name: "Direct",
                    type: "bar",
                    barWidth: "60%",
                    data:
                        this.title == "销售额"
                            ? this.list.orderFullYear
                            : this.list.userFullYear,
                    color: "green",
                },
            });
        },
        list() {
            this.myCharts.setOption({
                title: {
                    text: this.title + "趋势",
                },
                xAxis: {
                    data: this.list.orderFullYearAxis,
                },
                series: {
                    name: "Direct",
                    type: "bar",
                    barWidth: "60%",
                    data: this.list.orderFullYear,
                    color: "green",
                },
            });
        },
    },
    methods: {
        // 本天
        setDay() {
            const day = dayjs().format("YYYY-MM-DD");
            this.date = [day, day];
        },
        // 本周
        setWeek() {
            const start = dayjs().day(1).format("YYYY-MM-DD");
            const end = dayjs().day(7).format("YYYY-MM-DD");
            this.date = [start, end];
        },
        // 本月
        setMonth() {
            const start = dayjs().startOf("month").format("YYYY-MM-DD");
            const end = dayjs().endOf("month").format("YYYY-MM-DD");
            this.date = [start, end];
        },
        // 本年
        setYear() {
            const start = dayjs().startOf("year").format("YYYY-MM-DD");
            const end = dayjs().endOf("year").format("YYYY-MM-DD");
            this.date = [start, end];
        },
    },
};
</script>

<style scoped>
.clearfix {
    position: relative;
    display: flex;
    justify-content: space-between;
}
.tab {
    flex: 1;
}
.right {
    position: absolute;
    top: 0;
    right: 0;
}
.right span {
    margin: 0 10px;
}
.date {
    width: 250px;
    margin: 0px 20px;
}
.charts {
    width: 100%;
    height: 300px;
}
.rank h3 {
    margin-top: 0;
}
ul {
    list-style: none;
    width: 100%;
    height: 300px;
    padding: 0;
}
ul li {
    height: 8%;
    margin: 10px 0;
}
li span {
    margin: 0 20px;
}
.rindex {
    float: left;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #000;
    color: white;
    text-align: center;
    line-height: 20px;
}
.rvalue {
    float: right;
}
>>> .el-card__header {
    border-bottom: none;
}
</style>