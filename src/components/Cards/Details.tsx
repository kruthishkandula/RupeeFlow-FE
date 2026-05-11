import React from 'react'
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'

type DetailsType = { 
    topData: Record<string, any>, 
    bottomData: Record<string, any> 
    mainContainerStyle?: ViewStyle
    bottomContainerStyle?: ViewStyle
    topTextStyle?: TextStyle
    bottomTextStyle?: TextStyle
}

export default function Details({ topData, bottomData, mainContainerStyle, bottomContainerStyle, topTextStyle, bottomTextStyle }: Readonly<DetailsType>) {
    return (
        <View style={[styles.containerStyle, mainContainerStyle]}>
            <View style={{ marginBottom: 16, gap: 12 }} >
                {
                    Object.keys(topData).map((key, index) => {
                        return (
                            <View key={`${key}-${index}`} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={[styles.topTextStyle, topTextStyle]}>{key}</Text>
                                <Text style={[styles.topTextStyle, topTextStyle]}>{topData[key]}</Text>
                            </View>
                        )
                    })
                }
            </View>
            <View style={[{ backgroundColor: '#F2F2F2', padding: 16, borderRadius: 10, gap: 12 }, bottomContainerStyle]}  >
                {
                    Object.keys(bottomData).map((key, index) => {
                        return (
                            <View key={`${key}-${index}`} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={[styles.bottomTextStyle, bottomTextStyle]}>{key}</Text>
                                <Text style={[styles.bottomTextStyle, bottomTextStyle]}>{bottomData[key]}</Text>
                            </View>
                        )
                    })
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    containerStyle: {
        paddingHorizontal: 20,
        paddingVertical: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    bottomTextStyle: {
        fontSize: 18,
        fontWeight: '600',
    },
    topTextStyle: {
        color: '#000000',
        fontSize: 14,
    }
})