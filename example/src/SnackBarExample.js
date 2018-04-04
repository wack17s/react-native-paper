/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { SnackBar, Colors, withTheme, Button } from 'react-native-paper';
import type { Theme } from 'react-native-paper/types';

type Props = {
  theme: Theme,
};

type State = {
  show: boolean,
};

class SearchExample extends React.Component<Props, State> {
  static title = 'Snack bar';

  state = {
    show: false,
  };

  render() {
    const { theme: { colors: { background } } } = this.props;
    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <View>
          <Button onPress={() => this.setState({ show: true })}>Show</Button>
          <Button onPress={() => this.setState({ show: false })}>Hide</Button>
        </View>
        {this.state.show ? (
          <SnackBar
            buttonText="Undo"
            content="Some text. What do you think?"
            onPress={() => {}}
            finished={() => this.setState({ show: false })}
            duration={5000}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey200,
    justifyContent: 'space-between',
  },
});

export default withTheme(SearchExample);
