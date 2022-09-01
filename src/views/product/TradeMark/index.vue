<template>
    <div>
        <!-- 按钮 -->
        <el-button
            type="primary"
            icon="el-icon-plus"
            style="margin: 10px 0px"
            @click="showAddDialog"
            >添加</el-button
        >
        <!-- 表格 -->
        <el-table style="width: 100%" border :data="list">
            <el-table-column
                label="序号"
                width="80px"
                align="center"
                type="index"
            ></el-table-column>
            <el-table-column label="品牌名称" prop="tmName"></el-table-column>
            <el-table-column label="品牌LOGO">
                <!-- <template v-slot="{ row, $index }"> </template> -->
            </el-table-column>
            <el-table-column label="操作">
                <template v-slot="{ row }">
                    <el-button
                        type="warning"
                        icon="el-icon-edit"
                        size="mini"
                        @click="updateTradeMark(row)"
                        >修改</el-button
                    >
                    <el-button
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        @click="deleteTradeMark(row)"
                        >删除</el-button
                    >
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
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
            layout="prev, pager, next, jumper, ->, sizes, total"
        ></el-pagination>
        <!-- 添加表单对话框 -->
        <el-dialog
            :title="tmForm.id ? '修改品牌' : '添加品牌'"
            :visible.sync="addFormVisible"
        >
            <el-form
                style="width: 80%"
                :model="tmForm"
                :rules="rules"
                ref="tmForm"
            >
                <el-form-item
                    label="品牌名称"
                    label-width="100px"
                    prop="tmName"
                >
                    <el-input v-model="tmForm.tmName"></el-input>
                </el-form-item>
                <el-form-item
                    label="品牌LOGO"
                    label-width="100px"
                    prop="logoUrl"
                >
                    <el-upload
                        class="avatar-uploader"
                        action="/dev-api/admin/product/fileUpload"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                    >
                        <img
                            v-if="tmForm.logoUrl"
                            :src="tmForm.logoUrl"
                            class="avatar"
                        />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">
                            只能上传jpg/png文件，且不超过500kb
                        </div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取消</el-button>
                <el-button @click="addOrUpdateTradeMark" type="primary"
                    >确定</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "TradeMark",
    data() {
        var validateTmName = (rule, value, callback) => {
            if (value.trim().length < 2 || value.trim().length > 10) {
                callback(new Error("品牌名称2 - 10位"));
            } else {
                callback();
            }
        };
        return {
            // 代表分页器第几页
            page: 1,
            // 当前页数展示数据条数
            limit: 3,
            // 总共数据的条数
            total: 0,
            // 列表展示的数据
            list: [],
            //控制添加对话框显示/隐藏
            addFormVisible: false,
            //收集品牌信息
            tmForm: {
                tmName: "",
                logoUrl: "",
            },
            // 表单验证规则
            rules: {
                tmName: [
                    {
                        required: true,
                        message: "请输入品牌名称",
                        trigger: "blur",
                    },
                    {
                        validator: validateTmName,
                        trigger: "change",
                    },
                ],
                logoUrl: [
                    {
                        required: true,
                        message: "请选择品牌的图片",
                    },
                ],
            },
        };
    },
    mounted() {
        // 获取列表数据方法
        this.getPageList();
    },
    methods: {
        async getPageList() {
            const { page, limit } = this;
            const result = await this.$API.tradeMark.reqTradeMarkList(
                page,
                limit
            );
            if (result.code === 200) {
                this.total = result.data.total;
                this.list = result.data.records;
            }
        },
        handlePageChange(page) {
            this.page = page;
            this.getPageList();
        },
        handleSizeChange(limit) {
            this.limit = limit;
            this.getPageList();
        },
        // 显示添加对话框 按钮
        showAddDialog() {
            this.tmForm = { tmName: "", logoUrl: "" };
            this.addFormVisible = true;
        },
        // 修改品牌按钮
        updateTradeMark(row) {
            this.addFormVisible = true;
            this.tmForm = { ...row };
        },
        // 删除品牌信息按钮
        deleteTradeMark(row) {
            this.$confirm(`你确定删除${row.tmName}?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    this.page =
                        this.list.length > 1 ? this.page : this.page - 1;
                    const result = await this.$API.tradeMark.reqDeleteTradeMark(
                        row.id
                    );
                    if (result.code === 200) {
                        this.$message({
                            type: "success",
                            message: "删除成功!",
                        });
                        this.getPageList();
                    }
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },
        // 上传图片相关的方法
        // 图片上传成功
        handleAvatarSuccess(res, file) {
            // res  上传成功之后返回的图片真实地址
            // 收集图片地址
            this.tmForm.logoUrl = res.data;
        },
        // 图片上传之前
        beforeAvatarUpload(file) {
            const isJPG = file.type === "image/jpeg";
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error("上传头像图片只能是 JPG 格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传头像图片大小不能超过 2MB!");
            }
            return isJPG && isLt2M;
        },
        // 添加/修改品牌
        addOrUpdateTradeMark() {
            this.$refs.tmForm.validate(async (valid) => {
                // 如果符合全部规则
                if (valid) {
                    this.addFormVisible = false;
                    const result =
                        await this.$API.tradeMark.reqAddOrUpdateTradeMark(
                            this.tmForm
                        );
                    if (result.code === 200) {
                        this.$message({
                            type: "success",
                            message: this.tmForm.id
                                ? "修改品牌成功"
                                : "添加品牌成功",
                        });
                        this.getPageList();
                    }
                } else {
                    return false;
                }
            });
        },
        //删除品牌
    },
};
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>