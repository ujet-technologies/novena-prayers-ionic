import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router'
import { IonList, IonItem, IonLabel, IonRippleEffect, IonButton, IonIcon, IonToast, IonGrid, IonRow, IonCol } from '@ionic/react';
import { Plugins } from "@capacitor/core";
import { Layout } from './Layout' 
import { trashSharp } from 'ionicons/icons';


const {Storage} = Plugins


interface PrayerListProps extends RouteComponentProps {

}


interface Prayer {
    id: string
    name: string
    file: string
}


export const PrayerList = (props: PrayerListProps) => {

    const [prayers, setPrayers] = useState<Prayer[]>([])
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('Howdy')

    useEffect(()  => {

        let prayerDataFile = 'prayer-data.json'

        Storage.get({key: prayerDataFile}).then(({value}) => {
            if (value !== null) {
                let val = JSON.parse(value)
                setPrayers(val)
            }else{
               fetch(`https://novena-prayers.herokuapp.com/docs/${prayerDataFile}`)
               .then(response => response.json())
                .then(response => {
                    let val = JSON.stringify(response)
                    Storage.set({key: prayerDataFile, value: val}) 
                    setPrayers(response)
                })
            }
        })

    }, [])

    const openPrayer = (prayer: Prayer) => {
        props.history.push(`/prayers/${prayer.id}`)
    }
    
    const handleDelete = (pfile: string) =>{
        Storage.get({key: pfile}).then(({value}) => {
            //console.log(typeof(value))
            if (value === null) {
                setToastMessage( pfile +`\n is not downloaded in your device`)
                setShowToast(true)
                //console.log('No File')
            }else{                
                Storage.remove({key: pfile})
                setToastMessage( '"Deleted" '+pfile +`\n is now not in your device`)
                setShowToast(true)
                //console.log(pfile)

            }
        })
    }

    const resetToast = () => {
        setToastMessage('')
        setShowToast(false)
    }
   
    return(
        <Layout title="Prayers" {...props}>
            <IonGrid>
                {prayers.map((prayer) => { 
                    return (
                        <IonRow key = {prayer.id} style={{ width: '100%' }}>
                            <IonCol size='9'>
                                <IonLabel onClick={() => openPrayer(prayer)} >{prayer.name}</IonLabel>
                            </IonCol>
                            <IonCol size='3' style={{ textAlign: 'center' }}>
                                <IonButton color='light' size='small' onClick = {() => {handleDelete(prayer.file)}}><IonIcon slot='icon-only' icon={trashSharp} /></IonButton>
                            </IonCol>
                            <IonRippleEffect />
                        </IonRow>
                    )
                })}
            </IonGrid>
            <IonToast isOpen={showToast} message={toastMessage} position={'middle'} color={'warning'} onDidDismiss={resetToast} duration={950} />
        </Layout>
    )

}
