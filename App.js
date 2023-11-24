import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Home from "./home/home.js";
import Setting from "./home/setting.js";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { greencontext } from "./Helper/greencontext.js";

export default function App() {
  const [firsttime, setfirsttime] = useState(true);
  const Stack = createNativeStackNavigator();
  const [apiendpoint , setapiendpoint] =  useState('http://larache.geodaki.com:5000')


  // const CheckFirsttime = async () => {
  //   try {
  //     const firstTime = await AsyncStorage.getItem("isFirstTime");
  //     if (firstTime !== null) {
  //       setfirsttime(false);
  //     } else {
  //       setfirsttime(true);
  //       // Uncomment the line below if you want to set "isFirstTime" in AsyncStorage
  //       // await AsyncStorage.setItem("isFirstTime", 'true');
  //     }
  //   } catch (error) {
  //     console.error("Error reading AsyncStorage:", error);
  //   }
  // };

  // useEffect(() => {
  //   CheckFirsttime();
  // }, []);

  return (
    <greencontext.Provider  value={{apiendpoint , setapiendpoint}}> 
    <NavigationContainer>
    <Stack.Navigator  initialRouteName={firsttime ? 'القائمة الرئيسية' : 'القائمة الرئيسية'}>
      <Stack.Screen name="القائمة الرئيسية" component={Home} />
      <Stack.Screen name="إعدادات" component={Setting} />
    </Stack.Navigator>
  </NavigationContainer>
  </greencontext.Provider>
  )
  
  // return <>{
  //   firsttime ? <Setting /> : <Home />
  //   }</>;
}
