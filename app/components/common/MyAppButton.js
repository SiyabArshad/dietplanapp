import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from 'expo-linear-gradient';

function MyAppButton({
    title,
    onPress,
    bold = true,
    borderRadius = RFPercentage(30),
    fontSize = RFPercentage(2.4),
    backgroundColor,
    fontFamily = null,
    width = "100%",
    icon = false,
    color,
    borderWidth = null,
    borderColor = null,
    gradient = false,
}) {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={{ width: width, backgroundColor: backgroundColor }} >
            <LinearGradient colors={gradient ? ['#8B2088', '#5C40AF'] : ["#fff", '#fff']} start={[1, 1]} end={[0.2, 0.3]} style={{ borderRadius: borderRadius, alignSelf: 'center', alignItems: "center", flexDirection: 'row', justifyContent: 'center', width: width, height: RFPercentage(5.5), borderColor: gradient ? null : borderColor, borderWidth: gradient ? null : borderWidth }} >

                {icon == true ?
                    <MaterialCommunityIcons name={iconName} style={{ fontSize: RFPercentage(3), marginRight: RFPercentage(0.5) }} color={iconColor} />
                    :
                    null
                }

                <Text style={{ fontFamily: fontFamily, fontSize: fontSize, color: color, fontWeight: bold ? "bold" : null }} >
                    {title}
                </Text>

            </LinearGradient>
        </TouchableOpacity>
    );
}

export default MyAppButton;