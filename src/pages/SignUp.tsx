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
  Platform,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useAppDispatch} from '../store/configureStore';
import DismissKeyboardView from './components/DismissKeyboardView';
import {RootStackParamList} from '../../AppInner';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

function SignUp({navigation}: SignUpScreenProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const emailRef = useRef<TextInput | null>(null);
  const nameRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const emailRegx =
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
  const passwordRegx = /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,50}$/;

  const onChageEmail = useCallback((text: string) => {
    setEmail(text.trim());
  }, []);
  const onChageName = useCallback((text: string) => {
    setName(text.trim());
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
    if (!name || !name.trim()) {
      return Alert.alert('알림', '이름을 입력해주세요.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    if (!emailRegx.test(email)) {
      return Alert.alert('알림', '올바른 이메일 주소가 아닙니다.');
    }
    if (!passwordRegx.test(password)) {
      return Alert.alert(
        '알림',
        '비밀번호는 영문,숫자,특수문자($@^!%*#?&)를 모두 포함하여 8자 이상 입력해야합니다.',
      );
    }

    try {
      setLoading(true);
      const getSignUpRes = await axios.get(`${Config.API_URL}/user`);

      const isSignedUp = getSignUpRes.data.find(user => user.email === email);

      if (isSignedUp) {
        throw new Error('이미 가입된 계정입니다.');
      } else {
        const postSignUpRes = await axios.post(`${Config.API_URL}/user`, {
          email,
          name,
          password,
        });
        console.log(postSignUpRes.data);
        Alert.alert('알림', '회원가입 되었습니다.');
        navigation.navigate('SignIn');
      }
    } catch (error) {
      const errorResponse = error as AxiosError;
      if (errorResponse.message !== '이미 가입된 계정입니다.') {
        Alert.alert('알림', '회원가입에 실패하였습니다.');
      } else {
        Alert.alert('알림', errorResponse.message);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, navigation, email, name, password, emailRegx, passwordRegx]);

  const canGoNext = email && name && password;

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
          onSubmitEditing={() => nameRef.current?.focus()}
          blurOnSubmit={false}
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이름</Text>
        <TextInput
          style={styles.textInput}
          placeholder="이름을 입력해주세요."
          placeholderTextColor="#666"
          textContentType="name"
          returnKeyType="next"
          clearButtonMode="while-editing"
          onChangeText={onChageName}
          value={name}
          ref={nameRef}
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
          keyboardType={Platform.OS === 'android' ? 'default' : 'ascii-capable'}
          ref={passwordRef}
          onSubmitEditing={onSubmit}
        />
      </View>
      <View style={styles.buttonZone}>
        <Pressable
          style={
            canGoNext
              ? StyleSheet.compose(
                  styles.signUpButton,
                  styles.signUpButtonActive,
                )
              : styles.signUpButton
          }
          disabled={!canGoNext || loading}
          onPress={onSubmit}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.signUpButtonText}>회원가입</Text>
          )}
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
  signUpButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  signUpButtonActive: {
    backgroundColor: 'blue',
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
export default SignUp;
