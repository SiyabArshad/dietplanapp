import React, { useState,useEffect} from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ImageBackground, FlatList, Switch, Image } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
//components
import Screen from './../components/Screen';
import BottomTab from '../components/common/BottomTab';

//config
import Colors from '../config/Colors';
import app from "../../firebase"
import {createUserWithEmailAndPassword,getAuth,deleteUser,updateProfile,sendEmailVerification} from "firebase/auth"
import {doc,setDoc,getFirestore, addDoc, serverTimestamp,getDocs,query,collection,where,deleteDoc} from "firebase/firestore"
import LoadingModal from '../components/common/LoadingModal';
import { useIsFocused } from "@react-navigation/native";
import { Dimensions } from "react-native";
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from 'react-native-chart-kit'
const screenWidth = Dimensions.get("window").width;
const m_names = ['January', 'February', 'March', 
               'April', 'May', 'June', 'July', 
               'August', 'September', 'October', 'November', 'December'];
const d_names = ["Mon,Tues,Wed,Thurs,Fri,Sat,Sun"];
const mimg=[require("../../assets/images/m2.png"),require("../../assets/images/m3.png"),require("../../assets/images/m4.png")
,require("../../assets/images/m5.png"),require("../../assets/images/m6.png"),require("../../assets/images/m7.png")
,require("../../assets/images/m8.png"),require("../../assets/images/m9.png"),require("../../assets/images/m2.png"),require("../../assets/images/m2.png")
]
const d=new Date()

 
function ProgressScreen(props) {
    const db=getFirestore(app)
    const auth=getAuth(app)
    const isFocused = useIsFocused(); 
    const [indicator, showIndicator] = useState(false);
    const[delflag,setdelflag]=useState(false)
    const [activeButton, setActiveButton] = useState('1');
    const [recipesButton, setRecipesButton] = useState('2');
    const[allm,setallm]=useState([])
    const[allw,setallw]=useState([])
    const[mw3,set3mw]=useState([])
    const[mw6,set6mw]=useState([])
    const[yw,setyw]=useState([])
    const[cmw,setcmw]=useState([])
    const getweigthdata=async()=>{
        showIndicator(true)
        const q = query(collection(db, "weights"), where("userid", "==",auth.currentUser.uid));
        getDocs(q).then((res)=>{
            const quests=res.docs.map(doc=>({
              data:doc.data(),
              id:doc.id
            }))
                setallw(quests)
                setcmw(quests.filter((item)=>item.data.date.toDate().getMonth()===d.getMonth()))
                setyw(quests.filter((item)=>item.data.date.toDate().getYear()===d.getFullYear()))
                set3mw(quests.filter((item)=>item.data.date.toDate().getMonth()>d.getMonth()-3&&item.data.date.toDate().getMonth()<=d.getMonth()))
                set6mw(quests.filter((item)=>item.data.date.toDate().getMonth()>d.getMonth()-6&&item.data.date.toDate().getMonth()<=d.getMonth()))
                setyw(quests.filter((item)=>new Date(item.data.date.toDate().toDateString()).getFullYear()===d.getFullYear()))
                showIndicator(false)
          }).catch((e)=>{
              showIndicator(false)
          })

    }
    const getmooddata=async()=>{
        showIndicator(true)
        const q = query(collection(db, "moods"), where("userid", "==",auth.currentUser.uid));
        getDocs(q).then((res)=>{
            const quests=res.docs.map(doc=>({
              data:doc.data(),
              id:doc.id
            }))
                setallm(quests)
                showIndicator(false)
          }).catch((e)=>{
              showIndicator(false)
          })
    }
const deleteweight=async(id)=>{
    showIndicator(true)
    setdelflag(false)
try{
    await deleteDoc(doc(db, "weights", id));
    showIndicator(false)
    setdelflag(true)
}
catch{
    showIndicator(false)
    alert("tryagain")
}
}
const deletemood=async(id)=>{
    showIndicator(true)
    setdelflag(false)
try{
    await deleteDoc(doc(db, "moods", id));
    showIndicator(false)
    setdelflag(true)
}
catch{
    showIndicator(false)
    alert("tryagain")
}
}

const datajune = {
    
    datasets: [
      {
        data: cmw.length>3&&cmw.map((it)=>parseInt(it.data.bodyweight)),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: ["Current Month"] // optional
  };

  
const data3m = {
    
    datasets: [
      {
        data: mw3.length>3&&mw3.map((it)=>parseInt(it.data.bodyweight)),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: ["Last 3 Month"] // optional
  };

  const data6m = {
    
    datasets: [
      {
        data:mw6.length>3&&mw6.map((it)=>parseInt(it.data.bodyweight)),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: ["Last 6 Month"] // optional
  };

  const datacy = {
    
    datasets: [
      {
        data:yw.length>3&&yw.map((it)=>parseInt(it.data.bodyweight)),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: ["Current Year"] // optional
  };

  const datafb = {
    datasets: [
      {
        data: allw.length>3&&allw.map((it)=>it.data.bodyweight),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: ["From Start"] // optional
  };

  const datamd = {
    datasets: [
      {
        data: allm.length>3&&allm.map((it)=>it.data.moodvalue),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: ["Mood"] // optional
  };
  const chartConfig = {
    backgroundGradientFrom: Colors.newGrey,
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: Colors.newGrey,
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => Colors.primary,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };


    useEffect(()=>{
        if(isFocused)
        {
            getweigthdata()
            getmooddata()
        }
        
    },[isFocused,props,delflag])
    return (
        <Screen style={styles.screen}>
            <LoadingModal show={indicator}></LoadingModal>

            {/* Nav */}
            <ImageBackground style={{ justifyContent: 'flex-start', alignItems: 'center', width: '100%', height: RFPercentage(32) }} source={require('../../assets/images/top.png')} >
                <View style={{ marginTop: RFPercentage(6), width: '90%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }} >
                    <TouchableOpacity onPress={() => props.navigation.navigate("ScheduleScreen")} activeOpacity={0.8} style={{ position: 'absolute', left: 0, width: RFPercentage(5), height: RFPercentage(5), borderRadius: RFPercentage(30), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' }} >
                        <Ionicons name="chevron-back" style={{ fontSize: RFPercentage(3) }} color={Colors.black} />
                    </TouchableOpacity>
                </View>
                <Text style={{ marginTop: RFPercentage(1), color: Colors.primary, fontSize: RFPercentage(3.5), fontFamily: 'Montserrat_700Bold' }} >
                    Progress
                </Text>

                {/* First List */}
                <View style={{ marginLeft: RFPercentage(2.8), flexDirection: 'row', marginTop: RFPercentage(5), width: '90%', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'flex-start' }} >
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setActiveButton('1')} style={{ justifyContent: 'center', alignItems: 'center' }}  >
                        <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.9), fontFamily: 'Montserrat_600SemiBold' }} >
                            Weight
                        </Text>
                        {activeButton == '1' ?
                            <View style={{ width: RFPercentage(8), height: RFPercentage(0.7), borderRadius: RFPercentage(0.5), backgroundColor: Colors.secondary }} />
                            :
                            null
                        }
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.8} onPress={() => setActiveButton('2')} style={{ marginLeft: RFPercentage(6), justifyContent: 'center', alignItems: 'center' }}  >
                        <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.9), fontFamily: 'Montserrat_600SemiBold' }} >
                            Mood
                        </Text>
                        {activeButton == '2' ?
                            <View style={{ width: RFPercentage(6), height: RFPercentage(0.7), borderRadius: RFPercentage(0.5), backgroundColor: Colors.secondary }} />
                            :
                            null
                        }
                    </TouchableOpacity>
                </View>

                {/* Recipes List */}
                {activeButton == '1' ?
                    <View style={{ flexDirection: 'row', marginTop: RFPercentage(3.5), width: '100%', justifyContent: 'space-evenly', alignItems: 'center' }} >
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setRecipesButton('1')} style={{ justifyContent: 'center', alignItems: 'center' }}  >
                            <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_600SemiBold' }} >
                                {m_names[d.getMonth()]}
                            </Text>
                            {recipesButton == '1' ?
                                <View style={{ width: RFPercentage(5), height: RFPercentage(0.7), borderRadius: RFPercentage(0.5), backgroundColor: Colors.secondary }} />
                                :
                                null
                            }
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.8} onPress={() => setRecipesButton('2')} style={{ justifyContent: 'center', alignItems: 'center' }}  >
                            <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_600SemiBold' }} >
                                3 Months
                            </Text>
                            {recipesButton == '2' ?
                                <View style={{ width: RFPercentage(9), height: RFPercentage(0.7), borderRadius: RFPercentage(0.5), backgroundColor: Colors.secondary }} />
                                :
                                null
                            }
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.8} onPress={() => setRecipesButton('3')} style={{ justifyContent: 'center', alignItems: 'center' }}  >
                            <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_600SemiBold' }} >
                                6 Months
                            </Text>
                            {recipesButton == '3' ?
                                <View style={{ width: RFPercentage(9), height: RFPercentage(0.7), borderRadius: RFPercentage(0.5), backgroundColor: Colors.secondary }} />
                                :
                                null
                            }
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.8} onPress={() => setRecipesButton('4')} style={{ justifyContent: 'center', alignItems: 'center' }}  >
                            <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_600SemiBold' }} >
                                Year
                            </Text>
                            {recipesButton == '4' ?
                                <View style={{ width: RFPercentage(5), height: RFPercentage(0.7), borderRadius: RFPercentage(0.5), backgroundColor: Colors.secondary }} />
                                :
                                null
                            }
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.8} onPress={() => setRecipesButton('5')} style={{ justifyContent: 'center', alignItems: 'center' }}  >
                            <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_600SemiBold' }} >
                                From Beginning
                            </Text>
                            {recipesButton == '5' ?
                                <View style={{ width: RFPercentage(16), height: RFPercentage(0.7), borderRadius: RFPercentage(0.5), backgroundColor: Colors.secondary }} />
                                :
                                null
                            }
                        </TouchableOpacity>
                    </View>
                    :
                    null
                }
            </ImageBackground>


            {/* If Weight Button is active */}
            {activeButton == '1' ?
                <>
                
                    {/* April Body */}
                    {recipesButton == '1' ?
                        <ScrollView style={{ flex: 1, width: '100%' }} >
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: RFPercentage(3) }}>

                   {/**chart fo current month */}
                   {
                       cmw.length>3?                   
            <LineChart
                data={datajune}
                width={screenWidth}
                height={300}
                chartConfig={chartConfig}
                bezier
              />:
              <View style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                  <Text style={{color:Colors.primary}}>Not Enough Record</Text>
              </View>

                   }

{/**chart fo current month end */}
                                <View style={{ marginTop: RFPercentage(3), flexDirection: 'row', width: '94%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }} >
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => props.navigation.navigate("AddWeightScreen")} style={{ width: RFPercentage(18), height: RFPercentage(5.4), borderRadius: RFPercentage(10), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' }} >
                                        <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_500Medium' }} >
                                            Add Entry
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ marginTop: RFPercentage(3), width: '86%', backgroundColor: Colors.white, justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', borderRadius: RFPercentage(2.5) }} >
                                    <ScrollView style={{ flex: 1, width: '100%' }} >

                                        <View style={{ marginTop: RFPercentage(3), width: '90%', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', flexDirection: 'row' }} >
                                            <Text style={{ color: Colors.primary, fontSize: RFPercentage(2.3), fontFamily: 'Montserrat_600SemiBold' }} >
                                                Entries
                                            </Text>
                                        </View>
                                        <View style={{ marginTop: RFPercentage(3), width: '100%', backgroundColor: Colors.grey, height: RFPercentage(0.1) }} />
                                        {
    cmw.map((item,i)=>{
return(
    <View style={{ marginTop: RFPercentage(3), width: '90%', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', flexDirection: 'row' }} key={i} >
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                                                <TouchableOpacity activeOpacity={0.8} >
                                                    <Feather name="minus-circle" style={{ fontSize: RFPercentage(3.4) }} color={Colors.purple} />
                                                </TouchableOpacity>
                                                <View style={{ marginLeft: RFPercentage(1) }} >
                                                    <Text style={{ color: Colors.primary, fontSize: RFPercentage(2.5), fontFamily: 'Montserrat_500Medium' }} >
                                                        {item.data.bodyweight} Kg
                                                    </Text>
                                                    <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_400Regular' }} >
                                                    
                                                        { item.data.date.toDate().toDateString()}
                                                    </Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity onPress={()=>deleteweight(item.id)} activeOpacity={0.8} style={{ position: 'absolute', right: 0, width: RFPercentage(10), height: RFPercentage(4), backgroundColor: Colors.grey, borderRadius: RFPercentage(20), justifyContent: 'center', alignItems: 'center' }} >
                                                <Text style={{ color: Colors.primary, fontSize: RFPercentage(2) }} >
                                                    Remove
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
)
    })
}


                                        <View style={{ marginTop: RFPercentage(4), width: '100%', backgroundColor: Colors.grey, height: RFPercentage(0.1) }} />


                                    </ScrollView>
                                </View>
                                <View style={{ marginBottom: RFPercentage(12) }} />
                            </View>
                        </ScrollView>
                        :
                        null
                    }
                    {/* 3 Months Body */}
                    {recipesButton == '2' ?
                        <ScrollView style={{ flex: 1, width: '100%' }} >
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: RFPercentage(3) }}>

                                {/**chart fo 3 month */}
                   

{
                       mw3.length>3?                   
            <LineChart
                data={data3m}
                width={screenWidth}
                height={300}
                chartConfig={chartConfig}
                bezier
              />:
              <View style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                  <Text style={{color:Colors.primary}}>Not Enough Record</Text>
              </View>

                   }

{/**chart fo 3 month end */}
                                <View style={{ marginTop: RFPercentage(3), flexDirection: 'row', width: '94%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }} >
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => props.navigation.navigate("AddWeightScreen")} style={{ width: RFPercentage(18), height: RFPercentage(5.4), borderRadius: RFPercentage(10), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' }} >
                                        <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_500Medium' }} >
                                            Add Entry
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ marginTop: RFPercentage(3), width: '86%', backgroundColor: Colors.white, justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', borderRadius: RFPercentage(2.5) }} >
                                    <ScrollView style={{ flex: 1, width: '100%' }} >

                                        <View style={{ marginTop: RFPercentage(3), width: '90%', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', flexDirection: 'row' }} >
                                            <Text style={{ color: Colors.primary, fontSize: RFPercentage(2.3), fontFamily: 'Montserrat_600SemiBold' }} >
                                                Entries
                                            </Text>
                                        </View>
                                        <View style={{ marginTop: RFPercentage(3), width: '100%', backgroundColor: Colors.grey, height: RFPercentage(0.1) }} />

                                        {
    mw3.map((item,i)=>{
return(
    <View style={{ marginTop: RFPercentage(3), width: '90%', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', flexDirection: 'row' }} key={i} >
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                                                <TouchableOpacity activeOpacity={0.8} >
                                                    <Feather name="minus-circle" style={{ fontSize: RFPercentage(3.4) }} color={Colors.purple} />
                                                </TouchableOpacity>
                                                <View style={{ marginLeft: RFPercentage(1) }} >
                                                    <Text style={{ color: Colors.primary, fontSize: RFPercentage(2.5), fontFamily: 'Montserrat_500Medium' }} >
                                                        {item.data.bodyweight} Kg
                                                    </Text>
                                                    <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_400Regular' }} >
                                                    
                                                        { item.data.date.toDate().toDateString()}
                                                    </Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity onPress={()=>deleteweight(item.id)} activeOpacity={0.8} style={{ position: 'absolute', right: 0, width: RFPercentage(10), height: RFPercentage(4), backgroundColor: Colors.grey, borderRadius: RFPercentage(20), justifyContent: 'center', alignItems: 'center' }} >
                                                <Text style={{ color: Colors.primary, fontSize: RFPercentage(2) }} >
                                                    Remove
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
)
    })
}


                                        <View style={{ marginTop: RFPercentage(4), width: '100%', backgroundColor: Colors.grey, height: RFPercentage(0.1) }} />


                                    </ScrollView>
                                </View>
                                <View style={{ marginBottom: RFPercentage(12) }} />
                            </View>
                        </ScrollView>
                        :
                        null
                    }
                    
                    {/* 6 Months Body */}
                    {recipesButton == '3' ?
                        <ScrollView style={{ flex: 1, width: '100%' }} >
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: RFPercentage(3) }}>

{/**chart fo 6 month */}

        {
                       mw6.length>3?                   
            <LineChart
                data={data6m}
                width={screenWidth}
                height={300}
                chartConfig={chartConfig}
                bezier
              />:
              <View style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                  <Text style={{color:Colors.primary}}>Not Enough Record</Text>
              </View>

                   }

{/**chart fo 6 month end */}

                                <View style={{ marginTop: RFPercentage(3), flexDirection: 'row', width: '94%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }} >
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => props.navigation.navigate("AddWeightScreen")} style={{ width: RFPercentage(18), height: RFPercentage(5.4), borderRadius: RFPercentage(10), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' }} >
                                        <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_500Medium' }} >
                                            Add Entry
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ marginTop: RFPercentage(3), width: '86%', backgroundColor: Colors.white, justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', borderRadius: RFPercentage(2.5) }} >
                                    <ScrollView style={{ flex: 1, width: '100%' }} >

                                        <View style={{ marginTop: RFPercentage(3), width: '90%', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', flexDirection: 'row' }} >
                                            <Text style={{ color: Colors.primary, fontSize: RFPercentage(2.3), fontFamily: 'Montserrat_600SemiBold' }} >
                                                Entries
                                            </Text>
                                        </View>
                                        <View style={{ marginTop: RFPercentage(3), width: '100%', backgroundColor: Colors.grey, height: RFPercentage(0.1) }} />

                                        
                                        {
    mw6.map((item,i)=>{
return(
    <View style={{ marginTop: RFPercentage(3), width: '90%', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', flexDirection: 'row' }} key={i} >
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                                                <TouchableOpacity activeOpacity={0.8} >
                                                    <Feather name="minus-circle" style={{ fontSize: RFPercentage(3.4) }} color={Colors.purple} />
                                                </TouchableOpacity>
                                                <View style={{ marginLeft: RFPercentage(1) }} >
                                                    <Text style={{ color: Colors.primary, fontSize: RFPercentage(2.5), fontFamily: 'Montserrat_500Medium' }} >
                                                        {item.data.bodyweight} Kg
                                                    </Text>
                                                    <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_400Regular' }} >
                                                    
                                                        { item.data.date.toDate().toDateString()}
                                                    </Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity onPress={()=>deleteweight(item.id)} activeOpacity={0.8} style={{ position: 'absolute', right: 0, width: RFPercentage(10), height: RFPercentage(4), backgroundColor: Colors.grey, borderRadius: RFPercentage(20), justifyContent: 'center', alignItems: 'center' }} >
                                                <Text style={{ color: Colors.primary, fontSize: RFPercentage(2) }} >
                                                    Remove
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
)
    })
}



                                        <View style={{ marginTop: RFPercentage(4), width: '100%', backgroundColor: Colors.grey, height: RFPercentage(0.1) }} />


                                    </ScrollView>
                                </View>
                                <View style={{ marginBottom: RFPercentage(12) }} />
                            </View>
                        </ScrollView>
                        :
                        null
                    }
                    
                    {/* year Body */}
                    {recipesButton == '4' ?
                        <ScrollView style={{ flex: 1, width: '100%' }} >
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: RFPercentage(3) }}>

              {/**chart fo current year */}
              
{
                       yw.length>3?                   
            <LineChart
                data={datacy}
                width={screenWidth}
                height={300}
                chartConfig={chartConfig}
                bezier
              />:
              <View style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                  <Text style={{color:Colors.primary}}>Not Enough Record</Text>
              </View>

                   }

{/**chart fo current year end */}
                                <View style={{ marginTop: RFPercentage(3), flexDirection: 'row', width: '94%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }} >
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => props.navigation.navigate("AddWeightScreen")} style={{ width: RFPercentage(18), height: RFPercentage(5.4), borderRadius: RFPercentage(10), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' }} >
                                        <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_500Medium' }} >
                                            Add Entry
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ marginTop: RFPercentage(3), width: '86%', backgroundColor: Colors.white, justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', borderRadius: RFPercentage(2.5) }} >
                                    <ScrollView style={{ flex: 1, width: '100%' }} >

                                        <View style={{ marginTop: RFPercentage(3), width: '90%', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', flexDirection: 'row' }} >
                                            <Text style={{ color: Colors.primary, fontSize: RFPercentage(2.3), fontFamily: 'Montserrat_600SemiBold' }} >
                                                Entries
                                            </Text>
                                        </View>
                                        <View style={{ marginTop: RFPercentage(3), width: '100%', backgroundColor: Colors.grey, height: RFPercentage(0.1) }} />


                                        {
    yw.map((item,i)=>{
return(
    <View style={{ marginTop: RFPercentage(3), width: '90%', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', flexDirection: 'row' }} key={i} >
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                                                <TouchableOpacity activeOpacity={0.8} >
                                                    <Feather name="minus-circle" style={{ fontSize: RFPercentage(3.4) }} color={Colors.purple} />
                                                </TouchableOpacity>
                                                <View style={{ marginLeft: RFPercentage(1) }} >
                                                    <Text style={{ color: Colors.primary, fontSize: RFPercentage(2.5), fontFamily: 'Montserrat_500Medium' }} >
                                                        {item.data.bodyweight} Kg
                                                    </Text>
                                                    <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_400Regular' }} >
                                                    
                                                        { item.data.date.toDate().toDateString()}
                                                    </Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity onPress={()=>deleteweight(item.id)} activeOpacity={0.8} style={{ position: 'absolute', right: 0, width: RFPercentage(10), height: RFPercentage(4), backgroundColor: Colors.grey, borderRadius: RFPercentage(20), justifyContent: 'center', alignItems: 'center' }} >
                                                <Text style={{ color: Colors.primary, fontSize: RFPercentage(2) }} >
                                                    Remove
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
)
    })
}


                                        <View style={{ marginTop: RFPercentage(4), width: '100%', backgroundColor: Colors.grey, height: RFPercentage(0.1) }} />


                                    </ScrollView>
                                </View>
                                <View style={{ marginBottom: RFPercentage(12) }} />
                            </View>
                        </ScrollView>
                        :
                        null
                    }
                    
                    {/* from begning Body */}
                    {recipesButton == '5' ?
                        <ScrollView style={{ flex: 1, width: '100%' }} >
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: RFPercentage(3) }}>

              {/**chart fo fromstart */}
             
              
                      {
                       allw.length>3?                   
            <LineChart
                data={datafb}
                width={screenWidth}
                height={300}
                chartConfig={chartConfig}
                bezier
              />:
              <View style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                  <Text style={{color:Colors.primary}}>Not Enough Record</Text>
              </View>

                   }

{/**chart  fromstart end*/}
                                <View style={{ marginTop: RFPercentage(3), flexDirection: 'row', width: '94%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }} >
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => props.navigation.navigate("AddWeightScreen")} style={{ width: RFPercentage(18), height: RFPercentage(5.4), borderRadius: RFPercentage(10), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' }} >
                                        <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_500Medium' }} >
                                            Add Entry
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ marginTop: RFPercentage(3), width: '86%', backgroundColor: Colors.white, justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', borderRadius: RFPercentage(2.5) }} >
                                    <ScrollView style={{ flex: 1, width: '100%' }} >

                                        <View style={{ marginTop: RFPercentage(3), width: '90%', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', flexDirection: 'row' }} >
                                            <Text style={{ color: Colors.primary, fontSize: RFPercentage(2.3), fontFamily: 'Montserrat_600SemiBold' }} >
                                                Entries
                                            </Text>
                                        </View>
                                        <View style={{ marginTop: RFPercentage(3), width: '100%', backgroundColor: Colors.grey, height: RFPercentage(0.1) }} />

{
    allw.map((item,i)=>{
return(
    <View style={{ marginTop: RFPercentage(3), width: '90%', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', flexDirection: 'row' }} key={i} >
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                                                <TouchableOpacity activeOpacity={0.8} >
                                                    <Feather name="minus-circle" style={{ fontSize: RFPercentage(3.4) }} color={Colors.purple} />
                                                </TouchableOpacity>
                                                <View style={{ marginLeft: RFPercentage(1) }} >
                                                    <Text style={{ color: Colors.primary, fontSize: RFPercentage(2.5), fontFamily: 'Montserrat_500Medium' }} >
                                                        {item.data.bodyweight} Kg
                                                    </Text>
                                                    <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_400Regular' }} >
                                                    
                                                        { item.data.date.toDate().toDateString()}
                                                    </Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity onPress={()=>deleteweight(item.id)} activeOpacity={0.8} style={{ position: 'absolute', right: 0, width: RFPercentage(10), height: RFPercentage(4), backgroundColor: Colors.grey, borderRadius: RFPercentage(20), justifyContent: 'center', alignItems: 'center' }} >
                                                <Text style={{ color: Colors.primary, fontSize: RFPercentage(2) }} >
                                                    Remove
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
)
    })
}

                                        <View style={{ marginTop: RFPercentage(4), width: '100%', backgroundColor: Colors.grey, height: RFPercentage(0.1) }} />


                                    </ScrollView>
                                </View>
                                <View style={{ marginBottom: RFPercentage(12) }} />
                            </View>
                        </ScrollView>
                        :
                        null
                    }
                </>
                :
                null
            }

            {/* If Weight Button is active */}
            {activeButton == '2' ?
                <>
                <ScrollView style={{ flex: 1, width: '100%' }} >
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: RFPercentage(3) }}>

                   {/**chart for mood */}
                   <View style={{display:allm.length===0||allm===undefined?"none":"flex"}}>
                   
                      {
                       allm.length>3?                   
            <LineChart
                data={datamd}
                width={screenWidth}
                height={300}
                chartConfig={chartConfig}
                bezier
              />:
              <View style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                  <Text style={{color:Colors.primary}}>Not Enough Record</Text>
              </View>

                   }

              </View>
{/**chart for mood end */}
                                <View style={{ marginTop: RFPercentage(3), flexDirection: 'row', width: '94%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }} >
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => props.navigation.navigate("AddMoodScreen")} style={{ width: RFPercentage(18), height: RFPercentage(5.4), borderRadius: RFPercentage(10), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' }} >
                                        <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_500Medium' }} >
                                            Add Entry
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ marginTop: RFPercentage(3), width: '86%', backgroundColor: Colors.white, justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', borderRadius: RFPercentage(2.5) }} >
                                    <ScrollView style={{ flex: 1, width: '100%' }} >
                                        <View style={{ marginTop: RFPercentage(3), width: '90%', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', flexDirection: 'row' }} >
                                            <Text style={{ color: Colors.primary, fontSize: RFPercentage(2.3), fontFamily: 'Montserrat_600SemiBold' }} >
                                                Entries
                                            </Text>
                                        </View>
                                        <View style={{ marginTop: RFPercentage(3), width: '100%', backgroundColor: Colors.grey, height: RFPercentage(0.1) }} />
                                        {
    allm.map((item,i)=>{
return(
    <View style={{ marginTop: RFPercentage(3), width: '90%', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', flexDirection: 'row' }} key={i} >
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                                                <TouchableOpacity activeOpacity={0.8} >
                                                    
                                                </TouchableOpacity>
                                                <View style={{ marginLeft: RFPercentage(1) }} >
                                                <Image style={{ width: RFPercentage(4), height: RFPercentage(4) }} source={mimg[item.data.moodvalue]} />
                                                    <Text style={{ color: Colors.primary, fontSize: RFPercentage(2.5), fontFamily: 'Montserrat_500Medium' }} >
                                                        {item.data.mood} 
                                                    </Text>
                                                    <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_400Regular' }} >
                                                        { item.data.date}
                                                    </Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity onPress={()=>deletemood(item.id)} activeOpacity={0.8} style={{ position: 'absolute', right: 0, width: RFPercentage(10), height: RFPercentage(4), backgroundColor: Colors.grey, borderRadius: RFPercentage(20), justifyContent: 'center', alignItems: 'center' }} >
                                                <Text style={{ color: Colors.primary, fontSize: RFPercentage(2) }} >
                                                    Remove
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
)
    })
}


                                        <View style={{ marginTop: RFPercentage(4), width: '100%', backgroundColor: Colors.grey, height: RFPercentage(0.1) }} />


                                    </ScrollView>
                                </View>
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

export default ProgressScreen;