import { useState, useEffect } from 'react'
import { RouteComponentProps } from 'react-router'

import { IonItem, IonGrid, IonCard, IonCardHeader, IonLoading } from '@ionic/react'
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player'

import { Layout } from "./Layout"
import { getWebsiteData, Site } from "../utils/website"


interface MatchParams {
    id: string
}


interface WebsiteListProps extends RouteComponentProps<MatchParams> {
    id: string
}


export const WebsitesDetail = (props: WebsiteListProps) => {

    // define state variables
    const [loading, setLoading] = useState<boolean>(true)
    const [videos, setVideos] = useState([])
    const [selectedSite, setselectedSite] = useState<Site>()


    useEffect(() => {

        // fetch selected channel
        getWebsiteData().then(websiteData => {
            websiteData.find((item: Site) => {
                if (item.id === props.match.params.id) {
                    setselectedSite(item)
                    return true
                }
            })
        })

    }, [props.match.params.id])

    useEffect(() => {

        if (selectedSite !== undefined) {

            // fetch videos
            fetch(`https://novena-prayers.herokuapp.com/channels/${selectedSite.youtube}`)
                .then((data) => data.json())
                .then((data) => {
                    setVideos(data.items)
                    setLoading(false)
                })
        }

    }, [selectedSite])


    const playVideo = (video: string) => {
        YoutubeVideoPlayer.openVideo(video)
    }

    return (
        <Layout title="Playlist" {...props}>
            <IonLoading isOpen={loading} />
            <IonGrid>
                {videos.map((video: any) => {
                    return (
                        <IonItem key={video.id.videoId} onClick={() => playVideo(video.id.videoId)}>
                            <IonCard>
                                <img src={video.snippet.thumbnails.high.url} />
                                <IonCardHeader>
                                    {video.snippet.title}
                                </IonCardHeader>
                            </IonCard>
                        </IonItem>
                    )
                })}
            </IonGrid>
        </Layout>
    )

}
