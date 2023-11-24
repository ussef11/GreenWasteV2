import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Alert, Modal, Pressable } from "react-native";
import * as Device from "expo-device";
import { greencontext } from "../Helper/greencontext";
import Icon2 from "react-native-vector-icons/Octicons";

import Toast from "react-native-root-toast";



import { useForm } from "react-hook-form";

const Setting = ({navigation}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisiblepin, setModalVisiblepin] = useState(false);
    const [pin, setPin] = useState();
    const [visible , setVisible]  = useState(false)
    const [toast, settoastdata] = useState({
      message: "",
      background: "",
    });
    const [activetoast, setactivetoast] = useState(false);

    const [deviceid, setDeviceid] = useState();
    const {apiendpoint  , setapiendpoint}  = useContext(greencontext)
    const [apivalue , setapivalue ]= useState();

    useEffect(()=>{
      setapivalue(apiendpoint)

    },[])

    const  handleChangeEndpoint  = (endpoint) =>{
      setapivalue(endpoint)
    }

    const handleclick = () => {
       
        setModalVisible(true);
      };
    const hanldeinertpin = () => {
      
        setModalVisiblepin(true);
      };
    const handlecheck = () => {
        // alert(pin) 
        if(pin.toLowerCase() === "root-15963"){

          setVisible(true)
          settoastdata({ message :"mot de passe correct" , background : 'green'})
          showToast("mot de passe correct", 'green')
          setModalVisiblepin(false);

        }else{
          showToast("mot de passe Incorrec", 'red')
        }
        // setModalVisiblepin(true);
      };



      useEffect(() => {
        const getDeviceInformation = async () => {
          const deviceName = Device.deviceName;
    
          console.log("Device Name:", deviceName);
    
          setDeviceid(deviceName)
          let memory = await Device.getMaxMemoryAsync();
          // console.log("memory", memory);
        };
    
        getDeviceInformation();
      }, []);

      

      const handlenavigate  =  ()=>{
        setModalVisible(!modalVisible);
        setapiendpoint(apivalue)
        setVisible(false)
       
        // navigation.replace('Home')
      }


      function showToast(message, background) {
        settoastdata({ message, background });
        setactivetoast(true);
    
        // let toast =  Toast.show(message, ToastAndroid.SHORT , {
        //   duration: Toast.durations.LONG,
        // });
    
        setTimeout(function hideToast() {
          // Toast.hide(toast);
          setactivetoast(false);
        }, 2000);
      }
    
    
  return (
    <>
              
      <Toast
      
        backgroundColor={toast.background}
        hideOnPress={true}
        visible={activetoast}
        position={100}
      >
        {toast.message}
      </Toast>
    
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
        <View style={styles.centeredView}>
          <View style={styles.modalView}>

            <Text style={styles.modalText}>تأكيد  !</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={handlenavigate}
             
            >
              <Text style={styles.textStyle}>نعم</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>


    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisiblepin}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisiblepin(!modalVisiblepin);
        
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <View style={styles.topLeft}>
                <Icon2
                  onPress={() => setModalVisiblepin(!modalVisiblepin)}
                  name="x"
                  size={20}
                  color="#000"
                />
              </View>
            <Text style={styles.modalText}>Insérer le code pin !</Text>

            <TextInput  secureTextEntry={visible ? false : true}  style={{position:'relative' , bottom:15}}  value={pin} onChangeText={(text)=> setPin(text)}    placeholder="code Pin"  />
            <Pressable
              style={[styles.button, styles.buttonClose , {position:"relative" , top : 20}]}
              onPress={handlecheck}  
            >
              <Text  style={styles.textStyle}>vérifier</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>



    <View style={styles.app}>
      {/* <Text>dfddddddd</Text> */}
      <TextInput  editable={false} style={styles.input} value={deviceid} placeholder="Device ID" />
      {/* <TextInput style={styles.input} placeholder="Conducteur" /> */}
      <TouchableOpacity  onPress={hanldeinertpin}>
      <TextInput  onChangeText={handleChangeEndpoint}  value={apivalue}   secureTextEntry={visible ? false : true}   editable={visible} style={styles.input} placeholder="End point" />
      </TouchableOpacity>
      <View>

      <TouchableOpacity style={styles.dechetvert} onPress={handleclick}>
        <Text style={styles.buttonText}>حفظ</Text>
      </TouchableOpacity>

    
      </View>
    </View>
    </View>

         </>
  );
};

export default Setting;
const styles = StyleSheet.create({
  topLeft: {
    marginTop: 13,
    marginRight: 13,
    marginBottom: 1,
    marginLeft: 1,
    position: "absolute",
    top: 0,
    right: 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  dechetvert: {
    width: 250,
  
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
    fontSize: 20,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    height: 200,
    width: 300,
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
    backgroundColor: "#2196F3",
    width: 86,
    height: 40,
    justifyContent: "center",
    textAlign: 'center',
    alignItems:'center'
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15,
    // backgroundColor: "#4CAF50",
  },
  modalText: {
    top: -30,
    position: "relative",
    marginBottom: 15,
    textAlign: "center",
  },
  app: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    width: 250,
  },
  input: {
   
    borderRadius: 7,
    width:400,

    padding: 12,
    borderWidth: 1,
    margin: 5,
  },

});
