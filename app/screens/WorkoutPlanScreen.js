import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ImageBackground, FlatList } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
//components
import Screen from './../components/Screen';
import InputField from './../components/common/InputField';
import MyAppButton from './../components/common/MyAppButton';
import BottomTab from '../components/common/BottomTab';
import WorkoutConfiguratorScreenCart from './../components/WorkoutConfiguratorScreenCart';

//config
import Colors from '../config/Colors';
import app from "../../firebase"
import {createUserWithEmailAndPassword,getAuth,deleteUser,updateProfile,sendEmailVerification} from "firebase/auth"
import {doc,setDoc,getFirestore, addDoc, serverTimestamp,getDocs,query,collection,where,deleteDoc} from "firebase/firestore"
import LoadingModal from '../components/common/LoadingModal';
import { useIsFocused } from "@react-navigation/native";
function WorkoutPlanScreen(props) {
    const db=getFirestore(app)
    const auth=getAuth(app)
    const isFocused = useIsFocused(); 
    const[wps,setwps]=useState([])
    const[foodsFavouriteCartData,setfoodsFavouriteCartData]=useState([])
    const [indicator, showIndicator] = useState(false);
    const[delflag,setdelflag]=useState(false)
    const deleteweight=async(id)=>{
        showIndicator(true)
        setdelflag(false)
    try{
        await deleteDoc(doc(db, "workoutplan", id));
        showIndicator(false)
        setdelflag(true)
    }
    catch{
        showIndicator(false)
        alert("tryagain")
    }
    }
    const getwps=async()=>{
        showIndicator(true)
        const q = query(collection(db, "workoutplan"), where("userid", "==",auth.currentUser.uid));
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
    useEffect(()=>{
        if(isFocused)
        {
            getwps()
            setfoodsFavouriteCartData(foodsFavouriteCartData1)
        }
        
    },[isFocused,props,delflag])
    const [activeButton, setActiveButton] = useState('1');
    const [recipesButton, setRecipesButton] = useState('1');
    const mealPlanConfigurationData = [
        {
            t1: 'Body Workout',
            t2: '7:00 PM',
            t3: '25 minutes'
        },
        {
            t1: 'Cardio',
            t2: '11:00 PM',
            t3: '10 minutes'
        },
        {
            t1: 'Muscle Gain',
            t2: '12:00 PM',
            t3: '5 minutes'
        },
        {
            t1: 'Swimming',
            t2: '1:00 PM',
            t3: '20 minutes'
        },
    ]

    let foodsFavouriteCartData1 = [

        {
            id: "0",
            imageSource: require('../../assets/images/bw1.png'),
            title: 'Wall Push-up',
            heart: '1'
        },
        {
            id: "1",
            imageSource: require('../../assets/images/bw2.png'),
            title: 'Jumping Jacks',
            heart: '2'

        },
        {
            id: "2",
            imageSource: require('../../assets/images/bw3.png'),
            title: 'Squats',
            heart: '3'

        },
        {
            id: "3",
            imageSource: require('../../assets/images/bw4.png'),
            title: 'Heel Touch',
            heart: '4'

        },
        {
            id: "4",
            imageSource: require('../../assets/images/bw2.png'),
            title: 'Pushups',
            heart: '4'

        },
        {
            id: "5",
            imageSource: require('../../assets/images/ff6.png'),
            title: 'Pomegranate',
            heart: '4'

        },

    ]

    const [inputField, SetInputField] = useState([
        {
            placeholder: "Search",
            iconName: 'search',
            value: "",
        },
    ]);

    const handleChange = (text, i) => {
        let tempfeilds = [...inputField];
        tempfeilds[i].value = text;
        SetInputField(tempfeilds);
        let temp=foodsFavouriteCartData1
        let temp1=temp
        if(temp.filter((it)=>it.title.includes(tempfeilds[i].value)))
        {
           setfoodsFavouriteCartData(temp.filter((it)=>it.title.includes(tempfeilds[i].value)))
        }
        else
        {
            setfoodsFavouriteCartData(temp1)
        }
    };

    return (
        <Screen style={styles.screen}>
            {/* Nav */}
            <ImageBackground style={{ justifyContent: 'flex-start', alignItems: 'center', width: '100%', height: RFPercentage(32) }} source={require('../../assets/images/top.png')} >
                <View style={{ marginTop: RFPercentage(6), width: '90%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }} >
                    <TouchableOpacity onPress={() => props.navigation.navigate("ScheduleScreen")} activeOpacity={0.8} style={{ position: 'absolute', left: 0, width: RFPercentage(5), height: RFPercentage(5), borderRadius: RFPercentage(30), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' }} >
                        <Ionicons name="chevron-back" style={{ fontSize: RFPercentage(3) }} color={Colors.black} />
                    </TouchableOpacity>
                </View>
                <Text style={{ marginTop: RFPercentage(3), color: Colors.primary, fontSize: RFPercentage(3.5), fontFamily: 'Montserrat_700Bold' }} >
                    Workout Plan
                </Text>

                {/* First List */}
                <View style={{ flexDirection: 'row', marginTop: RFPercentage(5), width: '90%', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center' }} >
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setActiveButton('1')} style={{ justifyContent: 'center', alignItems: 'center' }}  >
                        <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.9), fontFamily: 'Montserrat_600SemiBold' }} >
                            Exercises
                        </Text>
                        {activeButton == '1' ?
                            <View style={{ width: RFPercentage(10), height: RFPercentage(0.7), borderRadius: RFPercentage(0.5), backgroundColor: Colors.secondary }} />
                            :
                            null
                        }
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.8} onPress={() => setActiveButton('2')} style={{ justifyContent: 'center', alignItems: 'center' }}  >
                        <Text style={{ marginLeft: RFPercentage(10), color: Colors.primary, fontSize: RFPercentage(1.9), fontFamily: 'Montserrat_600SemiBold' }} >
                            Workout Configurator
                        </Text>
                        {activeButton == '2' ?
                            <View style={{ marginLeft: RFPercentage(10), width: RFPercentage(22), height: RFPercentage(0.7), borderRadius: RFPercentage(0.5), backgroundColor: Colors.secondary }} />
                            :
                            null
                        }
                    </TouchableOpacity>

                </View>

                {/* Recipes List */}
                {activeButton == '1' ?

                    <View style={{ flexDirection: 'row', marginTop: RFPercentage(3.5), width: '90%', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center' }} >
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setRecipesButton('1')} style={{ justifyContent: 'center', alignItems: 'center' }}  >
                            <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.9), fontFamily: 'Montserrat_600SemiBold' }} >
                                Body Workout
                            </Text>
                            {recipesButton == '1' ?
                                <View style={{ width: RFPercentage(14), height: RFPercentage(0.7), borderRadius: RFPercentage(0.5), backgroundColor: Colors.secondary }} />
                                :
                                null
                            }
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.8} onPress={() => setRecipesButton('2')} style={{ justifyContent: 'center', alignItems: 'center' }}  >
                            <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.9), fontFamily: 'Montserrat_600SemiBold' }} >
                                Sports
                            </Text>
                            {recipesButton == '2' ?
                                <View style={{ width: RFPercentage(6), height: RFPercentage(0.7), borderRadius: RFPercentage(0.5), backgroundColor: Colors.secondary }} />
                                :
                                null
                            }
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setRecipesButton('3')} style={{ justifyContent: 'center', alignItems: 'center' }}  >
                            <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.9), fontFamily: 'Montserrat_600SemiBold' }} >
                                Created by me
                            </Text>
                            {recipesButton == '3' ?
                                <View style={{ width: RFPercentage(14), height: RFPercentage(0.7), borderRadius: RFPercentage(0.5), backgroundColor: Colors.secondary }} />
                                :
                                null
                            }
                        </TouchableOpacity>

                    </View>
                    :
                    null
                }
            </ImageBackground>

            {/* If Exercise Are active */}
            {activeButton == '1' ?
                <>
                    {/* Body-workout's body */}
                    {recipesButton == '1' ?
                        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: RFPercentage(6) }}>

                            {/* Input field */}
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                {inputField.map((item, i) => (
                                    <View key={i} style={{ marginTop: i == 0 ? RFPercentage(2) : RFPercentage(1.8) }} >
                                        <InputField
                                            placeholder={item.placeholder}
                                            placeholderColor={Colors.darkGrey}
                                            height={RFPercentage(6)}
                                            leftIconName={item.iconName}
                                            backgroundColor={Colors.white}
                                            borderWidth={RFPercentage(0.2)}
                                            borderColor={Colors.white}
                                            secure={item.secure}
                                            borderRadius={RFPercentage(20)}
                                            color={Colors.black}
                                            fontSize={RFPercentage(2)}
                                            handleFeild={(text) => handleChange(text, i)}
                                            value={item.value}
                                            width={"92%"}
                                        />
                                    </View>
                                ))}
                            </View>

                            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }} >
                                <FlatList
                                    data={foodsFavouriteCartData}
                                    contentContainerStyle={{ height: RFPercentage(150) }}
                                    showsVerticalScrollIndicator={false}
                                    numColumns={2}
                                    keyExtractor={foodsFavouriteCartData => foodsFavouriteCartData.id.toString()}
                                    renderItem={({ item }) =>

                                        <TouchableOpacity activeOpacity={0.8} style={{ marginHorizontal: RFPercentage(1.5), marginVertical: RFPercentage(2.2) }} >
                                            <ImageBackground style={{ overflow: 'hidden', width: RFPercentage(22), height: RFPercentage(28), borderRadius: RFPercentage(3) }} source={item.imageSource} >
                                                {/* Heart and Plus Icon */}
                                                <View style={{ marginTop: RFPercentage(2), width: '96%', justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }} >
                                                    <TouchableOpacity activeOpacity={0.8} onPress={() => props.navigation.navigate("AddExcersiseScreen",{exname:item.title})} style={{ marginLeft: RFPercentage(1.5) }} >
                                                        <AntDesign name="pluscircleo" style={{ fontSize: RFPercentage(3.5) }} color={Colors.primary} />
                                                    </TouchableOpacity>
                                                </View>
                                                {/* Bottom View of Image */}
                                                <View style={{ position: 'absolute', bottom: 0, width: '100%', height: RFPercentage(6), backgroundColor: Colors.newInputFieldBorder, justifyContent: 'center', alignItems: 'center' }} >
                                                    <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.9), fontFamily: 'Montserrat_600SemiBold' }} >
                                                        {item.title}
                                                    </Text>
                                                </View>
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    }
                                />
                            </View>

                            <View style={{ marginBottom: RFPercentage(6) }} />
                        </View>
                        :
                        null
                    }
                    {
                        recipesButton == '2' ?
                        <View style={{flex:1,justifyContent:'center',alignItems:"center"}}>
                            <Text style={{fontSize:RFPercentage(2.5),color:Colors.primary}}>Comming soon</Text>
                        </View>
                        :
                        null
                    }
                    {
                        recipesButton == '3' ?
                        <View style={{flex:1,justifyContent:'center',alignItems:"center"}}>
                            <Text style={{fontSize:RFPercentage(2.5),color:Colors.primary}}>Comming soon</Text>
                        </View>
                        :
                        null
                    }

                </>
                :
                null
            }



            {/* Workout Configurator */}
            {activeButton == '2' ?
            
                <ScrollView style={{ flex: 1, width: '100%' }} >
                <LoadingModal show={indicator}></LoadingModal>
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        {wps.map((item, i) => (           
                            <View key={i} style={{ marginTop: RFPercentage(2), width: '90%', height: RFPercentage(18), justifyContent: 'flex-start', alignItems: 'flex-start', backgroundColor:  Colors.white, borderRadius: RFPercentage(2.2) }} >
            <View style={{ marginTop: RFPercentage(2), marginLeft: RFPercentage(3), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                <Ionicons name="md-time-outline" style={{ fontSize: RFPercentage(3.3) }} color={ Colors.primary} />
                <Text style={{ marginLeft: RFPercentage(2), fontFamily: 'Montserrat_600SemiBold', color: Colors.primary, fontSize: RFPercentage(2.5) }} >
                    {item.data.name&&item.data.name}
                </Text>
            </View>
            <View style={{ marginTop: RFPercentage(2), marginLeft: RFPercentage(2), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                <Text style={{ marginLeft: RFPercentage(2), fontFamily: 'Montserrat_500Medium', color:  Colors.primary, fontSize: RFPercentage(1.7) }} >
                    {item.data.duration&&item.data.duration}
                </Text>
                <Text style={{ marginLeft: RFPercentage(2.2), fontFamily: 'Montserrat_500Medium', color: Colors.primary, fontSize: RFPercentage(2.3) }} >
                    {item.data.workouttime&&item.data.workouttime}
                </Text>
            </View>
                <TouchableOpacity activeOpacity={0.8} onPress={() =>deleteweight(item.id)} style={{ width: RFPercentage(14), height: RFPercentage(4.2), borderRadius: RFPercentage(20), backgroundColor: Colors.grey, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: RFPercentage(2), right: RFPercentage(2) }} >
                    <Text style={{ color: Colors.darkGrey2, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_400Regular' }} >
                       Delete
                    </Text>
                </TouchableOpacity>

        </View>


                        
                        ))}

                        {/* Button */}
                        <View style={{ width: "100%", alignItems: "center", marginTop: RFPercentage(5) }}>
                            <MyAppButton
                                title="Create Workout Plan"
                                onPress={() => props.navigation.navigate("PersonalizedWorkoutPlanScreen")}
                                gradient={true}
                                bold={false}
                                borderColor={Colors.primary}
                                color={Colors.white}
                                fontFamily={"Montserrat_600SemiBold"}
                                fontSize={RFPercentage(2)}
                                borderRadius={RFPercentage(30)}
                                width={"80%"}
                            />
                        </View>

                        <View style={{ marginBottom: RFPercentage(12) }} />
                    </View>
                </ScrollView>
                :
                null
            }
            <BottomTab props={props} />
        </Screen>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: "center",
        backgroundColor: Colors.newGrey
    }
})

export default WorkoutPlanScreen;