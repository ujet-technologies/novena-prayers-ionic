import React, { useState, useEffect } from 'react'
import { RouteComponentProps } from 'react-router'
import { IonLoading, IonContent, IonButton, IonIcon, IonRange } from '@ionic/react'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack' 
import { Layout } from './Layout' 
import { Prayer, getPrayers, downloadPrayer } from '../utils/prayer'
//import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { expandSharp, contractSharp } from 'ionicons/icons'


interface MatchParams {
    id: string
}

interface PrayerDetailProps extends RouteComponentProps<MatchParams> {
    id: string
}

export const PrayerDetail = (props: PrayerDetailProps) => {

    // define state variables
    const [loading, setLoading] = useState(true)
    const [prayer, setPrayer] = useState<Prayer>()
    const [prayerPDF, setPrayerPDF] = useState('not-available')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [width, setWidth] = useState(window.innerWidth)
    const [scale, setScale] = useState(1);
    const [title, setTitle] = useState('Prayer')

    useEffect(() => {

        // show loader
        setLoading(true)


        // fetch prayer with given id
        getPrayers().then(prayers => {
            prayers.find((item: Prayer) => {
                if (item.id === props.match.params.id) {
                    setPrayer(item)
                    return true
                }
            })
        })

    }, [props.match.params.id])


    useEffect(() => {

        // download prayer
        if (prayer !== undefined) {
            downloadPrayer(prayer as Prayer).then(response => {
                setPrayerPDF(response)
                setTitle(prayer.name)
                setLoading(false)
            })
        }

    }, [prayer])


    // @ts-ignore
    const prayerPDFLoadSuccess = ({numPages}) => {
        setTotalPages(numPages)
        setLoading(false)
    }

    const zoomIn = () => {
        setScale(scale +.2)   
       // console.log('zoomin')
     }

     const zoomOut = () => {
        setScale(scale -.2)   
       // console.log('zoomin')
     }
     
    const renderPages = () => { 
        let pages = []
        for (let i = 1; i < totalPages+1; i++) {
            pages.push(<Page key = {i} width={width} scale={scale} pageNumber={i} />)
        }
        return pages
    }
   
    return(
        //@ts-ignore
        <Layout title={title} {...props}>
            <IonLoading isOpen={loading} />
            <div  style={ { textAlign: "center",border: "2px solid blue" }}>
                <IonRange value = {scale}  min = {1} max = {3} step = {.2}  color = "tertiary" onIonChange = {e => setScale(e.detail.value as number)} >
                <IonIcon size = 'small' slot='end' icon={expandSharp} />
                <IonIcon size = 'small' slot="start" icon={contractSharp} />
                </IonRange>
            {/* <IonButton size="small" shape="round" fill="outline" onClick={zoomIn}><IonIcon slot='icon-only' icon={expandSharp} /></IonButton>
            <IonButton size="small" shape="round" fill="outline" onClick={zoomOut}><IonIcon slot='icon-only' icon={contractSharp} /></IonButton>                     */}
            </div>
            <IonContent scrollX={true} scrollY={true}>   
                <Document file={prayerPDF} onLoadSuccess={prayerPDFLoadSuccess}>
                    {renderPages().map(item => item)}
                </Document>
            </IonContent>
        </Layout>
    )

}
