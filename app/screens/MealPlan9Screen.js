import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ImageBackground, FlatList, Switch, Image } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

//components
import Screen from './../components/Screen';
import InputField from './../components/common/InputField';
import MyAppButton from './../components/common/MyAppButton';
import MealConfigScreenCart from '../components/MealConfigScreenCart';
import BottomTab from './../components/common/BottomTab';

//config
import Colors from '../config/Colors';
import app from "../../firebase"
import {createUserWithEmailAndPassword,getAuth,deleteUser,updateProfile,sendEmailVerification} from "firebase/auth"
import {doc,setDoc,getFirestore, addDoc, serverTimestamp,getDocs,query,collection,where,deleteDoc} from "firebase/firestore"
import LoadingModal from '../components/common/LoadingModal';
import { useIsFocused } from "@react-navigation/native";
function MealPlanScreen(props) {

    const db=getFirestore(app)
    const auth=getAuth(app)
    const isFocused = useIsFocused(); 
    const[wps,setwps]=useState([])
    const[cbm,setcbm]=useState([])
    const[allf,setallf]=useState([])
    const[ff,setff]=useState([])
    const [indicator, showIndicator] = useState(false);
    const[delflag,setdelflag]=useState(false)
    const deleteweight=async(id)=>{
        showIndicator(true)
        setdelflag(false)
    try{
        await deleteDoc(doc(db, "mealplan", id));
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
    const getauthfoods=async()=>{
        showIndicator(true)
        const q = query(collection(db, "foods"), where("userid", "==",auth.currentUser.uid));
        getDocs(q).then((res)=>{
            const quests=res.docs.map(doc=>({
              data:doc.data(),
              id:doc.id
            }))
                setcbm(quests)
              showIndicator(false)
          }).catch((e)=>{
              showIndicator(false)
          })
    }
    const getallfoods=async()=>{
        showIndicator(true)
        //const q = query(collection(db, "foods"), where("userid", "==",auth.currentUser.uid));
        getDocs(collection(db, "foods")).then((res)=>{
            const quests=res.docs.map(doc=>({
              data:doc.data(),
              id:doc.id
            }))
            const q1 = query(collection(db, "users"), where("userid", "==",auth.currentUser.uid));
            getDocs(q1).then((res)=>{
                const quests1=res.docs.map(doc=>({
                  data:doc.data(),
                  id:doc.id
                }))
                 setff( quests.filter((item)=>quests1[0].data.favourites.includes(item.id)))
                 showIndicator(false)
              }).catch((e)=>{
                  showIndicator(false)
              })
                setallf(quests)
                showIndicator(false)
          }).catch((e)=>{
              showIndicator(false)
          })
    }
    const deletemeal=async(id)=>{
        showIndicator(true)
        setdelflag(false)
    try{
        await deleteDoc(doc(db, "foods", id));
        showIndicator(false)
        setdelflag(true)
    }
    catch{
        showIndicator(false)
        alert("tryagain")
    }
    }
    useEffect(()=>{
        if(isFocused)
        {
            getwps()
            getallfoods()
            getauthfoods()
        }
        
    },[isFocused,props,delflag])


 
    const [activeButton, setActiveButton] = useState('1');
    const [recipesButton, setRecipesButton] = useState('1');
    const [glGiButton, setGlGiButton] = useState('1');
    const [heart, setHeart] = useState(false);

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const byMealCartData = [
        {
            title: 'Breakfast',
            imageTitle: 'Lemon Pasta',
            imageSource: require('../../assets/images/bm1.png')
            // onPress:
        },
        {
            title: 'Snacks',
            imageTitle: 'Apple Pie',
            imageSource: require('../../assets/images/bm2.png')
        },
        {
            title: 'Lunch',
            imageTitle: 'Summer Salad',
            imageSource: require('../../assets/images/bm3.png')
        },
        {
            title: 'Dinner',
            imageTitle: 'Bacon and Tomatoes',
            imageSource: require('../../assets/images/bm4.png')
        },
    ]


    const allCartData = [

        {
            id: "0",
            imageSource: require('../../assets/images/all1.png'),
            title: 'Oat Milk Cookies',
            heart: '1'
        },
        {
            id: "1",
            imageSource: require('../../assets/images/all2.png'),
            title: 'Tripple Berry Smoothy',
            heart: '2'

        },
        {
            id: "2",
            imageSource: require('../../assets/images/all3.png'),
            title: 'Vegan Cookies',
            heart: '3'

        },
        {
            id: "3",
            imageSource: require('../../assets/images/all4.png'),
            title: 'Pumpkin Spice Cookies',
            heart: '4'

        },

    ]

    const foodsFavouriteCartData = [

        {
            id: "0",
            imageSource: require('../../assets/images/ff1.png'),
            title: 'Guava',
            heart: '1'
        },
        {
            id: "1",
            imageSource: require('../../assets/images/ff2.png'),
            title: 'Mango',
            heart: '2'

        },
        {
            id: "2",
            imageSource: require('../../assets/images/ff3.png'),
            title: 'Orange',
            heart: '3'

        },
        {
            id: "3",
            imageSource: require('../../assets/images/ff4.png'),
            title: 'Lychee',
            heart: '4'

        },
        {
            id: "4",
            imageSource: require('../../assets/images/ff5.png'),
            title: 'Pumpkin',
            heart: '4'

        },
        {
            id: "5",
            imageSource: require('../../assets/images/ff6.png'),
            title: 'Pomegranate',
            heart: '4'

        },

    ]

    const createdByMeCartData = [

        {
            id: "0",
            imageSource: require('../../assets/images/ff1.png'),
            title: 'Guava',
            heart: '1'
        },
        {
            id: "1",
            imageSource: require('../../assets/images/ff2.png'),
            title: 'Mango',
            heart: '2'

        },
        {
            id: "2",
            imageSource: require('../../assets/images/ff3.png'),
            title: 'Orange',
            heart: '3'

        },
        {
            id: "3",
            imageSource: require('../../assets/images/ff4.png'),
            title: 'Lychee',
            heart: '4'

        },
        {
            id: "4",
            imageSource: require('../../assets/images/ff5.png'),
            title: 'Pumpkin',
            heart: '4'

        },
    ]

    const giData = [
        {
            id: '0',
            leftImageSource: require('../../assets/images/gi1.png'),
            rightImageSource: require('../../assets/images/gi2.png'),
            leftImageTitle: 'Oil',
            rightImageTitle: 'Onion',
            leftGl: 'GL:0',
            rightGl: 'GL:0',
            leftGi: 'Gi:0',
            rightGi: 'Gi:0',
        },
        {
            id: '1',
            leftImageSource: require('../../assets/images/gi3.png'),
            rightImageSource: require('../../assets/images/gi4.png'),
            leftImageTitle: 'Tomato Paste',
            rightImageTitle: 'Garlic Powder',
            leftGl: 'GL:0',
            rightGl: 'GL:0',
            leftGi: 'Gi:0',
            rightGi: 'Gi:0',
        },
        {
            id: '2',
            leftImageSource: require('../../assets/images/gi5.png'),
            rightImageSource: require('../../assets/images/gi6.png'),
            leftImageTitle: 'Black Pepper',
            rightImageTitle: 'Chlli Powder',
            leftGl: 'GL:0',
            rightGl: 'GL:0',
            leftGi: 'Gi:0',
            rightGi: 'Gi:0',
        },

    ]

    const mealPlanConfigurationData = [
        {
            date: '8 AM / 12 PM /6 PM',
            t1: '3 Meals',
            t2: '0 Snacks',
            t3: '2L of Water'
        },
        {
            date: '9 AM / 7 PM /6 PM',
            t1: '3 Meals',
            t2: '0 Snacks',
            t3: '2L of Water'
        },
        {
            date: '2 AM / 11 PM /6 PM',
            t1: 'Breakfast',
            t2: 'Dinner',
            t3: '2L of Water'
        },
        {
            date: '4 AM / 12 PM /6 PM',
            t1: 'Breakfast',
            t2: 'Dinner',
            t3: '2L of Water'
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
        let temp=allf
        let temp1=temp
        if(temp.filter((it)=>it.data.name.includes(tempfeilds[i].value)))
        {
           setallf(temp.filter((it)=>it.data.name.includes(tempfeilds[i].value)))
        }
        else
        {
            setallf(temp1)
        }

    };
    const handleChangecfav = (text, i) => {
        let tempfeilds = [...inputField];
        tempfeilds[i].value = text;
        SetInputField(tempfeilds);
        let temp=ff
        let temp1=temp
        if(temp.filter((it)=>it.data.name.includes(tempfeilds[i].value)))
        {
           setff(temp.filter((it)=>it.data.name.includes(tempfeilds[i].value)))
        }
        else
        {
            setff(temp1)
        }
        
    };
    const handleChangecbyme = (text, i) => {
        let tempfeilds = [...inputField];
        tempfeilds[i].value = text;
        SetInputField(tempfeilds);
        let temp=cbm
        let temp1=temp
        if(temp.filter((it)=>it.data.name.includes(tempfeilds[i].value)))
        {
           setcbm(temp.filter((it)=>it.data.name.includes(tempfeilds[i].value)))
        }
        else
        {
            setcbm(temp1)
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
                <Text style={{ marginTop: RFPercentage(2), color: Colors.primary, fontSize: RFPercentage(3.5), fontFamily: 'Montserrat_700Bold' }} >
                    Meal Plan
                </Text>

                {/* First List */}
                <View style={{ flexDirection: 'row', marginTop: RFPercentage(5), width: '90%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }} >
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setActiveButton('1')} style={{ position: 'absolute', left: 0, justifyContent: 'center', alignItems: 'center' }}  >
                        <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_600SemiBold' }} >
                            Recipes
                        </Text>
                        {activeButton == '1' ?
                            <View style={{ width: RFPercentage(8), height: RFPercentage(0.7), borderRadius: RFPercentage(0.5), backgroundColor: Colors.secondary }} />
                            :
                            null
                        }
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.8} onPress={() => setActiveButton('2')} style={{ marginRight: RFPercentage(1), justifyContent: 'center', alignItems: 'center' }}  >
                        <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_600SemiBold' }} >
                            Meal Plan Configurator
                        </Text>
                        {activeButton == '2' ?
                            <View style={{ width: RFPercentage(20), height: RFPercentage(0.7), borderRadius: RFPercentage(0.5), backgroundColor: Colors.secondary }} />
                            :
                            null
                        }
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.8} onPress={() => setActiveButton('3')} style={{ position: 'absolute', right: 0, justifyContent: 'center', alignItems: 'center' }}  >
                        <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_600SemiBold' }} >
                            GL/GI Table
                        </Text>
                        {activeButton == '3' ?
                            <View style={{ width: RFPercentage(10), height: RFPercentage(0.7), borderRadius: RFPercentage(0.5), backgroundColor: Colors.secondary }} />
                            :
                            null
                        }
                    </TouchableOpacity>
                </View>

                {/* Recipes List */}
                {activeButton == '1' ?

                    <View style={{ flexDirection: 'row', marginTop: RFPercentage(3.5), width: '100%', justifyContent: 'space-evenly', alignItems: 'center', alignSelf: 'center' }} >
                       
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setRecipesButton('2')} style={{ justifyContent: 'center', alignItems: 'center' }}  >
                            <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_600SemiBold' }} >
                                All
                            </Text>
                            {recipesButton == '2' ?
                                <View style={{ width: RFPercentage(4), height: RFPercentage(0.7), borderRadius: RFPercentage(0.5), backgroundColor: Colors.secondary }} />
                                :
                                null
                            }
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.8} onPress={() => setRecipesButton('3')} style={{ justifyContent: 'center', alignItems: 'center' }}  >
                            <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_600SemiBold' }} >
                                Foods Favourite
                            </Text>
                            {recipesButton == '3' ?
                                <View style={{ width: RFPercentage(16), height: RFPercentage(0.7), borderRadius: RFPercentage(0.5), backgroundColor: Colors.secondary }} />
                                :
                                null
                            }
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.8} onPress={() => setRecipesButton('4')} style={{ justifyContent: 'center', alignItems: 'center' }}  >
                            <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_600SemiBold' }} >
                                Created by me
                            </Text>
                            {recipesButton == '4' ?
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


            {/* If Recipes Are active */}
            {activeButton == '1' ?
                <>
                    {/* By Meal Body */}
    

                    {/* All Body */}
                    {recipesButton == '2' ?
                        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: RFPercentage(6) }}>

                            {/* Input field */}
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                {inputField.map((item, i) => (
                                    <View key={i} style={{ marginTop: i == 0 ? RFPercentage(1) : RFPercentage(1.8) }} >
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
                                    data={allf}
                                    contentContainerStyle={{ height: RFPercentage(110) }}
                                    showsVerticalScrollIndicator={false}
                                    numColumns={2}
                                    keyExtractor={allCartData => allCartData.id.toString()}
                                    renderItem={({ item }) =>

                                        <TouchableOpacity activeOpacity={0.8} style={{ marginHorizontal: RFPercentage(1.5), marginVertical: RFPercentage(1.5)  }} onPress={() => props.navigation.navigate("DetailsScreen",{res:item})}  >
                                            <ImageBackground style={{ overflow: 'hidden', width: RFPercentage(22), height: RFPercentage(24), borderRadius: RFPercentage(3) }} source={{uri:item.data.img}} >
                                                {/* Heart and Plus Icon */}
                                                <View style={{ marginTop: RFPercentage(2), width: '96%', justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }} >
                                                    <TouchableOpacity activeOpacity={0.8} style={{ marginLeft: RFPercentage(1.5) }} onPress={() => props.navigation.navigate("AddFoodToMealPlanScreen",{fd:item})}>
                                                        <AntDesign name="pluscircleo" style={{ fontSize: RFPercentage(3.5) }} color={Colors.white} />
                                                    </TouchableOpacity>
                                                </View>
                                                {/* Bottom View of Image */}
                                                <View style={{ position: 'absolute', bottom: 0, width: '100%', height: RFPercentage(6), backgroundColor: Colors.newInputFieldBorder, justifyContent: 'center', alignItems: 'center' }} >
                                                    <View style={{ width: '96%', justifyContent: 'center', alignItems: 'center' }} >
                                                        <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_600SemiBold' }} >
                                                            {item.data.name}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    }
                                />
                            </View>

                            <View style={{ marginBottom: RFPercentage(2) }} />
                        </View>
                        :
                        null
                    }

                    {/* Foods Favourite Body */}
                    {recipesButton == '3' ?
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
                                            handleFeild={(text) => handleChangecfav(text, i)}
                                            value={item.value}
                                            width={"92%"}
                                        />
                                    </View>
                                ))}
                            </View>

                            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }} >
                                <FlatList
                                    data={ff}
                                    contentContainerStyle={{ height: RFPercentage(140) }}
                                    showsVerticalScrollIndicator={false}
                                    numColumns={2}
                                    keyExtractor={foodsFavouriteCartData => foodsFavouriteCartData.id.toString()}
                                    renderItem={({ item }) =>

                                        <TouchableOpacity activeOpacity={0.8} style={{ marginHorizontal: RFPercentage(1.5), marginVertical: RFPercentage(2.2) }} >
                                            <TouchableOpacity activeOpacity={0.8} onPress={() => props.navigation.navigate("DetailsScreen",{res:item})} >
                                                <ImageBackground style={{ overflow: 'hidden', width: RFPercentage(22), height: RFPercentage(24), borderRadius: RFPercentage(3) }} source={{uri:item.data.img}} >
                                                    {/* Heart and Plus Icon */}
                                                    <View style={{ marginTop: RFPercentage(2), width: '96%', justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }} >
                                                        <TouchableOpacity activeOpacity={0.8} style={{ marginLeft: RFPercentage(1.5) }} onPress={() => props.navigation.navigate("AddFoodToMealPlanScreen",{fd:item})}>
                                                            <AntDesign name="pluscircleo" style={{ fontSize: RFPercentage(3.5) }} color={Colors.primary} />
                                                        </TouchableOpacity>
                                                    </View>
                                                    {/* Bottom View of Image */}
                                                    <View style={{ position: 'absolute', bottom: 0, width: '100%', height: RFPercentage(6), backgroundColor: Colors.newInputFieldBorder, justifyContent: 'center', alignItems: 'center' }} >
                                                        <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.9), fontFamily: 'Montserrat_600SemiBold' }} >
                                                            {item.data.name}
                                                        </Text>
                                                    </View>
                                                </ImageBackground>
                                            </TouchableOpacity>
                                        </TouchableOpacity>
                                    }
                                />
                            </View>

                            <View style={{ marginBottom: RFPercentage(6) }} />
                        </View>
                        :
                        null
                    }

                    {/* Created by me Body */}
                    {recipesButton == '4' ?
                        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: RFPercentage(6) }}>

                            <View style={{ marginTop: RFPercentage(14), width: '90%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }} >
                                <TouchableOpacity activeOpacity={0.8} onPress={() => props.navigation.navigate("AddFoodScreen")} style={{ width: RFPercentage(18), height: RFPercentage(4.5), borderRadius: RFPercentage(10), backgroundColor: Colors.secondary, justifyContent: 'center', alignItems: 'center' }} >
                                    <Text style={{ fontSize: RFPercentage(2), color: Colors.primary }} >
                                        Add Food
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity activeOpacity={0.8} onPress={() => props.navigation.navigate("AddRecipesScreen")} style={{ marginLeft: RFPercentage(7), width: RFPercentage(18), height: RFPercentage(4.5), borderRadius: RFPercentage(10), backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' }} >
                                    <Text style={{ fontSize: RFPercentage(2), color: Colors.secondary }} >
                                        Add Recipe
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Input field */}
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                {inputField.map((item, i) => (
                                    <View key={i} style={{ marginTop: i == 0 ? RFPercentage(3) : RFPercentage(1.8) }} >
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
                                            handleFeild={(text) => handleChangecbyme(text, i)}
                                            value={item.value}
                                            width={"92%"}
                                        />
                                    </View>
                                ))}
                            </View>

                            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }} >
                                <FlatList
                                    data={cbm}
                                    contentContainerStyle={{ height: RFPercentage(160) }}
                                    showsVerticalScrollIndicator={false}
                                    numColumns={2}
                                    keyExtractor={createdByMeCartData => createdByMeCartData.id.toString()}
                                    renderItem={({ item }) =>
                                        <TouchableOpacity activeOpacity={0.8} style={{ marginHorizontal: RFPercentage(1.5), marginVertical: RFPercentage(2.2) }} onPress={() => props.navigation.navigate("DetailsScreen",{res:item})}>
                                        <ImageBackground style={{ overflow: 'hidden', width: RFPercentage(22), height: RFPercentage(24), borderRadius: RFPercentage(3) }} source={{uri:item.data.img}} >
                                                {/* Heart and Plus Icon */}
                                                <View style={{ marginTop: RFPercentage(2), width: '96%', justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }} >
                                                    <TouchableOpacity onPress={()=>deletemeal(item.id)} activeOpacity={0.8} style={{ marginLeft: RFPercentage(1), position: 'absolute', left: 0 }}  >
                                                        <Feather name="minus-circle" style={{ fontSize: RFPercentage(3.6) }} color={Colors.primary} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity activeOpacity={0.8} style={{ marginLeft: RFPercentage(1.5) }} onPress={() => props.navigation.navigate("AddFoodToMealPlanScreen",{fd:item})}>
                                                        <AntDesign name="pluscircleo" style={{ fontSize: RFPercentage(3.5) }} color={Colors.purple} />
                                                    </TouchableOpacity>
                                                </View>
                                                {/* Bottom View of Image */}
                                                <View style={{ position: 'absolute', bottom: 0, width: '100%', height: RFPercentage(6), backgroundColor: Colors.newInputFieldBorder, justifyContent: 'center', alignItems: 'center' }} >
                                                    <Text style={{ color: Colors.primary, fontSize: RFPercentage(1.9), fontFamily: 'Montserrat_600SemiBold' }} >
                                                        {item.data.name}
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

                </>
                :
                null
            }

            {/* Meal Plan Cinfiguration Body */}
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
                    {item.data.water&&item.data.water} L
                </Text>
                <Text style={{ marginLeft: RFPercentage(2.2), fontFamily: 'Montserrat_500Medium', color: Colors.primary, fontSize: RFPercentage(2.3) }} >
                    {item.data.mealtime&&item.data.mealtime}
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
                                title="Create Plan"
                                onPress={() => props.navigation.navigate("PersonalizedMealPlanScreen")}
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
                :
                null
            }

            {/* If GL/GI Table is active */}
            {activeButton == '3' ?
                <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    {/* Input field */}
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        {inputField.map((item, i) => (
                            <View key={i} style={{ marginTop: i == 0 ? RFPercentage(1) : RFPercentage(1.8) }} >
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

                    {/* Headings */}
                    <View style={{ marginTop: RFPercentage(2), width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center' }} >
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setGlGiButton('1')} style={{ justifyContent: 'center', alignItems: 'center' }} >
                            <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: RFPercentage(2), color: Colors.primary }} >
                                Glycemic Index
                            </Text>
                            {glGiButton == '1' ?
                                <View style={{ width: RFPercentage(15), height: RFPercentage(0.7), borderRadius: RFPercentage(0.5), backgroundColor: Colors.secondary }} />
                                :
                                null
                            }
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.8} onPress={() => setGlGiButton('2')} style={{ justifyContent: 'center', alignItems: 'center' }} >
                            <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: RFPercentage(2), color: Colors.primary }} >
                                Glycemic Load
                            </Text>
                            {glGiButton == '2' ?
                                <View style={{ width: RFPercentage(15), height: RFPercentage(0.7), borderRadius: RFPercentage(0.5), backgroundColor: Colors.secondary }} />
                                :
                                null
                            }
                        </TouchableOpacity>
                        <Switch
                            trackColor={{ false: "#767577", true: Colors.secondary }}
                            thumbColor={isEnabled ? Colors.primary : "#f4f3f4"}
                            ios_backgroundColor={Colors.grey}
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />
                    </View>

                    {/* Glycemic Index active  */}
                    {glGiButton == '1' ?
                        <View style={{ width: RFPercentage(50), borderRadius: RFPercentage(2), marginTop: RFPercentage(2), height: RFPercentage(46), backgroundColor: Colors.white, justifyContent: 'flex-start', alignItems: 'center' }} >

                            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }} >
                                <FlatList
                                    data={giData}
                                    contentContainerStyle={{ height: RFPercentage(130) }}
                                    showsVerticalScrollIndicator={false}
                                    numColumns={1}
                                    keyExtractor={giData => giData.id.toString()}
                                    renderItem={({ item }) =>

                                        <View style={{ width: RFPercentage(50), justifyContent: 'flex-start', alignItems: 'center', borderBottomColor: Colors.primary, borderBottomWidth: RFPercentage(0.1) }} >
                                            <View style={{ width: '90%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }} >
                                                {/* Left Pic */}
                                                <View style={{ position: 'absolute', left: 0, alignItems: 'center', justifyContent: 'center' }} >
                                                    <TouchableOpacity activeOpacity={0.8} >
                                                        <Image style={{ width: RFPercentage(18), height: RFPercentage(9), borderRadius: RFPercentage(2) }} source={item.leftImageSource} />
                                                    </TouchableOpacity>
                                                    <Text style={{ marginTop: RFPercentage(1), color: Colors.primary, fontSize: RFPercentage(2.6), fontFamily: 'Montserrat_600SemiBold' }} >
                                                        {item.leftImageTitle}
                                                    </Text>
                                                    <Text style={{ marginTop: RFPercentage(1.2), color: Colors.darkGrey, fontSize: RFPercentage(2), fontFamily: 'Montserrat_600SemiBold' }} >
                                                        {item.leftGl}
                                                    </Text>
                                                    <Text style={{ marginTop: RFPercentage(0.5), color: Colors.darkGrey, fontSize: RFPercentage(2), fontFamily: 'Montserrat_600SemiBold' }} >
                                                        {item.leftGi}
                                                    </Text>
                                                </View>
                                                <View style={{ width: RFPercentage(0.1), height: RFPercentage(25), backgroundColor: Colors.primary }} />
                                                {/* Right Pic */}
                                                <View style={{ position: 'absolute', right: RFPercentage(1), alignItems: 'center', justifyContent: 'center' }} >
                                                    <TouchableOpacity activeOpacity={0.8} >
                                                        <Image style={{ width: RFPercentage(18), height: RFPercentage(9), borderRadius: RFPercentage(2) }} source={item.rightImageSource} />
                                                    </TouchableOpacity>
                                                    <Text style={{ marginTop: RFPercentage(1), color: Colors.primary, fontSize: RFPercentage(2.6), fontFamily: 'Montserrat_600SemiBold' }} >
                                                        {item.rightImageTitle}
                                                    </Text>
                                                    <Text style={{ marginTop: RFPercentage(1.2), color: Colors.darkGrey, fontSize: RFPercentage(2), fontFamily: 'Montserrat_600SemiBold' }} >
                                                        {item.rightGl}
                                                    </Text>
                                                    <Text style={{ marginTop: RFPercentage(0.5), color: Colors.darkGrey, fontSize: RFPercentage(2), fontFamily: 'Montserrat_600SemiBold' }} >
                                                        {item.rightGi}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    }
                                />
                            </View>
                        </View>
                        :
                        null
                    }

                    {glGiButton == '2' ?
                        <Text>
                            Hello
                        </Text>
                        :
                        null
                    }
                </View>
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

export default MealPlanScreen;