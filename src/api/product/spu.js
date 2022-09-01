import request from '@/utils/request'

// 获取SPU列表数据的接口
export const reqSpuList = (page, limit, category3Id) => request({
    url: `/admin/product/${page}/${limit}`,
    method: 'get',
    params: {
        category3Id
    }
})
// 获取Spu信息
export const reqSpuInfo = (spuId) => request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: 'get'
})
// 获取品牌信息
export const reqTradeMarkList = () => request({
    url: '/admin/product/baseTrademark/getTrademarkList',
    method: 'get'
})
// 获取Spu图片列表
export const reqSpuImageList = (spuId) => request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: 'get'
})
// 获取平台全部销售属性
export const reqBaseSaleAttrList = () => request({
    url: '/admin/product/baseSaleAttrList',
    method: 'get'
})

// 修改SPU||添加SPU：
export const reqAddOrUpdateSpu = (spuInfo) => {
    // 携带参数带有id
    if (spuInfo.id) {
        request({
            url: '/admin/product/updateSpuInfo',
            method: 'post',
            data: spuInfo,
        })
    } else {
        request({
            url: '/admin/product/saveSpuInfo',
            method: 'post',
            data: spuInfo
        })
    }
}
// 删除SPU
export const reqDeleteSpu = (spuId) => request({
    url: `/admin/product/deleteSpu/${spuId}`,
    method: 'delete',
})


//skuForm
// 获取销售属性数据接口
export const reqSaleAttrList = (spuId) => request({
    url: `/admin/product/spuSaleAttrList/${spuId}`,
    method: 'get'
})
// 获取平台属性
export const reqAttrInfoList = (
    category1Id,
    category2Id,
    category3Id
) => request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get'
})
// 修改||添加SKU
export const reqAddSku = (skuInfo) => request({
    url: '/admin/product/saveSpuInfo',
    method: 'post',
    data: skuInfo
})

// 获取Sku列表数据的接口给
export const reqSkuList = (spuId) => request({
    url: `/admin/product/findBySpuId/${spuId}`,
    method: 'get'
})
