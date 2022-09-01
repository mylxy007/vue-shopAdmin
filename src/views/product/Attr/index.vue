<template>
    <div>
        <el-card style="margin: 20px 0px">
            <CategorySelect
                @getCategoryId="getCategoryId"
                :isShowTable="isShowTable"
            ></CategorySelect>
        </el-card>
        <el-card>
            <div v-show="isShowTable">
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    style="margin-bottom: 10px"
                    :disabled="!category3Id"
                    @click="addAttr"
                    >添加属性</el-button
                >
                <!-- 表格 展示平台属性 -->
                <el-table :data="attrList" style="width: 100%" border>
                    <el-table-column type="index" label="序号" width="80px">
                    </el-table-column>
                    <el-table-column
                        prop="attrName"
                        label="属性名称"
                        width="150px"
                    >
                    </el-table-column>
                    <el-table-column label="属性值列表" width="width">
                        <template v-slot="{ row }">
                            <el-tag
                                type="success"
                                v-for="attrValue in row.attrValueList"
                                :key="attrValue.id"
                                style="margin: 0px 20px"
                                >{{ attrValue.valueName }}</el-tag
                            >
                        </template>
                    </el-table-column>

                    <el-table-column prop="prop" label="操作" width="150px">
                        <template v-slot="{ row }">
                            <el-button
                                type="warning"
                                icon="el-icon-edit"
                                size="mini"
                                @click="updateAttr(row)"
                            ></el-button>
                            <el-button
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                            ></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 添加属性 | 修改属性的结构 -->
            <div v-show="!isShowTable">
                <el-form :inline="true" ref="form" label-width="80px">
                    <el-form-item label="属性名">
                        <el-input
                            placeholder="请输入属性名"
                            v-model="attrInfo.attrName"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    @click="addAttrValue"
                    :disabled="!attrInfo.attrName || !category3Id"
                    >添加属性值</el-button
                >
                <el-button>取消</el-button>
                <el-table
                    style="width: 100%; margin: 20px 0"
                    border
                    :data="attrInfo.attrValueList"
                >
                    <el-table-column
                        type="index"
                        label="序号"
                        width="80"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="prop"
                        label="属性值名称"
                        width="width"
                    >
                        <template v-slot="{ row, $index }">
                            <el-input
                                placeholder="请输入属性值名称"
                                size="mini"
                                v-model.trim="row.valueName"
                                v-if="row.flag"
                                :ref="$index"
                                @blur="toLook(row)"
                                @keyup.native.enter="toLook(row)"
                            ></el-input>
                            <span
                                style="display: block"
                                v-else
                                @click="toEdit(row, $index)"
                                >{{ row.valueName }}</span
                            >
                        </template>
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="width">
                        <template v-slot="{ row, $index }">
                            <!-- 气泡确认框 -->
                            <el-popconfirm
                                :title="`确定删除${row.valueName}吗?`"
                                @onConfirm="deleteAttrValue($index)"
                            >
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    slot="reference"
                                ></el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button
                    type="primary"
                    @click="addOrUpdateAttr"
                    :disabled="attrInfo.attrValueList.length < 1"
                    >保存</el-button
                >
                <el-button @click="isShowTable = true">取消</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
    name: "Attr",
    data() {
        return {
            category1Id: "",
            category2Id: "",
            category3Id: "",
            //接收平台属性
            attrList: [],
            //控制table表格显示/隐藏
            isShowTable: true,
            // 收集新增属性 | 修改属性使用
            attrInfo: {
                attrName: "",
                attrValueList: [],
                categoryId: 0,
                categoryLevel: 3,
            },
        };
    },
    methods: {
        //自定义事件的回调
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
                this.getAttrList();
            }
        },
        // 获取平台属性的数据
        async getAttrList() {
            const { category1Id, category2Id, category3Id } = this;
            const result = await this.$API.attr.reqAttrInfoList({
                category1Id,
                category2Id,
                category3Id,
            });
            if (result.code === 200) {
                this.attrList = result.data;
            }
        },
        // 添加属性值
        addAttrValue() {
            //向属性值的数组里面添加元素
            this.attrInfo.attrValueList.push({
                attrId: this.attrInfo.id,
                valueName: "",
                flag: true,
            });
            this.$nextTick(() => {
                this.$refs[this.attrInfo.attrValueList.length - 1].focus();
            });
        },
        // 添加属性按钮的回调
        addAttr() {
            //切换table显示与隐藏
            this.isShowTable = false;
            //清除数据
            this.attrInfo = {
                attrName: "",
                attrValueList: [],
                categoryId: this.category3Id,
                categoryLevel: 3,
            };
        },
        // 修改属性按钮的回调
        updateAttr(row) {
            this.isShowTable = false;
            this.flag = false;
            this.attrInfo = cloneDeep(row);
            // 在修改某一个属性时天骄flag这个标记
            this.attrInfo.attrValueList.forEach((item) => {
                this.$set(item, "flag", false);
            });
        },
        // 由编辑模式切换为查看模式
        toLook(row) {
            // 属性值不能为空
            if (row.valueName == "") {
                this.$message().close();
                this.$message("属性值不能为空");
                this.attrInfo.attrValueList.pop();
                return;
            }
            // 新增的属性值不能和以后的相同
            let isRept = this.attrInfo.attrValueList.some((item) => {
                if (row !== item) {
                    return item.valueName === row.valueName;
                }
            });
            if (isRept) {
                this.$message("不能添加相同的属性值");
                // row.valueName = "";
                return;
            }
            row.flag = false;
        },
        //由变成编辑模式
        toEdit(row, index) {
            row.flag = true;
            this.$nextTick(() => {
                console.log(this.$refs[index]);
                this.$refs[index].focus();
            });
        },
        // 气泡确认框确定按钮的回调
        deleteAttrValue(index) {
            this.attrInfo.attrValueList.splice(index, 1);
        },
        // 保存按钮：进行添加属性或者修改属性的操作
        async addOrUpdateAttr() {
            this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
                (item) => {
                    delete item.flag;
                    return true;
                }
            );
            // 发送请求
            try {
                await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
                // 展示平台属性
                this.isShowTable = true;
                this.$message({ type: "success", message: "保存成功" });
                // 重新获取数据
                this.getAttrList();
            } catch (err) {
                this.$message("保存失败");
            }
        },
    },
};
</script>

<style>
</style>