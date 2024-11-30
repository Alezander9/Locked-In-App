import { useState } from 'react';
import { Text, YStack } from "tamagui";
import { StyleSheet, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

type DropdownInputProps = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  items: { label: string; value: string }[];
  onOpen?: () => void;
  placeholder?: string;
};

export function DropdownInput({
  label,
  value,
  onValueChange,
  items,
  onOpen,
  placeholder = "Select a Grade (required)",
}: DropdownInputProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    onOpen?.();
    setOpen(true);
  };

  return (
    <YStack 
      space="$1" 
      marginBottom="$3"
    >
      <Text fontSize="$3" fontWeight="600" color="$gray">
        {label}
      </Text>
      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          onOpen={handleOpen}
          setValue={(callback) => {
            const newValue = callback(value);
            if (typeof newValue === 'string') {
              onValueChange(newValue);
            }
          }}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownList}
          textStyle={styles.dropdownText}
          maxHeight={200}
          autoScroll
          showTickIcon
          placeholder={placeholder}
          placeholderStyle={{
            color: '#999',
            fontSize: 16,
          }}
        />
      </View>
    </YStack>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    width: '100%',
  },
  dropdown: {
    borderColor: '#E5E5E5',
    borderRadius: 8,
    backgroundColor: 'white',
    height: 45,
  },
  dropdownList: {
    borderColor: '#E5E5E5',
    backgroundColor: 'white',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
});