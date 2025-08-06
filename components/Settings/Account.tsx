import {
	AntDesign,
	Feather,
	MaterialCommunityIcons,
	MaterialIcons,
} from "@expo/vector-icons";
import React, { JSX } from "react";
import {
	GestureResponderEvent,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";

type MenuItem = {
  key: string;
  icon: JSX.Element;
  title: string;
  onPress: (e: GestureResponderEvent) => void;
};

const menuItems: MenuItem[] = [
  {
    key: "change-password",
    icon: <MaterialIcons name="lock-outline" size={22} color="#6366F1" />,
    title: "Change Password",
    onPress: () => {
      /* TODO: navigate to change password */
    },
  },
  {
    key: "children-info",
    icon: (
      <MaterialCommunityIcons
        name="account-child-outline"
        size={22}
        color="#6366F1"
      />
    ),
    title: "Children Information",
    onPress: () => {
      /* TODO: navigate to children info */
    },
  },
  {
    key: "delete-account",
    icon: <AntDesign name="deleteuser" size={22} color="#EF4444" />,
    title: "Delete Account",
    onPress: () => {
      /* TODO: handle account deletion */
    },
  },
];

const Account: React.FC = () => (
  <View style={styles.card}>
    <Text style={styles.heading}>Account</Text>
    {menuItems.map((item, idx) => (
      <View key={item.key}>
        <Pressable
          onPress={item.onPress}
          style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
        >
          <View style={styles.itemLeft}>
            {item.icon}
            <Text
              style={[
                styles.itemText,
                {
                  color: item.title.includes("Delete") ? "#EF4444" : "#1F2937",
                },
              ]}
            >
              {item.title}
            </Text>
          </View>
          <Feather
            name="chevron-right"
            size={20}
            color={item.title.includes("Delete") ? "#EF4444" : "#9CA3AF"}
          />
        </Pressable>
        {idx < menuItems.length - 1 && <View style={styles.divider} />}
      </View>
    ))}
  </View>
);

export default Account;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFF",
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemPressed: {
    backgroundColor: "rgba(99, 102, 221, 0.1)",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemText: {
    fontSize: 16,
    color: "#1F2937",
    marginLeft: 12,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#1F2937",
    marginVertical: 16,
  },
});
