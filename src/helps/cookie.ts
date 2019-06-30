const cookie = {
    read(name: string): string | null {
        const match = document.cookie.match(new RegExp('(^|;\\$*)(' + name + ')=([^;]*'))
        return match ? decodeURIComponent(match[3]) : null
    }
}


export default cookie