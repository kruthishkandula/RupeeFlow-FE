import { getApp, getApps } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';

let cachedAuth: ReturnType<typeof getAuth> | null = null;

export const getFirebaseAuth = () => {
	if (cachedAuth) {
		return cachedAuth;
	}

	try {
		const app = getApps().length > 0 ? getApps()[0] : getApp();
		cachedAuth = getAuth(app);
		return cachedAuth;
	} catch (error) {
		console.error('Firebase initialization failed', error);
		return null;
	}
};
