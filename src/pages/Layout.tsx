import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon, IonBackButton, IonButtons } from '@ionic/react';
import { logoYoutube, bookOutline } from 'ionicons/icons';


interface LayoutProps {
    title: string
}


export const Layout: React.FC<LayoutProps> = (props: any) => {

    const refreshPage = ()=>{
        window.location.reload();
     }

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar style={{ textAlign: "center" }}>
                    <IonButtons slot='start'>
                        <IonButton onClick={(e) => {e.preventDefault(); props.history.push('/websites');refreshPage()}}>
                            <IonIcon slot='icon-only' icon={logoYoutube} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle>{props.title}</IonTitle>
                    <IonButtons slot='end'>
                        <IonButton onClick={(e) => {e.preventDefault(); props.history.push('/prayers');refreshPage()}}>
                            <IonIcon slot='icon-only' icon={bookOutline} />
                        </IonButton>
                    </IonButtons>
        </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                {props.children}
            </IonContent>
        </IonPage>
    )

}