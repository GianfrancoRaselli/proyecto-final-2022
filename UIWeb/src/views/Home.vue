<template>
  <div class="content">
    <div class="main-content">
      <p class="title">Sistema de administración de fondos comunes</p>
      <div class="sub-content">
        <img class="fund-img" src="@/assets/imgs/main-transparent.png" />
        <div class="info">
          <div class="header">
            <p class="subtitle">Transformando la forma de financiación</p>
            <p class="description">
              Brindamos seguridad y autocontrol a todos los que buscan una forma totalmente descentralizada de administrar fondos
              de dinero compartidos utilizando los contratos inteligentes de la cadena de bloques de Ethereum.
            </p>
          </div>
          <router-link class="button" :to="{ name: 'Funds', params: { animation: 'slide' } }">
            <button class="btn btn-primary btn-discover">
              <span>Descubrir fondos</span><fa-icon icon="arrow-right" class="img-icon ml-3"></fa-icon>
            </button>
          </router-link>
        </div>
      </div>
    </div>

    <div class="we-content">
      <img src="@/assets/imgs/logos/1/Fund-logos_transparent.png" />
      <p class="title">Acerca de nosotros</p>
      <div class="questions">
        <div class="question">
          <p class="ask text-primary">¿Quiénes somos?</p>
          <p class="answer">
            La aplicación comenzó como proyecto llevado a cabo para la materia Proyecto Final de la carrera Ingeniería en Sistemas
            de Información de la Universidad Tecnológica Nacional (UTN) ubicada en Rosario, Argentina.
          </p>
        </div>

        <div class="question">
          <p class="ask text-dark">¿Qúe tipo de aplicación es?</p>
          <p class="answer">
            El sistema de administración de fondos comunes es una aplicación descentralizada que funciona sobre la cadena de
            bloques (Blockchain) de Ethereum.
          </p>
        </div>

        <div class="question">
          <p class="ask text-success">¿Cuál es la función de la aplicación?</p>
          <p class="answer">
            La función principal de la aplicación es llevar un registro de los activos (Ether) que las diferentes cuentas de
            Ethereum (entidades) pongan a disposición para una causa común. Los mismos serán gestionados mediante contratos
            inteligentes (Smart Contracts), que son porciones de código que residen en la cadena de bloques mediante los cuales se
            implementó la lógica de negocio.
          </p>
        </div>

        <div class="question">
          <p class="ask text-danger">¿Qué usos se le puede dar a la aplicación?</p>
          <p class="answer">
            La aplicación cuenta con distintos usos prácticos, la misma permite gestionar los fondos de donaciones, pensiones,
            seguros, campañas de inversiones, entre varios usos más que cada entidad le puede asignar personalizando diferentes
            parámetros a su medidad durante la creación de los mismos.
          </p>
        </div>

        <div class="question">
          <p class="ask text-warning">¿Qué ventajas nos proporciona la cadena de bloques?</p>
          <ul class="answer">
            <li>
              <span class="item">Descentralización</span>: una cadena de bloques descentralizada añade una red de igual a igual a
              las características de seguridad existentes típicas de las bases de datos de una blockchain. Los miembros de esta
              red no tienen que confiar ni conocerse entre sí, sino que cada integrante obtiene una copia del mismo registro de
              contabilidad de la misma.
            </li>
            <li>
              <span class="item">Transparencia</span>: la transparencia se consigue publicando las reglas con las que se define el
              funcionamiento de la cadena de bloques. Esto se logra haciendo público el código del software necesario para
              ejecutar la red y generando una comunidad de nodos y desarrolladores que siguen este principio de transparencia.
            </li>
            <li>
              <span class="item">Inmutabilidad</span>: ningún participante puede cambiar o falsificar una transacción una vez
              grabada en el libro mayor compartido. Si el registro de una transacción incluye un dato no deseado, se debe añadir
              una nueva transacción para revertir el error, pero ambas transacciones serán visibles.
            </li>
            <li>
              <span class="item">Privacidad</span>: las direcciones de las cuentas no están ligadas a las identidades de las
              personas. Para poder operar en la cadenad e bloques es necesario disponer del par de claves pública y privada.
            </li>
            <li>
              <span class="item">Trazabilidad</span>: la cadena de bloques permite realizar un recorrido de todas las operaciones
              que se han realizado sobre una determinada dirección, o retroceder en el tiempo y revisar las transacciones que se
              hicieron en una fecha determinada explorando todos los bloques generados en la fecha indicada.
            </li>
          </ul>
        </div>

        <div class="question">
          <p class="ask text-info">¿Qué se necesita para comenzar a utilizar la aplicación?</p>
          <p class="answer">
            Todo lo que se necesita para comenzar a iteractuar con la aplicación es contar con la billetera MetaMask instalada en
            el navegador.
          </p>
        </div>

        <div class="question">
          <p class="ask text-success">¿Para qué sirve un FundToken?</p>
          <p class="answer">
            El FundToken es la moneda interna que se puede comprar en la aplicación. La misma funciona como un ticket para poder
            crear un fondo.
          </p>
        </div>

        <div class="question">
          <p class="ask text-danger">¿Quiénes pueden crear un fondo?</p>
          <p class="answer">
            Cualquier persona, entidad o empresa que disponga de una cuenta en la billetera de MetaMask puede crear e interactuar
            con cualquier fondo.
          </p>
        </div>
      </div>
    </div>

    <div class="community-content">
      <img src="@/assets/imgs/community.png" />
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
          Por el momento, para poder comenzar a interactuar con la aplicación debes contar con la billetera de MetaMask instalada
          en el navegador.
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
  background: #38849550; /* fallback for old browsers */
  background: -webkit-linear-gradient(to bottom left, #38849520, #38849550); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to bottom left,
    #38849520,
    #38849550
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;

  .title {
    font-size: 2.6rem;
    font-weight: bold;
    text-decoration: underline;
  }

  .sub-content {
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 2rem;

    .fund-img {
      height: 350px;
      width: auto;
      max-width: 100%;
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

      .header {
        .subtitle {
          font-size: 1.8rem;
          font-weight: bold;
        }
      }
    }
  }
}

.we-content {
  padding: 3rem;
  background: #eae7e781; /* fallback for old browsers */
  background: -webkit-linear-gradient(to left, #5c886241, #4d7a5558, #5c886241); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to left,
    #5c886241,
    #4d7a5558,
    #5c886241
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  gap: 1rem;

  img {
    height: 200px;
    max-width: 100%;
    margin-bottom: 1.5rem;
  }

  .title {
    font-size: 2.4rem;
    font-weight: bold;
    text-decoration: underline;
  }

  .questions {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    gap: 1.5rem;

    .question {
      font-size: 1.1rem;
      text-align: center;
      max-width: 45rem;
      padding: 1.4rem;
      border-radius: 1rem;
      background-color: rgba(255, 255, 255, 0.507);
      box-shadow: rgba(0, 0, 0, 0.371) 4px 4px 4px 2px;

      .ask {
        font-size: 1.5em;
        font-weight: bold;
      }

      .answer {
        font-size: 1em;

        li {
          padding: 0.5rem;

          .item {
            font-weight: bold;
          }
        }
      }
    }
  }
}

.community-content {
  text-align: center;
  padding: 3rem;
  padding-top: 4rem;
  background: #eae7e781; /* fallback for old browsers */
  background: -webkit-linear-gradient(to top left, #2c3e5045, #eae7e781); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to top left,
    #2c3e5045,
    #eae7e781
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    height: 220px;
    max-width: 100%;
    margin-bottom: 2rem;
  }

  .text {
    max-width: 680px;
    margin-bottom: 1.5rem;

    .title {
      font-size: 1.8rem;
      font-weight: bold;
    }

    .description {
      font-size: 1.1rem;
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
