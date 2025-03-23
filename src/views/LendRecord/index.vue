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
        <el-form-item label="读者编号">
          <el-input v-model="search3" placeholder="请输入读者编号" clearable>
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
    <div style="margin: 10px 0" v-if="user.role === 1">
      <el-popconfirm title="确认删除?" @confirm="deleteBatch">
        <template #reference>
          <el-button type="danger" size="mini">批量删除</el-button>
        </template>
      </el-popconfirm>
    </div>

    <!-- 数据字段 -->
    <el-table :data="tableData" stripe border @selection-change="handleSelectionChange">
      <el-table-column v-if="user.role === 1" type="selection" width="55"></el-table-column>
      <el-table-column prop="isbn" label="图书编号" sortable />
      <el-table-column prop="bookname" label="图书名称" />
      <el-table-column prop="readerId" label="读者编号" sortable />
      <el-table-column prop="lendTime" label="借阅时间" sortable />
      <el-table-column prop="returnTime" label="归还时间" sortable />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 0" type="warning">未归还</el-tag>
          <el-tag v-else type="success">已归还</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="user.role === 1" label="操作" width="230px">
        <template #default="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除?" @confirm="handleDelete(scope.row)">
            <template #reference>
              <el-button type="danger" size="mini">删除</el-button>
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

      <!-- 修改借阅记录对话框 -->
      <el-dialog v-model="dialogVisible" title="修改借阅记录" width="30%">
        <el-form :model="form" label-width="120px">
          <el-form-item label="借阅时间">
            <el-date-picker v-model="form.lendTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
          </el-form-item>
          <el-form-item label="归还时间">
            <el-date-picker v-model="form.returnTime" type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
          </el-form-item>
          <el-form-item label="是否归还" prop="status">
            <el-radio v-model="form.status" label="0">未归还</el-radio>
            <el-radio v-model="form.status" label="1">已归还</el-radio>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="save(form.isbn)">确定</el-button>
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
const dialogVisible = ref(false);
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
    .get("/LendRecord", {
      params: {
        pageNum: currentPage.value,
        pageSize: pageSize.value,
        search1: search1.value,
        search2: search2.value,
        search3: search3.value,
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
  request.post("/LendRecord/deleteRecords", forms.value).then((res) => {
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
  request.post("/LendRecord/deleteRecord", form3).then((res) => {
    if (res.code === "0") {
      ElMessage.success("删除成功");
    } else {
      ElMessage.error(res.msg);
    }
    load();
  });
};

// 编辑记录
const handleEdit = (row) => {
  form.value = JSON.parse(JSON.stringify(row));
  dialogVisible.value = true;
};

// 保存修改
const save = (isbn) => {
  if (form.value.isbn) {
    request.put(`/LendRecord/${isbn}`, form.value).then((res) => {
      if (res.code === "0") {
        ElMessage({
          message: "更新成功",
          type: "success",
        });
      } else {
        ElMessage.error(res.msg);
      }
      load();
      dialogVisible.value = false;
    });
  } else {
    request.post(`/LendRecord${isbn}`, form.value).then((res) => {
      if (res.code === "0") {
        ElMessage({
          message: "新增成功",
          type: "success",
        });
      } else {
        ElMessage.error(res.msg);
      }
      load();
      dialogVisible.value = false;
    });
  }
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
