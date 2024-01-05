
import React, {useState} from 'react';
import {languages} from '../../utils/languages';
import {Modal, ScrollView} from 'react-native';
import {LanguageModal} from './styles';
import LangsItem from './LangsItem';
import CloseButton from './CloseButton';


function LangModal({ visible, close, animationType, setLang }) {
    const [langNames, setLangNames] = useState([]);
    const [langSelected, setLangSelected] = useState('');

    const renderLangs = () => {
        if(langNames.length === 0 || langNames.length < 20){
                languages.filter(e => {
                langNames.push(e.name); 
            })
        }
    }
    renderLangs();
    
    return (
        <Modal visible={visible} close={close} animationType={animationType}>
            <ScrollView>
                <LanguageModal>
                    <CloseButton close={close} langSelected={langSelected}/>
                    {
                        languages.map((e) => {return <LangsItem id={e.language} languages={e.name} setLang={setLang} langSelected={langSelected} setLangSelected={setLangSelected}/>})
                    }
                </LanguageModal>
            </ScrollView>
        </Modal>
    )
}

export default LangModal;