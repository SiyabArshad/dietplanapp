import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ImageBackground, FlatList, Switch, Image } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

//config
import Colors from '../config/Colors';

function ScheduleScreenTodayComponent({ time, Title, subTitle,btnstate }) {
    const [cartColor, setCartColor] = useState(btnstate);
    return (
        <View style={{ marginTop: RFPercentage(2), alignSelf: 'center', width: '90%', height: RFPercentage(14), backgroundColor: btnstate ? Colors.secondary : Colors.white, borderRadius: RFPercentage(3), justifyContent: 'center', alignItems: 'center' }} >
            <View style={{ position: 'absolute', left: RFPercentage(2) }} >
                <Ionicons name="time-outline" style={{ fontSize: RFPercentage(2.6) }} color={Colors.primary} />
                <Text style={{ marginTop: RFPercentage(1), color: Colors.primary, fontSize: RFPercentage(1.7), fontFamily: 'Montserrat_400Regular' }} >
                    {time}{time.split(":")[0]>12?" Pm":" Am"}
                </Text>
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'flex-start', marginLeft: RFPercentage(3) }} >
                <Text style={{ color: Colors.primary, fontSize: RFPercentage(2.4), fontFamily: 'Montserrat_600SemiBold' }} >
                    {Title}
                </Text>
                <Text style={{ marginTop: RFPercentage(1), color: Colors.primary, fontSize: RFPercentage(1.7), fontFamily: 'Montserrat_400Regular' }} >
                    {subTitle}
                </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'absolute', right: RFPercentage(1), top: RFPercentage(2) }} >
                <TouchableOpacity activeOpacity={0.8} >
                    <Feather name="plus-circle" style={{ fontSize: RFPercentage(2.8) }} color={Colors.primary} />
                </TouchableOpacity>

                {btnstate ?
                    <TouchableOpacity activeOpacity={0.8} >
                        <AntDesign name="checkcircle" style={{ fontSize: RFPercentage(2.8), marginLeft: RFPercentage(1) }} color={Colors.black} />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity activeOpacity={0.8}>
                        <AntDesign name="checkcircle" style={{ fontSize: RFPercentage(2.8), marginLeft: RFPercentage(1) }} color={Colors.primary} />
                    </TouchableOpacity>
                }

            </View>
        </View>
    );
}

export default ScheduleScreenTodayComponent;