import React, { FC } from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'

const Paragraph:FC<any>=(props) =>{
  return <Text style={styles.text} {...props} />
}

export default Paragraph;
const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 12,
  },
})
