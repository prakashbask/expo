/* @flow */

import React from 'react';
import {
  Image,
  Keyboard,
  Linking,
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import TouchableNativeFeedbackSafe from '@expo/react-native-touchable-native-feedback-safe';
import FadeIn from 'react-native-fade-in-image';
import { withNavigation } from 'react-navigation';

import Colors from '../constants/Colors';
import UrlUtils from '../utils/UrlUtils';
import { GenericCardBody, GenericCardContainer, StyledView } from '../components/Views';
import { StyledText } from '../components/Text';

@withNavigation
export default class ProjectCard extends React.PureComponent {
  render() {
    let { description, projectName, username } = this.props;

    return (
      <View style={[styles.spacerContainer, this.props.style]}>
        <TouchableNativeFeedbackSafe
          onPress={this._handlePressProject}
          onLongPress={this._handleLongPressProject}
          fallback={TouchableHighlight}
          underlayColor="#b7b7b7">
          <StyledView styles={[styles.container, styles.bottomBorder]}>
            <View style={styles.header}>
              <View style={styles.iconContainer}>{this._maybeRenderIcon()}</View>
              <View style={styles.infoContainer}>
                <StyledText style={styles.projectNameText} ellipsizeMode="tail" numberOfLines={1}>
                  {projectName}
                </StyledText>
                <View style={styles.projectExtraInfoContainer}>
                  <StyledText
                    lightColor="rgba(36, 44, 58, 0.4)"
                    darkColor="#ccc"
                    onPress={this._handlePressUsername}
                    style={styles.projectExtraInfoText}
                    ellipsizeMode="tail"
                    numberOfLines={1}>
                    {username}
                  </StyledText>
                </View>
              </View>
            </View>
            <View style={styles.body}>
              <StyledText
                lightColor="rgba(36, 44, 58, 0.7)"
                darkColor="#eee"
                style={styles.descriptionText}>
                {description}
              </StyledText>
            </View>
          </StyledView>
        </TouchableNativeFeedbackSafe>
      </View>
    );
  }

  _maybeRenderIcon = () => {
    let { iconUrl } = this.props;

    if (iconUrl) {
      return (
        <View style={styles.iconClipContainer}>
          <FadeIn placeholderColor="#eee">
            <Image source={{ uri: iconUrl }} style={styles.icon} />
          </FadeIn>
        </View>
      );
    } else {
      return <View style={[styles.icon, { backgroundColor: '#eee' }]} />;
    }
  };

  _handleLongPressProject = () => {
    let url = UrlUtils.normalizeUrl(this.props.projectUrl);
    Share.share({
      title: this.props.projectName,
      message: url,
      url,
    });
  };

  _handlePressProject = () => {
    // note(brentvatne): navigation should do this automatically
    Keyboard.dismiss();

    let url = UrlUtils.normalizeUrl(this.props.projectUrl);
    Linking.openURL(url);
  };

  _handlePressUsername = () => {
    // note(brentvatne): navigation should do this automatically
    Keyboard.dismiss();

    if (this.props.onPressUsername) {
      this.props.onPressUsername(this.props.username);
    } else {
      this.props.navigation.navigate('Profile', { username: this.props.username });
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
  },
  spacerContainer: {
    marginBottom: 15,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  body: {
    paddingLeft: 15,
    paddingRight: 10,
    paddingBottom: 17,
  },
  iconClipContainer: {
    borderRadius: 3,
    overflow: 'hidden',
  },
  iconContainer: {
    paddingLeft: 15,
    paddingRight: 10,
    paddingTop: 12,
    paddingBottom: 10,
  },
  descriptionText: {
    lineHeight: 19,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 3,
    ...Platform.select({
      android: {
        marginTop: 3,
      },
    }),
  },
  infoContainer: {
    paddingTop: 13,
    flexDirection: 'column',
    alignSelf: 'stretch',
    paddingBottom: 10,
  },
  projectNameText: {
    fontSize: 15,
    marginRight: 170,
    marginBottom: 2,
    ...Platform.select({
      ios: {
        fontWeight: '500',
      },
      android: {
        fontWeight: '400',
        marginTop: 1,
      },
    }),
  },
  projectExtraInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectExtraInfoText: {
    fontSize: 13,
    lineHeight: 16,
  },
});
