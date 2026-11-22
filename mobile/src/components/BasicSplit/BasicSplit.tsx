import React, { useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native'

import { SplitResult } from '../../types/checkout'
import { calculateBasicSplit, formatCurrency, validateBillData } from '../../utils/checkoutUtils'
import { Button } from '../Button/Button'

interface BasicSplitProps {
  onShowResult?: (result: SplitResult) => void
}

export function BasicSplit({ onShowResult }: BasicSplitProps) {
  const [title, setTitle] = useState('')
  const [total, setTotal] = useState('')
  const [people, setPeople] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState<SplitResult | null>(null)

  const handleCheckout = () => {
    const validation = validateBillData(total, people)

    if (!validation.isValid) {
      Alert.alert('Validation Error', validation.errors.join('\n'))
      return
    }

    const totalNum = parseFloat(total)
    const peopleNum = parseInt(people, 10)
    const splitResult = calculateBasicSplit(totalNum, peopleNum)

    setResult(splitResult)
    setShowResult(true)
    onShowResult?.(splitResult)
  }

  const handleReset = () => {
    setTitle('')
    setTotal('')
    setPeople('')
    setShowResult(false)
    setResult(null)
  }

  return (
    <View style={styles.container}>
      {/* Title Input */}
      <View style={styles.titleContainer}>
        <TextInput
          style={[styles.titleInput, !title && styles.placeholderText]}
          value={title}
          onChangeText={setTitle}
          placeholder="Name of bill"
          placeholderTextColor="#999"
        />
      </View>

      {/* Total Bill Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Total Bill ($)</Text>
        <TextInput
          style={styles.input}
          value={total}
          onChangeText={setTotal}
          placeholder="0.00"
          keyboardType="numeric"
          placeholderTextColor="#999"
        />
      </View>

      {/* Number of People Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Number of People</Text>
        <TextInput
          style={styles.input}
          value={people}
          onChangeText={setPeople}
          placeholder="2"
          keyboardType="numeric"
          placeholderTextColor="#999"
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Checkout"
          onPress={handleCheckout}
          accessibilityLabel="Calculate bill split"
          style={styles.checkoutButton}
        />

        {showResult && (
          <Button
            title="Reset"
            onPress={handleReset}
            accessibilityLabel="Reset form"
            style={styles.resetButton}
          />
        )}
      </View>

      {/* Results */}
      {showResult && result && (
        <View style={styles.resultContainer}>
          <View style={styles.divider} />
          <Text style={styles.resultText}>
            Each person pays: {formatCurrency(result.perPerson)}
          </Text>
          {result.remainder && result.remainder > 0 && (
            <Text style={styles.remainderText}>Remainder: {formatCurrency(result.remainder)}</Text>
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  titleContainer: {
    marginBottom: 24
  },
  titleInput: {
    fontSize: 22,
    fontWeight: '600',
    borderBottomWidth: 2,
    borderBottomColor: '#bbb',
    paddingVertical: 8,
    color: '#333'
  },
  placeholderText: {
    opacity: 0.75
  },
  inputContainer: {
    marginBottom: 16
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff'
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12
  },
  checkoutButton: {
    backgroundColor: '#007AFF'
  },
  resetButton: {
    backgroundColor: '#FF3B30'
  },
  resultContainer: {
    marginTop: 24,
    alignItems: 'center'
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
    marginBottom: 16
  },
  resultText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center'
  },
  remainderText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center'
  }
})
