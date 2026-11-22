import React, { useState } from 'react'
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { theme } from '../../styles/theme'

import { ButtonProps } from './types'

export function createButtonComponent() {
  const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    disabled = false,
    loading = false,
    style,
    textStyle,
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole = 'button',
    testID
  }) => {
    const [error, setError] = useState<string | null>(null)

    // Move styles inside component to defer creation until Platform mock is in place
    const styles = StyleSheet.create({
      button: {
        padding: theme.spacing.medium,
        borderRadius: theme.borderRadius.medium,
        backgroundColor: theme.colors.primary,
        ...Platform.select({
          ios: {
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84
          },
          android: {
            elevation: 5
          },
          web: {
            // Web-specific styles are applied via className in a separate style object
          }
        })
      },
      content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      },
      text: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.button.fontSize,
        fontWeight: theme.typography.button.fontWeight,
        textAlign: 'center'
      },
      disabled: {
        opacity: 0.5
      },
      disabledText: {
        color: theme.colors.text.disabled
      },
      // Web-specific styles
      webDisabled: Platform.select({
        web: {
          cursor: 'not-allowed'
        } as any
      })
    })

    const handlePress = () => {
      try {
        onPress()
      } catch (error) {
        if (error) {
          // Optionally log or handle the error
        }
      }
    }

    const getAccessibilityLabel = () => {
      if (loading) {
        return `${accessibilityLabel} (Loading)`
      }
      return accessibilityLabel
    }

    return (
      <>
        <TouchableOpacity
          onPress={handlePress}
          disabled={disabled || loading}
          style={[
            styles.button,
            disabled && styles.disabled,
            Platform.OS === 'web' && disabled && styles.webDisabled,
            style
          ]}
          accessibilityLabel={getAccessibilityLabel()}
          accessibilityHint={accessibilityHint}
          accessibilityRole={accessibilityRole}
          accessibilityState={{ disabled: disabled || loading }}
          testID={testID}
        >
          <View style={styles.content}>
            {loading ? (
              <ActivityIndicator color={theme.colors.text.primary} testID="button-loading" />
            ) : (
              <Text style={[styles.text, disabled && styles.disabledText, textStyle]}>{title}</Text>
            )}
          </View>
        </TouchableOpacity>
        {error && <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text>}
      </>
    )
  }

  return Button
}

export const Button = createButtonComponent()
