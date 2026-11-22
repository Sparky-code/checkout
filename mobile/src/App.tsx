import React, { useState } from 'react'
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'

import { BasicSplit } from './components/BasicSplit/BasicSplit'
import { theme } from './styles/theme'
import { SplitResult } from './types/checkout'

export default function App() {
  const [splitResult, setSplitResult] = useState<SplitResult | null>(null)

  const handleShowResult = (result: SplitResult) => {
    setSplitResult(result)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Bill Splitter</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <BasicSplit onShowResult={handleShowResult} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84
      },
      android: {
        elevation: 5
      }
    })
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text.primary
  },
  content: {
    flex: 1,
    backgroundColor: theme.colors.background
  }
})
