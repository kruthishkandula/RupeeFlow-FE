import { getApp, getApps, initializeApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { Platform } from 'react-native';

let cachedAuth: ReturnType<typeof getAuth> | null = null;

const IOS_FIREBASE_OPTIONS = {
	apiKey: 'AIzaSyDGI-AWoGrm4tmiM0g-pD3oQD6Vy134hdE',
	appId: '1:542523710583:ios:eb04b26021227416ea3a72',
	messagingSenderId: '542523710583',
	projectId: 'rupeeflow-001',
	storageBucket: 'rupeeflow-001.firebasestorage.app',
};

export const getFirebaseAuth = () => {
	if (cachedAuth) {
		return cachedAuth;
	}

	try {
		const app = getApps().length > 0 ? getApps()[0] : getApp();
		cachedAuth = getAuth(app);
		return cachedAuth;
	} catch (firstError) {
		try {
			if (Platform.OS !== 'ios') {
				throw firstError;
			}

			const app = initializeApp(IOS_FIREBASE_OPTIONS);
			cachedAuth = getAuth(app);
			return cachedAuth;
		} catch (secondError) {
			console.error('Firebase initialization failed', secondError || firstError);
			return null;
		}
	}
};
