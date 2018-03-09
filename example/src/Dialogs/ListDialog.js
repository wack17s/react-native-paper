/* @flow */

import * as React from 'react';
import { ListDialog } from 'react-native-paper';

type Props = {
  visible: boolean,
  close: Function,
};

type State = {
  value: string,
};

export default class extends React.Component<Props, State> {
  state = {
    value: '',
  };

  render() {
    return (
      <ListDialog
        title="ListDialog"
        visible={this.props.visible}
        onDismiss={this.props.close}
        onOk={this.props.close}
        onCancel={this.props.close}
        data={[
          { value: 'First', label: 'First option' },
          { value: 'Second', label: 'Second option' },
          { value: 'Third', label: 'Third option' },
          { value: 'bla', label: 'bla bla' },
          { value: 'blabla', label: 'bla bla bla' },
        ]}
        color="blue"
        onChange={value => this.setState({ value })}
        value={this.state.value}
      />
    );
  }
}
