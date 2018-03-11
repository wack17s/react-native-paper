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
  title: string,
  visible: boolean,
  onDismiss: Function,
  data: Array<{
    id: string | number,
    label: string,
    checked: boolean,
  }>,
  onCancel?: Function,
  onOk?: Function,
  maxHeight?: number,
  color?: string,
  multiselect: boolean,
};

type State = {
  values: Array<{
    id: string | number,
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
