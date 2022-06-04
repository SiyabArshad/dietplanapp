import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ImageBackground, StyleSheet } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

//components
import Screen from './../components/Screen';

//config
import Colors from '../config/Colors';

function StationComponent({ title, coverSource }) {

    const [play, setPlay] = useState(false)

    return (
        <View style={{ marginTop: RFPercentage(3), width: '100%', alignSelf: 'center', justifyContent: 'center', alignItems: 'flex-start' }} >
            <ImageBackground style={{ alignSelf: 'center', width: RFPercentage(50), height: RFPercentage(11.1), justifyContent: 'center', alignItems: 'center' }} source={coverSource} >
                {/* empty view for background opacity */}
                <View style={{ borderRadius: RFPercentage(2), borderBottomLeftRadius: RFPercentage(2), position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.3)" }} />
                <View style={{ width: '90%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} >
                    <Text style={{ fontFamily: 'Montserrat_500Medium', color: Colors.white, fontSize: RFPercentage(2.2) }} >
                        {title}
                    </Text>
                    <TouchableOpacity activeOpacity={0.8} style={{ position: 'absolute', right: 0 }} >
                        <ImageBackground style={{ justifyContent: 'center', alignItems: 'center', width: RFPercentage(7), height: RFPercentage(7) }} source={require('../../assets/images/pr.png')} >
                            {play ?
                                <TouchableOpacity onPress={() => setPlay(false)} >
                                    <FontAwesome5 name="pause-circle" style={{ fontSize: RFPercentage(5) }} color={Colors.white} />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => setPlay(true)} >
                                    <Feather name="play-circle" style={{ fontSize: RFPercentage(5) }} color={Colors.white} />
                                </TouchableOpacity>
                            }
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
}

export default StationComponent;