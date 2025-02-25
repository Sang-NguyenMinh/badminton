import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView, Image, Linking } from "react-native";
import {
  Card,
  Text,
  RadioButton,
  Button,
  useTheme,
  Divider,
} from "react-native-paper";
import { dateToString, formatCurrency } from "@/core/libs/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import moment from "moment";
import {
  ReservationAPIs,
  ReservationParams,
} from "@/core/apis/reservationAPIs";
import { PAYMENT_METHOD, PaymentAPIs } from "@/core/apis/paymentAPIs";
import { Params } from "./court-details";

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const theme = useTheme();

  const router = useRouter();
  const { item } = useLocalSearchParams();
  const data: Params = JSON.parse(item as string);

  const [payUrl, setPayUrl] = useState<string>("");

  const paymentPress = async () => {
    const date = dateToString(data.date);

    console.log(data.facilityId);

    const param: ReservationParams = {
      userId: "66ebb6e0660977caa2b9a861",
      facility: data.facilityId,
      paymentMethod: PAYMENT_METHOD.MOMO,
      totalAmount: data.totalPrice,
      courts: data.courts,
      reservationDate: date,
    };

    console.log(param);

    const resReservation = await ReservationAPIs.createReservation(param);

    const res = await PaymentAPIs.createMoMoPayment({
      orderId: resReservation._id,
      amount: data.totalPrice,
      orderInfo: "Thanh toan don hang TEST123456",
    });

    await Linking.openURL(res.payUrl);

    // router.push({
    //   pathname: '/(main)/payment-detail',
    //   params: { item: JSON.stringify({payUrl:res.payUrl,orderId:resReservation._id}) }
    // });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>{data.facilityName}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Địa chỉ</Text>
              <Text style={styles.value}>{data.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Ngày chơi</Text>
              <Text style={styles.value}>{dateToString(data.date)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Giờ chơi</Text>
              <Text style={styles.value}>
                {data.selectedTime.start} đến {data.selectedTime.end}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Thông tin sân</Text>
            {data.courts.map((court, index) => (
              <View key={index}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>{court.name}</Text>
                  <Text style={styles.value}>
                    {data.duration}h x {formatCurrency(court.pricePerHour)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.value,
                    { textAlign: "right", fontWeight: "700" },
                  ]}
                >
                  {formatCurrency(court.price)}
                </Text>
              </View>
            ))}
            <Divider style={{ marginVertical: 8 }} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tổng cộng</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(data.totalPrice)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.paymentMethodCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Phương thức thanh toán</Text>
            <RadioButton.Group
              onValueChange={(value) => setPaymentMethod(value)}
              value={paymentMethod}
            >
              <View style={styles.radioButton}>
                <RadioButton value="momo" />
                <Image
                  source={require("../../assets/images/momo.png")}
                  style={styles.paymentIcon}
                />
                <Text style={styles.radioLabel}>Ví MoMo</Text>
              </View>
              <View style={styles.radioButton}>
                <RadioButton value="cash" />
                <Image
                  source={require("../../assets/images/cash.png")}
                  style={styles.paymentIcon}
                />
                <Text style={styles.radioLabel}>Tiền mặt</Text>
              </View>
            </RadioButton.Group>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={paymentPress}
          style={{ marginTop: 16 }}
        >
          Thanh toán
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {},
  value: {
    fontWeight: "500",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  paymentMethodCard: {
    marginBottom: 16,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  radioLabel: {
    marginLeft: 8,
  },
  paymentIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
});
