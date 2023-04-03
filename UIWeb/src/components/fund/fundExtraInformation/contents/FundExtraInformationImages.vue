<template>
  <div class="fund-extra-information-content">
    <div class="fund-extra-information-header">
      <span class="title">Imágenes</span>
      <button class="btn btn-primary" data-toggle="modal" data-target="#addImageModal" v-if="isAManager">Agregar imagen</button>
      <EditImageModal :fundAddress="$route.params.fundAddress" :editImages="true" @submit="updateImage" v-if="isAManager" />
    </div>
    <hr />
    <div class="images-carousel" v-if="fund.images && fund.images.length > 0">
      <div class="btn-remove-container" v-if="isAManager">
        <button class="btn btn-danger btn-remove mb-2" @click="openRemoveImage">Eliminar imagen</button>
      </div>
      <div id="imagesCarousel" class="carousel slide" data-ride="carousel" :data-interval="false">
        <ol class="carousel-indicators">
          <li
            data-target="#imagesCarousel"
            :data-slide-to="i"
            :class="{ active: i === 0 }"
            v-for="(_, i) in fund.images"
            :key="i"
          ></li>
        </ol>
        <div class="carousel-inner">
          <div class="carousel-item" :class="{ active: i === 0 }" v-for="(image, i) in fund.images" :key="i">
            <img :src="serverUrl + 'images/' + image" class="d-block w-100" />
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-target="#imagesCarousel" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-target="#imagesCarousel" data-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </button>
      </div>
    </div>
    <div class="not-information" v-else>
      <FaIcon icon="xmark" class="icon" size="5x" />
      <span>No hay imágenes por el momento.</span>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import axios from 'axios';
import Swal from 'sweetalert2';
import { serverUrl } from '@/siteConfig';
import { mapState, mapGetters } from 'vuex';
import { signMessage } from '@/helpers/connection';
import { addNotification } from '@/composables/useNotifications';

import EditImageModal from '@/components/EditImageModal';

export default {
  name: 'FundExtraInformationImagesComponent',
  components: {
    EditImageModal,
  },
  props: {
    isAManager: { type: Boolean, required: true },
    fund: { type: Object, required: true },
  },
  data() {
    return {
      serverUrl,
      currentIndex: 0,
    };
  },
  computed: {
    ...mapState({
      signature: (state) => state.connection.signature,
    }),
    ...mapGetters(['address']),
  },
  methods: {
    updateImage(imageName) {
      // eslint-disable-next-line vue/no-mutating-props
      this.fund.images.push(imageName);
      setTimeout(() => $('#imagesCarousel').carousel(this.fund.images.length - 1), 10);
    },

    openRemoveImage() {
      Swal.fire({
        title: 'Eliminar imagen',
        text: '¿Está seguro que desea eliminar la imagen?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#9FA6B2',
        confirmButtonText: '¡Sí, eliminar!',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.removeImage();
        }
      });
    },

    async removeImage() {
      if (!this.signature) await signMessage();
      axios
        .delete('fund/removeImageFromImages/' + this.$route.params.fundAddress + '/' + this.fund.images[this.currentIndex])
        .then(() => {
          // eslint-disable-next-line vue/no-mutating-props
          this.fund.images.splice(
            this.fund.images.findIndex((image) => image === this.fund.images[this.currentIndex]),
            1,
          );
          $('#imagesCarousel').carousel(this.currentIndex - 1 >= 0 ? this.currentIndex - 1 : 0);
          addNotification({
            message: 'Imagen eliminada',
            type: 'success',
          });
        });
    },
  },
  mounted() {
    $('#imagesCarousel').on('slide.bs.carousel', (e) => {
      this.currentIndex = e.to;
    });
  },
};
</script>

<style lang="scss" scoped>
.btn-remove-container {
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
}
</style>
