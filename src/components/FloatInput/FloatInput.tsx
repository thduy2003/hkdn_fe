import { useState } from 'react'
import { Input, InputProps, InputRef } from 'antd'
import { FloatButtonProps } from '@/interface/component'
import './FloatInput.css'

const FloatInput = (props: FloatButtonProps) => {
  const [focus, setFocus] = useState(false)
  const { label, value, placeholder, type, required, height = 50 } = props
  const isOccupied = focus || (value && value.length !== 0)
  if(height < 50) {
    throw new Error('height must be greater than 50')
  }
  const requiredMark = required ? <span className='text-red-600'>*</span> : null

  const inputProps: InputProps & React.RefAttributes<InputRef> = {
    style: { paddingTop: `${height / 2}px`, paddingBottom: `${height / 10}px`, paddingLeft: '20px', fontSize: '18px', background: 'none' },
    onChange: props.onChange,
    type: type,
    defaultValue: value,
  }
  const renderInput = () => {
    switch (type) {
      case "password": return <Input.Password {...inputProps}/>
      default: return <Input {...inputProps}/>
    }
  }

  return (
    <div className='relative flex' style={{height: `${height}px`}} onBlur={() => setFocus(false)} onFocus={() => setFocus(true)}>
      {renderInput()}
      <label
        className={`absolute pointer-events-none transition-all duration-200 ease-in-out text-gray-500 z-20 left-5 ${isOccupied ? 'top-[15%] text-[13px]': 'top-1/2 -translate-y-1/2 text-[18px]'}`}
      >
        {isOccupied ? label : placeholder} {requiredMark}
      </label>
    </div>
  )
}

export default FloatInput
