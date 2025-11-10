export async function getThumbnail(videoUrl: string) {
    let parts = videoUrl.split('.webm')
    return parts[0] + '.jpg'
}
