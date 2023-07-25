import React, { useState } from "react"
import { NumericInput } from "./NumericInput"
import { DataType } from "./TableComponent"
import { AnyObject } from "antd/es/_util/type"
import { useAppDispatch } from "../../hooks/hooks"
import { updateCoords } from "../../redux/dataSlice"

type InputProps = {
  coords: number[]
  record: AnyObject
  point: "point1" | "point2" | "point3"
}

export const CoordinatesInput: React.FC<InputProps> = ({
  coords,
  record,
  point,
}) => {
  const [value1, setValue1] = useState(String(coords[0]))
  const [value2, setValue2] = useState(String(coords[1]))
  const dispatch = useAppDispatch()

  const setInput = (
    number: string,
    setState: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    setState(number)
    dispatch(
      updateCoords({
        key: record.key,
        point: point,
        coords: [Number(value1), Number(value2)],
      }),
    )
  }

  return (
    <>
      <NumericInput
        style={{ width: 120 }}
        value={String(value1)}
        onChange={(number) => setInput(number, setValue1)}
        placeholder="Введите долготу"
      />
      <NumericInput
        style={{ width: 120 }}
        value={String(value2)}
        onChange={setValue2}
        placeholder="Введите широту"
      />
    </>
  )
}
