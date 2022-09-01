<template>
    <div>
        <el-card>
            <el-table style="width: 100%" border :data="records">
                <el-table-column
                    label="序号"
                    width="80"
                    type="index"
                    align="center"
                >
                </el-table-column>
                <el-table-column label="名称" width="width" prop="skuName">
                </el-table-column>
                <el-table-column label="描述" width="width" prop="skuDesc">
                </el-table-column>
                <el-table-column label="默认图片" width="width">
                    <template v-slot="{ row, $index }">
                        <img
                            :src="row.skuDefaultImg"
                            style="width: 100px; height: 100px"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="重量(KG)" width="80" prop="weight">
                </el-table-column>
                <el-table-column label="价格(元)" width="80" prop="price">
                </el-table-column>
                <el-table-column label="操作" width="width">
                    <template v-slot="{ row, $index }">
                        <el-button
                            type="success"
                            icon="el-icon-sort-down"
                            size="mini"
                            title="下架"
                            v-if="row.isSale == 1"
                            @click="cancel(row)"
                        ></el-button>
                        <el-button
                            type="success"
                            icon="el-icon-sort-up"
                            size="mini"
                            title="上架"
                            v-else
                            @click="sale(row)"
                        ></el-button>
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                            @click="edit"
                        ></el-button>
                        <el-button
                            type="info"
                            icon="el-icon-info"
                            size="mini"
                            @click="getSkuInfo(row)"
                        ></el-button>
                        <el-button
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <el-pagination
                style="text-align: center"
                :current-page="page"
                :page-sizes="[3, 5, 10]"
                :page-size="limit"
                layout="prev, pager, next, jumper, ->, sizes, total"
                :total="total"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
            >
            </el-pagination>
            <!-- 抽屉 -->
            <el-drawer
                title="我是标题"
                :visible.sync="drawer"
                direction="rtl"
                :show-close="false"
                size="50%"
            >
                <el-row>
                    <el-col :span="5">名称</el-col>
                    <el-col :span="16">{{ skuInfo.skuName }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">描述</el-col>
                    <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">价格</el-col>
                    <el-col :span="16">{{ skuInfo.price }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">平台属性</el-col>
                    <el-col :span="16">
                        <el-tag
                            type="success"
                            v-for="attr in skuInfo.skuAttrValueList"
                            :key="attr.id"
                            >{{ attr.valueId }}-{{ attr.valueId }}</el-tag
                        >
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">商品图片</el-col>
                    <el-col :span="16">
                        <el-carousel height="600px">
                            <el-carousel-item
                                v-for="item in skuInfo.skuImageList"
                                :key="item.id"
                            >
                                <img
                                    :src="item.imgUrl"
                                    style="width: 100%; height: 100%"
                                />
                            </el-carousel-item>
                        </el-carousel>
                    </el-col>
                </el-row>
            </el-drawer>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "Sku",
    data() {
        return {
            page: 1, //当前页
            limit: 10, //当前每页数量
            total: 0, //总条数
            records: [], //存储sku列表
            skuInfo: {}, //存储sku详情信息
            drawer: false, //控制抽屉展示隐藏
        };
    },
    mounted() {
        //获取sku列表的方法
        this.getSkuList();
    },
    methods: {
        async getSkuList() {
            const result = await this.$API.sku.reqSkuList(
                this.page,
                this.limit
            );
            if (result.code === 200) {
                this.records = result.data.records;
                this.total = result.data.total;
            }
        },
        // 当前页改变
        handleCurrentChange(page) {
            this.page = page;
            this.getSkuList();
        },
        // 当前页数量改变
        handleSizeChange(limit) {
            this.limit = limit;
            this.getSkuList();
        },
        // 上架按钮的回调
        async sale(row) {
            const result = await this.$API.sku.reqSale(row.id);
            if (result.code === 200) {
                row.isSale = 1;
                this.$message({ type: "success", message: "上架成功" });
            }
        },
        // 下架按钮的回调
        async cancel(row) {
            const result = await this.$API.sku.reqCancel(row.id);
            if (result.code === 200) {
                row.isSale = 0;
                this.$message({ type: "success", message: "下架成功" });
            }
        },
        // 修改按钮的回调
        edit() {
            this.$message("正在开发中");
        },
        // 获取sku详情的回调
        async getSkuInfo(row) {
            // 展示抽屉
            this.drawer = true;
            const result = await this.$API.sku.reqSkuById(row.id);
            if (result.code === 200) {
                this.skuInfo = result.data;
            }
        },
    },
};
</script>

<style scoped>
.el-row .el-col-5 {
    font-size: 18px;
    text-align: right;
}
.el-col {
    margin: 10px 10px;
}
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
>>> .el-carousel__button {
    width: 10px;
    height: 10px;
    background: red;
    border-radius: 50%;
}
</style>