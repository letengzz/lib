<template>
  <div mt-15>
    <el-row :gutter="18" h80 style="margin-left: 0; margin-right: 0;">
      <el-col :span="6" v-for="item in cards" :key="item.title">
        <el-card class="box-card">
          <template v-slot:header>
            <div class="clearfix">{{ item.title }}</div>
          </template>
          <div class="text item">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="item.icon" style="width: 100px"></use>
            </svg>
            <span class="text">{{ item.data }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
    <div id="main"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import { ElMessage } from "element-plus";
import request from "@/http/index";

// 定义响应式数据
const cards = ref([
  { title: "已借阅", data: 100, icon: "#iconlend-record-pro" },
  { title: "总访问", data: 100, icon: "#iconvisit" },
  { title: "图书数", data: 100, icon: "#iconbook-pro" },
  { title: "用户数", data: 1000, icon: "#iconpopulation" }
]);
// 定义后端返回的数据结构
interface DashboardResponse {
  lendRecordCount: number;
  visitCount: number;
  bookCount: number;
  userCount: number;
}

// 在组件挂载时加载数据和初始化图表
onMounted(() => {

  // 请求数据并更新卡片内容
  request.get("/dashboard").then((res) => {
    if (res.code === 200) {
      const data = res.data as DashboardResponse; // 类型断言
      cards.value[0].data = data.lendRecordCount;
      cards.value[1].data = data.visitCount;
      cards.value[2].data = data.bookCount;
      cards.value[3].data = data.userCount;

      // 初始化 ECharts 实例
      const myChart = echarts.init(document.getElementById("main"));

      // 绘制图表
      myChart.setOption({
        // title: {
        //   text: "统计"
        // },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "3%",
          right: "4%",
          top: "30%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: cards.value.map((item) => item.title),
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            type: "bar",
            label: { show: true },
            barWidth: "25%",
            data: [
              { value: cards.value[0].data, itemStyle: { color: "#5470c6" } },
              { value: cards.value[1].data, itemStyle: { color: "#91cc75" } },
              { value: cards.value[2].data, itemStyle: { color: "#fac858" } },
              { value: cards.value[3].data, itemStyle: { color: "#ee6666" } }
            ]
          }
        ]
      });

      // 监听窗口大小变化，调整图表尺寸
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    } else {
      ElMessage.error(res.msg);
    }
  });
});
</script>

<style scoped>
.box-card {
  width: 80%;
  margin-bottom: 25px;
  margin-left: 10px;
}

.clearfix {
  text-align: center;
  font-size: 15px;
}

.text {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  vertical-align: super;
}

#main {
  width: 100%;
  height: 450px;
  margin-top: 20px;
}

.icon {
  width: 50px;
  height: 50px;
  padding-top: 5px;
  padding-right: 10px;
}
</style>
