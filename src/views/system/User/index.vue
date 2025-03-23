<template>
  <div>
    User
    <el-button type="primary" size="default" @click="onShow()"></el-button>
    <SysDialog :height="dialog.height" :title="dialog.title" :width="dialog.width" :visible="dialog.visible"
      @on-close="onClose" @on-confirm="onConfirm()">
      <template #content>
        测试
      </template>
    </SysDialog>
  </div>
</template>

<script setup lang="ts">
import SysDialog from "@/components/SysDialog/SysDialog.vue";
import useDialog from "@/hooks/useDialog";

// 弹窗属性
const { dialog, onClose, onShow, onConfirm } = useDialog();
</script>

<style scoped></style>
