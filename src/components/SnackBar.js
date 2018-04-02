// @flow
import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import withTheme from '../core/withTheme';
import Button from './Button';
import { grey850, white } from '../styles/colors';
import type { Theme } from '../types';

type Props = {
  /**
   * Text that will be displayed inside SnackBar
   */
  content: string,
  /**
   * Callback that is called when button is pressed
   */
  onPress?: () => mixed,
  /**
   * Text of the button
   */
  buttonText?: string,
  color?: string,
  buttonColor?: string,
  backgroundColor?: string,
  theme: Theme,
};

type State = {
  singleLine: boolean,
};

class SnackBar extends React.Component<Props, State> {
  state = {
    singleLine: true,
  };

  onLayout = event => {
    const { height } = event.nativeEvent.layout;
    if (height > 48) {
      this.setState({ singleLine: false });
    }
  };

  render() {
    const {
      content,
      buttonText,
      onPress,
      theme: { fonts, colors },
      color,
      buttonColor,
      backgroundColor,
    } = this.props;

    const { singleLine } = this.state;
    const marginVertical = singleLine ? 14 : 24;

    const shouldRenderButton = onPress && buttonText;
    const buttonMargin = shouldRenderButton ? 8 : 0;
    const contentRightMargin = shouldRenderButton ? 0 : 24;

    return (
      <View
        onLayout={this.onLayout}
        style={[
          styles.container,
          { backgroundColor: backgroundColor || grey850 },
        ]}
      >
        <Text
          style={[
            styles.content,
            {
              fontFamily: fonts.regular,
              marginVertical,
              marginRight: contentRightMargin,
              color: color || white,
            },
          ]}
        >
          {content}
        </Text>
        {shouldRenderButton ? (
          <Button
            color={buttonColor || colors.accent}
            style={[styles.buttonStyle, { marginHorizontal: buttonMargin }]}
            onPress={onPress}
          >
            {buttonText || ''}
          </Button>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: grey850,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    marginLeft: 24,
    flexWrap: 'wrap',
    flex: 1,
    fontSize: 14,
  },
  buttonStyle: {
    margin: 0,
    minWidth: 0,
  },
});

export default withTheme(SnackBar);
