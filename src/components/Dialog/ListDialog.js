/* @flow */
import * as React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import Dialog from './Dialog';
import DialogTitle from './DialogTitle';
import DialogActions from './DialogActions';
import DialogScrollArea from './DialogScrollArea';
import RadioButton from '../RadioButton';
import Checkbox from '../Checkbox';
import TouchableRipple from '../TouchableRipple';
import Subheading from '../Typography/Subheading';
import Button from '../Button';

type Props = {
  /**
   * Dialog's title displayed on top.
   */
  title: string,
  /**
   * Determines whether the dialog is visible.
   */
  visible: boolean,
  /**
   * Callback that is called when the user dismisses the dialog.
   */
  onDismiss: Function,
  /**
   * State for the list dialog. The state is an array of objects that should contain the following properties:
   *
   * - `id`: a string representing id of list item.
   * - `label`: a string that will be displayed as list item.
   * - `checked`: a boolean that determines initial value of list item.
   *
   * Example:
   *
   * ```js
   * [
   *   { id: 'first', label: 'First option', checked: true },
   *   { id: 'second', label: 'Second option', checked: false },
   *   { id: 'third', label: 'Third option', checked: false },
   * ]
   * ```
   *
   * `ListDialog` is uncontrolled component, which means you won't be notified about every change of the state.
   * You can get dialog state from onDismiss callback as first argument + etc. TODO: Add more content here
   */
  listData: Array<{
    id: string,
    label: string,
    checked: boolean,
  }>,
  /**
   * Array of objects that are transformed on Buttons. Objects should have following properties:
   *
   * - `text`: a string that will be displayed inside button.
   * - `callback`: a function that will be invoked on button press.
   * - Any other prop that Button takes.
   *
   * Example:
   *
   * ```js
   * [
   *   { text: 'Cancel', callback: () => console.log('pressed') },
   *   { text: 'Ok', callback: () => console.log('pressed'), primary: true },
   * ]
   * ```
   */
  actions: Array<{
    text: string,
    callback: Function,
  }>,
  /**
   * Max height of the content section, if content is higher it will be scrollable
   */
  maxHeight?: number,
  /**
   * Color that will be applied to Checkbox and RadioButton
   */
  color?: string,
  /**
   * Determines if only one elemenmt can be checked or more at the same time
   */
  multiselect: boolean,
};

type State = {
  values: Array<{
    id: string,
    label: string,
    checked: boolean,
  }>,
};

class ListDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      values: [...props.listData],
    };
  }

  setMultiChecked = (id: string | number) => {
    this.setState(({ values }) => {
      const newValues = values.map(value => {
        if (value.id === id) {
          return { ...value, checked: !value.checked };
        }
        return { ...value };
      });
      return { values: newValues };
    });
  };

  setSingleChecked = (id: string | number) => {
    this.setState(({ values }) => {
      const newValues = values.map(value => {
        if (value.id === id) {
          return { ...value, checked: true };
        }
        return { ...value, checked: false };
      });
      return { values: newValues };
    });
  };

  renderMultiselect = () => {
    const { color } = this.props;
    const { values } = this.state;
    return values.map(({ label, id, checked }) => (
      <TouchableRipple key={id} onPress={() => this.setMultiChecked(id)}>
        <View style={styles.row}>
          <View pointerEvents="none">
            <Checkbox value={id} checked={checked} color={color} />
          </View>
          <Subheading style={styles.text}>{label}</Subheading>
        </View>
      </TouchableRipple>
    ));
  };

  renderSingleselect = () => {
    const { color } = this.props;
    const { values } = this.state;
    return values.map(({ label, id, checked }) => (
      <TouchableRipple key={id} onPress={() => this.setSingleChecked(id)}>
        <View style={styles.row}>
          <View pointerEvents="none">
            <RadioButton value={id} checked={checked} color={color} />
          </View>
          <Subheading style={styles.text}>{label}</Subheading>
        </View>
      </TouchableRipple>
    ));
  };

  render() {
    const {
      title,
      onDismiss,
      visible,
      actions,
      maxHeight,
      multiselect,
    } = this.props;
    return (
      <Dialog onDismiss={() => onDismiss(this.state.values)} visible={visible}>
        <DialogTitle>{title}</DialogTitle>
        <DialogScrollArea
          style={{ maxHeight: maxHeight || 200, paddingHorizontal: 0 }}
        >
          <ScrollView>
            <View>
              {multiselect
                ? this.renderMultiselect()
                : this.renderSingleselect()}
            </View>
          </ScrollView>
        </DialogScrollArea>
        <DialogActions>
          {actions.map(({ text, callback, primary, ...rest }) => (
            <Button
              {...rest}
              key={text}
              onPress={() => callback(this.state.values)}
            >
              {text}
            </Button>
          ))}
        </DialogActions>
      </Dialog>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  text: {
    paddingLeft: 8,
  },
});

export default ListDialog;
