import React, { FC } from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { theme } from './theme'

const Header:FC<any>=(children)=> {
  return <Text style={styles.header} {...children} />
}

export default Header;
const styles = StyleSheet.create({
  header: {
    fontSize: 21,
    color: theme.colors.primary,
    fontWeight: 'bold',
    paddingVertical: 12,
  },
})
