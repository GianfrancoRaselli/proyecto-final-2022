<template>
  <div>
    <p class="page-title">Acerca de nosotros</p>
    <div class="we-container">
      <div class="question-container small-question">
        <div class="question">
          <p class="ask purple">¿Quiénes somos?</p>
          <p class="answer">
            La aplicación comenzó como proyecto llevado a cabo para la materia Proyecto Final de la carrera Ingeniería en Sistemas
            de Información de la Universidad Tecnológica Nacional (UTN) ubicada en Rosario, Argentina.
          </p>
        </div>
      </div>

      <div class="question-container small-question">
        <div class="question">
          <p class="ask light">¿Qúe tipo de aplicación es?</p>
          <p class="answer">
            El sistema de administración de fondos comunes es una aplicación descentralizada que funciona sobre la cadena de
            bloques (Blockchain) de Ethereum.
          </p>
        </div>
      </div>

      <div class="question-container small-question">
        <div class="question">
          <p class="ask red">¿Cuál es la función de la aplicación?</p>
          <p class="answer">
            La función principal de la aplicación es llevar un registro de los activos (Ether) que las diferentes cuentas de
            Ethereum (entidades) pongan a disposición para una causa común. Los mismos serán gestionados mediante contratos
            inteligentes (Smart Contracts), que son porciones de código que residen en la cadena de bloques mediante los cuales se
            implementó la lógica de negocio.
          </p>
        </div>
      </div>

      <div class="question-container small-question">
        <div class="question">
          <p class="ask purple">¿Qué usos se le puede dar a la aplicación?</p>
          <p class="answer">
            La aplicación cuenta con distintos usos prácticos, la misma permite gestionar los fondos de donaciones, pensiones,
            seguros, campañas de inversiones, entre varios usos más que cada entidad le puede asignar personalizando diferentes
            parámetros a su medida durante la creación de los mismos.
          </p>
        </div>
      </div>

      <div class="question-container big-question">
        <div class="question">
          <p class="ask light">¿Qué ventajas nos proporciona la cadena de bloques?</p>
          <div class="answer">
            <div class="item bottom-bar not-padding-top">
              <p class="title">Descentralización</p>
              <p>
                Una cadena de bloques descentralizada añade una red de igual a igual a las características de seguridad existentes
                típicas de las bases de datos de una blockchain. Los miembros de esta red no tienen que confiar ni conocerse entre
                sí, sino que cada integrante obtiene una copia del mismo registro de contabilidad de la misma.
              </p>
            </div>
            <div class="item bottom-bar">
              <p class="title">Transparencia</p>
              <p>
                La transparencia se consigue publicando las reglas con las que se define el funcionamiento de la cadena de
                bloques. Esto se logra haciendo público el código del software necesario para ejecutar la red y generando una
                comunidad de nodos y desarrolladores que siguen este principio de transparencia.
              </p>
            </div>
            <div class="item bottom-bar">
              <p class="title">Inmutabilidad</p>
              <p>
                Ningún participante puede cambiar o falsificar una transacción una vez grabada en el libro mayor compartido. Si el
                registro de una transacción incluye un dato no deseado, se debe añadir una nueva transacción para revertir el
                error, pero ambas transacciones serán visibles.
              </p>
            </div>
            <div class="item bottom-bar">
              <p class="title">Privacidad</p>
              <p>
                Las direcciones de las cuentas no están ligadas a las identidades de las personas. Para poder operar en la cadenad
                e bloques es necesario disponer del par de claves pública y privada.
              </p>
            </div>
            <div class="item not-padding-bottom">
              <p class="title">Trazabilidad</p>
              <p>
                La cadena de bloques permite realizar un recorrido de todas las operaciones que se han realizado sobre una
                determinada dirección, o retroceder en el tiempo y revisar las transacciones que se hicieron en una fecha
                determinada explorando todos los bloques generados en la fecha indicada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutUsView',
  components: {},
  data() {
    return {};
  },
  computed: {},
  methods: {},
  async created() {},
};
</script>

<style lang="scss" scoped>
.we-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;

  .question-container {
    padding: 0.6rem;

    .question {
      font-size: 1.1rem;
      text-align: center;
      min-height: 100%;
      padding: 1.4rem;
      border: 0.1px solid rgba(109, 109, 109, 0.737);
      border-radius: 1rem;
      background-color: rgb(251, 251, 251);
      box-shadow: rgba(0, 0, 0, 0.42) 3px 3px 5px 3px;

      .ask {
        font-size: 1.5em;
        font-weight: bold;
      }

      .answer {
        font-size: 1em;

        .item {
          padding: 1rem;

          .title {
            font-size: 1.2em;
            font-weight: bold;
          }
        }

        .not-padding-top {
          padding-top: 0;
        }

        .not-padding-bottom {
          padding-bottom: 0;
        }

        .bottom-bar {
          border-bottom: 0.5px solid rgba(76, 76, 76, 0.34);
          border-radius: 0.1rem;
        }
      }
    }
  }

  .small-question {
    width: 50%;

    @media (max-width: 680px) {
      width: 100%;
      padding: 0.6rem 0;
    }
  }

  .big-question {
    width: 100%;

    @media (max-width: 680px) {
      padding: 0.6rem 0;
    }
  }
}
</style>
