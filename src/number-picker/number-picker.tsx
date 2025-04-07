import {
  StyleSheet,
  Text,
  type TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import { TextStyleSkin } from '../assets/skin/typography';
import { useState } from 'react';
import Winicon from '../wini-icon/wini_icon';
import { ColorSkin } from '../assets/skin/colors';

export default function NumberPicker({
  initValue = 0,
  hideMinus = false,
  titleStyle = {},
  buttonStyle = {},
  onChange,
  style = {},
  disabled = false,
}: {
  initValue?: number;
  hideMinus?: boolean;
  titleStyle?: TextStyle;
  buttonStyle?: TextStyle;
  onChange: (value: number) => void;
  style?: TextStyle;
  disabled?: boolean;
}) {
  const [value, setValue] = useState<number>(initValue);

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={
          disabled || value === 0
            ? undefined
            : () => {
                if (value) {
                  const newValue = value - 1;
                  setValue(newValue);
                  onChange(newValue);
                }
              }
        }
        style={[
          styles.button,
          buttonStyle,
          {
            backgroundColor:
              disabled || value === 0
                ? ColorSkin.light.neutral_disable_background_color
                : buttonStyle.backgroundColor,
            opacity: hideMinus ? 0 : 1,
          },
        ]}
      >
        <Winicon src="outline/layout/minus" size={12} color="#161C24A3" />
      </TouchableOpacity>
      <Text
        style={[
          styles.title,
          titleStyle,
          { color: disabled ? '#161C2452' : (buttonStyle.color ?? '#161C24') },
        ]}
      >
        {value ?? 0}
      </Text>
      <TouchableOpacity
        onPress={
          disabled
            ? undefined
            : () => {
                if (value != undefined) {
                  const newValue = value + 1;
                  setValue(newValue);
                  onChange(newValue);
                }
              }
        }
        style={[
          styles.button,
          buttonStyle,
          {
            backgroundColor: disabled
              ? ColorSkin.light.neutral_disable_background_color
              : buttonStyle.backgroundColor,
          },
        ]}
      >
        <Winicon src="outline/layout/plus" size={12} color="#161C24A3" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  button: {
    padding: 0,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    borderColor: '#00358033',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    ...TextStyleSkin.title5,
    textAlign: 'center',
  },
});
