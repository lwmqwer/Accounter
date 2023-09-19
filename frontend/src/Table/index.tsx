import React, {useState} from "react";
import {useDispatch, useSelector } from 'react-redux'
import {flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {columns} from "./columns.ts";
import {Record} from "./data";
import "./table.css";

import  {deleteRecord} from '../store/recordsSlice'

export const Table = () => {
  const selector = useSelector(state => state.quickSerch.value)
  const records: Record[] = useSelector(selector)
  const dispatch = useDispatch()
  //const [data, setData] = useState<Record[]>(records);
  //const [originalData, setOriginalData] = useState<Record[]>(records);
  const [editedRows, setEditedRows] = useState({});

  const table = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    meta: {
      editedRows,
      setEditedRows,
      /*revertData: (rowIndex: number, revert: boolean) => {
        if (revert) {
          setData((old) =>
            old.map((row, index) =>
              index === rowIndex ? originalData[rowIndex] : row
            )
          );
        } else {
          setOriginalData((old) =>
            old.map((row, index) => (index === rowIndex ? data[rowIndex] : row))
          );
        }
      },
      updateData: (rowIndex: number, columnId: string, value: string) => {
        if (columnId == 'date') {
          value = value + 'T00:00:00Z';
        }
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },*/
      removeRow: (rowIndex: number) => {
        dispatch(deleteRecord(records[rowIndex]))
      },
    },
  });

  return (
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
  );
};
