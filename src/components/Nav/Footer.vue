<template>
  <VFooter
    app
    absolute
    padless
    height="100"
    :class="[
      $style.footer,
      'layoutBackground',
    ]"
    v-show="$vuetify.breakpoint.lgAndUp"
  >
    <VDivider :class="$style.divider" />
    <VCardText :class="$style.copyright">
      АРМ "ВЛАСТЬ". {{ new Date().getFullYear() }}
    </VCardText>
  </VFooter>
</template>

<script>
import { VCardText, VDivider, VFooter } from 'vuetify/lib';

export default {
  name: 'Footer',
  components: {
    VCardText,
    VDivider,
    VFooter,
  },
}
</script>

<style module>
.footer {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-color: var(--v-footer-base);
  background-image: url(/img/main/footer.png);
  background-repeat: no-repeat;
  background-position: right 0 bottom 0;
}

.divider {
  width: 100%;
}

.copyright {
  text-align: center;
  border-top: 1px solid rgba(var(--v-dividerBackground-base), .12);
}
</style>
