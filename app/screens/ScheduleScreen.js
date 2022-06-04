import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ImageBackground, Image } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from "react-native-modal-datetime-picker";
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
//components
import Screen from './../components/Screen';
import ScheduleScreenTodayComponent from './../components/ScheduleScreenTodayComponent';
import BottomTab from './../components/common/BottomTab';

//config
import Colors from '../config/Colors';
import app from "../../firebase"
import {createUserWithEmailAndPassword,getAuth,deleteUser,updateProfile,sendEmailVerification} from "firebase/auth"
import {doc,updateDoc,setDoc,getFirestore, addDoc, serverTimestamp,getDocs,query,collection,where,deleteDoc} from "firebase/firestore"
import LoadingModal from '../components/common/LoadingModal';
import { useIsFocused } from "@react-navigation/native";
const mimg=[require("../../assets/images/m2.png"),require("../../assets/images/m3.png"),require("../../assets/images/m4.png")
,require("../../assets/images/m5.png"),require("../../assets/images/m6.png"),require("../../assets/images/m7.png")
,require("../../assets/images/m8.png"),require("../../assets/images/m9.png"),require("../../assets/images/m2.png"),require("../../assets/images/m2.png")
]
function ScheduleScreen(props) {

    const db=getFirestore(app)
    const auth=getAuth(app)
    const isFocused = useIsFocused(); 
    const [indicator, showIndicator] = useState(false);
    const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false)
    const [date, setDate] = useState(new Date())
    const [flag,setflag]=useState(false)
    const handleDatePicked = date => {
        setDate(date)
    setIsDateTimePickerVisible(false)
    };

    const[user,setuser]=useState([])
    const [activeButton, setActiveButton] = useState('1');

    const [cartColor, setCartColor] = useState(false);
    const [acmform,setacmform]=useState(false)
    const [check, setCheck] = useState('0');

    const [firstCheck, setFirstCheck] = useState(false);
    const[meals,setmeals]=useState([])
    const[exs,setexs]=useState([])
    const[moods,setmoods]=useState([])
    const todayCartData = [
        {
            time: '10:00 AM',
            Title: 'Breakfast',
            subTitle: 'Avacado salad, Blueberries'
        },
        {
            time: '10:00 AM',
            Title: 'Breakfast',
            subTitle: 'Avacado salad, Blueberries'
        },
        {
            time: '10:00 AM',
            Title: 'Breakfast',
            subTitle: 'Avacado salad, Blueberries'
        },
        {
            time: '10:00 AM',
            Title: 'Breakfast',
            subTitle: 'Avacado salad, Blueberries'
        },
    ]
   
//new Date().toDateString()
//converting time to seconds
const tmtos=(str,s)=>{
    let hrs=str.split(":")[0];
    let min=str.split(":")[1];
    let sec=str.split(":")[2];
    let seconds=hrs*60*60+min*60+sec*1
    seconds=seconds-s

    return convertHMS(seconds)
}
function convertHMS(value) {
    const sec = parseInt(value, 10); // convert value to number if it's string
    let hours   = Math.floor(sec / 3600); // get hours
    let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
    let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
    // add 0 if value < 10; Example: 2 => 02
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds; // Return is HH : MM : SS
}
//end cts

    const getmealdata=async()=>{
        showIndicator(true)
        getuserdata()
        const q = query(collection(db, "mealschedule"), where("userid","==",auth.currentUser.uid),where("date", "==",date.toDateString()));
        getDocs(q).then((res)=>{
            const quests=res.docs.map(doc=>({
              data:doc.data(),
              id:doc.id
            }))
                setmeals(quests)
                if(user[0].data.nfm.noti)
                {
                    quests.map((item,i)=>{
                      if(new Date().toDateString()===item.data.date&&item.data.receiven===false)
                      {
                        const upDocRef = doc(db, "mealschedule", item.id);    
                        updateDoc(upDocRef,{receiven:true}).then(()=>{
                            const tmes= tmtos(item.data.mealtime,user[0].data.nfm.time*60)
                            triggerNotifications(tmes,`Reminder for ${item.data.workoutplan} meal `)
                        }).catch(()=>{

                        })
                           
                      }
                    })
                } 
                if(user[0].data.nfw.noti)
                {
                    quests.map((item,i)=>{
                      if(new Date().toDateString()===item.data.date)
                      {
                            triggerNotificationsforwater(user[0].data.nfw.time,`Reminder for Water Your Target is ${item.data.water} Liter in ${item.data.workoutplan} meal `)                      
                      }
                    })
                }      
                showIndicator(false)
          }).catch((e)=>{
              showIndicator(false)
          })
    }

    const getexercisedata=async()=>{
        showIndicator(true)
        getuserdata()
        const q = query(collection(db, "exerciseschedule"), where("userid","==",auth.currentUser.uid),where("date", "==",date.toDateString()));
        getDocs(q).then((res)=>{
            const quests=res.docs.map(doc=>({
              data:doc.data(),
              id:doc.id
            }))
                setexs(quests)
                if(user[0].data.nfe.noti)
                {
                    quests.map((item,i)=>{
                      if(new Date().toDateString()===item.data.date&&item.data.receiven===false)
                      {
                        const upDocRef = doc(db, "exerciseschedule", item.id);    
                        updateDoc(upDocRef,{receiven:true}).then(()=>{
                            const tmes= tmtos(item.data.exercisetime,user[0].data.nfe.time*60)
                            triggerNotifications(tmes,`Reminder for ${item.data.workoutplan} Exercise `)
                        }).catch(()=>{

                        })
                           
                      }
                    })
                }
              showIndicator(false)
          }).catch((e)=>{
              showIndicator(false)
          })
    }

    const getmooddata=async()=>{
        showIndicator(true)
        const q = query(collection(db, "moods"), where("userid","==",auth.currentUser.uid),where("date", "==",date.toDateString()));
        getDocs(q).then((res)=>{
            const quests=res.docs.map(doc=>({
              data:doc.data(),
              id:doc.id
            }))
                setmoods(quests)
              showIndicator(false)
          }).catch((e)=>{
              showIndicator(false)
          })
    }
    
    //getting user info
    const getuserdata=async()=>{
        showIndicator(true)
        const q = query(collection(db, "users"), where("userid","==",auth.currentUser.uid));
        getDocs(q).then((res)=>{
            const quests=res.docs.map(doc=>({
              data:doc.data(),
              id:doc.id
            }))
                setuser(quests)
                setacmform(quests[0].data.acm)
                showIndicator(false)
          }).catch((e)=>{
              showIndicator(false)
          })
    }



    useEffect(()=>{
        if(isFocused)
        {
            getmealdata()
            getexercisedata()
            getmooddata()
            getuserdata()
        }
        
    },[isFocused,props,date])
    //sheduling notification
    const triggerNotifications = async (ti,da) => {
       let ct=new Date().toLocaleTimeString()
       let val1=ct.split(":")[0]*60*60+ct.split(":")[1]*60+ct.split(":")[2]*1
       let val2=ti.split(":")[0]*60*60+ti.split(":")[1]*60+ti.split(":")[2]*1
       let nft=val2-val1
if(val2>val1)
{
       await Notifications.scheduleNotificationAsync({
        content: {
        title: "Diet Plan App",
        body: da,
        data: { data: "goes here" },
        },
        trigger: { 
            seconds:nft
    },
        });
    }
    }
    const triggerNotificationsforwater = async (ti,da) => {
 console.log(ti)
        await Notifications.scheduleNotificationAsync({
         content: {
         title: "Diet Plan App",
         body: da,
         data: { data: "goes here" },
         },
         trigger: { 
             seconds:ti*60
     },
         });
     
     }
        Notifications.setNotificationHandler({
          handleNotification: async () => {
          return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          }}
          })
    

        
    //ending notification functions
    return (
        <Screen style={styles.screen}>
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
            <ImageBackground style={{ justifyContent: 'flex-start', alignItems: 'center', width: '100%', height: RFPercentage(32) }} source={require('../../assets/images/top.png')} >
                <View style={{ marginTop: RFPercentage(6), width: '90%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }} >
                    <TouchableOpacity  activeOpacity={0.8} style={{ position: 'absolute', left: 0, width: RFPercentage(5), height: RFPercentage(5), borderRadius: RFPercentage(30), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' }} >
                        <Ionicons name="chevron-back" style={{ fontSize: RFPercentage(3) }} color={Colors.black} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsDateTimePickerVisible(true)} style={{ position: 'absolute', right: 0 }} >
                        <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_600SemiBold' }} >
                            {date.toDateString()}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={{ marginTop: RFPercentage(3), color: Colors.primary, fontSize: RFPercentage(3.5), fontFamily: 'Montserrat_700Bold' }} >
                    Schedule
                </Text>

                {/* First List */}
                <View style={{ marginLeft: RFPercentage(2.8), flexDirection: 'row', marginTop: RFPercentage(5), width: '90%', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'flex-start' }} >
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setActiveButton('1')} style={{ justifyContent: 'center', alignItems: 'center' }}  >
                        <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.9), fontFamily: 'Montserrat_600SemiBold' }} >
                            Meals
                        </Text>
                        {activeButton == '1' ?
                            <View style={{ width: RFPercentage(6), height: RFPercentage(0.7), borderRadius: RFPercentage(0.5), backgroundColor: Colors.secondary }} />
                            :
                            null
                        }
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.8} onPress={() => setActiveButton('2')} style={{ marginLeft: RFPercentage(4), justifyContent: 'center', alignItems: 'center' }}  >
                        <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.9), fontFamily: 'Montserrat_600SemiBold' }} >
                            Others
                        </Text>
                        {activeButton == '2' ?
                            <View style={{ width: RFPercentage(10), height: RFPercentage(0.7), borderRadius: RFPercentage(0.5), backgroundColor: Colors.secondary }} />
                            :
                            null
                        }
                    </TouchableOpacity>
                </View>
            </ImageBackground>

            {/* If Today Button is active */}
            {activeButton == '1' ?
                <>
                    <ScrollView style={{ flex: 1, width: '100%' }} >
                        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>

                            {meals.map((item, i) => (
                                <ScheduleScreenTodayComponent key={i} btnstate={acmform} time={item.data.mealtime} Title={item.data.workoutplan} subTitle={item.data.foodname} />
                            ))}

                            <View style={{ marginBottom: RFPercentage(12) }} />
                        </View>
                    </ScrollView>
                </>
                :
                null
            }

            {/* If Tomorrow Button is active */}
            {activeButton == '2' ?
                <>
                    <ScrollView style={{ flex: 1, width: '100%' }} >
                        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
{

    meals.map((item,i)=>{
        return(
            <View key={i} style={{ width: '90%', height: RFPercentage(14), backgroundColor: Colors.white, borderRadius: RFPercentage(3), justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', flexDirection: 'row',marginBottom:RFPercentage(1.3) }} >
                                <View style={{ marginBottom: RFPercentage(2), marginLeft: RFPercentage(2), justifyContent: 'center', alignItems: 'center' }} >
                                    <Text style={{ color: Colors.primary, fontSize: RFPercentage(2.5), fontFamily: 'Montserrat_600SemiBold' }} >
                                        Water
                                    </Text>
                                    <Text style={{ marginTop: RFPercentage(1.4), color: Colors.primary, fontSize: RFPercentage(1.9), fontFamily: 'Montserrat_400Regular' }} >
                                        {item.data.water}/2L
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', position: 'absolute', right: RFPercentage(2), top: RFPercentage(2) }} >
                                    <TouchableOpacity activeOpacity={0.8} style={{ width: RFPercentage(10), height: RFPercentage(4), backgroundColor: Colors.secondary, borderRadius: RFPercentage(2), justifyContent: 'center', alignItems: 'center' }} >
                                        <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_400Regular' }} >
                                           {item.data.workoutplan}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity activeOpacity={0.8} style={{ marginLeft: RFPercentage(1.5), width: RFPercentage(10), height: RFPercentage(4), backgroundColor: Colors.primary, borderRadius: RFPercentage(2), justifyContent: 'center', alignItems: 'center' }} >
                                        <Text style={{ color: Colors.secondary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_400Regular' }} >
                                        {item.data.foodname}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

        )
    })
}
                            {
                                exs.map((item,i)=>{
                                    return(
                                        <View key={i} style={{ marginTop: RFPercentage(2), alignSelf: 'center', width: '90%', height: RFPercentage(14), backgroundColor: user[0].data.acw ? Colors.secondary : Colors.white, borderRadius: RFPercentage(3), justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }} >
                                <View style={{ marginLeft: RFPercentage(2) }} >
                                    <Ionicons name="time-outline" style={{ fontSize: RFPercentage(3) }} color={Colors.primary} />
                                    <Text style={{ marginTop: RFPercentage(1), color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_400Regular' }} >
                                        {item.data.exercisetime}{item.data.exercisetime.split(":")[0]>12?" Pm":" Am"}
                                    </Text>
                                </View>

                                <View style={{ marginLeft: RFPercentage(2), justifyContent: 'center', alignItems: 'flex-start' }} >
                                    <Text style={{ color: Colors.primary, fontSize: RFPercentage(2.5), fontFamily: 'Montserrat_600SemiBold' }} >
                                        {item.data.workoutplan}
                                    </Text>
                                    <Text style={{ marginTop: RFPercentage(1), color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_400Regular' }} >
                                    {item.data.duration}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'absolute', right: RFPercentage(1), top: RFPercentage(2) }} >
                                    <TouchableOpacity activeOpacity={0.8} >
                                        <Feather name="plus-circle" style={{ fontSize: RFPercentage(2.8) }} color={Colors.primary} />
                                    </TouchableOpacity>

                                    {user[0].data.acw ?
                                        <TouchableOpacity activeOpacity={0.8}  >
                                            <AntDesign name="checkcircle" style={{ fontSize: RFPercentage(2.8), marginLeft: RFPercentage(1) }} color={Colors.black} />
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity activeOpacity={0.8}  >
                                            <AntDesign name="checkcircle" style={{ fontSize: RFPercentage(2.8), marginLeft: RFPercentage(1) }} color={Colors.primary} />
                                        </TouchableOpacity>
                                    }

                                </View>
                            </View>

                                    )
                                })
                            }
                            <View style={{ display:exs.length===0?"none":"flex",marginTop: RFPercentage(3), width: '86%', backgroundColor: Colors.white, justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', borderRadius: RFPercentage(2.5) }} >
                                <ScrollView style={{ flex: 1, width: '100%' }} >
                                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>

                                        <View style={{ marginTop: RFPercentage(7), width: '100%', backgroundColor: Colors.grey, height: RFPercentage(0.1) }} />
                                        {
                                            exs.map((item,i)=>(
                                                <>
                                                <View key={i} style={{ marginTop: RFPercentage(3), width: '90%', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', flexDirection: 'row' }} >
                                            <TouchableOpacity activeOpacity={0.8} >
                                                <Feather name="minus-circle" style={{ fontSize: RFPercentage(2.6) }} color={Colors.primary} />
                                            </TouchableOpacity>
                                            <Text style={{ marginLeft: RFPercentage(2), color: Colors.primary, fontSize: RFPercentage(2.2), fontFamily: 'Montserrat_600SemiBold' }} >
                                                {item.data.exercise}
                                            </Text>
                                            <TouchableOpacity activeOpacity={0.8} style={{ position: 'absolute', right: 0 }} >
                                                <AntDesign name="checkcircle" style={{ fontSize: RFPercentage(2.8), marginLeft: RFPercentage(1) }} color={Colors.black} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ marginTop: RFPercentage(4), width: '100%', backgroundColor: Colors.grey, height: RFPercentage(0.1) }} />

                                                </>
                                            ))
                                        }
                                    </View>
                                </ScrollView>
                            </View>
{
    moods.map((item,i)=>{
        return(
            <>
                
                            {/* Mood Box */}
                            <View key={i} style={{ marginTop: RFPercentage(3), justifyContent: 'flex-start', alignItems: 'center', width: '90%', height: RFPercentage(35), backgroundColor: Colors.white, borderRadius: RFPercentage(3) }} >
                                {/* First Row */}
                                <View style={{ width: '90%', marginTop: RFPercentage(5), justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }} >
                                    <Text style={{ color: Colors.primary, fontSize: RFPercentage(2.6), fontFamily: 'Montserrat_600SemiBold' }} >
                                        Mood
                                    </Text>
                    
                                </View>

                                <View style={{ marginTop: RFPercentage(2), width: '75%', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', flexDirection: 'row' }} >
                                    <View style={{ bottom: RFPercentage(0.1), justifyContent: 'center', alignItems: 'center' }} >
                                        <Image style={{ width: RFPercentage(4.8), height: RFPercentage(4.8) }} source={require('../../assets/images/m1.png')} />
                                        <TouchableOpacity onPress={() => setCheck('2')} activeOpacity={0.8} style={{ marginTop: RFPercentage(1), width: RFPercentage(3), height: RFPercentage(3), borderColor: Colors.darkGrey, borderWidth: RFPercentage(0.1), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: RFPercentage(20) }} >
                                            {item.data.moodvalue == '0' ?
                                                <TouchableOpacity activeOpacity={0.8} style={{ borderRadius: RFPercentage(6), width: RFPercentage(2), height: RFPercentage(2), backgroundColor: Colors.darkGrey }} />
                                                :
                                                null
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                                        <Image style={{ width: RFPercentage(4), height: RFPercentage(4) }} source={require('../../assets/images/m2.png')} />
                                        <TouchableOpacity onPress={() => setCheck('3')} activeOpacity={0.8} style={{ marginTop: RFPercentage(1), width: RFPercentage(3), height: RFPercentage(3), borderColor: Colors.darkGrey, borderWidth: RFPercentage(0.1), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: RFPercentage(20) }} >
                                            {item.data.moodvalue == '1' ?
                                                <TouchableOpacity activeOpacity={0.8} style={{ borderRadius: RFPercentage(6), width: RFPercentage(2), height: RFPercentage(2), backgroundColor: Colors.darkGrey }} />
                                                :
                                                null
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                                        <Image style={{ width: RFPercentage(4), height: RFPercentage(4) }} source={require('../../assets/images/m3.png')} />
                                        <TouchableOpacity onPress={() => setCheck('4')} activeOpacity={0.8} style={{ marginTop: RFPercentage(1), width: RFPercentage(3), height: RFPercentage(3), borderColor: Colors.darkGrey, borderWidth: RFPercentage(0.1), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: RFPercentage(20) }} >
                                            {item.data.moodvalue == '2' ?
                                                <TouchableOpacity activeOpacity={0.8} style={{ borderRadius: RFPercentage(6), width: RFPercentage(2), height: RFPercentage(2), backgroundColor: Colors.darkGrey }} />
                                                :
                                                null
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                                        <Image style={{ width: RFPercentage(4), height: RFPercentage(4) }} source={require('../../assets/images/m4.png')} />
                                        <TouchableOpacity onPress={() => setCheck('5')} activeOpacity={0.8} style={{ marginTop: RFPercentage(1), width: RFPercentage(3), height: RFPercentage(3), borderColor: Colors.darkGrey, borderWidth: RFPercentage(0.1), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: RFPercentage(20) }} >
                                            {item.data.moodvalue == '3' ?
                                                <TouchableOpacity activeOpacity={0.8} style={{ borderRadius: RFPercentage(6), width: RFPercentage(2), height: RFPercentage(2), backgroundColor: Colors.darkGrey }} />
                                                :
                                                null
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                                        <Image style={{ width: RFPercentage(4), height: RFPercentage(4) }} source={require('../../assets/images/m5.png')} />
                                        <TouchableOpacity onPress={() => setCheck('6')} activeOpacity={0.8} style={{ marginTop: RFPercentage(1), width: RFPercentage(3), height: RFPercentage(3), borderColor: Colors.darkGrey, borderWidth: RFPercentage(0.1), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: RFPercentage(20) }} >
                                            {item.data.moodvalue == '4' ?
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
                                        <TouchableOpacity onPress={() => setCheck('7')} activeOpacity={0.8} style={{ marginTop: RFPercentage(1), width: RFPercentage(3), height: RFPercentage(3), borderColor: Colors.darkGrey, borderWidth: RFPercentage(0.1), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: RFPercentage(20) }} >
                                            {item.data.moodvalue == '5' ?
                                                <TouchableOpacity activeOpacity={0.8} style={{ borderRadius: RFPercentage(6), width: RFPercentage(2), height: RFPercentage(2), backgroundColor: Colors.darkGrey }} />
                                                :
                                                null
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                                        <Image style={{ width: RFPercentage(4), height: RFPercentage(4) }} source={require('../../assets/images/m7.png')} />
                                        <TouchableOpacity onPress={() => setCheck('8')} activeOpacity={0.8} style={{ marginTop: RFPercentage(1), width: RFPercentage(3), height: RFPercentage(3), borderColor: Colors.darkGrey, borderWidth: RFPercentage(0.1), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: RFPercentage(20) }} >
                                            {item.data.moodvalue == '6' ?
                                                <TouchableOpacity activeOpacity={0.8} style={{ borderRadius: RFPercentage(6), width: RFPercentage(2), height: RFPercentage(2), backgroundColor: Colors.darkGrey }} />
                                                :
                                                null
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                                        <Image style={{ width: RFPercentage(4), height: RFPercentage(4) }} source={require('../../assets/images/m8.png')} />
                                        <TouchableOpacity onPress={() => setCheck('9')} activeOpacity={0.8} style={{ marginTop: RFPercentage(1), width: RFPercentage(3), height: RFPercentage(3), borderColor: Colors.darkGrey, borderWidth: RFPercentage(0.1), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: RFPercentage(20) }} >
                                            {item.data.moodvalue == '7' ?
                                                <TouchableOpacity activeOpacity={0.8} style={{ borderRadius: RFPercentage(6), width: RFPercentage(2), height: RFPercentage(2), backgroundColor: Colors.darkGrey }} />
                                                :
                                                null
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                                        <Image style={{ width: RFPercentage(4), height: RFPercentage(4) }} source={require('../../assets/images/m9.png')} />
                                        <TouchableOpacity onPress={() => setCheck('10')} activeOpacity={0.8} style={{ marginTop: RFPercentage(1), width: RFPercentage(3), height: RFPercentage(3), borderColor: Colors.darkGrey, borderWidth: RFPercentage(0.1), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: RFPercentage(20) }} >
                                            {item.data.moodvalue == '8' ?
                                                <TouchableOpacity activeOpacity={0.8} style={{ borderRadius: RFPercentage(6), width: RFPercentage(2), height: RFPercentage(2), backgroundColor: Colors.darkGrey }} />
                                                :
                                                null
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                                        <Image style={{ width: RFPercentage(4), height: RFPercentage(4) }} source={require('../../assets/images/m4.png')} />
                                        <TouchableOpacity onPress={() => setCheck('11')} activeOpacity={0.8} style={{ marginTop: RFPercentage(1), width: RFPercentage(3), height: RFPercentage(3), borderColor: Colors.darkGrey, borderWidth: RFPercentage(0.1), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: RFPercentage(20) }} >
                                            {item.data.moodvalue == '9' ?
                                                <TouchableOpacity activeOpacity={0.8} style={{ borderRadius: RFPercentage(6), width: RFPercentage(2), height: RFPercentage(2), backgroundColor: Colors.darkGrey }} />
                                                :
                                                null
                                            }
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
            </>
        )
    })
}

                            <View style={{ marginBottom: RFPercentage(12) }} />
                        </View>
                    </ScrollView>
                </>
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
export default ScheduleScreen;