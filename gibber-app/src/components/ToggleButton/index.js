import React from 'react';
import {View, Switch, StyleSheet} from 'react-native';

const ToggleButton = ({value, onValueChange, label, ...props}) => {
    return (
        <View style={styles.container}>
            <Switch
                onValueChange={onValueChange}
                value={value}
                style={{transform: [{scaleX: .65}, {scaleY: .65}], marginTop: 25}}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop:10,
    },
});

export default ToggleButton;
