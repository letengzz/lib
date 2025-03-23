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
        <el-form-item label="作者">
          <el-input v-model="search3" placeholder="请输入作者" clearable>
            <template #prefix>
              <el-icon class="el-input__icon">
                <Search />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="margin-left: 1%" @click="load" size="mini">
            <svg-icon icon-class="search" />查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="danger" @click="clear">重置</el-button>
        </el-form-item>
        <el-form-item style="float: right" v-if="numOfOutDataBook !== 0">
          <el-popconfirm confirm-button-text="查看" cancel-button-text="取消" :icon="InfoFilled" icon-color="red"
            title="您有图书已逾期，请尽快归还" @confirm="toLook">
            <template #reference>
              <el-button type="warning">逾期通知</el-button>
            </template>
          </el-popconfirm>
        </el-form-item>
      </el-form>
    </div>
    <!-- 按钮 -->
    <div style="margin: 10px 0">
      <el-button type="primary" @click="add" v-if="user.role === 1">上架</el-button>
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
      <el-table-column prop="name" label="图书名称" />
      <el-table-column prop="price" label="价格" sortable />
      <el-table-column prop="author" label="作者" />
      <el-table-column prop="publisher" label="出版社" />
      <el-table-column prop="createTime" label="出版时间" sortable />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 0" type="warning">已借阅</el-tag>
          <el-tag v-else type="success">未借阅</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button size="mini" @click="handleEdit(scope.row)" v-if="user.role === 1">修改</el-button>
          <el-popconfirm title="确认删除?" @confirm="handleDelete(scope.row.id)" v-if="user.role === 1">
            <template #reference>
              <el-button type="danger" size="mini">删除</el-button>
            </template>
          </el-popconfirm>
          <el-button size="mini" @click="handleLend(scope.row.id, scope.row.isbn, scope.row.name, scope.row.borrownum)"
            v-if="user.role === 2" :disabled="scope.row.status === 0">
            借阅
          </el-button>
          <el-popconfirm title="确认还书?" @confirm="handleReturn(scope.row.id, scope.row.isbn, scope.row.borrownum)"
            v-if="user.role === 2" :disabled="scope.row.status === 1">
            <template #reference>
              <el-button type="danger" size="mini"
                :disabled="isbnArray.indexOf(scope.row.isbn) === -1 || scope.row.status === 1">
                还书
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 逾期详情对话框 -->
    <el-dialog v-model="dialogVisible3" v-if="numOfOutDataBook !== 0" title="逾期详情" width="50%"
      :before-close="handleClose">
      <el-table :data="outDateBook" style="width: 100%">
        <el-table-column prop="isbn" label="图书编号" />
        <el-table-column prop="bookName" label="书名" />
        <el-table-column prop="lendtime" label="借阅日期" />
        <el-table-column prop="deadtime" label="截至日期" />
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible3 = false">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分页 -->
    <div style="margin: 10px 0">
      <el-pagination v-model:current-page="currentPage" :page-sizes="[5, 10, 20]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange"></el-pagination>

      <!-- 上架书籍对话框 -->
      <el-dialog v-model="dialogVisible" title="上架书籍" width="30%">
        <el-form :model="form" label-width="120px">
          <el-form-item label="图书编号">
            <el-input style="width: 80%" v-model="form.isbn"></el-input>
          </el-form-item>
          <el-form-item label="图书名称">
            <el-input style="width: 80%" v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="价格">
            <el-input style="width: 80%" v-model="form.price"></el-input>
          </el-form-item>
          <el-form-item label="作者">
            <el-input style="width: 80%" v-model="form.author"></el-input>
          </el-form-item>
          <el-form-item label="出版社">
            <el-input style="width: 80%" v-model="form.publisher"></el-input>
          </el-form-item>
          <el-form-item label="出版时间">
            <el-date-picker value-format="YYYY-MM-DD" type="date" style="width: 80%" clearable
              v-model="form.createTime"></el-date-picker>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="save">确定</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 修改书籍信息对话框 -->
      <el-dialog v-model="dialogVisible2" title="修改书籍信息" width="30%">
        <el-form :model="form" label-width="120px">
          <el-form-item label="图书编号">
            <el-input style="width: 80%" v-model="form.isbn"></el-input>
          </el-form-item>
          <el-form-item label="图书名称">
            <el-input style="width: 80%" v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="价格">
            <el-input style="width: 80%" v-model="form.price"></el-input>
          </el-form-item>
          <el-form-item label="作者">
            <el-input style="width: 80%" v-model="form.author"></el-input>
          </el-form-item>
          <el-form-item label="出版社">
            <el-input style="width: 80%" v-model="form.publisher"></el-input>
          </el-form-item>
          <el-form-item label="出版时间">
            <el-date-picker value-format="YYYY-MM-DD" type="date" style="width: 80%" clearable
              v-model="form.createTime"></el-date-picker>
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
import { Search, InfoFilled } from "@element-plus/icons-vue";

// 定义响应式数据
const search1 = ref("");
const search2 = ref("");
const search3 = ref("");
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const tableData = ref([]);
const user = ref({});
const number = ref(0);
const bookData = ref([]);
const isbnArray = ref([]);
const outDateBook = ref([]);
const numOfOutDataBook = ref(0);
const dialogVisible = ref(false);
const dialogVisible2 = ref(false);
const dialogVisible3 = ref(false);
const form = ref({});
const form2 = ref({});
const form3 = ref({});
const ids = ref([]);

// 在组件挂载时加载用户信息和数据
onMounted(() => {
  const userStr = sessionStorage.getItem("user") || "{}";
  user.value = JSON.parse(userStr);
  load();
});

// 加载表格数据
const load = () => {
  numOfOutDataBook.value = 0;
  outDateBook.value = [];
  request
    .get("/book", {
      params: {
        pageNum: currentPage.value,
        pageSize: pageSize.value,
        search1: search1.value,
        search2: search2.value,
        search3: search3.value,
      },
    })
    .then((res) => {
      tableData.value = res.data.records;
      total.value = res.data.total;
    });

  if (user.value.role === 2) {
    request
      .get("/bookwithuser", {
        params: {
          pageNum: 1,
          pageSize: total.value,
          search1: "",
          search2: "",
          search3: user.value.id,
        },
      })
      .then((res) => {
        bookData.value = res.data.records;
        number.value = bookData.value.length;
        const nowDate = new Date();
        for (let i = 0; i < number.value; i++) {
          isbnArray.value[i] = bookData.value[i].isbn;
          const dDate = new Date(bookData.value[i].deadtime);
          if (dDate < nowDate) {
            outDateBook.value[numOfOutDataBook.value] = {
              isbn: bookData.value[i].isbn,
              bookName: bookData.value[i].bookName,
              deadtime: bookData.value[i].deadtime,
              lendtime: bookData.value[i].lendtime,
            };
            numOfOutDataBook.value++;
          }
        }
      });
  }
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
  ids.value = val.map((v) => v.id);
};

// 批量删除
const deleteBatch = () => {
  if (!ids.value.length) {
    ElMessage.warning("请选择数据！");
    return;
  }
  request.post("/book/deleteBatch", ids.value).then((res) => {
    if (res.code === "0") {
      ElMessage.success("批量删除成功");
      load();
    } else {
      ElMessage.error(res.msg);
    }
  });
};

// 删除单个记录
const handleDelete = (id) => {
  request.delete(`/book/${id}`).then((res) => {
    if (res.code === "0") {
      ElMessage.success("删除成功");
    } else {
      ElMessage.error(res.msg);
    }
    load();
  });
};

// 借阅书籍
const handleLend = (id, isbn, name, bn) => {
  if (number.value === 5) {
    ElMessage.warning("您不能再借阅更多的书籍了");
    return;
  }
  if (numOfOutDataBook.value !== 0) {
    ElMessage.warning("在您归还逾期书籍前不能再借阅书籍");
    return;
  }
  form.value = { id, status: "0", borrownum: bn + 1 };
  request.put("/book", form.value).then((res) => {
    if (res.code === "0") {
      ElMessage.success("借阅成功");
    } else {
      ElMessage.error(res.msg);
    }
  });
  form2.value = {
    status: "0",
    isbn,
    bookname: name,
    readerId: user.value.id,
    borrownum: bn + 1,
    lendTime: moment(new Date()).format("yyyy-MM-DD HH:mm:ss"),
  };
  request.post("/LendRecord", form2.value).then(() => {
    const form3Data = {
      isbn,
      bookName: name,
      nickName: user.value.username,
      id: user.value.id,
      lendtime: form2.value.lendTime,
      deadtime: moment(new Date()).add(30, "days").format("yyyy-MM-DD HH:mm:ss"),
      prolong: 1,
    };
    request.post("/bookwithuser/insertNew", form3Data).then(() => {
      load();
    });
  });
};

// 还书
const handleReturn = (id, isbn, bn) => {
  form.value = { id, status: "1" };
  request.put("/book", form.value).then((res) => {
    if (res.code === "0") {
      ElMessage.success("还书成功");
    } else {
      ElMessage.error(res.msg);
    }
  });
  form3.value = {
    isbn,
    readerId: user.value.id,
    returnTime: moment(new Date()).format("yyyy-MM-DD HH:mm:ss"),
    status: "1",
    borrownum: bn,
  };
  request.put("/LendRecord1/", form3.value).then(() => {
    const form3Data = {
      isbn,
      bookName: "",
      nickName: user.value.username,
      id: user.value.id,
      lendtime: form3.value.returnTime,
      deadtime: form3.value.returnTime,
      prolong: 1,
    };
    request.post("/bookwithuser/deleteRecord", form3Data).then(() => {
      load();
    });
  });
};

// 添加书籍
const add = () => {
  dialogVisible.value = true;
  form.value = {};
};

// 保存书籍信息
const save = () => {
  if (form.value.id) {
    request.put("/book", form.value).then((res) => {
      if (res.code === "0") {
        ElMessage.success("修改书籍信息成功");
      } else {
        ElMessage.error(res.msg);
      }
      load();
      dialogVisible2.value = false;
    });
  } else {
    form.value = { ...form.value, borrownum: 0, status: 1 };
    request.post("/book", form.value).then((res) => {
      if (res.code === "0") {
        ElMessage.success("上架书籍成功");
      } else {
        ElMessage.error(res.msg);
      }
      load();
      dialogVisible.value = false;
    });
  }
};

// 编辑书籍信息
const handleEdit = (row) => {
  form.value = JSON.parse(JSON.stringify(row));
  dialogVisible2.value = true;
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

// 查看逾期详情
const toLook = () => {
  dialogVisible3.value = true;
};
</script>

<style scoped>
/* 样式部分保持不变 */
</style>
