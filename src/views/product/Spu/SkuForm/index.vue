<template>
    <div>
        <el-form ref="form" label-width="80px">
            <el-form-item label="SPU名称"> {{ spuName }} </el-form-item>
            <el-form-item label="SKU名称">
                <el-input
                    placeholder="SKU名称"
                    v-model="skuInfo.skuName"
                ></el-input>
            </el-form-item>
            <el-form-item label="价格(元)">
                <el-input
                    placeholder="价格(元)"
                    v-model="skuInfo.price"
                    type="number"
                ></el-input>
            </el-form-item>
            <el-form-item label="重量(千克)">
                <el-input
                    placeholder="重量(千克)"
                    v-model="skuInfo.weight"
                ></el-input>
            </el-form-item>
            <el-form-item label="规格描述">
                <el-input
                    type="textarea"
                    rows="4"
                    placeholder="规格描述"
                    v-model="skuInfo.skuDesc"
                ></el-input>
            </el-form-item>
            <el-form-item label="平台属性">
                <el-form ref="form" label-width="80px" :inline="true">
                    <el-form-item
                        :label="attrInfo.attrName"
                        v-for="attrInfo in attrInfoList"
                        :key="attrInfo.id"
                    >
                        <el-select
                            placeholder="请选择"
                            v-model="attrInfo.attrIdAndValueId"
                        >
                            <el-option
                                :label="attrValue.valueName"
                                :value="`${attrInfo.id}:${attrValue.id}`"
                                v-for="attrValue in attrInfo.attrValueList"
                                :key="attrValue.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="销售属性">
                <el-form ref="form" :inline="true" label-width="80px">
                    <el-form-item
                        :label="saleAttr.saleAttrName"
                        v-for="saleAttr in spuSaleAttrList"
                        :key="saleAttr.id"
                    >
                        <el-select
                            placeholder="请选择"
                            v-model="saleAttr.saleIdAndValueId"
                        >
                            <el-option
                                :label="saleAttrValue.saleAttrValueName"
                                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                                :key="saleAttrValue.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="图片列表">
                <el-table
                    style="width: 100%"
                    border
                    :data="spuImageList"
                    @selection-change="handleSelectionChange"
                    >>
                    <el-table-column type="selection" width="80">
                    </el-table-column>
                    <el-table-column label="图片" width="width">
                        <template v-slot="{ row, $index }">
                            <img
                                :src="row.imgUrl"
                                style="width: 100px; height: 100px"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column prop="imgName" label="名称" width="width">
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="width">
                        <template v-slot="{ row, $index }">
                            <el-button
                                type="primary"
                                v-if="row.isDefault === 0"
                                @click="changeDefault(row)"
                                >设置默认</el-button
                            >
                            <el-button v-else>默认</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="save">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: "SkuForm",
    data() {
        return {
            spuName: "", //SPU名称
            spuImageList: [], //存储图片信息
            spuSaleAttrList: [], //存储销售属性
            attrInfoList: [], //存储平台属性的数据
            skuInfo: {
                category3Id: 0,
                price: 0,
                // 平台属性
                skuAttrValueList: [
                    {
                        attrId: 0,
                        valueId: 0,
                    },
                ],
                skuDefaultImg: "",
                skuDesc: "",
                // 图片列表
                skuImageList: [
                    // {
                    //     id: 0,
                    //     imgName: "string",
                    //     imgUrl: "string",
                    //     isDefault: "string",
                    //     skuId: 0,
                    //     spuImgId: 0,
                    // },
                ],
                skuName: "",
                // 销售属性
                skuSaleAttrValueList: [
                    // {
                    //     id: 0,
                    //     saleAttrId: 0,
                    //     saleAttrName: "string",
                    //     saleAttrValueId: 0,
                    //     saleAttrValueName: "string",
                    //     skuId: 0,
                    //     spuId: 0,
                    // },
                ],
                spuId: 0,
                tmId: 0,
                weight: "",
            }, //存储sku信息
            imageList: [], //收集图片的数据字段
        };
    },
    methods: {
        // 获取skuForm数据
        async getData(category1Id, category2Id, category3Id, spu) {
            // 收集父组件给予的数据
            this.skuInfo.category3Id = category3Id;
            this.skuInfo.spuId = spu.id;
            this.skuInfo.tmId = spu.tmId;
            this.spuName = spu.spuName;
            // 获取图片的数据
            const result = await this.$API.spu.reqSpuImageList(spu.id);
            if (result.code === 200) {
                const list = result.data;
                list.forEach((item) => {
                    item.isDefault = 0;
                });
                this.spuImageList = list;
            }
            // 获取销售属性的数据
            const result1 = await this.$API.spu.reqSaleAttrList(spu.id);
            if (result1.code === 200) {
                this.spuSaleAttrList = result1.data;
            }
            // 获取平台属性
            const result2 = await this.$API.spu.reqAttrInfoList(
                category1Id,
                category2Id,
                category3Id
            );
            if (result2.code === 200) {
                this.attrInfoList = result2.data.slice(0, 3);
            }
        },
        // el-table表格复选框发生改变的回调
        handleSelectionChange(params) {
            // 获取用户选中图片的信息数据，缺少isDefault字段
            this.imageList = params;
        },
        // 默认图片 排他操作
        changeDefault(row) {
            this.spuImageList.forEach((item) => (item.isDefault = 0));
            row.isDefault = 1;
            // 收集默认图片的地址
            this.skuInfo.skuDefaultImg = row.imgUrl;
        },
        //点击取消按钮的回调
        cancel() {
            this.$emit("changeScene", { scene: 0 });
            // 清空数据
            Object.assign(this._data, this.$options.data());
        },
        // 点击保存按钮的回调
        async save() {
            // 整理参数
            // 整理平台属性
            const { attrInfoList, skuInfo, spuSaleAttrList } = this;
            skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
                if (item.attrIdAndValueId) {
                    const [attrId, valueId] = item.attrIdAndValueId.split(":");
                    prev.push({ attrId, valueId });
                }
                return prev;
            }, []);
            // 整理销售属性
            skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce(
                (prev, item) => {
                    if (item.saleIdAndValueId) {
                        const [saleAttrId, saleAttrValueId] =
                            item.saleIdAndValueId.split(":");
                        prev.push({ saleAttrId, saleAttrValueId });
                    }
                    return prev;
                },
                []
            );
            // 整理图片的数据
            skuInfo.skuImageList = this.imageList.map((item) => {
                return {
                    imgName: item.imgName,
                    imgUrl: item.imgUrl,
                    isDefault: item.isDefault,
                    spuImgId: item.id,
                };
            });
            // 发送请求
            const result = await this.$API.spu.reqAddSku(skuInfo);
            if (result.code === 200) {
                this.$message({ type: "success", message: "保存成功" });
                this.$emit("changeScene", { scene: 0 });
            }
            // 清空数据
            Object.assign(this._data, this.$options.data());
        },
    },
};
</script>

<style>
</style>