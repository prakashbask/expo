import TouchableNativeFeedback from '@expo/react-native-touchable-native-feedback-safe';
import * as React from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Colors from '../constants/Colors';

type TouchableNativeFeedbackProps = React.ComponentProps<typeof TouchableNativeFeedback>['style'];
// eslint-disable-next-line no-unused-vars
export default function PrimaryButton({
  children,
  isLoading,
  plain,
  style,
  ...props
}: TouchableNativeFeedbackProps & {
  children: any;
  isLoading?: boolean;
  plain?: boolean;
}) {
  return (
    <TouchableNativeFeedback
      fallback={TouchableOpacity}
      {...props}
      activeOpacity={isLoading ? 1 : 0.5}
      style={[plain ? styles.plainButton : styles.button, style]}>
      <Text style={plain ? styles.plainButtonText : styles.buttonText}>{children}</Text>

      {isLoading && (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator color="#fff" />
        </View>
      )}
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    position: 'absolute',
    top: 0,
    right: 15,
    bottom: 0,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: Colors.light.tintColor,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    lineHeight: 20,
    ...Platform.select({
      android: {
        fontSize: 16,
      },
      ios: {
        fontSize: 15,
        fontWeight: '600',
      },
    }),
  },
  plainButton: {},
  plainButtonText: {
    color: Colors.light.tintColor,
    textAlign: 'center',
    ...Platform.select({
      android: {
        fontSize: 16,
      },
      ios: {
        fontSize: 15,
      },
    }),
  },
});
