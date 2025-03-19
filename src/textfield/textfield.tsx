import {
  type ColorValue,
  type KeyboardTypeOptions,
  type NativeSyntheticEvent,
  type ReturnKeyTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  type TextInputFocusEventData,
  type TextStyle,
  View,
} from 'react-native';
import { TypoSkin } from '../../assets/skin/typography';
import React from 'react';
import { ColorThemes } from '../../assets/skin/colors';

interface TextFieldProps {
  value?: string;
  maxLength?: number;
  numberOfLines?: number;
  onPress?: () => void;
  onChange?: (e: string) => void;
  onSubmit?: (e: string) => void;
  onBlur?: (
    e: NativeSyntheticEvent<TextInputFocusEventData>,
    value: string
  ) => void;
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  placeholder?: string;
  returnKeyType?: ReturnKeyTypeOptions | undefined;
  disabled?: boolean;
  disabledBg?: string;
  multiline?: boolean;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
  helperText?: string;
  helperTextColor?: string;
  style?: TextStyle;
  autoFocus?: boolean;
  secureTextEntry?: boolean | undefined;
  type?: KeyboardTypeOptions;
}

interface TextFieldState {
  value: string;
  focused: boolean;
  contentHeight?: number;
}

export default class TextField extends React.Component<
  TextFieldProps,
  TextFieldState
> {
  state: Readonly<TextFieldState> = {
    value: this.props.value ?? '',
    focused: false,
  };

  value = '';
  private backgroundColor: string | undefined | ColorValue;
  private fontFamily: string | undefined = '';
  private fontSize: string | undefined = '';
  private fontWeight: string | undefined = '';
  private borderColor: string | undefined | ColorValue;
  private color: string | undefined | ColorValue;
  private textAlignVertical: string | undefined = '';
  private textAlign: string | undefined = '';

  componentDidUpdate(prevProps: Readonly<TextFieldProps>): void {
    if (prevProps.value !== this.props.value) {
      this.setState({ value: this.props.value ?? '' });
    }
  }

  render(): React.ReactNode {
    if (this.props.style) {
      if (!this.backgroundColor)
        this.backgroundColor = this.props.style?.backgroundColor;
      if (!this.fontFamily?.length)
        this.fontFamily = this.props.style?.fontFamily;
      if (!this.fontSize?.length)
        this.fontSize = this.props.style?.fontSize as any;
      if (!this.fontWeight?.length)
        this.fontWeight = this.props.style?.fontWeight as any;
      if (!this.borderColor) this.borderColor = this.props.style?.borderColor;
      if (!this.color) this.color = this.props.style?.color;
      if (!this.textAlignVertical?.length)
        this.textAlignVertical = this.props.style?.textAlignVertical;
      if (!this.textAlign?.length) this.textAlign = this.props.style?.textAlign;
      delete this.props.style.backgroundColor;
      delete this.props.style.fontFamily;
      delete this.props.style.fontSize;
      delete this.props.style.fontWeight;
      delete this.props.style.borderColor;
      delete this.props.style.color;
    }
    return (
      <View
        style={[
          textFieldStyle.container,
          {
            borderColor: this.state.focused
              ? ColorThemes.light.infor_border_color
              : this.props.helperText?.length
                ? (this.props.helperTextColor ??
                  ColorThemes.light.error_main_color)
                : (this.borderColor ?? '#00358014'),
            backgroundColor:
              (this.props.disabled ?? false)
                ? (this.props.disabledBg ?? '#F4F4F5')
                : this.backgroundColor,
            height: this.props.multiline ? undefined : 48,
            ...(this.props.style ?? {}),
          },
        ]}
      >
        {this.props.prefix}
        <View
          style={[
            { justifyContent: 'center', alignItems: 'center', flex: 1 },
            this.props.multiline || !this.state.contentHeight
              ? { height: this.state.contentHeight }
              : { height: '100%' },
          ]}
        >
          <TextInput
            style={[
              {
                width: '100%',
                flex: 1,
                padding: 0,
                height: '100%',
                textAlign: this.textAlign as any,
                textAlignVertical: this.textAlignVertical as any,
                fontSize: (this.fontSize ?? TypoSkin.body3.fontSize) as any,
                fontFamily: this.fontFamily ?? TypoSkin.body3.fontFamily,
                fontWeight: (this.fontWeight ??
                  TypoSkin.body3.fontWeight) as any,
                color: this.color ?? TypoSkin.body3.color,
              },
            ]}
            placeholder={this.props.placeholder}
            placeholderTextColor={'#161C2466'}
            multiline={this.props.multiline}
            numberOfLines={this.props.numberOfLines}
            autoFocus={this.props.autoFocus}
            defaultValue={this.state.value}
            onPress={this.props.onPress}
            secureTextEntry={this.props.secureTextEntry}
            returnKeyType={this.props.returnKeyType}
            onFocus={(ev: NativeSyntheticEvent<TextInputFocusEventData>) => {
              this.setState({ ...this.state, focused: true });
              if (this.props.onFocus) this.props.onFocus(ev);
            }}
            onChangeText={(value) => {
              this.value = value;
              if (this.props.onChange) this.props.onChange(value);
            }}
            onBlur={(ev: NativeSyntheticEvent<TextInputFocusEventData>) => {
              this.setState({ ...this.state, focused: false });
              if (this.props.onBlur) this.props.onBlur(ev, this.value);
            }}
            keyboardType={this.props.type}
            maxLength={this.props.maxLength}
            readOnly={this.props.disabled}
            onSubmitEditing={() => {
              if (this.props.onSubmit) this.props.onSubmit(this.value);
            }}
          />
        </View>
        {this.props.suffix}
        {this.props.helperText?.length ? (
          <Text
            numberOfLines={1}
            style={[
              TypoSkin.subtitle4,
              {
                color:
                  this.props.helperTextColor ??
                  ColorThemes.light.error_main_color,
                position: 'absolute',
                bottom: 0,
                left: 2,
                transform: [{ translateY: 22 }],
              },
            ]}
          >
            {this.props.helperText}
          </Text>
        ) : null}
      </View>
    );
  }
}

const textFieldStyle = StyleSheet.create({
  container: {
    overflow: 'visible',
    position: 'relative',
    flexDirection: 'row',
    minHeight: 40,
    borderWidth: 1,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    columnGap: 12,
    width: '100%',
  },
});
