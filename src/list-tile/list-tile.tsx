import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
  type StyleProp,
  Pressable,
} from 'react-native';

interface ListTileProps {
  isClickLeading?: boolean;
  disabled?: boolean;
  leading?: React.ReactNode;
  leadingContainer?: ViewStyle;
  contentContainer?: ViewStyle;
  title: string | React.ReactNode;
  titleStyle?: StyleProp<TextStyle>;
  subtitle?: string | React.ReactNode;
  subTitleStyle?: StyleProp<TextStyle>;
  trailing?: React.ReactNode;
  trailingContainer?: ViewStyle;
  style?: ViewStyle;
  listtileStyle?: ViewStyle;
  bottom?: React.ReactNode;
  onPress?: () => void;
}

const ListTile = (props: ListTileProps) => {
  const {
    leading,
    leadingContainer = {},
    contentContainer = {
      flex: 1,
    },
    title,
    titleStyle = {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#18181B',
    },
    subTitleStyle = {
      fontSize: 14,
      color: '#61616B',
    },
    subtitle,
    trailing,
    trailingContainer = {},
    bottom,
    isClickLeading = false,
    disabled = false,
    style,
    listtileStyle = { gap: 8 },
    onPress,
  } = props;

  return (
    <Pressable disabled={disabled} style={{ ...styles.container, ...style }}>
      <TouchableOpacity
        disabled={disabled}
        style={{ ...styles.listtileContainer, ...listtileStyle }}
        activeOpacity={!onPress ? 1 : 0.2}
        onPress={onPress}
      >
        {leading ? (
          <View
            style={leadingContainer}
            pointerEvents={!isClickLeading ? 'none' : undefined}
          >
            {leading}
          </View>
        ) : null}
        <View style={contentContainer}>
          {title && typeof title === 'string' ? (
            <Text
              style={[titleStyle, { paddingBottom: subtitle ? 4 : 0 }]}
              numberOfLines={2}
            >
              {title ?? ''}
            </Text>
          ) : (
            title
          )}
          {subtitle && typeof subtitle === 'string' ? (
            <Text style={subTitleStyle} numberOfLines={4}>
              {subtitle ?? ''}
            </Text>
          ) : (
            subtitle
          )}
        </View>
        {trailing ? <View style={trailingContainer}>{trailing}</View> : null}
      </TouchableOpacity>
      {bottom ? bottom : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  listtileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ListTile;
