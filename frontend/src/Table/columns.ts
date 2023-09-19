import { createColumnHelper } from '@tanstack/react-table'
import { TableCell } from './TableCell.tsx'
import { Record } from './data.ts'
import { EditCell } from './EditCell.tsx'

const columnHelper = createColumnHelper<Record>()

export const columns = [
  columnHelper.accessor('date', {
    header: '日期',
    cell: TableCell,
    meta: {
      type: 'date',
    },
  }),
  columnHelper.accessor('number', {
    header: '金额',
    cell: TableCell,
    meta: {
      type: 'number',
    },
  }),
  columnHelper.accessor('account', {
    header: '账户',
    cell: TableCell,
    meta: {
      type: 'string',
    },
  }),
  columnHelper.accessor('person', {
    header: '主开销人',
    cell: TableCell,
    meta: {
      type: 'string',
    },
  }),
  columnHelper.accessor('cate1', {
    header: '大类',
    cell: TableCell,
    meta: {
      type: 'string',
    },
  }),
  columnHelper.accessor('cate2', {
    header: '子类',
    cell: TableCell,
    meta: {
      type: 'string',
    },
  }),
  columnHelper.accessor('detail', {
    header: '明细',
    cell: TableCell,
    meta: {
      type: 'string',
    },
  }),
  columnHelper.display({
    id: 'edit',
    cell: EditCell,
  }),
]
