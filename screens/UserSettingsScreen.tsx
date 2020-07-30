import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { ColorSchemeName } from 'react-native-appearance';

import ListItem from '../components/ListItem';
import ScrollView from '../components/NavigationScrollView';
import SectionFooter from '../components/SectionFooter';
import SectionHeader from '../components/SectionHeader';
import { useDispatch, useSelector } from '../redux/Hooks';
import SessionActions from '../redux/SessionActions';
import SettingsActions from '../redux/SettingsActions';

export default function UserSettingsScreen() {
  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag">
      <AppearanceItem />
      {Platform.OS === 'ios' && <MenuGestureItem />}
      <SignOutItem />
    </ScrollView>
  );
}

function AppearanceItem() {
  const dispatch = useDispatch();
  const preferredAppearance = useSelector(data => data.settings.preferredAppearance);

  const onSelectAppearance = React.useCallback(
    (preferredAppearance: ColorSchemeName) => {
      dispatch(SettingsActions.setPreferredAppearance(preferredAppearance));
    },
    [dispatch]
  );

  return (
    <View style={styles.marginTop}>
      <SectionHeader title="Theme" />
      <ListItem
        title="Automatic"
        checked={preferredAppearance === 'no-preference'}
        onPress={() => onSelectAppearance('no-preference')}
      />
      <ListItem
        title="Light"
        checked={preferredAppearance === 'light'}
        onPress={() => onSelectAppearance('light')}
      />
      <ListItem
        last
        margins={false}
        title="Dark"
        checked={preferredAppearance === 'dark'}
        onPress={() => onSelectAppearance('dark')}
      />
      <SectionFooter
        title="Automatic is only supported on operating systems that allow you to control the
            system-wide color scheme."
      />
    </View>
  );
}

function MenuGestureItem() {
  const dispatch = useDispatch();
  const devMenuSettings = useSelector(data => data.settings.devMenuSettings);

  const onToggleMotionGesture = React.useCallback(() => {
    dispatch(
      SettingsActions.setDevMenuSetting(
        'motionGestureEnabled',
        !devMenuSettings.motionGestureEnabled
      )
    );
  }, [dispatch, devMenuSettings]);

  const onToggleTouchGesture = React.useCallback(() => {
    dispatch(
      SettingsActions.setDevMenuSetting('touchGestureEnabled', !devMenuSettings.touchGestureEnabled)
    );
  }, [dispatch, devMenuSettings]);

  if (!devMenuSettings) {
    return null;
  }

  return (
    <View style={styles.marginTop}>
      <SectionHeader title="Developer Menu Gestures" />
      <ListItem
        title="Shake device"
        checked={devMenuSettings.motionGestureEnabled}
        onPress={onToggleMotionGesture}
      />
      <ListItem
        title="Three-finger long press"
        checked={devMenuSettings.touchGestureEnabled}
        onPress={onToggleTouchGesture}
      />
      <SectionFooter title="Selected gestures will toggle the developer menu while inside an experience. The menu allows you to reload or return to home in a published experience, and exposes developer tools in development mode." />
    </View>
  );
}

function SignOutItem() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const onPress = React.useCallback(() => {
    dispatch(SessionActions.signOut());
    requestAnimationFrame(navigation.goBack);
  }, [dispatch, navigation]);

  return (
    <View style={styles.marginTop}>
      <ListItem title="Sign Out" onPress={onPress} last />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marginTop: {
    marginTop: 25,
  },
});
