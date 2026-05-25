import { Images } from '@/assets/images';
import Button from '@/components/Button';
import useTheme from '@/hooks/useTheme';
import { createItem } from '@/utility/storage';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const slides = [
    {
        key: '1',
        title: 'Track Every Rupee Effortlessly',
        description:
            'Stay in control of your daily finances by recording every income and expense in seconds. RupeeFlow helps you organize transactions, monitor cash flow, and keep your spending history always accessible.',
        image: Images.Splash1,
    },
    {
        key: '2',
        title: 'Understand Your Spending Habits',
        description:
            'Turn your financial data into simple visual insights. Explore charts, category breakdowns, and spending trends to clearly see where your money goes and make smarter financial decisions.',
        image: Images.Splash2,
    },
    {
        key: '3',
        title: 'Set Budgets & Achieve Goals',
        description:
            'Create personalized budgets for every category and track your progress in real time. Get alerts before overspending and build healthier money habits with confidence.',
        image: Images.Splash3,
    },
];

type Props = {
    onFinish?: () => void;
};

export default function Onboarding({ onFinish }: Readonly<Props>) {
    const [index, setIndex] = useState(0);
    const listRef = useRef<FlatList>(null);
    const { colors } = useTheme();

    const handleNext = async () => {
        if (index < slides.length - 1) {
            const next = index + 1;
            listRef.current?.scrollToIndex({ index: next });
            setIndex(next);
            return;
        }

        try {
            await createItem('onboardingSeen', 'true');
        } catch (e) {
            console.log('e', e)
        }
        onFinish?.();
    };

    const renderItem = ({ item }: { item: typeof slides[0] }) => (
        <View style={[styles.slide, { width, backgroundColor: colors.surfaceBase }]}>
            <View style={styles.imageWrap}>
                <Image source={item.image} style={styles.image} />
            </View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{item.title}</Text>
            <Text style={[styles.desc, { color: colors.textSecondary }]}>{item.description}</Text>
        </View>
    );

    const handleSkip = async () => {
        try {
            await createItem('onboardingSeen', 'true');
        } catch (e) {
            console.log('e---', e)
        }
        onFinish?.();
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                ref={listRef}
                data={slides}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
                keyExtractor={(i) => i.key}
                onMomentumScrollEnd={(ev) => {
                    const idx = Math.round(ev.nativeEvent.contentOffset.x / width);
                    setIndex(idx);
                }}
            />

            <View style={styles.footer}>
                <View style={styles.dots}>
                    {slides.map((_, i) => (
                        <View
                            key={`${_?.key}-dot`}
                            style={[
                                styles.dot,
                                i === index && { backgroundColor: colors.primary, width: 18, borderRadius: 9 },
                            ]}
                        />
                    ))}
                </View>

                <View style={{ width: '100%', paddingHorizontal: 24 }}>
                    <Button variant='primary' className='rounded-3xl' title={index === slides.length - 1 ? 'Get Started' : 'Next'} onPress={handleNext} />
                    {(index === slides.length - 1) ?
                        <Button title="" variant='tertiary' textClassName='text-textPrimary' />
                        : <Button title="Skip" variant='tertiary' textClassName='text-textPrimary' onPress={handleSkip} />}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    slide: { alignItems: 'center', padding: 24, justifyContent: 'center' },
    imageWrap: { width: '80%', height: 260, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
    image: { width: '100%', height: '100%', resizeMode: 'contain' },
    title: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
    desc: { fontSize: 14, textAlign: 'center', paddingHorizontal: 8, lineHeight: 20 },
    footer: { padding: 24, borderTopWidth: 0, alignItems: 'center' },
    dots: { flexDirection: 'row', marginBottom: 12 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D1D5DB', marginHorizontal: 6 },
    button: { paddingVertical: 12, paddingHorizontal: 36, borderRadius: 24 },
    buttonText: { color: '#fff', fontWeight: '700' },
    skip: { marginTop: 12 },
    skipText: { fontSize: 14 },
});
