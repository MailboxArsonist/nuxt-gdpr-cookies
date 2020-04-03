<template>
  <div v-if="isOpen">
    <!-- BAR -->
    <div 
      v-show="!modalView"
      class="w100 is-white cookie p10 tac shadowl">
      <div class="w100">
        <h3 class="cookie-title">
          <i class="mdi mdi-cookie rad100" /> Gestion des cookies
        </h3>
      </div>
      <div class="w100 px10">
        <p>
          Sports-Village utilise des cookies pour vous offrir une expérience utilisateur de qualité, optimiser les fonctionnalités des réseaux sociaux et mesurer l’audience. En poursuivant votre navigation sur ce site, vous acceptez   l’utilisation de cookies. Vous pouvez voir comment sont utilisées vos données personnelles (
          <nuxt-link
            to="/confidentialite"
            class="txt-info">
            politique de confidentialité
          </nuxt-link>)
        </p>
      </div>
      <div class="w100 mxw22 ma">
        <button 
          class="button is-info w10 my5"
          @click="modalOpen = true">
          Modifier 
          <i class="mdi mdi-arrow-right-bold rad100" />
        </button>
        <button 
          class="button is-success w10 my5" 
          @click="acceptAll">
          Accepter 
          <i class="mdi mdi-check-bold rad100" />
        </button>
      </div>
    </div>
    <modal
      :is-active.sync="modalOpen"
      @close="modalClosed">
      <div class="card rad">
        <div class="card-header tac">
          <h4>
            Gestion des cookies
          </h4>
        </div>
        <div class="card-content">
          <p>Lorsque vous naviguez sur le site du Sports-Village, des cookies sont déposés sur votre navigateur. Pour certains d’entre eux, votre consentement est nécessaire. Pour le meilleure expérience (amélioration de l'offre et de l'expérience Sports-Village grâce aux statistiques de navigation), il est conseillé de garder l’activation des différentes cookies.</p>
          <p>
            Vous pouvez voir comment sont utilisées vos données personnelles (
            <nuxt-link
              to="/confidentialite"
              class="txt-info">
              politique de confidentialité
            </nuxt-link>
            ) et configurer les réglages pour chaque cookie ci-dessous
          </p>
          <div>
            <checkbox
              v-for="(cookieValue, cookieName) in cookiePreference"
              :key="cookieName"
              :value="cookieValue"
              class="w100 button tal is-white"
              @input="togglePreference(cookieName, cookieValue)">
              <span class="ttc">{{ formatCookieName(cookieName) }}</span>
            </checkbox>
          </div>
          <div class="tac">
            <button 
              class="button is-success my5"
              @click="savePreferences">
              Enregistrer & fermer 
              <i class="mdi mdi-check-bold rad100" />
            </button>
          </div>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
export default {
  name: "CookieNotice",
  props: {
    forceShow: {
      type: Boolean,
      default: () => false
    },
    modalView: {
      type: Boolean,
      default: () => false
    },
  },
  data() {
    return {
      isOpen: false,
      modalOpen: false,
      cookiePreference: {
        'facebook-pixel': true,
        'google-analytics': true
      }
    }
  },
  created() {
    // To show just cookie settings, NOT cookie pop up bar
    if(this.modalView) this.modalOpen = true
    if(this.forceShow) {
      this.getCookie('svrgpd')
      return this.isOpen = true
    }
    // Used on page load to show cookie pop up bar
    if (this.getCookie('svrgpd') === false) {
      this.isOpen = true
    }
  },

  methods: {
    getCookie(cookieName) {
      if (process.browser) {
        const cookie = this.$cookies.get(cookieName)
        if(cookie === undefined){
          return false
        } else if(cookie){
          // set cookie preferences
          this.cookiePreference = cookie
          return true
        } else {
          return false
        }
      }
    },
    setCookie(cookieName, cookieValue, cookieExpiry) {
      if (process.browser) {
        this.$cookies.set(cookieName, cookieValue, {
          path: '/',
          domain: config.cookieDomain,
          maxAge: cookieExpiry
        })
        this.isOpen = false
      }
    },
    removeCookie(cookieName, options = { path: '/', domain: config.cookieDomain }){
      this.$cookies.remove(cookieName, options)
    },
    acceptAll() {
      if (process.browser) {
        // remove any previous cookies
        this.removeCookie('svrgpd')
        // add new cookies for all 12 months
        const newCookie = {'facebook-pixel': true, 'google-analytics': true}
        this.setCookie('svrgpd', newCookie, (60 * 60 * 24 * 365))
        this.handleFacebookPixel()
        this.handleGA()
        this.isOpen = false
      }
    },
    savePreferences() {
      if (process.browser) {
        // remove any previous cookies
        this.removeCookie('svrgpd')
        // add new cookies with preferences for 12 months
        const newCookie = this.cookiePreference
        this.setCookie('svrgpd', newCookie, (60 * 60 * 24 * 365))
        this.handleFacebookPixel()
        this.handleGA()
        this.isOpen = false
        this.modalClosed()
      }
    },
    modalClosed(){
      this.$emit('modalClosed')
    },
    togglePreference(cookieName, newValue){
      // Set preference for individuql cookie type
      this.cookiePreference[cookieName] = !newValue
    },
    formatCookieName(cookieName){
      return cookieName.replace('-', ' ')
    },
    handleFacebookPixel(){
      // handles activating or removing facebook pixel related prefs
      if(this.cookiePreference['facebook-pixel'] === true) {
        this.$fb.enable()
      } else {
        // User may have removed fb pixel so remove any related cookies
        this.removeCookie('_fbp')
      }
    },
    handleGA(){
      // handles activating or removing google analytics related prefs
      if(this.cookiePreference['google-analytics'] === true) {
        this.$ga.enable()
      } else {
        this.$ga.disable()
        this.removeCookie('_ga')
        this.removeCookie('_gat')
        this.removeCookie('_gid')
      }
      
    }
  }
}
</script>

<style scoped>
.cookie {
  position: fixed;
  z-index: 20;
  bottom: 0;
}
</style>