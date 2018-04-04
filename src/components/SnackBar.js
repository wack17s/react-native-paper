// @flow
import * as React from 'react';
import { StyleSheet, Animated, Easing } from 'react-native';

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
  duration: number,
  finished: () => any,
  color?: string,
  buttonColor?: string,
  backgroundColor?: string,
  theme: Theme,
};

type State = {
  shown: Animated.Value,
  yPosition: Animated.Value,
};

class SnackBar extends React.Component<Props, State> {
  static defaultProps = {
    duration: 3000,
  };

  constructor(props) {
    super(props);

    this.state = {
      shown: new Animated.Value(0),
      yPosition: new Animated.Value(48),
    };
  }

  hideTimeout: number;

  componentDidMount() {
    Animated.parallel([
      Animated.timing(this.state.shown, {
        easing: Easing.out(Easing.sin),
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.yPosition, {
        easing: Easing.out(Easing.sin),
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
    this.hideTimeout = setTimeout(this.hide, this.props.duration);
  }

  hide = () => {
    Animated.parallel([
      Animated.timing(this.state.shown, {
        easing: Easing.out(Easing.sin),
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.yPosition, {
        easing: Easing.out(Easing.sin),
        toValue: 48,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(this.props.finished);
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

    const shouldRenderButton = onPress && buttonText;
    const buttonMargin = shouldRenderButton ? 8 : 0;
    const contentRightMargin = shouldRenderButton ? 0 : 24;

    return (
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: backgroundColor || grey850,
            transform: [
              {
                translateY: this.state.yPosition,
              },
            ],
          },
        ]}
      >
        <Animated.Text
          style={[
            styles.content,
            {
              fontFamily: fonts.regular,
              marginRight: contentRightMargin,
              color: color || white,
              opacity: this.state.shown,
            },
          ]}
        >
          {content}
        </Animated.Text>
        {shouldRenderButton ? (
          <Button
            color={buttonColor || colors.accent}
            style={[styles.buttonStyle, { marginHorizontal: buttonMargin }]}
            onPress={() => {
              if (this.hideTimeout) {
                clearTimeout(this.hideTimeout);
              }
              this.hide();
              onPress && onPress();
            }}
          >
            {buttonText || ''}
          </Button>
        ) : null}
      </Animated.View>
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
    marginVertical: 14,
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
