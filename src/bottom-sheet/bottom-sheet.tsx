import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import React, { useRef } from 'react';
import { TextStyleSkin } from '../assets/skin/typography';

interface BottomSheetState {
  isVisible: boolean;
  enableDismiss?: boolean;
  dismiss?: () => void;
  title?: React.ReactNode;
  prefixAction?: React.ReactNode;
  suffixAction?: React.ReactNode;
  children: React.ReactNode;
}

export default class BottomSheet extends React.Component<
  any,
  BottomSheetState
> {
  state: Readonly<BottomSheetState> = {
    isVisible: false,
    children: <View />,
  };

  showBottomSheet({
    enableDismiss,
    title,
    dismiss,
    prefixAction,
    suffixAction,
    children,
  }: {
    enableDismiss?: boolean;
    dismiss?: () => void;
    titleText?: string;
    title?: React.ReactNode;
    prefixAction?: React.ReactNode;
    suffixAction?: React.ReactNode;
    children: React.ReactNode;
  }) {
    this.setState({
      isVisible: true,
      enableDismiss: enableDismiss,
      title: title,
      dismiss: dismiss,
      prefixAction: prefixAction,
      suffixAction: suffixAction,
      children: children,
    });
  }

  hideBottomSheet() {
    this.setState({ isVisible: false });
  }

  render(): React.ReactNode {
    return (
      <Modal
        visible={this.state.isVisible ?? false}
        transparent
        statusBarTranslucent={true}
        animationType="slide"
      >
        <Container
          onDismiss={
            this.state.enableDismiss
              ? () => {
                  this.hideBottomSheet();
                  if (this.state.dismiss) this.state.dismiss();
                }
              : undefined
          }
        >
          <KeyboardAvoidingView style={[styles.container]}>
            <View
              style={{
                width: 56,
                marginTop: 8,
                height: 6,
                borderRadius: 10,
                backgroundColor: '#EAEAEA',
              }}
            />
            <Pressable style={{ width: '100%' }}>
              {this.state.title ? (
                <View style={styles.header}>
                  {this.state.prefixAction}
                  <Text
                    style={[
                      TextStyleSkin.title3,
                      {
                        position: 'absolute',
                        left: '12%',
                        right: '12%',
                        textAlign: 'center',
                        top: 12,
                      },
                    ]}
                  >
                    {this.state.title ?? '-'}
                  </Text>
                  {this.state.suffixAction}
                </View>
              ) : (
                this.state.title
              )}
            </Pressable>
            {this.state.children}
          </KeyboardAvoidingView>
        </Container>
      </Modal>
    );
  }
}

const scrSize = Dimensions.get('window');
const Container = ({
  children,
  onDismiss,
}: {
  children: React.ReactNode;
  onDismiss?: () => void;
}) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (gestureState) => {
        //return true if user is swiping, return false if it's a single click
        return !(
          gestureState.nativeEvent.pageX === 0 &&
          gestureState.nativeEvent.pageY === 0
        );
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderEnd: (ev) => {
        if (ev.nativeEvent.pageY >= scrSize.height - 30) {
          if (onDismiss) onDismiss();
        } else {
          pan.y.setValue(0);
        }
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  return onDismiss ? (
    <Animated.View
      style={{
        ...styles.overlay,
        backgroundColor: pan.y.interpolate({
          inputRange: [0, scrSize.height],
          outputRange: ['#00000080', '#00000000'],
          extrapolate: 'clamp',
        }),
      }}
      {...panResponder.panHandlers}
    >
      <Pressable style={styles.dismissOverlay} onPress={onDismiss} />
      <Animated.View
        style={{
          alignItems: 'center',
          gap: 8,
          width: '100%',
          transform: [
            {
              translateY: pan.y.interpolate({
                inputRange: [0, scrSize.height],
                outputRange: [0, scrSize.height],
                extrapolate: 'clamp',
              }),
            },
          ],
        }}
      >
        {children}
      </Animated.View>
    </Animated.View>
  ) : (
    <View style={{ ...styles.overlay, backgroundColor: '#00000080' }}>
      <View style={{ alignItems: 'center', gap: 8, width: '100%' }}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    height: '100%',
    width: '100%',
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  dismissOverlay: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    opacity: 0.01,
  },
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 48,
    width: '100%',
    position: 'relative',
  },
});

export const showBottomSheet = ({
  ref,
  enableDismiss,
  titleText,
  title,
  dismiss,
  prefixAction,
  suffixAction,
  children,
}: {
  ref: React.MutableRefObject<BottomSheet>;
  enableDismiss?: boolean;
  dismiss?: () => void;
  titleText?: string;
  title?: React.ReactNode;
  prefixAction?: React.ReactNode;
  suffixAction?: React.ReactNode;
  children: React.ReactNode;
}) => {
  ref.current.showBottomSheet({
    dismiss: dismiss,
    enableDismiss: enableDismiss,
    prefixAction: prefixAction,
    suffixAction: suffixAction,
    title: title,
    titleText: titleText,
    children: children,
  });
};
export const hideBottomSheet = (ref: React.MutableRefObject<BottomSheet>) => {
  ref.current.hideBottomSheet();
};
