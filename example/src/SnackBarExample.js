/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { SnackBar, Colors, withTheme } from 'react-native-paper';
import type { Theme } from 'react-native-paper/types';

type Props = {
  theme: Theme,
};

class SearchExample extends React.Component<Props> {
  static title = 'Snack bar';

  render() {
    const { theme: { colors: { background } } } = this.props;
    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <SnackBar
          buttonText="Undo"
          content="Some text. What do you think?"
          onPress={() => {}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey200,
  },
});

export default withTheme(SearchExample);
