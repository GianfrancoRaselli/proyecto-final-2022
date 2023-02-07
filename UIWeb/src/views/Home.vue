<template>
  <div class="content">
    <div class="main-content">
      <img class="fund-img" src="@/assets/imgs/background-sm.jpg" />
      <div class="info">
        <div class="header">
          <p class="title">Transformando la forma de financiación</p>
          <p class="description">
            Brindamos seguridad y autocontrol a todos los que buscan una forma totalmente descentralizada de administrar fondos de
            dinero compartidos utilizando los contratos inteligentes de la cadena de bloques de Ethereum.
          </p>
        </div>
        <router-link class="button" :to="{ name: 'Funds', params: { animation: 'slide' } }">
          <button class="btn btn-primary btn-discover">
            <span>Descubrir fondos</span><fa-icon icon="arrow-right" class="img-icon ml-3"></fa-icon>
          </button>
        </router-link>
      </div>
    </div>

    <div class="community-content">
      <img src="@/assets/imgs/fund.png" />
      <div class="text">
        <p class="title">¿Te gustaría unirte a nuestra comunidad?</p>
        <p class="description">
          Ya hay muchas personas que confían en nuestros servicios, ¡y cada día seguimos creciendo aún más!
        </p>
      </div>
      <div class="cards">
        <div class="card">
          <fa-icon icon="users" class="icon users-color" size="5x" />
          <span class="number">5000</span>
          <span class="title"><span class="main users-color">Usuarios</span> registrados</span>
        </div>
        <div class="card">
          <fa-icon icon="list" class="icon funds-color" size="5x" />
          <span class="number">5000</span>
          <span class="title"><span class="main funds-color">Fondos</span> creados</span>
        </div>
        <div class="card">
          <fa-icon icon="money-bill" class="icon money-color" size="5x" />
          <span class="number">5000</span>
          <span class="title"><span class="main money-color">ETH</span> depositados</span>
        </div>
      </div>
    </div>

    <div class="metamask-content">
      <img src="@/assets/imgs/metamask.png" />
      <div class="text">
        <p class="title">¡Instala MetaMask!</p>
        <p class="description">
          Por el momento, para poder comenzar a utilizar la aplicación debes tener instalada la billetera de MetaMask en el
          navegador.
        </p>
        <p class="secondary-description">¡Estamos trabajando para incorporar nuevas formas de utilizar la aplicación!</p>
        <a href="https://metamask.io/download/" target="_blank"><button class="btn btn-primary">Instalar MetaMask</button></a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.content {
  min-width: 100%;
  padding: 0;
}

.main-content {
  min-height: calc(100vh - var(--navbar-height));
  padding: 1.5rem;
  background: white; /* fallback for old browsers */
  background: -webkit-linear-gradient(to top right, #d4d3dd, white); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to top right,
    #d4d3dd,
    white
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 35px;

  .fund-img {
    height: 500px;
    width: auto;
  }

  .info {
    font-size: 1.15rem;
    text-align: center;
    max-width: 667px;
    animation: fadeInUpBig 1s;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;

    .header .title {
      font-size: 1.9rem;
      font-weight: bold;
      text-decoration: underline;
    }
  }
}

.community-content {
  text-align: center;
  padding: 3rem;
  padding-top: 4rem;
  background: #dddce85f; /* fallback for old browsers */
  background: -webkit-linear-gradient(to bottom, #dddce85f, rgba(240, 243, 207, 0.255)); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to bottom,
    #dddce85f,
    rgba(240, 243, 207, 0.255)
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    height: 100px;
    margin-bottom: 1rem;
  }

  .text {
    max-width: 600px;
    margin-bottom: 1.5rem;

    .title {
      font-size: 1.6rem;
      font-weight: bold;
    }
  }

  .cards {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    gap: 1rem;

    @media (max-width: 700px) {
      flex-direction: column;
    }

    .card {
      height: 20rem;
      width: 18rem;
      border-radius: 1rem;
      box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;

      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;

      @media (max-width: 1000px) {
        font-size: 0.8rem;
        height: 16rem;
        width: 14rem;
      }

      @media (max-width: 700px) {
        font-size: 1rem;
        height: 20rem;
        width: 20rem;
      }

      .number {
        font-size: 2.8em;
        font-weight: bold;
      }

      .title {
        font-size: 1.3em;

        .main {
          font-size: 1.2em;
        }
      }
    }

    .users-color {
      color: #7645d9;
    }

    .funds-color {
      color: #1fc7d4;
    }

    .money-color {
      color: #ed4b9e;
    }
  }
}

.metamask-content {
  padding: 6rem;
  background: radial-gradient(circle at 10% 20%, rgb(248, 213, 214) 0%, rgb(243, 242, 229) 90%);

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;

  @media (max-width: 1200px) {
    padding: 6rem 2rem;
    gap: 0.2rem;
  }

  @media (max-width: 1080px) {
    flex-direction: column;
    gap: 4rem;

    .text {
      text-align: center;
      max-width: 700px;
    }
  }

  img {
    height: 300px;
    max-width: 100%;

    @media (max-width: 550px) {
      height: auto;
    }
  }

  .text {
    .title {
      font-size: 2rem;
      font-weight: bold;
    }

    .description {
      font-size: 1.2rem;
    }

    .secondary-description {
      font-size: 0.9rem;
      color: rgba(0, 0, 0, 0.856);
    }

    .btn {
      margin-top: 0.8rem;
    }
  }
}
</style>
