import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { MaterialCommunityIcons } from '@expo/vector-icons';

//config
import Colors from '../../config/Colors';

function BottomTab({ props }) {

    return (
        <View style={{ borderColor: Colors.grey, borderWidth: RFPercentage(0.1), borderTopLeftRadius: RFPercentage(3.8), borderTopRightRadius: RFPercentage(3.8), flexDirection: 'row', alignItems: 'center', position: 'absolute', justifyContent: 'center', bottom: 0, width: "100%", height: RFPercentage(10), backgroundColor: Colors.primary }}>
            <View style={{ width: "90%", flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', marginBottom: RFPercentage(0.3) }} >

                <TouchableOpacity onPress={() => props.navigation.navigate("ScheduleScreen")} activeOpacity={0.8} style={{ justifyContent: 'center', alignItems: 'center' }} >
                    <Image style={{ marginTop: RFPercentage(0.8), width: RFPercentage(3.2), height: RFPercentage(3.2) }} source={require('../../../assets/images/home.png')} />
                    <Text style={{ marginTop: RFPercentage(1), color: Colors.secondary, fontSize: RFPercentage(1.6), fontFamily: 'Montserrat_600SemiBold' }} >
                        Home
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => props.navigation.navigate("WorkoutPlanScreen")} activeOpacity={0.8} style={{ justifyContent: 'center', alignItems: 'center' }} >
                    <Image style={{ marginTop: RFPercentage(0.8), width: RFPercentage(5.6), height: RFPercentage(2.6) }} source={require('../../../assets/images/exercise.png')} />
                    <Text style={{ marginTop: RFPercentage(1), color: Colors.secondary, fontSize: RFPercentage(1.6), fontFamily: 'Montserrat_600SemiBold' }} >
                        Exercise
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => props.navigation.navigate("ProgressScreen")} activeOpacity={0.8} style={{ justifyContent: 'center', alignItems: 'center' }} >
                    <MaterialCommunityIcons name="progress-clock" style={{ fontSize: RFPercentage(3.4), top: RFPercentage(0.3) }} color={Colors.white} />
                    <Text style={{ marginTop: RFPercentage(1), color: Colors.secondary, fontSize: RFPercentage(1.6), fontFamily: 'Montserrat_600SemiBold' }} >
                        Progress
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => props.navigation.navigate("MealPlanScreen")} activeOpacity={0.8} style={{ justifyContent: 'center', alignItems: 'center' }} >
                    <MaterialCommunityIcons name="food-fork-drink" style={{ fontSize: RFPercentage(3.4) }} color={Colors.white} />
                    <Text style={{ marginTop: RFPercentage(1), color: Colors.secondary, fontSize: RFPercentage(1.6), fontFamily: 'Montserrat_600SemiBold' }} >
                        Meal Plan
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => props.navigation.navigate("ProfileSettingsScreen")} activeOpacity={0.8} style={{ justifyContent: 'center', alignItems: 'center' }} >
                    <Image style={{ marginTop: RFPercentage(0.8), width: RFPercentage(3.2), height: RFPercentage(3.2) }} source={require('../../../assets/images/profile.png')} />
                    <Text style={{ marginTop: RFPercentage(1), color: Colors.secondary, fontSize: RFPercentage(1.6), fontFamily: 'Montserrat_600SemiBold' }} >
                        Profile
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

export default BottomTab;