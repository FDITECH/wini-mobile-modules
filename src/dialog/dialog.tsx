import React from 'react';
import { ComponentStatus, getStatusIcon } from '../component-status';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { TypoSkin } from '../../assets/skin/typography';
import { ColorThemes } from '../../assets/skin/colors';

interface DialogState {
  readonly open?: boolean;
  title: string;
  status: ComponentStatus;
  content: string | React.ReactNode;
  titleSubmit?: string;
  titleCancel?: string;
  onSubmit: Function;
  onCancel?: Function;
  submitTitle?: string;
}

export const showDialog = ({
  ref,
  title,
  status,
  content,
  onSubmit,
  onCancel,
  submitTitle,
}: {
  ref: React.MutableRefObject<FDialog>;
  title?: string;
  status?: ComponentStatus;
  content?: string | React.ReactNode;
  titleSubmit?: string;
  titleCancel?: string;
  onSubmit?: Function;
  onCancel?: Function;
  submitTitle?: string;
}) => {
  ref?.current?.showDialogNoti({
    title: title ?? '',
    status: status ?? ComponentStatus.INFOR,
    content: content ?? '',
    onSubmit: onSubmit ?? (() => {}),
    onCancel: onCancel ?? (() => {}),
    submitTitle: submitTitle,
  });
};

export default class FDialog extends React.Component<Object, DialogState> {
  state: Readonly<DialogState> = {
    open: false,
    title: '',
    status: ComponentStatus.INFOR,
    content: '',
    onSubmit: () => {},
    onCancel: () => {},
  };
  showDialogNoti(data: DialogState) {
    this.setState({ open: true, ...data });
  }

  closeDialog() {
    this.setState({ open: false });
  }

  render() {
    switch (this.state.status) {
      case ComponentStatus.ERROR:
        var bgColor = ColorThemes.light.error_background;
        break;
      case ComponentStatus.WARNING:
        bgColor = ColorThemes.light.warning_background;
        break;
      case ComponentStatus.SUCCSESS:
        bgColor = ColorThemes.light.success_background;
        break;
      default:
        bgColor = ColorThemes.light.infor_background;
        break;
    }
    return (
      <Modal
        animationType="slide"
        visible={this.state.open ?? false}
        transparent
      >
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 35 : 0}
            style={[styles.container]}
          >
            {getStatusIcon(this.state.status, 64)}
            <Pressable style={{ gap: 4, marginTop: 12, alignItems: 'center' }}>
              {this.state.title ? (
                <Text style={[TypoSkin.title2, { textAlign: 'center' }]}>
                  {this.state.title}
                </Text>
              ) : null}
              {typeof this.state.content === 'string' ? (
                <Text
                  style={[
                    TypoSkin.body3,
                    { color: '#666666', textAlign: 'center' },
                  ]}
                >
                  {this.state.content}
                </Text>
              ) : (
                this.state.content
              )}
            </Pressable>
            <View style={{ flexDirection: 'row', marginVertical: 24, gap: 8 }}>
              <TouchableOpacity
                style={[styles.footerButton]}
                onPress={() => {
                  if (this.state.onCancel) this.state.onCancel();
                  this.closeDialog();
                }}
              >
                <Text style={[TypoSkin.buttonText1, { color: '#00000099' }]}>
                  {this.state.titleCancel ?? 'Hủy'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.footerButton, { backgroundColor: bgColor }]}
                onPress={() => {
                  if (this.state.onSubmit) this.state.onSubmit();
                  this.closeDialog();
                }}
              >
                <Text style={[TypoSkin.buttonText1, { color: '#fff' }]}>
                  {this.state.titleSubmit ?? 'Xác nhận'}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    height: '100%',
    width: '100%',
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: '#00000080',
  },
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
  },
  footerButton: {
    backgroundColor: '#F8F7F7',
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
