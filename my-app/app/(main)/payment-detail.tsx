import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';
import { PaymentAPIs } from '@/core/apis/paymentAPIs';

  

const PaymentDetail = () => {

  const { item } = useLocalSearchParams();
  const data: any = JSON.parse(item as string);
 
  
    const handlePayment = async () => {
      try{
      const res = await PaymentAPIs.checkPayment({ orderId: data.orderId});
      console.log(res.data.result)
      if(res.data.result === true) {
        Alert.alert("Thông báo", "Thanh toán thành công!");
       
      }

      }catch(err){

      }
    }
    return (
      <View style={{ flex: 1 }}>
      {/* <WebView
        source={{ uri: data.payUrl }}
        javaScriptEnabled={true} 
        domStorageEnabled={true}
        onNavigationStateChange={(url) => {
          handlePayment();
        }}
        onError={() => Alert.alert("Lỗi", "Không thể tải trang thanh toán.")}
        style={{ flex: 1 }}z
      /> */}
    </View>
  );
}

export default PaymentDetail