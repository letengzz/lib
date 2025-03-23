// 定义返回值类型
export interface Result<T> {
  code: number
  msg: string
  data: T
}
// 分页数据
export interface PagingRes<T> {
  records: T
  total: number
}
