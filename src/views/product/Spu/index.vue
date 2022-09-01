<template>
    <div>
        <el-card style="margin: 20px 0">
            <CategorySelect
                @getCategoryId="getCategoryId"
                :isShowTable="scene === 0"
            ></CategorySelect>
        </el-card>
        <el-card>
            <div v-show="scene === 0">
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    :disabled="!category3Id"
                    @click="addSpu"
                    >添加SPU</el-button
                >
                <el-table :data="records" style="width: 100%" border>
                    <el-table-column
                        type="index"
                        label="序号"
                        width="80"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="spuName"
                        label="SPU名称"
                        width="width"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="description"
                        label="SPU描述"
                        width="width"
                    >
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="width">
                        <template v-slot="{ row, $index }">
                            <HintButton
                                type="success"
                                icon="el-icon-plus"
                                size="mini"
                                title="添加sku"
                                @click.native="addSku(row)"
                            ></HintButton>
                            <HintButton
                                type="warning"
                                icon="el-icon-edit"
                                size="mini"
                                title="修改spu"
                                @click="updateSpu(row)"
                            ></HintButton>
                            <el-button
                                type="info"
                                icon="el-icon-info"
                                size="mini"
                                title="查看当前sku全部sku列表"
                                @click="showDialog(row)"
                            ></el-button>
                            <el-popconfirm
                                title="确定要删除吗"
                                @onConfirm="deleteSpu(row)"
                            >
                                <HintButton
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    title="删除spu"
                                    slot="reference"
                                ></HintButton>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页器 -->
                <el-pagination
                    style="margin-top: 20px; text-align: center"
                    :total="total"
                    :current-page="page"
                    :page-size="limit"
                    :page-count="7"
                    :page-sizes="[3, 5, 10]"
                    layout="prev, pager, next, jumper, ->, sizes, total"
                    @current-change="handlePageChange"
                    @size-change="handleSizeChange"
                ></el-pagination>
            </div>
            <SpuForm
                v-show="scene === 1"
                @changeScene="changeScene"
                ref="spu"
            ></SpuForm>
            <SkuForm
                v-show="scene === 2"
                ref="sku"
                @changeScene="changeScene"
            ></SkuForm>
        </el-card>
        <el-dialog
            :title="`${dialogTitle}的Sku列表`"
            :visible.sync="dialogTableVisible"
            :before-close="close"
        >
            <el-table :data="skuList" v-loading="loading">
                <el-table-column
                    label="名称"
                    width="width"
                    prop="skuName"
                ></el-table-column>
                <el-table-column
                    label="价格"
                    width="width"
                    prop="price"
                ></el-table-column>
                <el-table-column
                    label="重量"
                    width="width"
                    prop="weight"
                ></el-table-column>
                <el-table-column label="默认图片" width="width">
                    <template v-slot="{ row, $index }">
                        <img
                            :src="row.skuDefaultImg"
                            style="width: 100px; height: 100px"
                        />
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
    name: "Spu",
    components: {
        SpuForm,
        SkuForm,
    },
    data() {
        return {
            // 分类Id
            category1Id: "",
            category2Id: "",
            category3Id: "",
            // 控制三级联动
            isShowTable: true,
            // 分页器数据
            page: 1,
            limit: 3,
            records: [],
            total: 0,
            // 控制 SPU列表 添加SPU|修改SPU 添加SKU 三个不同列表的展示
            scene: 0,
            dialogTableVisible: false, // 控制展示sku对话框
            dialogTitle: "", //对话框标题
            skuList: [], //存储sku信息
            loading: true,
        };
    },
    methods: {
        //三级联动的自定义事件,获取子组件的id
        getCategoryId({ categoryId, level }) {
            if (level === 1) {
                this.category1Id = categoryId;
                this.category2Id = "";
                this.category3Id = "";
                this.attrList = [];
            } else if (level === 2) {
                this.category2Id = categoryId;
                this.category3Id = "";
                this.attrList = [];
            } else {
                this.category3Id = categoryId;
                this.getSpuList();
            }
        },
        //获取Spu列表数据
        async getSpuList() {
            let { page, limit, category3Id } = this;
            const result = await this.$API.spu.reqSpuList(
                page,
                limit,
                category3Id
            );
            if (result.code === 200) {
                this.total = result.data.total;
                this.records = result.data.records;
            }
        },
        // 点击分页器的第几页按钮的回调
        handlePageChange(page) {
            this.page = page;
            this.getSpuList();
        },
        // 点击分页器每页显示几条数据的回调
        handleSizeChange(limit) {
            this.limit = limit;
            this.getSpuList();
        },
        // 点击添加Spu的回调
        addSpu() {
            this.scene = 1;
            // 通知子组件发请求
            this.$refs.spu.addspuData(this.category3Id);
        },
        // 点击修改Spu的回调
        updateSpu(row) {
            this.scene = 1;
            // 子组件发请求
            this.$refs.spu.initSpuData(row);
        },
        // spuForm组件点击保存/取消的回调
        changeScene({ scene, flag }) {
            this.scene = scene;
            if (flag == "添加") this.page = 1;
            this.getSpuList();
        },
        // 删除Spu的回调
        async deleteSpu(row) {
            const result = await this.$API.spu.reqDeleteSpu(row.id);
            if (result.code === 200) {
                this.$message({ type: "success", message: "删除成功" });
                this.page = this.records.length > 1 ? this.page : this.page - 1;
                this.getSpuList();
            }
        },
        // 添加Sku按钮的回调
        addSku(row) {
            // 切换场景为2
            this.scene = 2;
            // 通知子组件发请求
            this.$refs.sku.getData(
                this.category1Id,
                this.category2Id,
                this.category3Id,
                row
            );
        },
        // 展示sku列表对话框
        async showDialog(row) {
            // 获取sku列表数据
            this.dialogTableVisible = true;
            this.dialogTitle = row.spuName;
            const result = await this.$API.spu.reqSkuList(row.id);
            if (result.code === 200) {
                this.skuList = result.data;
                this.loading = false;
            }
        },
        // 关闭对话框的回调
        close(done) {
            // loading属性再次变味真
            this.loading = true;
            // 清空skuList
            this.skuList = [];
            // 关闭对话框
            done();
        },
    },
};
</script>

<style>
</style>