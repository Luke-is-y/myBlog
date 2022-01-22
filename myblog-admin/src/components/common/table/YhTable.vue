<template>
  <div>
    <div class="header">
      <slot name="header"> 表格数据 </slot>
    </div>
    <div class="header-bottom">
      <div>
        <slot name="add" v-if="isShowAddBtn">
          <el-button type="primary" size="small" @click="addBtn" icon="plus">新增</el-button>
        </slot>
        <slot name="delete" v-if="isShowDeleteBtn">
          <el-button
            type="danger"
            size="small"
            @click="delBtn"
            icon="delete"
            :disabled="select.length === 0"
            >批量删除</el-button
          >
        </slot>
      </div>
      <slot name="search" v-if="isShowSearchBtn">
        <div style="margin-left: auto">
          <el-input
            v-model="keywords"
            prefix-icon="search"
            size="small"
            :placeholder="searchBtnPlaceholder"
            style="width: 200px"
          />
          <el-button type="primary" size="small" style="margin-left: 1rem" @click="searchBtn">
            搜索
          </el-button>
        </div>
      </slot>
    </div>
    <el-table
      style="width: 100%"
      :data="Data"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <template v-if="isShowSelection">
        <el-table-column type="selection" width="55" />
      </template>
      <template v-if="isShowIndex">
        <el-table-column type="index" width="55" />
      </template>
      <template v-for="propItem in propList" :key="propItem.label">
        <el-table-column v-bind="propItem" :align="propItem.align ? propItem.align : 'center'">
          <template #default="scope">
            <slot :name="propItem.prop" :row="scope.row">
              {{ scope.row[propItem.prop] }}
            </slot>
          </template>
        </el-table-column>
      </template>

      <el-table-column label="操作" min-width="150" align="center">
        <template #default="scope">
          <slot name="edit" :row="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer" v-if="pageCount !== 0">
      <slot class="page">
        <el-pagination
          :currentPage="page.currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="page.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { ITableColumn } from '@/components/common/table/types'
export default defineComponent({
  props: {
    Data: {
      type: Array,
      required: true
    },
    propList: {
      type: Array as PropType<ITableColumn[]>,
      required: true
    },
    isShowSelection: {
      type: Boolean,
      default: false
    },
    isShowIndex: {
      type: Boolean,
      default: false
    },
    isShowAddBtn: {
      type: Boolean,
      default: false
    },
    isShowDeleteBtn: {
      type: Boolean,
      default: false
    },
    isShowSearchBtn: {
      type: Boolean,
      default: false
    },
    searchBtnPlaceholder: {
      type: String,
      default: ''
    },
    page: {
      type: Object,
      default: () => ({ currentPage: 2, size: 10 })
    },
    pageCount: {
      type: Number,
      default: 0
    }
  },
  emits: ['update:page', 'add-btn', 'selection', 'del-btn', 'search-btn'],
  setup(props, { emit }) {
    const keywords = ref('')
    const handleSizeChange = (size: number) => {
      emit('update:page', { ...props.page, size })
    }

    const handleCurrentChange = (currentPage: number) => {
      emit('update:page', { ...props.page, currentPage })
    }

    const addBtn = () => {
      emit('add-btn')
    }

    const delBtn = () => {
      emit('del-btn')
    }

    const select = ref<any[]>([])

    const handleSelectionChange = (selection: any[]) => {
      // selection 为当前所选中的数据,数组类型
      select.value = selection

      emit('selection', selection)
    }

    const searchBtn = () => {
      emit('search-btn', keywords.value)
    }

    return {
      keywords,
      handleSizeChange,
      handleCurrentChange,
      select,
      handleSelectionChange,
      addBtn,
      delBtn,
      searchBtn
    }
  }
})
</script>

<style lang="less" scoped>
.header {
  margin-left: -20px;
}
.footer {
  margin-top: 20px;
  text-align: right;
}

.header-bottom {
  display: flex;
  justify-content: space-between;
  margin: 20px 0 10px 0;
}
</style>
