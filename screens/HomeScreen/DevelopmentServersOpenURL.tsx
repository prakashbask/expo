import { borderRadius, spacing } from '@expo/styleguide-native';
import {
  Button,
  ChevronRightIcon,
  Divider,
  Row,
  Spacer,
  Text,
  TextInput,
  useExpoTheme,
  View,
} from 'expo-dev-client-components';
import * as React from 'react';
import { Animated, Linking } from 'react-native';

import { PressableOpacity } from '../../components/PressableOpacity';
import * as UrlUtils from '../../utils/UrlUtils';

export function DevelopmentServersOpenURL() {
  const [showInput, setShowInput] = React.useState(false);
  const [url, setUrl] = React.useState('');

  const theme = useExpoTheme();
  const rotateAnimation = React.useRef(new Animated.Value(0)).current;

  const interpolateRotating = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  React.useEffect(
    function animateChevron() {
      Animated.timing(rotateAnimation, {
        toValue: showInput ? 1 : 0,
        duration: 100,
        useNativeDriver: false,
      }).start(() => {
        rotateAnimation.setValue(showInput ? 1 : 0);
      });
    },
    [showInput]
  );

  function openURL() {
    if (url) {
      const normalizedUrl = UrlUtils.normalizeUrl(url);
      Linking.openURL(normalizedUrl);
    }
  }

  return (
    <>
      <Divider />
      <View padding="medium">
        <PressableOpacity onPress={() => setShowInput((prevState) => !prevState)}>
          <Row align="center">
            <Animated.View
              style={{ transform: [{ rotate: interpolateRotating }], marginRight: spacing[2] }}>
              <ChevronRightIcon size="small" style={{ tintColor: theme.icon.default }} />
            </Animated.View>
            <Text>Enter URL manually</Text>
          </Row>
        </PressableOpacity>
        {showInput ? <Spacer.Vertical size="medium" /> : null}
        {showInput ? (
          <View>
            <TextInput
              onChangeText={(newUrl) => setUrl(newUrl.trim())}
              border="default"
              rounded="medium"
              shadow="input"
              autoCorrect={false}
              autoComplete="off"
              autoCapitalize="none"
              returnKeyType="go"
              onSubmitEditing={openURL}
              style={{ backgroundColor: theme.background.default }}
              px="4"
              py="3"
              placeholder="exp://"
              placeholderTextColor={theme.text.secondary}
            />
            <Spacer.Vertical size="small" />
            <PressableOpacity
              onPress={openURL}
              disabled={!url}
              style={[
                {
                  backgroundColor: theme.button.tertiary.background,
                  padding: spacing[2],
                  borderRadius: borderRadius.medium,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}>
              <Button.Text color="tertiary" weight="semibold">
                Connect
              </Button.Text>
            </PressableOpacity>
          </View>
        ) : null}
      </View>
    </>
  );
}
