import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, ScrollView, Image, Platform } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { doc, setDoc,getFirestore,collection,addDoc,getDocs,getDoc,updateDoc,serverTimestamp  } from "firebase/firestore"; 
import {getAuth,updateProfile} from "firebase/auth"
import { ref,getDownloadURL,getStorage, uploadBytes  } from "firebase/storage"
import app from '../../firebase'
import * as ImagePicker from 'expo-image-picker';

//components
import Screen from './../components/Screen';
import MyAppButton from './../components/common/MyAppButton';
import LineInputField from '../components/common/LineInputField';
import LoadingModal from '../components/common/LoadingModal';
//config
import Colors from '../config/Colors';
import BottomTab from '../components/common/BottomTab';

function AddFoodScreen(props) {
    const auth=getAuth(app)
    const db=getFirestore(app)
    const storage=getStorage(app)
    const [indicator,showindicator]=React.useState(false)
const [serveas,setserveas]=useState("")
    const [image, setImage] = useState(null);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const pickImage = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        // console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };


    const [inputField, SetInputField] = useState([
        {
            placeholder: "Food Name",
            value: "",
        },
        {
            placeholder: "Glycemic Index",
            value: "",
        },
        {
            placeholder: "Carbohydrates quantity (Per 100 KG)",
            value: "",
        },
    ]);

    const handleChange = (text, i) => {
        let tempfeilds = [...inputField];
        tempfeilds[i].value = text;
        SetInputField(tempfeilds);

    };
const addfoodfunc=async()=>{
    showindicator(true);
        let tempfeilds = [...inputField];
        if (tempfeilds[0].value === "" || tempfeilds[1].value === ""||tempfeilds[2].value === "") {
            showindicator(false);
            alert("Please fill all feilds")
            return false;
        }
        try{
            const storageRef = ref(storage,'foods/' + auth.currentUser.email + "food"+new Date().toLocaleString());
            const img = await fetch(image);
            const bytes = await img.blob();
            uploadBytes(storageRef, bytes)
            .then(snapshot => {
                showindicator(false)
                return getDownloadURL(snapshot.ref)
            })
            .then(downloadURL => {
                addDoc(collection(db, "foods"), {
                  img:downloadURL,
                  name:tempfeilds[0].value,
                  gi:tempfeilds[1].value,
                  carbs:tempfeilds[2].value,
                  time:serverTimestamp(),
                  serveas:serveas,
                  ings:"",
                  prepare:"",
                  userid:auth.currentUser.uid,
                }).then(()=>{
                  showindicator(false)
                  alert("added")
                }).catch(()=>{
                  showindicator(false)
                  alert("tryagain")
                })

              showindicator(false)
                  
            })
        }
        catch{
            showindicator(false);
            alert("tryagain")
        }
}
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
            {/* Nav */}
            <ImageBackground style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: RFPercentage(31.6) }} source={require('../../assets/images/top.png')} >
                <TouchableOpacity activeOpacity={0.8} onPress={() => props.navigation.navigate("MealPlanScreen")} style={{ position: 'absolute', left: RFPercentage(2.5), top: RFPercentage(6), width: RFPercentage(5), height: RFPercentage(5), borderRadius: RFPercentage(30), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' }} >
                    <Ionicons name="chevron-back" style={{ fontSize: RFPercentage(3.4) }} color={Colors.black} />
                </TouchableOpacity>
                <Text style={{ color: Colors.primary, fontSize: RFPercentage(3.9), fontFamily: 'Montserrat_700Bold' }} >
                    Add Food
                </Text>
            </ImageBackground>

            {/* Input field */}
            <ScrollView style={{ flex: 1, width: '100%' }} >
                <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', alignSelf: 'center' }}>
                        {inputField.map((item, i) => (
                            <View key={i} style={{ marginTop: i == 0 ? RFPercentage(2) : RFPercentage(1), alignSelf: 'center' }} >
                                <LineInputField
                                    placeholder={item.placeholder}
                                    placeholderColor={Colors.primary}
                                    placeholderAtCenter={false}
                                    height={RFPercentage(6.8)}
                                    wide={true}
                                    backgroundColor={Colors.newGrey}
                                    secure={item.secure}
                                    borderRadius={RFPercentage(1.4)}
                                    color={Colors.black}
                                    fontSize={RFPercentage(2)}
                                    handleFeild={(text) => handleChange(text, i)}
                                    value={item.value}
                                    width={"96%"}
                                />
                            </View>
                        ))}
                    </View>
                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center', marginTop: RFPercentage(6) }} >
                        <RNPickerSelect
                            onValueChange={(value) => setserveas(value)}
                            placeholder={{ label: 'Served as' }}
                            Icon={Platform.OS == 'android' ? null : iconComponent}
                            items={[
                                { label: 'Breakfast', value: 'Breakfast' },
                                { label: 'Lunch', value: 'Lunch' },
                                { label: 'Dinner', value: 'Dinner' },
                                { label: 'Snacks', value: 'Snacks' },
                            ]}
                        />
                    </View>
                    <View style={{ marginTop: RFPercentage(1), width: '85%', justifyContent: 'center', alignItems: 'center', borderBottomColor: Colors.grey, borderWidth: RFPercentage(0.1) }} />

                    <View style={{ marginTop: RFPercentage(6), width: '90%', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', alignSelf: 'center' }} >
                        <TouchableOpacity onPress={pickImage} activeOpacity={0.8} style={{ justifyContent: 'center', alignItems: 'center', width: RFPercentage(18), height: RFPercentage(5), borderRadius: RFPercentage(10), backgroundColor: Colors.white }} >
                            <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_600SemiBold' }} >
                                Add Food Photo
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity activeOpacity={0.6} style={{ alignSelf: 'center', marginTop: RFPercentage(3) }} >
                        <Image source={{ uri: image }} style={{ width: RFPercentage(30), height: RFPercentage(20), borderRadius: RFPercentage(1) }} />
                    </TouchableOpacity>

                    {/* Button */}
                    <View style={{ width: "100%", alignItems: "center", marginTop: RFPercentage(4) }}>
                        <MyAppButton
                            title="Add"
                             onPress={() => addfoodfunc()}
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
                    <View style={{ marginBottom: RFPercentage(12) }} />
                </View>
            </ScrollView>
            <BottomTab props={props} />
        </Screen>
    );
}

export default AddFoodScreen;