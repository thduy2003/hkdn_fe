import { useState } from 'react'
import { Input } from 'antd'
import { FloatButtonProps } from '@/interface/component'

const FloatInput = (props: FloatButtonProps) => {
  const [focus, setFocus] = useState(false)
  const { label, value, placeholder, type, required, height } = props
  const isOccupied = focus || (value && value.length !== 0)
  const heightLabel = height / 2 - 7

  const originalLabelStyle = {
    top: `${heightLabel}px`,
    left: '12px',
    transition: 'all 0.2s ease-in-out'
  }

  const occupiedLabelStyle = {
    top: '4px',
    fontSize: '12px',
    padding: '0 4px',
    marginLeft: '-4px'
  }

  const labelStyle = isOccupied ? { ...originalLabelStyle, ...occupiedLabelStyle } : originalLabelStyle

  const requiredMark = required ? <span className='text-danger'>*</span> : null

  return (
    <div className='relative' onBlur={() => setFocus(false)} onFocus={() => setFocus(true)}>
      {type === 'password' ? (
        <Input.Password
          className='pt-5 pb-2'
          style={{ height: `${height}px` }}
          onChange={props.onChange}
          type={type}
          defaultValue={value}
        />
      ) : (
        <Input
          className='pt-5 pb-2'
          style={{ height: `${height}px` }}
          onChange={props.onChange}
          type={type}
          defaultValue={value}
        />
      )}
      <label
        className='absolute pointer-events-none transition-all duration-200 ease-in-out text-gray-500 z-20'
        style={labelStyle}
      >
        {isOccupied ? label : placeholder} {requiredMark}
      </label>
    </div>
  )
}

export default FloatInput
