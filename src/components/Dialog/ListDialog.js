/* @flow */
import * as React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import Dialog from './Dialog';
import DialogTitle from './DialogTitle';
import DialogActions from './DialogActions';
import DialogScrollArea from './DialogScrollArea';
import RadioButton from '../RadioButton';
import TouchableRipple from '../TouchableRipple';
import Subheading from '../Typography/Subheading';
import Button from '../Button';

type Props = {
  title: string,
  visible: boolean,
  onDismiss: Function,
  data: Array<any>,
  onCancel?: Function,
  onOk?: Function,
  maxHeight?: number,
  color?: string,
  onChange: (value: string) => mixed,
  value: string,
};

class ListDialog extends React.Component<Props> {
  render() {
    const {
      title,
      onDismiss,
      visible,
      data,
      onCancel,
      onOk,
      maxHeight,
      color,
      onChange,
      value: currValue,
    } = this.props;
    return (
      <Dialog onDismiss={onDismiss} visible={visible}>
        <DialogTitle>{title}</DialogTitle>
        <DialogScrollArea
          style={{ maxHeight: maxHeight || 200, paddingHorizontal: 0 }}
        >
          <ScrollView>
            <View>
              {data.map(({ label, value }) => (
                <TouchableRipple key={value} onPress={() => onChange(value)}>
                  <View style={styles.row}>
                    <View pointerEvents="none">
                      <RadioButton
                        value={value}
                        checked={value === currValue}
                        color={color}
                      />
                    </View>
                    <Subheading style={styles.text}>{label}</Subheading>
                  </View>
                </TouchableRipple>
              ))}
            </View>
          </ScrollView>
        </DialogScrollArea>
        <DialogActions>
          <Button primary onPress={onCancel}>
            Cancel
          </Button>
          <Button primary onPress={onOk}>
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
