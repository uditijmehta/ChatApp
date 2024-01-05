import React from "react";
import {Text, View, StyleSheet} from "react-native";
import {LanguageItem} from "./styles";

function LangsItem({languages, setLang, langSelected, setLangSelected, id}) {
    
    const handlePress = () => {
        setLang(id);
        setLangSelected(id);
    }
    return (
        <View>
            <LanguageItem
                onPress={handlePress}
                className={langSelected === id ? "selectedClass" : ""} 
                id={id}
            >
                <Text style={{
                    fontWeight: "600",
                    textAlign: "center",
                    fontSize: 28,
                    color: langSelected === id ? "#378fd3" : "white",
                }}
                >{languages}
                </Text>
            </LanguageItem>
            <View
                style={{
                display: "flex",
                flexDirection: "column",
                borderBottomColor: 'white',
                position: "relative",
                borderBottomWidth: StyleSheet.hairlineWidth,
                }}
            />
        </View>
    )
}

export default LangsItem;



