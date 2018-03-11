/* @flow */

import * as React from 'react';
import { ListDialog } from 'react-native-paper';

type Props = {
  visible: boolean,
  close: Function,
};

export default class extends React.Component<Props> {
  render() {
    return (
      <ListDialog
        title="ListDialog"
        visible={this.props.visible}
        onDismiss={this.props.close}
        onOk={this.props.close}
        onCancel={this.props.close}
        data={[
          {
            id: 'First',
            label: 'First option',
            checked: true,
          },
          {
            id: 'Second',
            label: 'Second option',
            checked: false,
          },
          {
            id: 'Third',
            label: 'Third option',
            checked: false,
          },
          {
            id: 'bla',
            label: 'bla bla',
            checked: false,
          },
          {
            id: 'blabla',
            label: 'bla bla bla',
            checked: false,
          },
        ]}
        onChange={() => {}}
        multiselect
      />
    );
  }
}
