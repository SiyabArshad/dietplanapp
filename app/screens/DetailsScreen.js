import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

//components
import Screen from './../components/Screen';
import BottomTab from '../components/common/BottomTab';

//config
import Colors from '../config/Colors';
import { async } from '@firebase/util';
import app from "../../firebase"
import {createUserWithEmailAndPassword,getAuth,deleteUser,updateProfile,sendEmailVerification} from "firebase/auth"
import {doc,setDoc,getFirestore, addDoc, serverTimestamp,getDocs,query,collection,where,deleteDoc,updateDoc} from "firebase/firestore"
import LoadingModal from '../components/common/LoadingModal';
import { useIsFocused } from "@react-navigation/native";
function DetailsScreen(props) {
    const dat=props.route.params.res
    const db=getFirestore(app)
    const auth=getAuth(app)
    const isFocused = useIsFocused();
    const [heart, setHeart] = useState(false);
    const [indicator, showIndicator] = useState(false);

    const addtofav=async()=>{
setHeart(true)
showIndicator(true)
        const q = query(collection(db, "users"), where("userid", "==",auth.currentUser.uid));
        getDocs(q).then((res)=>{
            const quests=res.docs.map(doc=>({
              data:doc.data(),
              id:doc.id
            }))
                let favs=quests[0].data.favourites
                favs.push(dat.id)
                const upDocRef = doc(db, "users", auth.currentUser.uid);
                updateDoc(upDocRef,{favourites:favs}).then(()=>{
                    showIndicator(false)
                }).catch(()=>{
                    showIndicator(false)
                    setHeart(false)
                })    
              
          }).catch((e)=>{

              showIndicator(false)
              setHeart(false)
            })

}

const removefromfav=async()=>{
    setHeart(false)
    showIndicator(true)
            const q = query(collection(db, "users"), where("userid", "==",auth.currentUser.uid));
            getDocs(q).then((res)=>{
                const quests=res.docs.map(doc=>({
                  data:doc.data(),
                  id:doc.id
                }))
                    let favs=quests[0].data.favourites.filter((it)=>it!=dat.id)
                    const upDocRef = doc(db, "users", auth.currentUser.uid);
                    updateDoc(upDocRef,{favourites:favs}).then(()=>{
                        setHeart(false)
                        showIndicator(false)
                    }).catch(()=>{
                        showIndicator(false)
                        setHeart(true)
                    })    
                  
              }).catch((e)=>{
    
                  showIndicator(false)
                  setHeart(true)
                })
    
    }
const checkstatus=async()=>{
    showIndicator(true)
    const q = query(collection(db, "users"), where("userid", "==",auth.currentUser.uid));
    getDocs(q).then((res)=>{
        const quests=res.docs.map(doc=>({
          data:doc.data(),
          id:doc.id
        }))
           const inc= quests[0].data.favourites.includes(dat.id)
           if(inc)
           {
               setHeart(true)
               showIndicator(false)
               return
           }
           showIndicator(false)
          
      }).catch((e)=>{
          showIndicator(false)
      })
}
useEffect(()=>{
checkstatus()
},[props.route.params.res])
    return (
        <Screen style={{ flex: 1, justifyContent: 'flex-start', alignItems: "center", backgroundColor: Colors.newGrey }}>
<LoadingModal show={indicator}></LoadingModal>
            {/* Nav */}
            <ImageBackground style={{ justifyContent: 'flex-start', alignItems: 'center', width: '100%', height: RFPercentage(31.6) }} source={require('../../assets/images/top.png')} >
                <View style={{ marginTop: RFPercentage(5), width: '84%', justifyContent: 'center', alignItems: 'flex-start' }} >
                    <TouchableOpacity onPress={()=>props.navigation.navigate("MealPlanScreen")}  activeOpacity={0.8} style={{ width: RFPercentage(5), height: RFPercentage(5), borderRadius: RFPercentage(30), backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' }} >
                        <Ionicons name="chevron-back" style={{ fontSize: RFPercentage(3.4) }} color={Colors.black} />
                    </TouchableOpacity>
                    <View style={{ position: 'absolute', right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >

                        {heart ?
                            <TouchableOpacity activeOpacity={0.8} onPress={() => removefromfav()} >
                                <AntDesign name="heart" style={{ fontSize: RFPercentage(3.5) }} color={Colors.red} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity activeOpacity={0.8} onPress={() => addtofav()}   >
                                <AntDesign name="heart" style={{ fontSize: RFPercentage(3.5) }} color={"rgba(139, 32, 136, 0.24)"} />
                            </TouchableOpacity>
                        }
                        <TouchableOpacity activeOpacity={0.8} onPress={() => props.navigation.navigate("AddFoodToMealPlanScreen",{fd:dat})}>
                            <AntDesign name="pluscircleo" style={{ marginLeft: RFPercentage(3), fontSize: RFPercentage(3.5) }} color={Colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={{ marginTop: RFPercentage(6), color: Colors.primary, fontSize: RFPercentage(3.9), fontFamily: 'Montserrat_700Bold' }} >
                    {dat.data.name}
                </Text>
            </ImageBackground>

            <View style={{ marginTop: RFPercentage(5), width: '100%', justifyContent: 'flex-end', alignItems: 'flex-start', flexDirection: 'row', alignSelf: 'center' }} >
                <View style={{ marginTop: RFPercentage(4), position: 'absolute', width: '50%', justifyContent: 'center', alignItems: 'flex-start', left: RFPercentage(3) }} >
                    <Text style={{ color: Colors.primary, fontSize: RFPercentage(2.6), fontFamily: 'Montserrat_600SemiBold' }} >
                        Ingredients
                    </Text>

                    <Text style={{ marginTop: RFPercentage(2), color: Colors.primary, fontSize: RFPercentage(1.9), fontFamily: 'Montserrat_400Regular' }} >
                    {dat.data.ings!=""?dat.data.ings:"Unknown"}
                    </Text>
                </View>
                <Image  style={{ width: RFPercentage(20), height: RFPercentage(27.6) }} source={{uri:dat.data.img}} />
            </View>

            <View style={{ marginTop: RFPercentage(3), width: '90%', justifyContent: 'center', alignItems: 'flex-start' }} >
                <Text style={{ color: Colors.primary, fontSize: RFPercentage(2.6), fontFamily: 'Montserrat_600SemiBold' }} >
                    Preparation
                </Text>
                <View style={{ width: '90%', justifyContent: 'center', alignItems: 'center' }} >
                    <Text style={{ marginTop: RFPercentage(2), color: Colors.primary, fontSize: RFPercentage(1.9), fontFamily: 'Montserrat_400Regular' }} >
                        {dat.data.prepare!=""?dat.data.prepare:"Unknown"}
                    </Text>
                </View>
            </View>

            <BottomTab props={props} />
        </Screen>
    );
}

export default DetailsScreen;