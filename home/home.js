import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ToastAndroid,
  StatusBar,
  TextInput,
} from "react-native";
import { Alert, Modal, Pressable } from "react-native";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/Octicons";
import * as Device from "expo-device";
// import DeviceInfo from 'react-native-device-info';
import Tree from "../assets/Tree.png";
import phone from "../assets/phone.png";
import Toast from "react-native-root-toast";

import { greencontext } from "../Helper/greencontext";

export default function Home({ navigation }) {
  const [countDechet, setCountDechet] = useState(0);
  const [countInter, setcountInter] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleinter, setModalVisibleinter] = useState(false);
  const [handledechets, sethandledechets] = useState(false);
  const [handledinter, sethandledinter] = useState(false);
  const [activetoast, setactivetoast] = useState(false);
  const [toast, settoastdata] = useState({
    message: "",
    background: "",
  });
  const [id, setid] = useState();

  const {apiendpoint  , setapiendpoint}  = useContext(greencontext)

  const handlenavigate = () => {
    navigation.navigate("إعدادات");
  };

  // BTD-74765B2F7239

  useEffect(() => {
    const getDeviceInformation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      const deviceName = Device.deviceName;

      console.log("Device Name:", deviceName);

      setid(deviceName);
      let memory = await Device.getMaxMemoryAsync();
      // console.log("memory", memory);
    };

    getDeviceInformation();
  }, []);

  const handleFetch = async (apiUrl, device, lat, lng) => {
    var now = new Date();
    var pretty = [
      now.getFullYear(),
      "-",
      now.getMonth() + 1,
      "-",
      now.getDate(),
      " ",
      now.getHours(),
      ":",
      now.getMinutes(),
      ":",
      now.getSeconds(),
    ].join("");

    console.log("ddddddddd", pretty);
    let timestamp = new Date().toLocaleString().replace(",", "");
    timestamp = pretty;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Cookie",
      "frontend_lang=fr_FR; session_id=f822412f02d06570b627930141151ea195d05292"
    );

    const raw = JSON.stringify({
      deviceid: device,
      lat: lat,
      lng: lng,
      createddate: timestamp,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(apiUrl, requestOptions);
      const result = await response.json();
      console.log(result);
      let message = `تم إرسال الطلب بنجاح!: ${timestamp}`;

      showToast(message, "green");
    } catch (error) {
      console.error("Network request failed", error);
      let message = `الطلب فشل ! : ${error}`;
      showToast(message, "red");
    }

    console.log(device, lat, lng, timestamp);
  };

  function showToast(message, background) {
    settoastdata({ message, background });
    setactivetoast(true);

    // let toast =  Toast.show(message, ToastAndroid.SHORT , {
    //   duration: Toast.durations.LONG,
    // });

    setTimeout(function hideToast() {
      // Toast.hide(toast);
      setactivetoast(false);
    }, 7000);
  }

  useEffect(() => {
    let lat = null;
    let lng = null;

    const getLocation = async (apiUrl) => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Location permission denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude: lat, longitude: lng } = location.coords;

        console.log("Device Name:", id);
        console.log("Latitude:", lat);
        console.log("Longitude:", lng);

        await handleFetch(apiUrl, id, lat, lng);
      } catch (error) {
        console.error(error);
      }
    };

    if (handledechets == true) {
      // alert(apiendpoint)
      sethandledechets(false);
      setModalVisible(!modalVisible);
      console.log("Dechets Verts");
      getLocation(`${apiendpoint}/api/insertData`);
      setCountDechet(countDechet + 1);

      // getLocation("${apiendpoint}/api/insertData");
    }
    if (handledinter == true) {
      console.log("Intervention");
      getLocation(`${apiendpoint}/api/inertvention`);
      setcountInter(countInter + 1);
      sethandledinter(false);
      setModalVisibleinter(false);
    }
  }, [handledechets, countInter ,countDechet , handledinter]);

  const handleclick = () => {
    setModalVisible(true);
  };
  const handleclickinter = () => {
    setModalVisibleinter(true);
  };

  const [urll, setUrll] = useState("");

  const handleInputChange = (text) => {
    setUrll(text);
  };
  // intervention
  return (
    <>
      <View style={styles.settingView}>
        {/* <TextInput
          value={urll}
          onChangeText={handleInputChange}
          style={styles.input}
          placeholder="api"
        /> */}

        <Pressable style={styles.settingbutton} onPress={handlenavigate}>
          <Text>
            {" "}
            <Icon name="setting" size={30} color="green" />
          </Text>
        </Pressable>
      </View>
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.topLeft}>
                <Icon2
                  onPress={() => setModalVisible(!modalVisible)}
                  name="x"
                  size={30}
                  color="#000"
                />
              </View>
              <Text style={styles.modalText}>تأكيد!</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => sethandledechets(true)}
              >
                <Text style={styles.textStyle}>نعم</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleinter}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisibleinter(!modalVisibleinter);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.topLeft}>
                <Icon2
                  onPress={() => setModalVisibleinter(!modalVisibleinter)}
                  name="x"
                  size={30}
                  color="#000"
                />
              </View>
              <Text style={styles.modalText}>تأكيد !</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => sethandledinter(true)}
              >
                <Text style={styles.textStyle}>نعم</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <View style={styles.dechetvertView}>
          {/* <Text>لقد نقرت {count} مرات</Text> */}
          <TouchableOpacity style={styles.dechetvert} onPress={handleclick}>
            <View style={styles.content}>
              <View  style={{flexDirection : 'row'}}>   
              <Image
                source={Tree}
                style={styles.imageStyle}
                resizeMode="contain"
              />

              <Text style={styles.buttonText}>النفايات الخضراء</Text>
              </View>
              <View style={{alignItems : 'left' , position:'absolute' , top:0, right:0}}>
                <Text style={styles.textcountdechet}>{countDechet}</Text>
              </View>

            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.intervention}
            onPress={handleclickinter}
          >
            <View style={styles.content}>

              <View  style={{flexDirection : 'row'}} > 
              <Image
                source={phone}
                style={styles.phoneimg}
                resizeMode="contain"
              />
              <Text style={styles.buttonTextint}>تدخل</Text>
              </View>
              <View style={{alignItems : 'left' , position:'absolute' , top:0, right:0}}>
                <Text style={styles.textcount}> {countInter} </Text>
              </View>

            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Toast
        backgroundColor={toast.background}
        hideOnPress={true}
        visible={activetoast}
      >
        {toast.message}
      </Toast>
    </>
  );
}

const styles = StyleSheet.create({
  containerin: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: 200,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "black",
    // padding: 10,
    borderRadius: 5,
    position: "relative",
    top: 50,
  },

  content: {
    flexDirection: "row",
    // alignItems: 'right',
    paddingHorizontal: 0,
    paddingVertical: 0,
    width: "100%",
  },
  imageStyle: {
    width: 80,
    height: 80,
    margin: 0,
  },
  phoneimg: {
    width: 50,
    height: 50,
    marginLeft: 0,
    position: "relative",
    left: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // modalView: {
  //   height: "37%",
  //   width: 280,
  //   margin: 20,
  //   backgroundColor: 'white',
  //   borderRadius: 20,
  //   padding: 35,
  //   alignItems: 'center',
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 4,
  //   elevation: 5,
  // },
  topLeft: {
    marginTop: 13,
    marginRight: 13,
    marginBottom: 1,
    marginLeft: 1,
    position: "absolute",
    top: 0,
    right: 0,
  },

  dechetvertView: {
    textAlign: "center",
    width: 500,
    height: 500,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    top: -61,
    zIndex: 0,
  },

  settingView: {
    width: "100%",
    alignSelf: "flex-end",
    backgroundColor: "rgb(255, 255, 255)",
    padding: 5,
    paddingHorizontal: 12,
    zIndex: 900,
  },
  settingbutton: {
    alignSelf: "flex-end",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  dechetvert: {
    width: 450,
    height: 100,
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 40,
    position: "relative",
    left: 20,
    top: 10,
  },
  buttonTextint: {
    color: "white",
    fontSize: 40,
    position: "relative",
    left: 120,
  },
  textcount: {
    color: "white",
    fontSize: 40,
    position: "relative",
    bottom: 5,
    marginRight: 1
  },
  textcountdechet: {
    color: "white",
    fontSize: 40,
    position: "relative",
    bottom: -5,
    marginRight: 10
  },

  intervention: {
    width: 450,
    height: 100,
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },

  // centeredView: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginTop: 22,
  // },
  modalView: {
    height: 300,
    width: 380,
    justifyContent: "center",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    padding: 0,
    backgroundColor: "#2196F3",
    width: 100,
    height: 50,
    justifyContent: "center",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  modalText: {
    top: -50,
    position: "relative",
    marginBottom: 15,
    textAlign: "center",
    fontSize: 30,
  },
});
