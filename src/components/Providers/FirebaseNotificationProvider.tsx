import messaging from '@react-native-firebase/messaging'
import { useEffect } from 'react'
import { Platform } from 'react-native'
import Toast from 'react-native-toast-message'

export default function FirebaseNotificationProvider() {
    useEffect(() => {
        if (Platform.OS !== 'ios') return

        const requestPermission = async () => {
            const messagingClient = messaging()

            if (!messagingClient.isDeviceRegisteredForRemoteMessages) {
                await messagingClient.registerDeviceForRemoteMessages()
            }

            await messagingClient.requestPermission()
        }

        requestPermission().catch(error => console.log('FCM permission error:', error))
    }, [])

    useEffect(() => {
        if (Platform.OS !== 'ios') return

        const unsubscribe = messaging().onMessage(async remoteMessage => {
            const { title, body } = remoteMessage.notification ?? {}
            if (title || body) {
                Toast.show({
                    type: 'info',
                    text1: title ?? 'RupeeFlow',
                    text2: body,
                })
            }
        })

        return unsubscribe
    }, [])

    return null
}