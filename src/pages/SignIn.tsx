import * as React from 'react';
import {useState, useCallback, useEffect, useRef} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useAppDispatch} from '../store/configureStore';
import DismissKeyboardView from './components/DismissKeyboardView';
import {RootStackParamList} from '../../AppInner';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import userSlice from '../slices/user';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

function SignIn({navigation}: SignInScreenProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const onChageEmail = useCallback((text: string) => {
    setEmail(text.trim());
  }, []);
  const onChagePassword = useCallback((text: string) => {
    setPassword(text.trim());
  }, []);

  const onSubmit = useCallback(async () => {
    if (loading) {
      return;
    }
    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    try {
      setLoading(true);
      const getSignUpRes = await axios.get(`${Config.API_URL}/user`);

      const findUser = getSignUpRes.data.find(user => user.email === email);
      console.log({findUser});
      if (findUser !== undefined) {
        if (findUser.password !== password) {
          throw new Error('비밀번호가 틀립니다.');
        }
        const postSignInRes = await axios.post(`${Config.API_URL}/signin`, {
          email,
          password,
        });
        console.log(postSignInRes.data);
        Alert.alert('알림', '로그인 되었습니다.');
        dispatch(
          userSlice.actions.setUser({
            name: postSignInRes.data.name,
            email: postSignInRes.data.email,
            isLoggedIn: true,
          }),
        );
      } else {
        throw new Error('회원가입이 필요합니다.');
      }
    } catch (error) {
      const errorResponse = error as AxiosError;
      Alert.alert('알림', errorResponse.message);
    } finally {
      setLoading(false);
    }

    // dispatch(logIn({email, password})).then(() => {
    //   setLoading(false);
    // });
  }, [dispatch, loading, email, password]);

  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  const canGoNext = email && password;
  return (
    <DismissKeyboardView>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={styles.textInput}
          placeholder="이메일을 입력해주세요"
          placeholderTextColor="#666"
          importantForAutofill="yes"
          textContentType="emailAddress"
          autoComplete="email"
          returnKeyType="next"
          clearButtonMode="while-editing"
          onChangeText={onChageEmail}
          value={email}
          ref={emailRef}
          onSubmitEditing={() => passwordRef.current?.focus()}
          blurOnSubmit={false}
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.textInput}
          placeholder="비밀번호를 입력해주세요 (영문, 숫자, 특수문자)"
          placeholderTextColor="#666"
          importantForAutofill="yes"
          textContentType="password"
          autoComplete="password"
          secureTextEntry
          returnKeyType="send"
          clearButtonMode="while-editing"
          onChangeText={onChagePassword}
          value={password}
          ref={passwordRef}
          onSubmitEditing={onSubmit}
        />
      </View>
      <View style={styles.buttonZone}>
        <Pressable
          style={
            canGoNext
              ? StyleSheet.compose(styles.loginButton, styles.loginButtonActive)
              : styles.loginButton
          }
          disabled={!canGoNext || loading}
          onPress={onSubmit}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginButtonText}>로그인</Text>
          )}
        </Pressable>
        <Pressable onPress={toSignUp}>
          <Text>회원가입</Text>
        </Pressable>
      </View>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    padding: 20,
  },
  textInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
  buttonZone: {
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  loginButtonActive: {
    backgroundColor: 'blue',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
export default SignIn;
