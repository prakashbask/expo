import * as React from 'react';
import { ScrollView, useTheme } from 'react-navigation';
import Colors from '../constants/Colors';

type ThemedColors = keyof typeof Colors.light & keyof typeof Colors.dark;

type ScrollViewProps = ScrollView['props'];
interface StyledScrollViewProps extends ScrollViewProps {
  lightBackgroundColor?: string;
  darkBackgroundColor?: string;
}

function useThemeBackgroundColor(props: StyledScrollViewProps, colorName: ThemedColors) {
  let theme = useTheme();
  let colorFromProps = props[`${theme}BackgroundColor`];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export default (props: ScrollViewProps) => {
  let { style, ...otherProps } = props;
  let backgroundColor = useThemeBackgroundColor(props, 'bodyBackground');

  return <ScrollView style={[{ backgroundColor }, style]} {...otherProps} />;
};
