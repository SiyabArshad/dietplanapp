import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';

//components
import Screen from './../components/Screen';
import LineInputField from './../components/common/LineInputField';
import LoadingModal from './../components/common/LoadingModal';
import MyAppButton from './../components/common/MyAppButton';

//config
import Colors from '../config/Colors';
import app from "../../firebase"
import {createUserWithEmailAndPassword,signInWithEmailAndPassword,getAuth,deleteUser,updateProfile,sendEmailVerification,sendPasswordResetEmail} from "firebase/auth"
function ForgetPasswordScreen(props) {
    const movebackscreen=props.route.params.screenname
    const auth=getAuth(app)
    const [indicator, showIndicator] = useState(false);
    const [inputField, SetInputField] = useState([
        {
            placeholder: "Email",
            value: "",
        },
    ]);

    const handleChange = (text, i) => {
        let tempfeilds = [...inputField];
        tempfeilds[i].value = text;
        SetInputField(tempfeilds);

    };

    const handleSubmit = () => {
        showIndicator(true);
        let tempfeilds = [...inputField];

        if (tempfeilds[0].value === "") {
            alert("Please fill all the feilds");
            showIndicator(false);
            return true;
        }

//        props.navigation.navigate("ScheduleScreen")
        try {
            // API INTEGRATION WILL COME HERE
  
            sendPasswordResetEmail(auth,tempfeilds[0].value).then((res)=>{
                showIndicator(false); 
                alert('Email has been sent to your registerd account for password reset.')
            }).catch((error)=>{
                const errorCode = error.code;
                const errorMessage = error.message;
                showIndicator(false);
                alert(errorMessage)  
            })    
            }
         catch (error) {
            alert("try again later");
        }

        showIndicator(false);
    };

    return (
        <Screen style={{ flex: 1, justifyContent: 'flex-start', alignItems: "center", backgroundColor: Colors.newGrey }}>
            <LoadingModal show={indicator} />
            {/* Nav */}
            <ImageBackground style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: RFPercentage(31.6) }} source={require('../../assets/images/top.png')} >
                <TouchableOpacity activeOpacity={0.8} onPress={() => props.navigation.navigate(movebackscreen)} style={{ position: 'absolute', left: RFPercentage(2.5), top: RFPercentage(6), width: RFPercentage(5), height: RFPercentage(5), borderRadius: RFPercentage(30), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' }} >
                    <Ionicons name="chevron-back" style={{ fontSize: RFPercentage(3.4) }} color={Colors.black} />
                </TouchableOpacity>
                <Text style={{ color: Colors.primary, fontSize: RFPercentage(3.3), fontFamily: 'Montserrat_700Bold' }} >
                    Forget Password
                </Text>
            </ImageBackground>

            {/* Input field */}
            <View style={{ marginTop: RFPercentage(3), justifyContent: 'center', alignItems: 'center', width: '100%', alignSelf: 'center' }}>
                {inputField.map((item, i) => (
                    <View key={i} style={{ alignSelf: 'center' }} >
                        <LineInputField
                            placeholder={item.placeholder}
                            placeholderColor={Colors.darkGrey}
                            placeholderAtCenter={false}
                            height={RFPercentage(6.8)}
                            backgroundColor={Colors.newGrey}
                            borderRadius={RFPercentage(1.4)}
                            color={Colors.black}
                            fontSize={RFPercentage(2)}
                            handleFeild={(text) => handleChange(text, i)}
                            value={item.value}
                            width={"92%"}
                        />
                    </View>
                ))}
            </View>

            {/* Button */}
            <View style={{ width: "100%", alignItems: "center", marginTop: RFPercentage(7) }}>
                <MyAppButton
                    title="Submit"
                    onPress={() => handleSubmit()}
                    gradient={true}
                    bold={false}
                    borderColor={Colors.primary}
                    color={Colors.white}
                    fontFamily={"Montserrat_600SemiBold"}
                    fontSize={RFPercentage(2.2)}
                    borderRadius={RFPercentage(30)}
                    width={"65%"}
                />
            </View>

        </Screen>
    );
}

export default ForgetPasswordScreen;