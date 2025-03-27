import React from 'react';
import ActivityIndicator from 'react-native-paper/src/components/ActivityIndicator';
import { Pulse, Bounce } from 'react-native-animated-spinkit';
import DialogContent from 'react-native-paper/src/components/Dialog/DialogContent';
import { Image, View, type ViewStyle } from 'react-native';
import { Dialog, Portal } from 'react-native-paper';

interface FLoadingProps {
  style?: ViewStyle;
  avt?: string;
  visible: boolean;
  loadFullScreen?: boolean;
  urlImg?: string;
  styleLoading?: ViewStyle;
  loadingColor?: string;
}

const FLoading: React.FC<FLoadingProps> = ({
  style,
  urlImg,
  styleLoading,
  loadingColor,
  visible,
  loadFullScreen = true,
}) =>
  loadFullScreen ? (
    <Portal>
      <Dialog
        visible={visible}
        dismissable={false}
        style={{
          height: 0,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: 'transparent',
          ...style,
        }}
      >
        <DialogContent
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LoadingUI
            style={styleLoading}
            urlImg={urlImg}
            loadingColor={loadingColor}
          />
        </DialogContent>
      </Dialog>
    </Portal>
  ) : (
    <LoadingUI />
  );

export const LoadingUI = ({
  style,
  loadingColor,
  urlImg,
}: {
  style?: ViewStyle;
  loadingColor?: string;
  urlImg?: string;
}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        ...style,
      }}
    >
      <Pulse
        size={150}
        color={loadingColor ?? '#1325AEFF'}
        style={{ position: 'absolute' }}
      ></Pulse>
      <Bounce
        size={80}
        color={loadingColor ?? '#1325AEFF'}
        style={{ position: 'absolute' }}
      ></Bounce>
      <ActivityIndicator
        size={60}
        color={loadingColor ?? '#1325AEFF'}
        style={{ position: 'absolute' }}
      />
      <Image
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          position: 'absolute',
        }}
        source={urlImg ? { uri: urlImg } : require('../assets/appstore.png')}
      />
    </View>
  );
};

export default FLoading;
