import request from '@/utils/request'
// 获取品牌列表接口
// /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit) => request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: 'get'
})

// 添加或修改品牌接口
// 添加 /admin/product/baseTrademark/save
// 修改 /admin/product/baseTrademark/update
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    //修改
    if (tradeMark.id) {
        return request({
            url: '/admin/product/baseTrademark/update',
            method: 'put',
            data: tradeMark
        })
    } else {
        //新增品牌
        return request({
            url: '/admin/product/baseTrademark/save',
            method: 'post',
            data: tradeMark
        })
    }
}

// 删除品牌接口
export const reqDeleteTradeMark = (id) => request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'delete'
})
