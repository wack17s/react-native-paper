/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet } from 'react-native';
import { TextInput, withTheme } from 'react-native-paper';
import type { Theme } from 'react-native-paper/types';

type Props = {
  theme: Theme,
};

type State = {
  text: string,
  errorInputText: string,
};

class TextInputExample extends React.Component<Props, State> {
  static title = 'TextInput';
  static propTypes = {
    theme: PropTypes.object.isRequired,
  };

  state = {
    text: '',
    errorInputText: '',
  };

  render() {
    const { theme: { colors: { background } } } = this.props;
    return (
      <ScrollView style={[styles.container, { backgroundColor: background }]}>
        <TextInput
          style={styles.inputContainerStyle}
          label="Normal input"
          placeholder="Type something"
          value={this.state.text}
          onChangeText={text => this.setState({ text })}
        />
        <TextInput
          style={styles.inputContainerStyle}
          label="Input with helper text"
          placeholder="Type more than three characters"
          helperText="Helper text"
          value={this.state.errorInputText}
          hasError={this.state.errorInputText.length > 3}
          errorText="Error text"
          onChangeText={errorInputText => this.setState({ errorInputText })}
        />
        <TextInput
          disabled
          style={styles.inputContainerStyle}
          label="Disabled Input"
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  inputContainerStyle: {
    margin: 8,
  },
});

export default withTheme(TextInputExample);
