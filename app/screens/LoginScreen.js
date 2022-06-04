import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize';

//components
import Screen from './../components/Screen';
import MyAppButton from './../components/common/MyAppButton';
import LineInputField from './../components/common/LineInputField';
import LoadingModal from './../components/common/LoadingModal';

//config
import Colors from '../config/Colors';
import app from "../../firebase"
import {createUserWithEmailAndPassword,signInWithEmailAndPassword,getAuth,deleteUser,updateProfile,sendEmailVerification} from "firebase/auth"
function LoginScreen(props) {


    const socialMediaLinks = [
        {
            imageSource: require('../../assets/images/fb.png'),
            // onPress: Pass onpress here
        },
        {
            imageSource: require('../../assets/images/apple.png'),
            // onPress:
        },
        {
            imageSource: require('../../assets/images/google.png'),
            // onPress:
        },
    ]
    const auth=getAuth(app)
    const [indicator, showIndicator] = useState(false);

    const [inputField, SetInputField] = useState([
        {
            placeholder: "Email or Username",
            value: "",
        },
        {
            placeholder: "Password",
            value: "",
            secure: true
        },
    ]);

    const handleChange = (text, i) => {
        let tempfeilds = [...inputField];
        tempfeilds[i].value = text;
        SetInputField(tempfeilds);

    };


    const handleLogin=()=>{
        showIndicator(true);
        let tempfeilds = [...inputField];
        if (tempfeilds[0].value === "" || tempfeilds[1].value === "") {
            showIndicator(false);
            alert("Please fill all feilds")
            return false;
        }
        try{
            showIndicator(true)
            signInWithEmailAndPassword(auth,tempfeilds[0].value,tempfeilds[1].value).then(()=>{
                showIndicator(false);
                alert("Welcome back")
            
            }).catch((error)=>{
                const errorCode = error.code;
                const errorMessage = error.message;
                showIndicator(false);
                alert(errorMessage)
            })
            
         
        }
        catch{
            showIndicator(false);
            alert("login failed")
        }
    }

    return (
        <Screen style={styles.screen}>
            <LoadingModal show={indicator} />
            <Text style={{ color: Colors.primary, fontSize: RFPercentage(4.8), fontFamily: 'Montserrat_700Bold', marginTop: RFPercentage(10) }} >
                Welcome
            </Text>
            <Text style={{ color: Colors.black, fontSize: RFPercentage(1.9), marginTop: RFPercentage(0.2) }} >
                Sign in to continue
            </Text>

            <ScrollView style={{ flex: 1, width: '100%' }} >
                <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>

                    {/* Input field */}
                    <View style={{ marginTop: RFPercentage(5.2), justifyContent: 'center', alignItems: 'center', width: '100%', alignSelf: 'center' }}>
                        {inputField.map((item, i) => (
                            <View key={i} style={{ marginTop: i == 0 ? RFPercentage(8) : RFPercentage(2), alignSelf: 'center' }} >
                                <LineInputField
                                    placeholder={item.placeholder}
                                    placeholderColor={Colors.darkGrey}
                                    placeholderAtCenter={false}
                                    height={RFPercentage(6.8)}
                                    backgroundColor={Colors.white}
                                    borderWidth={RFPercentage(0.3)}
                                    // borderColor={Colors.black}
                                    secure={item.secure}
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
                            title="LOGIN"
                            onPress={() => handleLogin()}
                            gradient={true}
                            bold={false}
                            borderColor={Colors.primary}
                            color={Colors.white}
                            fontFamily={"Montserrat_600SemiBold"}
                            fontSize={RFPercentage(2.2)}
                            borderRadius={RFPercentage(30)}
                            width={"60%"}
                        />
                    </View>

                    {/* Forget Pass & or */}
                    <TouchableOpacity onPress={() => props.navigation.navigate("ForgetPasswordScreen",{screenname:"LoginScreen"})} activeOpacity={0.8} style={{ marginTop: RFPercentage(2) }} >
                        <Text style={{ color: Colors.black, fontSize: RFPercentage(1.9) }} >
                            Forget Password?
                        </Text>
                    </TouchableOpacity>

                    <View style={{ marginTop: RFPercentage(4), flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }} >
                        <View style={{ width: RFPercentage(18), height: RFPercentage(0.1), backgroundColor: Colors.black, marginRight: RFPercentage(0.5) }} />
                        <Text style={{ color: Colors.black, fontSize: RFPercentage(2) }} >
                            or
                        </Text>
                        <View style={{ width: RFPercentage(18), height: RFPercentage(0.1), backgroundColor: Colors.black, marginLeft: RFPercentage(0.5) }} />
                    </View>

                    {/* Social Media */}
                    <Text style={{ color: Colors.black, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_600SemiBold', marginTop: RFPercentage(8) }} >
                        Social Media Login
                    </Text>

                    <View style={{ marginTop: RFPercentage(2), width: '26%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                        {socialMediaLinks.map((item, i) => (
                            <TouchableOpacity key={i} activeOpacity={0.8} >
                                <Image style={{ width: RFPercentage(3.4), height: RFPercentage(3.4) }} source={item.imageSource} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={{ marginTop: RFPercentage(5.8), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                        <Text style={{ color: Colors.black, fontSize: RFPercentage(1.8) }} >
                            Don't have an account?
                        </Text>
                        <TouchableOpacity onPress={() => props.navigation.navigate("SignupScreen")} activeOpacity={0.8} style={{ marginLeft: RFPercentage(0.6) }} >
                            <Text style={{ color: Colors.primary, fontWeight: 'bold', fontFamily: 'Montserrat_600SemiBold', fontSize: RFPercentage(1.8) }} >
                                Signup
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: "center",
        backgroundColor: Colors.white
    }
})

export default LoginScreen;