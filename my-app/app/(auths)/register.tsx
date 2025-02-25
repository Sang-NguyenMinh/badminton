import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View, Alert, Image } from "react-native";
import { Divider, Text } from "react-native-paper";
import Background from "@/components/Background";
import Header from "@/components/Header";
import Logo from "@/components/Logo";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import { theme } from "@/components/theme";
import {
  validateEmail,
  validatePassword,
  validateRequired,
} from "@/helpers/validate";
import { useAppDispatch } from "@/core/redux/hooks";
import { authActions } from "@/core/redux/authSlice";

export default function RegisterScreen({ navigation }: any) {
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });

  const [registrationError, setRegistrationError] = useState("");

  const onLoginPressed = async () => {
    const passwordError = validatePassword(password.value);
    const usernameError = validateRequired(username.value, "Username");
    const emailError = validateEmail(email.value);

    if (passwordError || usernameError) {
      setPassword({ ...password, error: passwordError || "" });
      setUsername({ ...username, error: usernameError || "" });
      setEmail({ ...email, error: emailError || "" });
      return;
    }

    try {
      await dispatch(
        authActions.register({
          username: username.value,
          password: password.value,
          email: email.value,
        })
      );

      navigation.navigate("OPTScreen");
    } catch (error) {
      setRegistrationError("Username or email already exists");
    }
  };

  return (
    <Background>
      <Logo />
      <Header>Create your account</Header>
      <TextInput
        label="Username"
        returnKeyType="next"
        value={username.value}
        onChangeText={(text: any) => setUsername({ value: text, error: "" })}
        error={!!username?.error}
        errorText={username?.error}
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        value={password.value}
        onChangeText={(text: any) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text: any) => setEmail({ value: text, error: "" })}
        error={!!email?.error}
        errorText={email?.error}
        autoCapitalize="none"
      />
      {registrationError ? (
        <Text style={styles.errorText}>{registrationError}</Text>
      ) : null}
      <Button mode="contained" onPress={onLoginPressed}>
        Register
      </Button>
      <View style={styles.container}>
        <Divider style={styles.divider} />
        <Text style={styles.text}>OR</Text>
        <Divider style={styles.divider} />
      </View>

      <Button
        mode="contained"
        onPress={onLoginPressed}
        style={styles.ggBtn}
        textColor="black"
        icon={() => (
          <Image
            source={require("../../assets/images/gg_logo.png")}
            style={{ width: 20, height: 20 }}
          />
        )}
      >
        Sign up with Google
      </Button>
      <View style={styles.row}>
        <Text>Do you already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
          <Text style={styles.link}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
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
