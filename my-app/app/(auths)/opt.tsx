import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import Background from "@/components/Background";
import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import Logo from "@/components/Logo";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import { theme } from "@/components/theme";
import { useAppDispatch } from "@/core/redux/hooks";
import { authActions } from "@/core/redux/authSlice";
import { Text } from "react-native-paper";

export default function OTPScreen({ navigation }: { navigation: any }) {
  const dispatch = useAppDispatch();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const onSubmitPressed = async () => {
    try {
      await dispatch(authActions.checkCode(code));
      navigation.navigate("ForgotPasswordScreen");
    } catch (error) {
      setError("Xác thực thất bại, xin vui lòng thử lại!");
    }
  };

  const onResendPressed = async () => {
    try {
      await dispatch(authActions.reSendCode());
    } catch (error) {
      setError("Gửi lại thất bại, xin vui lòng thử lại!");
    }
  };

  const icon = {
    path: require("../../assets/images/otp_icon.png"),
  };

  return (
    <Background>
      <BackButton goBack={() => {}} />
      <Logo path={icon.path} />

      <Header>Enter verification code</Header>
      <View style={styles.row}>
        <Text>
          The verification code has been sent to your email. Please check and
          enter below
        </Text>
      </View>
      <TextInput
        label="Code"
        value={code}
        onChangeText={(text: any) => setCode(text)}
        error={error}
        errorText={error}
        autoCapitalize="none"
      />
      <View style={styles.row}>
        <Text>Don't receive the OTP? </Text>
        <TouchableOpacity onPress={onResendPressed}>
          <Text style={styles.link}>Resend OPT</Text>
        </TouchableOpacity>
      </View>

      <Button mode="contained" onPress={onSubmitPressed}>
        Submit
      </Button>
    </Background>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginVertical: 10,
  },
  input: {
    width: "80%",
    height: 50,
    textAlign: "center",
    fontSize: 24,
    marginBottom: 32,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#333",
  },
  text: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  ggBtn: {
    backgroundColor: "#cacfce",
  },
});
