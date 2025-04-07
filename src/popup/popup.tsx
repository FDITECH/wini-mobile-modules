import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

interface PopupState {
  readonly open?: boolean;
  enableDismiss?: boolean;
  children: React.ReactNode;
}

export const showPopup = ({
  ref,
  enableDismiss,
  children,
}: {
  ref: React.MutableRefObject<FPopup>;
  enableDismiss?: boolean;
  children: React.ReactNode;
}) => {
  ref.current.showPopup({
    children: children,
    enableDismiss: enableDismiss,
  });
};

export const closePopup = (ref: React.MutableRefObject<FPopup>) => {
  ref.current.closePopup();
};

export class FPopup extends React.Component<Object, PopupState> {
  state: Readonly<PopupState> = {
    open: false,
    children: <View />,
  };
  showPopup(data: PopupState) {
    this.setState({ open: true, ...data });
  }

  closePopup() {
    this.setState({ open: false });
  }

  render() {
    return (
      <Modal
        visible={this.state.open ?? false}
        transparent
        statusBarTranslucent={true}
        animationType="slide"
      >
        <View style={styles.overlay}>
          <Pressable
            style={styles.dismissOverlay}
            onPress={() => {
              if (this.state.enableDismiss) this.closePopup();
            }}
          />
          <View style={[styles.container]}>{this.state.children}</View>
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
    justifyContent: 'center',
    position: 'relative',
  },
  dismissOverlay: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000080',
  },
  container: {
    flex: 1,
    width: '100%',
    maxHeight: '100%',
    minHeight: '10%',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
