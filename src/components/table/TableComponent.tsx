import React, { useContext, useEffect, useRef, useState } from "react"
import type { InputRef } from "antd"
import { Button, Form, Input, Popconfirm, Space, Table } from "antd"
import type { FormInstance } from "antd/es/form"

import "../../scss/Table.scss"
import { RowSelectionType, TableRowSelection } from "antd/es/table/interface"
import { AnyObject } from "antd/es/_util/type"
import { useAppDispatch, useAppSelector } from "../../hooks/hooks"
import { RootState } from "../../redux/store"
import {
  addRoute,
  deleteRoute,
  saveRoute,
  selectData,
  setSelectedRowKeys,
} from "../../redux/dataSlice"
import { CoordinatesInput } from "./CoordinatesInput"
import { LatLngTuple } from "leaflet"

const EditableContext = React.createContext<FormInstance<any> | null>(null)

interface EditableRowProps {
  index: number
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: keyof DataType
  record: DataType
  handleSave: (record: DataType) => void
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<InputRef>(null)
  const form = useContext(EditableContext)!

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({ [dataIndex]: record[dataIndex] })
  }

  const save = async () => {
    try {
      const values = await form.validateFields()

      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log("Save failed:", errInfo)
    }
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} требуется заполнить.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

type EditableTableProps = Parameters<typeof Table>[0]

export interface DataType {
  key: React.Key
  route: string
  point1: LatLngTuple
  point2: LatLngTuple
  point3: LatLngTuple
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>

export const TableComponent: React.FC = () => {
  const { dataSource, selectedRowKeys } = useAppSelector(selectData)
  const dispatch = useAppDispatch()
  const [count, setCount] = useState(dataSource.length)

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    dispatch(setSelectedRowKeys(newSelectedRowKeys))
  }

  const rowSelection: TableRowSelection<AnyObject> = {
    selectedRowKeys,
    onChange: onSelectChange,
    type: "radio",
  }

  const handleDelete = (key: React.Key) => {
    dispatch(deleteRoute(key))
  }

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [
    {
      title: "Маршрут",
      dataIndex: "route",
      width: "10%",
      editable: true,
    },
    {
      title: "Точка 1 (lat, lng)",
      dataIndex: "point1",
      // editable: true,
      render: (value, record) => {
        return (
          <CoordinatesInput coords={value} record={record} point={"point1"} />
        )
      },
    },
    {
      title: "Точка 2 (lat, lng)",
      dataIndex: "point2",
      // editable: true,
      render: (value, record) => {
        return (
          <CoordinatesInput coords={value} record={record} point={"point2"} />
        )
      },
    },
    {
      title: "Точка 3 (lat, lng)",
      dataIndex: "point3",
      // editable: true,
      render: (value, record) => {
        return (
          <CoordinatesInput coords={value} record={record} point={"point3"} />
        )
      },
    },
    {
      title: "Действия",
      dataIndex: "operation",
      width: "10%",
      // @ts-ignore
      render: (_, record: { key: React.Key }) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Уверены что хотите удалить маршрут?"
            onConfirm={() => handleDelete(record.key)}
            okText={"Подтвердить"}
            cancelText={"Отменить"}
          >
            <a>Удалить</a>
          </Popconfirm>
        ) : null,
    },
  ]

  const handleAdd = () => {
    dispatch(addRoute(count))
    setCount(count + 1)
  }

  const handleSave = (row: DataType) => {
    dispatch(saveRoute(row))
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    }
  })

  return (
    <>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        pagination={false}
        rowSelection={rowSelection}
        dataSource={dataSource}
        columns={columns as ColumnTypes}
      />
      <Button className="table-btn" onClick={handleAdd} type="primary">
        Добавить маршрут
      </Button>
    </>
  )
}
