// @flow
import * as React from 'react';
import { StyleSheet, Animated, PanResponder, Dimensions } from 'react-native';

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
  /**
   * Duration until snackbar will hide
   */
  duration: number,
  /**
   * Callback that is called when snackbar finishes hiding animation.
   */
  finished: () => any,
  /**
   * Color of text
   */
  color?: string,
  /**
   * Color of button
   */
  buttonColor?: string,
  /**
   * Background color of snackbar
   */
  backgroundColor?: string,
  theme: Theme,
};

type State = {
  shown: Animated.Value,
  position: Animated.ValueXY,
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;
const SNACKBAR_ANIMATION_DURATION = 250;

class SnackBar extends React.Component<Props, State> {
  static defaultProps = {
    duration: 3000,
  };

  constructor(props) {
    super(props);

    const position = new Animated.ValueXY({ x: 0, y: 48 });
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: 0 });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          this.forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe('left');
        } else {
          this.resetPosition();
        }
      },
    });

    this.state = {
      shown: new Animated.Value(0),
      position,
    };
  }

  panResponder: PanResponder;
  hideTimeout: number;

  componentDidMount() {
    Animated.parallel([
      Animated.timing(this.state.shown, {
        toValue: 1,
        duration: SNACKBAR_ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.position, {
        toValue: { x: 0, y: 0 },
        duration: SNACKBAR_ANIMATION_DURATION,
      }),
    ]).start(() => {
      this.hideTimeout = setTimeout(this.hide, this.props.duration);
    });
  }

  hide = () => {
    Animated.parallel([
      Animated.timing(this.state.shown, {
        toValue: 0,
        duration: SNACKBAR_ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.position, {
        toValue: { x: 0, y: 48 },
        duration: SNACKBAR_ANIMATION_DURATION,
      }),
    ]).start(this.props.finished);
  };

  forceSwipe = (direction: string) => {
    clearTimeout(this.hideTimeout);
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(this.state.position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
    }).start(this.props.finished);
  };

  resetPosition = () => {
    Animated.spring(this.state.position, {
      toValue: { x: 0, y: 0 },
    }).start();
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
            ...this.state.position.getLayout(),
          },
        ]}
        {...this.panResponder.panHandlers}
      >
        <Animated.Text
          style={[
            styles.content,
            {
              fontFamily: fonts.regular,
              marginRight: contentRightMargin,
              color: color || white,
              opacity: this.state.shown.interpolate({
                inputRange: [0, 0.6, 1],
                outputRange: [0, 0, 1],
              }),
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
