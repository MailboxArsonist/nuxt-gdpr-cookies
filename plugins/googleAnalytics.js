import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
export default async (ctx, inject) => {

  Vue.use(VueAnalytics, {
    router: ctx.app.router,
    id: 'PUT GOOGLE ANALYTICS ID',
    debug: {
      trace: true,
      sendHitTask: true
    },
    disabled: () => {
      // nuxt-ga-cookie holds cookie preferences
      const cookies = ctx.app.$cookies.get('nuxt-cookies')
      if(cookies && cookies['google-analytics'] === true){
        return Promise.resolve(false)
      } else {
        return Promise.resolve(true)
      }
    }
  })
  ctx.$ga = Vue.$ga
  inject('ga', Vue.$ga)
}