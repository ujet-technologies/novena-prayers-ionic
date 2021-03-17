import { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';

import { useIonRouter, IonToast, IonAlert } from '@ionic/react';

import { Plugins, PushNotification, PushNotificationToken, PushNotificationActionPerformed } from '@capacitor/core';

import { Layout } from './Layout'

const { App, PushNotifications, Storage } = Plugins

interface HomeProps extends RouteComponentProps {}

const Home = (props: HomeProps) => {

  const [showToast, setShowToast] = useState(false)
  const [showExitConfirmation, setShowExitConfirmation] = useState(false)
  const [toastColor, setToastColor] = useState<string>("warning")
  const [toastMessage, setToastMessage] = useState<string>()

  const ionRouter = useIonRouter()

  document.addEventListener('ionBackButton', (ev) => {
    //@ts-ignore
    ev.detail.register(-1, () => {
      if (!ionRouter.canGoBack()) {
        setShowExitConfirmation(true)
      }
    });
  });

  const registrationCallback = (token: PushNotificationToken) => {
    Storage.set({key: "FireToken", value: token.value})
    console.log("FireToken received from server")
  }

  const notificationReceived = (notification: PushNotification) => {
    setToastMessage(notification.body)
    setShowToast(true)
  }

  const notificationTapped = (event: PushNotificationActionPerformed) => {
    setToastMessage(event.notification.body)
    setShowToast(true)
  }

  useEffect(() => {

    PushNotifications.register()
    PushNotifications.addListener('registration', registrationCallback)
    PushNotifications.addListener('pushNotificationReceived', notificationReceived)
    PushNotifications.addListener('pushNotificationActionPerformed', notificationTapped)
      
  }, [])

  return  (  //@ts-ignore
  <Layout title="Welcome" history={props.history} >
        <IonAlert 
          isOpen={showExitConfirmation} 
          header="Are you sure?"
          message="Do you want to exit"
          buttons={[
            {
              "text": "Yes",
              "handler": () => { App.exitApp() }
            }, 
            {
              "text": "No",
              "handler": () => {}
            }
          ]}
          onDidDismiss={() => setShowExitConfirmation(false)}
        />
        <IonToast 
          isOpen={showToast}
          message={toastMessage} 
          position={'middle'} 
          color={'tertiary'}
          onDidDismiss={() => setToastMessage("")} 
          duration={950} />
        {/* <IonToast isOpen={showToast} message={toastMessage} position={'middle'} color={toastColor}  onDidDismiss={() => setShowToast(false)} 
        buttons={[
          {
            side: 'start',
            icon: logOut,
            text: 'Yes',
            handler: () => {
              Plugins.App.exitApp();
            }
          },
          {
            text: 'No',
            role: 'cancel',
            icon:flower,
            handler: () => { 
              setShowToast(false)
            }
          }
        ]}
        /> */}

  </Layout> )
};

export default Home;
