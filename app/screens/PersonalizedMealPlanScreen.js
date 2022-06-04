import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ImageBackground, FlatList, Switch, Image } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from "react-native-modal-datetime-picker";
import RNPickerSelect from 'react-native-picker-select';
import app from "../../firebase"
import {createUserWithEmailAndPassword,getAuth,deleteUser,updateProfile,sendEmailVerification} from "firebase/auth"
import {doc,setDoc,getFirestore, addDoc, serverTimestamp,getDocs,query,collection,where} from "firebase/firestore"
import LoadingModal from '../components/common/LoadingModal';

//components
import Screen from './../components/Screen';
import InputField from './../components/common/InputField';
import MyAppButton from './../components/common/MyAppButton';
import BottomTab from './../components/common/BottomTab';

//config
import Colors from '../config/Colors';

function PersonalizedMealPlanScreen(props) {

    const db=getFirestore(app)
    const auth=getAuth(app)
    const [wp, showwp] = useState(false);

    const [indicator, showIndicator] = useState(false);
    const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false)
    const [tme, settime] = useState(new Date().toLocaleTimeString())

    const handleDatePicked = date => {
        settime(date.toLocaleTimeString())
        setIsDateTimePickerVisible(false)
    };

    const [inputField, SetInputField] = useState([
        {
            placeholder: "Name",
            title: 'Meal Name',
            value: "",
        },
        {
            placeholder: "1.5 L",
            title: 'Water in Lt',
            value: "",
        },
    ]);

    const handleChange = (text, i) => {
        let tempfeilds = [...inputField];
        tempfeilds[i].value = text;
        SetInputField(tempfeilds);

    };

    const [inputField2, SetInputField2] = useState([
        {
            placeholder: "Meal Plan Name",
            value: "",
        },
    ]);

    const handleChange2 = (text, i) => {
        let tempfeilds = [...inputField2];
        tempfeilds[i].value = text;
        SetInputField2(tempfeilds);

    };

    const iconComponent = () => {
        return <MaterialCommunityIcons
            name={"chevron-down"}
            size={20}
            color={"grey"}
        />
    }

//starting logic for workout plan
const pmplan=async()=>{
    showIndicator(true);
    showwp(false)
    let tempfeilds = [...inputField];
    if (tempfeilds[0].value === "" || tempfeilds[1].value === "") {
        alert("Please fill all the feilds");
        showIndicator(false);
        return true;
    }
    try
    {

        const docRef = await addDoc(collection(db, "mealplan"), {
            name: tempfeilds[0].value,
            mealtime: tme,
            water: tempfeilds[1].value,
            userid:auth.currentUser.uid,
            time:serverTimestamp()
          });
         // console.log("Document written with ID: ", docRef.id);
          showIndicator(false)
          showwp(true)
    }
    catch(e)
    {
        showIndicator(false)
        alert("tryagain")
    }

}
//end wp logic


    return (
        <Screen style={{ flex: 1, justifyContent: 'flex-start', alignItems: "center", backgroundColor: Colors.newGrey }}>
            <LoadingModal show={indicator}></LoadingModal>
            {/* Nav */}
            <DateTimePicker
                // textColor={Colors.primary}
                isDarkModeEnabled={true}
                isVisible={isDateTimePickerVisible}
                onConfirm={(date) => handleDatePicked(date)}
                onCancel={() => setIsDateTimePickerVisible(false)}
                mode="time"
            />
            <ImageBackground style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: RFPercentage(31.6) }} source={require('../../assets/images/top.png')} >
                {/* <View style={{ marginTop: RFPercentage(8), width: '90%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }} > */}
                <TouchableOpacity onPress={() => props.navigation.navigate("MealPlanScreen")} activeOpacity={0.8} style={{ position: 'absolute', left: RFPercentage(2.5), top: RFPercentage(6), width: RFPercentage(5), height: RFPercentage(5), borderRadius: RFPercentage(30), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' }} >
                    <Ionicons name="chevron-back" style={{ fontSize: RFPercentage(3.4) }} color={Colors.black} />
                </TouchableOpacity>
                <Text style={{ color: Colors.primary, fontSize: RFPercentage(3.9), fontFamily: 'Montserrat_700Bold' }} >
                    Personalized
                </Text>
                <Text style={{ color: Colors.primary, fontSize: RFPercentage(3.9), fontFamily: 'Montserrat_700Bold' }} >
                    Meal Plan
                </Text>
                {/* </View> */}
            </ImageBackground>

            <ScrollView style={{ flex: 1, width: '100%' }} >
                <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    {/* Input field */}
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        {inputField.map((item, i) => (
                            <View key={i} style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: i == 0 ? RFPercentage(2) : RFPercentage(1.8) }} >
                                <Text style={{ marginRight: RFPercentage(4), color: Colors.primary, fontSize: RFPercentage(2), fontFamily: 'Montserrat_500Medium' }} >
                                    {item.title}
                                </Text>
                                <InputField
                                    placeholder={item.placeholder}
                                    placeholderColor={Colors.darkGrey}
                                    height={RFPercentage(6)}
                                    backgroundColor={Colors.white}
                                    borderWidth={RFPercentage(0.2)}
                                    borderColor={Colors.white}
                                    secure={item.secure}
                                    borderRadius={RFPercentage(20)}
                                    color={Colors.black}
                                    fontSize={RFPercentage(2)}
                                    handleFeild={(text) => handleChange(text, i)}
                                    value={item.value}
                                    width={"60%"}
                                />
                            </View>
                        ))}
                        <View style={{ width: '88%', justifyContent: "space-between",  flexDirection: 'row',alignItems: 'center', marginTop: RFPercentage(6) }} >
                        <Text style={{ color: Colors.primary, fontSize: RFPercentage(2), fontFamily: 'Montserrat_500Medium' }} >
                                    Meal Time
                                </Text>

            <TouchableOpacity onPress={() => setIsDateTimePickerVisible(true)} style={{ position: 'absolute', right: 0 }} >
                        <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_600SemiBold' }} >
                            {tme.toLocaleString()}
                        </Text>
                    </TouchableOpacity>
            </View>
                    </View>
                    

        
                    <View style={{ right: RFPercentage(-3), flexDirection: 'row', marginTop: RFPercentage(3), width: '100%', justifyContent: 'flex-end', alignItems: 'center', alignSelf: 'center' }} >
                        {/* Button */}
                        <MyAppButton
                            title="Add"
                            onPress={() => pmplan()}
                            gradient={true}
                            bold={false}
                            borderColor={Colors.primary}
                            color={Colors.white}
                            fontFamily={"Montserrat_600SemiBold"}
                            fontSize={RFPercentage(2.2)}
                            borderRadius={RFPercentage(30)}
                            width={"47%"}
                        />
                    </View>

                    {/* White Box */}
                    <View style={{ display:wp?"flex":"none",marginTop: RFPercentage(3), borderRadius: RFPercentage(2), width: '85%', height: RFPercentage(40), backgroundColor: Colors.white, justifyContent: 'flex-start', alignItems: 'center' }} >
                        <ScrollView style={{ flex: 1, width: '100%' }} >
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                {/*Meal Plan Name Input field */}
                                <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                    {inputField2.map((item, i) => (
                                        <View key={i} style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: i == 0 ? RFPercentage(2) : RFPercentage(1.8) }} >
                                            <InputField
                                                placeholder={item.placeholder}
                                                placeholderColor={Colors.darkGrey}
                                                height={RFPercentage(6)}
                                                backgroundColor={Colors.secondary}
                                                borderWidth={RFPercentage(0.2)}
                                                borderColor={Colors.secondary}
                                                secure={item.secure}
                                                borderRadius={RFPercentage(20)}
                                                color={Colors.black}
                                                fontSize={RFPercentage(2)}
                                                value={inputField[0].value}
                                                width={"50%"}
                                            />
                                        </View>
                                    ))}
                                </View>

                                <View style={{ marginTop: RFPercentage(2), width: '100%', height: RFPercentage(0.1), backgroundColor: Colors.grey }} />

                                {/* Plan 1 */}
                                <View style={{ width: '90%', marginTop: RFPercentage(5), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} >
                                    
                                    <View style={{ position: 'absolute', left: 0, justifyContent: 'center', alignItems: 'flex-start' }} >

                                        <Text style={{ marginTop: RFPercentage(2), color: Colors.primary, fontSize: RFPercentage(2.2), fontFamily: 'Montserrat_600SemiBold' }} >
                                            {inputField[0].value}
                                        </Text>
                                        <Text style={{ color: Colors.darkGrey, fontSize: RFPercentage(1.9), marginTop: RFPercentage(0.7) }} >
                                            {tme}
                                        </Text>
                                    </View>
                                </View>                                
                                <View style={{ marginTop: RFPercentage(5), width: '100%', height: RFPercentage(0.1), backgroundColor: Colors.grey }} />

                                <View style={{ alignSelf: 'center', marginTop: RFPercentage(2), width: '80%', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }} >
                                    <Text style={{ color: Colors.primary, fontSize: RFPercentage(2.6), fontFamily: 'Montserrat_600SemiBold' }} >
                                        Hydration
                                    </Text>

                                    <View style={{ flexDirection: 'row', position: 'absolute', right: 0 }} >
                                        <View style={{ width: RFPercentage(7), height: RFPercentage(3), borderRadius: RFPercentage(20), borderColor: Colors.primary, borderWidth: RFPercentage(0.3), justifyContent: 'center', alignItems: 'center' }} >
                                            <TextInput value={inputField[1].value}  placeholderTextColor={Colors.primary} />
                                        </View>
                                        <Text style={{ marginLeft: RFPercentage(1), color: Colors.primary, fontSize: RFPercentage(2.5), fontFamily: 'Montserrat_600SemiBold' }} >
                                            L
                                        </Text>
                                    </View>
                                </View>

                                
                                <View style={{ marginBottom: RFPercentage(3) }} />
                            </View>
                        </ScrollView>
                    </View>

                    <View style={{ marginBottom: RFPercentage(12) }} />
                </View>
            </ScrollView>

            <BottomTab props={props} />
        </Screen >
    );
}

export default PersonalizedMealPlanScreen;