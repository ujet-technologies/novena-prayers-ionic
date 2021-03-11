import React from 'react';
import { useIonRouter,IonToast } from '@ionic/react';
import { Plugins } from '@capacitor/core';
import {RouteComponentProps} from 'react-router';
import { Layout } from './Layout'
import { useState } from 'react';
import { logOut, flower } from 'ionicons/icons';


const Home: React.FC<RouteComponentProps> = (props: any) => {

const [showToast, setShowToast] =useState(false)
const { App } = Plugins;


const ionRouter = useIonRouter();
//@ts-ignore
document.addEventListener('ionBackButton', (ev) => {
  ev.detail.register(-1, () => {
    if (!ionRouter.canGoBack()) {
      //App.exitApp();
      setShowToast(true)
    }
  });
});
  const resetToast = () => {
    setShowToast(false)
}
  return  (  //@ts-ignore
  <Layout title="Welcome" history={props.history} >
        <IonToast isOpen={showToast} message={" Exit This App ? "} position={'middle'} color={'danger'}  onDidDismiss={() => setShowToast(false)} 
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
        />

  </Layout>
  )
};

export default Home;
