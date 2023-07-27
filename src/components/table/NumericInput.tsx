import { Input, Tooltip } from "antd"

interface NumericInputProps {
  style: React.CSSProperties
  value: string
  onChange: (value: string) => void
  placeholder: string
  tooltipText?: string
  onBlur: (e: any) => void
  onKeyDown: (e: any) => void
}

const formatNumber = (value: number) => new Intl.NumberFormat().format(value)

export const NumericInput = (props: NumericInputProps) => {
  const {
    value,
    onChange,
    placeholder,
    onBlur,
    onKeyDown,
    tooltipText = "",
  } = props

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target
    const reg = /^-?\d*(\.\d*)?$/
    if (reg.test(inputValue) || inputValue === "" || inputValue === "-") {
      onChange(inputValue)
    }
  }

  const title = value ? "" : tooltipText

  return (
    <Tooltip
      trigger={["focus"]}
      title={title}
      placement="topLeft"
      overlayClassName="numeric-input"
    >
      <Input
        {...props}
        onChange={handleChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        maxLength={16}
      />
    </Tooltip>
  )
}
