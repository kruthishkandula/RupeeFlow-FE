import AppText, { nf } from '@/components/AppText'
import MainBG from '@/components/Backgrounds/MainBG'
import DynamicHeader from '@/components/Header/DynamicHeader'
import Icon from '@/components/Icon'
import SafeAreaContainer from '@/components/SafeAreaContainer'
import { CONTACT, FAQS } from '@/fixtures/cmsdata'
import useTheme from '@/hooks/useTheme'
import React, { useState } from 'react'
import { Linking, ScrollView, TouchableOpacity, View } from 'react-native'


function FAQItem({ q, a, colors, isDark, open, onToggle }: Readonly<{ q: string; a: string; colors: any; isDark: boolean; open: boolean; onToggle: () => void }>) {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onToggle}
            style={{
                paddingHorizontal: 20, paddingVertical: 16,
                borderBottomWidth: 1, borderBottomColor: isDark ? '#2a2a2a' : '#F5F5F5',
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{
                    width: 28, height: 28, borderRadius: 8,
                    backgroundColor: `${colors?.primary}18`, alignItems: 'center', justifyContent: 'center',
                }}>
                    <Icon name={open ? 'Minus' : 'Plus'} size={14} color={colors?.primary} />
                </View>
                <AppText style={{ flex: 1, color: colors.textPrimary, fontSize: nf(14), fontWeight: '600', lineHeight: nf(20) }}>{q}</AppText>
            </View>
            {open && (
                <AppText style={{
                    color: colors.textSecondary, fontSize: nf(13), lineHeight: nf(20),
                    marginTop: 10, marginLeft: 40,
                }}>{a}</AppText>
            )}
        </TouchableOpacity>
    )
}

export default function Help() {
    const { colors, isDark } = useTheme()
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    return (
        <MainBG>
            <SafeAreaContainer className='flex-1'>
                <DynamicHeader title='Help & Support' />
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                    {/* Hero */}
                    <View style={{
                        margin: 16, borderRadius: 24, padding: 24,
                        backgroundColor: colors?.primary, alignItems: 'center',
                    }}>
                        <View style={{
                            width: 60, height: 60, borderRadius: 30,
                            backgroundColor: `${colors?.primary}33`,
                            alignItems: 'center', justifyContent: 'center', marginBottom: 12,
                        }}>
                            <Icon name='Headphones' size={28} color='#fff' />
                        </View>
                        <AppText style={{ color: '#fff', fontSize: nf(18), fontWeight: '800' }}>How can we help?</AppText>
                        <AppText style={{ color: 'rgba(255,255,255,0.75)', fontSize: nf(13), marginTop: 6, textAlign: 'center' }}>
                            Browse FAQs or reach out to our support team
                        </AppText>
                    </View>

                    {/* FAQs */}
                    <View style={{
                        marginHorizontal: 16, borderRadius: 24,
                        backgroundColor: colors.surfaceBase, overflow: 'hidden', marginBottom: 16,
                    }}>
                        <AppText style={{
                            color: colors.textSecondary, fontSize: nf(11), fontWeight: '700',
                            letterSpacing: 1, paddingHorizontal: 20, paddingTop: 18, paddingBottom: 4,
                            textTransform: 'uppercase',
                        }}>Frequently Asked Questions</AppText>
                        {FAQS.map((item, i) => (
                            <FAQItem key={`${i}-${item.q}`} q={item.q} a={item.a} colors={colors} isDark={isDark} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
                        ))}
                    </View>

                    {/* Contact */}
                    <View style={{
                        marginHorizontal: 16, borderRadius: 24,
                        backgroundColor: colors.surfaceBase, overflow: 'hidden', marginBottom: 16,
                    }}>
                        <AppText style={{
                            color: colors.textSecondary, fontSize: nf(11), fontWeight: '700',
                            letterSpacing: 1, paddingHorizontal: 20, paddingTop: 18, paddingBottom: 4,
                            textTransform: 'uppercase',
                        }}>Contact Us</AppText>
                        {CONTACT.map((c, i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => Linking.openURL(c.url)}
                                activeOpacity={0.7}
                                style={{
                                    flexDirection: 'row', alignItems: 'center', gap: 14,
                                    paddingHorizontal: 20, paddingVertical: 16,
                                    borderTopWidth: i === 0 ? 0 : 1,
                                    borderTopColor: isDark ? '#2a2a2a' : '#F5F5F5',
                                }}>
                                <View style={{
                                    width: 40, height: 40, borderRadius: 12,
                                    backgroundColor: `${c.color}18`, alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Icon name={c.icon} size={19} color={c.color} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <AppText style={{ color: colors.textPrimary, fontSize: nf(14), fontWeight: '600' }}>{c.label}</AppText>
                                    <AppText style={{ color: colors.textSecondary, fontSize: nf(12), marginTop: 2 }}>{c.value}</AppText>
                                </View>
                                <Icon name='ChevronRight' size={16} color={colors.textSecondary} />
                            </TouchableOpacity>
                        ))}
                    </View>

                </ScrollView>
            </SafeAreaContainer>
        </MainBG>
    )
}
