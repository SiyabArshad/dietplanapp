import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, ScrollView } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from "react-native-modal-datetime-picker";

//components
import Screen from './../components/Screen';
import BottomTab from '../components/common/BottomTab';
import InputField from './../components/common/InputField';
import MyAppButton from './../components/common/MyAppButton';
import LoadingModal from "../components/common/LoadingModal"
//config
import Colors from '../config/Colors';
import app from "../../firebase"
import {createUserWithEmailAndPassword,getAuth,deleteUser,updateProfile,sendEmailVerification} from "firebase/auth"
import {doc,setDoc,getFirestore, addDoc, serverTimestamp,getDocs,query,collection,where} from "firebase/firestore"

function AddWeightScreen(props) {

    const db=getFirestore(app)
    const auth=getAuth(app)
    const [indicator, showIndicator] = useState(false);

    const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false)
    const [date, setDate] = useState(new Date())

    const handleDatePicked = date => {
        setDate(date)
    };

    const [inputField, SetInputField] = useState([
        {
            placeholder: "52 Kg",
            title: 'Weight',
            value: "",
        },
    ]);

    const handleChange = (text, i) => {
        let tempfeilds = [...inputField];
        tempfeilds[i].value = text;
        SetInputField(tempfeilds);

    };

    const iconComponent = () => {
        return <MaterialCommunityIcons
            name={"chevron-down"}
            size={20}
            color={"grey"}
        />
    }
const addweig=async()=>{
    showIndicator(true);
    let tempfeilds = [...inputField];
    if (tempfeilds[0].value === "") {
        alert("Please fill all the feilds");
        showIndicator(false);
        return true;
    }
    try
    {

        const docRef = await addDoc(collection(db, "weights"), {
            bodyweight: tempfeilds[0].value,
            date: date,
            userid: auth.currentUser.uid,
            time:serverTimestamp()
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
                <TouchableOpacity activeOpacity={0.8} onPress={() => props.navigation.navigate('ProgressScreen')} style={{ position: 'absolute', left: RFPercentage(2.5), top: RFPercentage(6), width: RFPercentage(5), height: RFPercentage(5), borderRadius: RFPercentage(30), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' }} >
                    <Ionicons name="chevron-back" style={{ fontSize: RFPercentage(3.4) }} color={Colors.black} />
                </TouchableOpacity>
                <Text style={{ color: Colors.primary, fontSize: RFPercentage(3.9), fontFamily: 'Montserrat_700Bold' }} >
                    Add Weight
                </Text>
            </ImageBackground>

            {/* White Box */}
            <ScrollView style={{ flex: 1, width: '100%' }} >
                <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>

                    <View style={{ marginTop: RFPercentage(3), width: '86%', height: RFPercentage(50), backgroundColor: Colors.white, justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', borderRadius: RFPercentage(2.5) }} >

                        <View style={{ marginTop: RFPercentage(7), width: '100%', backgroundColor: Colors.grey, height: RFPercentage(0.1) }} />
                        {/* Input field */}
                        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            {inputField.map((item, i) => (
                                <View key={i} style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: i == 0 ? RFPercentage(2) : RFPercentage(1.8) }} >
                                    <View style={{ width: '32%' }} >
                                        <Text style={{ marginRight: RFPercentage(3), color: Colors.primary, fontSize: RFPercentage(2), fontFamily: 'Montserrat_500Medium' }} >
                                            {item.title}
                                        </Text>
                                    </View>
                                    <InputField
                                        placeholder={item.placeholder}
                                        placeholderColor={Colors.darkGrey}
                                        height={RFPercentage(6)}
                                        backgroundColor={Colors.newInputFieldBorder}
                                        borderWidth={RFPercentage(0.2)}
                                        borderColor={Colors.newInputFieldBorder}
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
                        </View>
                        <View style={{ marginTop: RFPercentage(4), width: '100%', backgroundColor: Colors.grey, height: RFPercentage(0.1) }} />

                        <View style={{ marginTop: RFPercentage(4.2), width: '90%', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', alignSelf: 'center' }} >
                            <Text style={{ marginRight: RFPercentage(4), color: Colors.primary, fontSize: RFPercentage(2), fontFamily: 'Montserrat_500Medium' }} >
                                Date
                            </Text>

                            <View style={{ position: 'absolute', right: 0, width: '60%', height: RFPercentage(6), backgroundColor: Colors.newInputFieldBorder, borderRadius: RFPercentage(20), justifyContent: 'center', alignItems: 'center' }} >
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '90%' }} >
                                    <Text style={{ color: Colors.darkGrey, fontSize: RFPercentage(1.8) }} >
                                        {date.toDateString()}
                                    </Text>
                                    <TouchableOpacity onPress={() => setIsDateTimePickerVisible(true)} style={{ position: 'absolute', right: 0 }} >
                                        <AntDesign name="caretdown" style={{ fontSize: RFPercentage(2) }} color={Colors.darkGrey} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Button */}
                        <View style={{ width: "100%", alignItems: "center", marginTop: RFPercentage(8) }}>
                            <MyAppButton
                                title="ADD"
                                onPress={() => addweig()}
                                gradient={true}
                                bold={false}
                                borderColor={Colors.primary}
                                color={Colors.white}
                                fontFamily={"Montserrat_600SemiBold"}
                                fontSize={RFPercentage(2)}
                                borderRadius={RFPercentage(30)}
                                width={"60%"}
                            />
                        </View>

                    </View>
                </View>
            </ScrollView>

            <BottomTab props={props} />
        </Screen>
    );
}

export default AddWeightScreen;