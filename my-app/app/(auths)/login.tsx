import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View, Image } from "react-native";
import { Divider, Text } from "react-native-paper";
import Background from "@/components/Background";
import Header from "@/components/Header";
import Logo from "@/components/Logo";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import { theme } from "@/components/theme";
import { validateRequired } from "@/helpers/validate";
import { useAppDispatch, useAppSelector } from "@/core/redux/hooks";
import { authActions } from "@/core/redux/authSlice";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [username, setUsername] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  const onLoginPressed = async () => {
    const passwordError = validateRequired(password.value, "Password");
    const usernameError = validateRequired(username.value, "Username");

    if (passwordError || usernameError) {
      setPassword({ ...password, error: passwordError || "" });
      setUsername({ ...username, error: usernameError || "" });
      return;
    }

    try {
      await dispatch(authActions.login(username.value, password.value));
      router.push("/(tabs)/");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const onLoginGGPressed = async () => {
    try {
      await dispatch(authActions.loginWithGG());
    } catch (error) {
      console.log("login with GG failed!");
    }
  };

  return (
    <Background>
      <Logo />
      <Header>Welcome back</Header>
      <TextInput
        label="Username or email"
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
      <View style={styles.forgotPassword}>
        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
      <View style={styles.container}>
        <Divider style={styles.divider} />
        <Text style={styles.text}>OR</Text>
        <Divider style={styles.divider} />
      </View>

      <Button
        mode="contained"
        onPress={onLoginGGPressed}
        style={styles.ggBtn}
        textColor="black"
        icon={() => (
          <Image
            source={require("../../assets/images/gg_logo.png")}
            style={{ width: 20, height: 20 }}
          />
        )}
      >
        Login with Google
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/(auths)/register")}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
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
