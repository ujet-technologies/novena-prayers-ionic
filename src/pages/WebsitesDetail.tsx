import * as React from 'react';
import { RouteComponentProps } from 'react-router'
import { useState, useEffect } from 'react';
import { Layout } from "./Layout";
import { IonSlides, IonSlide, IonLoading, IonIcon, IonItem, IonCol, IonGrid, IonImg, IonRow, IonLifeCycleContext, IonList, IonToast } from '@ionic/react';
import VideoDetail from '../components/VideoDetails.jsx';
import { getWebsiteData, Site } from "../utils/website";
import ReactDOM from 'react-dom';
//import { Document } from 'react-pdf';

interface MatchParams {
    id: string
}

interface WebsiteListProps extends RouteComponentProps<MatchParams> {
    id: string
}

export const WebsitesDetail = (props: WebsiteListProps ) => { 

// define state variables
const [loading, setLoading] = useState(false)
const [channel, setChannel] = useState()
const [videos, setVideos] = useState([])
const [selectedvideo, setselectedvideo] = useState()
const [showVideo, setShowVideo] = useState(false)
const [selectedSite, setselectedSite] = useState<Site>()
const [showToast, setShowToast] = useState(false)
const [toastMessage, setToastMessage] = useState('Howdy')
let vplayer = React.createRef();

//play Video
//@ts-ignore
const handleVideoSelect = (video: any) =>{ 
    setselectedvideo(video); setShowVideo(true);
    setToastMessage('Please Scroll up to see The Video')
    setShowToast(true)
}
const handleVideoOnselect=(video: any) => { setselectedvideo(video)}

const resetToast = () => {
    setToastMessage('')
    setShowToast(false)
}


useEffect(()  => {

    // show loading
    setLoading(true)

    //identify site
    // let selectedSite = websiteData.find((item) => {
    //     if (item.id === props.match.params.id) {
    //         // @ts-ignore
    //         setChannel(item.youtube)    
    //         return true
    //     }
    // })

    getWebsiteData().then(websiteData => {
        websiteData.find((item: Site) =>{
            if (item.id === props.match.params.id) {
                setselectedSite(item)
                //@ts-ignore
                setChannel(item.youtube)   
                return true
                console.log('found')
            }else{console.log('not found')}
        })
    })

}, [props.match.params.id])

useEffect(()  => {
    if (selectedSite !== undefined) {
        
    // fetch videos from youtube
    const apiKey ='AIzaSyCvYBd-CeuKcOqiduhWgs9fATFIsfZs_XA';
    //const apiKey ='AIzaSyCaYft5tDd5lABuzwfM2UkWuS18pssMl_4';
    //@ts-ignore
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${selectedSite.youtube}&id&order=date&maxResults=10&key=${apiKey}&fields=items(id,snippet(thumbnails(medium),title,description,publishTime))&part=snippet`)

   // fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${selectedSite.youtube}&id&order=date&maxResults=10&key=${apiKey}&fields=items(id,snippet(thumbnails,title,description,publishTime))&part=snippet')
    .then((data) => data.json())
    .then((result) => {
        setVideos(result.items)
        setLoading(false)
           })
        }
    },[selectedSite])

return (
    <Layout title="Videos" {...props}>
        <IonLoading isOpen={loading} /> 
            <IonGrid>
                    <IonRow >
                        {/* @ts-ignore */}
                        <div ref ={vplayer}  className = 'blue-div' style={{ textAlign: "center" }}>
                            {showVideo && <VideoDetail video={selectedvideo}/>}
                        </div>
                        {/*
                        <div id='marker'>
                        <IonSlides id='slider' pager={true} options={{initialSlide: 1, speed: 400}}>
                            {videos.map((video: any) => {
                                return (
                                        <IonSlide key={video.id.videoId}>
                                            <img src={video.snippet.thumbnails.high.url} />
                                        </IonSlide>
                                )
                            })}
                        </IonSlides>  
                        </div>*/}
                        </IonRow>
                    <IonRow >           
                            <IonList>
                                {/*@ts-ignore*/}
                                {videos.map((video) => <IonItem  key={video.id.videoId} onClick = {()=>handleVideoSelect(video)}>
                                <IonGrid>
                                    <IonRow><IonCol size='10'>
                                        {/* <IonCol size='7'> */}
                                        {/*@ts-ignore*/}
                                        <IonImg src={video.snippet.thumbnails.medium.url} alt={video.snippet.description}/></IonCol></IonRow><IonRow className="item" size='5'> Publish Date : {video.snippet.publishTime.substring(0,10)}</IonRow ><p>{(video.snippet.title)}</p></IonGrid> </IonItem>)} 
                            </IonList>

                    </IonRow>
            </IonGrid>   
            <IonToast isOpen={showToast} message={toastMessage} position={'middle'} color={'danger'} onDidDismiss={resetToast} duration={1050} />    
    </Layout>
)

}
