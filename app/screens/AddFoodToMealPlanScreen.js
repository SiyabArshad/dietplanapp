import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Platform } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { MaterialCommunityIcons } from '@expo/vector-icons';

//components
import Screen from '../components/Screen';
import MyAppButton from '../components/common/MyAppButton';
import BottomTab from '../components/common/BottomTab';
import app from "../../firebase"
import {createUserWithEmailAndPassword,getAuth,deleteUser,updateProfile,sendEmailVerification} from "firebase/auth"
import {doc,setDoc,getFirestore, addDoc, serverTimestamp,getDocs,query,collection,where} from "firebase/firestore"
import LoadingModal from '../components/common/LoadingModal';
import { useIsFocused } from "@react-navigation/native";
//config
import Colors from '../config/Colors';
import DateTimePicker from "react-native-modal-datetime-picker";

function AddFoodToMealPlanScreen(props) {
    const exrname=props.route.params.fd
    const db=getFirestore(app)
    const auth=getAuth(app)
    const isFocused = useIsFocused(); 
    const[wps,setwps]=useState([])
    const [indicator, showIndicator] = useState(false);
    const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false)
    const [date, setDate] = useState(new Date())
    const[wop,setwop]=useState()
    const handleDatePicked = date => {  
        setDate(date)
        setIsDateTimePickerVisible(false)
    };

    const getwps=async()=>{
        showIndicator(true)
        const q = query(collection(db, "mealplan"), where("userid", "==",auth.currentUser.uid));
        getDocs(q).then((res)=>{
            const quests=res.docs.map(doc=>({
              data:doc.data(),
              id:doc.id
            }))
                setwps(quests)
              showIndicator(false)
          }).catch((e)=>{
              showIndicator(false)
          })
    }
    const mealplan=async()=>{
        showIndicator(true);
        if (wop === "") {
            alert("Please fill all the feilds");
            showIndicator(false);
            return true;
        }
        try
        {
    
            const sp=wps.filter((item)=>item.data.name===wop)
            const docRef = await addDoc(collection(db, "mealschedule"), {
                foodname: exrname.data.name,
                foodimg:exrname.data.img,
                workoutplan: sp[0].data.name,
                mealtime:sp[0].data.mealtime,
                userid:auth.currentUser.uid,
                water:sp[0].data.water,
                date:date.toDateString(),
                time:serverTimestamp(),
                receiven:false,
              });
             // console.log("Document written with ID: ", docRef.id);
             alert("added")
              showIndicator(false)
        }
        catch(e)
        {
            showIndicator(false)
            alert("tryagain")
        }
    
    }
    useEffect(()=>{
        if(isFocused)
        {
            getwps()
        }
        
    },[isFocused,props])
    const iconComponent = () => {
        return <MaterialCommunityIcons
            name={"chevron-down"}
            size={20}
            color={"grey"}
        />
    }

    return (
        <Screen style={{ flex: 1, justifyContent: 'flex-start', alignItems: "center", backgroundColor: Colors.newGrey }}>
    <LoadingModal show={indicator}></LoadingModal>
    <DateTimePicker
                // textColor={Colors.primary}
                isDarkModeEnabled={true}
                isVisible={isDateTimePickerVisible}
                onConfirm={(date) => handleDatePicked(date)}
                onCancel={() => setIsDateTimePickerVisible(false)}
                mode="date"
            />

            {/* Nav */}
            <ImageBackground style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: RFPercentage(31.6) }} source={require('../../assets/images/top.png')} >
                <TouchableOpacity onPress={() => props.navigation.navigate("WorkoutPlanScreen")} activeOpacity={0.8} style={{ position: 'absolute', left: RFPercentage(2.5), top: RFPercentage(6), width: RFPercentage(5), height: RFPercentage(5), borderRadius: RFPercentage(30), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' }} >
                    <Ionicons name="chevron-back" style={{ fontSize: RFPercentage(3) }} color={Colors.black} />
                </TouchableOpacity>
                <Text style={{ color: Colors.primary, fontSize: RFPercentage(3.3), fontFamily: 'Montserrat_700Bold' }} >
                    Add Food to
                </Text>
                <Text style={{ color: Colors.primary, fontSize: RFPercentage(3.3), fontFamily: 'Montserrat_700Bold' }} >
                    Meal plan
                </Text>
            </ImageBackground>
            <View style={{ width: '88%', justifyContent: 'center', alignItems: 'center', marginTop: RFPercentage(6) }} >
            <TouchableOpacity onPress={() => setIsDateTimePickerVisible(true)} style={{ position: 'absolute', right: 0 }} >
                        <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_600SemiBold' }} >
                            {date.toDateString()}
                        </Text>
                    </TouchableOpacity>

            </View>
            <View style={{ width: '88%', justifyContent: 'center', alignItems: 'center', marginTop: RFPercentage(6) }} >
                <RNPickerSelect
                    onValueChange={(value) => setwop(value)}
                    placeholder={{ label: 'Select Meal Plan' }}
                    Icon={Platform.OS == 'android' ? null : iconComponent}
                    items={
                        wps.map((item)=>(
                            {
                                label: item.data.name, value: item.data.name      
                            }
                        ))
                        }

                />
            </View>
            <View style={{ marginTop: Platform.OS == 'android' ? RFPercentage(-2) : RFPercentage(2), width: '88%', justifyContent: 'center', alignItems: 'center', borderBottomColor: Colors.darkGrey, borderWidth: RFPercentage(0.1) }} />

            {/* Button */}
            <View style={{ width: "100%", alignItems: "center", marginTop: RFPercentage(15) }}>
                <MyAppButton
                    title="Add"
                     onPress={() => mealplan()}
                    gradient={true}
                    bold={false}
                    borderColor={Colors.primary}
                    color={Colors.white}
                    fontFamily={"Montserrat_600SemiBold"}
                    fontSize={RFPercentage(2)}
                    borderRadius={RFPercentage(30)}
                    width={"65%"}
                />
            </View>

            <BottomTab props={props} />
        </Screen>
    );
}

export default AddFoodToMealPlanScreen;






