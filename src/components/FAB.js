/* @flow */

import color from 'color';
import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Paper from './Paper';
import Icon from './Icon';
import TouchableRipple from './TouchableRipple';
import { white } from '../styles/colors';
import withTheme from '../core/withTheme';
import type { Theme } from '../types';
import type { IconSource } from './Icon';

const AnimatedPaper = Animated.createAnimatedComponent(Paper);

type Props = {
  /**
   *  Whether FAB is mini-sized, used to create visual continuity with other elements.
   */
  small?: boolean,
  /**
   * Icon color of button, a dark button will render light text and vice-versa.
   */
  dark?: boolean,
  /**
   * Name of the icon. Can be a string (name of `MaterialIcon`),
   * an object of shape `{ uri: 'https://path.to' }`,
   * a local image: `require('../path/to/image.png')`,
   * or a valid React Native component.
   */
  icon: IconSource,
  /**
   * Custom color for the FAB.
   */
  color?: string,
  /**
   * Function to execute on press.
   */
  onPress: Function,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
};

type State = {
  icon: IconSource,
  fade: Animated.Value,
};

/**
 * A floating action button represents the primary action in an application.
 *
 * <div class="screenshots">
 *   <img src="screenshots/fab.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { FAB } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <FAB
 *     small
 *     icon="add"
 *     onPress={() => {}}
 *   />
 * );
 * ```
 */

class FAB extends React.Component<Props, State> {
  state = {
    icon: null,
    fade: new Animated.Value(1),
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.icon === nextProps.icon) {
      return;
    }

    this.setState({
      icon: this.props.icon,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.icon === prevState.icon || this.state.icon === null) {
      return;
    }

    this.state.fade.setValue(1);
    Animated.timing(this.state.fade, {
      duration: 200,
      toValue: 0,
    }).start();
  }

  render() {
    const {
      small,
      dark,
      icon,
      color: iconColor,
      onPress,
      theme,
      style,
    } = this.props;
    const backgroundColor = theme.colors.accent;
    const isDark =
      typeof dark === 'boolean' ? dark : !color(backgroundColor).light();
    const textColor = iconColor || (isDark ? white : 'rgba(0, 0, 0, .54)');
    const rippleColor = color(textColor)
      .alpha(0.32)
      .rgb()
      .string();

    const opacityPrev = this.state.fade;
    const opacityNext = this.state.icon
      ? this.state.fade.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0],
        })
      : 1;

    const rotatePrev = this.state.fade.interpolate({
      inputRange: [0, 1],
      outputRange: ['-90deg', '0deg'],
    });

    const rotateNext = this.state.icon
      ? this.state.fade.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '-180deg'],
        })
      : '0deg';

    return (
      <AnimatedPaper
        {...this.props}
        style={[
          { backgroundColor, elevation: 12 },
          styles.content,
          small ? styles.small : styles.standard,
          style,
        ]}
      >
        <TouchableRipple
          borderless
          onPress={onPress}
          rippleColor={rippleColor}
          style={[styles.content, small ? styles.small : styles.standard]}
        >
          {this.props.animated ? (
            <View style={styles.content}>
              {this.state.icon ? (
                <Animated.View
                  style={[
                    styles.icon,
                    {
                      opacity: opacityPrev,
                      transform: [{ rotate: rotatePrev }],
                    },
                  ]}
                >
                  <Icon
                    name={this.state.icon}
                    size={24}
                    style={{ color: textColor }}
                  />
                </Animated.View>
              ) : null}
              <Animated.View
                style={[
                  styles.icon,
                  {
                    opacity: opacityNext,
                    transform: [{ rotate: rotateNext }],
                  },
                ]}
              >
                <Icon name={icon} size={24} style={{ color: textColor }} />
              </Animated.View>
            </View>
          ) : (
            <View style={styles.content}>
              <Icon name={icon} size={24} style={{ color: textColor }} />
            </View>
          )}
        </TouchableRipple>
      </AnimatedPaper>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    width: 24,
  },
  standard: {
    height: 56,
    width: 56,
    borderRadius: 28,
  },
  small: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  icon: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default withTheme(FAB);
