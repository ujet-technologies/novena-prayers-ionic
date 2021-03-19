import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router'
import { IonList, IonItem, IonLabel, IonRippleEffect, IonButton, IonIcon, IonToast, IonGrid, IonRow, IonCol, IonLoading, IonItemSliding, IonItemOptions, IonItemOption } from '@ionic/react';
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
    const [loading, setLoading] = useState(false)

    useEffect(()  => {
        
        setLoading(true)

        let prayerDataFile = 'prayer-data.json'

        Storage.get({key: prayerDataFile}).then(({value}) => {
            if (value !== null) {
                let val = JSON.parse(value)
                setPrayers(val)
                setLoading(false)
            }else{
               fetch(`https://novena-prayers.herokuapp.com/docs/${prayerDataFile}`)
               .then(response => response.json())
                .then(response => {
                    let val = JSON.stringify(response)
                    Storage.set({key: prayerDataFile, value: val}) 
                    setPrayers(response)
                    setLoading(false)
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
            <IonLoading isOpen={loading} /> 
            <IonList>
            {/* <IonGrid> */}
                {prayers.map((prayer) => { 
                    return (
                        <IonItem key = {prayer.id} style={{ width: '100%' }}>
                            <IonItemSliding >
                            <IonLabel onClick={() => openPrayer(prayer)} >{prayer.name}</IonLabel>
                            <IonItemOptions side = "end">
                                <IonItemOption color = "light" onClick = {() => {handleDelete(prayer.file)}}><IonIcon color = "danger" size = "small" slot='icon-only' icon={trashSharp} /></IonItemOption>
                            </IonItemOptions>
                            </IonItemSliding>
                    {/* //         <IonCol size='9'>
                    //             <IonLabel onClick={() => openPrayer(prayer)} >{prayer.name}</IonLabel>
                    //         </IonCol>
                    //         <IonCol size='3' style={{ textAlign: 'center' }}>
                    //             <IonButton color='light' size='small' onClick = {() => {handleDelete(prayer.file)}}><IonIcon slot='icon-only' icon={trashSharp} /></IonButton>
                    //         </IonCol>  */}
                     <IonRippleEffect />
                         </IonItem>
                    )
                })}
                </IonList>
            {/* </IonGrid> */}
            <IonToast isOpen={showToast} message={toastMessage} position={'middle'} color={'warning'} onDidDismiss={resetToast} duration={950} />
        </Layout>
    )

}
