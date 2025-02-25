import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Background from "@/components/Background";
import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import Logo from "@/components/Logo";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import { theme } from "@/components/theme";
import { useAppSelector } from "@/core/redux/hooks";

export default function ForgotPasswordScreen({
  navigation,
}: {
  navigation: any;
}) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  const onLoginPressed = () => {};

  const { auth } = useAppSelector((state) => state.reducer);

  useEffect(() => {
    console.log(auth.role);
  }, []);

  const icon = {
    path: require("../../assets/images/forgot_password_icon.png"),
  };

  return (
    <Background>
      <BackButton goBack={() => {}} />
      <Logo path={icon.path} />

      <Header>Forgot password?</Header>
      <View style={styles.row}>
        <Text>
          Don't worry, it happen. Please enter your email associated with your
          accout.{" "}
        </Text>
      </View>
      <TextInput
        label="Enter your email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text: any) => setEmail({ value: text, error: "" })}
        error={!!email?.error}
        errorText={email?.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <Button mode="contained" onPress={onLoginPressed}>
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
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
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
