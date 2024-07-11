export type FloatButtonProps = {
  label?: string
  value?: string
  placeholder?: string
  type?:  React.HTMLInputTypeAttribute
  required?: boolean
  onChange?: () => void
  height?: number
}
