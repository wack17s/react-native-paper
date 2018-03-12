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
   * Stae for the list dialog. The state is an array of objects that should contain the following properties:
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
   * You can get dialog state as an argument of onDismiss callback + etc. TODO: Add more content here
   */
  data: Array<{
    id: string,
    label: string,
    checked: boolean,
  }>,
  // TODO: Refactor actions
  onCancel?: Function,
  onOk?: Function,
  /**
   * Max height of the content section, if content is bigger it will be scrollable
   */
  maxHeight?: number,
  // Color that will be applied to Checkbox and RadioButton
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
      values: [...props.data],
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

  renderMultiselct = () => {
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
      onCancel,
      onOk,
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
                ? this.renderMultiselct()
                : this.renderSingleselect()}
            </View>
          </ScrollView>
        </DialogScrollArea>
        <DialogActions>
          <Button
            primary
            onPress={() => onCancel && onCancel(this.state.values)}
          >
            Cancel
          </Button>
          <Button primary onPress={() => onOk && onOk(this.state.values)}>
            Ok
          </Button>
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
