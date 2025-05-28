import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Button} from 'react-native';


const ChangeColorScreen : React.FC = () => {
    const [color, setColor] = useState<string>('red');
    const [colorName, setColorName] = useState<string>('rouge');

    useEffect(()=>{
        // Change colorName si color change
        if (color === 'red') {
            setColorName('Rouge');
        } else if (color === 'green') {
            setColorName('Vert');
        } else {
            setColorName('Bleu');
        } 
    }, [color]);

    return(
        <View style={[{ backgroundColor: color }, Styles.container]}>
            <Text>Couleur actuelle : {colorName}</Text>
            <Button title='Rouge' onPress={() => setColor("red")}/>
            <Button title='Vert' onPress={() => setColor("green")}/>
            <Button title='Bleu' onPress={() => setColor("blue")}/>
        </View>
    )
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    button:{
        width: '50%',
    }
})

export default ChangeColorScreen