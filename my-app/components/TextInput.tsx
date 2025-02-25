import React, { FC } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { TextInput as Input, TextInputProps } from 'react-native-paper'
import { theme } from './theme'


interface IPops extends TextInputProps {
  errorText?: string;
  description?: string;
}

const  TextInput: FC<any>=({ errorText, description,...chirlden})=> {
  return (
    <View style={styles.container}>
      <Input
      {...chirlden}
        style={styles.input}
        selectionColor={theme.colors.primary}
        underlineColor="transparent"
        mode="outlined"
      />
      {description && !errorText ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  )
}
export default TextInput;
const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  description: {
    fontSize: 13,
    color: theme.colors.secondary,
    paddingTop: 8,
  },
  error: {
    fontSize: 13,
    color: theme.colors.error,
    paddingTop: 8,
  },
})
