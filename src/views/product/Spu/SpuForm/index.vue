<template>
    <div>
        <el-form ref="form" label-width="80px">
            <el-form-item label="SPU名称">
                <el-input
                    placeholder="SPU名称"
                    v-model="spu.spuName"
                ></el-input>
            </el-form-item>
            <el-form-item label="品牌">
                <el-select placeholder="请选择品牌" v-model="spu.tmId">
                    <el-option
                        :label="tm.tmName"
                        :value="tm.id"
                        v-for="tm in tradeMarkList"
                        :key="tm.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="SPU描述">
                <el-input
                    type="textarea"
                    rows="4"
                    placeholder="SPU描述"
                    v-model="spu.description"
                ></el-input>
            </el-form-item>
            <el-form-item label="SPU图片">
                <el-upload
                    action="/dev-api/admin/product/fileUpload"
                    list-type="picture-card"
                    :file-list="spuImageList"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                >
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="" />
                </el-dialog>
            </el-form-item>
            <el-form-item label="销售属性">
                <el-select
                    :placeholder="`还有${unSeletSaleAttr.length}未选择`"
                    v-model="attrIdAndName"
                >
                    <el-option
                        :label="unselect.name"
                        :value="`${unselect.id}:${unselect.name}`"
                        v-for="unselect in unSeletSaleAttr"
                        :key="unselect.id"
                    ></el-option>
                </el-select>
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    :disabled="!attrIdAndName"
                    @click="addSaleAttr"
                    >添加销售属性</el-button
                >
                <el-table
                    style="width: 100%"
                    border
                    :data="spu.spuSaleAttrList"
                >
                    <el-table-column
                        type="index"
                        label="序号"
                        width="80"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        label="属性名"
                        width="width"
                        prop="saleAttrName"
                    >
                    </el-table-column>
                    <el-table-column label="属性值名称列表" width="width">
                        <template v-slot="{ row, $index }">
                            <el-tag
                                v-for="(tag, index) in row.spuSaleAttrValueList"
                                :key="tag.id"
                                closable
                                :disable-transitions="false"
                                @close="
                                    row.spuSaleAttrValueList.splice(index, 1)
                                "
                            >
                                {{ tag.saleAttrValueName }}
                            </el-tag>
                            <el-input
                                class="input-new-tag"
                                v-if="row.inputVisible"
                                v-model.trim="row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(row)"
                                @blur="handleInputConfirm(row)"
                            >
                            </el-input>
                            <el-button
                                v-else
                                class="button-new-tag"
                                size="small"
                                @click="addSaleAttrValue(row)"
                                >添加</el-button
                            >
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="width">
                        <template v-slot="{ row, $index }">
                            <el-button
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                @click="spu.spuSaleAttrList.splice($index, 1)"
                            ></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addOrUpdateSpu"
                    >保存</el-button
                >
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: "SpuForm",
    data() {
        return {
            dialogImageUrl: "", //图片预览的地址
            dialogVisible: false, //控制预览大图显示隐藏
            spu: {
                category3Id: 0,
                description: "",
                id: 0,
                spuImageList: [],
                spuName: "",
                spuSaleAttrList: [],
                tmId: "", //品牌id
            }, //存储spu信息属性
            tradeMarkList: [], //存储品牌信息
            spuImageList: [], //存储spu图片信息
            saleAttrList: [], //存储销售属性
            attrIdAndName: "", //收集未选择的销售属性的id
        };
    },
    methods: {
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        // 初始化Spu数据的方法
        async initSpuData(row) {
            // 获取spu信息的数据
            const spuResult = await this.$API.spu.reqSpuInfo(row.id);
            if (spuResult.code === 200) {
                this.spu = spuResult.data;
            }
            // 获取品牌的信息
            const tradeMarkResult = await this.$API.spu.reqTradeMarkList();
            if (tradeMarkResult.code === 200) {
                this.tradeMarkList = tradeMarkResult.data;
            }
            // 获取spu图片的数据
            const spuIamgeResult = await this.$API.spu.reqSpuImageList(row.id);
            if (spuIamgeResult.code === 200) {
                let listArr = spuIamgeResult.data;
                // 照片墙显示图片的数据需要数组，里面的元素需要有name与url字段
                listArr.forEach((item) => {
                    item.name = item.imgName;
                    item.url = item.imgUrl;
                });
                this.spuImageList = listArr;
            }
            // 获取平台全部的销售属性
            let saleResult = await this.$API.spu.reqBaseSaleAttrList();
            if (saleResult.code === 200) {
                this.saleAttrList = saleResult.data;
            }
        },
        // 点击添加Spu时发送请求
        async addspuData(category3Id) {
            // 添加Spu的时候手机三级分类的id
            this.spu.category3Id = category3Id;
            // 获取品牌的信息
            const tradeMarkResult = await this.$API.spu.reqTradeMarkList();
            if (tradeMarkResult.code === 200) {
                this.tradeMarkList = tradeMarkResult.data;
            }
            // 获取平台全部的销售属性
            let saleResult = await this.$API.spu.reqBaseSaleAttrList();
            if (saleResult.code === 200) {
                this.saleAttrList = saleResult.data;
            }
        },
        //删除图片墙图片的回调
        handleRemove(file, fileList) {
            // file:删除的那张图片
            //fileList: 剩余的图片数组
            // fileList 有多余的字段，提交给服务器时需要处理
            this.spuImageList = fileList;
        },
        // 照片墙图片预览的回调
        handlePictureCardPreview(file) {
            // file：点击图片的地址
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        //照片墙图片上传成功的回调
        handleSuccess(response, file, fileList) {
            // 收集图片的信息
            this.spuImageList = fileList;
        },
        // 添加新的销售属性
        addSaleAttr() {
            // 把新的销售属性解构出来
            const [baseSaleAttrId, saleAttrName] =
                this.attrIdAndName.split(":");
            let newSaleAttr = {
                baseSaleAttrId,
                saleAttrName,
                spuSaleAttrValueList: [],
            };
            // 向spu.spuSaleAttrList属性添加新的属性
            this.spu.spuSaleAttrList.push(newSaleAttr);
            this.attrIdAndName = "";
        },
        // 添加按钮的回调
        addSaleAttrValue(row) {
            // 添加响应式数据，控制button与input切换
            this.$set(row, "inputVisible", false);
            row.inputVisible = true;
            // 通过响应式数据，手机新增的销售属性值
            this.$set(row, "inputValue", "");
            this.$nextTick((_) => {
                this.$refs.saveTagInput.focus();
            });
        },
        // el-input 失去焦点的事件
        handleInputConfirm(row) {
            // 解构出销售属性当中收集数据
            const { baseSaleAttrId, inputValue } = row;
            if (inputValue == "") {
                this.$message("属性值不能为空");
                row.inputVisible = false;
                return;
            }
            // 属性值不能重复
            const result = row.spuSaleAttrValueList.some(
                (item) => item.saleAttrValueName === inputValue
            );
            if (result) {
                this.$message("属性值不能重复");
                row.inputVisible = false;
                return;
            }
            // 新增的销售属性值
            let newSaleAttrValue = {
                baseSaleAttrId,
                saleAttrValueName: inputValue,
            };
            // 新增
            row.spuSaleAttrValueList.push(newSaleAttrValue);
            // 展示button
            row.inputVisible = false;
        },
        // 保存按钮的回调
        async addOrUpdateSpu() {
            // 整理参数
            // 图片:需要携带imageName与imageUrl字段
            this.spu.spuImageList = this.spuImageList.map((item) => {
                return {
                    imgName: item.name,
                    imgUrl: (item.response && item.response.data) || item.url,
                };
            });
            // 发送请求
            try {
                await this.$API.spu.reqAddOrUpdateSpu(this.spu);
                this.$message("保存成功");
                // 通知父组件回到场景0
                this.$emit("changeScene", {
                    scene: 0,
                    flag: this.spu.id ? "修改" : "添加",
                });
            } catch (err) {
                this.$message("保存失败，请稍后重试");
            }
            // 清空数据
            Object.assign(this._data, this.$options.data());
        },
        // 点击取消按钮的回调
        cancel() {
            // 清空数据
            Object.assign(this._data, this.$options.data());
            // 通知父组件切换场景
            this.$emit("changeScene", { scene: 0 });
        },
    },
    computed: {
        // 计算出还未选择的销售属性
        unSeletSaleAttr() {
            return this.saleAttrList.filter(
                (item) =>
                    !this.spu.spuSaleAttrList.some(
                        (item2) => item2.saleAttrName === item.name
                    )
            );
        },
    },
};
</script>

<style>
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>