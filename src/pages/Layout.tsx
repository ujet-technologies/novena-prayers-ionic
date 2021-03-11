import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons } from '@ionic/react'
import { logoYoutube, bookOutline } from 'ionicons/icons'


interface LayoutProps {
    title: string
    history: any
}


export const Layout: React.FC<LayoutProps> = (props) => {

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar style={{ textAlign: "center" }}>
                    <IonButtons slot='start'>
                        <IonButton onClick={(e) => { e.preventDefault(); props.history.push('/websites') }}>
                            <IonIcon slot='icon-only' icon={logoYoutube} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle>{props.title}</IonTitle>
                    <IonButtons slot='end'>
                        <IonButton onClick={(e) => { e.preventDefault(); props.history.push('/prayers') }}>
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