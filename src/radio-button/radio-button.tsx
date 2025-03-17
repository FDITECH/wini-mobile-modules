import React, { useEffect } from 'react';
import { TouchableOpacity, View, type ViewStyle } from 'react-native';
import { ColorThemes } from '../../assets/skin/colors';

interface FRadioProps {
  value: string;
  status?: boolean;
  disabled?: boolean;
  onPress: (value: boolean) => void;
  style?: ViewStyle;
}

export default function RadioButton(props: FRadioProps) {
  const [checked, setChecked] = React.useState(props.status);

  useEffect(() => {
    setChecked(props.status);
  }, [props.status]);

  return (
    <TouchableOpacity
      key={props.value}
      activeOpacity={1}
      disabled={props.disabled}
      onPress={() => {
        const temp = !checked;
        setChecked(temp);
        props.onPress(temp);
      }}
      style={[
        {
          height: 24,
          width: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: ColorThemes.light.primary_main_color,
          alignItems: 'center',
          justifyContent: 'center',
        },
        props.style,
      ]}
    >
      {checked ? (
        <View
          style={{
            height: 12,
            width: 12,
            borderRadius: 6,
            backgroundColor: ColorThemes.light.primary_main_color,
          }}
        />
      ) : null}
    </TouchableOpacity>
  );
}
