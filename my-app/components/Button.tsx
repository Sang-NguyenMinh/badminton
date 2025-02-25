import React, { FC } from 'react'
import { StyleSheet } from 'react-native'
import { ButtonProps, Button as PaperButton } from 'react-native-paper'
import { theme } from './theme'

interface IPops extends ButtonProps{
  mode?:any,
  style?:any
}

const  Button:FC<IPops>=({ mode, style, ...props })=> {
  return (
    <PaperButton
      style={[
        styles.button,
        style,
      ]}
      mode={mode}
      {...props}
    />
  )
}
export default Button
const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginVertical: 10,
    paddingVertical: 2,
    borderRadius:14,
  },
})
