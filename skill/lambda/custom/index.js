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
 * 応答を組み立てるためのライブラリ
 */
let util = require('util');

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
        YesIntentHandler,
        NoIntentHandler,
        GarbageHandler,
        SessionEndedRequestHandler
    )
    .withSkillId(process.env.APP_ID)
    .addErrorHandlers(ErrorHandler)
    .lambda();

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        const {request} = handlerInput.requestEnvelope;

        return request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(MESSAGE.welcome.base + MESSAGE.welcome.speak)
            .reprompt(MESSAGE.welcome.reprompt)
            .getResponse();
    },
};

const GarbageHandler = {
    canHandle(handlerInput) {
        const {request} = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && request.intent.name === 'GarbageIntent';
    },
    handle(handlerInput) {
        // requestから値を取得
        const name = request.intent.// エラーチェック

            // json or DynamoDBから値を取得

            // return
            const;
        response = util(MESSAGE.action.speak,);
        return handlerInput.responseBuilder
            .speak()
            .getResponse();
    },
};

const HelpHandler = {
    canHandle(handlerInput) {
        const {request} = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(MESSAGE.welcome.base + MESSAGE.welcome.speak)
            .reprompt(MESSAGE.welcome.reprompt)
            .getResponse();
    },
};

const ExitHandler = {
    canHandle(handlerInput) {
        const {request} = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.CancelIntent' || request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(MESSAGE.exit.speak)
            .getResponse();
    },
};

const YesIntentHandler = {
    canHandle(handlerInput) {
        const {request} = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.YesIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        if (sessionAttributes.questions) {
            return handlerInput.responseBuilder.speak(sessionAttributes.speechOutput)
                .reprompt(sessionAttributes.repromptText)
                .getResponse();
        }
        return startGame(false, handlerInput);
    },
};


const NoIntentHandler = {
    canHandle(handlerInput) {
        const {request} = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NoIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechOutput = requestAttributes.t('STOP_MESSAGE');

        return handlerInput.responseBuilder.speak(speechOutput)
            .reprompt(speechOutput)
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
