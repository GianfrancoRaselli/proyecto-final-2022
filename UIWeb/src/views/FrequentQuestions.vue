<template>
  <div>
    <p class="page-title">Preguntas frecuentes</p>
    <div class="questions-container">
      <Question ask="¿Qué se necesita para comenzar a utilizar la aplicación?" color="red">
        <p>
          Todo lo que se necesita para comenzar a interactuar con la aplicación es contar con la billetera MetaMask instalada en el
          navegador.
        </p>
        <p>
          La aplicación detecta automáticamente si la billetera está instalada, en caso de ser así, le aparecerá un botón en la
          esquina superior derecha que le permitirá vincular una cuenta de MetaMask con el sistema:
        </p>
        <p><img src="@/assets/imgs/questions/connect-metamask.png" /></p>
      </Question>

      <Question ask="¿Qué es MetaMask?" color="purple">
        <p>
          MetaMask es una billetera y un navegador al mismo tiempo, sirve para almacenar e intercambiar activos digitales y para
          explorar nuevas aplicaciones en la web descentralizada.
        </p>
        <p><a href="https://metamask.io/" target="_blank">Explorar MetaMask</a></p>
      </Question>

      <Question ask="¿Cómo instalar MetaMask?" color="light">
        <div class="steps">
          <div class="step">
            <div class="number">1</div>
            <p>
              Dirígete a <a href="https://metamask.io/download/" target="_blank">instalar MetaMask</a> y dale al botón «Install
              MetaMask for Chrome», luego sigue los pasos para culminar la instalación.
            </p>
            <p><img src="@/assets/imgs/questions/step1-metamask.jpg" /></p>
          </div>
          <div class="bar"></div>
          <div class="step">
            <div class="number">2</div>
            <p>Aquí pulsa sobre la tachuela y se te añadirá la extensión a la barra de tareas.</p>
            <p><img src="@/assets/imgs/questions/step2-metamask.jpg" /></p>
          </div>
          <div class="bar"></div>
          <div class="step">
            <div class="number">3</div>
            <p>
              Haz click sobre el icono de MetaMask en la esquina superior derecha (acepta los términos y condiciones) y luego
              click en «Crear una cartera».
            </p>
            <p><img src="@/assets/imgs/questions/step3-metamask.jpg" /></p>
          </div>
          <div class="bar"></div>
          <div class="step">
            <div class="number">4</div>
            <p>Ingresa una contraseña segura y haz click en «Crear».</p>
            <p><img src="@/assets/imgs/questions/step4-metamask.jpg" /></p>
          </div>
          <div class="bar"></div>
          <div class="step">
            <div class="number">5</div>
            <p>
              MetaMask te mostrará tu seed (semilla), haz click sobre el candado para revelarla. Es muy importante que guardes
              estas 12 palabras, (sin ellas será imposible recuperar tu billetera en caso de pérdida). Una vez hecho esto, haz
              click sobre el botón «Siguiente».
            </p>
            <p><img src="@/assets/imgs/questions/step5-metamask.jpg" /></p>
          </div>
          <div class="bar"></div>
          <div class="step">
            <div class="number">6</div>
            <p>
              Te pedirá que introduzcas la frase secreta de respaldo, exactamente en el mismo orden en que te la dio la ventana
              anterior. Una vez hecho, haz click en «Confirmar».
            </p>
            <p><img src="@/assets/imgs/questions/step6-metamask.jpg" /></p>
          </div>
          <div class="bar"></div>
          <div class="step">
            <div class="number">7</div>
            <p>
              En esta ventana te dirá que ya habrás creado tu billetera, dándote a su vez unas pequeñas sugerencias de
              almacenamiento seguro. Una vez leídas haz click en el botón «Todo listo».
            </p>
            <p><img src="@/assets/imgs/questions/step7-metamask.jpg" /></p>
          </div>
        </div>
      </Question>

      <Question ask="¿Para qué sirve un FundToken?" color="red">
        El FundToken es la moneda interna que se puede comprar en la aplicación. La misma funciona como un ticket para poder crear
        un fondo.
      </Question>

      <Question ask="¿Cómo comprar FundTokens?" color="purple">
        <div class="steps">
          <div class="step">
            <div class="number">1</div>
            <p>Desde cualquier parte de la aplicación dale al botón «Comprar FundTokens» en la barra de navegación superior.</p>
            <p><img src="@/assets/imgs/questions/step1.1-fundtoken.png" /></p>
            <p>
              En caso de estar navegando desde un dispositivo móvil debe dirigirse a la parte inferior, y darle al botón
              «FundToken».
            </p>
            <p><img src="@/assets/imgs/questions/step1.2-fundtoken.png" /></p>
          </div>
          <div class="bar"></div>
          <div class="step">
            <div class="number">2</div>
            <p>En la ventana emergente indique la cantidad de FundTokens que desea comprar.</p>
            <p><img src="@/assets/imgs/questions/step2-fundtoken.png" /></p>
          </div>
          <div class="bar"></div>
          <div class="step">
            <div class="number">3</div>
            <p>
              Dale al botón «Comprar» para confirmar la compra (para poder proceder con la compra debes estar conectado a la
              aplicación con una cuenta de MetaMask).
            </p>
            <p><img src="@/assets/imgs/questions/step3-fundtoken.png" /></p>
          </div>
          <div class="bar"></div>
          <div class="step">
            <div class="number">4</div>
            <p>
              Finalmente, se le abrirá una nueva ventana de MetaMask indicandole el costo de la compra, para finalizar la misma
              debe darle al botón «Confirmar».
            </p>
            <p><img src="@/assets/imgs/questions/step4-fundtoken.png" /></p>
          </div>
        </div>
      </Question>

      <Question ask="¿Quiénes pueden crear un fondo?" color="light">
        Cualquier persona, empresa o entidad que disponga de una cuenta en la billetera de MetaMask puede crear e interactuar con
        cualquier fondo.
      </Question>

      <Question ask="¿Cómo crear un nuevo fondo?" color="red">
        <div class="steps">
          <div class="step">
            <div class="number">1</div>
            <p>Desde cualquier parte de la aplicación dale al botón «Crear fondo» en la barra de navegación superior.</p>
            <p><img src="@/assets/imgs/questions/step1.1-createfund.png" /></p>
            <p>
              En caso de estar navegando desde un dispositivo móvil debe dirigirse a la parte inferior, y darle al botón «Crear».
            </p>
            <p><img src="@/assets/imgs/questions/step1.2-createfund.png" /></p>
          </div>
          <div class="bar"></div>
          <div class="step">
            <div class="number">2</div>
            <p>
              Aquí debe personalizar los parámetros del fondo a crear según sus necesidades (una vez creado no se pueden
              modificar). Para facilitarle la tarea, puede seleccionar tres diferentes tipos de fondo (con sus respectivos
              parámetros ya configurados) al comienzo del formulario. En caso de que dichos tipos no se adapten a tus
              preferencias, puede seleccionar «Fondo personalizado» y configurar todos los parámetros a su gusto.
            </p>
            <p>
              Luego, debe darle al botón «Crear fondo» (para eso debe disponer de al menos 1 FundToken en su cuenta de MetaMask).
            </p>
            <p><img src="@/assets/imgs/questions/step2-createfund.png" /></p>
          </div>
        </div>
      </Question>

      <Question ask="¿Qué tipos de fondos se pueden crear?" color="purple">
        <p>
          Existen tres tipos de fondos que, al momento de crear un nuevo fondo, ya cuentan con varios parámetros configurados para
          su uso específico.
        </p>
        <div class="fund-types">
          <div class="fund-type">
            <p class="fund-type-title light">Fondo de amigos</p>
            <p class="fund-type-description">
              Este tipo de fondo está pensado para que pequeños grupos de personas (amigos, compañeros) que desean recaudar dinero
              para alguna causa común.
            </p>
          </div>
          <div class="fund-type">
            <p class="fund-type-title red">Fondo de campaña</p>
            <p class="fund-type-description">
              Este tipo de fondo está pensado para que aquellas entidades con una idea, pero que no dispongan de los recursos
              necesarios, puedan crear un fondo para que otras personas puedan financiarla a cambio de beneficios.
            </p>
          </div>
          <div class="fund-type">
            <p class="fund-type-title purple">Fondo de donación</p>
            <p class="fund-type-description">
              Este tipo de fondo está pensado para aquellas entidades que deseen recaudar dinero para alguna causa benéfica.
            </p>
          </div>
          <div class="fund-type">
            <p class="fund-type-title grey">Fondo personalizado</p>
            <p class="fund-type-description">
              En caso de que ninguno de los tipos de fondos anteriores se adapten a sus necesidades, puede personalizar
              completamente todos los parámetros de su fondo a su gusto.
            </p>
          </div>
        </div>
      </Question>
    </div>
  </div>
</template>

<script>
import Question from '@/components/Question';

export default {
  name: 'HomeView',
  components: {
    Question,
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
  async created() {},
};
</script>

<style lang="scss" scoped>
.questions-container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  gap: 1rem;

  img {
    max-width: 100%;
  }

  .steps {
    .step {
      .number {
        display: inline-block;
        padding: 0 0.4rem 0.2rem 0;
        border-right: 0.1px solid rgba(110, 110, 110, 0.867);
        border-bottom: 0.1px solid rgba(110, 110, 110, 0.867);
        border-radius: 0 0 0.3rem 0;
        margin-bottom: 1rem;
      }
    }

    .bar {
      height: 0.1px;
      margin: 1.5rem 0;
      background-color: rgba(110, 110, 110, 0.729);
    }
  }

  .fund-types {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    row-gap: 1rem;

    .fund-type {
      text-align: center;
      width: 24%;
      padding: 1rem;
      border: 0.2px solid rgb(123, 123, 123);
      border-radius: 0.8rem;

      .fund-type-title {
        font-size: 1.2rem;
        font-weight: bold;
      }
    }
  }

  @media (max-width: 980px) {
    .fund-types {
      flex-wrap: wrap;

      .fund-type {
        width: 49%;
      }
    }
  }

  @media (max-width: 500px) {
    .fund-types {
      .fund-type {
        width: 100%;
      }
    }
  }
}
</style>
