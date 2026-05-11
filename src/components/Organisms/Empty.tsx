import { Images } from '@/assets/images'
import React from 'react'
import { Image, View } from 'react-native'

export default function Empty() {
    let empty = Images['Empty'];

    return (
        <View className='flex-1 flex-col justify-center items-center gap-4' >
            <Image source={empty} style={{ width: 250, height: 250 }} />
        </View>
    )
}