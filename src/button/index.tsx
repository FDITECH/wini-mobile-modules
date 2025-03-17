import {
  Text,
  TouchableOpacity,
  type DimensionValue,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import Winicon from '../wini-icon/wini_icon';

interface ButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  backgroundColor?: string | any;
  width?: DimensionValue;
  height?: DimensionValue;
  containerStyle?: ViewStyle;
  prefixIcon?: any;
  prefixIconSize?: number;
  title?: string | any;
  textStyle?: TextStyle;
  suffixIcon?: any;
  suffixIconSize?: number;
  borderColor?: string;
  textColor?: string | any;
}

const AppButton = (props: ButtonProps) => {
  const {
    onPress,
    backgroundColor = '#003580',
    width,
    disabled,
    height = 40,
    prefixIcon,
    title,
    textStyle = [{ color: '#00204D40' }],
    containerStyle = {},
    suffixIcon,
    prefixIconSize = 24,
    suffixIconSize = 24,
    borderColor = '#003580',
    textColor = '#FFFFFF',
  } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={
        !disabled
          ? {
              height: height,
              width: width,
              borderWidth: 1,
              backgroundColor: backgroundColor,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: borderColor,
              gap: 8,
              borderRadius: 24,
              ...containerStyle,
            }
          : {
              height: height,
              width: width,
              borderWidth: 1,
              borderColor: borderColor,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              justifyContent: 'center',
              borderRadius: 24,
              ...containerStyle,
              backgroundColor: '#EAEAEC',
            }
      }
    >
      {prefixIcon && typeof prefixIcon === 'string' ? (
        <Winicon src={prefixIcon} size={prefixIconSize} color={textColor} />
      ) : (
        prefixIcon
      )}
      {title && typeof title === 'string' ? (
        <Text
          style={
            !disabled
              ? { fontSize: 16, ...textStyle, color: textColor }
              : {
                  fontSize: 16,
                  ...textStyle,
                  color: textColor,
                }
          }
        >
          {title}
        </Text>
      ) : (
        (title ?? null)
      )}
      {suffixIcon && typeof suffixIcon === 'string' ? (
        <Winicon src={suffixIcon} size={suffixIconSize} color={textColor} />
      ) : (
        suffixIcon
      )}
    </TouchableOpacity>
  );
};

export default AppButton;
