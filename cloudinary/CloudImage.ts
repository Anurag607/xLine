export const CloudImage = async (form_data:FormData) => {
    
    const cloudinary_url = process.env.NEXT_PUBLIC_CLOUDINARY_URL
    
    try {
        const imgUpload = await fetch(`${cloudinary_url}`,{
            method : "POST",
            mode: 'cors',
            body : form_data
        })
        const data = await imgUpload.json()
    
        if(data) {
            return data.secure_url
        }

    } catch(err) {
        console.log(err)
    }  
}