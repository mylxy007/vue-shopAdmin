<template>
    <div>
        <el-form :inline="true" class="demo-form-inline" :model="cForm">
            <el-form-item label="一级分类">
                <el-select
                    placeholder="请选择"
                    v-model="cForm.category1Id"
                    @change="handler1"
                    :disabled="!isShowTable"
                >
                    <el-option
                        :label="c1.name"
                        :value="c1.id"
                        v-for="c1 in list1"
                        :key="c1.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select
                    placeholder="请选择"
                    v-model="cForm.category2Id"
                    @change="handler2"
                    :disabled="!isShowTable"
                >
                    <el-option
                        :label="c2.name"
                        :value="c2.id"
                        v-for="c2 in list2"
                        :key="c2.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select
                    placeholder="请选择"
                    v-model="cForm.category3Id"
                    @change="handler3"
                    :disabled="!isShowTable"
                >
                    <el-option
                        :label="c3.name"
                        :value="c3.id"
                        v-for="c3 in list3"
                        :key="c3.id"
                    ></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: "CategorySelect",
    props: ["isShowTable"],
    data() {
        return {
            //一级 二级 三级分类数据
            list1: [],
            list2: [],
            list3: [],
            //收集相应的一级二级三级分类id
            cForm: {
                category1Id: "",
                category2Id: "",
                category3Id: "",
            },
        };
    },
    mounted() {
        //组件挂载完毕后，获取一级分类数据
        this.getCategory1List();
    },
    methods: {
        //获取一级分类数据
        async getCategory1List() {
            const result = await this.$API.attr.reqCategory1List();
            if (result.code === 200) {
                this.list1 = result.data;
            }
        },
        //一级分类改变时，获取二级分类
        async handler1() {
            this.list2 = [];
            this.list3 = [];
            this.cForm.category2Id = "";
            this.cForm.category3Id = "";
            this.$emit("getCategoryId", {
                categoryId: this.cForm.category1Id,
                level: 1,
            });
            const result = await this.$API.attr.reqCategory2List(
                this.cForm.category1Id
            );
            if (result.code === 200) {
                this.list2 = result.data;
            }
        },
        //二级分类改变时，获取三级分类
        async handler2() {
            this.list3 = [];
            this.cForm.category3Id = "";
            this.$emit("getCategoryId", {
                categoryId: this.cForm.category2Id,
                level: 2,
            });
            const result = await this.$API.attr.reqCategory3List(
                this.cForm.category2Id
            );
            if (result.code === 200) {
                this.list3 = result.data;
            }
        },
        handler3() {
            this.$emit("getCategoryId", {
                categoryId: this.cForm.category3Id,
                level: 3,
            });
        },
    },
};
</script>

<style>
</style>