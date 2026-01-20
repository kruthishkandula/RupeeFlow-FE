import SafeAreaContainer from '@/components/SafeAreaContainer'
import React from 'react'
import MainBG from '../../components/Backgrounds/MainBG'
import DynamicHeader from '../../components/Header/DynamicHeader'

export default function Wallet() {
  return (
    <MainBG>
      <SafeAreaContainer className='mt-8'>
        <DynamicHeader title='Wallet' />
      </SafeAreaContainer>
    </MainBG>
  )
}