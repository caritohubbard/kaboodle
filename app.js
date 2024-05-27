require("dotenv").config();
const { 
    createBot,
     createProvider,
    createFlow,
    addKeyword,
 } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MySQLAdapter = require('@bot-whatsapp/database/mysql');
const ChatGPTClass = require('./chatgpt.class');
const {PROMP} = require('./promp');

const ChatGPTInstance = new ChatGPTClass();

const flowConfirmar = addKeyword('Quiero inscribirme').addAnswer('Por favor Brindame tu nombre completo, correo electrónico, si es usted médico, y en donde se encuentra')

const flowInicial = addKeyword(["hola", "información", "saber mas", "hi", "holi", "cursos"])
    .addAnswer("🙌 Hola! Bienvenido al Bot de Medica Capacitación🏥🩺. Recuerda que nuestros cursos son para médicos practicantes, por lo que sugerimos tener alguna experiencia antes de tomarlos!🤓", null, async () => {
    await ChatGPTInstance.handleMsgChatGPT(PROMP)
})
    .addAnswer("Estoy aquí para ayudarte✨. Si te interesa alguno de nuestros diplomados puedo darte más información cuando estés list@, o si tienes planeado inscribirte a alguno de nuestros diplomados, escribe *Quiero inscribirme* y con gusto te guío por el proceso de registro😊.")
    .addAnswer(
        "¿En qué te puedo informar?🧐",   
    
    

{capture:true },
async (ctx, {flowDynamic, fallBack}) =>{
    const response = await ChatGPTInstance.handleMsgChatGPT(ctx.body);
    const message = response.text;
    if(ctx.body.toString() !== 'quiero inscribirme'){
  return fallBack(message);
}
},[flowConfirmar]        
    );

const main = async () => {

    const MYSQL_DB_HOST = '3.14.165.10'
    const MYSQL_DB_USER = 'medica_capacitacion_user_admin'
    const MYSQL_DB_PASSWORD = 'medica_capacitacion123@Aa'
    const MYSQL_DB_NAME = 'medica_capacitacion'
    const MYSQL_DB_PORT = '3306'
    const adapterDB = new MySQLAdapter(
        {
            host: MYSQL_DB_HOST,
            user: MYSQL_DB_USER,
            database: MYSQL_DB_NAME,
            password: MYSQL_DB_PASSWORD,
            port: MYSQL_DB_PORT,
        }
    );
    const adapterFlow = createFlow([flowInicial]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
}

main();

console.log("HelloWorld");
