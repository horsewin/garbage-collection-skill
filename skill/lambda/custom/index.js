'use strict';

/**
 *
 * @type {{AttributesManager: AttributesManager; AttributesManagerFactory: AttributesManagerFactory; PersistenceAdapter: PersistenceAdapter; DefaultRequestDispatcher: DefaultRequestDispatcher; DefaultErrorMapper: DefaultErrorMapper; ErrorHandler: ErrorHandler; ErrorMapper: ErrorMapper; DefaultHandlerAdapter: DefaultHandlerAdapter; DefaultRequestHandlerChain: DefaultRequestHandlerChain; GenericRequestHandlerChain: GenericRequestHandlerChain; HandlerAdapter: HandlerAdapter; HandlerInput: HandlerInput; RequestHandler: RequestHandler; RequestHandlerChain: RequestHandlerChain; RequestInterceptor: RequestInterceptor; ResponseInterceptor: ResponseInterceptor; DefaultRequestMapper: DefaultRequestMapper; RequestMapper: RequestMapper; RequestDispatcher: RequestDispatcher; ImageHelper: ImageHelper; PlainTextContentHelper: PlainTextContentHelper; ResponseBuilder: ResponseBuilder; ResponseFactory: ResponseFactory; RichTextContentHelper: RichTextContentHelper; TextContentHelper: TextContentHelper; DefaultApiClient: DefaultApiClient; BaseSkillBuilder: BaseSkillBuilder; BaseSkillFactory: BaseSkillFactory; CustomSkillBuilder: CustomSkillBuilder; CustomSkillFactory: CustomSkillFactory; Skill: Skill; SkillBuilders: {custom(): CustomSkillBuilder}; SkillConfiguration: SkillConfiguration}}
 */
const Alexa = require('ask-sdk-core');

/**
 * メッセージ文言定義変数
 */
const MESSAGE = require('message');

/**
 *
 * @type {CustomSkillBuilder}
 */
const skillBuilder = Alexa.SkillBuilders.custom();

/**
 * Lambdaハンドラーの定義
 * @type {LambdaHandler}
 */
exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        HelpHandler,
        ExitHandler,
        SessionEndedRequestHandler
    )
    .withSkillId(process.env.APP_ID)
    .addErrorHandlers(ErrorHandler)
    .lambda();

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(MESSAGE.welcome.base + MESSAGE.welcome.speak)
            .reprompt(MESSAGE.welcome.reprompt)
            .getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.error(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak(MESSAGE.error.speak)
            .reprompt(MESSAGE.error.reprompt)
            .getResponse();
    },
};

return new Promise((resolve, reject) => {
    handlerInput.attributesManager.getPersistentAttributes()
        .then((attributes) => {
            attributes['foo'] = 'bar';
            handlerInput.attributesManager.setPersistentAttributes(attributes);

            return handlerInput.attributesManager.savePersistentAttributes();
        })
        .then(() => {
            resolve(handlerInput.responseBuilder.getResponse());
        })
        .catch((error) => {
            reject(error);
        });
});
