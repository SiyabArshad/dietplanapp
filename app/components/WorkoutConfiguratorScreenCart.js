import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';

//config
import Colors from '../config/Colors';
import app from "../../firebase"
import {createUserWithEmailAndPassword,getAuth,deleteUser,updateProfile,sendEmailVerification} from "firebase/auth"
import {doc,setDoc,getFirestore, addDoc, serverTimestamp,getDocs,query,collection,where,deleteDoc} from "firebase/firestore"
import LoadingModal from '../components/common/LoadingModal';
import { useIsFocused } from "@react-navigation/native";

function WorkoutConfiguratorScreenCart({ t1, t2, t3,idpw }) {
    const db=getFirestore(app)
    const auth=getAuth(app)
    const isFocused = useIsFocused(); 
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
    return (

        <View style={{ marginTop: RFPercentage(2), width: '90%', height: RFPercentage(18), justifyContent: 'flex-start', alignItems: 'flex-start', backgroundColor:  Colors.white, borderRadius: RFPercentage(2.2) }} >
            <View style={{ marginTop: RFPercentage(2), marginLeft: RFPercentage(3), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                <Ionicons name="md-time-outline" style={{ fontSize: RFPercentage(3.3) }} color={ Colors.primary} />
                <Text style={{ marginLeft: RFPercentage(2), fontFamily: 'Montserrat_600SemiBold', color: Colors.primary, fontSize: RFPercentage(2.5) }} >
                    {t1}
                </Text>
            </View>
            <View style={{ marginTop: RFPercentage(2), marginLeft: RFPercentage(2), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                <Text style={{ marginLeft: RFPercentage(2), fontFamily: 'Montserrat_500Medium', color:  Colors.primary, fontSize: RFPercentage(1.7) }} >
                    {t2}
                </Text>
                <Text style={{ marginLeft: RFPercentage(2.2), fontFamily: 'Montserrat_500Medium', color: Colors.primary, fontSize: RFPercentage(2.3) }} >
                    {t3}
                </Text>
            </View>
                <TouchableOpacity activeOpacity={0.8} onPress={() =>deleteweight(idpw)} style={{ width: RFPercentage(14), height: RFPercentage(4.2), borderRadius: RFPercentage(20), backgroundColor: Colors.grey, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: RFPercentage(2), right: RFPercentage(2) }} >
                    <Text style={{ color: Colors.darkGrey2, fontSize: RFPercentage(1.8), fontFamily: 'Montserrat_400Regular' }} >
                       Delete
                    </Text>
                </TouchableOpacity>

        </View>


    );
}

export default WorkoutConfiguratorScreenCart;