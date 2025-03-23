<script setup lang="ts">
interface DialogProps {
  title: string
  visible: boolean
  width: number
  height: number
}
// 接收父组件传值
const props = withDefaults(defineProps<DialogProps>(), {
  title: "标题",
  visible: false,
  width: 600,
  height: 300,
});
const emit = defineEmits(["onClose", "onConfirm"]);
// 定义关闭的方法
function onClose() {
  emit("onClose");
}

// 定义确定的方法
function onConfirm() {
  emit("onConfirm");
}
</script>

<template>
  <!-- 弹框 -->
  <el-dialog :model-value="props.visible" :title="props.title" :width="`${props.width}px`" :before-close="onClose"
    append-to-body :close-on-click-modal="false">
    <div class="container" :style="{ height: `${props.height}px` }">
      <slot name="content" />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="danger" @click="onClose">
          取消
        </el-button>
        <el-button type="primary" @click="onConfirm">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss">
.container {
  overflow-x: initial;
  overflow-y: auto;
}

.el-dialog {
  padding: 0;
  border-top-left-radius: 7px !important;
  border-top-right-radius: 7px !important;

  .el-dialog__header {
    padding: 20px 20px 10px !important;
    margin-right: 0;
    background-color: #009688 !important;
    border-top-left-radius: 7px !important;
    border-top-right-radius: 7px !important;

    .el-dialog__title {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
    }
  }

  .el-dialog__headerbtn {
    top: 8px;

    .el-dialog__close {
      color: #fff;
    }
  }

  .el-dialog__body {
    padding: 10px;
  }

  .el-dialog__footer {
    padding: 10px;
    border-top: 1px solid #cfdad9 !important;
  }
}
</style>
