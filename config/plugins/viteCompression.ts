// giz 压缩
// 压缩gzip
import viteCompression from "vite-plugin-compression";

export function viteCompressionPlugin() {
  return viteCompression({
    verbose: true, // 默认即可
    disable: false, // 开启压缩(不禁用)，默认即可
    deleteOriginFile: false, // 删除源文件
    threshold: 10240, // 压缩前最小文件大小
    algorithm: "gzip", // 压缩算法
    ext: ".gz", // 文件类型
  });
}
