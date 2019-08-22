/* @flow */

import React from 'react';
import { Linking, Platform, Share, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import TouchableNativeFeedbackSafe from '@expo/react-native-touchable-native-feedback-safe';

import Colors from '../constants/Colors';
import UrlUtils from '../utils/UrlUtils';

function isDescriptionEmpty(description) {
  if (!description || description === 'No description') {
    return true;
  } else {
    return false;
  }
}

@withNavigation
export default class SnackCard extends React.PureComponent {
  render() {
    let { description, projectName } = this.props;

    return (
      <TouchableNativeFeedbackSafe
        onLongPress={this._handleLongPressProject}
        onPress={this._handlePressProject}
        fallback={TouchableHighlight}
        underlayColor="#b7b7b7"
        style={[styles.container, this.props.fullWidthBorder && styles.bottomBorder]}>
        <View style={[styles.infoContainer, !this.props.fullWidthBorder && styles.bottomBorder]}>
          <Text style={styles.projectNameText} ellipsizeMode="tail" numberOfLines={1}>
            {projectName}
          </Text>

          {isDescriptionEmpty(description) ? null : (
            <View style={[styles.projectExtraInfoContainer, { marginTop: 5 }]}>
              <Text style={styles.projectExtraInfoText} ellipsizeMode="tail" numberOfLines={1}>
                {description}
              </Text>
            </View>
          )}
        </View>
      </TouchableNativeFeedbackSafe>
    );
  }

  _handlePressProject = () => {
    let url = UrlUtils.normalizeUrl(this.props.projectUrl);
    Linking.openURL(url);
  };

  _handleLongPressProject = () => {
    let url = UrlUtils.normalizeUrl(this.props.projectUrl);
    Share.share({
      title: this.props.projectName,
      message: url,
      url,
    });
  };

  _handlePressUsername = () => {
    this.props.navigation.navigate('Profile', { username: this.props.username });
  };
}

const styles = StyleSheet.create({
  bottomBorder: {
    flexGrow: 1,
    borderBottomColor: Colors.separator,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    flex: 1,
    paddingBottom: 3,
    paddingHorizontal: 16,
  },
  infoContainer: {
    paddingTop: 13,
    flexDirection: 'column',
    alignSelf: 'stretch',
    paddingBottom: 10,
  },
  projectNameText: {
    color: Colors.blackText,
    fontSize: 15,
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
    color: Colors.greyText,
    fontSize: 13,
  },
});
