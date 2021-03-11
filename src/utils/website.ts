import { Plugins } from "@capacitor/core";

const {Storage} = Plugins


export interface Site {
    id: string
    name: string
    website: string
    youtube: string
}

export const getWebsiteData = () => {

    let websiteDataFile = 'website-data.json'

    //return new Promise((resolve, reject) => {
        return new Promise<Site[]>((resolve, reject) => {

        
        Storage.get({key: websiteDataFile}).then(({value}) => {
            if (value === null) { 

                fetch(`http://www.ujet.in/docs/${websiteDataFile}`)
                .then(response => response.json())
                .then((response) => {
                    let val = JSON.stringify(response)
                    Storage.set({key: websiteDataFile, value: val})
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