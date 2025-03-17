import { useState, type ReactNode } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { TypoSkin } from '../../assets/skin/typography';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export function Checkbox({
  onChange,
  value = false,
  size = 20,
  borderRadius = 2,
  disable = false,
}: {
  onChange: (value: boolean) => void;
  value: boolean;
  size?: number;
  borderRadius?: number;
  disable?: boolean;
}) {
  const [checked, setChecked] = useState(value);

  return (
    <TouchableOpacity
      onPress={() => {
        if (disable) {
          return;
        }
        const newValue = !checked;
        setChecked(newValue);
        onChange(newValue);
      }}
      style={{ padding: 4 }}
    >
      <View
        style={[
          {
            borderRadius: borderRadius,
            width: size,
            height: size,
            borderWidth: 2,
            alignItems: 'center',
            justifyContent: 'center',
          },
          checked ? styles.activeStyle : styles.inactiveStyle,
        ]}
      >
        <FontAwesomeIcon
          icon={faCheck}
          size={size * 0.64}
          color="#fff"
          style={{ display: checked ? 'flex' : 'none' }}
        />
        <View style={{ display: checked ? 'none' : 'flex' }} />
      </View>
    </TouchableOpacity>
  );
}

export function FMultiCheckbox({
  data = [],
  selected,
  onSelect,
  size = 20,
  disable = false,
}: {
  size?: number;
  borderRadius?: number;
  disable?: boolean;
  data: Array<{ id: string | number; name: string | ReactNode }>;
  selected?: Array<string> | Array<number>;
  onSelect: (item: { id: string | number; name: string | ReactNode }) => void;
}) {
  return (
    <View pointerEvents={disable ? 'none' : 'auto'}>
      <FlatList
        horizontal={true}
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              onSelect(item);
            }}
            style={{ padding: 4, flexDirection: 'row', gap: 8 }}
          >
            <Text
              style={[
                TypoSkin.regular2,
                { color: disable ? '#667994' : '#00204D' },
              ]}
            >
              {item.name}
            </Text>
            <Checkbox
              size={size}
              value={selected?.some((e) => e == item.id) ?? false}
              onChange={() => onSelect(item)}
              disable={disable}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => `${item.id}`}
        onEndReachedThreshold={0.1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  activeStyle: {
    backgroundColor: '#074EB0FF',
    borderColor: 'transparent',
  },
  inactiveStyle: {
    borderColor: '#00358033',
  },
});
