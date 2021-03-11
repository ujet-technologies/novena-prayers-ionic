import React, { useEffect } from 'react';
import { useState } from 'react';
import { RouteComponentProps } from 'react-router'
import { IonItem, IonLabel, IonList, IonText, IonToast } from '@ionic/react';
import { Plugins } from '@capacitor/core';
import { Layout } from './Layout';
import { getWebsiteData } from '../utils/website';


const {Browser, Storage} = Plugins;


interface WebsiteListProps extends RouteComponentProps {

}


interface Site {
    id: string
    name: string
    website: string
    youtube: string
}


export const WebsiteList = (props: WebsiteListProps ) => {

    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('Howdy')
    const [websiteData, setWebsiteData] = useState<Site[]>([])

    const openWebsite = (site: Site) => {
        if (site.website !== null) {
            Browser.open({url: site.website})
        }
        else {
            setToastMessage(`Website for\n ${site.name}\n is not available now`)
            setShowToast(true)
        }
    }

    const openYoutube = (site: Site) =>  {
        if (site.youtube !== null) {
            props.history.push(`/websites/${site.id}`)
        }
        else {
            setToastMessage(`Youtube channel for\n ${site.name}\n is not available now`)
            setShowToast(true)
        }
    }

    const resetToast = () => {
        setToastMessage('')
        setShowToast(false)
    }

    useEffect(()  => {

        let websiteDataFile = 'website-data.json'

        Storage.get({key: websiteDataFile}).then(({value}) => {
            if (value !== null) { 
                let val = JSON.parse(value)
                setWebsiteData(val)
             }else{
            fetch(`http://www.ujet.in/docs/${websiteDataFile}`) 
            .then(response => response.json())
            .then((response) => {
                let val = JSON.stringify(response)
                Storage.set({key: websiteDataFile, value: val})
                setWebsiteData(response)
            })
        }
    }) 
    
    }, [])
         
    return(
        <Layout title="Youtube" {...props}>
            <IonList>   
                {websiteData.map((site: Site) =>{
                    return(
                        <IonItem key={site.id as React.Key}>
                            <span className="ion-activatable ripple-parent">
                                <IonLabel>{site.name} </IonLabel>
                                <IonText color='secondary' className='website-option' onClick={() => { openYoutube(site) }}>Youtube</IonText>
                                <IonText className='website-option' onClick={() => { openWebsite(site) }}>Website</IonText>
                            </span>
                        </IonItem>                   
                         )
                })}
            </IonList>
            <IonToast isOpen={showToast} message={toastMessage} position={'middle'} color={'tertiary'} onDidDismiss={resetToast} duration={950} />
        </Layout>
    )

}
