import * as React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import Restaurant from './src/pages/Restaurant';
import PartyList from './src/pages/PartyList';
import Settings from './src/pages/Settings';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AppInner() {
  const isLogedIn = true;

  return isLogedIn ? (
    <Tab.Navigator>
      <Tab.Screen
        name="맛집"
        component={Restaurant}
        options={{title: '맛집'}}
      />
      <Tab.Screen
        name="참가파티"
        component={PartyList}
        options={{title: '참가파티'}}
      />
      <Tab.Screen
        name="내 정보"
        component={Settings}
        options={{title: '내 정보'}}
      />
    </Tab.Navigator>
  ) : (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{title: '로그인'}}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{title: '회원가입'}}
      />
    </Stack.Navigator>
  );
}

export default AppInner;
