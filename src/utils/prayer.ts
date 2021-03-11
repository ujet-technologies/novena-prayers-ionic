import { Plugins } from "@capacitor/core";


const {Storage} = Plugins


export interface Prayer {
    id: string
    name: string
    file: string
}


export const getPrayers = () => {

    let prayerDataFile = 'prayer-data.json'

    return new Promise<Prayer[]>((resolve, reject) => {

        Storage.get({key: prayerDataFile}).then(({value}) => {
            if (value === null) {
                fetch(`http://www.ujet.in/docs/${prayerDataFile}`)
                .then(response => response.json())
                    .then(response => {
                        let val = JSON.stringify(response)
                        Storage.set({key: prayerDataFile, value: val}) 
                        resolve(response)
                    })
                    .catch(error => {
                        reject(error)
                    })
            }
            else {
                let val = JSON.parse(value)
                resolve(val)
            }
        })
        
    })

}


export const downloadPrayer = (prayer: Prayer) => {

    let prayerPDF = prayer.file

    return new Promise<string>((resolve, reject) => {

        Storage.get({key: prayerPDF}).then((value) => {

            if (value !== null) {

                fetch(`http://www.ujet.in/docs/${prayer.file}`, )
                .then(response => response.blob())
                .then(response => {
                    let reader = new FileReader()
                    reader.readAsDataURL(response)
                    reader.onloadend = () => { 
                        let val = reader.result as string
                        Storage.set({key: prayerPDF, value: val})
                        resolve(val) 
                    }
                })
                .catch(error => {
                    reject(error)
                })


            }
            else {

                resolve(value)

            }

        })
        
        
    })

}