import { faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { ReactNode, createRef, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TextStyle,
  View,
  Dimensions,
} from 'react-native';
import BottomSheet, {
  hideBottomSheet,
  showBottomSheet,
} from '../bottom-sheet/bottom-sheet';
import { TextStyleSkin } from '../assets/skin/typography';
import { ColorSkin } from '../assets/skin/colors';
import TextField from '../textfield/textfield';
import { BorderSkin } from '../assets/skin/borders';

interface Props {
  value?: string | number;
  placeholder?: string;
  disabled?: boolean;
  data: Array<{
    id: string | number;
    name: string | ReactNode;
    title?: string | ReactNode;
  }>;
  onChange: (item: { id: string | number; name: string | ReactNode }) => void;
  onTap?: () => void;
  helperText?: string;
  helperTextColor?: string;
  style?: TextStyle;
  searchTitle?: string;
  allowSearch?: boolean;
  onSearch?: (value?: string) => Promise<
    | Array<{
        id: string | number;
        name: string | ReactNode;
        title?: string | ReactNode;
      }>
    | undefined
  >;
  loadMore?: (value?: string) => Promise<
    | Array<{
        id: string | number;
        name: string | ReactNode;
        title?: string | ReactNode;
      }>
    | undefined
  >;
}

interface DropdownSelectSate {
  isShow: boolean;
  value?: string | number;
  searchOptions?: Array<{ id: string | number; name: string | ReactNode }>;
  offset?: { width: number; height: number; y: number; x: number };
  style?: TextStyle;
}

const scrSize = Dimensions.get('window');
export class DropdownSelect extends React.Component<Props, DropdownSelectSate> {
  private botSheetRef = createRef<any>();
  private ref = createRef<any>();
  private dropdownRef = createRef<any>();
  constructor(props: Props) {
    super(props);
    this.state = {
      isShow: false,
      value: this.props.value,
    };
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.openDropdown = this.openDropdown.bind(this);
    this.onItemPress = this.onItemPress.bind(this);
  }

  private toggleDropdown = (): void => {
    if (this.props.onTap) this.props.onTap();
    this.state.isShow
      ? this.setState({ ...this.state, isShow: false })
      : this.openDropdown();
  };

  private openDropdown = (): void => {
    if (this.props.allowSearch) {
      showBottomSheet({
        ref: this.botSheetRef,
        enableDismiss: false,
        titleText: this.props.searchTitle ?? this.props.placeholder,
        prefixAction: (
          <TouchableOpacity
            onPress={() => {
              hideBottomSheet(this.botSheetRef);
            }}
            style={{ paddingVertical: 6, paddingRight: 8, paddingLeft: 2 }}
          >
            <Text
              style={[
                TextStyleSkin.semibold2,
                { color: ColorSkin.light.neutral_text_subtitle_color },
              ]}
            >
              Đóng
            </Text>
          </TouchableOpacity>
        ),
        children: (
          <BottomSheetListOptions
            data={this.props.data}
            onSelect={this.onItemPress}
            selected={this.state.value}
            loadMore={this.props.loadMore}
            onSearch={this.props.onSearch}
          />
        ),
      });
    } else {
      this.ref.current.measure(
        (
          _fx: number,
          _fy: number,
          _w: number,
          _h: number,
          _px: number,
          _py: number
        ) => {
          this.setState({
            ...this.state,
            isShow: true,
            offset: {
              width: _w,
              height: _h,
              y: _py,
              x: _px,
            },
          });
        }
      );
    }
  };

  private onItemPress = (item: {
    id: string | number;
    name: string | ReactNode;
  }): void => {
    this.setState({
      ...this.state,
      value: item.id,
      isShow: false,
      searchOptions: undefined,
      style: undefined,
    });
    if (this.props.allowSearch) hideBottomSheet(this.botSheetRef);
    this.props.onChange(item);
  };

  componentDidUpdate(
    prevProps: Readonly<Props>,
    _prevState: Readonly<DropdownSelectSate>,
    _snapshot?: any
  ): void {
    if (
      prevProps.data !== this.props.data ||
      prevProps.value !== this.props.value
    ) {
      this.setState({ ...this.state, value: this.props.value });
    }
  }

  render(): React.ReactNode {
    const selected = this.props.data.find((e) => e.id === this.state.value);
    return (
      <TouchableOpacity
        ref={this.ref}
        style={[
          styles.container,
          {
            borderColor: this.state.isShow
              ? ColorSkin.light.infor_main_color
              : this.props.helperText?.length
                ? (this.props.helperTextColor ??
                  ColorSkin.light.error_main_color)
                : '#00358014',
            backgroundColor: this.props.disabled
              ? '#F4F4F5'
              : this.props.style?.backgroundColor,
            ...(this.props.style ?? {}),
          },
        ]}
        onPress={this.props.disabled ? undefined : this.toggleDropdown}
      >
        {this.props.allowSearch ? (
          <BottomSheet ref={this.botSheetRef} />
        ) : (
          <Modal visible={this.state.isShow} transparent animationType="none">
            <TouchableOpacity
              style={styles.overlay}
              onPress={() => this.setState({ ...this.state, isShow: false })}
            >
              <View
                onLayout={() => {
                  this.dropdownRef.current.measure(
                    (
                      _fx: number,
                      _fy: number,
                      _w: number,
                      _h: number,
                      _px: number,
                      _py: number
                    ) => {
                      if (_py + _h > scrSize.height) {
                        this.setState({
                          ...this.state,
                          isShow: true,
                          style: {
                            left: _px,
                            bottom:
                              scrSize.height - (this.state.offset?.y ?? 0) - 28,
                            width: this.state.offset?.width,
                          },
                        });
                      }
                    }
                  );
                }}
                ref={this.dropdownRef}
                style={[
                  styles.dropdown,
                  this.state.style ?? {
                    top:
                      (this.state.offset?.y ?? 0) +
                      (this.state.offset?.height ?? 0),
                    left: this.state.offset?.x,
                    width: this.state.offset?.width,
                  },
                ]}
              >
                <BottomSheetListOptions
                  data={this.props.data}
                  onSelect={this.onItemPress}
                  selected={this.state.value}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        )}
        {selected?.name ? (
          typeof selected.name === 'string' ? (
            <Text
              style={[
                TextStyleSkin.body3,
                {
                  flex: 1,
                  fontSize:
                    this.props.style?.fontSize ?? TextStyleSkin.body3.fontSize,
                  fontFamily:
                    this.props.style?.fontFamily ??
                    TextStyleSkin.body3.fontFamily,
                  fontWeight:
                    this.props.style?.fontWeight ??
                    TextStyleSkin.body3.fontWeight,
                  lineHeight:
                    this.props.style?.lineHeight ??
                    TextStyleSkin.body3.lineHeight,
                  color: this.props.style?.color ?? TextStyleSkin.body3.color,
                  opacity: selected ? 1 : 0.4,
                },
              ]}
            >
              {selected.name}
            </Text>
          ) : (
            <View style={{ flex: 1 }}>{selected.name}</View>
          )
        ) : (
          <Text
            style={[
              TextStyleSkin.body3,
              {
                flex: 1,
                fontSize:
                  this.props.style?.fontSize ?? TextStyleSkin.body3.fontSize,
                fontFamily:
                  this.props.style?.fontFamily ??
                  TextStyleSkin.body3.fontFamily,
                fontWeight:
                  this.props.style?.fontWeight ??
                  TextStyleSkin.body3.fontWeight,
                lineHeight:
                  this.props.style?.lineHeight ??
                  TextStyleSkin.body3.lineHeight,
                color: this.props.style?.color ?? TextStyleSkin.body3.color,
                opacity: selected ? 1 : 0.4,
              },
            ]}
          >
            {this.props.placeholder ?? ''}
          </Text>
        )}
        <FontAwesomeIcon icon={faChevronDown} size={14} color="#667994" />
        {this.props.helperText?.length ? (
          <Text
            numberOfLines={1}
            style={[
              TextStyleSkin.subtitle3,
              {
                color:
                  this.props.helperTextColor ??
                  ColorSkin.light.error_main_color,
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
      </TouchableOpacity>
    );
  }
}

const BottomSheetListOptions = ({
  onSearch,
  data = [],
  selected,
  onSelect,
  loadMore,
}: {
  onSearch?: (value?: string) => Promise<
    | Array<{
        id: string | number;
        name: string | ReactNode;
        title?: string | ReactNode;
      }>
    | undefined
  >;
  loadMore?: (value?: string) => Promise<
    | Array<{
        id: string | number;
        name: string | ReactNode;
        title?: string | ReactNode;
      }>
    | undefined
  >;
  data: Array<{
    id: string | number;
    name: string | ReactNode;
    title?: string | ReactNode;
  }>;
  selected?: string | number;
  onSelect: (item: { id: string | number; name: string | ReactNode }) => void;
}) => {
  const [searchOptions, setSearchOptions] = useState<
    Array<{
      id: string | number;
      name: string | ReactNode;
      title?: string | ReactNode;
    }>
  >();
  const searchRef = useRef<any>();

  return (
    <View
      style={{
        gap: 4,
        paddingVertical: onSearch ? 8 : 0,
        width: '100%',
        minHeight: onSearch ? scrSize.height / 2 : 0,
      }}
    >
      {onSearch ? (
        <View style={{ paddingHorizontal: 16, width: '100%' }}>
          <TextField
            ref={searchRef}
            style={{
              ...TextStyleSkin.regular2,
              minHeight: 36,
              height: 36,
              paddingVertical: 0,
              paddingHorizontal: 12,
              width: '100%',
            }}
            placeholder="Tìm kiếm"
            prefix={
              <FontAwesomeIcon icon={faSearch} size={12} color="#667994" />
            }
            onChange={async (vl) => {
              if (vl.trim().length) {
                if (onSearch && vl.trim().length % 3 === 0) {
                  const res = await onSearch(vl);
                  setSearchOptions(res);
                } else {
                  setSearchOptions(
                    data.filter((e) => {
                      if (typeof e.name === 'string') {
                        return e.name;
                        // return Ultis.toSlug(e.name.toLowerCase()).includes(Ultis.toSlug(vl.trim().toLocaleLowerCase()))
                      } else {
                        return `${e.id}`
                          .toLowerCase()
                          .includes(vl.trim().toLocaleLowerCase());
                      }
                    })
                  );
                }
              } else {
                setSearchOptions(undefined);
              }
            }}
          />
        </View>
      ) : undefined}
      <View style={{ maxHeight: onSearch ? 350 : 240, width: '100%' }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ width: '100%' }}
          data={searchOptions ?? data}
          renderItem={function ({ item }) {
            return (
              <TouchableOpacity
                style={[
                  styles.item,
                  {
                    backgroundColor:
                      item.id === selected ? '#F2F5F8' : '#00000000',
                  },
                ]}
                onPress={() => {
                  onSelect(item);
                }}
              >
                {typeof (item.title ?? item.name) === 'string' ? (
                  <Text style={TextStyleSkin.label1}>
                    {item.title ?? item.name}
                  </Text>
                ) : (
                  (item.title ?? item.name)
                )}
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, _index) => `${item.id}`}
          onEndReachedThreshold={0.1}
          onEndReached={({ distanceFromEnd }) => {
            if (distanceFromEnd > 0 && loadMore) {
              loadMore(searchRef.current.value).then((res) => {
                setSearchOptions(res);
              });
            }
          }}
          ListEmptyComponent={() => (
            <Text style={{ padding: 8 }}>Không tìm thấy kết quả phù hợp</Text>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'visible',
    position: 'relative',
    flexDirection: 'row',
    height: 40,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    alignItems: 'center',
    borderRadius: 8,
    columnGap: 12,
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    maxHeight: 192,
    width: '100%',
    shadowColor: '#000000',
    shadowRadius: 4,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.5,
    borderRadius: 8,
    overflow: 'hidden',
    ...BorderSkin.border1,
  },
  overlay: {
    width: '100%',
    height: '100%',
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    borderBottomWidth: 0.5,
    backgroundColor: '#fff',
    borderBottomColor: '#00358033',
  },
});
