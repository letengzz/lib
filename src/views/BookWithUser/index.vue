<template>
  <div class="home" style="padding: 10px">
    <!-- 搜索 -->
    <div style="margin: 10px 0">
      <el-form inline size="small">
        <el-form-item label="图书编号">
          <el-input v-model="search1" placeholder="请输入图书编号" clearable>
            <template #prefix>
              <el-icon class="el-input__icon">
                <Search />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="图书名称">
          <el-input v-model="search2" placeholder="请输入图书名称" clearable>
            <template #prefix>
              <el-icon class="el-input__icon">
                <Search />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="借阅者" v-if="user.role === 1">
          <el-input v-model="search3" placeholder="请输入借阅者昵称" clearable>
            <template #prefix>
              <el-icon class="el-input__icon">
                <Search />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="margin-left: 1%" @click="load" size="mini">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="danger" @click="clear">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 按钮 -->
    <div style="margin: 10px 0">
      <el-popconfirm title="确认删除?" @confirm="deleteBatch" v-if="user.role === 1">
        <template #reference>
          <el-button type="danger" size="mini">批量删除</el-button>
        </template>
      </el-popconfirm>
    </div>

    <!-- 数据字段 -->
    <el-table :data="tableData" stripe border @selection-change="handleSelectionChange">
      <el-table-column v-if="user.role === 1" type="selection" width="55"></el-table-column>
      <el-table-column prop="isbn" label="图书编号" sortable />
      <el-table-column prop="bookName" label="图书名称" />
      <el-table-column prop="nickName" label="借阅者" />
      <el-table-column prop="lendtime" label="借阅时间" />
      <el-table-column prop="deadtime" label="最迟归还日期" />
      <el-table-column prop="prolong" label="可续借次数" />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button size="mini" @click="handleEdit(scope.row)" v-if="user.role === 1">修改</el-button>
          <el-popconfirm title="确认删除?" @confirm="handleDelete(scope.row)" v-if="user.role === 1">
            <template #reference>
              <el-button type="danger" size="mini">删除</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm title="确认续借(续借一次延长30天)?" @confirm="handlereProlong(scope.row)" v-if="user.role === 2"
            :disabled="scope.row.prolong === 0">
            <template #reference>
              <el-button type="danger" size="mini" :disabled="scope.row.prolong === 0">续借</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div style="margin: 10px 0">
      <el-pagination v-model:current-page="currentPage" :page-sizes="[5, 10, 20]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange"></el-pagination>

      <!-- 修改借阅信息对话框 -->
      <el-dialog v-model="dialogVisible2" title="修改借阅信息" width="30%">
        <el-form :model="form" label-width="120px">
          <el-form-item label="图书编号">
            <el-input style="width: 80%" v-model="form.isbn"></el-input>
          </el-form-item>
          <el-form-item label="图书名称">
            <el-input style="width: 80%" v-model="form.bookName"></el-input>
          </el-form-item>
          <el-form-item label="借阅者">
            <el-input style="width: 80%" v-model="form.nickName"></el-input>
          </el-form-item>
          <el-form-item label="续借次数">
            <el-input style="width: 80%" v-model="form.prolong"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible2 = false">取消</el-button>
            <el-button type="primary" @click="save">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import request from "@/utils/request";
import { ElMessage } from "element-plus";
import moment from "moment";
import { Search } from "@element-plus/icons-vue";

// 定义响应式数据
const search1 = ref("");
const search2 = ref("");
const search3 = ref("");
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const tableData = ref([]);
const user = ref({});
const forms = ref([]);
const dialogVisible2 = ref(false);
const form = ref({});

// 在组件挂载时加载用户信息和数据
onMounted(() => {
  const userStr = sessionStorage.getItem("user") || "{}";
  user.value = JSON.parse(userStr);
  load();
});

// 加载表格数据
const load = () => {
  request
    .get("/bookwithuser", {
      params: {
        pageNum: currentPage.value,
        pageSize: pageSize.value,
        search1: search1.value,
        search2: search2.value,
        search3: user.value.role === 1 ? search3.value : user.value.id,
      },
    })
    .then((res) => {
      console.log(res);
      tableData.value = res.data.records;
      total.value = res.data.total;
    });
};

// 清空搜索条件
const clear = () => {
  search1.value = "";
  search2.value = "";
  search3.value = "";
  load();
};

// 处理多选变化
const handleSelectionChange = (val) => {
  forms.value = val;
};

// 批量删除
const deleteBatch = () => {
  if (!forms.value.length) {
    ElMessage.warning("请选择数据！");
    return;
  }
  request.post("/bookwithuser/deleteRecords", forms.value).then((res) => {
    if (res.code === "0") {
      ElMessage.success("批量删除成功");
      load();
    } else {
      ElMessage.error(res.msg);
    }
  });
};

// 删除单个记录
const handleDelete = (row) => {
  const form3 = JSON.parse(JSON.stringify(row));
  request.post("/bookwithuser/deleteRecord", form3).then((res) => {
    if (res.code === "0") {
      ElMessage.success("删除成功");
    } else {
      ElMessage.error(res.msg);
    }
    load();
  });
};

// 续借
const handlereProlong = (row) => {
  const nowDate = new Date(row.deadtime);
  nowDate.setDate(nowDate.getDate() + 30);
  row.deadtime = moment(nowDate).format("yyyy-MM-DD HH:mm:ss");
  row.prolong = row.prolong - 1;
  request.post("/bookwithuser", row).then((res) => {
    if (res.code === "0") {
      ElMessage({
        message: "续借成功",
        type: "success",
      });
    } else {
      ElMessage.error(res.msg);
    }
    load();
  });
};

// 修改借阅信息
const handleEdit = (row) => {
  form.value = JSON.parse(JSON.stringify(row));
  dialogVisible2.value = true;
};

// 保存修改
const save = () => {
  request.post("/bookwithuser", form.value).then((res) => {
    if (res.code === "0") {
      ElMessage({
        message: "修改信息成功",
        type: "success",
      });
    } else {
      ElMessage.error(res.msg);
    }
    load();
    dialogVisible2.value = false;
  });
};

// 分页大小改变
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  load();
};

// 当前页码改变
const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
  load();
};
</script>

<style scoped>
/* 样式部分保持不变 */
</style>
