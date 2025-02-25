import React, { FC } from 'react'
import { Image, StyleSheet } from 'react-native'

interface IProps{
  path?:any
}
const images = {
  default: require('../assets/images/login_logo.png'),
};
const Logo: FC<IProps> = ({ path }) => {
  const source = path
    ? path  // Nếu có URL hình ảnh, dùng uri
    : images.default;  // Nếu không có path, dùng hình ảnh mặc định

  return <Image source={source} style={styles.image} />;
};
export default Logo
const styles = StyleSheet.create({
  image: {
    width: 140,
    height: 140,
    marginBottom: 8,
  },
})
