export default function ({ app }) {

    // svrgp holds cookie preferences
    const cookies = app.$cookies.get('nuxt-cookies')

    // check to see is user has accepted fb pixel
    if(cookies && cookies['facebook-pixel'] === true){
        app.$fb.enable()
    } else {
        // otherwise remove fb related cookies
        app.$cookies.remove('_fbp', {
            path: '/',
        })
    }
}