<script setup lang="ts">
// 定义下拉的数据类型
interface SelectItem {
  value: string | number
  label: string
  check: boolean
}
// 接收父组件传递过来的数据
const props = defineProps({
  options: {
    type: Array<SelectItem>,
    required: true,
  },
  width: {
    type: String,
    default() {
      return "220px";
    },
  },
});
// 注册事件
const emit = defineEmits(["selected"]);
// 选择器的宽度
const selectWidth = `width:${props.width}`;
// 下拉的数据
const selectOptions = ref<Array<string | number>>([]);
// 下拉的点击事件
function isChecked(item: SelectItem) {
  if (item.check && !selectOptions.value.includes(item.value)) {
    selectOptions.value.push(item.value);
  }
  else if (!item.check) {
    selectOptions.value.forEach((elm, idx) => {
      if (elm === item.value) {
        selectOptions.value.splice(idx, 1);
      }
    });
  }
  emit("selected", selectOptions.value);
};
// 删除
function removeTag(value: any) {
  props.options.forEach((elm) => {
    if (elm.value === value) {
      elm.check = false;
    }
  });
  emit("selected", selectOptions.value);
}

function selectAll(isAll: boolean) {
  if (isAll) {
    selectOptions.value = [];
    props.options.forEach((item: SelectItem) => {
      item.check = true;
      selectOptions.value.push(item.value);
    });
  }
  else {
    const arr: Array<string | number> = [];
    props.options.forEach((item) => {
      item.check = false;
      if (!selectOptions.value.includes(item.value)) {
        arr.push(item.value);
      }
    });
    selectOptions.value = arr;
  }
  emit("selected", selectOptions.value);
}
</script>

<template>
  <!-- 下拉加多选框 -->
  <el-select v-model="selectOptions" multiple placeholder="请选择" :popper-append-to-body="false" :style="selectWidth"
    @remove-tag="removeTag">
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      <el-checkbox v-model="item.check" @change="isChecked(item)">
        {{ item.label }}
      </el-checkbox>
    </el-option>
    <div class="is-all">
      <div @click="selectAll(true)">
        全选
      </div>
      <div @click="selectAll(false)">
        反选
      </div>
    </div>
  </el-select>
</template>

<style lang="scss">
.is-all {
  display: flex;
  padding-left: 10px;

  div {
    margin: 6px 10px;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      opacity: 0.7;
    }
  }
}
</style>
