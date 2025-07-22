import { MaterialIcons } from "@expo/vector-icons";
import React, { ComponentProps } from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface SearchInputFieldProps {
  materialIconName: ComponentProps<typeof MaterialIcons>["name"];
  placeholder: string;
  backgroundColor: string;
  marginTop: number;
  inputProps?: object;
}

const SearchInputField: React.FC<SearchInputFieldProps> = ({
  materialIconName,
  placeholder,
  backgroundColor,
  marginTop,
  inputProps = {},
}) => {
  return (
    <View
      style={[
        styles.searchBar,
        { backgroundColor: backgroundColor, marginTop: marginTop },
      ]}
    >
      <MaterialIcons
        name={materialIconName}
        size={20}
        color="#4A90E2"
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        {...inputProps}
      />
    </View>
  );
};

export default SearchInputField;

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    borderRadius: 30,
    alignItems: "center",
    paddingHorizontal: 15,
    height: 45,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
});
