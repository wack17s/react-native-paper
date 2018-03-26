/* @flow */

import * as React from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import Text from './Typography/Text';
import Card from './Card/Card';
import ThemedPortal from './Portal/ThemedPortal';
import FAB from './FAB';
import withTheme from '../core/withTheme';

import type { Theme } from '../types';
import type { IconSource } from './Icon';

type Props = {
  actions: Array<Item>,
  animated?: boolean,
  icon: IconSource,
  theme: Theme,
  open?: boolean,
  onStateChange?: (state: { open: boolean }) => mixed,
};

type Item = {
  icon: string,
  label?: string,
  onPress: () => mixed,
  primary?: boolean,
};

type State = {
  animatedValue: Animated.Value,
  isOpen: boolean,
};

class FABGroup extends React.Component<Props, State> {
  state = {
    animatedValue: new Animated.Value(0),
    isOpen: typeof this.props.open === 'boolean' ? this.props.open : false,
  };

  componentWillReceiveProps(nextProps) {
    if (
      typeof nextProps.open === 'boolean' &&
      nextProps.open !== this.state.isOpen
    ) {
      this.setState({
        isOpen: nextProps.open,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isOpen === prevState.isOpen) {
      return;
    }
    if (this.state.isOpen) {
      Animated.timing(this.state.animatedValue, {
        toValue: 1,
        duration: this.props.actions.length * 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(this.state.animatedValue, {
        toValue: 0,
        duration: 200,
        easing: Easing.sin,
        useNativeDriver: true,
      }).start();
    }
  }

  _toggleModal = () => {
    if (this.props.onStateChange) {
      this.props.onStateChange({ open: !this.state.isOpen });
    } else {
      this.setState(state => ({ isOpen: !state.isOpen }));
    }
  };

  render() {
    const { colors, fonts, dark } = this.props.theme;
    const { actions } = this.props;

    const backdropOpacity = this.state.isOpen
      ? this.state.animatedValue.interpolate({
          inputRange: [0, 0.5, 1],
          // $FlowFixMe
          outputRange: [0, 1, 1],
        })
      : this.state.animatedValue;

    const length = actions.length + 1;
    const inputRange = Array.from({ length }).map(
      (_, i) => i * (1 / (length - 1))
    );

    const opacities = actions.map(
      (_, index, self) =>
        this.state.isOpen
          ? this.state.animatedValue.interpolate({
              inputRange,
              outputRange: inputRange.map(
                (x, i) => (i < self.length - index ? 0 : 1)
              ),
            })
          : this.state.animatedValue
    );

    const scales = opacities.map(
      opacity =>
        this.state.isOpen
          ? opacity.interpolate({
              inputRange: [0, 1],
              // $FlowFixMe
              outputRange: [0.8, 1],
            })
          : 1
    );

    const primaryAction = this.props.actions.find(action => action.primary);

    return (
      <ThemedPortal>
        {this.state.isOpen && (
          <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
        )}
        <View pointerEvents="box-none" style={styles.container}>
          <TouchableWithoutFeedback onPress={this._toggleModal}>
            <Animated.View
              pointerEvents={this.state.isOpen ? 'auto' : 'none'}
              style={[
                styles.backdrop,
                {
                  opacity: backdropOpacity,
                  backgroundColor: dark
                    ? 'rgba(0, 0, 0, 0.6)'
                    : 'rgba(255, 255, 255, 0.9)',
                },
              ]}
            />
          </TouchableWithoutFeedback>
          <View pointerEvents={this.state.isOpen ? 'box-none' : 'none'}>
            {actions.map((it, i) => {
              if (it.primary) {
                return null;
              }
              return (
                <Animated.View
                  key={i} //eslint-disable-line
                  style={[
                    {
                      opacity: opacities[i],
                    },
                  ]}
                  pointerEvents="box-none"
                >
                  <View style={styles.item} pointerEvents="box-none">
                    {it.label && (
                      <Card
                        style={[
                          styles.label,
                          {
                            transform: [{ scale: scales[i] }],
                          },
                        ]}
                        onPress={it.onPress}
                      >
                        <Text style={{ fontFamily: fonts.medium }}>
                          {it.label}
                        </Text>
                      </Card>
                    )}
                    <FAB
                      dark
                      icon={it.icon}
                      small
                      style={[
                        {
                          backgroundColor: colors.primary,
                          transform: [{ scale: scales[i] }],
                        },
                      ]}
                      onPress={it.onPress}
                    />
                  </View>
                </Animated.View>
              );
            })}
          </View>
          <FAB
            dark
            animated={this.props.animated}
            onPress={() => {
              if (this.state.isOpen && primaryAction && primaryAction.onPress) {
                primaryAction.onPress();
              }
              this._toggleModal();
            }}
            icon={
              this.state.isOpen
                ? primaryAction ? primaryAction.icon : 'close'
                : this.props.icon
            }
            style={styles.fab}
          />
        </View>
      </ThemedPortal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  fab: {
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 8,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  label: {
    borderRadius: 5,
    elevation: 2,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginVertical: 8,
    marginHorizontal: 24,
  },
  item: {
    marginHorizontal: 24,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default withTheme(FABGroup);
