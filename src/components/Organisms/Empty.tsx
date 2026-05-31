import React from 'react'
import { Text, View } from 'react-native'
import Icon from '../Icon'
import { nf } from '../AppText'
import useTheme from '@/hooks/useTheme';

export default function Empty() {
    const { colors } = useTheme();

    return (
        <View className='flex-1 flex-col justify-center items-center gap-4' >
            <Icon name={"SearchAlert"} size={nf(78)} color={colors.textPrimary} />
            <Text style={{ fontSize: nf(24), fontWeight: 'bold', textAlign: 'center' }} className="text-textPrimary font-bold" >No Transactions Found</Text>
        </View>
    )
}