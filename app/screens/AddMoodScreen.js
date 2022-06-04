import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image,ImageBackground, ScrollView } from 'react-native'
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
const moodvalue=["Angry","Unhappy","Excited","Happy","Sad","Enjoying","Blessed","Swaggy","Happy","Happy"]
function AddMoodScreen(props) {
    const [check, setCheck] = useState('0');

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
    try
    {

        const docRef = await addDoc(collection(db, "moods"), {
            moodvalue: check,
            mood:moodvalue[check],
            date: date.toDateString(),
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
        <Screen style={{ justifyContent: 'flex-start', alignItems: "center", backgroundColor: Colors.newGrey }}>
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
                    Add Mood
                </Text>
            </ImageBackground>

            {/* White Box */}
            <ScrollView style={{ width: '100%',flex:1 }} >
                <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <View style={{ marginTop: RFPercentage(3),marginBottom: RFPercentage(3) ,width: '86%',paddingBottom:RFPercentage(2) ,backgroundColor: Colors.white, justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', borderRadius: RFPercentage(2.5) }} >
                        <View style={{ marginTop: RFPercentage(7), width: '100%', backgroundColor: Colors.grey, height: RFPercentage(0.1) }} />
                        {/* Input field */}
                        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>

                            {/* Mood Box */}
                            <View style={{ marginTop: RFPercentage(3), justifyContent: 'flex-start', alignItems: 'center', width: '90%', backgroundColor: Colors.white, borderRadius: RFPercentage(3) }} >
                                {/* First Row */}
                                <View style={{ width: '90%', marginTop: RFPercentage(5), justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }} >
                                    <Text style={{ color: Colors.primary, fontSize: RFPercentage(2.6), fontFamily: 'Montserrat_600SemiBold' }} >
                                        Mood
                                    </Text>
                                    
                                </View>

                                <View style={{ marginTop: RFPercentage(2), width: '75%', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', flexDirection: 'row' }} >
                                    <View style={{ bottom: RFPercentage(0.1), justifyContent: 'center', alignItems: 'center' }} >
                                        <Image style={{ width: RFPercentage(4.8), height: RFPercentage(4.8) }} source={require('../../assets/images/m1.png')} />
                                        <TouchableOpacity onPress={() => setCheck('0')} activeOpacity={0.8} style={{ marginTop: RFPercentage(1), width: RFPercentage(3), height: RFPercentage(3), borderColor: Colors.darkGrey, borderWidth: RFPercentage(0.1), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: RFPercentage(20) }} >
                                            {check == '0' ?
                                                <TouchableOpacity activeOpacity={0.8} style={{ borderRadius: RFPercentage(6), width: RFPercentage(2), height: RFPercentage(2), backgroundColor: Colors.darkGrey }} />
                                                :
                                                null
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                                        <Image style={{ width: RFPercentage(4), height: RFPercentage(4) }} source={require('../../assets/images/m2.png')} />
                                        <TouchableOpacity onPress={() => setCheck('1')} activeOpacity={0.8} style={{ marginTop: RFPercentage(1), width: RFPercentage(3), height: RFPercentage(3), borderColor: Colors.darkGrey, borderWidth: RFPercentage(0.1), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: RFPercentage(20) }} >
                                            {check == '1' ?
                                                <TouchableOpacity activeOpacity={0.8} style={{ borderRadius: RFPercentage(6), width: RFPercentage(2), height: RFPercentage(2), backgroundColor: Colors.darkGrey }} />
                                                :
                                                null
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                                        <Image style={{ width: RFPercentage(4), height: RFPercentage(4) }} source={require('../../assets/images/m3.png')} />
                                        <TouchableOpacity onPress={() => setCheck('2')} activeOpacity={0.8} style={{ marginTop: RFPercentage(1), width: RFPercentage(3), height: RFPercentage(3), borderColor: Colors.darkGrey, borderWidth: RFPercentage(0.1), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: RFPercentage(20) }} >
                                            {check == '2' ?
                                                <TouchableOpacity activeOpacity={0.8} style={{ borderRadius: RFPercentage(6), width: RFPercentage(2), height: RFPercentage(2), backgroundColor: Colors.darkGrey }} />
                                                :
                                                null
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                                        <Image style={{ width: RFPercentage(4), height: RFPercentage(4) }} source={require('../../assets/images/m4.png')} />
                                        <TouchableOpacity onPress={() => setCheck('3')} activeOpacity={0.8} style={{ marginTop: RFPercentage(1), width: RFPercentage(3), height: RFPercentage(3), borderColor: Colors.darkGrey, borderWidth: RFPercentage(0.1), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: RFPercentage(20) }} >
                                            {check == '3' ?
                                                <TouchableOpacity activeOpacity={0.8} style={{ borderRadius: RFPercentage(6), width: RFPercentage(2), height: RFPercentage(2), backgroundColor: Colors.darkGrey }} />
                                                :
                                                null
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                                        <Image style={{ width: RFPercentage(4), height: RFPercentage(4) }} source={require('../../assets/images/m5.png')} />
                                        <TouchableOpacity onPress={() => setCheck('4')} activeOpacity={0.8} style={{ marginTop: RFPercentage(1), width: RFPercentage(3), height: RFPercentage(3), borderColor: Colors.darkGrey, borderWidth: RFPercentage(0.1), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: RFPercentage(20) }} >
                                            {check == '4' ?
                                                <TouchableOpacity activeOpacity={0.8} style={{ borderRadius: RFPercentage(6), width: RFPercentage(2), height: RFPercentage(2), backgroundColor: Colors.darkGrey }} />
                                                :
                                                null
                                            }
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Second row */}
                                <View style={{ marginTop: RFPercentage(2), width: '75%', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', flexDirection: 'row' }} >
                                    <View style={{ left: RFPercentage(1), justifyContent: 'center', alignItems: 'center' }} >
                                        <Image style={{ width: RFPercentage(4), height: RFPercentage(4) }} source={require('../../assets/images/m6.png')} />
                                        <TouchableOpacity onPress={() => setCheck('5')} activeOpacity={0.8} style={{ marginTop: RFPercentage(1), width: RFPercentage(3), height: RFPercentage(3), borderColor: Colors.darkGrey, borderWidth: RFPercentage(0.1), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: RFPercentage(20) }} >
                                            {check == '5' ?
                                                <TouchableOpacity activeOpacity={0.8} style={{ borderRadius: RFPercentage(6), width: RFPercentage(2), height: RFPercentage(2), backgroundColor: Colors.darkGrey }} />
                                                :
                                                null
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                                        <Image style={{ width: RFPercentage(4), height: RFPercentage(4) }} source={require('../../assets/images/m7.png')} />
                                        <TouchableOpacity onPress={() => setCheck('6')} activeOpacity={0.8} style={{ marginTop: RFPercentage(1), width: RFPercentage(3), height: RFPercentage(3), borderColor: Colors.darkGrey, borderWidth: RFPercentage(0.1), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: RFPercentage(20) }} >
                                            {check == '6' ?
                                                <TouchableOpacity activeOpacity={0.8} style={{ borderRadius: RFPercentage(6), width: RFPercentage(2), height: RFPercentage(2), backgroundColor: Colors.darkGrey }} />
                                                :
                                                null
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                                        <Image style={{ width: RFPercentage(4), height: RFPercentage(4) }} source={require('../../assets/images/m8.png')} />
                                        <TouchableOpacity onPress={() => setCheck('7')} activeOpacity={0.8} style={{ marginTop: RFPercentage(1), width: RFPercentage(3), height: RFPercentage(3), borderColor: Colors.darkGrey, borderWidth: RFPercentage(0.1), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: RFPercentage(20) }} >
                                            {check == '7' ?
                                                <TouchableOpacity activeOpacity={0.8} style={{ borderRadius: RFPercentage(6), width: RFPercentage(2), height: RFPercentage(2), backgroundColor: Colors.darkGrey }} />
                                                :
                                                null
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                                        <Image style={{ width: RFPercentage(4), height: RFPercentage(4) }} source={require('../../assets/images/m9.png')} />
                                        <TouchableOpacity onPress={() => setCheck('8')} activeOpacity={0.8} style={{ marginTop: RFPercentage(1), width: RFPercentage(3), height: RFPercentage(3), borderColor: Colors.darkGrey, borderWidth: RFPercentage(0.1), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: RFPercentage(20) }} >
                                            {check == '8' ?
                                                <TouchableOpacity activeOpacity={0.8} style={{ borderRadius: RFPercentage(6), width: RFPercentage(2), height: RFPercentage(2), backgroundColor: Colors.darkGrey }} />
                                                :
                                                null
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                                        <Image style={{ width: RFPercentage(4), height: RFPercentage(4) }} source={require('../../assets/images/m4.png')} />
                                        <TouchableOpacity onPress={() => setCheck('9')} activeOpacity={0.8} style={{ marginTop: RFPercentage(1), width: RFPercentage(3), height: RFPercentage(3), borderColor: Colors.darkGrey, borderWidth: RFPercentage(0.1), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: RFPercentage(20) }} >
                                            {check == '9' ?
                                                <TouchableOpacity activeOpacity={0.8} style={{ borderRadius: RFPercentage(6), width: RFPercentage(2), height: RFPercentage(2), backgroundColor: Colors.darkGrey }} />
                                                :
                                                null
                                            }
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>


                        </View>
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

export default AddMoodScreen;